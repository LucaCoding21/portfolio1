import { NextResponse, after } from "next/server";
import { createGift, emailWilliam, getClientByToken, newGiftId } from "@/lib/gifts";
import { CLIENT_TOKEN_RE, NOTE_MAX, cardDate, friendNameError, longDate } from "@/lib/giftShared";

/** A client sends a gift from their private page (/g/<token>). */

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = str(body?.token);
  const client = CLIENT_TOKEN_RE.test(token) ? await getClientByToken(token) : null;
  if (!client) return NextResponse.json({ error: "This link isn't valid anymore." }, { status: 404 });

  const friendName = str(body?.friendName).replace(/\s+/g, " ").trim();
  const nameError = friendNameError(friendName);
  if (nameError) return NextResponse.json({ errors: { friendName: nameError } }, { status: 400 });
  const note = str(body?.note).trim().slice(0, NOTE_MAX);

  let id = newGiftId();
  let claimBy: Date;
  try {
    ({ claimBy } = await createGift({ id, clientId: client.id, friendName, note }));
  } catch (e) {
    if ((e as { code?: number }).code !== 6) throw e; // 6 is ALREADY_EXISTS: astronomically rare, try once more
    id = newGiftId();
    ({ claimBy } = await createGift({ id, clientId: client.id, friendName, note }));
  }

  const url = `${new URL(request.url).origin}/gift/${id}`;
  after(() =>
    emailWilliam({
      subject: `${client.firstName} sent a gift to ${friendName}`,
      text: [
        `${client.firstName} (${client.business}) sent a $500 gift to ${friendName}.`,
        "",
        note ? `Their note: "${note}"` : "They didn't add a note.",
        "",
        `Gift link: ${url}`,
        `${friendName} has until ${longDate(claimBy)} to claim it. You'll get another email if they do.`,
      ].join("\n"),
    }),
  );

  // The saved date, not the one the page worked out when it loaded: a page
  // left open past midnight would be a day out.
  return NextResponse.json({ id, url, claimByCard: cardDate(claimBy), claimByLong: longDate(claimBy) });
}
