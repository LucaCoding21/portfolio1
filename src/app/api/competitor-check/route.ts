import { Resend } from "resend";
import { NextResponse, after } from "next/server";
import { CHECK_COMPETITOR, CHECK_WANTS } from "@/data/competitorCheck";
import { alertWilliam } from "@/lib/alertWilliam";
import { LOOKS_LIKE_AN_EMAIL, looksLikeAPhone } from "@/lib/reviewLead";

/**
 * The free competitor check on the monthly SEO page (/seo) sends everything
 * once the visitor reaches the last step: whether they have a competitor in
 * mind (and its name if they gave one), what they want more of, their
 * business name, and how to reach them. William finds what the business does
 * and where from its name. One email to William,
 * reply-to set to the lead, and a buzz on his phone. Nothing goes to Meta:
 * the ads run to the free homepage sample.
 */

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Honeypot: a hidden field people never see, so anything in it is a bot.
  if (body?.company) return NextResponse.json({ ok: true });

  const answer = CHECK_COMPETITOR.find((o) => o.value === body?.competitor);
  const want = (CHECK_WANTS as readonly string[]).includes(body?.want) ? (body.want as string) : "";
  const business = text(body?.business, 120);
  const rival = answer?.value === "yes" ? text(body?.rival, 120) : "";
  const name = text(body?.name, 100);
  const email = text(body?.email, 200);
  const phone = text(body?.phone, 40);

  if (!business) return NextResponse.json({ error: "We need the business name." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "We need a name." }, { status: 400 });
  if (!LOOKS_LIKE_AN_EMAIL.test(email)) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }
  if (!looksLikeAPhone(phone)) {
    return NextResponse.json({ error: "That doesn't look like a phone number." }, { status: 400 });
  }

  // What they said about a competitor, as William reads it.
  const competitorLine = rival
    ? `Has one in mind: ${rival}`
    : answer?.value === "yes"
      ? "Has one in mind, but didn't give the name"
      : answer?.value === "not_sure"
        ? "Not sure, wants us to find them"
        : "(not answered)";

  after(() =>
    alertWilliam({
      title: `Competitor check lead: ${business}`,
      message: `${want || "want not given"}${rival ? ` · vs ${rival}` : answer?.value === "not_sure" ? " · find their competitors" : ""}\n${name} · ${phone} · ${email}`,
      phone,
      email,
    })
  );

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("competitor-check: RESEND_API_KEY is not set, lead not emailed:", business, email);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const { error } = await new Resend(key).emails.send({
    from: "Cloverfield Studio <cloverfield@cloverfield.studio>",
    to: ["william@cloverfield.studio"],
    replyTo: email,
    subject: `Free competitor check: ${business}`,
    text: [
      `${name} asked for a free competitor check.`,
      "",
      `Business: ${business}`,
      `Competitor: ${competitorLine}`,
      `Wants more: ${want || "(not given)"}`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      "The check: look the business up, then the top 3 businesses for its main job in its area on Google (and who ChatGPT suggests), what they have that it doesn't, and whether it can catch them. For \"Jobs in a new area\", ask which area.",
      "",
      "Reply to this email to reach them, or text the number above.",
    ].join("\n"),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, emailed: true });
}
