"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, reducedMotion } from "./motion";

/**
 * The pill button, with a hover that does three things at once: a disc
 * of the hover colour spreads out from wherever the cursor came in,
 * the label's letters climb out of the top while a second copy climbs
 * in from below, and the whole pill leans a few pixels toward the
 * cursor while it's over, springing back on leave. Under
 * prefers-reduced-motion only the colour changes.
 */

const BASE =
  "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium";

/* colours as hex so GSAP can tween them (it can't read a var()) */
const INK = "#202124";
const LINE = "#e8eaed";
const BLUE_DEEP = "#2563eb";

type Variant = {
  className: string;
  /** the disc that spreads from the cursor */
  fill: string;
  /** text and border while hovered, and at rest; null when they don't change */
  hover: { color: string; borderColor: string } | null;
  rest: { color: string; borderColor: string } | null;
};

const VARIANTS: Record<"primary" | "secondary", Variant> = {
  primary: {
    className: "bg-[var(--blue)] text-white",
    fill: BLUE_DEEP,
    hover: null,
    rest: null,
  },
  secondary: {
    className: "border border-[var(--line)] bg-white text-[var(--ink)]",
    fill: INK,
    hover: { color: "#fff", borderColor: INK },
    rest: { color: INK, borderColor: LINE },
  },
};

/** Split a label into letters; spaces become no-break spaces so they keep width. */
function letters(text: string, hidden = false) {
  return Array.from(text).map((ch, i) => (
    <span
      key={i}
      data-letter
      className="inline-block"
      aria-hidden={hidden || undefined}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

export default function Pill({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const lineA = useRef<HTMLSpanElement>(null);
  const lineB = useRef<HTMLSpanElement>(null);
  const v = VARIANTS[variant];
  const pad =
    size === "sm"
      ? "px-5 py-2.5 text-[0.875rem]"
      : "px-7 py-3.5 text-[0.95rem]";
  const label = typeof children === "string" ? children : null;

  /* where the cursor is, relative to the pill's box */
  const local = (e: MouseEvent) => {
    const r = root.current!.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      w: r.width,
      h: r.height,
    };
  };

  const enter = (e: MouseEvent) => {
    const el = root.current;
    if (!el || !fill.current) return;
    const { x, y, w, h } = local(e);
    const d = Math.max(w, h) * 2.4;
    if (reducedMotion()) {
      gsap.set(fill.current, {
        left: 0,
        top: 0,
        xPercent: 0,
        yPercent: 0,
        width: w,
        height: h,
        scale: 1,
        borderRadius: 9999,
      });
      if (v.hover) gsap.set(el, v.hover);
      return;
    }
    gsap.killTweensOf([fill.current, el]);
    gsap.set(fill.current, {
      left: x,
      top: y,
      width: d,
      height: d,
      xPercent: -50,
      yPercent: -50,
      borderRadius: 9999,
    });
    gsap.fromTo(
      fill.current,
      { scale: 0 },
      { scale: 1, duration: 0.55, ease: "power2.out" },
    );
    if (v.hover)
      gsap.to(el, { ...v.hover, duration: 0.25, ease: "power1.out" });
    if (lineA.current && lineB.current) {
      const a = lineA.current.querySelectorAll("[data-letter]");
      const b = lineB.current.querySelectorAll("[data-letter]");
      gsap.killTweensOf([a, b]);
      // The second copy stays hidden until the first hover (placing it
      // with GSAP on mount forced a layout of the whole page); fromTo
      // parks it below the slot before it shows.
      lineB.current.style.visibility = "";
      gsap.to(a, {
        yPercent: -110,
        duration: 0.45,
        ease: "power3.inOut",
        stagger: 0.018,
      });
      gsap.fromTo(
        b,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.45, ease: "power3.inOut", stagger: 0.018 },
      );
    }
  };

  const move = (e: MouseEvent) => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const { x, y, w, h } = local(e);
    gsap.to(el, {
      x: (x - w / 2) * 0.22,
      y: (y - h / 2) * 0.3,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const leave = (e: MouseEvent) => {
    const el = root.current;
    if (!el || !fill.current) return;
    if (reducedMotion()) {
      gsap.set(fill.current, { scale: 0 });
      if (v.rest) gsap.set(el, v.rest);
      return;
    }
    const { x, y } = local(e);
    gsap.killTweensOf([fill.current, el]);
    gsap.set(fill.current, { left: x, top: y });
    gsap.to(fill.current, { scale: 0, duration: 0.45, ease: "power2.inOut" });
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
    if (v.rest) gsap.to(el, { ...v.rest, duration: 0.3, delay: 0.1 });
    if (lineA.current && lineB.current) {
      const a = lineA.current.querySelectorAll("[data-letter]");
      const b = lineB.current.querySelectorAll("[data-letter]");
      gsap.killTweensOf([a, b]);
      gsap.to(a, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.inOut",
        stagger: 0.018,
      });
      gsap.to(b, {
        yPercent: 110,
        duration: 0.45,
        ease: "power3.inOut",
        stagger: 0.018,
      });
    }
  };

  return (
    <a
      ref={root}
      href={href}
      // Off-site links (the Cal.com demo) open in a new tab, so the page stays put.
      {...(/^https?:/.test(href) && { target: "_blank", rel: "noopener noreferrer" })}
      onMouseEnter={enter}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`${BASE} ${v.className} ${pad} ${className}`}
    >
      <span
        ref={fill}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ backgroundColor: v.fill, transform: "scale(0)" }}
      />
      {label ? (
        <span className="relative block overflow-hidden">
          <span ref={lineA} className="flex">
            {letters(label)}
          </span>
          <span
            ref={lineB}
            className="absolute inset-0 flex"
            style={{ visibility: "hidden" }}
            aria-hidden="true"
          >
            {letters(label, true)}
          </span>
        </span>
      ) : (
        <span className="relative">{children}</span>
      )}
    </a>
  );
}
