"use client";

import { useRef, useState } from "react";
import Reveal from "./Reveal";
import { P, Icon } from "./SightUI";
import { gsap, reducedMotion } from "./motion";

/**
 * FAQ: five white pill rows, one open at a time, height-auto expand.
 * Nothing clever; FAQ is where cleverness goes to die.
 */

const ITEMS: [string, string][] = [
  [
    "What if our data is a mess?",
    "It always is. Cleaning it up is part of the build, not an extra.",
  ],
  [
    "What if the AI gets a number wrong?",
    "The important numbers aren't guessed. They're computed straight from your real data. The AI explains and navigates; the math is deterministic.",
  ],
  [
    "Our own tech person could build this. Why you?",
    "They probably could build a version, and then own the maintenance forever. We build the plumbing and keep it alive; your team builds on top of it.",
  ],
  [
    "What's the monthly fee for?",
    "It's a live system: monitoring, fixes when your vendors change things, the AI bill, and new features every month.",
  ],
  [
    "What software do you support?",
    "Anything cloud-based with an export or an API: QuickBooks Online, Xero, Google Sheets, Jobber, HubSpot, Shopify, and most industry tools. We confirm yours work before you pay anything.",
  ],
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const duration = reducedMotion() ? 0 : 0.35;

    if (open !== null && panels.current[open]) {
      gsap.to(panels.current[open], {
        height: 0,
        duration,
        ease: "power2.inOut",
      });
    }
    if (next !== null && panels.current[next]) {
      gsap.fromTo(
        panels.current[next],
        { height: 0 },
        { height: "auto", duration, ease: "power2.inOut" }
      );
    }
    setOpen(next);
  };

  return (
    <section id="faq" className="scroll-mt-24 py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <h2
            className="font-medium leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
          >
            Questions owners ask us.
          </h2>
        </Reveal>

        <Reveal className="mt-10 max-w-3xl md:mt-14">
          <div className="flex flex-col gap-3">
            {ITEMS.map(([q, a], i) => (
              <div
                key={q}
                className="overflow-hidden rounded-2xl border bg-white"
                style={{ borderColor: "#ECEDEF" }}
              >
                <h3>
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={open === i}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-[1.06rem] font-medium text-[var(--ink)] md:text-[1.125rem]">
                      {q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-[var(--ink-soft)] transition-transform duration-300 ${
                        open === i ? "rotate-90" : ""
                      }`}
                    >
                      <Icon d={P.chevronRight} className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  style={{ height: 0, overflow: "hidden" }}
                >
                  <p className="max-w-[34rem] px-6 pb-6 text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]">
                    {a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
