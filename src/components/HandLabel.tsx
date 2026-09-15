"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { HAND_LABELS } from "@/data/handLabels";

gsap.registerPlugin(ScrollTrigger);

/** The ink the labels are drawn in, matching the arrows in the photo. */
export const LABEL_INK = "#0D0D0D";

/** Seconds between one letter starting and the next. */
const STROKE_STAGGER = 0.09;

/** Slack around a letter's box, in viewBox units, so the sweep clears it. */
const SWEEP_PAD = 3;

export type HandLabelSpec = {
  key: keyof typeof HAND_LABELS;
  title: string;
  /** Absolute position and width against the photo wrapper. */
  className: string;
};

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
export default function HandLabel({ label }: { label: HandLabelSpec }) {
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
