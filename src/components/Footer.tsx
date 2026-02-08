"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how far into the viewport the footer is
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          setScrollY(progress);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden -mt-40"
    >
      {/* Back layer - moves slower */}
      <div
        className="absolute w-full"
        style={{
          top: "-100px",
          bottom: "-150px",
          transform: `translateY(${scrollY * -40}px)`,
        }}
      >
        <Image
          src="/footer/BackFooter.png"
          alt="Cloverfield Studio Vancouver BC creative agency background landscape"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Middle layer - Title */}
      <div
        className="absolute inset-0 flex items-start justify-center z-10 pt-[10%]"
        style={{
          transform: `translateY(${scrollY * -200}px)`,
        }}
      >
        <h2
          className="text-[24vw] md:text-[22vw] lg:text-[20vw] font-extrabold tracking-tight"
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
          top: "100px",
          bottom: "-160px",
          transform: `translateY(${scrollY * -350}px)`,
        }}
      >
        <Image
          src="/footer/FrontFooter.png"
          alt="Cloverfield Studio footer grass landscape design element"
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>
    </footer>
  );
}
