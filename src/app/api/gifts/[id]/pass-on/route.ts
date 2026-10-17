import { NextResponse, after } from "next/server";
import { emailWilliam, getGift, passOn } from "@/lib/gifts";
import { GIFT_ID_RE } from "@/lib/giftShared";

/** A friend whose gift is signed taps "Send a gift": they get a private send
 *  link of their own (made the first time) and the page goes there. William
 *  hears when someone new can send gifts. */

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!GIFT_ID_RE.test(id)) return NextResponse.json({ error: "We couldn't find this gift." }, { status: 404 });

  const result = await passOn(id);
  if (!result) return NextResponse.json({ error: "This gift can't be passed on yet." }, { status: 409 });

  const url = `/g/${result.token}`;
  if (result.created) {
    const origin = new URL(request.url).origin;
    after(async () => {
      const gift = await getGift(id);
      const from = gift ? ` (${gift.client.firstName}'s friend)` : "";
      await emailWilliam({
        subject: `${result.friendName} can send gifts now`,
        text: [
          `${result.friendName}${from} tapped Send a gift on their signed gift, so they're a referral client now.`,
          "Add the site you built for them in Command Center, so their friends see it.",
          "",
          `Their send link: ${origin}${url}`,
        ].join("\n"),
      });
    });
  }
  return NextResponse.json({ url });
}
