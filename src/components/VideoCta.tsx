"use client";

/**
 * The closing call: a full-width reel in a rounded plate with a margin of
 * paper around it, one line and the website-review field in the middle
 * (the same field as the team section, tagged "closing"). The reel plays
 * only while it is on screen; the line and field rise in with it.
 *
 * PLACEHOLDER: the line is a first pass.
 */

import { useEffect, useRef } from "react";
import ReviewField from "@/components/ReviewField";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./VideoCta.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function VideoCta({
  source = "closing",
  onPaper = false,
}: {
  /** Which placement the review field reports as: the homepage or /work. */
  source?: "closing" | "work";
  /** On a paper page (/work): paper ground and room above the plate. */
  onPaper?: boolean;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => io.disconnect();
    }

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-rise]"), {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      });
      // The plate eases in from a touch smaller so the corners read as they land.
      gsap.from(section.querySelector("[data-plate]"), {
        scale: 0.96,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
    }, section);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${s.wrap} ${onPaper ? s.onPaper : ""}`} aria-label="Book a call">
      <div className={s.plate} data-plate>
        {/* Phones get a 9:16 crop of the 1080p source, panned right onto the
            bench, so the plate is not upscaling a sliver of the landscape
            file. The poster is a <picture> for the same reason; the video
            carries none so it cannot paint the landscape still over it. */}
        <picture>
          <source srcSet="/closing-reel-poster-mobile.jpg?v=3" media="(max-width: 767px)" />
          <img src="/closing-reel-poster.jpg" alt="" aria-hidden className={s.video} />
        </picture>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className={s.video}
          aria-hidden
        >
          {/* The query is a cache buster: bump it whenever the crop is re-cut. */}
          <source src="/closing-reel-mobile.mp4?v=3" media="(max-width: 767px)" type="video/mp4" />
          <source src="/closing-reel.mp4?v=4" type="video/mp4" />
        </video>
        <div className={s.scrim} />
        <div className={s.content}>
          <p className={s.line} data-rise>
            Your site could be next.
          </p>
          <div data-rise className={s.form}>
            <ReviewField source={source} tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
