"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        setScrollY(progress);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reduce parallax intensity on mobile
  const backSpeed = isMobile ? -15 : -40;
  const midSpeed = isMobile ? -60 : -200;
  const frontSpeed = isMobile ? -100 : -350;

  return (
    <footer
      ref={containerRef}
      className="relative z-0 w-full h-[50vh] md:h-[80vh] overflow-hidden -mt-20 md:-mt-40"
    >
      {/* Back layer - moves slower */}
      <div
        className="absolute w-full"
        style={{
          top: isMobile ? "-40px" : "-100px",
          bottom: isMobile ? "-60px" : "-150px",
          transform: `translateY(${scrollY * backSpeed}px)`,
        }}
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
        className="absolute inset-0 flex items-center md:items-start justify-center z-10 pt-[40%] md:pt-[10%]"
        style={{
          transform: `translateY(${scrollY * midSpeed}px)`,
        }}
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
        className="absolute w-full z-20 pointer-events-none"
        style={{
          top: isMobile ? "30px" : "100px",
          bottom: isMobile ? "-60px" : "-160px",
          transform: `translateY(${scrollY * frontSpeed}px)`,
        }}
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
