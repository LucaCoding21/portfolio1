"use client";

/**
 * Nav cloned from lassie.ai: a centred pill row inside a frosted ring. At rest
 * every item sits on its own white pill; on hover those drop away and one
 * white pill slides under the pointer (0.3s expo.out). Over the hero the nav
 * runs a "dark" theme (white type), after it a "light" one. Past 400px of
 * scroll the wordmark folds away and only the mark stays (0.6s power4.out).
 *
 * Their flower + "Lassie" wordmark becomes our "c" mark + "loverfield".
 * The sound toggle is gone by request.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { NAV_ITEMS } from "@/data/projects";
import MobileMenu from "./MobileMenu";
import s from "./LassieNav.module.css";

// Lassie's motion tokens.
const DURATION = { fast: 0.3, medium: 0.6, slow: 1 };
const EASE = "power4.out";
const EASE_OUT = "expo.out";

const COLLAPSE_AT = 400;
const EXPAND_AT = 360;

export default function LassieNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const hoveredRef = useRef(false);

  /* theme: the hero (or any element flagged data-nav-theme="dark") sets it */
  useEffect(() => {
    const onTheme = (e: Event) => {
      const t = (e as CustomEvent<"dark" | "light">).detail;
      if (t === "dark" || t === "light") setTheme(t);
    };
    window.addEventListener("lassie:nav-theme", onTheme);
    return () => window.removeEventListener("lassie:nav-theme", onTheme);
  }, []);

  // Only the homepage has a dark hero; every other page runs light.
  const effectiveTheme = pathname === "/" ? theme : "light";

  /* collapse the wordmark after 400px, expand again under 360px */
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    // natural width of the wordmark, measured once so the pill fits the text
    const fullWidth = el.getBoundingClientRect().width;
    let collapsed = window.scrollY >= COLLAPSE_AT;
    const apply = (c: boolean) => {
      gsap.to(el, {
        width: c ? 0 : fullWidth,
        duration: DURATION.medium,
        ease: EASE,
        onUpdate: () => {
          // keep the sliding pill sized to the item as the logo shrinks
          const cur = navRef.current?.querySelector<HTMLElement>(`.${s.item}[data-hover="1"]`);
          if (cur) movePill(cur, false);
        },
      });
    };
    apply(collapsed);
    const onScroll = () => {
      const y = window.scrollY;
      if (!collapsed && y >= COLLAPSE_AT) {
        collapsed = true;
        apply(true);
      } else if (collapsed && y <= EXPAND_AT) {
        collapsed = false;
        apply(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const movePill = useCallback((el: HTMLElement, animate: boolean) => {
    const pill = pillRef.current;
    if (!pill) return;
    const w = el.getBoundingClientRect().width;
    if (animate) {
      gsap.to(pill, { width: w, x: el.offsetLeft, duration: DURATION.fast, ease: EASE_OUT });
    } else {
      gsap.set(pill, { width: w, x: el.offsetLeft });
    }
  }, []);

  const onItemEnter = (e: React.SyntheticEvent<HTMLElement>) => {
    const el = e.currentTarget;
    navRef.current?.querySelectorAll<HTMLElement>(`.${s.item}`).forEach((i) => i.removeAttribute("data-hover"));
    el.setAttribute("data-hover", "1");
    // First entry: the pill appears under the item at once, then slides.
    movePill(el, hoveredRef.current);
  };

  const onNavEnter = () => {
    hoveredRef.current = true;
    setHovered(true);
  };

  const onNavLeave = () => {
    hoveredRef.current = false;
    setHovered(false);
    const pill = pillRef.current;
    if (pill) {
      gsap.killTweensOf(pill);
      setTimeout(() => gsap.set(pill, { width: 0 }));
    }
    navRef.current?.querySelectorAll<HTMLElement>(`.${s.item}`).forEach((i) => i.removeAttribute("data-hover"));
  };

  const isActive = (href: string) => !href.startsWith("/#") && pathname === href;

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className={`${s.nav} ${s[effectiveTheme]} ${hovered ? s.isHovered : ""}`}
        onMouseEnter={onNavEnter}
        onMouseLeave={onNavLeave}
      >
        <div className={s.ring} />
        <span ref={pillRef} className={s.pill} aria-hidden="true" />

        <Link
          href="/"
          aria-label="Cloverfield home"
          className={s.item}
          onMouseEnter={onItemEnter}
          onFocus={onItemEnter}
        >
          <span className={s.itemBg} />
          <span className={s.label}>
            <span className={s.mark}>c</span>
            <span ref={wordmarkRef} className={s.wordmark}>
              loverfield
            </span>
          </span>
        </Link>

        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`${s.item} ${s.desktopOnly}`}
            onMouseEnter={onItemEnter}
            onFocus={onItemEnter}
          >
            <span className={s.itemBg} />
            <span className={s.label}>{item.label}</span>
          </Link>
        ))}

        <Link
          href="/#contact"
          className={`${s.item} ${s.isCta}`}
          onMouseEnter={onItemEnter}
          onFocus={onItemEnter}
        >
          <span className={s.itemBg} />
          <span className={s.label}>Book a call</span>
        </Link>

        <button
          type="button"
          className={`${s.item} ${s.menuButton}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={s.itemBg} />
          <span className={s.label}>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
