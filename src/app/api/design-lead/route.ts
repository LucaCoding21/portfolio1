import { Resend } from "resend";
import { NextResponse, after } from "next/server";
import { BUSINESS_TYPES, OTHER_TYPE } from "@/data/freeDesign";
import { alertWilliam } from "@/lib/alertWilliam";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, bare, looksLikeAPhone } from "@/lib/reviewLead";

/**
 * The free home page design quiz (/free-homepage-design) sends everything in
 * one go once the visitor reaches the last step: whether they have a site,
 * what kind of business it is, and how to reach them (phone optional). One
 * email to William, reply-to set to the lead, and a buzz on his phone.
 */

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Honeypot: a hidden field people never see, so anything in it is a bot.
  if (body?.company) return NextResponse.json({ ok: true });

  const hasSite = body?.hasSite === true;
  const type = (BUSINESS_TYPES as readonly string[]).includes(body?.type) ? (body.type as string) : "";
  const typeOther = type === OTHER_TYPE ? text(body?.typeOther, 100) : "";
  const website = hasSite ? text(body?.website, 200) : "";
  const name = text(body?.name, 100);
  const phone = text(body?.phone, 40);
  const email = text(body?.email, 200);
  const business = text(body?.business, 120);
  const notes = text(body?.notes, 1000);

  if (hasSite && !LOOKS_LIKE_A_SITE.test(website)) {
    return NextResponse.json({ error: "That doesn't look like a website." }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "We need a name." }, { status: 400 });
  if (phone && !looksLikeAPhone(phone)) {
    return NextResponse.json({ error: "That doesn't look like a phone number." }, { status: 400 });
  }
  if (!LOOKS_LIKE_AN_EMAIL.test(email)) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }

  const what = typeOther ? `${OTHER_TYPE}: ${typeOther}` : type || "(not given)";
  const who = business || (website ? bare(website) : name);

  after(() =>
    alertWilliam({
      title: `Free design lead: ${who}`,
      message: `${what} · ${website ? bare(website) : "no site yet"}\n${name} · ${phone || "no phone"} · ${email}`,
      phone,
      email,
    })
  );

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("design-lead: RESEND_API_KEY is not set, lead not emailed:", who, email);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const { error } = await new Resend(key).emails.send({
    from: "Cloverfield Studio <cloverfield@cloverfield.studio>",
    to: ["william@cloverfield.studio"],
    replyTo: email,
    subject: `Free home page design: ${who}`,
    text: [
      `${name} asked for a free home page design.`,
      "",
      `Has a website: ${hasSite ? "Yes" : "Not yet"}`,
      ...(hasSite ? [`Website: ${website}`] : []),
      `Business: ${what}`,
      ...(business ? [`Business name: ${business}`] : []),
      "",
      `Name: ${name}`,
      `Phone: ${phone || "(not given)"}`,
      `Email: ${email}`,
      ...(notes ? ["", "Anything we should know:", notes] : []),
      "",
      phone ? "Reply to this email to reach them, or text the number above." : "Reply to this email to reach them.",
    ].join("\n"),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, emailed: true });
}
