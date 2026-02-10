"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Kumusta",
  "Xin chào",
  "Guten tag",
  "Hello",
];

export default function LoadingScreen({
  onLoadingComplete,
}: LoadingScreenProps) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const mobileTextRef = useRef<HTMLSpanElement>(null);
  const assetsLoadedRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const wordsCompleteRef = useRef(false);
  const isExitingRef = useRef(false);
  const firstCycleRef = useRef(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    setMounted(true);
  }, []);

  // Preload assets in background
  useEffect(() => {
    const assets = [
      "/hero.mp4",
      "/portfolio-prev2.mp4",
      "/Njagih/njagih studios.webp",
      "/ACE/ace.webp",
      "/clover/Clover Studio.webp",
      "/Sophie.webp",
    ];

    const preloadAsset = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (src.endsWith(".mp4")) {
          const video = document.createElement("video");
          video.preload = "auto";
          video.oncanplaythrough = () => resolve();
          video.onerror = () => resolve();
          video.src = src;
          video.load();
          // Mobile browsers may never fire oncanplaythrough for
          // programmatic videos — don't let preloading hang forever
          setTimeout(() => resolve(), 3000);
        } else {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }
      });
    };

    Promise.all(assets.map(preloadAsset)).then(() => {
      assetsLoadedRef.current = true;
    });

    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
    }, 2000);

    return () => clearTimeout(minTimer);
  }, []);

  // Cycle through words — loop until exit conditions are met
  useEffect(() => {
    if (index === words.length - 1) {
      wordsCompleteRef.current = true;
      firstCycleRef.current = false;
      const timeout = setTimeout(() => setIndex(0), 150);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(
      () => setIndex(index + 1),
      index === 0 && firstCycleRef.current ? 1000 : 150
    );
    return () => clearTimeout(timeout);
  }, [index]);

  // Fade in text on mount
  useEffect(() => {
    if (!mounted) return;
    const el = isMobile ? mobileTextRef.current : textRef.current;
    if (el) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.2 });
    }
  }, [mounted, isMobile]);

  // Exit animation
  const triggerExit = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    if (isMobile) {
      // Simple fade out
      gsap.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: onLoadingComplete,
      });
    } else {
      // Desktop: scale the SVG mask then crossfade to hero
      const tl = gsap.timeline({ onComplete: onLoadingComplete });

      tl.to(
        svgRef.current,
        { scale: 15, duration: 1.4, ease: "power3.inOut" },
        0
      );

      tl.to(
        svgRef.current,
        { autoAlpha: 0, duration: 0.6, ease: "power2.out" },
        0.8
      );

      tl.to(
        containerRef.current,
        { autoAlpha: 0, duration: 0.4, ease: "none" },
        1.2
      );
    }
  }, [onLoadingComplete, isMobile]);

  // Poll for all conditions to trigger exit
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        wordsCompleteRef.current &&
        assetsLoadedRef.current &&
        minTimeElapsedRef.current
      ) {
        clearInterval(interval);
        triggerExit();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [triggerExit]);

  return (
    <div ref={containerRef} className="preloader">
      {mounted && !isMobile && (
        <>
          <video autoPlay muted loop playsInline className="preloader-video">
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <svg
            ref={svgRef}
            className="preloader-svg"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="text-mask">
                <rect width="1920" height="1080" fill="white" />
                <text
                  ref={textRef}
                  x="960"
                  y="560"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="preloader-svg-text"
                  fill="black"
                >
                  {words[index]}
                </text>
              </mask>
            </defs>

            <rect
              width="1920"
              height="1080"
              fill="white"
              mask="url(#text-mask)"
            />
          </svg>
        </>
      )}

      {mounted && isMobile && (
        <div className="flex items-center justify-center h-full">
          <span
            ref={mobileTextRef}
            className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(3rem,15vw,5rem)] uppercase tracking-tight opacity-0"
          >
            {words[index]}
          </span>
        </div>
      )}
    </div>
  );
}
