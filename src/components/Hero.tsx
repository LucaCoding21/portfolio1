"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroProps {
  ready: boolean;
}

export default function Hero({ ready }: HeroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
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

  return (
    <section className="relative h-screen w-full overflow-hidden">
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
        {/* Soft dark fade from the top so the nav's white type always sits on
            something, whatever frame the video is on. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 md:h-44"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left px-6 md:px-12 pb-16 md:pb-24">
        <div>
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
      </div>
    </section>
  );
}
