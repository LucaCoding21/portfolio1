"use client";

import { gsap, useSightGsap } from "./motion";

/**
 * The cost of finding out late: the emotional peak. No cards, no product
 * UI — three editorial vignettes, ink on white, each fading up on its own
 * scroll trigger. The one flourish: the money/date phrases start gray and
 * shift to ink as their block enters, the "realization" beat.
 */

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span data-mark style={{ color: "var(--ink-faint)" }}>
      {children}
    </span>
  );
}

const VIGNETTES: { line: React.ReactNode; sub: string }[] = [
  {
    line: (
      <>
        A dealer stopped ordering in <Mark>March</Mark>. Somebody noticed in{" "}
        <Mark>July</Mark>.
      </>
    ),
    sub: "Four months of orders, gone silently.",
  },
  {
    line: (
      <>
        Materials jumped <Mark>9%</Mark> in the spring. The price list
        didn&apos;t.
      </>
    ),
    sub: "Every job since shipped at last year's margin.",
  },
  {
    line: (
      <>
        <Mark>$40,000</Mark> has been sitting in stock for a year.
      </>
    ),
    sub: "Nobody had an afternoon to go count it.",
  },
];

export default function CostOfLate() {
  const scope = useSightGsap<HTMLDivElement>((root, reduced) => {
    gsap.utils.toArray<HTMLElement>("[data-vignette]", root).forEach((block) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: block, start: "top 75%", once: true },
      });
      tl.from(block, {
        autoAlpha: 0,
        y: reduced ? 0 : 16,
        duration: 0.6,
        ease: "power3.out",
      });
      const marks = block.querySelectorAll<HTMLElement>("[data-mark]");
      if (marks.length) {
        tl.to(
          marks,
          { color: "var(--ink)", duration: reduced ? 0 : 0.8, ease: "power2.inOut" },
          reduced ? 0 : 0.35
        );
      }
    });
  });

  return (
    <section className="py-32 md:py-48">
      <div ref={scope} className="mx-auto max-w-[1200px] px-6 md:px-10">
        <p
          data-vignette
          className="text-[0.875rem] font-medium text-[var(--ink-faint)]"
        >
          What this actually costs.
        </p>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {VIGNETTES.map(({ line, sub }) => (
            <div key={sub} data-vignette>
              <h3
                className="max-w-[34ch] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink)]"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
              >
                {line}
              </h3>
              <p className="mt-3 max-w-[42ch] text-[1.06rem] leading-[1.6] text-[var(--ink-faint)]">
                {sub}
              </p>
            </div>
          ))}

          <p
            data-vignette
            className="max-w-[30ch] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.7rem, 3.1vw, 2.4rem)" }}
          >
            None of these are data problems. The data knew the whole time.
            Nobody had time to check.
          </p>
        </div>
      </div>
    </section>
  );
}
