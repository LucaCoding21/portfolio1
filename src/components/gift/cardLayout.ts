import type { CSSProperties } from "react";

/**
 * The type on the gift card, from the designer's "Cloverfield Gift Screen"
 * redesign (October 2026), set on William's blank artwork
 * (public/gift/card-front.webp, 2100 x 1500), which carries the logo, the
 * paper and the clover. Every number is in px on the design's 350 px card.
 * GiftCard turns them into cqw and the link preview (GiftCardImage) into px
 * at its own width, so the page and the preview can't drift apart.
 * Command Center's components/referrals/referral-card.tsx keeps a copy.
 *
 * The face is a column spread apart with space-between: a clear band where
 * the artwork's logo sits, the amount block, then who it's for and the
 * claim-by date. The client's note isn't printed on the card: it goes in
 * the text or email they send with the link.
 */

export const CARD_BASE = 350;
export const CARD_W = 2100;
export const CARD_H = 1500;
export const CARD_RADIUS = 16;
export const CARD_INK = "#22231F";
export const CARD_INK_SOFT = "#4A4C42";

export const CARD_PAD = { y: 20, x: 22 };
/** The band at the top that the artwork's logo sits in. */
export const CARD_LOGO_BAND = 18;
/** Between the lines of a block. */
export const CARD_GAP = 2;
/** Between who it's for and the date. */
export const CARD_COLUMN_GAP = 12;

export const CARD_OFFER = "off a new website";
export const CARD_DATE_LABEL = "Claim by";
export const CARD_EXPIRED_LABEL = "Expired";

/** Where the date goes once it's claimed ("Claimed") or signed ("Redeemed"). */
export const CARD_PILL = { height: 28, padX: 12, gap: 6, size: 13, icon: 14 };

export interface CardType {
  size: number;
  weight: 400 | 600 | 800;
  lineHeight: number;
  /** letter-spacing, in em */
  tracking?: number;
  /** the softer ink, for the supporting lines */
  soft?: boolean;
}

export const CARD_TYPE = {
  amount: { size: 64, weight: 800, lineHeight: 60.8, tracking: -0.03 },
  offer: { size: 17, weight: 600, lineHeight: 22 },
  forName: { size: 15, weight: 600, lineHeight: 18 },
  from: { size: 12, weight: 400, lineHeight: 16, soft: true },
  dateLabel: { size: 12, weight: 400, lineHeight: 16, soft: true },
  date: { size: 13, weight: 600, lineHeight: 16 },
} satisfies Record<string, CardType>;

/** A line's type as CSS, scaled by `unit` (a function from design px to a CSS length). */
export function cardTypeStyle(t: CardType, unit: (px: number) => string): CSSProperties {
  return {
    fontSize: unit(t.size),
    fontWeight: t.weight,
    lineHeight: t.lineHeight / t.size,
    ...(t.tracking ? { letterSpacing: `${t.tracking}em` } : {}),
    ...(t.soft ? { color: CARD_INK_SOFT } : {}),
  };
}
