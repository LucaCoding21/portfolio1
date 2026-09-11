"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { CLIENT_LOGOS, type ClientLogo } from "@/data/clientLogos";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AboutProps {
  ready: boolean;
}

/**
 * PLACEHOLDER figures — deliberately left at `0` so they can't be mistaken for
 * real numbers on the live site. Swap in the actual counts; the count-up
 * runs from 0 to whatever `value` is.
 */
const ABOUT_STATS = [
  { value: 0, suffix: "+", label: "Years of experience" },
  { value: 0, suffix: "+", label: "Projects delivered" },
  { value: 0, suffix: "%", label: "Client satisfaction rate" },
  { value: 0, suffix: "+", label: "Long-term partners" },
];

/** Figures always show at least two digits, so `0` reads as `00`. */
const formatStat = (n: number) => String(Math.round(n)).padStart(2, "0");

const INK = "rgb(255 255 255 / 0.75)";

/** PLACEHOLDER — swap for real copy. */
const STUDIO_COPY =
  "Placeholder text for this slot. Two to four lines of copy about the studio. Who we work with, what we build, and why it performs. Replace when ready.";

/** Seconds between one letter starting and the next. */
const LETTER_STAGGER = 0.11;

/**
 * Section title written on letter by letter with real `stroke-dashoffset`
 * tweens.
 *
 * Each character is its own `<tspan>` with its own dash length, so the letters
 * draw in sequence rather than all at once — SVG restarts the dash pattern per
 * subpath, which is why a single `<text>` element sketches every glyph
 * simultaneously and doesn't read as writing. Each letter strokes its outline,
 * then fills in behind it, and the space between words costs a stagger beat,
 * so the pen appears to lift.
 *
 * `<tspan>` handles its own positioning, so there is no measurement of
 * position anywhere here — only each glyph's own advance width.
 */
function HandwrittenTitle({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(el.querySelectorAll("tspan"));
    if (!letters.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      letters.forEach((letter, i) => {
        // `getTotalLength()` is path-only, so a glyph's outline perimeter is
        // approximated from its advance width. Overshooting is the safe error:
        // it costs a beat of dead time, where undershooting would leave the
        // letter partly drawn before its turn.
        const dash = letter.getComputedTextLength() * 3.2 || 60;
        const at = i * LETTER_STAGGER;

        gsap.set(letter, {
          fill: "transparent",
          stroke: INK,
          strokeWidth: 1,
          strokeDasharray: dash,
          strokeDashoffset: dash,
        });

        // Linear: a pen crossing a single letter doesn't accelerate.
        tl.to(letter, { strokeDashoffset: 0, duration: 0.3, ease: "none" }, at);
        // Fill catches up just before the outline closes, so the letter lands
        // solid instead of staying hollow.
        tl.to(letter, { fill: INK, duration: 0.2 }, at + 0.22);
      });
    });

    return () => ctx.revert();
  }, [text]);

  return (
    // Font size lives on the <svg> so the <text> inherits it and `1.5em`
    // resolves against it; `overflow-visible` means ascenders and descenders
    // can never be clipped by the box.
    <svg
      role="img"
      aria-label={text}
      className={`block w-full overflow-visible text-[clamp(1.75rem,3.6vw,3rem)] ${className}`}
      style={{ height: "1.5em" }}
    >
      <text
        ref={textRef}
        x="0"
        y="78%"
        xmlSpace="preserve"
        className="font-[family-name:var(--font-outfit)]"
        fill={INK}
      >
        {Array.from(text).map((char, i) => (
          <tspan key={`${char}-${i}`}>{char}</tspan>
        ))}
      </text>
    </svg>
  );
}

/**
 * One marquee row. The track renders two identical halves so the -50% wrap in
 * `marquee-left` / `marquee-right` lands exactly on the start of the second
 * half; `REPEATS_PER_HALF` tiles the source list so a single half is always
 * wider than the viewport, which is what keeps the loop gap-free on wide
 * screens. Spacing lives on each item (not as a `gap` on the track) so the
 * last item of a half carries a trailing gap too — otherwise the seam pinches.
 */
const REPEATS_PER_HALF = 3;

function LogoStrip({
  logos,
  direction,
  durationSeconds,
}: {
  logos: ClientLogo[];
  direction: "left" | "right";
  /** Deliberately long — the strips are meant to drift, not slide. */
  durationSeconds: number;
}) {
  const half = Array.from({ length: REPEATS_PER_HALF }, () => logos).flat();
  const track = [...half, ...half];

  return (
    <div className="overflow-hidden">
      <div
        className="marquee-track"
        style={{
          animationName: direction === "left" ? "marquee-left" : "marquee-right",
          animationDuration: `${durationSeconds}s`,
        }}
      >
        {track.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex shrink-0 items-center pr-12 md:pr-20"
          >
            {/* Decorative: the strips repeat, so the company names are given
                once in the `sr-only` list instead. */}
            <img
              src={logo.src}
              alt=""
              aria-hidden
              className={`${logo.className} w-auto max-w-none object-contain opacity-70`}
              style={
                logo.invert
                  ? { filter: "brightness(0) invert(1)" }
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About({ ready }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // The section ships at `opacity-0` so it can't flash before the loader is
  // done; this is what reveals it.
  useEffect(() => {
    if (ready && sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1 });
    }
  }, [ready]);

  // The studio copy rises in line by line: SplitText breaks the paragraph on
  // its rendered line breaks and wraps each line in an `overflow: hidden`
  // mask, so every line slides up from behind its own edge once the paragraph
  // scrolls into view.
  //
  // Gated on `ready` so the split isn't measured while the loader still has
  // the section hidden and the line breaks haven't settled. `autoSplit`
  // re-runs the split (and rebuilds the tween via `onSplit`) when the width
  // changes or a web font lands late, which is what keeps the lines honest.
  useEffect(() => {
    const el = copyRef.current;
    if (!ready || !el) return;

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
  }, [ready]);

  // The figures count up from 00 the first time the stats row scrolls into
  // view. A plain object is tweened and the text is written on each frame,
  // so the suffix (`+`, `%`) stays put while only the digits move.
  useEffect(() => {
    const el = statsRef.current;
    if (!ready || !el) return;

    const nums = Array.from(
      el.querySelectorAll<HTMLSpanElement>("[data-count]")
    );
    if (!nums.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      nums.forEach((num, i) => {
        const target = Number(num.dataset.count);
        if (reduced) {
          num.textContent = formatStat(target);
          return;
        }
        const counter = { n: 0 };
        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: "power2.out",
          delay: i * 0.1,
          onUpdate: () => {
            num.textContent = formatStat(counter.n);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-[#111113] px-6 md:px-10 pt-10 pb-24 md:pt-12 md:pb-36 opacity-0"
    >
      <div className="relative">
        {/* Section-label style shared with the sections below — same face,
            size, tracking and inset, so they read as a set. */}
        <h2 className="ml-4 font-[family-name:var(--font-outfit)] text-sm font-bold uppercase leading-none tracking-[0.12em] text-white md:ml-14 md:text-lg">
          The Studio
        </h2>

        {/* Copy and figures hang off the right edge, as in the reference
            layout: the stats sit directly under the paragraph and share its
            measure, so the two read as one right-hand column. */}
        <div className="mt-16 flex md:mt-24 md:justify-end">
          <div className="w-full md:w-[55%]">
            {/* PLACEHOLDER — swap for real copy. */}
            <p
              ref={copyRef}
              className="text-white font-[family-name:var(--font-outfit)] font-medium text-[clamp(1.125rem,1.8vw,1.625rem)] leading-snug tracking-tight"
            >
              {STUDIO_COPY}
            </p>

            <div
              ref={statsRef}
              className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-24 md:grid-cols-4 md:gap-x-8"
            >
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  {/* Script face. No negative tracking here — a connecting
                      script overlaps when it's pulled tight. */}
                  <p className="font-[family-name:var(--font-script)] font-bold leading-none text-white text-[clamp(3rem,5.5vw,5rem)]">
                    <span data-count={stat.value}>{formatStat(0)}</span>
                    {stat.suffix}
                  </p>
                  <p className="mt-5 text-sm md:text-lg text-white/55 tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client marks. Full-bleed out of the section's horizontal padding so
          the strip runs edge to edge. */}
      <div className="-mx-6 mt-32 md:-mx-10 md:mt-48">
        <p className="sr-only">
          Companies we have worked with:{" "}
          {CLIENT_LOGOS.map((logo) => logo.name).join(", ")}.
        </p>
        <LogoStrip logos={CLIENT_LOGOS} direction="left" durationSeconds={70} />
      </div>
    </section>
  );
}
