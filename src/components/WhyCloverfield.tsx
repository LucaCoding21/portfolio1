"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { HAND_LABELS } from "@/data/handLabels";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** The section's ground. */
const PAPER = "#F8F2E8";

/** The ink the labels are drawn in, matching the arrows in the photo. */
const LABEL_INK = "#0D0D0D";

/** Seconds between one letter starting and the next. */
const STROKE_STAGGER = 0.09;

/** Slack around a letter's box, in viewBox units, so the sweep clears it. */
const SWEEP_PAD = 3;

/**
 * The two hand-drawn arrows are already part of `team.webp`, so these labels
 * only have to land at the right end of each one. Measured off the artwork:
 * the top-right arrow starts around 89% across and 11% down, and the
 * bottom-left arrow ends around 2% across and 99% down. Percentages, so the
 * pairing holds at every width.
 *
 * Nudge `top`/`right`/`bottom`/`left` if the labels drift off their arrows.
 */
const LABELS = [
  {
    key: "developer",
    title: "The Developer",
    /** Above the tail of the arrow that curves down toward him. Wide enough
     * to run past the photo's right edge, so it sits in the margin. */
    className: "right-[-6%] top-[-12%] w-[62%] md:right-[-20%] md:w-[66%]",
  },
  {
    key: "designer",
    title: "The Designer",
    /** Under the tail of the arrow that sweeps up toward her — the arrow
     * runs to the very bottom of the artwork, so this hangs below it. */
    className: "left-[-4%] top-[104%] w-[58%] md:left-[-8%] md:w-[60%]",
  },
] as const;

/** PLACEHOLDER — swap for your own words. */
const STATEMENT =
  "We build the site we would want for our own business. No templates, no waiting, nothing that only looks good. Every project is drawn from scratch, built around how the business actually wins work, and judged on what it brings in once it is live.";

/**
 * Rises a block of text in line by line, the same way the studio copy in
 * About does: SplitText breaks it on its rendered line breaks and wraps each
 * line in an `overflow: hidden` mask, so every line slides up from behind its
 * own edge once it scrolls into view. `autoSplit` re-runs the split when the
 * width changes or a web font lands late, which keeps the lines honest.
 */
function useSplitLines<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: true,
            },
          }),
      });
    });

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return ref;
}

/**
 * One label, written on letter by letter with real `stroke-dashoffset` tweens.
 *
 * The letters stay solid and a mask does the writing. Each letter gets its own
 * mask holding a single horizontal line as thick as the letter is tall, and
 * that line's dash offset runs out left to right — so the mask is a band
 * sweeping across the letter, uncovering it as it goes.
 *
 * It sweeps rather than traces because the artwork gives the *contour* of the
 * handwriting, not a centre line through it. Tracing a contour walks the
 * perimeter: down one side of a stem, along the bottom, back up the other
 * side, so the letter surfaces as disconnected slivers instead of filling in.
 *
 * One mask per letter, never one for the wordmark: a mask band is wider than
 * the pen, and a shared mask would uncover pieces of the letters either side.
 *
 * The resting markup is the finished label with the mask fully drawn, so if JS
 * never runs the label still reads.
 */
function HandLabel({
  label,
}: {
  label: (typeof LABELS)[number];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const art = HAND_LABELS[label.key];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sweeps = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-sweep]")
    );
    if (!sweeps.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 88%", once: true },
      });

      sweeps.forEach((sweep, i) => {
        // A straight line, so its length is exactly the distance the band has
        // to travel.
        const length = sweep.getTotalLength();

        gsap.set(sweep, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // Linear: a pen crossing one letter doesn't accelerate.
        tl.to(
          sweep,
          { strokeDashoffset: 0, duration: 0.26, ease: "none" },
          i * STROKE_STAGGER
        );
      });
    }, svg);

    return () => ctx.revert();
  }, [label.key]);

  const maskId = `hand-label-${label.key}`;

  return (
    <svg
      ref={svgRef}
      viewBox={art.viewBox}
      role="img"
      aria-label={label.title}
      className={`pointer-events-none absolute h-auto ${label.className}`}
    >
      {/* One mask per letter, each covering only its own ink. A single mask
          over the whole wordmark leaks: the mask stroke is far wider than the
          pen, so a letter being drawn uncovers slivers of the letters beside
          it, which is what put stray marks ahead of the pen. */}
      {art.letters.map((letter, i) => {
        const [x0, y0, x1, y1] = letter.box;
        const midY = (y0 + y1) / 2;

        return (
          <g key={i}>
            <mask id={`${maskId}-${i}`} maskUnits="userSpaceOnUse">
              {/* A butt cap keeps the band's leading edge straight, so the
                  letter is uncovered by a clean vertical wipe. */}
              <path
                data-sweep
                d={`M${x0 - SWEEP_PAD} ${midY} H${x1 + SWEEP_PAD}`}
                fill="none"
                stroke="#fff"
                strokeWidth={y1 - y0 + SWEEP_PAD * 2}
                strokeLinecap="butt"
              />
            </mask>
            {/* The letter and its counters are one path, so the holes in e, o,
                p and D stay punched out. */}
            <path d={letter.d} fill={LABEL_INK} mask={`url(#${maskId}-${i})`} />
          </g>
        );
      })}
    </svg>
  );
}

export default function WhyCloverfield() {
  const headlineRef = useSplitLines<HTMLHeadingElement>();
  const statementRef = useSplitLines<HTMLParagraphElement>();

  return (
    <section
      id="why-cloverfield"
      className="px-6 pb-40 pt-16 md:px-10 md:pb-64 md:pt-24"
      style={{ backgroundColor: PAPER }}
    >
      {/* The headline carries the opening: big, bold and set hard left, so
          the section starts with a statement rather than a label. */}
      <h2
        ref={headlineRef}
        className="max-w-[52ch] text-balance font-[family-name:var(--font-outfit)] text-[clamp(1.625rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-[#111113]"
      >
        Two of us, one studio, and a fairly strong opinion about how websites
        ought to be built.
      </h2>

      {/* Portrait, centred, with the labels pinned to it — so they travel with
          the photo instead of being positioned against the section. */}
      <div className="relative mx-auto mt-24 w-full max-w-[300px] md:mt-40 md:max-w-[440px]">
        <Image
          src="/team.webp"
          alt="The two of us behind Cloverfield Studio, the designer and the developer"
          width={1050}
          height={1201}
          sizes="(max-width: 767px) 300px, 440px"
          className="h-auto w-full"
          priority={false}
        />

        {LABELS.map((label) => (
          <HandLabel key={label.key} label={label} />
        ))}
      </div>

      {/* The statement carries the section. Set exactly like the studio copy
          in About — same face, weight, size, leading, tracking and measure —
          just centred here and inked for the light ground. */}
      <p
        ref={statementRef}
        className="mx-auto mt-32 max-w-[50ch] text-center font-[family-name:var(--font-outfit)] text-[clamp(1.25rem,2.4vw,2.125rem)] font-normal leading-[1.3] tracking-tight text-[#111113] md:mt-56"
      >
        {STATEMENT}
      </p>

      {/* Outline CTA: a hairline box and a mono label, so it reads as a marker
          on the page rather than as a filled button competing with the type.
          Points at the booking section, same target as the header's. */}
      <div className="mt-14 flex justify-center md:mt-20">
        <Link
          href="/#contact"
          className="group inline-flex items-center gap-3 border border-[#111113]/30 px-8 py-4 font-[family-name:var(--font-sometype)] text-xs uppercase tracking-[0.14em] text-[#111113] transition-colors duration-300 hover:bg-[#111113] hover:text-[#F8F2E8] md:px-10 md:py-5 md:text-[13px]"
        >
          Book a call
          <span
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
