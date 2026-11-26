"use client";

/**
 * The homepage closing's reel (VideoCta), behind /seo's closing ask: the
 * same files and the same loading. Nothing downloads with the page; it starts
 * buffering a little before it nears the screen (useWakeMedia) and plays only
 * while on screen. Phones get the 9:16 cut panned onto the bench, and the
 * still is a <picture> for the same reason (see VideoCta).
 */

import { useEffect, useRef } from "react";
import { useWakeMedia } from "@/lib/useWakeMedia";

export default function ClosingReel({ className }: { className: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useWakeMedia(wrap);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden>
      <picture>
        <source srcSet="/closing-reel-poster-mobile.jpg?v=3" media="(max-width: 767px)" />
        <img src="/closing-reel-poster.jpg" alt="" loading="lazy" className={className} />
      </picture>
      <video ref={video} muted loop playsInline preload="none" className={className}>
        <source src="/closing-reel-mobile.mp4?v=3" media="(max-width: 767px)" type="video/mp4" />
        <source src="/closing-reel.mp4?v=4" type="video/mp4" />
      </video>
    </div>
  );
}
