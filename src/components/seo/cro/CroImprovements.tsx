"use client";

/**
 * "Website improvements": where the other tabs lead. Quote requests a week
 * on the same site, June to November, drawn like PostHog's trend lines (a
 * thin line week by week, dashed grid, no dots; hover for a week's number),
 * with a numbered pin under each week a change went live, and the changes
 * listed beside it with the tab they came from. William liked the chart but
 * not the big dots of the first one (Nov 24 2026). Example data, matching
 * the funnel (41 quote requests in August).
 */
import { useState, type MouseEvent } from "react";
import s from "../SeoCro.module.css";
import { useClock, type PanelProps } from "./CroKit";

const LEN = 10500;

// quote requests a week, from the week of Jun 1 2026
const WEEKS = [8, 9, 7, 9, 8, 9, 8, 10, 8, 9, 10, 11, 10, 12, 11, 12, 13, 12, 13, 14, 12, 13, 14, 15, 13, 15];
const TOP = 16;
const START = new Date(2026, 5, 1);

const MONTHS: [string, number][] = [
  ["Jun", 0],
  ["Jul", 4],
  ["Aug", 9],
  ["Sep", 13],
  ["Oct", 17],
  ["Nov", 22],
];

const CHANGES: { week: number; month: string; text: string; from: string }[] = [
  { week: 9, month: "Aug", text: "Top photo opens the project gallery", from: "Seen in the heatmap" },
  { week: 13, month: "Sep", text: "Quote form cut from 9 questions to 4", from: "Seen in the funnel" },
  { week: 17, month: "Oct", text: "Call button in the header on phones", from: "Seen in the heatmap" },
  { week: 22, month: "Nov", text: "Quote form at the top of the page", from: "Won an A/B test" },
];

/** the line takes this long to draw; the pins and the list land as it passes */
const DRAW = 2600;
const xAt = (i: number) => (i / (WEEKS.length - 1)) * 100;
const yAt = (v: number) => 100 - (v / TOP) * 100;
const line = WEEKS.map((v, i) => `${i ? "L" : "M"}${xAt(i)},${yAt(v)}`).join(" ");
const weekOf = (i: number) =>
  new Date(START.getTime() + i * 7 * 864e5).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function CroImprovements({ playing, still }: PanelProps) {
  const { run, dim } = useClock(LEN, playing, still);
  const [hover, setHover] = useState<number | null>(null);
  const at = (week: number) => ({ animationDelay: `${300 + (week / (WEEKS.length - 1)) * DRAW}ms` });

  const track = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (WEEKS.length - 1));
    setHover(Math.min(WEEKS.length - 1, Math.max(0, i)));
  };

  return (
    <>
      <div className={s.main} data-dim={dim || undefined}>
        <div className={s.chartCard} key={run} data-paused={!playing || undefined}>
          <div className={s.chartHead}>
            <div>
              <p className={s.chartTitle}>Quote requests per week</p>
              <p className={s.chartMeta}>Same site, June to November</p>
            </div>
            <p className={s.bigNum}>
              14 a week <span>in November, up from 8 in June</span>
            </p>
          </div>

          <div className={s.trend} onMouseMove={track} onMouseLeave={() => setHover(null)}>
            <div className={`${s.grid} ${s.gridDashed}`} aria-hidden>
              {[16, 12, 8, 4, 0].map((g) => (
                <span key={g} style={{ top: `${yAt(g)}%` }}>
                  <i>{g}</i>
                </span>
              ))}
            </div>
            <svg className={s.trendSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="cro-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1f8a65" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#1f8a65" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${line} L100,100 L0,100 Z`} fill="url(#cro-area)" />
              <path className={s.trendLine} d={line} />
            </svg>
            {/* the latest week, the only point marked */}
            <span
              className={s.endDot}
              style={{ left: "100%", top: `${yAt(WEEKS[WEEKS.length - 1])}%`, ...at(WEEKS.length - 1) }}
            />
            {CHANGES.map((c, i) => (
              <span key={c.text} className={s.pin} style={{ left: `${xAt(c.week)}%`, ...at(c.week) }}>
                {i + 1}
              </span>
            ))}
            {hover != null ? (
              <>
                <span className={s.cross} style={{ left: `${xAt(hover)}%` }} aria-hidden />
                <span
                  className={s.hoverDot}
                  style={{ left: `${xAt(hover)}%`, top: `${yAt(WEEKS[hover])}%` }}
                  aria-hidden
                />
                <span
                  className={s.tip}
                  data-flip={hover > WEEKS.length * 0.7 || undefined}
                  style={{ left: `${xAt(hover)}%`, top: `${yAt(WEEKS[hover])}%` }}
                >
                  <span>Week of {weekOf(hover)}</span>
                  <b>{WEEKS[hover]} quote requests</b>
                </span>
              </>
            ) : null}
          </div>
          <div className={s.months} aria-hidden>
            {MONTHS.map(([m, w]) => (
              <span key={m} style={{ left: `${xAt(w)}%` }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <aside className={s.side} key={run} data-paused={!playing || undefined}>
        <div className={s.sideHead}>
          <div>
            <p className={s.sideTitle}>What we changed</p>
            <p className={s.sideMeta}>One thing a month, each from something we saw</p>
          </div>
        </div>
        <ol className={s.changes}>
          {CHANGES.map((c, i) => (
            <li key={c.text} style={at(c.week)}>
              <span className={s.chNum}>{i + 1}</span>
              <span className={s.chText}>
                <span className={s.chMonth}>{c.month}</span>
                {c.text}
                <span className={s.chFrom}>{c.from}</span>
              </span>
              <svg
                className={s.chCheck}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </li>
          ))}
        </ol>
        <p className={s.footnote}>Each month we fix one thing we found, then check that it helped.</p>
      </aside>
    </>
  );
}
