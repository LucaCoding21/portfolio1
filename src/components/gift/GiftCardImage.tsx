import { GIFT_AMOUNT } from "@/lib/giftShared";
import {
  CARD_BASE,
  CARD_COLUMN_GAP,
  CARD_DATE_LABEL,
  CARD_GAP,
  CARD_H,
  CARD_INK,
  CARD_INK_SOFT,
  CARD_LOGO_BAND,
  CARD_OFFER,
  CARD_PAD,
  CARD_RADIUS,
  CARD_TYPE,
  CARD_W,
  type CardType,
} from "@/components/gift/cardLayout";

/**
 * The gift card for next/og (satori), at any pixel width: same artwork and
 * layout as GiftCard, which this mirrors for the link preview. Satori wants
 * px, letter-spacing in px and an explicit display on every box.
 */
export default function GiftCardImage({
  width,
  art,
  friendName,
  from,
  claimBy,
}: {
  width: number;
  /** the blank artwork as a data URI */
  art: string;
  friendName: string;
  from: string;
  claimBy: string;
}) {
  const k = width / CARD_BASE;
  const height = Math.round((CARD_H / CARD_W) * width);
  const px = (n: number) => n * k;
  const type = (t: CardType) => ({
    display: "flex",
    fontSize: px(t.size),
    fontWeight: t.weight,
    lineHeight: t.lineHeight / t.size,
    color: t.soft ? CARD_INK_SOFT : CARD_INK,
    ...(t.tracking ? { letterSpacing: px(t.tracking * t.size) } : {}),
  });
  const clip = { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } as const;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width,
        height,
        overflow: "hidden",
        borderRadius: px(CARD_RADIUS),
        background: "#fbfcef",
        color: CARD_INK,
        fontFamily: "Outfit",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art} width={width} height={height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${px(CARD_PAD.y)}px ${px(CARD_PAD.x)}px`,
        }}
      >
        <div style={{ display: "flex", height: px(CARD_LOGO_BAND) }} />
        <div style={{ display: "flex", flexDirection: "column", gap: px(CARD_GAP) }}>
          <div style={type(CARD_TYPE.amount)}>{`$${GIFT_AMOUNT}`}</div>
          <div style={type(CARD_TYPE.offer)}>{CARD_OFFER}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: px(CARD_COLUMN_GAP),
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: px(CARD_GAP), minWidth: 0, flexShrink: 1 }}>
            <div style={{ ...type(CARD_TYPE.forName), ...clip }}>{`For ${friendName}`}</div>
            <div style={{ ...type(CARD_TYPE.from), ...clip }}>{`From ${from}`}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: px(CARD_GAP), flexShrink: 0 }}>
            <div style={type(CARD_TYPE.dateLabel)}>{CARD_DATE_LABEL}</div>
            <div style={type(CARD_TYPE.date)}>{claimBy}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
