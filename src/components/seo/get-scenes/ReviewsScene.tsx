"use client";

/**
 * "More reviews" (the six things we work on, /seo): a review request goes
 * out and a review comes back. A small message to a customer writes itself,
 * the "Leave a review" link pops in, you press Send, the message folds into
 * a "Sent" line, and a moment later a new review pops in under it: five
 * stars fill one by one, the customer's line appears and the count rolls
 * from 47 to 48. Drawn as x.ai/bot's feature cards are (their floating white
 * message cards on the slot's grey, grey placeholder lines, a few real
 * words, a "You" cursor), played on StageKit's timings (Nov 23 2026).
 */
import { Fragment, useRef } from "react";
import { Digits, StageCursor, script, ticks, useScript, useTargetPoint } from "../StageKit";
import k from "../StallScenes.module.css";
import r from "./ReviewsScene.module.css";

const MESSAGE = "Thanks for having us out! Would you leave us a quick review?".split(" ");

type Rv = {
  cursor: boolean;
  words: number;
  chip: boolean;
  at: string | null;
  press: boolean;
  sent: boolean;
  folded: boolean;
  note: boolean;
  stars: number;
  line: boolean;
  count: number;
};

const REVIEWS = script<Rv>(
  {
    cursor: false,
    words: 0,
    chip: false,
    at: null,
    press: false,
    sent: false,
    folded: false,
    note: false,
    stars: 0,
    line: false,
    count: 47,
  },
  [
    [250, { cursor: true }],
    // the message writes itself a word at a time
    ...ticks<Rv>(400, MESSAGE.length, 65, "words"),
    [1250, { chip: true }],
    [1650, { at: "send" }],
    [2200, { press: true }],
    [2300, { press: false, sent: true }],
    [2950, { folded: true, cursor: false }],
    [3450, { note: true }],
    ...ticks<Rv>(3900, 5, 140, "stars"),
    [4700, { line: true }],
    [5300, { count: 48 }],
  ],
  8400,
  5300,
);

const Star = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6.2 5 8l4-4.2" />
  </svg>
);

export default function ReviewsScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(REVIEWS, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.folded);
  return (
    <div ref={root} className={`${k.stage} ${r.root}`} data-dim={dim || undefined}>
      <div className={r.cards}>
        {/* the request: folds to its first line once it's sent */}
        <div className={r.card}>
          <div className={r.row}>
            <span className={r.to}>
              <span className={r.toLabel}>To:</span>Sarah
            </span>
            <span
              className={r.send}
              data-target="send"
              data-ax="0.62"
              data-ay="0.62"
              data-pressed={s.press || undefined}
              data-sent={s.sent || undefined}
            >
              <span className={`${k.textSwap} ${r.sendLabel}`}>
                <span data-hidden={s.sent || undefined}>Send</span>
                <span className={r.sentLabel} data-hidden={!s.sent || undefined}>
                  <Check />
                  Sent
                </span>
              </span>
            </span>
          </div>
          <div className={r.body} data-folded={s.folded || undefined}>
            <div>
              <p className={r.msg}>
                {MESSAGE.map((w, i) => (
                  <Fragment key={i}>
                    {i ? " " : null}
                    <span data-on={i < s.words || undefined}>{w}</span>
                  </Fragment>
                ))}
              </p>
              <span className={r.chip} data-hidden={!s.chip || undefined}>
                <Star size={10} />
                Leave a review
              </span>
            </div>
          </div>
        </div>

        {/* the review that comes back */}
        {s.note ? (
          <div className={`${r.card} ${r.note} ${k.popIn}`}>
            <span className={r.avatar}>S</span>
            <div className={r.noteBody}>
              <div className={r.noteHead}>
                <span className={k.title}>New review</span>
                <span className={`${k.badge} ${r.count}`} data-tone="success">
                  <Digits value={s.count} />
                  <span>reviews</span>
                </span>
              </div>
              <div className={r.stars}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={r.star} data-on={i < s.stars || undefined}>
                    <Star size={12} />
                  </span>
                ))}
              </div>
              <p className={r.quote} data-hidden={!s.line || undefined}>
                Great work on our deck.
              </p>
            </div>
          </div>
        ) : null}

        <span className={k.anchor} data-target="home" style={{ right: "16%", top: 110 }} />
      </div>
      <StageCursor at={pt} pressed={s.press} hidden={!s.cursor} still={still} />
    </div>
  );
}
