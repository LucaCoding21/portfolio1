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
  }, [ready]);

  return (
    <section className="sticky top-0 h-screen w-full overflow-hidden -z-0">
      <div className="fixed inset-0 overflow-hidden">
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
        <h1 ref={headingRef} className="font-[family-name:var(--font-outfit)] font-bold text-white text-[clamp(2.5rem,10vw,7rem)] leading-[0.9] tracking-tight opacity-0">built with care.</h1>
        <p ref={subtextRef} className="mt-4 md:mt-6 text-base md:text-lg text-white/70 max-w-sm md:max-w-md font-medium tracking-wide opacity-0">
          Web design that feels like you, not everyone else.
        </p>
      </div>
    </section>
  );
}
