"use client";

/**
 * "More reviews" (the six things we work on, /seo): one big number. The
 * review count sits in the middle of the slot, with five amber stars and
 * "reviews" under it, and reads 47. Short reviews drift up beside it one at a
 * time, left, then right, then left (five tiny stars and a few words a
 * homeowner would write), and as each one comes in the count rolls up by one,
 * to 50. The first one drifts off the top as the third comes in; the last two
 * rest on either side of the number for the hold. No window and no pointer:
 * the reviews come in on their own. Drawn in x.ai/bot's light feature-card
 * style (their floating white cards on the slot's grey, the digit roll),
 * played on StageKit's timings (Nov 23 2026).
 */
import { Digits, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ReviewsCountScene.module.css";

// each review on two short lines, so it fits beside the number in the
// narrowest slots
const QUOTES: { lane: "l" | "r"; lines: [string, string] }[] = [
  { lane: "l", lines: ["Showed up", "on time"] },
  { lane: "r", lines: ["Our deck", "looks great"] },
  { lane: "l", lines: ["Fair price,", "clean job"] },
];

// 0: not yet, 1: in, 2: drifted off the top
type St = { count: number; q0: number; q1: number; q2: number };
const KEYS = ["q0", "q1", "q2"] as const;

const COUNT = script<St>(
  { count: 47, q0: 0, q1: 0, q2: 0 },
  [
    [400, { q0: 1 }],
    [900, { count: 48 }],
    [2300, { q1: 1 }],
    [2800, { count: 49 }],
    // the first drifts off the top just ahead of the third, so they never cross
    [3700, { q0: 2 }],
    [4500, { q2: 1 }],
    [5000, { count: 50 }],
  ],
  8400,
  5000,
);

const STAR =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function Stars({ className }: { className: string }) {
  return (
    <span className={className}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsCountScene({
  playing,
  still,
  lead,
}: {
  playing: boolean;
  still: boolean;
  lead?: number;
}) {
  const { s, dim } = useScript(COUNT, playing, still, lead);
  const digits = String(s.count).split("");

  const lane = (side: "l" | "r") => (
    <div className={c.lane} data-lane={side}>
      {QUOTES.map((q, i) => {
        const phase = s[KEYS[i]];
        if (q.lane !== side || !phase) return null;
        return (
          <div key={i} className={c.quote} data-slot={i} data-gone={phase === 2 || undefined}>
            <div className={c.card}>
              <Stars className={c.miniStars} />
              <span className={c.words}>
                <span>{q.lines[0]}</span>
                <span>{q.lines[1]}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.row}>
        {lane("l")}
        <div className={c.tally}>
          {/* each digit rolls on its own, so 47 to 48 only turns the 7 */}
          <span className={c.count}>
            {digits.map((d, i) => (
              <Digits key={`${digits.length}-${i}`} value={d} />
            ))}
          </span>
          <Stars className={c.stars} />
          <span className={c.label}>reviews</span>
        </div>
        {lane("r")}
      </div>
    </div>
  );
}
