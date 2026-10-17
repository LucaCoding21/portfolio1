import { NextResponse, after } from "next/server";
import { claimGift, emailClient, emailWilliam, getGift } from "@/lib/gifts";
import { GIFT_ID_RE, claimErrors } from "@/lib/giftShared";

/** The friend claims their gift. William hears about it right away, and so
 *  does the client who sent it, if Command Center has their email. With
 *  `fix`, a friend who just claimed corrects their details (the claimed
 *  screen's "Fix it"); only William hears about that. */

const field = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!GIFT_ID_RE.test(id)) return NextResponse.json({ error: "We couldn't find this gift." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const friend = {
    name: field(body?.name, 60),
    business: field(body?.business, 100),
    phone: field(body?.phone, 40),
    email: field(body?.email, 200),
  };
  const errors = claimErrors(friend);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  const result = await claimGift(id, friend, { fix: body?.fix === true });
  if (result === "missing") return NextResponse.json({ error: "We couldn't find this gift." }, { status: 404 });
  if (result === "claimed") return NextResponse.json({ error: "This gift was already claimed." }, { status: 409 });
  if (result === "expired") return NextResponse.json({ error: "This gift has expired." }, { status: 410 });

  const gift = await getGift(id);
  const link = `${new URL(request.url).origin}/gift/${id}`;
  const from = gift ? `${gift.client.firstName} (${gift.client.business})` : "a client";
  // The name on the card, which is the one the client knows them by.
  const cardName = gift?.friendName ?? friend.name;
  if (result === "fixed") {
    after(() =>
      emailWilliam({
        subject: `${cardName} fixed their details`,
        replyTo: friend.email || undefined,
        text: [
          `${friend.name} corrected what they gave when claiming the gift from ${from}. Use these:`,
          "",
          `Name: ${friend.name}`,
          `Business: ${friend.business}`,
          `Phone: ${friend.phone}`,
          `Email: ${friend.email || "(not given)"}`,
          "",
          `Gift link: ${link}`,
        ].join("\n"),
      }),
    );
    return NextResponse.json({ ok: true });
  }
  after(() =>
    emailWilliam({
      subject: `${cardName} claimed their gift from ${gift?.client.firstName ?? "a client"}`,
      replyTo: friend.email || undefined,
      text: [
        `${friend.name} claimed the $500 gift from ${from}.`,
        "",
        `Name: ${friend.name}`,
        `Business: ${friend.business}`,
        `Phone: ${friend.phone}`,
        `Email: ${friend.email || "(not given)"}`,
        "",
        `Gift link: ${link}`,
      ].join("\n"),
    }),
  );
  if (gift) {
    after(() =>
      emailClient(gift.client, {
        subject: `${cardName} claimed your gift`,
        lines: [
          `${cardName} just claimed the $500 gift you sent. Thank you for passing our name along.`,
          "",
          `I'll be in touch with ${cardName} within a day. If they sign for a new site, you get $500 off your hosting, SEO or future upgrades, and I'll let you know when that happens.`,
        ],
      }),
    );
  }

  return NextResponse.json({ ok: true });
}
