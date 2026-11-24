"use client";

/**
 * Draft 1 of "02 / Get chosen": one big panel like a software page's product
 * tour, its tabs playing in turn while the section is on screen (a bar fills
 * the active one) and holding still off screen; picking one stops the turns.
 * Each tab is drawn the way the analytics tools draw it over Northwest
 * Railing's real home page and ends on what we changed. Nov 24 2026, after
 * William's notes: the funnel leads (his favourite), session recordings were
 * cut ("confusing"), the heatmap lost its scroll depth, the A/B test was made
 * plainer and the improvements chart follows PostHog's line charts.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../StageKit";
import CroAbTest from "./CroAbTest";
import CroFunnel from "./CroFunnel";
import CroHeatmap from "./CroHeatmap";
import CroImprovements from "./CroImprovements";
import type { PanelProps } from "./CroKit";
import s from "../SeoCro.module.css";

const TABS: { label: string; ms: number; Panel: (p: PanelProps) => React.ReactNode; icon: React.ReactNode }[] = [
  {
    label: "Conversion funnels",
    ms: 10000,
    Panel: CroFunnel,
    icon: (
      <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
    ),
  },
  {
    label: "Heatmaps",
    ms: 9000,
    Panel: CroHeatmap,
    icon: (
      <>
        <path d="M14 4.1 12 6" />
        <path d="m5.1 8-2.9-.8" />
        <path d="m6 12-1.9 2" />
        <path d="M7.2 2.2 8 5.1" />
        <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
      </>
    ),
  },
  {
    label: "A/B testing",
    ms: 10000,
    Panel: CroAbTest,
    icon: (
      <>
        <rect x="3" y="4" width="7.5" height="16" rx="1.5" />
        <rect x="13.5" y="4" width="7.5" height="16" rx="1.5" />
      </>
    ),
  },
  {
    label: "Website improvements",
    ms: 10500,
    Panel: CroImprovements,
    icon: (
      <>
        <path d="M16 7h6v6" />
        <path d="m22 7-8.5 8.5-5-5L2 17" />
      </>
    ),
  },
];

export default function CroTabs() {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  // bumped when the section comes back on screen, so the bar starts over
  const [visit, setVisit] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const on = e?.isIntersecting ?? false;
        setInView(on);
        if (on) setVisit((v) => v + 1);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep the active tab in view in the sideways row on phones, without
  // scrolling the page
  useEffect(() => {
    const row = tabs.current;
    const btn = row?.children[active] as HTMLElement | undefined;
    if (!row || !btn || row.scrollWidth <= row.clientWidth) return;
    const left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
    row.scrollTo({ left, behavior: still ? "auto" : "smooth" });
  }, [active, still]);

  const tab = TABS[active];
  const playing = inView && !still;

  return (
    <>
      <div ref={root} className={s.panel}>
        <div ref={tabs} className={s.tabs} role="tablist" aria-label="What we use">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={`cro-tab-${i}`}
              aria-selected={i === active}
              aria-controls="cro-stage"
              className={s.tab}
              onClick={() => {
                setAuto(false);
                setActive(i);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {t.icon}
              </svg>
              {t.label}
              {/* the turn's bar; when it fills, the next tab plays */}
              {i === active && auto && !still ? (
                <span
                  key={`${active}-${visit}`}
                  className={s.tabBar}
                  data-paused={!inView || undefined}
                  style={{ animationDuration: `${t.ms}ms` }}
                  onAnimationEnd={() => setActive((a) => (a + 1) % TABS.length)}
                  aria-hidden
                />
              ) : null}
            </button>
          ))}
        </div>

        <div id="cro-stage" role="tabpanel" aria-labelledby={`cro-tab-${active}`} className={s.stage} key={active}>
          <tab.Panel playing={playing} still={still} />
        </div>
      </div>

      <p className={s.note}>Example data, shown on a website we built.</p>
    </>
  );
}
