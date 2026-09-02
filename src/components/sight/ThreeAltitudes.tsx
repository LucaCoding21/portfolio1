"use client";

import Reveal from "./Reveal";
import { T, P, Icon, Spark } from "./SightUI";
import { gsap, ScrollTrigger, useSightGsap } from "./motion";

/**
 * "One system, three ways it pays": three altitudes of the same system.
 * Each card holds a mini product mock that runs a small idle loop once the
 * section is on screen — the answer types on, the report ticks in, the
 * alert toast slides in. Loop cycle lengths differ so they never sync up.
 * With prefers-reduced-motion the loops never run and each mock holds its
 * end state.
 */

const INVOICE_ROWS: [string, string][] = [
  ["Cedar fence panels ×12", "$2,340"],
  ["Post caps ×24", "$180"],
  ["Install labour · 14 h", "$1,150"],
];

const REPORT_ROWS: [string, string][] = [
  ["Revenue", "$96,400 · up 6%"],
  ["Dealers going quiet", "1 flagged · Northgate"],
  ["AR past 45 days", "$48,200 · 12 invoices"],
];

function MockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sight-app overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.06)]"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      {children}
    </div>
  );
}

/* ---------- card 1: the ask bar, mid-phone-call ---------- */

function AskMock() {
  return (
    <MockFrame>
      <div
        className="flex items-center gap-2 border-b px-3.5 py-2.5"
        style={{ borderColor: `${T.LINE}b3`, backgroundColor: T.SURFACE2 }}
      >
        <span className="shrink-0" style={{ color: T.BLUE }}>
          <Spark className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 truncate text-[12px]" style={{ color: T.INK }}>
          What&apos;s in the Hendersons&apos; March invoice, itemized?
        </span>
      </div>
      <div className="px-3.5 pb-3.5 pt-3">
        <div className="relative">
          <p
            data-a1-think
            aria-hidden="true"
            className="sight-app-thinking absolute inset-x-0 top-0 text-[12px] font-medium"
            style={{ opacity: 0 }}
          >
            Reading March invoices…
          </p>
          <p data-a1-line className="text-[12px] font-medium" style={{ color: T.INK }}>
            Invoice #1482 · March 12 · $3,670
          </p>
        </div>
        <div className="mt-1">
          {INVOICE_ROWS.map(([name, value]) => (
            <div
              key={name}
              data-a1-row
              className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0"
              style={{ borderColor: `${T.LINE}80` }}
            >
              <span className="min-w-0 truncate text-[12px]" style={{ color: T.MUTED }}>
                {name}
              </span>
              <span
                className="shrink-0 text-[12px] font-semibold tabular-nums"
                style={{ color: T.INK }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- card 2: the Monday report, shrunk ---------- */

function ReportMock() {
  return (
    <MockFrame>
      <div
        className="flex items-center gap-2.5 border-b px-3.5 py-2.5"
        style={{ borderColor: `${T.LINE}b3`, backgroundColor: T.SURFACE2 }}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: T.BLUE }}
        >
          <Icon d={P.mail} className="h-3 w-3" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-medium" style={{ color: T.INK }}>
            Your week in one page
          </span>
        </span>
        <span className="shrink-0 text-[11px]" style={{ color: T.FAINT }}>
          Mon 7:02 AM
        </span>
      </div>
      <div className="px-3.5 py-1.5">
        {REPORT_ROWS.map(([label, value]) => (
          <div
            key={label}
            data-a2-row
            className="flex items-baseline justify-between gap-3 border-b py-2 last:border-b-0"
            style={{ borderColor: `${T.LINE}80` }}
          >
            <span className="text-[12px]" style={{ color: T.INK }}>
              {label}
            </span>
            <span
              className="shrink-0 text-right text-[12px] tabular-nums"
              style={{ color: T.MUTED }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ---------- card 3: the alert toast ---------- */

function AlertMock() {
  return (
    <div
      data-a3-toast
      className="sight-app flex items-start gap-2.5 rounded-xl border bg-white px-3.5 py-3 shadow-[0_1px_2px_0_rgba(20,24,33,0.05),0_16px_32px_-16px_rgba(20,24,33,0.25)]"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      <span
        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: T.AMBER }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-medium leading-snug" style={{ color: T.INK }}>
          Northgate Builders: no order in 62 days
        </span>
        <span className="mt-0.5 block text-[11px]" style={{ color: T.MUTED }}>
          Usual pace: every 3 weeks
        </span>
      </span>
      <span
        data-a3-badge
        className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums"
        style={{ borderColor: `${T.AMBER}4d`, backgroundColor: `${T.AMBER}1a`, color: T.AMBER }}
      >
        62 days
      </span>
    </div>
  );
}

/* ---------- the section ---------- */

const CARDS: { label: string; mock: React.ReactNode; caption: string }[] = [
  {
    label: "In the moment",
    mock: <AskMock />,
    caption: "A customer's on the phone. The answer used to be in a filing cabinet.",
  },
  {
    label: "Every Monday",
    mock: <ReportMock />,
    caption: "Last week in one page, sent before your coffee.",
  },
  {
    label: "Watching always",
    mock: <AlertMock />,
    caption: "Problems flagged the week they start, not the quarter after.",
  },
];

export default function ThreeAltitudes() {
  const scope = useSightGsap<HTMLDivElement>((root, reduced) => {
    gsap.from(gsap.utils.toArray("[data-alt-card]", root), {
      autoAlpha: 0,
      y: reduced ? 0 : 24,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });

    if (reduced) return;

    const loops: gsap.core.Timeline[] = [];

    // Card 1: thinking shimmer, the answer line types on, line items follow.
    const think = root.querySelector<HTMLElement>("[data-a1-think]");
    const line = root.querySelector<HTMLElement>("[data-a1-line]");
    const a1Rows = gsap.utils.toArray<HTMLElement>("[data-a1-row]", root);
    if (think && line && a1Rows.length) {
      const full = line.textContent ?? "";
      const proxy = { n: 0 };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.4, paused: true });
      tl.set(line, { autoAlpha: 0 })
        .set(a1Rows, { autoAlpha: 0, y: 4 })
        .fromTo(think, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.4)
        .to(think, { autoAlpha: 0, duration: 0.2 }, "+=1.1")
        .call(() => {
          line.textContent = "";
        })
        .set(line, { autoAlpha: 1 })
        .to(proxy, {
          n: full.length,
          duration: 0.7,
          ease: "none",
          onStart: () => {
            proxy.n = 0;
          },
          onUpdate: () => {
            line.textContent = full.slice(0, Math.round(proxy.n));
          },
        })
        .to(a1Rows, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.14 }, "+=0.1");
      loops.push(tl);
    }

    // Card 2: the report lines tick in one by one, hold, reset.
    const a2Rows = gsap.utils.toArray<HTMLElement>("[data-a2-row]", root);
    if (a2Rows.length) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1, paused: true });
      tl.set(a2Rows, { autoAlpha: 0, y: 4 })
        .to(a2Rows, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.55 }, 1.2)
        .to(a2Rows, { autoAlpha: 0, duration: 0.3 }, "+=3.6");
      loops.push(tl);
    }

    // Card 3: the toast slides in, the badge pulses once, holds.
    const toast = root.querySelector<HTMLElement>("[data-a3-toast]");
    const badge = root.querySelector<HTMLElement>("[data-a3-badge]");
    if (toast && badge) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1, paused: true });
      tl.set(toast, { autoAlpha: 0, y: 10 })
        .to(toast, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, 2.1)
        .fromTo(
          badge,
          { scale: 1 },
          { scale: 1.12, duration: 0.28, ease: "power1.inOut", yoyo: true, repeat: 1 },
          "+=0.4"
        )
        .to(toast, { autoAlpha: 0, duration: 0.3 }, "+=4.4");
      loops.push(tl);
    }

    // Idle loops only run while the section is on screen.
    ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      end: "bottom top",
      onToggle: (self) => {
        loops.forEach((tl) => (self.isActive ? tl.play() : tl.pause()));
      },
    });
  });

  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <h2
            className="font-medium leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
          >
            One system, three ways it pays.
          </h2>
        </Reveal>

        <div ref={scope} className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.label}
              data-alt-card
              className="flex flex-col rounded-[2rem] bg-[var(--surface)] p-6 md:p-7"
            >
              <span
                className="self-start rounded-full px-3 py-1 text-[12px] font-medium"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.1)", color: T.BLUE }}
              >
                {card.label}
              </span>
              <div className="mt-5 flex-1">{card.mock}</div>
              <p className="mt-5 text-[0.95rem] leading-[1.6] text-[var(--ink-soft)]">
                {card.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
