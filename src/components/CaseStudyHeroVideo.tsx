"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyHeroVideoProps {
  src: string;
  aspectRatio: string;
  ariaLabel?: string;
  href?: string;
}

export default function CaseStudyHeroVideo({
  src,
  aspectRatio,
  ariaLabel,
  href,
}: CaseStudyHeroVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

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

      // Mobile: subtler scale, stays larger
      mm.add("(max-width: 767px)", () => {
        gsap.set(inner, { scale: 1, borderRadius: "16px" });

        const st = ScrollTrigger.create({
          trigger: wrapper,
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
      style={{ aspectRatio, borderRadius: "16px" }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div ref={wrapperRef}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-site"
          aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : undefined}
        >
          {innerContent}
        </a>
      ) : (
        innerContent
      )}
    </div>
  );
}
