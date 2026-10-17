import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import GiftCardImage from "@/components/gift/GiftCardImage";
import { CARD_BASE, CARD_RADIUS } from "@/components/gift/cardLayout";

/**
 * The link preview when a gift is texted: the card itself, with the friend's
 * name, on Sight's neutral ground. Used by /gift/<id>/opengraph-image and the
 * dev screens board. The renderer can't read woff2 or webp, so Outfit and a
 * JPEG of the card artwork live in assets/gift-og.
 */

const asset = (name: string) => readFile(join(process.cwd(), "assets/gift-og", name));

const CARD_WIDTH = 756; // 540 tall, centred with room for the shadow

export async function giftOgImage(card: { friendName: string; from: string; claimBy: string }) {
  const [regular, semibold, extrabold, art] = await Promise.all([
    asset("outfit-400.woff"),
    asset("outfit-600.woff"),
    asset("outfit-800.woff"),
    asset("card-front.jpg"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          borderRadius: (CARD_WIDTH / CARD_BASE) * CARD_RADIUS,
          boxShadow: "0 2px 4px rgba(20,22,18,0.08), 0 28px 60px rgba(20,22,18,0.18)",
        }}
      >
        <GiftCardImage width={CARD_WIDTH} art={`data:image/jpeg;base64,${art.toString("base64")}`} {...card} />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Outfit", data: regular, weight: 400, style: "normal" },
        { name: "Outfit", data: semibold, weight: 600, style: "normal" },
        { name: "Outfit", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
