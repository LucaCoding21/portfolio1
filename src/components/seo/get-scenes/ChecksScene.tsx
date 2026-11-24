"use client";

/**
 * "Your rankings, checked monthly" (the six things we work on, /seo): a map
 * check in the spirit of a rank-tracking grid, with no brand marks. A pale
 * map drawn in CSS with a 5 by 3 grid of points over it; the October check
 * fills them from the middle outwards, each with where the business shows up
 * there (green for 1 to 3, amber for 4 to 10, grey past 10), and the badge
 * reads "6 in top 3". The month turns to November, the grid checks again with
 * more greens, and the badge rolls to 10. No pointer: the check runs on its
 * own every month. Drawn as x.ai/bot's feature cards are (one white window,
 * a few real words, their tick stagger and pop-ins), played on StageKit's
 * timings (Nov 23 2026).
 */
import { Digits, Swap, script, ticks, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ChecksScene.module.css";

const COLS = 5;
const POINTS = Array.from({ length: COLS * 3 }, (_, i) => i);

// where the business shows up at each point, row by row (21 reads "20+");
// better near the middle, where the business is, and a month's work later
// more of them are in the top 3 (6 of 15, then 10)
const OCT = [15, 5, 3, 7, 21, 8, 2, 1, 3, 12, 11, 3, 2, 4, 9];
const NOV = [9, 3, 2, 3, 12, 3, 2, 1, 2, 6, 7, 2, 2, 3, 5];
const inTop3 = (ranks: number[]) => ranks.filter((r) => r <= 3).length;
const tone = (r: number) => (r <= 3 ? "top" : r <= 10 ? "mid" : "low");

// the check fills the points from the middle outwards, clockwise from the top
// (columns sit wider apart than rows, so they count for more)
const spot = (i: number) => {
  const dx = (i % COLS) - 2;
  const dy = Math.floor(i / COLS) - 1;
  const angle = (Math.atan2(dx, -dy) + 2 * Math.PI) % (2 * Math.PI);
  return { dist: Math.hypot(dx * 1.5, dy), angle };
};
const ORDER = [...POINTS].sort((a, b) => spot(a).dist - spot(b).dist || spot(a).angle - spot(b).angle);
const TURN = POINTS.map((i) => ORDER.indexOf(i));

type St = { oct: number; nov: number; month: number; badge: boolean; top: number };

const CHECKS = script<St>(
  { oct: 0, nov: 0, month: 0, badge: false, top: inTop3(OCT) },
  [
    ...ticks<St>(300, POINTS.length, 70, "oct"),
    [1700, { badge: true }],
    [3100, { month: 1 }],
    ...ticks<St>(3600, POINTS.length, 70, "nov"),
    [5000, { top: inTop3(NOV) }],
  ],
  8000,
  5000,
);

export default function ChecksScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(CHECKS, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={k.frame}>
        <div className={`${k.panel} ${c.panel}`}>
          <div className={k.head}>
            <span className={c.name}>
              <span className={k.title}>Map check</span>
              <Swap className={`${c.month} ${c.long}`} items={["October", "November"]} index={s.month} />
              <Swap className={`${c.month} ${c.short}`} items={["Oct", "Nov"]} index={s.month} />
            </span>
            <span className={`${k.badge} ${c.tally}`} data-hidden={!s.badge || undefined}>
              <span className={c.key} />
              <Digits value={s.top} />
              <span>in top 3</span>
            </span>
          </div>
          <div className={c.map}>
            <i className={c.park} />
            <i className={c.road} data-r="a" />
            <i className={c.road} data-r="b" />
            <i className={c.road} data-r="c" />
            <i className={c.road} data-r="d" />
            <div className={`${k.pages} ${c.grids}`}>
              {[OCT, NOV].map((ranks, m) => {
                const done = m ? s.nov : s.oct;
                return (
                  <div key={m} className={c.grid} data-hidden={s.month !== m || undefined}>
                    {POINTS.map((i) => (
                      <span key={i} className={c.dot}>
                        {TURN[i] < done ? (
                          <i className={c.fill} data-tone={tone(ranks[i])}>
                            {ranks[i] > 20 ? "20+" : ranks[i]}
                          </i>
                        ) : null}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
