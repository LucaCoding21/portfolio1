import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SendGift from "@/components/gift/SendGift";
import { getClientByToken } from "@/lib/gifts";
import { CLIENT_TOKEN_RE, cardDate, claimByFor } from "@/lib/giftShared";

// A client's private link for sending referral gifts. Clients are added in
// Command Center, which hands out this link.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Send a gift · Cloverfield Studio",
  robots: { index: false, follow: false },
};

export default async function SendGiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const client = CLIENT_TOKEN_RE.test(token) ? await getClientByToken(token) : null;
  if (!client) notFound();

  const claimBy = claimByFor(new Date());
  return (
    <SendGift
      token={token}
      firstName={client.firstName}
      business={client.business}
      claimByCard={cardDate(claimBy)}
      hasEmail={!!client.email}
    />
  );
}
