"use client";

import { useRef, useState } from "react";
import Reveal from "./Reveal";
import { P, Icon } from "./SightUI";
import { gsap, reducedMotion } from "./motion";
import { BOOK_URL } from "./constants";

/**
 * FAQ: the questions that come up on every first call, answered the way
 * we'd answer them out loud. Headline and a line on the left, one open
 * row at a time on the right, height-auto expand. Nothing clever; FAQ
 * is where cleverness goes to die.
 */

const ITEMS: [string, string][] = [
  [
    "What if our data is a mess?",
    "It always is. Sorting it out is part of the build, not an extra. We connect the tools, find where the numbers disagree, and clean it up with you before anything goes live.",
  ],
  [
    "What if it gets a number wrong?",
    "The numbers aren't guessed. They're computed straight from your records, and every answer shows which tool it came from so you can check it yourself. The AI writes the sentence, the math is fixed.",
  ],
  [
    "Which tools do you support?",
    "Anything cloud-based with an export or a connection: QuickBooks Online, Xero, Jobber, Housecall Pro, Google Calendar and Sheets, HubSpot, Shopify, Stripe and most trade tools. We confirm yours connect before the build starts.",
  ],
  [
    "How much of my time does it take?",
    "A few hours across the 45 days. One call to walk us through how the business runs, one to agree which checks matter for your trade, and a short session to train whoever runs the books and the schedule.",
  ],
  [
    "Who can see our numbers?",
    "You, and whoever you add. Your data sits on its own, never mixed with another business, and nobody at Cloverfield looks at it unless you ask us to while we're building.",
  ],
  [
    "Our own tech person could build this. Why you?",
    "They probably could build a version, and then own it forever. We build the plumbing and keep it alive: monitoring, fixes when a vendor changes something, and new checks as the business changes. Your team gets to use it instead of maintaining it.",
  ],
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const duration = reducedMotion() ? 0 : 0.35;

    if (open !== null && panels.current[open]) {
      gsap.to(panels.current[open], { height: 0, duration, ease: "power2.inOut" });
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
    <section id="faq" className="scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto w-[95%] max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
          <Reveal selector="[data-reveal]" className="lg:sticky lg:top-28 lg:self-start">
            <h2
              data-reveal
              className="max-w-[13ch] font-medium leading-[1.06] tracking-[-0.025em] text-[var(--ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3.1rem)" }}
            >
              Questions owners ask us.
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-[26rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
            >
              The ones that come up on every first call, answered the way we
              answer them out loud.
            </p>
            <a
              data-reveal
              href={BOOK_URL}
              className="mt-7 inline-flex items-center gap-2 text-[0.95rem] font-medium text-[var(--ink)] transition-colors hover:text-[var(--blue-deep)]"
            >
              Something else? Ask us on the call
              <Icon d={P.chevronRight} className="h-4 w-4" />
            </a>
          </Reveal>

          <Reveal>
            <div className="flex flex-col gap-3">
              {ITEMS.map(([q, a], i) => (
                <div
                  key={q}
                  className="overflow-hidden rounded-2xl border bg-white transition-colors duration-300"
                  style={{ borderColor: open === i ? "#DADCE0" : "var(--line)" }}
                >
                  <h3>
                    <button
                      onClick={() => toggle(i)}
                      aria-expanded={open === i}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-7"
                    >
                      <span className="text-[1.06rem] font-medium text-[var(--ink)] md:text-[1.125rem]">
                        {q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink-soft)] transition-transform duration-300 ${
                          open === i ? "rotate-90" : ""
                        }`}
                      >
                        <Icon d={P.chevronRight} className="h-3.5 w-3.5" />
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
                    style={{ height: i === 0 ? "auto" : 0, overflow: "hidden" }}
                  >
                    <p className="max-w-[36rem] px-6 pb-6 text-[1.02rem] leading-[1.6] text-[var(--ink-soft)] md:px-7">
                      {a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
