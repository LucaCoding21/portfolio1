"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { T, Spark } from "./SightUI";
import { gsap, reducedMotion } from "./motion";

/**
 * The questions wall: industry tabs over a loose cloud of question chips.
 * The chips are styled as the product's ask-bar input, so the wall reads
 * as "things you could type into Sight". One chip per industry is live:
 * after the stagger settles it pulses a blue ring, then a compact answer
 * card unfolds beneath the cloud in the demo-card style.
 */

type LiveAnswer = {
  chip: string;
  tone?: "warn" | "up";
  stat?: string;
  sub?: string;
  rows?: { name: string; value: string; warn?: boolean }[];
  action: string;
};

type Question = { q: string; live?: LiveAnswer };

const TABS: { id: string; label: string; questions: Question[] }[] = [
  {
    id: "distribution",
    label: "Distribution & manufacturing",
    questions: [
      { q: "Who owes me money right now?" },
      {
        q: "Which dealers went quiet this quarter?",
        live: {
          chip: "3 found",
          rows: [
            { name: "Northgate Builders", value: "quiet 62 days", warn: true },
            { name: "Coast Building Supply", value: "quiet 45 days" },
            { name: "Meridian Logistics", value: "quiet 38 days" },
          ],
          action: "worth a call this Tuesday",
        },
      },
      { q: "What did we make on that job after the material jump?" },
      { q: "How much cash is sitting in slow stock?" },
      { q: "Which orders are trending late this week?" },
      { q: "Which accounts are shrinking but still ordering?" },
      { q: "What did late shipments cost us last year?" },
    ],
  },
  {
    id: "home-services",
    label: "Home services",
    questions: [
      { q: "Which lead source turns into profitable jobs?" },
      {
        q: "Which quotes died because nobody followed up?",
        live: {
          chip: "14 quotes",
          stat: "$86,400",
          sub: "in quotes from the last 90 days never got a second touch",
          action: "a two-line email wins some of these back",
        },
      },
      { q: "What did the Oakridge job actually make us?" },
      { q: "Whose jobs keep coming back as callbacks?" },
      { q: "How booked are we three weeks out?" },
      { q: "Who should we call about a maintenance plan?" },
      { q: "Which crew finishes on budget most often?" },
    ],
  },
  {
    id: "print",
    label: "Print",
    questions: [
      { q: "Who hasn't reordered in over a year?" },
      {
        q: "What's our real margin on rush jobs?",
        live: {
          chip: "check pricing",
          rows: [
            { name: "Rush · under 48h", value: "11% margin", warn: true },
            { name: "Standard · 5 day", value: "27% margin" },
            { name: "Large format", value: "31% margin" },
          ],
          action: "the rush fee hasn't moved since 2023",
        },
      },
      { q: "Which jobs lost money after reprints?" },
      { q: "What did the paper price jump do to open quotes?" },
      { q: "Who owes us past 45 days?" },
      { q: "Which customers only order on discount?" },
      { q: "Which press eats the most in waste?" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    questions: [
      {
        q: "Which renewals are at risk in the next 60 days?",
        live: {
          chip: "5 flagged",
          rows: [
            { name: "Meridian Transport", value: "2 claims · quiet 7 mo", warn: true },
            { name: "Kwan Holdings", value: "premium up 18%" },
            { name: "Delta Fabrication", value: "quiet 9 months" },
          ],
          action: "three calls this week saves most of these",
        },
      },
      { q: "Who's underinsured compared to clients like them?" },
      { q: "Which carriers pay claims slowest?" },
      { q: "Where do hours go that never become commission?" },
      { q: "Whose accounts walk if our top producer leaves?" },
      { q: "What's a referral actually worth over five years?" },
    ],
  },
];

const CHIP_HEX = { warn: T.AMBER, up: T.GREEN } as const;

/** The compact answer card that unfolds under the live chip's cloud. */
function AnswerCard({ q, a }: { q: string; a: LiveAnswer }) {
  const chipHex = CHIP_HEX[a.tone ?? "warn"];
  return (
    <div
      className="sight-app max-w-[460px] overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.06)]"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{ borderColor: `${T.LINE}b3`, backgroundColor: T.SURFACE2 }}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span style={{ color: T.BLUE }}>
            <Spark className="h-3 w-3 shrink-0" />
          </span>
          <span
            className="truncate text-[11px] font-medium"
            style={{ color: T.MUTED }}
          >
            {q}
          </span>
        </span>
        <span
          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium"
          style={{ borderColor: `${chipHex}4d`, backgroundColor: `${chipHex}1a`, color: chipHex }}
        >
          {a.chip}
        </span>
      </div>

      <div className="px-4 pb-3.5 pt-3.5">
        {a.stat && (
          <p
            className="text-[1.6rem] font-semibold leading-none tracking-tight tabular-nums"
            style={{ color: T.INK }}
          >
            {a.stat}
          </p>
        )}
        {a.sub && (
          <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: T.MUTED }}>
            {a.sub}
          </p>
        )}
        {a.rows && (
          <div className={a.stat || a.sub ? "mt-3" : ""}>
            {a.rows.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0"
                style={{ borderColor: `${T.LINE}80` }}
              >
                <span
                  className="min-w-0 truncate text-[13px] font-medium"
                  style={{ color: T.INK }}
                >
                  {row.name}
                </span>
                {row.warn ? (
                  <span
                    className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums"
                    style={{ borderColor: `${T.AMBER}4d`, backgroundColor: `${T.AMBER}1a`, color: T.AMBER }}
                  >
                    {row.value}
                  </span>
                ) : (
                  <span
                    className="shrink-0 text-right text-[13px] font-semibold tabular-nums"
                    style={{ color: T.INK }}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-1.5 border-t px-4 py-2.5 text-[11px] font-medium"
        style={{ borderColor: `${T.LINE}b3`, color: T.BLUE }}
      >
        <span aria-hidden="true">→</span>
        {a.action}
      </div>
    </div>
  );
}

export default function QuestionsWall() {
  const [tab, setTab] = useState(0);
  const cloudRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const firstRender = useRef(true);

  const switchTab = (i: number) => {
    if (i === tab || animating.current) return;
    const cloud = cloudRef.current;
    if (!cloud || reducedMotion()) {
      setTab(i);
      return;
    }
    animating.current = true;
    gsap.to(gsap.utils.toArray("[data-chip]", cloud), {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.18,
      ease: "power2.in",
    });
    gsap.to(panelRef.current, {
      height: 0,
      autoAlpha: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setTab(i),
    });
  };

  // First view: chips stagger up on scroll. Tab switch: incoming stagger
  // immediately. Either way, once the chips settle the live chip pulses a
  // ring and its answer card unfolds.
  useLayoutEffect(() => {
    const cloud = cloudRef.current;
    const panel = panelRef.current;
    if (!cloud || !panel) return;

    const ctx = gsap.context(() => {
      const reduced = reducedMotion();
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", cloud);
      const liveChip = cloud.querySelector<HTMLElement>("[data-live-chip]");

      if (reduced) {
        gsap.set(panel, { height: "auto", autoAlpha: 1 });
        if (liveChip) gsap.set(liveChip, { borderColor: "rgba(37, 99, 235, 0.45)" });
        animating.current = false;
        firstRender.current = false;
        return;
      }

      gsap.set(panel, { height: 0, autoAlpha: 0 });

      const goLive = () => {
        animating.current = false;
        if (liveChip) {
          gsap.to(liveChip, { borderColor: "rgba(37, 99, 235, 0.45)", duration: 0.25 });
          gsap.fromTo(
            liveChip,
            { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.35)" },
            {
              boxShadow: "0 0 0 10px rgba(37, 99, 235, 0)",
              duration: 0.8,
              ease: "power1.out",
              repeat: 1,
              clearProps: "boxShadow",
            }
          );
        }
        gsap.fromTo(
          panel,
          { height: 0, autoAlpha: 0 },
          { height: "auto", autoAlpha: 1, duration: 0.4, ease: "power3.inOut", delay: 0.55 }
        );
      };

      if (firstRender.current) {
        gsap.from(chips, {
          autoAlpha: 0,
          y: 12,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.04,
          scrollTrigger: { trigger: cloud, start: "top 80%", once: true },
          onComplete: goLive,
        });
      } else {
        animating.current = true;
        gsap.fromTo(
          chips,
          { autoAlpha: 0, y: 12, scale: 1 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.04,
            onComplete: goLive,
          }
        );
      }
      firstRender.current = false;
    }, cloud);

    return () => ctx.revert();
  }, [tab]);

  const active = TABS[tab];
  const liveQuestion = active.questions.find((item) => item.live);

  return (
    <section id="questions" className="scroll-mt-24 py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal selector="[data-reveal]">
          <h2
            data-reveal
            className="font-medium leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
          >
            The questions you can&apos;t easily answer today.
          </h2>

          <div
            data-reveal
            role="tablist"
            aria-label="Industry"
            className="-mx-6 mt-8 flex snap-x gap-1.5 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === tab}
                aria-controls="questions-panel"
                onClick={() => switchTab(i)}
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-[0.875rem] transition-colors duration-200 ${
                  i === tab
                    ? "bg-[var(--surface)] font-medium text-[var(--ink)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          id="questions-panel"
          role="tabpanel"
          className="mt-6 rounded-[2rem] bg-[var(--surface)] p-6 md:p-10"
        >
          <div ref={cloudRef}>
            <div className="flex flex-wrap gap-2.5 md:gap-3">
              {active.questions.map((item) => (
                <span
                  key={item.q}
                  data-chip
                  {...(item.live ? { "data-live-chip": true } : {})}
                  className="sight-app inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-[13px] font-medium leading-snug shadow-[0_1px_2px_0_rgba(20,24,33,0.04)]"
                  style={{ borderColor: "#ECEDEF", color: T.INK }}
                >
                  <span className="shrink-0" style={{ color: T.BLUE }}>
                    <Spark className="h-3 w-3" />
                  </span>
                  {item.q}
                </span>
              ))}
            </div>

            <div ref={panelRef} className="overflow-hidden">
              {liveQuestion?.live && (
                <div className="pt-6">
                  <AnswerCard q={liveQuestion.q} a={liveQuestion.live} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
