"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./CaseStudyHeroVideo.module.css";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyHeroVideoProps {
  src: string;
  aspectRatio: string;
  ariaLabel?: string;
  href?: string;
  /** Still frame shown until the video can play. */
  poster?: string;
  /** Lighter encode for phones (under 768px wide). */
  mobileSrc?: string;
}

export default function CaseStudyHeroVideo({
  src,
  aspectRatio,
  ariaLabel,
  href,
  poster,
  mobileSrc,
}: CaseStudyHeroVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Desktop hover: the homepage's "Click to view" tag follows the cursor.
  // It is placed against the unscaled wrapper, so the video's scroll-driven
  // scale doesn't pull it off the pointer.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const link = linkRef.current;
    const label = labelRef.current;
    if (!wrapper || !link || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const toX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
    const toY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });
    const local = (e: MouseEvent) => {
      const r = wrapper.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onEnter = (e: MouseEvent) => {
      const [x, y] = local(e);
      gsap.set(label, { x, y });
    };
    const onMove = (e: MouseEvent) => {
      const [x, y] = local(e);
      toX(x);
      toY(y);
    };
    link.addEventListener("mouseenter", onEnter);
    link.addEventListener("mousemove", onMove);
    return () => {
      link.removeEventListener("mouseenter", onEnter);
      link.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    let mm: gsap.MatchMedia;

    const id = requestAnimationFrame(() => {
      mm = gsap.matchMedia();

      // Desktop: scale 0.8 → 0.7 → 0.55 with border-radius modulation
      mm.add("(min-width: 768px)", () => {
        gsap.set(inner, { scale: 0.8, borderRadius: "24px" });

        const tl = gsap.timeline();
        tl.to(inner, {
          scale: 0.7,
          borderRadius: "12px",
          ease: "none",
          duration: 1,
        }).to(inner, {
          scale: 0.55,
          borderRadius: "28px",
          ease: "none",
          duration: 1,
        });

        const st = ScrollTrigger.create({
          trigger: wrapper,
          start: "top 95%",
          end: "bottom 10%",
          scrub: 0.6,
          animation: tl,
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      // Mobile: no shrink, the video holds its full width
      mm.add("(max-width: 767px)", () => {
        gsap.set(inner, { scale: 1, borderRadius: "12px" });
      });
    });

    return () => {
      cancelAnimationFrame(id);
      if (mm) mm.revert();
    };
  }, []);

  const innerContent = (
    <div
      ref={innerRef}
      className="relative overflow-hidden bg-black will-change-transform"
      style={{ aspectRatio, borderRadius: "12px" }}
    >
      <video
        src={mobileSrc ? undefined : src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {mobileSrc && (
          <>
            <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" />
            <source src={src} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );

  return (
    <div ref={wrapperRef} className="relative">
      {href ? (
        <>
          <a
            ref={linkRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ${s.link}`}
            aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : undefined}
          >
            {innerContent}
          </a>
          <span ref={labelRef} aria-hidden className={s.viewLabel}>
            <span className={s.viewPill}>Click to view</span>
          </span>
        </>
      ) : (
        innerContent
      )}
    </div>
  );
}
