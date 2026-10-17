import { getGift } from "@/lib/gifts";
import { giftOgImage } from "@/lib/giftOg";
import { GIFT_ID_RE, cardDate } from "@/lib/giftShared";

// The link preview when a gift is texted (drawn in lib/giftOg.tsx).

export const alt = "A gift of $500 off a new Cloverfield Studio website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = GIFT_ID_RE.test(id) ? await getGift(id) : null;
  return giftOgImage({
    friendName: gift?.friendName ?? "you",
    from: gift ? `${gift.client.firstName}, ${gift.client.business}` : "a friend",
    claimBy: gift ? cardDate(gift.claimBy) : "",
  });
}
