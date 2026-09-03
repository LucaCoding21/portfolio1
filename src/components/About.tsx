"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  ready: boolean;
}

export default function About({ ready }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoInnerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stRefs = useRef<ScrollTrigger[]>([]);

  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerRect, setPlayerRect] = useState<DOMRect | null>(null);
  const [playerBorderRadius, setPlayerBorderRadius] = useState("24px");
  const [playerInitialTime, setPlayerInitialTime] = useState(0);

  // Clean up all deferred ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      stRefs.current.forEach((st) => st.kill());
      stRefs.current = [];
    };
  }, []);

  // Play video only when it scrolls into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else if (!playerOpen) {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playerOpen]);

  // Make section visible immediately (no old fade-in)
  useEffect(() => {
    if (ready && sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1 });
    }
    // Start the reel as a small centred window; scroll opens it outward.
    if (ready && videoInnerRef.current) {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      gsap.set(videoInnerRef.current, {
        clipPath: isDesktop
          ? "inset(44% 44% 44% 44% round 20px)"
          : "inset(38% 30% 38% 30% round 16px)",
      });
    }
  }, [ready]);

  // Scroll-driven reveal: the reel opens outward from the centre. Animating
  // clip-path (rather than scale) means the video plays at full size the whole
  // time and the window into it grows, instead of the picture being enlarged.
  useEffect(() => {
    if (!ready || !videoWrapperRef.current || !videoInnerRef.current) return;

    const inner = videoInnerRef.current;
    const wrapper = videoWrapperRef.current;
    let mm: gsap.MatchMedia;

    const id = requestAnimationFrame(() => {
      mm = gsap.matchMedia();

      const open = (from: string, to: string, start: string, end: string) => {
        gsap.set(inner, { clipPath: from });
        const st = ScrollTrigger.create({
          trigger: wrapper,
          start,
          end,
          scrub: 0.6,
          animation: gsap.to(inner, { clipPath: to, ease: "none" }),
        });
        return () => st.kill();
      };

      mm.add("(min-width: 768px)", () =>
        open(
          "inset(44% 44% 44% 44% round 20px)",
          "inset(0% 0% 0% 0% round 20px)",
          "top 88%",
          "top 22%",
        ),
      );

      mm.add("(max-width: 767px)", () =>
        open(
          "inset(38% 30% 38% 30% round 16px)",
          "inset(0% 0% 0% 0% round 16px)",
          "top 92%",
          "top 35%",
        ),
      );
    });

    return () => {
      cancelAnimationFrame(id);
      if (mm) mm.revert();
    };
  }, [ready]);

  const handleVideoClick = useCallback(() => {
    const inner = videoInnerRef.current;
    const video = videoRef.current;
    if (!inner || !video) return;

    const rect = inner.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(inner);

    setPlayerRect(rect);
    setPlayerBorderRadius(computedStyle.borderRadius);
    setPlayerInitialTime(video.currentTime);
    setPlayerOpen(true);
  }, []);

  const handlePlayerClose = useCallback(() => {
    setPlayerOpen(false);
  }, []);

  const handleTimeSync = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const getSourceRect = useCallback(() => {
    return videoInnerRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const getSourceBorderRadius = useCallback(() => {
    if (!videoInnerRef.current) return "24px";
    return window.getComputedStyle(videoInnerRef.current).borderRadius;
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-[var(--charcoal)] py-24 md:py-36 px-6 md:px-10 opacity-0 overflow-x-hidden"
    >
      {/* Video reel */}
      <div
        ref={videoWrapperRef}
        className="mt-12 md:mt-20 max-w-7xl mx-auto"
      >
        <div
          ref={videoInnerRef}
          onClick={handleVideoClick}
          className="cursor-play relative overflow-hidden will-change-[clip-path]"
          style={{
            borderRadius: "16px",
          }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Portfolio showcase of custom web design projects by Cloverfield Studio"
            className="w-full h-auto block"
          >
            <source src="/portfolio-prev2.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <VideoPlayer
        isOpen={playerOpen}
        onClose={handlePlayerClose}
        sourceRect={playerRect}
        sourceBorderRadius={playerBorderRadius}
        getSourceRect={getSourceRect}
        getSourceBorderRadius={getSourceBorderRadius}
        videoSrc="/portfolio-prev2.mp4"
        initialTime={playerInitialTime}
        onTimeSync={handleTimeSync}
      />
    </section>
  );
}
