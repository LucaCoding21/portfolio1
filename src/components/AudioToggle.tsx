"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function AudioToggle({ isScrolled }: { isScrolled: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>(0);
  const phaseRef = useRef(0);

  // Detect mobile — skip everything on mobile
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMobile(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Initialize audio element only on desktop
  useEffect(() => {
    if (isMobile) return;

    const audio = new Audio("/audio/music.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [isMobile]);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      playPromiseRef.current = audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      // Wait for any pending play() to resolve before pausing
      const pending = playPromiseRef.current;
      if (pending) {
        pending.then(() => audio.pause()).catch(() => {});
        playPromiseRef.current = null;
      } else {
        audio.pause();
      }
      setIsPlaying(false);
    }
  };

  // Generate an envelope-modulated sine wave path
  const generateWavePath = useCallback(
    (phase: number, amplitude: number) => {
      const w = 56;
      const h = 28;
      const cy = h / 2;
      const parts: string[] = [];

      for (let x = 0; x <= w; x++) {
        const t = x / w; // 0 → 1
        const envelope = Math.sin(t * Math.PI); // taper at edges
        const y = cy + Math.sin(t * Math.PI * 5 + phase) * amplitude * envelope;
        parts.push(`${x === 0 ? "M" : "L"}${x},${y.toFixed(2)}`);
      }

      return parts.join(" ");
    },
    []
  );

  // Continuously animate the wave
  useEffect(() => {
    const animate = () => {
      phaseRef.current += isPlaying ? 0.08 : 0.04;

      if (pathRef.current) {
        const amp = isPlaying ? 11 : 7;
        pathRef.current.setAttribute(
          "d",
          generateWavePath(phaseRef.current, amp)
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, generateWavePath]);

  if (isMobile) return null;

  const strokeColor = isScrolled
    ? "rgba(0,0,0,0.55)"
    : "rgba(255,255,255,0.75)";
  const textColor = isScrolled ? "text-black/55" : "text-white/70";

  return (
    <button
      onClick={toggle}
      className="flex flex-col items-center gap-0.5 bg-transparent border-none outline-none"
      aria-label={isPlaying ? "Turn audio off" : "Turn audio on"}
    >
      <svg
        width="56"
        height="28"
        viewBox="0 0 56 28"
        className="overflow-visible"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`text-[9px] font-[family-name:var(--font-outfit)] font-semibold tracking-[0.15em] uppercase ${textColor} transition-colors duration-300`}
      >
        Audio {isPlaying ? "ON" : "OFF"}
      </span>
    </button>
  );
}
