"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const update = () => {
      ticking = false;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const wh = window.innerHeight;
      if (rect.top >= wh || rect.bottom <= 0) return;

      const progress = (wh - rect.top) / (wh + rect.height);
      const mobile = window.innerWidth < 768;

      const backSpeed = mobile ? -15 : -40;
      const midSpeed = mobile ? -60 : -200;
      const frontSpeed = mobile ? -100 : -350;

      if (backRef.current)
        backRef.current.style.transform = `translate3d(0,${progress * backSpeed}px,0)`;
      if (midRef.current)
        midRef.current.style.transform = `translate3d(0,${progress * midSpeed}px,0)`;
      if (frontRef.current)
        frontRef.current.style.transform = `translate3d(0,${progress * frontSpeed}px,0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative z-0 w-full h-[50vh] md:h-[80vh] overflow-hidden -mt-20 md:-mt-40"
    >
      {/* Back layer - moves slower */}
      <div
        ref={backRef}
        className="absolute w-full will-change-transform top-[-40px] md:top-[-100px] bottom-[-60px] md:bottom-[-150px]"
      >
        <Image
          src="/footer/BackFooter.webp"
          alt="Cloverfield Studio Vancouver BC creative agency background landscape"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Middle layer - Title */}
      <div
        ref={midRef}
        className="absolute inset-0 flex items-center md:items-start justify-center z-10 pt-[40%] md:pt-[10%] will-change-transform"
      >
        <h2
          className="text-[22vw] md:text-[22vw] lg:text-[20vw] font-extrabold tracking-tighter md:tracking-tight whitespace-nowrap"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 800,
            color: "#1E1E1E",
          }}
        >
          cloverfield
        </h2>
      </div>

      {/* Front layer - moves faster */}
      <div
        ref={frontRef}
        className="absolute w-full z-20 pointer-events-none will-change-transform top-[30px] md:top-[100px] bottom-[-60px] md:bottom-[-160px]"
      >
        <Image
          src="/footer/FrontFooter.webp"
          alt="Cloverfield Studio footer grass landscape design element"
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>
    </footer>
  );
}
