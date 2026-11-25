"use client";

/**
 * "02 / Get chosen" (Nov 24 2026, from a SaaS reference William sent: "Start
 * in four steps…", grey cards each topped by a small white analytics widget,
 * a table, a bar chart, a big figure over a row of bars). William picked this
 * row from nine drafts the same day (a tab tour, a scroll story, Irish's
 * numbered steps over a mountain photo, and the same cards as a bento, a
 * stack, a dashboard window, a zigzag and a green wall); they're in git
 * history (commits on seo-page-cro, Nov 24 2026) if one is wanted back.
 * The cards in a sideways row running off the page's edge, with "01 / Get
 * found"'s round arrow buttons; since Nov 24 2026 the heading sits across the
 * top (the line and the arrows at its right) so the section isn't the SEO
 * one's shape twice in a row. No hover: every widget shows all the time,
 * and its bars grow in once when the section comes on screen. One card per
 * thing in William's low-fi: recordings, heatmaps, funnels, A/B tests and
 * the ongoing changes. Example data, the same as the other drafts' (the
 * funnel's 1,180 visitors and 41 quote requests in August, the A/B test's
 * 3.1% and 4.5%, quote requests 8 to 14 a week), shown on Northwest
 * Railing's real home page.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../StageKit";
import c from "./CroCards.module.css";

/** a spot on the captured page (1440 x 3260), in its pixels */
const box = (x: number, y: number) => ({ left: `${(x / 1440) * 100}%`, top: `${(y / 3260) * 100}%` });

/** the widget's frame: white, the ⋮ at the top right as in the reference */
function Widget({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={c.widget}>
      <div className={c.wHead}>
        <span className={c.wLabel}>{label}</span>
        <svg className={c.wMore} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </svg>
      </div>
      {children}
    </div>
  );
}

/* ---------- 1: recordings, a table of visits ---------- */

const SOURCES = {
  G: { name: "Google", bg: "#4285f4" },
  M: { name: "Maps", bg: "#34a853" },
  F: { name: "Facebook", bg: "#1877f2" },
  D: { name: "Direct", bg: "#9a958c" },
} as const;

const VISITS: { at: string; city: string; src: keyof typeof SOURCES; len: string; result: string; tone: "bad" | "good" | "off" }[] =
  [
    { at: "9:41", city: "Yakima, WA", src: "G", len: "2:14", result: "Rage click", tone: "bad" },
    { at: "9:27", city: "Selah, WA", src: "M", len: "0:48", result: "Sent quote", tone: "good" },
    { at: "9:03", city: "Union Gap, WA", src: "G", len: "1:31", result: "Left", tone: "off" },
    { at: "8:52", city: "Yakima, WA", src: "D", len: "3:02", result: "Sent quote", tone: "good" },
    { at: "8:40", city: "Moxee, WA", src: "F", len: "0:22", result: "Left", tone: "off" },
    { at: "8:16", city: "Ellensburg, WA", src: "G", len: "1:05", result: "Rage click", tone: "bad" },
    { at: "7:58", city: "Wapato, WA", src: "G", len: "2:40", result: "Called", tone: "good" },
    { at: "7:31", city: "Yakima, WA", src: "M", len: "0:36", result: "Left", tone: "off" },
  ];

export function Recordings() {
  return (
    <Widget label="Recordings · today">
      <table className={c.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Visitor</th>
            <th className={c.colFrom}>From</th>
            <th>Length</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {VISITS.map((v, i) => (
            <tr key={i} style={{ "--i": i } as React.CSSProperties}>
              <td className={c.muted}>{v.at}</td>
              <td>
                <span className={c.who}>
                  <i style={{ background: SOURCES[v.src].bg }}>{v.src}</i>
                  {v.city}
                </span>
              </td>
              <td className={`${c.muted} ${c.colFrom}`}>{SOURCES[v.src].name}</td>
              <td className={c.muted}>{v.len}</td>
              <td>
                <span className={c.status} data-tone={v.tone}>
                  {v.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

/* ---------- 2: heatmap, a month of clicks on the real page ---------- */

// [x, y, size]: in the capture's pixels (1440 wide), size as its width share
const SPOTS: [number, number, number][] = [
  [1300, 99, 15],
  [126, 808, 13],
  [1095, 29, 9],
  [1146, 99, 7],
  [584, 99, 7],
  [1040, 430, 17],
  [932, 99, 5],
  [315, 808, 5],
];

export function Heatmap() {
  return (
    <Widget label="Clicks · home page">
      <div className={c.shotBox}>
        <div className={c.shotPage}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed capture, sized by its frame */}
          <img src="/seo/cro/nwr-page.webp" width={1280} height={2898} alt="" loading="lazy" />
          {SPOTS.map(([x, y, w], i) => (
            <span
              key={i}
              className={c.spot}
              style={{ ...box(x, y), width: `${w}%`, "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </Widget>
  );
}

/* ---------- 3: funnel, PostHog's bars with the drop-off hatched ---------- */

const STEPS = [
  { name: "Visited", n: 1180 },
  { name: "Looked around", n: 672 },
  { name: "Opened the form", n: 132 },
  { name: "Sent it", n: 41 },
];

export function Funnel() {
  return (
    <Widget label="Home page to quote request">
      <div className={c.funnel}>
        <div className={c.axis} aria-hidden>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <ol className={c.fBars}>
          {STEPS.map((st, i) => {
            const prev = i ? STEPS[i - 1].n : st.n;
            const pct = (st.n / STEPS[0].n) * 100;
            return (
              <li key={st.name} style={{ "--i": i } as React.CSSProperties}>
                <span className={c.fCol}>
                  <span className={c.fDrop} style={{ height: `${(prev / STEPS[0].n) * 100}%` }} />
                  <span className={c.fFill} style={{ height: `${Math.max(pct, 2)}%` }} />
                  <b className={c.fPct} style={{ bottom: `${Math.max(pct, 2)}%` }}>
                    {pct < 10 ? pct.toFixed(1) : Math.round(pct)}%
                  </b>
                </span>
                <span className={c.fName}>{st.name}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Widget>
  );
}

/* ---------- 4: A/B test, the two versions' rates ---------- */

function AbTest() {
  return (
    <Widget label="Quote form test · 6 weeks">
      <div className={c.stat}>
        <div className={c.statRow}>
          <span className={c.big}>4.5%</span>
          <span className={c.chip}>B won</span>
        </div>
        <p className={c.statSub}>of visitors sent a quote request with the form at the top</p>
      </div>
      <div className={c.versus}>
        {[
          { k: "A", name: "As it was", v: 3.1 },
          { k: "B", name: "Form at the top", v: 4.5, win: true },
        ].map((r, i) => (
          <div key={r.k} className={c.vRow} data-win={r.win || undefined} style={{ "--i": i } as React.CSSProperties}>
            <span className={c.vKey}>{r.k}</span>
            <span className={c.vName}>{r.name}</span>
            <span className={c.vVal}>{r.v}%</span>
            <span className={c.vBar}>
              <i style={{ width: `${(r.v / 5) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

/* ---------- 5: the ongoing changes, quote requests a week ---------- */

const WEEKS = [8, 9, 7, 9, 8, 9, 8, 10, 8, 9, 10, 11, 10, 12, 11, 12, 13, 12, 13, 14, 12, 13, 14, 15, 13, 15];

function Improvements() {
  return (
    <Widget label="Quote requests per week">
      <div className={c.stat}>
        <div className={c.statRow}>
          <span className={c.big}>14</span>
          <span className={c.chip}>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
            from 8 in June
          </span>
        </div>
      </div>
      <div className={c.weeks} aria-hidden>
        {WEEKS.map((v, i) => (
          <i key={i} style={{ height: `${(v / 16) * 100}%`, "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className={c.weeksFoot} aria-hidden>
        <span>Jun</span>
        <span>Nov</span>
      </div>
    </Widget>
  );
}

const CARDS: { title: string; text: string; Widget: () => React.ReactNode }[] = [
  // the order is William's (Nov 24 2026): the funnel, the heatmap, the
  // changes, then the rest
  {
    title: "We find where people drop off",
    text: "We follow visitors from your home page to your quote form and find the step where most of them leave.",
    Widget: Funnel,
  },
  {
    title: "We see what people click",
    text: "Heatmaps show what gets clicked on every page, and what gets ignored.",
    Widget: Heatmap,
  },
  {
    // not "We fix one thing every month": the work is ongoing (William,
    // Nov 24 2026)
    title: "We keep making changes",
    text: "When something stops people from getting in touch, we change it and check that it helped.",
    Widget: Improvements,
  },
  {
    title: "We watch real visits to your website",
    text: "Recordings show us where people get stuck, like tapping a photo that doesn't open.",
    Widget: Recordings,
  },
  {
    title: "We test changes before we keep them",
    text: "When your site gets enough visitors, we try two versions and keep the one that gets more calls.",
    Widget: AbTest,
  },
];

export default function CroCards({ title, lede }: { title: string; lede: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [shown, setShown] = useState(false);
  const still = useReducedMotion();

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // the bars grow in once, when the cards come on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: still ? "auto" : "smooth" });
  };

  return (
    <div ref={root} className={c.wrap} data-shown={shown || still || undefined}>
      {/* Nov 24 2026, by request: the line on the left and the label and
          heading on the right (mirroring "01 / Get found", whose heading is
          on the left), the arrows under the cards */}
      <div className={c.head}>
        <div className={c.heading}>
          <p className={c.eyebrow}>Conversion rate optimization</p>
          <h2 className={c.title}>{title}</h2>
        </div>
        <p className={c.lede}>{lede}</p>
      </div>

      <div className={c.main}>
        <ul ref={track} className={c.track} onScroll={update}>
          {CARDS.map(({ title: t, text, Widget: W }) => (
            <li key={t} className={c.card}>
              <W />
              <div className={c.words}>
                <h3 className={c.cardTitle}>{t}</h3>
                <p className={c.cardText}>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={c.foot}>
        <div className={c.arrows}>
          <button type="button" className={c.arrow} onClick={() => step(-1)} disabled={atStart} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className={c.arrow} onClick={() => step(1)} disabled={atEnd} aria-label="Next">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className={c.note}>Example data, shown on a website we built.</p>
      </div>
    </div>
  );
}
