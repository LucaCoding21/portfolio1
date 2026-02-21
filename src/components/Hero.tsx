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
  const underlineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!ready) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      0
    );

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      0
    );

    tl.fromTo(
      subtextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.15
    );

    // Animate the SVG underline drawing in
    if (underlineRef.current) {
      const path = underlineRef.current;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(
        path,
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        0.5
      );
    }
  }, [ready]);

  return (
    <section className="sticky top-0 h-screen w-full overflow-hidden -z-0">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 35%" }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div ref={overlayRef} className="absolute inset-0 bg-black/8 opacity-0" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 ref={headingRef} className="font-[family-name:var(--font-outfit)] font-bold text-white text-[clamp(2rem,8vw,5.5rem)] leading-[0.9] tracking-tight opacity-0">
          We build websites that bring in{" "}
          <span className="relative inline-block">
            customers.
            <svg
              className="absolute -bottom-[0.1em] left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "0.18em", overflow: "visible" }}
            >
              <path
                ref={underlineRef}
                d="M2 8 C40 2, 80 2, 100 6 S160 12, 198 4"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>
        <p ref={subtextRef} className="mt-4 md:mt-6 text-base md:text-lg text-white font-semibold tracking-wide opacity-0" style={{ textShadow: "0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,1)" }}>
          Most local businesses lose customers before they ever make contact. We build websites that fix that.
        </p>
      </div>
    </section>
  );
}
