"use client";

/**
 * "A/B testing", made simple (Nov 24 2026: William found the first one, a
 * wipe between the two pages with tags, a badge, likely ranges and a line
 * chart, too busy). Now it's the two versions of the top of the page side by
 * side, A as it was and B with the quote form at the top, each with the
 * share of visitors who sent a quote request under it, and B marked the
 * winner. A/B tests only run where a site gets enough visitors (William's
 * note), so it says so. Example data.
 */
import s from "../SeoCro.module.css";
import { box, Takeaway, useClock, type PanelProps } from "./CroKit";

const LEN = 10000;

function Version({ b }: { b?: boolean }) {
  return (
    <figure className={s.version} data-b={b || undefined}>
      <figcaption className={s.versionHead}>
        <span className={s.vKey}>{b ? "B" : "A"}</span>
        <span className={s.vLabel}>{b ? "Quote form at the top" : "The page as it was"}</span>
        {b ? <span className={s.winTag}>Winner</span> : null}
      </figcaption>
      <div className={s.mini}>
        <div className={s.page}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed capture, sized by its frame */}
          <img className={s.shot} src="/seo/cro/nwr-page.webp" width={1280} height={2898} alt="" loading="lazy" />
          {b ? (
            <div className={s.heroForm} style={box(944, 250, 400, 520)}>
              <p className={s.hfTitle}>Get a free quote</p>
              <span className={s.hfField}>Your name</span>
              <span className={s.hfField}>Phone</span>
              <span className={s.hfField}>
                Type of railing
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
              <span className={s.hfBtn}>Send</span>
            </div>
          ) : null}
        </div>
      </div>
      <p className={s.versionRate}>
        {b ? "4.5%" : "3.1%"}
        <span>sent a quote request</span>
      </p>
    </figure>
  );
}

export default function CroAbTest({ playing, still }: PanelProps) {
  const { run, dim } = useClock(LEN, playing, still);

  return (
    <>
      <div className={s.main} data-dim={dim || undefined}>
        <div className={s.versions} key={run} data-paused={!playing || undefined}>
          <Version />
          <Version b />
        </div>
      </div>

      <aside className={s.side} key={run} data-paused={!playing || undefined}>
        <div className={s.sideHead}>
          <div>
            <p className={s.sideTitle}>Quote form at the top</p>
            <p className={s.sideMeta}>6 weeks · 2,050 visitors, half saw each</p>
          </div>
        </div>

        <ul className={s.ranks}>
          <li className={s.ranksHead}>Quote requests</li>
          {[
            { label: "A · as it was", n: 32 },
            { label: "B · form at the top", n: 46, win: true },
          ].map((v) => (
            <li key={v.label}>
              <span className={s.rankLabel}>{v.label}</span>
              <span className={s.rankBar} data-win={v.win || undefined}>
                <i style={{ width: `${(v.n / 46) * 100}%` }} />
              </span>
              <span className={s.rankPct}>{v.n}</span>
            </li>
          ))}
        </ul>

        <Takeaway
          saw="With the form at the top, 46 people asked for a quote instead of 32."
          changed="Every visitor now sees version B."
        />
        <p className={s.footnote}>We only run tests like this when a site gets enough visitors to trust the result.</p>
      </aside>
    </>
  );
}
