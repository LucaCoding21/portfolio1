"use client";

/**
 * Draft 2 of "02 / Get chosen" (Nov 24 2026, William's pick of three ideas):
 * one visitor's story instead of tabs. The section pins while you scroll and
 * steps through six short lines on the left; the site on the right (Northwest
 * Railing's real home page) shows each one: they find it on Google, click
 * the big photo (not a link), give up on a 9-question quote form, we see it
 * across every visit (the heatmap and the funnel's numbers), we fix it, and
 * more people get in touch. No tool names, so an owner follows it without
 * knowing what a funnel is. Example data, the same as the tabs'.
 */
import { useEffect, useRef, useState } from "react";
import { StageCursor, useReducedMotion, useTargetPoint } from "../StageKit";
import { box, Browser, pick } from "./CroKit";
import { Heat } from "./CroHeatmap";
import st from "./CroStory.module.css";

const STEPS = [
  "Someone nearby searches Google and finds your website.",
  "They click the big photo to see your work. It isn't a link, so nothing happens.",
  "They open the quote form, see 9 questions, and leave without sending it.",
  "We see this in your numbers every month, across hundreds of visits, not just one.",
  "So we fix it. The photo opens your projects, and the form asks 4 questions.",
  "More of your visitors get in touch. Then we find the next thing to fix.",
];

/** where the cursor goes in each step, by ms since the step began */
const CURSOR: [number, string | null][][] = [
  [
    [0, "rest"],
    [700, "result"],
    [2100, "rest"],
  ],
  [[0, "photo"]],
  [
    [0, "rest"],
    [450, "field"],
    [1700, "exit"],
    [2100, null],
  ],
  [[0, null]],
  [
    [0, "rest"],
    [600, "send"],
  ],
  [[0, null]],
];

const PRESSES: number[][] = [[1600], [700, 950, 1200, 1450], [], [], [1300], []];

const FORM = [
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Street address",
  "City",
  "Type of railing",
  "Feet of railing",
  "When do you need it?",
];

// quote requests a week, June to November (the tabs' improvements chart)
const WEEKS = [8, 9, 7, 9, 8, 9, 8, 10, 8, 9, 10, 11, 10, 12, 11, 12, 13, 12, 13, 14, 12, 13, 14, 15, 13, 15];
const trend = WEEKS.map((v, i) => `${i ? "L" : "M"}${(i / (WEEKS.length - 1)) * 100},${100 - (v / 16) * 100}`).join(
  " ",
);

/** ms since `key` last changed, counted while it holds, up to `max` */
function useSince(key: number, max: number, still: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (still) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const e = performance.now() - start;
      setT(Math.min(e, max));
      if (e >= max) window.clearInterval(id);
    }, 60);
    return () => {
      window.clearInterval(id);
      setT(0);
    };
  }, [key, max, still]);
  return still ? max : t;
}

export default function CroStory() {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const still = useReducedMotion();
  const t = useSince(step, 6000, still);

  // the step follows how far the pinned part has been scrolled
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = Math.min(Math.max(-r.top / run, 0), 0.9999);
      setStep(Math.floor(p * STEPS.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / STEPS.length) * run, behavior: still ? "auto" : "smooth" });
  };

  const target = pick(t, CURSOR[step]);
  const p = useTargetPoint(view, target ?? "rest", step);
  const presses = PRESSES[step];
  const pressed = presses.some((ms) => t >= ms && t < ms + 110);

  const googleGone = step > 0 || t >= 1950;
  const rage = step === 1 && t >= 1500;
  const left = step === 2 && t >= 2000;
  const sent = step === 4 && t >= 1450;

  return (
    <div ref={root} className={st.story} style={{ "--n": STEPS.length } as React.CSSProperties}>
      <div className={st.sticky}>
        <ol className={st.steps}>
          {STEPS.map((text, i) => (
            <li key={text} data-on={i === step || undefined} data-done={i < step || undefined}>
              <button type="button" onClick={() => go(i)}>
                <span className={st.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={st.text}>{text}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className={st.visual} data-step={step}>
          <Browser
            viewRef={view}
            className={st.browser}
            pageClassName={step === 3 ? st.pageDim : undefined}
            scrollMs={0}
            page={
              <>
                <i className={st.target} data-target="rest" data-ax="0.5" data-ay="0.5" style={box(700, 640, 200, 60)} />
                <i className={st.target} data-target="photo" data-ax="0.5" data-ay="0.5" style={box(960, 360, 160, 140)} />

                {/* 2: the photo that won't open */}
                <span className={st.rageNote} data-on={rage || undefined} style={box(1040, 330)}>
                  Clicked 4 times. Nothing happened.
                </span>

                {/* 4: the heatmap, filling in */}
                <span className={st.heatWrap} data-on={step === 3 || undefined}>
                  {step === 3 ? <Heat level={still ? 9 : Math.min(9, Math.floor(t / 150) + 1)} steps={9} /> : null}
                </span>

                {/* 5 and 6: the fixed page, the form at the top and the photo a link */}
                <div className={st.fixForm} data-on={step >= 4 || undefined} style={box(944, 250, 400, 520)}>
                  <p className={st.ffTitle}>Get a free quote</p>
                  <span className={st.ffField}>Your name</span>
                  <span className={st.ffField}>Phone</span>
                  <span className={st.ffField}>Type of railing</span>
                  <span className={st.ffBtn} data-target="send" data-ax="0.5" data-ay="0.55">
                    Send
                  </span>
                </div>
              </>
            }
            over={
              <>
                {/* 1: the search that found them */}
                <div className={st.google} data-on={!googleGone || undefined}>
                  <div className={st.gCard}>
                    <span className={st.gSearch}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                      railing installation yakima
                    </span>
                    <div className={st.gResult} data-target="result" data-ax="0.3" data-ay="0.55">
                      <span className={st.gSite}>
                        <i>NR</i>
                        <span>
                          Northwest Railing
                          <small>northwestrailing.com</small>
                        </span>
                      </span>
                      <span className={st.gTitle}>Custom Railings in Yakima, WA | Northwest Railing</span>
                      <span className={st.gLine} />
                      <span className={st.gLine} data-short />
                    </div>
                    <span className={st.gLine} data-faint />
                    <span className={st.gLine} data-faint data-short />
                  </div>
                </div>

                {/* 3: the long quote form */}
                <div className={st.modal} data-on={(step === 2 && !left) || undefined}>
                  <div className={st.mCard}>
                    <p className={st.mTitle}>Get a Free Quote</p>
                    <div className={st.mGrid}>
                      {FORM.map((f, i) => (
                        <span
                          key={f}
                          className={st.mField}
                          data-target={i === 2 ? "field" : undefined}
                          data-ax="0.6"
                          data-ay="0.5"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <span className={st.mBtn}>Submit</span>
                  </div>
                </div>
                <i className={st.target} data-target="exit" data-ax="0.5" data-ay="0" style={{ left: "70%", top: 0, width: 40, height: 4 }} />

                {/* chips that say what happened */}
                <span className={st.chip} data-bad data-on={left || undefined}>
                  Left without sending it
                </span>
                <span className={st.chip} data-good data-on={sent || undefined}>
                  Quote request sent
                </span>

                {/* 4: the numbers behind it */}
                <div className={st.numbers} data-on={step === 3 || undefined}>
                  <p className={st.nTitle}>Last month</p>
                  <span className={st.nRow}>
                    <span>Opened the quote form</span>
                    <b>132</b>
                  </span>
                  <span className={st.nBar}>
                    <i style={{ width: "100%" }} />
                  </span>
                  <span className={st.nRow}>
                    <span>Sent it</span>
                    <b data-bad>41</b>
                  </span>
                  <span className={st.nBar}>
                    <i data-bad style={{ width: `${(41 / 132) * 100}%` }} />
                  </span>
                  <p className={st.nNote}>Clicks on the big photo: 11%. It isn&rsquo;t a link.</p>
                </div>

                {/* 6: what it adds up to */}
                <div className={st.result} data-on={step === 5 || undefined}>
                  <div className={st.rHead}>
                    <span>Quote requests per week</span>
                    <b>
                      8 <i>→</i> 14
                    </b>
                  </div>
                  <svg className={st.rChart} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                    <path d={`${trend} L100,100 L0,100 Z`} className={st.rArea} />
                    <path d={trend} className={st.rLine} />
                  </svg>
                  <span className={st.rFoot}>
                    <span>June</span>
                    <span>November</span>
                  </span>
                </div>

                {p
                  ? presses.map((ms) =>
                      t >= ms && t < ms + 650 ? (
                        <span
                          key={`${step}-${ms}`}
                          className={st.ripple}
                          data-bad={step === 1 || undefined}
                          style={{ left: p.x, top: p.y }}
                        />
                      ) : null,
                    )
                  : null}
                <StageCursor at={p} pressed={pressed} hidden={target == null} still={still} name="" />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
