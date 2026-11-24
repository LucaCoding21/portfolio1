"use client";

/**
 * "Your rankings, checked monthly" (the six things we work on, /seo), drawn
 * as a radar over a map (Nov 23 2026). The whole slot is a pale map with
 * your business in the middle and a grid of points around it, the places
 * customers search from. A small chip reads "Oct" and a beam sweeps once
 * around the business: as its edge passes a point, the point shows where the
 * business comes up there (green for the top 3, amber for 4 to 10, grey past
 * that), and the chip opens to "6 in top 3". The chip turns to "Nov",
 * October's colours dim, and the beam sweeps again: more points turn green
 * and the count rolls up to 10. The beam and the points run on one clock
 * (each point's CSS delay is worked out from its angle), so every point turns
 * right under the edge. Taller slots get two more rows (5 by 5, 7 then 12).
 * No window and no pointer: the check runs on its own every month. Played on
 * StageKit's timings with x.ai/bot's pop-ins and digit roll.
 */
import type { CSSProperties } from "react";
import { Digits, Swap, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ChecksRadarScene.module.css";

// where the business shows up from each point, rows from the top, the
// business itself in the middle (0); 21 means past 20. Every point is the
// same or a little better a month later. The short slots show the middle
// three rows (6 in the top 3 of 14, then 10), the tall ones all five (7 of
// 24, then 12).
const OCT = [
  [21, 14, 6, 8, 21],
  [7, 3, 2, 5, 14],
  [6, 2, 0, 1, 9],
  [12, 4, 2, 3, 8],
  [21, 9, 3, 13, 21],
];
const NOV = [
  [16, 9, 3, 6, 21],
  [5, 2, 1, 3, 12],
  [3, 1, 0, 1, 3],
  [8, 3, 1, 2, 6],
  [18, 7, 2, 9, 15],
];
const tone = (r: number) => (r <= 3 ? "top" : r <= 10 ? "mid" : "low");

// one turn of the beam; it starts 30 degrees early and runs 30 past a full
// turn, fading in and out there, so its edge passes every point at full
// strength (the keyframes in the CSS match)
const TURN = 2400;
const LEAD_IN = 30;
const SWEEP_MS = Math.round((TURN * (360 + 2 * LEAD_IN)) / 360);

// columns sit wider apart than rows, 1 to 1.4 times (the CSS keeps them
// there), so the short grid is timed at 1.2 to 1 and the tall one at 1.25 to
// 1, within about 5 degrees at every size; each point turns when the edge
// reaches its angle, clockwise from straight up
const RATIO_SHORT = 1.2;
const RATIO_TALL = 1.25;
const delay = (col: number, row: number, ratio: number) => {
  const deg = ((Math.atan2(col * ratio, -row) * 180) / Math.PI + 360) % 360;
  return Math.round(((deg + LEAD_IN) / 360) * TURN);
};

const POINTS = OCT.flatMap((line, y) =>
  line.map((_, x) => {
    const col = x - 2;
    const row = y - 2;
    return {
      id: `${col}:${row}`,
      col,
      row,
      outer: Math.abs(row) === 2,
      oct: tone(OCT[y][x]),
      nov: tone(NOV[y][x]),
      short: delay(col, row, RATIO_SHORT),
      tall: delay(col, row, RATIO_TALL),
    };
  }),
).filter((p) => p.col || p.row);

const SHORT = POINTS.filter((p) => !p.outer);
const inTop3 = (pts: typeof POINTS, m: "oct" | "nov") => pts.filter((p) => p[m] === "top").length;

type St = {
  chip: boolean;
  month: number;
  open: boolean;
  sweep: number;
  oct: boolean;
  nov: boolean;
  short: number;
  tall: number;
};

const OCT_SWEEP = 400;
const NOV_SWEEP = 4800;

// the count rolls up one at a time as each newly green point turns
const climbs = (pts: typeof POINTS, key: "short" | "tall") =>
  pts
    .filter((p) => p.nov === "top" && p.oct !== "top")
    .sort((a, b) => a[key] - b[key])
    .map((p, i): [number, Partial<St>] => [NOV_SWEEP + p[key], { [key]: inTop3(pts, "oct") + i + 1 }]);

const RADAR = script<St>(
  {
    chip: false,
    month: 0,
    open: false,
    sweep: 0,
    oct: false,
    nov: false,
    short: inTop3(SHORT, "oct"),
    tall: inTop3(POINTS, "oct"),
  },
  (
    [
      [100, { chip: true }],
      [OCT_SWEEP, { sweep: 1, oct: true }],
      [OCT_SWEEP + SWEEP_MS, { sweep: 0 }],
      [OCT_SWEEP + SWEEP_MS + 50, { open: true }],
      [NOV_SWEEP - 400, { month: 1 }],
      [NOV_SWEEP, { sweep: 2, nov: true }],
      ...climbs(SHORT, "short"),
      ...climbs(POINTS, "tall"),
      [NOV_SWEEP + SWEEP_MS, { sweep: 0 }],
    ] as [number, Partial<St>][]
  ).sort((a, b) => a[0] - b[0]),
  9600,
  NOV_SWEEP + SWEEP_MS,
);

const RINGS = [1, 2, 3];

export default function ChecksRadarScene({
  playing,
  still,
  lead,
}: {
  playing: boolean;
  still: boolean;
  lead?: number;
}) {
  const { s, dim } = useScript(RADAR, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined} data-still={still || undefined}>
      {/* the map: warm grey with white roads, a park and a bit of water */}
      <div className={c.map}>
        <i className={c.water} />
        <i className={c.park} />
        <i className={c.road} data-r="a" />
        <i className={c.road} data-r="b" />
        <i className={c.road} data-r="c" />
        <i className={c.road} data-r="d" />
        <i className={c.road} data-r="e" />
      </div>

      <div className={c.field}>
        {RINGS.map((n) => (
          <i key={n} className={c.ring} style={{ "--n": n } as CSSProperties} />
        ))}

        {s.sweep ? (
          <div key={s.sweep} className={c.beam} style={{ "--sweep": `${SWEEP_MS}ms` } as CSSProperties}>
            <i className={c.wedge} />
            <i className={c.edge} />
          </div>
        ) : null}

        {POINTS.map((p) => (
          <span
            key={p.id}
            className={c.point}
            data-outer={p.outer || undefined}
            style={
              {
                "--col": p.col,
                "--row": p.row,
                "--d-short": `${p.short}ms`,
                "--d-tall": `${p.tall}ms`,
              } as CSSProperties
            }
          >
            {s.oct ? <i className={c.fill} data-tone={p.oct} data-dim={s.month === 1 || undefined} /> : null}
            {s.nov ? <i className={c.fill} data-tone={p.nov} /> : null}
          </span>
        ))}

        {/* your business, with a soft ping as each check starts */}
        {s.sweep ? <i key={`ping${s.sweep}`} className={c.ping} /> : null}
        <i className={c.pin} />
        <span className={c.tag}>Your business</span>
      </div>

      {s.chip ? (
        <div className={`${k.popIn} ${c.chip}`}>
          <Swap className={c.month} items={["Oct", "Nov"]} index={s.month} />
          <span className={c.more} data-open={s.open || undefined}>
            <span className={c.moreIn}>
              <i className={c.key} />
              <b className={`${c.count} ${c.countShort}`}>
                <Digits value={s.short} />
              </b>
              <b className={`${c.count} ${c.countTall}`}>
                <Digits value={s.tall} />
              </b>
              <span>in top 3</span>
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
