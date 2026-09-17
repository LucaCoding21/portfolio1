"use client";

/**
 * The studio's call to action. A solid ink pill, the same surface as the nav
 * button, with a small paper chip holding an arrow at its right end.
 *
 * On hover (fine pointer only) the chip swells from its own spot until it
 * fills the pill, so the button flips from ink to paper without a colour
 * tween, and the arrow turns to point up and right. The label is drawn in
 * paper and blended with `difference`, so it turns to ink exactly as the chip
 * passes under it. Leaving drains the chip back into its corner.
 *
 * `live` adds a pulsing green dot before the label (an availability signal).
 * `note` prints a small Outfit line under the button. No magnetism.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import s from "./ArrowCta.module.css";

const CHIP = 36; // px, matches --chip in the stylesheet

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden fill="none">
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArrowCta({
  href,
  children,
  note,
  live = false,
  className = "",
}: {
  href: string;
  children: string;
  /** Small line under the button. */
  note?: string;
  /** Pulsing green dot before the label. */
  live?: boolean;
  className?: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    const arrow = arrowRef.current;
    const label = labelRef.current;
    if (!btn || !fill || !arrow || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* Scale that takes the chip from its corner to the far edge of the pill. */
      const coverScale = () => {
        const r = btn.getBoundingClientRect();
        const cx = r.width - (r.height - CHIP) / 2 - CHIP / 2;
        const reach = Math.hypot(cx, r.height / 2);
        return (reach * 2 + 4) / CHIP;
      };

      const onEnter = () => {
        gsap.to(fill, { scale: coverScale(), duration: 0.75, ease: "expo.out", overwrite: true });
        gsap.to(arrow, { rotate: -45, x: 1, y: -1, duration: 0.55, ease: "back.out(1.8)", overwrite: true });
        gsap.to(label, { x: 3, duration: 0.6, ease: "expo.out", overwrite: true });
      };

      const onLeave = () => {
        gsap.to(fill, { scale: 1, duration: 0.55, ease: "power3.inOut", overwrite: true });
        gsap.to(arrow, { rotate: 0, x: 0, y: 0, duration: 0.45, ease: "power3.inOut", overwrite: true });
        gsap.to(label, { x: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
      };

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      return () => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      };
    }, btn);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`${s.block} ${className}`}>
      <Link ref={btnRef} href={href} className={s.btn}>
        <span ref={fillRef} aria-hidden className={s.fill} />
        <span className={s.content}>
          {live && <span aria-hidden className={s.dotSlot} />}
          <span ref={labelRef} className={s.label}>
            {children}
          </span>
          <span ref={arrowRef} aria-hidden className={s.arrow}>
            <Arrow />
          </span>
        </span>
        {/* Outside the blend layer so it keeps its own colour. */}
        {live && <span aria-hidden className={s.dot} />}
      </Link>
      {note && <span className={s.note}>{note}</span>}
    </div>
  );
}
