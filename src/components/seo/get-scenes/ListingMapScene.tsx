"use client";

/**
 * "Your Google listing" (the six things we work on, /seo): a pin on a map.
 * The whole slot is a pale map drawn in CSS (warm grey ground, white roads,
 * a park, a bit of water, grey dots for other places). The business's red pin
 * drops in with a small bounce, a ripple spreads from its tip, and a place
 * card slides up from the foot like a phone map's bottom sheet: "Your
 * business", 4.9 stars from 47 reviews, "Deck builder · Open now", then Call
 * and Directions. A pointer comes in and presses Call. No window and no brand
 * marks; the pointer has no label. Drawn in x.ai/bot's light feature-card
 * style (their pop-ins, a few real words), played on StageKit's timings
 * (Nov 23 2026).
 */
import { useRef } from "react";
import { StageCursor, script, ticks, useScript, useTargetPoint } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ListingMapScene.module.css";

/* ---------- small glyphs (Lucide shapes, and a plain star) ---------- */

const Star = () => (
  <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden>
    <path d="m6 .9 1.53 3.13 3.45.5-2.5 2.43.6 3.43L6 8.77 2.92 10.4l.6-3.43-2.5-2.43 3.45-.5z" fill="currentColor" />
  </svg>
);

const Phone = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
    <path d="M3 11 22 2l-9 19-2-8z" />
  </svg>
);

/** A classic map pin: a red drop with a white dot, its tip at the foot. */
const Pin = () => (
  <svg viewBox="0 0 26 34" className={c.pinGlyph} aria-hidden>
    <path
      d="M13 33.4C9.6 27.6 2.4 20.4 2.4 12.6a10.6 10.6 0 0 1 21.2 0c0 7.8-7.2 15-10.6 20.8z"
      fill="#e8453c"
      stroke="#c9372f"
      strokeWidth="0.8"
    />
    <circle cx="13" cy="12.6" r="4.1" fill="#fff" />
  </svg>
);

// other places on the map, in % of the map above the sheet, kept clear of
// the pin (middle) and of where the pointer comes in (right); the last two
// sit where the sheet comes up, so the map is whole before it
const DOTS: [number, number][] = [
  [38, 36],
  [11, 54],
  [64, 22],
  [88, 64],
  [18, 128],
  [56, 124],
];

type St = {
  pin: boolean;
  ripple: boolean;
  sheet: boolean;
  lines: number;
  cursor: boolean;
  at: string | null;
  press: boolean;
};

const LISTING_MAP = script<St>(
  { pin: false, ripple: false, sheet: false, lines: 0, cursor: false, at: null, press: false },
  [
    // the map sits still for a beat, then the pin drops (it lands about 290ms in)
    [600, { pin: true }],
    [890, { ripple: true }],
    // the place card slides up, and its lines pop in one after another
    [1700, { sheet: true }],
    ...ticks<St>(2050, 4, 150, "lines"),
    // the pointer comes in and presses Call
    [3300, { cursor: true }],
    [3600, { at: "call" }],
    [4300, { press: true }],
    [4420, { press: false }],
    // it fades away well before the loop's fade, so it never shows on the
    // reset, and the finished card holds on its own
    [6400, { cursor: false }],
  ],
  8400,
  2500,
);

export default function ListingMapScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(LISTING_MAP, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.lines);
  return (
    <div ref={root} className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.view}>
        <div className={c.map}>
          <i className={c.water} />
          <i className={c.park} />
          <i className={c.road} data-r="a" />
          <i className={c.road} data-r="b" />
          <i className={c.road} data-r="c" />
          <i className={c.road} data-r="d" />
          <i className={c.road} data-r="e" />
          {DOTS.map(([x, y]) => (
            <i key={`${x}-${y}`} className={c.dot} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
          <span className={c.spot}>
            {s.pin ? (
              <>
                <i className={c.shadow} />
                {s.ripple ? <i className={c.ripple} /> : null}
                <span className={c.pin}>
                  <Pin />
                </span>
              </>
            ) : null}
          </span>
          <span className={k.anchor} data-target="home" style={{ right: "13%", top: "38%" }} />
        </div>

        {s.sheet ? (
          <div className={c.sheet}>
            <i className={c.handle} />
            {s.lines >= 1 ? <div className={`${c.name} ${k.popIn}`}>Your business</div> : null}
            {s.lines >= 2 ? (
              <div className={`${c.rating} ${k.popIn}`}>
                <span className={c.score}>4.9</span>
                <span className={c.stars}>
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </span>
                <span>(47)</span>
              </div>
            ) : null}
            {s.lines >= 3 ? (
              <div className={`${c.meta} ${k.popIn}`}>
                Deck builder · <span className={c.open}>Open now</span>
              </div>
            ) : null}
            {s.lines >= 4 ? (
              <div className={`${c.actions} ${k.popIn}`}>
                <span
                  className={c.pill}
                  data-tone="ink"
                  data-target="call"
                  data-ax="0.86"
                  data-ay="0.55"
                  data-pressed={s.press || undefined}
                >
                  <Phone />
                  Call
                </span>
                <span className={c.pill}>
                  <span className={c.dirIcon}>
                    <Arrow />
                  </span>
                  Directions
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <StageCursor at={pt} pressed={s.press} hidden={!s.cursor} still={still} name="" />
    </div>
  );
}
