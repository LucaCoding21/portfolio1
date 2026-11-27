"use client";

/**
 * An SEO client's live report, /report/<token> (Nov 2026). William asked for
 * the monthly report from the /seo page's "Tracking and reporting" card
 * (seo/pillars/ResultsCard) one for one, only bigger: the black card with the
 * title and line at its top left, the white report rising out of it with the
 * long logo, a chip, "Monthly report" and the month, the stat tiles with green
 * "vs last month" lines and "What we did this month" with green checks. The
 * colours are the SEO page's yellows (the CRO cards' bar gradient, #e9d95c to
 * #f7f0c4, and the #1 badges' #fbe35a), no blue.
 *
 * The client only looks: the one thing to press is a month. Everything is
 * logged in Command Center (its SEO reports page).
 */
import Image from "next/image";
import { useMemo, useState } from "react";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import {
  dayLabel,
  formatMetric,
  metricChange,
  monthLabel,
  monthName,
  monthShort,
  type ReportView,
  type ReportWork,
} from "@/lib/seoReportShared";
import s from "./SeoReport.module.css";

const bare = (url: string) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

const Up = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
const Down = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export default function SeoReport({ report }: { report: ReportView }) {
  const [month, setMonth] = useState(report.defaultMonth);
  const data = report.months.find((m) => m.month === month) ?? null;
  const done = report.work.filter((w) => w.status === "done" && w.date.startsWith(month));
  const doing = report.work.filter((w) => w.status === "doing");
  const next = report.work.filter((w) => w.status === "next");
  const empty = report.work.length === 0 && report.months.length === 0;

  // Numbers for the month: only the metrics it has (none = still to come).
  const tiles = report.metrics.filter((m) => data?.values[m.id] != null);
  const first = report.metrics[0];
  const chart = useMemo(
    () =>
      first
        ? [...report.months]
            .filter((m) => m.values[first.id] != null)
            .sort((a, b) => (a.month < b.month ? -1 : 1))
            .slice(-12)
            .map((m) => ({ month: m.month, value: m.values[first.id]! }))
        : [],
    [report.months, first],
  );
  const max = Math.max(1, ...chart.map((c) => c.value));
  const sel = chart.find((c) => c.month === month);
  const firstPoint = chart[0];

  // Positions: the newest check on or before this month, and the first ever.
  const ranks = report.keywords
    .map((k) => {
      const checked = [...report.months].filter((m) => m.ranks[k.id] != null).sort((a, b) => (a.month < b.month ? -1 : 1));
      const now = [...checked].reverse().find((m) => m.month <= month);
      if (!now) return null;
      const start = checked[0]!;
      return { k, pos: now.ranks[k.id]!, at: now.month, start: start.ranks[k.id]!, startMonth: start.month };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <div className={s.heroInner}>
          <h1 className={s.title}>{report.business}</h1>
          {report.siteUrl && (
            <a className={s.pill} href={report.siteUrl} target="_blank" rel="noopener noreferrer">
              {bare(report.siteUrl)}
              <Arrow />
            </a>
          )}
        </div>
      </header>

      <main className={s.sheetWrap}>
        <article className={s.sheet}>
          <div className={s.rTop}>
            <Image className={s.rLogo} src="/cloverfield-logo.png" alt="Cloverfield Studio" width={4162} height={662} sizes="120px" priority />
            <span className={s.rChip}>
              {report.fresh && <i className={s.liveDot} aria-hidden />}
              Updated {report.updated}
            </span>
            <b className={s.rName}>Monthly report</b>
            <span className={s.rMonth}>{monthLabel(month)}</span>
          </div>

          {report.monthList.length > 1 && (
            <div className={s.months} role="group" aria-label="Month">
              {report.monthList.map((m) => (
                <button key={m} type="button" className={s.monthBtn} aria-pressed={m === month} onClick={() => setMonth(m)}>
                  {monthShort(m)}
                  {m.slice(0, 4) !== report.monthList[0]!.slice(0, 4) && ` ${m.slice(0, 4)}`}
                </button>
              ))}
            </div>
          )}

          {empty ? (
            <p className={s.soft}>Your report is being set up. The first things we do will show up here.</p>
          ) : (
            <>
              {report.metrics.length > 0 &&
                (tiles.length > 0 ? (
                  <div className={s.tiles}>
                    {tiles.map((m) => {
                      const change = metricChange(report.months, month, m);
                      const vs = change ? (change.lastMonth ? "last month" : monthName(change.against)) : "";
                      // No change to show: either nothing came before, or it was 0 (no share from zero).
                      const earlier = change
                        ? null
                        : report.months.find((x) => x.month < month && x.values[m.id] != null) ?? null;
                      return (
                        <div key={m.id} className={s.tile}>
                          <span className={s.tLabel}>{m.label}</span>
                          <b className={s.tValue}>{formatMetric(data!.values[m.id]!, m.kind)}</b>
                          {change ? (
                            <span className={change.dir === "up" ? s.tDelta : s.tFlat}>
                              {change.dir === "up" && <Up />}
                              {change.dir === "down" && <Down />}
                              {change.dir === "same" ? `Same as ${vs}` : `${change.text} vs ${vs}`}
                            </span>
                          ) : earlier ? (
                            <span className={s.tFlat}>
                              Was {formatMetric(earlier.values[m.id]!, m.kind)} in {monthName(earlier.month)}
                            </span>
                          ) : (
                            <span className={s.tFlat}>First month we counted</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={s.soft}>
                    {monthName(month)}&rsquo;s numbers come in at the start of {monthName(shiftKey(month))}.
                  </p>
                ))}

              {first && chart.length > 1 && (
                <section className={s.block}>
                  <h2 className={s.head}>{first.label} by month</h2>
                  <div className={s.chart} style={{ "--n": chart.length } as React.CSSProperties}>
                    {chart.map((c, i) => (
                      <button
                        key={c.month}
                        type="button"
                        className={s.col}
                        aria-pressed={c.month === month}
                        aria-label={`${monthLabel(c.month)}: ${formatMetric(c.value, first.kind)}`}
                        onClick={() => report.monthList.includes(c.month) && setMonth(c.month)}
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        <span className={s.colValue}>{formatMetric(c.value, first.kind)}</span>
                        <span className={s.colTrack}>
                          <span className={s.colBar} style={{ height: `${Math.max(4, (c.value / max) * 100)}%` }} />
                        </span>
                        <span className={s.colMonth}>{monthShort(c.month)}</span>
                      </button>
                    ))}
                  </div>
                  {sel && firstPoint && firstPoint.month !== sel.month && sel.value > firstPoint.value && (
                    <p className={s.chartNote}>
                      Up from {formatMetric(firstPoint.value, first.kind)} in {monthName(firstPoint.month)}.
                    </p>
                  )}
                </section>
              )}

              {ranks.length > 0 && (
                <section className={s.block}>
                  <h2 className={s.head}>Where you show up on Google</h2>
                  <p className={s.sub}>We check these searches every month. #1 is the top spot.</p>
                  <ul className={s.ranks}>
                    {ranks.map(({ k, pos, at, start, startMonth }) => {
                      const gained = start === 0 ? (pos > 0 ? Infinity : 0) : pos === 0 ? -Infinity : start - pos;
                      return (
                        <li key={k.id} className={s.rank}>
                          <span className={s.searchBox}>
                            {k.where === "maps" ? <Pin /> : <Search />}
                            <span className={s.term}>{k.term}</span>
                          </span>
                          <span className={s.where}>
                            {k.where === "maps" ? "Google Maps" : "Google"}
                            {at !== month && ` · checked in ${monthName(at)}`}
                          </span>
                          <span className={s.rankRight}>
                            {startMonth !== at && gained !== 0 && (
                              <span className={gained > 0 ? s.gain : s.loss}>
                                {gained === Infinity
                                  ? "New"
                                  : gained === -Infinity
                                    ? `Was #${start}`
                                    : gained > 0
                                      ? `Up ${gained} since ${monthShort(startMonth)}`
                                      : `Down ${-gained} since ${monthShort(startMonth)}`}
                              </span>
                            )}
                            {pos === 0 ? (
                              <span className={s.notYet}>Not showing yet</span>
                            ) : (
                              <b className={pos <= 3 ? s.badgeTop : s.badge}>#{pos}</b>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <section className={s.block}>
                <h2 className={s.head}>
                  What we did in {monthName(month)}
                  {done.length > 0 && <span className={s.count}>{done.length}</span>}
                </h2>
                {done.length > 0 ? (
                  <ul className={s.checks}>
                    {done.map((w) => (
                      <WorkLine key={w.id} w={w} />
                    ))}
                  </ul>
                ) : (
                  <p className={s.sub}>Nothing logged for {monthName(month)} yet.</p>
                )}
              </section>

              {(doing.length > 0 || next.length > 0) && (
                <section className={s.block}>
                  {doing.length > 0 && (
                    <>
                      <h2 className={s.head}>What we&rsquo;re working on now</h2>
                      <ul className={s.checks}>
                        {doing.map((w) => (
                          <WorkLine key={w.id} w={w} />
                        ))}
                      </ul>
                    </>
                  )}
                  {next.length > 0 && (
                    <>
                      <h2 className={`${s.head} ${doing.length > 0 ? s.headGap : ""}`}>Next up</h2>
                      <ul className={s.checks}>
                        {next.map((w) => (
                          <WorkLine key={w.id} w={w} />
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              )}
            </>
          )}

          {report.giftLink && (
            <section className={s.gift}>
              <span className={s.giftCard} aria-hidden>
                <Image src="/gift/card-front.webp" alt="" fill sizes="120px" />
                <span className={s.giftAmount}>
                  $500
                  <small>off a new website</small>
                </span>
              </span>
              <span className={s.giftText}>
                <b>Give $500, get $500</b>
                Know someone who needs a website? Send them $500 off a new site. When they sign, you get $500 off your
                hosting or any future work with us.
              </span>
              <a className={s.giftBtn} href={report.giftLink}>
                Send a gift
                <Arrow />
              </a>
            </section>
          )}

          <footer className={s.sheetFoot}>
            <span>
              Questions about anything here?{" "}
              <a href={`sms:${WILLIAM_PHONE}`} className={s.footLink}>
                Text William
              </a>
            </span>
            {report.startedMonth && <span className={s.since}>Working on your SEO since {monthLabel(report.startedMonth)}</span>}
          </footer>
        </article>

        <a className={s.madeBy} href="https://cloverfield.studio">
          Cloverfield Studio
        </a>
      </main>
    </div>
  );
}

/** The month after a YYYY-MM key. */
function shiftKey(key: string): string {
  const [y, m] = key.split("-").map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

function WorkLine({ w }: { w: ReportWork }) {
  return (
    <li className={s.line} data-status={w.status}>
      <span className={s.mark} aria-hidden>
        {w.status === "done" && <Check />}
      </span>
      <span className={s.lineBody}>
        <span className={s.lineTitle}>{w.title}</span>
        {w.why && <span className={s.lineWhy}>{w.why}</span>}
      </span>
      <span className={s.lineMeta}>
        {w.status === "done" && <span className={s.lineDate}>{dayLabel(w.date)}</span>}
        {w.link && (
          <a className={s.lineLink} href={w.link} target="_blank" rel="noopener noreferrer">
            See it
            <Arrow />
          </a>
        )}
      </span>
    </li>
  );
}
