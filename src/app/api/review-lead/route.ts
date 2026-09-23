import { Resend } from "resend";
import { NextResponse } from "next/server";

/**
 * Someone typed their site into "See what we'd fix". We hear about it right
 * away, so a lead who opens Cal and never books is not lost.
 */

const LOOKS_LIKE_A_SITE = /^(https?:\/\/)?[^\s./]+(\.[^\s./]+)+(\/\S*)?$/i;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Honeypot: a hidden field people never see, so anything in it is a bot.
  if (body?.company) return NextResponse.json({ ok: true });

  const website = typeof body?.website === "string" ? body.website.trim().slice(0, 200) : "";
  if (!LOOKS_LIKE_A_SITE.test(website)) {
    return NextResponse.json({ error: "That doesn't look like a website." }, { status: 400 });
  }

  const where =
    ({ team: "homepage team section", closing: "homepage closing video", work: "/work page" } as Record<string, string>)[
      body?.source
    ] ?? "homepage";

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("review-lead: RESEND_API_KEY is not set, lead not emailed:", website);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const { error } = await new Resend(key).emails.send({
    from: "Cloverfield Studio <cloverfield@cloverfield.studio>",
    to: ["william@cloverfield.studio"],
    subject: `Website review request: ${website}`,
    text: [
      `Someone asked for a free review of ${website} from the "See what we'd fix" field (${where}).`,
      "",
      "Their booking page opened in a new tab. If no booking comes through on Cal, they didn't finish, so this may be worth a follow-up.",
    ].join("\n"),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, emailed: true });
}
