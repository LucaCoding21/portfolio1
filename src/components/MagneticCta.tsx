"use client";

/**
 * The "Book a call" button. Four things happen at once on a fine pointer:
 *
 * 1. Magnetic: inside a padded zone around it the pill leans toward the
 *    cursor, and the label leans a little further for parallax.
 * 2. Ink fill: a circle of ink grows from wherever the cursor entered and
 *    covers the pill; on leave it drains back out through the exit point.
 * 3. Letters flip: each letter is stacked twice in a one-line window and
 *    rolls up a row, staggered left to right, as the ink arrives.
 * 4. The arrow slides out the right and a twin slides in from the left.
 *
 * The label is drawn in paper and blended with `difference`, so letters flip
 * from ink to paper exactly as the ink passes under them, no colour tween.
 * Without hover (touch) or with reduced motion it is a plain outlined pill.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import s from "./MagneticCta.module.css";

/** How far the pill and label lean toward the cursor, as a share of the offset. */
const PULL = 0.32;
const LABEL_PULL = 0.12;

/** Seconds between one letter starting its roll and the next. */
const CHAR_STAGGER = 0.018;

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden fill="none">
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MagneticCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLAnchorElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const pill = pillRef.current;
    const ink = inkRef.current;
    const label = labelRef.current;
    if (!zone || !pill || !ink || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const pillX = gsap.quickTo(pill, "x", { duration: 0.7, ease: "power3.out" });
      const pillY = gsap.quickTo(pill, "y", { duration: 0.7, ease: "power3.out" });
      const labelX = gsap.quickTo(label, "x", { duration: 0.7, ease: "power3.out" });
      const labelY = gsap.quickTo(label, "y", { duration: 0.7, ease: "power3.out" });

      const chars = pill.querySelectorAll<HTMLElement>("[data-char]");
      const arrows = pill.querySelector<HTMLElement>("[data-arrows]");

      /* Cursor position in the pill's own box. */
      const local = (e: MouseEvent) => {
        const r = pill.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
      };

      const onMove = (e: MouseEvent) => {
        const r = zone.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        pillX(dx * PULL);
        pillY(dy * PULL);
        labelX(dx * LABEL_PULL);
        labelY(dy * LABEL_PULL);
      };

      const onZoneLeave = () => {
        pillX(0);
        pillY(0);
        labelX(0);
        labelY(0);
      };

      const onEnter = (e: MouseEvent) => {
        const p = local(e);
        // Radius to the farthest corner, so the circle covers the whole pill
        // no matter where the cursor came in.
        const radius = Math.hypot(Math.max(p.x, p.w - p.x), Math.max(p.y, p.h - p.y));
        gsap.set(ink, { left: p.x, top: p.y, width: radius * 2, height: radius * 2 });
        gsap.to(ink, { scale: 1, duration: 0.65, ease: "power3.out", overwrite: true });
        gsap.to(chars, {
          yPercent: -50,
          duration: 0.5,
          ease: "power3.inOut",
          stagger: CHAR_STAGGER,
          overwrite: true,
        });
        if (arrows) {
          gsap.to(arrows, { xPercent: -50, duration: 0.5, ease: "power3.inOut", overwrite: true });
        }
      };

      const onLeave = (e: MouseEvent) => {
        const p = local(e);
        // Drain toward the exit point, so the ink follows the cursor out.
        gsap.to(ink, {
          left: p.x,
          top: p.y,
          scale: 0,
          duration: 0.5,
          ease: "power3.in",
          overwrite: true,
        });
        gsap.to(chars, {
          yPercent: 0,
          duration: 0.45,
          ease: "power3.inOut",
          stagger: { each: CHAR_STAGGER, from: "end" },
          overwrite: true,
        });
        if (arrows) {
          gsap.to(arrows, { xPercent: 0, duration: 0.45, ease: "power3.inOut", overwrite: true });
        }
      };

      zone.addEventListener("mousemove", onMove);
      zone.addEventListener("mouseleave", onZoneLeave);
      pill.addEventListener("mouseenter", onEnter);
      pill.addEventListener("mouseleave", onLeave);

      return () => {
        zone.removeEventListener("mousemove", onMove);
        zone.removeEventListener("mouseleave", onZoneLeave);
        pill.removeEventListener("mouseenter", onEnter);
        pill.removeEventListener("mouseleave", onLeave);
      };
    }, zone);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={zoneRef} className={`${s.zone} ${className}`}>
      <Link ref={pillRef} href={href} className={s.pill}>
        <span ref={inkRef} aria-hidden className={s.ink} />
        <span ref={labelRef} className={s.label}>
          <span className={s.word}>
            {Array.from(children).map((ch, i) => (
              <span key={i} className={s.charWindow} aria-hidden>
                <span data-char className={s.char}>
                  <span>{ch === " " ? " " : ch}</span>
                  <span>{ch === " " ? " " : ch}</span>
                </span>
              </span>
            ))}
            {/* The rolled letters are decoration; this is what gets read. */}
            <span className={s.srOnly}>{children}</span>
          </span>
          <span className={s.arrowWindow} aria-hidden>
            <span data-arrows className={s.arrows}>
              <Arrow />
              <Arrow />
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}
