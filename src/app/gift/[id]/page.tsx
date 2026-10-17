import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftReveal, { type GiftState } from "@/components/gift/GiftReveal";
import { getGift } from "@/lib/gifts";
import { GIFT_ID_RE, cardDate, daysLeft, longDate } from "@/lib/giftShared";

// The friend's gift. The link preview in a text is the card itself
// (opengraph-image.tsx next to this file).

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const load = (id: string) => (GIFT_ID_RE.test(id) ? getGift(id) : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gift = await load((await params).id);
  const robots = { index: false, follow: false };
  if (!gift) return { title: "Cloverfield Studio", robots };
  const title = `${gift.friendName}, ${gift.client.firstName} sent you $500 off a new website`;
  const description = `Open your gift from ${gift.client.firstName}.`;
  return {
    title,
    description,
    robots,
    openGraph: { title, description, siteName: "Cloverfield Studio", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GiftPage({ params }: Props) {
  const gift = await load((await params).id);
  if (!gift) notFound();

  const state: GiftState = gift.expired ? "expired" : gift.status === "sent" ? "sealed" : gift.status;
  const site = gift.client.siteUrl;
  return (
    <GiftReveal
      id={gift.id}
      state={state}
      friendName={gift.friendName}
      client={{
        firstName: gift.client.firstName,
        business: gift.client.business,
        siteUrl: site && !/^https?:\/\//i.test(site) ? `https://${site}` : site,
      }}
      claimByCard={cardDate(gift.claimBy)}
      claimByLong={longDate(gift.claimBy)}
      daysLeft={daysLeft(gift.claimBy)}
      notified={!!gift.client.email}
    />
  );
}
