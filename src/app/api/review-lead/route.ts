import { Resend } from "resend";
import { NextResponse, after } from "next/server";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, looksLikeAPhone } from "@/lib/reviewLead";

/**
 * The free website review ("See what we'd fix") emails us twice:
 *
 *   step "site"     the visitor typed their site. We hear about it right
 *                   away, so a lead who stops before giving an email is not
 *                   lost (the site usually lists a way to reach them).
 *   step "contact"  they told us where to send the review (name, email and
 *                   phone). Reply-to is set to them, so replying to this
 *                   email sends the review. William's phone also buzzes, so a
 *                   lead can be answered within minutes.
 */

/**
 * Buzzes William's phone through ntfy (the ntfy app, subscribed to the topic
 * in NTFY_TOPIC). No account or keys: the topic name is the password, so keep
 * it long and out of the repo. Quiet when unset, and a failed alert never
 * fails the lead, since the email is the record. Tapping the alert opens a
 * text to the lead.
 */
async function alertWilliam(lead: { name: string; email: string; phone: string; website: string }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const digits = lead.phone.replace(/\D/g, "");
  const dial = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  try {
    const res = await fetch("https://ntfy.sh/", {
      method: "POST",
      body: JSON.stringify({
        topic,
        title: `Review lead: ${lead.name || lead.website}`,
        message: `${lead.website}\n${lead.phone} · ${lead.email}`,
        priority: 4,
        tags: ["four_leaf_clover"],
        click: `sms:${dial}`,
        actions: [
          { action: "view", label: "Call", url: `tel:${dial}` },
          { action: "view", label: "Email", url: `mailto:${lead.email}` },
        ],
      }),
    });
    if (!res.ok) console.error("review-lead: alert not sent:", res.status, await res.text());
  } catch (err) {
    console.error("review-lead: alert not sent:", err);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Honeypot: a hidden field people never see, so anything in it is a bot.
  if (body?.company) return NextResponse.json({ ok: true });

  const website = typeof body?.website === "string" ? body.website.trim().slice(0, 200) : "";
  if (!LOOKS_LIKE_A_SITE.test(website)) {
    return NextResponse.json({ error: "That doesn't look like a website." }, { status: 400 });
  }

  const contact = body?.step === "contact";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  if (contact && !LOOKS_LIKE_AN_EMAIL.test(email)) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }
  if (contact && !looksLikeAPhone(phone)) {
    return NextResponse.json({ error: "That doesn't look like a phone number." }, { status: 400 });
  }

  const where =
    ({ hero: "homepage hero", team: "homepage team section", closing: "homepage closing video", work: "/work page", "case-caddie": "Caddie Companion case study" } as Record<string, string>)[
      body?.source
    ] ?? "homepage";

  if (contact) {
    after(() => alertWilliam({ name, email, phone, website }));
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("review-lead: RESEND_API_KEY is not set, lead not emailed:", website, email);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const { error } = await new Resend(key).emails.send({
    from: "Cloverfield Studio <cloverfield@cloverfield.studio>",
    to: ["william@cloverfield.studio"],
    ...(contact
      ? {
          replyTo: email,
          subject: `Send a review: ${website} for ${name || email}`,
          text: [
            `${name || "Someone"} asked for a free review of ${website} from the "See what we'd fix" field (${where}).`,
            "",
            `Name: ${name || "(not given)"}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Website: ${website}`,
            "",
            "They asked for the written review rather than a call. Reply to this email to send it to them.",
            "They left a number, so a quick text when it's sent is fair game.",
          ].join("\n"),
        }
      : {
          subject: `Website review started: ${website}`,
          text: [
            `Someone typed ${website} into the "See what we'd fix" field (${where}).`,
            "",
            "They were then asked where to send the review. If a second email with their name and email doesn't follow, they stopped there, and the contact details on their site may be the way to reach them.",
          ].join("\n"),
        }),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, emailed: true });
}
