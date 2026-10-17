import { NextResponse } from "next/server";
import { emailClient, takeNewlyExpired } from "@/lib/gifts";
import { longDate } from "@/lib/giftShared";

/**
 * Daily, from Vercel Cron (vercel.json): tells each client whose gift ran
 * out unclaimed, with their link to send a new one. Vercel sends
 * CRON_SECRET as a bearer token; without it set, nothing runs outside dev.
 */

const SITE = "https://cloverfield.studio";

export async function GET(request: Request) {
  const dev = process.env.NODE_ENV === "development";
  const secret = process.env.CRON_SECRET;
  if (!dev && (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = dev ? new URL(request.url).origin : SITE;
  const expired = await takeNewlyExpired();
  await Promise.all(
    expired.map((g) =>
      emailClient(g.client, {
        subject: `Your gift to ${g.friendName} expired`,
        lines: [
          `The $500 gift you sent ${g.friendName} on ${longDate(g.createdAt)} wasn't claimed by ${longDate(g.claimBy)}, so it has expired.`,
          "",
          `If ${g.friendName} is still interested, you can send them a new one from your gift page. It only takes a minute.`,
          `${origin}/g/${g.client.token}`,
        ],
      }),
    ),
  );

  return NextResponse.json({ expired: expired.length, emailed: expired.filter((g) => g.client.email).length });
}
