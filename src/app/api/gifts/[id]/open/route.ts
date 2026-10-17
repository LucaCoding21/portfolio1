import { NextResponse } from "next/server";
import { markOpened } from "@/lib/gifts";
import { GIFT_ID_RE } from "@/lib/giftShared";

/** The friend tapped the envelope. Recorded once, so Command Center can tell
 *  a gift nobody opened from one that was opened and not claimed. A tap, not
 *  a page view: link previews in Messages load the page too. */

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!GIFT_ID_RE.test(id)) return NextResponse.json({ error: "We couldn't find this gift." }, { status: 404 });
  await markOpened(id);
  return NextResponse.json({ ok: true });
}
