"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import VideoPlayer from "@/components/VideoPlayer";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  ready: boolean;
}

export default function About({ ready }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoInnerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerRect, setPlayerRect] = useState<DOMRect | null>(null);
  const [playerBorderRadius, setPlayerBorderRadius] = useState("24px");
  const [playerInitialTime, setPlayerInitialTime] = useState(0);

  // Make section visible immediately (no old fade-in)
  useEffect(() => {
    if (ready && sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1 });
    }
    // Set initial video scale per breakpoint
    if (ready && videoInnerRef.current) {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      gsap.set(videoInnerRef.current, {
        scale: isDesktop ? 0.8 : 1,
        borderRadius: isDesktop ? "24px" : "16px",
      });
    }
  }, [ready]);

  // Heading: smooth slide-in from the right with blur
  useEffect(() => {
    if (!ready || !headingRef.current) return;

    const st = ScrollTrigger.create({
      trigger: headingRef.current,
      start: "top 92%",
      end: "top 45%",
      scrub: 0.6,
      animation: gsap.fromTo(
        headingRef.current,
        { x: 80, opacity: 0, filter: "blur(12px)" },
        { x: 0, opacity: 1, filter: "blur(0px)", ease: "none" }
      ),
    });

    return () => st.kill();
  }, [ready]);

  // Line-by-line blur reveal
  useEffect(() => {
    if (!ready || !linesContainerRef.current) return;

    const lines = linesContainerRef.current.querySelectorAll(".reveal-line");
    const triggers: ScrollTrigger[] = [];

    lines.forEach((line) => {
      const inner = line.querySelector(".reveal-line-inner") as HTMLElement;
      if (!inner) return;

      const st = ScrollTrigger.create({
        trigger: line,
        start: "top 90%",
        end: "top 55%",
        scrub: 0.5,
        animation: gsap.fromTo(
          inner,
          { y: "100%", opacity: 0, filter: "blur(10px)" },
          { y: "0%", opacity: 1, filter: "blur(0px)", ease: "none" }
        ),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((st) => st.kill());
  }, [ready]);

  // Scroll-driven scale animation for the video
  useEffect(() => {
    if (!ready || !videoWrapperRef.current || !videoInnerRef.current) return;

    const inner = videoInnerRef.current;
    const mm = gsap.matchMedia();

    // Desktop: dramatic scale animation
    mm.add("(min-width: 768px)", () => {
      const st1 = ScrollTrigger.create({
        trigger: videoWrapperRef.current,
        start: "top 95%",
        end: "top 20%",
        scrub: 0.6,
        animation: gsap.fromTo(
          inner,
          { scale: 0.8, borderRadius: "24px" },
          { scale: 0.7, borderRadius: "12px", ease: "none" }
        ),
      });

      const st2 = ScrollTrigger.create({
        trigger: videoWrapperRef.current,
        start: "bottom 80%",
        end: "bottom 10%",
        scrub: 0.6,
        animation: gsap.fromTo(
          inner,
          { scale: 0.7, borderRadius: "12px" },
          { scale: 0.55, borderRadius: "28px", ease: "none" }
        ),
      });

      return () => {
        st1.kill();
        st2.kill();
      };
    });

    // Mobile: subtler scale, stays larger
    mm.add("(max-width: 767px)", () => {
      gsap.set(inner, { scale: 1, borderRadius: "16px" });

      const st = ScrollTrigger.create({
        trigger: videoWrapperRef.current,
        start: "top 90%",
        end: "top 20%",
        scrub: 0.6,
        animation: gsap.fromTo(
          inner,
          { scale: 1, borderRadius: "16px" },
          { scale: 0.95, borderRadius: "12px", ease: "none" }
        ),
      });

      return () => st.kill();
    });

    return () => mm.revert();
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
      className="py-20 md:py-28 px-6 md:px-10 border-t border-black/[0.06] opacity-0 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-24 gap-6">
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2.2rem,7vw,5rem)] uppercase tracking-tight md:w-2/5 shrink-0 opacity-0 will-change-[transform,opacity,filter]"
        >
          ABOUT US
        </h2>
        {/* Desktop: line-by-line reveal */}
        <div ref={linesContainerRef} className="md:w-3/5 md:ml-auto hidden md:block">
          {[
            "Based in Vancouver and Surrey, BC, we're a creative studio passionate",
            "about crafting thoughtful digital experiences. We care deeply about our",
            "clients, the process, and ensuring every result is nothing short of beautiful.",
          ].map((line, i) => (
            <div key={i} className="reveal-line overflow-hidden">
              <p className="reveal-line-inner text-lg leading-relaxed text-black/65 font-light will-change-[transform,opacity,filter]">
                {line}
              </p>
            </div>
          ))}
          <div className="mt-4" />
          {[
            "With experience across product design, brand identity, and full-stack",
            "development, we help ambitious brands bring their vision to life from",
            "concept to launch.",
          ].map((line, i) => (
            <div key={`b-${i}`} className="reveal-line overflow-hidden">
              <p className="reveal-line-inner text-lg leading-relaxed text-black/65 font-light will-change-[transform,opacity,filter]">
                {line}
              </p>
            </div>
          ))}
        </div>
        {/* Mobile: natural paragraph flow */}
        <div className="md:hidden">
          <p className="text-base leading-relaxed text-black/60 font-light">
            Based in Vancouver and Surrey, BC, we&apos;re a creative studio passionate about crafting thoughtful digital experiences. We care deeply about our clients, the process, and ensuring every result is nothing short of beautiful.
          </p>
          <p className="text-base leading-relaxed text-black/60 font-light mt-4">
            With experience across product design, brand identity, and full-stack development, we help ambitious brands bring their vision to life from concept to launch.
          </p>
        </div>
      </div>

      {/* Video reel */}
      <div
        ref={videoWrapperRef}
        className="mt-12 md:mt-20 max-w-7xl mx-auto"
      >
        <div
          ref={videoInnerRef}
          onClick={handleVideoClick}
          className="cursor-play relative overflow-hidden will-change-transform"
          style={{
            borderRadius: "16px",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
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
