import { notFound } from "next/navigation";
import { giftOgImage } from "@/lib/giftOg";
import { SAMPLE, sampleDates } from "../screens";

// The link preview for the sample gift on the dev board. Development only.

export async function GET() {
  if (process.env.NODE_ENV !== "development") notFound();
  return giftOgImage({
    friendName: SAMPLE.friend,
    from: `${SAMPLE.client.firstName}, ${SAMPLE.client.business}`,
    claimBy: sampleDates().card,
  });
}
