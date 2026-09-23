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
 * { duration: 0.4, bounce: 0 }; the toggle icon turns -90deg -> 90deg.
 *
 * The "Studio" row is the reference's Docs dropdown: its sub-links drop in
 * on a 0.6s spring while the chevron turns 180deg.
 *
 * Content is ours; the reference's icons (Framer's stroke set) are kept, as
 * is the order: four links in two columns, then the dropdown row.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CAL_URL, REVIEW_CAL_URL } from "@/data/projects";
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
const DROP = { duration: 0.6, ease: spring };
/* the reference's delay(() => setVariant(...), 400) between the two steps */
const STEP_MS = 400;
const CLOSED_H = 64;

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

const IconSidebar = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 21c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v14c0 1.105-.895 2-2 2Z" />
    <path d="M9 3v18" />
  </Svg>
);
const IconGrid = (p: IconProps) => (
  <Svg {...p}>
    {[
      [3, 3],
      [14, 3],
      [3, 14],
      [14, 14],
    ].map(([x, y]) => (
      <rect key={`${x}${y}`} x={x} y={y} width={7} height={7} rx={1} />
    ))}
  </Svg>
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
const IconFileSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx={11.5} cy={14.5} r={3.5} />
    <path d="M4 22l5-5M4 15V4c0-1.105.895-2 2-2h8l6 6v12c0 1.105-.895 2-2 2h-7" />
  </Svg>
);
const IconMessageDots = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 15c0 1.105-.895 2-2 2H7l-4 4V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2ZM8 10h0M12 10h0M16 10h0" />
  </Svg>
);
const IconAngleDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
const IconArrowDownRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 7l10 10M17 7v10H7" />
  </Svg>
);

/* ---- content ---- */

const MAIN = [
  { label: "Home", href: "/", Icon: IconGrid },
  { label: "Sight", href: "/sight", Icon: IconSparkle },
  { label: "Work", href: "/work", Icon: IconCloud },
  { label: "Approach", href: "/#how-we-do-it", Icon: IconFileLines },
];

const SUB = [
  { label: "About", href: "/#about" },
  { label: "Website Review", href: REVIEW_CAL_URL, external: true },
  { label: "Contact", href: "/#contact" },
  { label: "Instagram", href: "https://www.instagram.com/cloverfield.studio/", external: true },
  { label: "Email", href: "mailto:cloverfield@cloverfield.studio", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cloverfieldstudio/", external: true },
];

export default function MobileDock() {
  const pathname = usePathname();
  const dockRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DockState>("closed");
  const [dropOpen, setDropOpen] = useState(false);
  const closedWRef = useRef(0);
  const openHRef = useRef(0);
  const stepRef = useRef<number | undefined>(undefined);

  /* Width and height run as separate tweens, like Framer's layout animation:
     "open" starts its height while the widening width is still landing, so a
     new tween only replaces one on the same property. */
  const tween = (prop: "width" | "height", from: number, to: number) => {
    const dock = dockRef.current;
    gsap.fromTo(
      dock,
      { [prop]: from },
      {
        [prop]: to,
        ...DOCK,
        overwrite: "auto",
        // Cleared by hand: as a clearProps var it would count as a shared
        // property, and "auto" would strip it from the other tween.
        onComplete: () => void gsap.set(dock, { clearProps: prop }),
      }
    );
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
    const dock = dockRef.current;
    if (!dock || state !== "closed") return;
    closedWRef.current = dock.getBoundingClientRect().width;
    setState("widening");
  };

  const close = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;
    setState((cur) => {
      if (cur !== "open") return cur;
      openHRef.current = dock.getBoundingClientRect().height;
      return "shrinking";
    });
  }, []);

  /* Each state's tween runs before paint, from the size the last state left.
     Sizes go back to the stylesheet once a tween lands. */
  useLayoutEffect(() => {
    const dock = dockRef.current;
    const grid = gridRef.current;
    if (!dock || !grid) return;
    window.clearTimeout(stepRef.current);

    if (state === "widening") {
      tween("width", closedWRef.current, grid.offsetWidth);
      stepRef.current = window.setTimeout(() => setState("open"), STEP_MS);
    } else if (state === "open") {
      tween("height", CLOSED_H, dock.getBoundingClientRect().height);
    } else if (state === "shrinking") {
      tween("height", openHRef.current, CLOSED_H);
      stepRef.current = window.setTimeout(() => setState("closed"), STEP_MS);
    } else if (closedWRef.current) {
      tween("width", grid.offsetWidth, dock.getBoundingClientRect().width);
    }
  }, [state]);

  useEffect(() => () => window.clearTimeout(stepRef.current), []);

  /* the Studio dropdown: 40px row <-> row plus sub-links */
  const firstDrop = useRef(true);
  useLayoutEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;
    if (firstDrop.current) {
      firstDrop.current = false;
      return;
    }
    const target = drop.getBoundingClientRect().height;
    const from = dropOpen ? 40 : drop.scrollHeight;
    gsap.fromTo(drop, { height: from }, { height: target, ...DROP, clearProps: "height", overwrite: true });
  }, [dropOpen]);

  /* Escape closes; growing past the mobile breakpoint snaps shut */
  useEffect(() => {
    if (state === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (!mq.matches) return;
      gsap.killTweensOf(dockRef.current, "width,height");
      window.clearTimeout(stepRef.current);
      gsap.set(dockRef.current, { clearProps: "width,height" });
      closedWRef.current = 0;
      setState("closed");
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [state, close]);

  /* Links close the dock. On the homepage, home and section links scroll
     there ourselves (see scrollToHash), as SiteNav does. */
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    close();
    if (pathname !== "/") return;
    if (href === "/") {
      e.preventDefault();
      scrollToTop();
      return;
    }
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
      <div className={s.top}>
        <Link href="/" className={s.brand} aria-label="Cloverfield home" onClick={onBrandClick}>
          <span className={s.logo} aria-hidden="true">
            c
          </span>
          <span className={s.title}>Cloverfield</span>
        </Link>
        <button
          type="button"
          className={s.toggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="dock-menu"
          aria-disabled={busy || undefined}
          onClick={isOpen ? close : open}
        >
          <IconSidebar className={s.toggleIcon} />
          <span className={s.toggleBg} />
        </button>
      </div>

      <div ref={gridRef} id="dock-menu" className={s.grid} inert={!isOpen}>
        {MAIN.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className={s.link}
            aria-current={isActive(href) ? "page" : undefined}
            onClick={(e) => onLinkClick(e, href)}
          >
            <span className={s.linkInner}>
              <Icon className={s.icon} />
              <span className={s.linkText}>{label}</span>
            </span>
            <span className={s.linkBg} />
          </Link>
        ))}

        <div ref={dropRef} className={`${s.drop} ${dropOpen ? s.dropOpen : ""}`}>
          <div className={s.dropRow}>
            <button
              type="button"
              className={s.link}
              aria-expanded={dropOpen}
              aria-controls="dock-studio"
              onClick={() => setDropOpen((o) => !o)}
            >
              <span className={s.linkInner}>
                <IconFileSearch className={s.icon} />
                <span className={s.linkText}>Studio</span>
              </span>
              <IconAngleDown className={s.chevron} />
              <span className={s.linkBg} />
            </button>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={s.link} onClick={close}>
              <span className={s.linkInner}>
                <IconMessageDots className={s.icon} />
                <span className={s.linkText}>Book A Free Call</span>
              </span>
              <span className={s.linkBg} />
            </a>
          </div>

          <div id="dock-studio" className={s.subGrid} inert={!dropOpen}>
            {SUB.map((item) => (
              <div key={item.label} className={s.subWrap}>
                {item.external ? (
                  <a
                    href={item.href}
                    className={s.sub}
                    onClick={close}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className={s.linkInner}>
                      <IconArrowDownRight className={s.icon} />
                      <span className={s.linkText}>{item.label}</span>
                    </span>
                    <span className={s.subBg} />
                  </a>
                ) : (
                  <Link href={item.href} className={s.sub} onClick={(e) => onLinkClick(e, item.href)}>
                    <span className={s.linkInner}>
                      <IconArrowDownRight className={s.icon} />
                      <span className={s.linkText}>{item.label}</span>
                    </span>
                    <span className={s.subBg} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
