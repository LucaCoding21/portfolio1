import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftReveal from "@/components/gift/GiftReveal";
import SendGift from "@/components/gift/SendGift";
import { SAMPLE, SCREENS, sampleDates } from "../screens";

// One screen of the gift flow with sample data, for the frames on the dev
// board (/gift-screens). Development only.

export const metadata: Metadata = {
  title: "Gift screen",
  robots: { index: false, follow: false },
};

export default async function GiftScreen({ params }: { params: Promise<{ screen: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { screen: key } = await params;
  const screen = SCREENS.find((s) => s.key === key);
  if (!screen) notFound();

  const dates = sampleDates();
  const { client } = SAMPLE;
  // No Next dev badge in every frame. Errors still show on the board itself
  // and when a screen is opened on its own.
  const hideDevBadge = <style>{`nextjs-portal { display: none !important; }`}</style>;

  if (screen.kind === "send") {
    return (
      <>
        {hideDevBadge}
        <SendGift
          token="sample"
          firstName={client.firstName}
          business={client.business}
          claimByCard={dates.card}
          hasEmail
          preview={screen.preview ?? {}}
        />
      </>
    );
  }

  if (screen.kind === "gift") {
    const expired = screen.state === "expired";
    return (
      <>
        {hideDevBadge}
        <GiftReveal
          id="sample"
          state={screen.state}
          friendName={SAMPLE.friend}
          client={client}
          claimByCard={expired ? dates.expiredCard : dates.card}
          claimByLong={expired ? dates.expiredLong : dates.long}
          daysLeft={expired ? 0 : dates.daysLeft}
          notified
          preview={screen.preview ?? {}}
        />
      </>
    );
  }

  notFound();
}
