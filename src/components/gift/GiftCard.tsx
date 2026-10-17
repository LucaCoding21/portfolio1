"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { GIFT_AMOUNT } from "@/lib/giftShared";
import {
  CARD_BASE,
  CARD_COLUMN_GAP,
  CARD_DATE_LABEL,
  CARD_EXPIRED_LABEL,
  CARD_GAP,
  CARD_LOGO_BAND,
  CARD_OFFER,
  CARD_PAD,
  CARD_PILL,
  CARD_TYPE,
  cardTypeStyle,
} from "@/components/gift/cardLayout";
import s from "./GiftCard.module.css";

/**
 * The gift: the blank Cloverfield card (public/gift/card-front.webp) with the
 * gift's details set on it in Outfit, as the designer's redesign lays them
 * out (see cardLayout.ts). Type is in cqw off the card's width, so it scales
 * as one object. `sheen` plays the light sweep once. `status` follows the
 * gift: open shows the claim-by date, claimed and redeemed a green pill in
 * its place, and expired the date it lapsed, in grey.
 *
 * A click or tap flips it over to the green back (card-back.webp) and the
 * next one flips it back, always the same way round (see flip() for the
 * motion). With reduced motion it swaps sides at once. `startFlipped` opens
 * it back up, for the dev screens board (/gift-screens).
 */

// The card fills the page column: the screen less 40px of margin, 400px at most.
const CARD_SIZES = "(max-width: 480px) calc(100vw - 40px), 400px";

// design px to cqw (the design's card is 350 px wide)
const cq = (px: number) => `${((px * 100) / CARD_BASE).toFixed(4)}cqw`;
const type = (key: keyof typeof CARD_TYPE) => cardTypeStyle(CARD_TYPE[key], cq);

export type CardStatus = "open" | "claimed" | "redeemed" | "expired";

export default function GiftCard({
  friendName,
  from,
  claimBy,
  sheen = false,
  status = "open",
  priority = false,
  deferBack = false,
  startFlipped = false,
}: {
  friendName: string;
  /** "Dave, Northline Roofing" */
  from: string;
  /** "Feb 13, 2026" */
  claimBy: string;
  sheen?: boolean;
  status?: CardStatus;
  priority?: boolean;
  /** Hold off the back's image: inside the envelope it can't be seen yet, so
   *  it shouldn't compete with the envelope's own photos. */
  deferBack?: boolean;
  startFlipped?: boolean;
}) {
  const turnRef = useRef<HTMLSpanElement>(null);
  const flipRef = useRef<gsap.core.Timeline | null>(null);
  const halfTurns = useRef(startFlipped ? 1 : 0);
  const [backUp, setBackUp] = useState(startFlipped);

  useEffect(() => () => void flipRef.current?.kill(), []);

  useLayoutEffect(() => {
    if (startFlipped) gsap.set(turnRef.current, { rotateY: 180 });
  }, [startFlipped]);

  // A flick, not a rotation: a short wind-up the other way, then thrown
  // through fast (back.out starts at ~4x linear speed and is 90% there a
  // third of the way in), carrying about 10 degrees past before it settles.
  // It lifts and tips toward you while in the air. A tap mid-flip throws it
  // on from wherever it is, without another wind-up.
  function flip() {
    halfTurns.current += 1;
    setBackUp(halfTurns.current % 2 === 1);
    const turn = turnRef.current;
    const target = halfTurns.current * 180;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(turn, { rotateY: target });
      return;
    }
    const midFlip = flipRef.current?.isActive();
    flipRef.current?.kill();
    const tl = gsap.timeline();
    if (!midFlip) {
      tl.to(turn, { rotateY: target - 180 - 14, scale: 0.97, duration: 0.14, ease: "power2.out" });
    }
    tl.addLabel("throw")
      .to(turn, { rotateY: target, duration: 0.9, ease: "back.out(1.2)" }, "throw")
      .to(turn, { scale: 1.06, rotateX: -8, duration: 0.24, ease: "power2.out" }, "throw")
      .to(turn, { scale: 1, rotateX: 0, duration: 0.6, ease: "power3.out" }, "throw+=0.24");
    flipRef.current = tl;
  }

  const faceMod = status === "expired" ? s.muted : "";
  const pill = status === "claimed" ? "Claimed" : status === "redeemed" ? "Redeemed" : null;

  // Screen readers get the card as one sentence, then what pressing it does.
  // The printed lines are hidden from them: read out one by one they'd run
  // together ("$500off a new websiteFor Mike").
  const spoken = [
    `$${GIFT_AMOUNT} off a new website, for ${friendName}, from ${from}.`,
    pill ? `${pill}.` : status === "expired" ? `Expired ${claimBy}.` : `Claim by ${claimBy}.`,
    backUp ? "Turn the card back over." : "Turn the card over.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={s.flip} onClick={flip}>
      <span className={s.srOnly}>{spoken}</span>
      <span ref={turnRef} className={s.turn}>
        <span className={`${s.card} ${sheen ? s.sheen : ""} ${faceMod}`} aria-hidden="true">
          <Image
            src="/gift/card-front.webp"
            alt=""
            fill
            sizes={CARD_SIZES}
            className={s.art}
            priority={priority}
          />
          <span className={s.face} style={{ padding: `${cq(CARD_PAD.y)} ${cq(CARD_PAD.x)}` }}>
            <span style={{ height: cq(CARD_LOGO_BAND) }} />
            <span className={s.block} style={{ gap: cq(CARD_GAP) }}>
              <span style={type("amount")}>${GIFT_AMOUNT}</span>
              <span style={type("offer")}>{CARD_OFFER}</span>
            </span>
            <span className={s.foot} style={{ gap: cq(CARD_COLUMN_GAP) }}>
              <span className={s.who} style={{ gap: cq(CARD_GAP) }}>
                <span className={s.clip} style={type("forName")}>
                  For {friendName}
                </span>
                <span className={s.clip} style={type("from")}>
                  From {from}
                </span>
              </span>
              {pill ? (
                <span
                  className={s.pill}
                  style={{
                    height: cq(CARD_PILL.height),
                    padding: `0 ${cq(CARD_PILL.padX)}`,
                    gap: cq(CARD_PILL.gap),
                    fontSize: cq(CARD_PILL.size),
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    style={{ width: cq(CARD_PILL.icon), height: cq(CARD_PILL.icon) }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  {pill}
                </span>
              ) : (
                <span className={s.when} style={{ gap: cq(CARD_GAP) }}>
                  <span style={type("dateLabel")}>{status === "expired" ? CARD_EXPIRED_LABEL : CARD_DATE_LABEL}</span>
                  <span style={type("date")}>{claimBy}</span>
                </span>
              )}
            </span>
          </span>
        </span>
        <span className={`${s.back} ${faceMod}`} aria-hidden="true">
          {!deferBack && <Image src="/gift/card-back.webp" alt="" fill sizes={CARD_SIZES} className={s.art} />}
        </span>
      </span>
    </button>
  );
}
