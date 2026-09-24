"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/projects";
import MobileMenu from "./MobileMenu";
import AudioToggle from "./AudioToggle";

/**
 * Two states, one capsule.
 *
 * At the top of the homepage the bar is invisible: white type sitting straight
 * on the hero, full width. Scroll past the fold and it condenses into a white
 * glass pill with charcoal type, narrower, with a soft shadow. The morph is
 * one spring-ish transition on width, padding, colour and background.
 *
 * Hover on a link slides a highlight pill under it; the active route carries
 * a dot. Scrolling down tucks the bar away, scrolling up brings it back.
 */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Header({ solid }: { solid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const condensed = (solid ?? !isHome) || scrolled;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastScrollY.current && y > 120) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset transient state on route change so a hidden bar never carries over.
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setHidden(false);
    setScrolled(false);
    setMenuOpen(false);
  }

  // Hover pill: measure the hovered link against the nav and slide there.
  const movePill = useCallback((el: HTMLElement | null) => {
    const nav = navRef.current;
    if (!nav || !el) return;
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ x: r.left - n.left, w: r.width, on: true });
  }, []);
  const hidePill = useCallback(() => setPill((p) => ({ ...p, on: false })), []);

  const isActive = (href: string) => (href.startsWith("/#") ? false : pathname === href);

  return (
    <header
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
      style={{
        // Slide via `top`, not transform: a transformed header would trap the
        // fixed-position mobile overlay inside its own box.
        top: hidden && !menuOpen ? -120 : 0,
        transition: `top 0.6s ${EASE}`,
      }}
    >
      <div
        className="pointer-events-auto relative flex w-full items-center justify-between"
        style={{
          maxWidth: condensed || menuOpen ? 920 : 1240,
          padding: condensed ? "8px 8px 8px 22px" : "14px 6px 14px 26px",
          borderRadius: 999,
          background: menuOpen
            ? "transparent"
            : condensed
              ? "rgba(255,255,255,0.82)"
              : "transparent",
          backdropFilter: condensed && !menuOpen ? "blur(18px) saturate(1.6)" : "none",
          WebkitBackdropFilter: condensed && !menuOpen ? "blur(18px) saturate(1.6)" : "none",
          border: `1px solid ${condensed && !menuOpen ? "rgba(17,17,19,0.08)" : "rgba(255,255,255,0)"}`,
          boxShadow: condensed && !menuOpen
            ? "0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 30px -12px rgba(17,17,19,0.25), 0 2px 6px rgba(17,17,19,0.06)"
            : "none",
          color: condensed || menuOpen ? "#111113" : "#ffffff",
          transition: `max-width 0.6s ${EASE}, padding 0.6s ${EASE}, background 0.5s ${EASE}, border-color 0.5s ${EASE}, box-shadow 0.6s ${EASE}, color 0.4s ${EASE}`,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 font-[family-name:var(--font-outfit)] font-semibold tracking-tight"
          style={{
            fontSize: condensed ? 20 : 24,
            textShadow: condensed || menuOpen ? "none" : "0 1px 2px rgba(0,0,0,0.35)",
            transition: `font-size 0.6s ${EASE}, text-shadow 0.4s ${EASE}`,
          }}
        >
          cloverfield
        </Link>

        {/* Desktop links, with the sliding highlight behind them. */}
        <nav
          ref={navRef}
          onMouseLeave={hidePill}
          className="relative hidden items-center md:flex"
        >
          <span
            aria-hidden
            className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full"
            style={{
              left: pill.x,
              width: pill.w,
              opacity: pill.on ? 1 : 0,
              background: condensed ? "rgba(17,17,19,0.06)" : "rgba(255,255,255,0.16)",
              transition: `left 0.35s ${EASE}, width 0.35s ${EASE}, opacity 0.25s ${EASE}, background 0.4s ${EASE}`,
            }}
          />
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={(e) => movePill(e.currentTarget)}
                onFocus={(e) => movePill(e.currentTarget)}
                className={`relative z-10 px-4 py-2 font-[family-name:var(--font-outfit)] text-[15px] font-medium tracking-tight ${
                  item.href === "/sight" && condensed ? "sight-nav-link" : ""
                }`}
                style={{
                  // Sight only shimmers in the condensed pill; over the hero it
                  // is plain white like the rest.
                  textShadow: condensed || menuOpen ? "none" : "0 1px 2px rgba(0,0,0,0.35)",
                  transition: `text-shadow 0.4s ${EASE}`,
                }}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: audio + call to action. */}
        <div className="relative z-10 hidden items-center gap-1 md:flex">
          <AudioToggle tone={condensed ? "dark" : "light"} />
          <Link
            href="/#contact"
            className="group ml-2 inline-flex items-center gap-2 rounded-full px-5 font-[family-name:var(--font-outfit)] text-[15px] font-medium tracking-tight"
            style={{
              height: condensed ? 40 : 44,
              background: condensed ? "#111113" : "#ffffff",
              color: condensed ? "#ffffff" : "#111113",
              transition: `height 0.6s ${EASE}, background 0.4s ${EASE}, color 0.4s ${EASE}, transform 0.3s ${EASE}`,
            }}
          >
            Book a call
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </Link>
        </div>

        {/* Mobile: two lines that fold into a cross. */}
        <button
          type="button"
          className="relative z-50 mr-2 flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className="absolute block h-[2px] w-5 rounded-full bg-current"
            style={{
              transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)",
              transition: `transform 0.4s ${EASE}`,
            }}
          />
          <span
            className="absolute block h-[2px] w-5 rounded-full bg-current"
            style={{
              transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)",
              transition: `transform 0.4s ${EASE}`,
            }}
          />
        </button>
      </div>

      <div className="pointer-events-auto">
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
}
