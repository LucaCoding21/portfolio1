"use client";

/**
 * Draft 3 of "02 / Get chosen" (Nov 24 2026, from an "Agent Canvas"
 * reference William sent: "easy to read, direct and not too much
 * overwhelming information"). On the left, the pillar's name and line, then
 * three numbered steps, only the open one showing its sentence; on the right,
 * one plain white card per step (01 the heatmap) over William's black and white mountain
 * photo (`public/seo/cro-mountain.webp`). The steps take turns every 6s
 * (stopped on hover, focus and with reduced motion) and open on a click.
 * Step 01's card is the heatmap (William kept it from the other drafts),
 * 02 the short form, 03 the result, in five versions
 * with a dev-only picker (?c3=1..5, 5 the default) until William picks one. The figures are examples.
 */
import { useEffect, useState } from "react";
import { Browser } from "./CroKit";
import { Heat } from "./CroHeatmap";
import st from "./CroCanvas.module.css";

const STEPS = [
  {
    title: "We see where people get stuck",
    text: "We watch how visitors use your website, across hundreds of visits, and find where they give up.",
  },
  {
    title: "We fix what’s in the way",
    text: "Like a quote form with 9 questions, cut down to the 4 we actually need.",
  },
  {
    title: "More people get in touch",
    text: "We check the numbers every month, then find the next thing to fix.",
  },
];

const TURN_MS = 6000;

const HEAT_STEPS = 9;

const FIELDS = ["Name", "Phone", "Email", "What do you need?"];

/* ---------- the card for each step ---------- */

/** the heatmap of a month of clicks on a site we built, filling in */
function Stuck({ on, still }: { on: boolean; still: boolean }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (still) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- shows the whole map at once
      setLevel(HEAT_STEPS);
      return;
    }
    setLevel(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setLevel(n);
      if (n >= HEAT_STEPS) window.clearInterval(id);
    }, 160);
    return () => window.clearInterval(id);
  }, [on, still]);

  return (
    <>
      <Browser
        className={st.heatBrowser}
        pageClassName={st.heatPage}
        scrollMs={0}
        tools={<span className={st.heatChip}>Clicks · last month</span>}
        page={level ? <Heat level={level} steps={HEAT_STEPS} /> : null}
      />
      <p className={st.heatFoot}>
        <span className={st.flag}>11% of clicks</span> went on the big photo at
        the top. It isn’t a link.
      </p>
    </>
  );
}

function Fix() {
  return (
    <>
      <p className={st.cardHead}>Quote form</p>
      <div className={st.toggle} aria-hidden>
        <span>Before · 9 questions</span>
        <span data-on>After · 4 questions</span>
      </div>
      <div className={st.fields}>
        {FIELDS.map((f) => (
          <span key={f} className={st.field}>
            {f}
          </span>
        ))}
        <span className={st.send}>Send</span>
      </div>
    </>
  );
}

/* ---------- card 03, four versions while William picks (?c3=1..4) ---------- */

const C3 = [
  { n: 1, name: "Notification" },
  { n: 2, name: "Chart" },
  { n: 3, name: "Big number" },
  { n: 4, name: "Dots" },
  { n: 5, name: "Messages" },
] as const;

/** 5 (Nov 24 2026, from a "Giga" reference William sent): three messages
 * floating on the photo, no card, staggered left and right */
function MoreMessages() {
  return (
    <div className={st.msgs}>
      <p
        className={st.msg}
        data-dark
        data-pos="right"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <span className={st.msgDot} aria-hidden />
        Three more quote requests came in today.
      </p>
      <div
        className={st.msg}
        data-pos="left"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <span className={st.msgDot} aria-hidden />
        <span>
          <span className={st.msgText}>
            That’s 63 this month, up from 41, from the same number of visitors.
            Next, we find the next thing to fix.
          </span>
          <a className={st.msgLink} href="#results">
            See our results
          </a>
        </span>
      </div>
      <p
        className={st.msg}
        data-dark
        data-small
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <span className={st.msgIcon} aria-hidden>
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        That’s 22 more jobs to quote this month.
      </p>
    </div>
  );
}

/** 1: one quote request arriving, two more stacked behind it */
function MoreNote() {
  return (
    <>
      <div className={st.notes}>
        <span className={st.noteBack} data-depth="2" aria-hidden />
        <span className={st.noteBack} data-depth="1" aria-hidden />
        <div className={st.note}>
          <span className={st.noteIcon} aria-hidden>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <span className={st.noteBody}>
            <span className={st.noteTop}>
              <b>New quote request</b>
              <span>now</span>
            </span>
            <span className={st.noteText}>
              Glass railing for a deck, Yakima. Can you come by this week?
            </span>
          </span>
        </div>
      </div>
      <p className={st.cardFoot}>
        One of 63 this month. Before the changes, it was 41.
      </p>
    </>
  );
}

// quote requests a week: 8 weeks before the fix, 6 after
const WEEKS = [9, 10, 9, 11, 9, 10, 10, 9, 12, 14, 15, 16, 15, 17];
const FIX_AT = 7.5;

/** 2: a line of weekly requests that turns up after the fix */
function MoreChart() {
  const W = 300;
  const H = 130;
  const x = (i: number) => 8 + (i / (WEEKS.length - 1)) * (W - 16);
  const y = (v: number) => H - 14 - ((v - 6) / 12) * (H - 34);
  const line = (from: number, to: number) =>
    WEEKS.slice(from, to + 1)
      .map(
        (v, k) =>
          `${k ? "L" : "M"}${x(from + k).toFixed(1)} ${y(v).toFixed(1)}`,
      )
      .join(" ");
  const fx = x(FIX_AT);
  return (
    <>
      <p className={st.cardHead}>Quote requests a week</p>
      <svg className={st.chart} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <line x1={fx} x2={fx} y1="14" y2={H - 8} className={st.chartFix} />
        <text x={fx + 6} y="16" className={st.chartFixText}>
          We fixed the form
        </text>
        <path d={line(0, 8)} className={st.chartBefore} />
        <path d={line(8, WEEKS.length - 1)} className={st.chartAfter} />
        <circle
          cx={x(WEEKS.length - 1)}
          cy={y(WEEKS[WEEKS.length - 1])}
          r="4.5"
          className={st.chartDot}
        />
      </svg>
      <p className={st.cardFoot}>
        <span className={st.up}>+54%</span> from the same number of visitors.
      </p>
    </>
  );
}

/** 3: the number, nothing else */
function MoreBig() {
  return (
    <div className={st.big}>
      <b className={st.bigNum}>+54%</b>
      <p className={st.bigText}>more quote requests, from the same visitors.</p>
    </div>
  );
}

/** 4: a hundred visitors, the ones who get in touch filled in */
function MoreDots() {
  return (
    <>
      <p className={st.cardHead}>Out of every 100 visitors</p>
      <div className={st.dots} aria-hidden>
        {Array.from({ length: 100 }, (_, i) => (
          <i
            key={i}
            data-was={i < 3 || undefined}
            data-new={i === 3 || i === 4 || undefined}
          />
        ))}
      </div>
      <p className={st.cardFoot}>
        <b className={st.dotsStrong}>5 now get in touch.</b> It was 3.
      </p>
    </>
  );
}

const C3_CARDS = [MoreNote, MoreChart, MoreBig, MoreDots, MoreMessages];

export default function CroCanvas({
  title,
  lede,
}: {
  title: string;
  lede: string;
}) {
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(false);
  const [c3, setC3] = useState(5);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reads the setting and the URL once, after hydration */
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const q = Number(new URLSearchParams(window.location.search).get("c3"));
    if (q >= 1 && q <= C3.length) setC3(q);
    setPicker(!window.location.hostname.endsWith("cloverfield.studio"));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const pickC3 = (n: number) => {
    setC3(n);
    setOn(2);
    const url = new URL(window.location.href);
    url.searchParams.set("c3", String(n));
    window.history.replaceState(window.history.state, "", url);
  };
  const More = C3_CARDS[c3 - 1];

  useEffect(() => {
    if (held || still) return;
    const t = window.setTimeout(
      () => setOn((n) => (n + 1) % STEPS.length),
      TURN_MS,
    );
    return () => window.clearTimeout(t);
  }, [on, held, still]);

  return (
    <div
      className={st.canvas}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className={st.left}>
        <h2 className={st.title}>{title}</h2>
        <p className={st.lede}>{lede}</p>

        <ol className={st.steps}>
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={st.step}
              data-on={on === i || undefined}
            >
              <button
                type="button"
                className={st.stepBtn}
                aria-expanded={on === i}
                onClick={() => setOn(i)}
              >
                <span className={st.stepNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step.title}
              </button>
              <div className={st.stepBody}>
                <div>
                  <p className={st.stepText}>{step.text}</p>
                  {!held && !still && on === i && (
                    <span
                      className={st.stepTime}
                      style={{ animationDuration: `${TURN_MS}ms` }}
                      aria-hidden
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={st.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a plain lazy image: next/image's never loaded here in testing */}
        <img
          src="/seo/cro-mountain.webp"
          alt=""
          width={1255}
          height={750}
          loading="lazy"
          decoding="async"
          className={st.bg}
        />
        <div
          className={st.card}
          data-wide
          data-on={on === 0 || undefined}
          aria-hidden={on !== 0}
        >
          <Stuck on={on === 0} still={still} />
        </div>
        <div
          className={st.card}
          data-on={on === 1 || undefined}
          aria-hidden={on !== 1}
        >
          <Fix />
        </div>
        <div
          className={st.card}
          data-bare={c3 === 5 || undefined}
          data-on={on === 2 || undefined}
          aria-hidden={on !== 2}
        >
          <More />
        </div>

        {picker && (
          <div
            className={st.c3Picker}
            role="group"
            aria-label="Card 03 version"
          >
            <span>Card 03</span>
            {C3.map((d) => (
              <button
                key={d.n}
                type="button"
                title={d.name}
                data-on={c3 === d.n || undefined}
                aria-pressed={c3 === d.n}
                onClick={() => pickC3(d.n)}
              >
                {d.n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
