"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CLIENT_LOGOS } from "@/data/clientLogos";

gsap.registerPlugin(ScrollTrigger);

/**
 * How long the hero stays pinned before it releases and scrolls away, and the
 * slice of that distance the copy-out / logos-in sequence is scrubbed across.
 * Both in viewport heights; the sequence must finish inside the pin.
 */
const PINNED_SCROLL_VH = 140;
const SEQUENCE_SCROLL_VH = 90;

interface HeroProps {
  ready: boolean;
}

export default function Hero({ ready }: HeroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const circleRef = useRef<SVGPathElement>(null);

  // Pre-promote elements to GPU layers on mount (while loading screen is
  // still showing). This forces the browser to rasterize the text now so
  // there's no expensive first-paint when the animation starts later.
  useEffect(() => {
    gsap.set(headingRef.current, {
      opacity: 0, y: 30, force3D: true,
    });
    gsap.set(subtextRef.current, {
      opacity: 0, y: 20, force3D: true,
    });
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(revealRef.current, { opacity: 0, y: 110, force3D: true });

    // getTotalLength() is in viewBox user units, so this is independent of
    // font loading and of the non-uniform preserveAspectRatio scaling.
    const circle = circleRef.current;
    if (circle) {
      const length = circle.getTotalLength();
      gsap.set(circle, { strokeDasharray: length, strokeDashoffset: length });
    }
  }, []);

  // Animate in — elements are already on the GPU, no stutter
  useEffect(() => {
    if (!ready) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // Free GPU memory after animation settles. Guard refs in case
        // the component unmounted before this fires (e.g., route change).
        const targets = [headingRef.current, subtextRef.current].filter(
          (el): el is NonNullable<typeof el> => el !== null,
        );
        if (targets.length) {
          gsap.set(targets, { clearProps: "willChange" });
        }
      },
    });

    tl.to(overlayRef.current, { opacity: 1, duration: 0.6 }, 0);
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0);
    tl.to(subtextRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.15);

    // Hand-drawn circle looping around "customers".
    if (circleRef.current) {
      tl.to(
        circleRef.current,
        { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" },
        0.6
      );
    }

    return () => {
      tl.kill();
    };
  }, [ready]);

  // Scroll-driven sequence over the pinned stretch: the copy rides up and out
  // while the logos and the right-hand note rise into the spot it vacates.
  // Both act on wrapper
  // elements so they never fight the entry animation above, which owns
  // `y`/`opacity` on the h1 and p themselves.
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      gsap.set(revealRef.current, { opacity: 0, y: 110, force3D: true });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: spacerRef.current,
          // The spacer starts exactly one viewport down, so "top bottom" is
          // scroll position 0 — the sequence begins on the very first scroll.
          start: "top bottom",
          end: () => `+=${window.innerHeight * (SEQUENCE_SCROLL_VH / 100)}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(copyRef.current, { y: -160, opacity: 0, duration: 0.55 }, 0);
      tl.to(revealRef.current, { y: 0, opacity: 1, duration: 0.45 }, 0.5);
    });

    // The spacer adds ~140vh of document height, so every trigger positioned
    // further down the page (About, Work) was measured against a shorter
    // document and needs re-measuring once this layout is in.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [ready]);

  return (
    // Pin container. `sticky` only holds while this box is on screen, so the
    // hero releases once the spacer below is used up — i.e. right after the
    // copy-out / logos-in sequence finishes — and then scrolls away normally.
    <div className="relative w-full">
    <section className="sticky top-0 h-screen w-full overflow-hidden -z-0">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-v2-poster.webp"
          aria-label="Cloverfield Studio web design showcase reel"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 35%" }}
        >
          <source src="/hero-v2.mp4" type="video/mp4" />
        </video>
        <div ref={overlayRef} className="absolute inset-0 bg-black/8" />
      </div>

      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left px-6 md:px-12 pb-16 md:pb-20">
        <div ref={copyRef} className="will-change-[transform,opacity]">
        {/* Headline and subline are both `whitespace-nowrap` and sized in vw so
            each stays on a single line from ~320px up to ultra-wide. */}
        <h1 ref={headingRef} className="font-[family-name:var(--font-outfit)] font-bold text-white text-[clamp(0.9rem,4.7vw,4.5rem)] lg:text-[clamp(2rem,5vw,5rem)] leading-[1.15] tracking-tight whitespace-nowrap will-change-[transform,opacity]">
          We make websites that bring in{" "}
          <span className="relative inline-block text-[1.15em] font-[family-name:var(--font-script)] font-normal">
            customers
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-[45%] -translate-y-[42%]"
              viewBox="0 0 200 64"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "132%", height: "1.62em", overflow: "visible" }}
              aria-hidden="true"
            >
              <path
                ref={circleRef}
                d="M166 14 C 138 4, 62 2, 30 14 C 4 24, 8 47, 42 55 C 84 64, 162 60, 182 45 C 196 34, 190 17, 158 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
          <span className="text-[1.15em] font-[family-name:var(--font-script)] font-normal">
            .
          </span>
        </h1>
        <p ref={subtextRef} className="mt-1 md:mt-2 text-[clamp(0.875rem,1.65vw,1.375rem)] text-white font-semibold tracking-wide whitespace-normal md:whitespace-nowrap will-change-[transform,opacity]">
          Custom, lead-generating websites for established businesses.
        </p>
        </div>

        {/* Rides in with the logos. Anchored to the same bottom edge the copy
            occupies, so the pair lands where the description was. Starts offset
            and transparent — the section's `overflow-hidden` keeps it out of
            the first fold. Stacks on phones; note left, logos right from md. */}
        <div
          ref={revealRef}
          className="absolute left-6 right-6 md:left-12 md:right-12 bottom-16 md:bottom-20 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-10 will-change-[transform,opacity]"
        >
          {/* PLACEHOLDER — swap for real copy. `line-clamp-2` holds it to two
              lines whatever gets pasted in. */}
          <p className="max-w-[28ch] shrink-0 text-left text-[clamp(0.875rem,1.65vw,1.375rem)] leading-snug text-white font-semibold tracking-wide line-clamp-2">
            Placeholder text for this slot. Two lines max, replace when ready.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:justify-end md:gap-x-10">
            {CLIENT_LOGOS.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.name}
                className={`${logo.className} w-auto object-contain opacity-90 ${
                  logo.invert ? "brightness-0 invert" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Consumed by the sticky travel above: it sets how long the hero stays
        pinned before it releases. Purely a scroll-length spacer. */}
    <div
      ref={spacerRef}
      aria-hidden
      className="w-full"
      style={{ height: `${PINNED_SCROLL_VH}vh` }}
    />
    </div>
  );
}
