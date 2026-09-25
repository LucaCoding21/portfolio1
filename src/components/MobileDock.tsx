"use client";

/**
 * Mobile nav, cloned 1:1 from dock-menu.framer.website (a Framer "Dock
 * Menu"). Under 768px it replaces SiteNav.
 *
 * The dock has four states, the reference's four variants:
 *   closed    - 64px tall, as wide as the logo row          ("Desktop 1")
 *   widening  - still 64px, grows to the grid's width      ("Desktop 2")
 *   open      - grows down to show the grid                ("Desktop 3")
 *   shrinking - folds back to 64px at full width           ("Desktop 4")
 * The button moves closed -> widening; 400ms later the dock moves on to open
 * by itself. Close runs open -> shrinking -> (400ms) -> closed. The button
 * ignores taps mid-way, as in the reference. Each step is Framer's spring
 * { duration: 0.4, bounce: 0 }. The toggle's four clover leaves spin and
 * slim into an X as soon as it is tapped (see .dots in the stylesheet).
 *
 * Framer runs these as layout animations: nothing reflows, boxes move and
 * scale on the GPU. The dock does the same with its own means. Its content
 * is always laid out at the open size; a clip-path cuts it down to the
 * current shape, a separate blurred plate behind it follows that shape, and
 * the logo and toggle slide with the side edges. One tween drives all four.
 *
 * Content and colours are ours: four links in two columns and a full-width
 * call button, on a light frosted plate matching SiteNav's palette. The
 * reference's icons (Framer's stroke set) are kept.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CAL_URL } from "@/data/projects";
import { scrollToHash, scrollToTop } from "@/lib/scrollToHash";
import { INTRO_EVENT } from "@/lib/intro";
import s from "./MobileDock.module.css";

gsap.registerPlugin(CustomEase);

/* Framer's { type: "spring", bounce: 0 }: critically damped, and Motion
   sizes it so (1 + u)e^-u = 0.001 at the given duration (u = 9.2334). */
const U = 9.233413476451586;
const SPRING_END = 1 - (1 + U) * Math.exp(-U);
const spring = (p: number) => (1 - (1 + U * p) * Math.exp(-U * p)) / SPRING_END;

const DOCK = { duration: 0.4, ease: spring };
/* the reference's delay(() => setVariant(...), 400) between the two steps */
const STEP_MS = 400;
const CLOSED_H = 64;
/* closed pill = brand + 64px gap + 32px toggle + 16px padding each side */
const CLOSED_EXTRA = 64 + 32 + 16 * 2;

/* Same first-load slide as SiteNav, so the two navs arrive alike. */
const REVEAL = { duration: 0.8, ease: CustomEase.create("cfDockReveal", "0.62, 0.61, 0.02, 1") };
const REVEAL_FROM = 100;
const REVEAL_FALLBACK_MS = 5000;

type DockState = "closed" | "widening" | "open" | "shrinking";

/* ---- icons: the reference's paths, 24 box, 2px round strokes ---- */

type IconProps = { className?: string };
const Svg = ({ className, children }: IconProps & { children: React.ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12c6 .667 9.333 4 10 10 .667-6 4-9.333 10-10-6-.667-9.333-4-10-10-.667 6-4 9.333-10 10Z" />
  </Svg>
);
const IconCloud = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 20c2.761 0 5-2.238 5-5 0-2.761-2.239-5-5-5-.552-3.589-3.91-6.052-7.5-5.5C6.91 5.053 4.448 8.411 5 12c-2.209 0-4 1.791-4 4s1.791 4 4 4Z" />
  </Svg>
);
const IconFileLines = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 2H6c-1.105 0-2 .895-2 2v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8Z" />
    <path d="M16 13H8M16 17H8M12 9H8" />
  </Svg>
);
const IconUser = (p: IconProps) => (
  <Svg {...p}>
    <circle cx={12} cy={8} r={4} />
    <path d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8" />
  </Svg>
);
const IconMessageDots = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 15c0 1.105-.895 2-2 2H7l-4 4V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2ZM8 10h0M12 10h0M16 10h0" />
  </Svg>
);
/* ---- content ---- */

const MAIN = [
  { label: "Work", href: "/work", Icon: IconCloud },
  { label: "Approach", href: "/#how-we-do-it", Icon: IconFileLines },
  { label: "About", href: "/#about", Icon: IconUser },
  { label: "Sight", href: "/sight", Icon: IconSparkle, sight: true },
];

type Geom = { side: number; bottom: number };

export default function MobileDock() {
  const pathname = usePathname();
  const dockRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<DockState>("closed");
  const stateRef = useRef<DockState>("closed");
  const stepRef = useRef<number | undefined>(undefined);
  /* how far the visible shape is cut in from each side and from the bottom */
  const geom = useRef<Geom>({ side: 0, bottom: 0 });
  const placedRef = useRef(false);

  const render = useCallback(() => {
    const { side, bottom } = geom.current;
    const surface = surfaceRef.current;
    const content = contentRef.current;
    if (!surface || !content || !brandRef.current || !toggleRef.current) return;
    surface.style.inset = `0 ${side}px ${bottom}px`;
    content.style.clipPath = `inset(0 ${side}px ${bottom}px round 20px)`;
    brandRef.current.style.transform = `translateX(${side}px)`;
    toggleRef.current.style.transform = `translateX(${-side}px)`;
  }, []);

  /* the cuts that leave just the closed pill; null while hidden (desktop) */
  const closedGeom = (): Geom | null => {
    const content = contentRef.current;
    const brand = brandRef.current;
    if (!content || !brand || !content.offsetWidth) return null;
    const pill = brand.offsetWidth + CLOSED_EXTRA;
    // whole pixels, so hairlines and the logo tile's border rest crisp
    return {
      side: Math.max(0, Math.round((content.offsetWidth - pill) / 2)),
      bottom: Math.max(0, content.offsetHeight - CLOSED_H),
    };
  };

  /* Sides and bottom run as separate tweens, like Framer's layout animation:
     "open" starts its bottom while the widening sides are still landing. */
  const tween = (to: Partial<Geom>) => {
    gsap.to(geom.current, { ...to, ...DOCK, overwrite: "auto", onUpdate: render });
  };

  /* first load of the homepage: slide in with the hero, like SiteNav */
  useLayoutEffect(() => {
    const dock = dockRef.current;
    if (!dock || pathname !== "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(dock, { y: -REVEAL_FROM });
    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      gsap.to(dock, { y: 0, ...REVEAL, onComplete: () => void gsap.set(dock, { clearProps: "y,transform" }) });
    };
    window.addEventListener(INTRO_EVENT, open, { once: true });
    const fallback = window.setTimeout(open, REVEAL_FALLBACK_MS);
    return () => {
      window.removeEventListener(INTRO_EVENT, open);
      window.clearTimeout(fallback);
      if (!done) gsap.set(dock, { clearProps: "y,transform" });
    };
    // Mount only: a client-side move to "/" keeps the dock as it is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = () => {
    if (state !== "closed") return;
    setState("widening");
  };

  const close = useCallback(() => {
    setState((cur) => (cur === "open" ? "shrinking" : cur));
  }, []);

  /* Each state's tween starts before paint, from wherever the last one is. */
  useLayoutEffect(() => {
    stateRef.current = state;
    window.clearTimeout(stepRef.current);
    const closed = closedGeom();
    if (!closed) return;

    if (state === "widening") {
      tween({ side: 0 });
      stepRef.current = window.setTimeout(() => setState("open"), STEP_MS);
    } else if (state === "open") {
      tween({ bottom: 0 });
    } else if (state === "shrinking") {
      tween({ bottom: closed.bottom });
      stepRef.current = window.setTimeout(() => setState("closed"), STEP_MS);
    } else if (placedRef.current) {
      tween({ side: closed.side });
    } else {
      // first paint: straight to the pill, then show the dock
      Object.assign(geom.current, closed);
      render();
      placedRef.current = true;
      dockRef.current!.dataset.ready = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => () => window.clearTimeout(stepRef.current), []);

  /* Keep the resting shapes right when the content resizes (fonts landing,
     rotation, coming back from desktop). */
  useEffect(() => {
    const content = contentRef.current;
    const brand = brandRef.current;
    if (!content || !brand) return;
    const ro = new ResizeObserver(() => {
      const cur = stateRef.current;
      if (gsap.isTweening(geom.current) || (cur !== "closed" && cur !== "open")) return;
      const closed = closedGeom();
      if (!closed) return;
      // mutate, never replace: tweens hold this object
      Object.assign(geom.current, cur === "closed" ? closed : { side: 0, bottom: 0 });
      render();
      placedRef.current = true;
      if (dockRef.current) dockRef.current.dataset.ready = "";
    });
    ro.observe(content);
    ro.observe(brand);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Escape closes; growing past the mobile breakpoint snaps shut */
  useEffect(() => {
    if (state === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (!mq.matches) return;
      gsap.killTweensOf(geom.current);
      window.clearTimeout(stepRef.current);
      setState("closed");
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [state, close]);

  /* Links close the dock. On the homepage, section links scroll there
     ourselves (see scrollToHash), as SiteNav does. */
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    close();
    if (pathname !== "/") return;
    if (href.startsWith("/#") && scrollToHash(href.slice(1))) {
      e.preventDefault();
      history.pushState(null, "", href);
    }
  };

  const onBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (state !== "closed") {
      e.preventDefault();
      close();
      return;
    }
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.hash) history.pushState(null, "", "/");
    scrollToTop();
  };

  const isActive = (href: string) => !href.startsWith("/#") && pathname === href;
  const isOpen = state === "open";
  const busy = state === "widening" || state === "shrinking";

  return (
    <nav ref={dockRef} className={s.dock} data-state={state} aria-label="Mobile navigation">
      <div ref={surfaceRef} className={s.surface} aria-hidden="true" />
      <div ref={contentRef} className={s.content}>
        <div className={s.top}>
          <Link ref={brandRef} href="/" className={s.brand} aria-label="Cloverfield home" onClick={onBrandClick}>
            {/* the brand mark, cropped square around the C so it sits centred */}
            <Image className={s.logo} src="/brand-mark.png" alt="" width={32} height={32} priority />
            <span className={s.title}>Cloverfield</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={s.toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="dock-menu"
            aria-disabled={busy || undefined}
            onClick={isOpen ? close : open}
          >
            <span className={s.dots} aria-hidden="true">
              <span className={s.dot} />
              <span className={s.dot} />
              <span className={s.dot} />
              <span className={s.dot} />
            </span>
            <span className={s.toggleBg} />
          </button>
        </div>

        <div id="dock-menu" className={s.grid} inert={!isOpen}>
          {MAIN.map(({ label, href, Icon, sight }) => (
            <Link
              key={label}
              href={href}
              className={sight ? `${s.link} ${s.sight}` : s.link}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={(e) => onLinkClick(e, href)}
            >
              <span className={s.linkInner}>
                <Icon className={s.icon} />
                {/* Sight shimmers blue like SiteNav's (.sight-nav-link) */}
                <span className={sight ? `${s.linkText} sight-nav-link` : s.linkText}>{label}</span>
              </span>
              <span className={s.linkBg} />
            </Link>
          ))}

          <a href={CAL_URL} data-track="mobile-dock" target="_blank" rel="noopener noreferrer" className={s.cta} onClick={close}>
            <IconMessageDots className={s.icon} />
            <span className={s.linkText}>Book A Free Call</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
