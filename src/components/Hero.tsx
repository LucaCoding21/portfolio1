"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroProps {
  ready: boolean;
}

export default function Hero({ ready }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    }
  }, [ready]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 opacity-0"
      >
        <h1 className="headline">built with care</h1>
        <p className="mt-6 text-lg text-white/70 max-w-md font-light tracking-wide">
          Building digital products for ambitious brands since 2020.
        </p>
      </div>
    </section>
  );
}
