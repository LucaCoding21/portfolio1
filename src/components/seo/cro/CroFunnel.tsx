"use client";

/**
 * "Conversion funnels": a month of visitors on their way from the home page
 * to a sent quote request, drawn as PostHog draws a funnel (a bar per step,
 * the share who reached it, the ones who dropped off hatched above it and
 * counted between the bars), the worst step marked. Example data.
 */
import s from "../SeoCro.module.css";
import { Takeaway, useClock, type PanelProps } from "./CroKit";

const LEN = 10000;

const STEPS = [
  { name: "Visited the site", count: 1180 },
  { name: "Looked at a railing system", count: 672 },
  { name: "Opened the quote form", count: 132 },
  { name: "Sent the quote form", count: 41 },
];

const first = STEPS[0].count;
const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(n / of < 0.1 ? 1 : 0)}%`;

export default function CroFunnel({ playing, still }: PanelProps) {
  const { run, dim } = useClock(LEN, playing, still);

  return (
    <>
      <div className={s.main} data-dim={dim || undefined}>
        <div className={s.chartCard} key={run} data-paused={!playing || undefined}>
          <div className={s.chartHead}>
            <p className={s.chartTitle}>From the home page to a quote request</p>
            <p className={s.chartMeta}>August · 1,180 visitors</p>
          </div>
          <div className={s.funnel}>
            <div className={s.grid} aria-hidden>
              {[100, 75, 50, 25, 0].map((g) => (
                <span key={g} style={{ top: `${100 - g}%` }}>
                  <i>{g}%</i>
                </span>
              ))}
            </div>
            <ol className={s.bars}>
              {STEPS.map((st, i) => {
                const prev = i ? STEPS[i - 1].count : first;
                const h = (st.count / first) * 100;
                const lost = prev - st.count;
                const worst = i === 3;
                return (
                  <li key={st.name} className={s.step} style={{ "--d": `${i * 220}ms` } as React.CSSProperties}>
                    <span className={s.col}>
                      {/* the ones lost since the step before, hatched */}
                      <span className={s.drop} style={{ height: `${(prev / first) * 100}%` }} />
                      <span className={s.fill} style={{ height: `${h}%` }}>
                        <b className={s.fillPct}>{pct(st.count, first)}</b>
                      </span>
                      {i ? (
                        <span
                          className={s.lost}
                          data-worst={worst || undefined}
                          style={{ bottom: `${Math.min((prev / first) * 100, 88)}%` }}
                        >
                          <span>→ {pct(st.count, prev)}</span>
                          <span className={s.lostN}>−{lost.toLocaleString("en-US")}</span>
                        </span>
                      ) : null}
                    </span>
                    <span className={s.stepName}>
                      {st.name}
                      <b>{st.count.toLocaleString("en-US")}</b>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <aside className={s.side}>
        <div className={s.sideHead}>
          <div>
            <p className={s.sideTitle}>Where people stop</p>
            <p className={s.sideMeta}>August · each step against the one before</p>
          </div>
        </div>

        <ol className={s.stepList}>
          {STEPS.slice(1).map((st, i) => {
            const prev = STEPS[i].count;
            const worst = i === 2;
            return (
              <li key={st.name} data-worst={worst || undefined}>
                <span className={s.slName}>{st.name}</span>
                <span className={s.slBar}>
                  <i style={{ width: `${(st.count / prev) * 100}%` }} />
                </span>
                <span className={s.slPct}>{pct(st.count, prev)}</span>
              </li>
            );
          })}
        </ol>

        <Takeaway
          saw="7 in 10 people who opened the quote form left without sending it. It asked 9 questions."
          changed="We cut the form to 4 questions."
        />
      </aside>
    </>
  );
}
