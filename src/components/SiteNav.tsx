"use client";

/**
 * Nav cloned from a reference site: a centred row of items on one sheet of glass.
 * Items are plain text at rest; on hover one white pill slides under the
 * pointer (0.3s expo.out) and the label rolls: it slides out the top as a
 * copy slides in from below, on calebwu.ca's ease. The call to action is the only solid (black) pill.
 * Over the hero the nav runs a "dark" theme (slightly more opaque bar), after
 * it a "light" one. Past 400px of scroll the wordmark folds away and only the
 * mark stays (0.6s power4.out).
 *
 * The reference's flower + wordmark becomes our "c" mark + "loverfield".
 * The sound toggle is gone by request.
 *
 * Mobile menu, also cloned from the reference: "Menu" does not open a separate
 * overlay. The bar itself widens to the viewport minus 16px a side (0.5s,
 * custom ease 0.85,0.05,0.09,0.91) while the logo row nudges 4px in, and at
 * 0.2s a white panel drops out of it (height 0 to auto, 0.15s). Close runs
 * width and height back together (0.26s power3.inOut).
 *
 * First load of the homepage: hidden under the loader, then, as the hero
 * starts building in, the whole bar slides down into place from above the
 * viewport as one piece (0.8s on calebwu.ca's ease), on the same beat as
 * the headline.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CAL_URL, NAV_ITEMS } from "@/data/projects";
import { scrollToHash, scrollToTop } from "@/lib/scrollToHash";
import { INTRO_EVENT } from "@/lib/intro";
import s from "./SiteNav.module.css";

gsap.registerPlugin(CustomEase);

// The reference's motion tokens.
const DURATION = { fast: 0.3, medium: 0.6, slow: 1 };
const EASE = "power4.out";
const EASE_OUT = "expo.out";

const COLLAPSE_AT = 400;
const EXPAND_AT = 360;

// The reference's mobile menu timings.
const MENU_OPEN = { duration: 0.5, ease: CustomEase.create("menuOpen", "0.85, 0.05, 0.09, 0.91") };
const MENU_PANEL_OPEN = { duration: 0.5 * DURATION.fast };
const MENU_CLOSE = { duration: 0.26, ease: "power3.inOut" };
const MENU_ROW_NUDGE = 4;

// The first-load reveal: the whole bar slides down from just above the
// viewport (its 16px offset, the 54px glass and room for the shadow) on
// calebwu.ca's ease.
const REVEAL = { duration: 0.8, ease: CustomEase.create("cfNavReveal", "0.62, 0.61, 0.02, 1") };
const REVEAL_FROM = 100;
/* If the hero never signals (an error, a slow reel), open anyway. */
const REVEAL_FALLBACK_MS = 5000;

// The panel lists Home first; Sight sits under the rule, like their Login.
const MENU_MAIN = [{ label: "Home", href: "/" }, ...NAV_ITEMS.filter((i) => i.href !== "/sight")];
const MENU_AFTER_RULE = NAV_ITEMS.filter((i) => i.href === "/sight");

type MenuState = "closed" | "opening" | "open" | "closing";

export default function SiteNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const closedWidthRef = useRef(0);
  const [menu, setMenu] = useState<MenuState>("closed");
  const menuShown = menu !== "closed";
  // The "Menu" label (and our CTA) hide while opening or open, and come back
  // as soon as closing starts; "Close" only exists while opening or open.
  const rowLabelsHidden = menu === "opening" || menu === "open";
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const hoveredRef = useRef(false);

  /* reveal: only on a full load of the homepage, where the loader covers
     the hidden state (elsewhere the server-rendered nav is already up).
     The whole bar slides down from above the viewport into place as one
     piece. The nav keeps its own centring transform, so the slide goes on
     its two layers (glass and row), moved together. */
  useLayoutEffect(() => {
    const nav = navRef.current;
    const ring = nav?.querySelector<HTMLElement>(`.${s.ring}`);
    const row = rowRef.current;
    if (!nav || !ring || !row || pathname !== "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = [ring, row];
    gsap.set(layers, { y: -REVEAL_FROM });

    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      gsap.to(layers, {
        y: 0,
        ...REVEAL,
        onComplete: () => {
          gsap.set(layers, { clearProps: "transform" });
        },
      });
    };
    window.addEventListener(INTRO_EVENT, open, { once: true });
    const fallback = window.setTimeout(open, REVEAL_FALLBACK_MS);
    return () => {
      window.removeEventListener(INTRO_EVENT, open);
      window.clearTimeout(fallback);
      if (!done) gsap.set(layers, { clearProps: "transform" });
    };
    // Mount only: a client-side move to "/" keeps the nav as it is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* theme: the hero (or any element flagged data-nav-theme="dark") sets it */
  useEffect(() => {
    const onTheme = (e: Event) => {
      const t = (e as CustomEvent<"dark" | "light">).detail;
      if (t === "dark" || t === "light") setTheme(t);
    };
    window.addEventListener("cloverfield:nav-theme", onTheme);
    return () => window.removeEventListener("cloverfield:nav-theme", onTheme);
  }, []);

  // Only the homepage has a dark hero; every other page runs light.
  const effectiveTheme = pathname === "/" ? theme : "light";

  /* collapse the wordmark after 400px, expand again under 360px */
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    // Natural width of the wordmark, read from its text each time it opens:
    // a one-off measure on mount could catch the fallback font, or the item
    // still squeezed shut by the first-load reveal, and stick at that.
    const fullWidth = () => el.scrollWidth;
    let collapsed = window.scrollY >= COLLAPSE_AT;
    const apply = (c: boolean) => {
      gsap.to(el, {
        width: c ? 0 : fullWidth(),
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

  /* Already on the homepage: scroll to the section ourselves, so a section
     held under a card lands uncovered (see scrollToHash). */
  const onHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/" || !href.startsWith("/#")) return;
    if (scrollToHash(href.slice(1))) {
      e.preventDefault();
      history.pushState(null, "", href);
    }
  };

  /* The logo on the homepage: back up to the hero. Elsewhere it's a plain
     link home. Modified clicks (new tab) are left alone. */
  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (menuShown) {
      closeMenu();
      return;
    }
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.hash) history.pushState(null, "", "/");
    scrollToTop();
  };

  const isActive = (href: string) => !href.startsWith("/#") && pathname === href;

  /* ---- mobile menu ---- */

  const newMenuTl = () => {
    menuTlRef.current?.kill();
    const tl = gsap.timeline();
    menuTlRef.current = tl;
    return tl;
  };

  const openMenu = () => {
    const nav = navRef.current;
    if (!nav) return;
    closedWidthRef.current = nav.getBoundingClientRect().width;
    setMenu("opening");
  };

  const closeMenu = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    setMenu("closing");
    const tl = newMenuTl();
    tl.to(nav, { width: closedWidthRef.current, autoRound: false, ...MENU_CLOSE }, 0);
    tl.to(rowRef.current, { x: 0, y: 0, ...MENU_CLOSE }, 0);
    tl.to(panelRef.current, { height: 0, ...MENU_CLOSE }, 0);
    tl.call(() => setMenu("closed"));
  }, []);

  // opening: the bar grows from its closed width to its open one
  useLayoutEffect(() => {
    if (menu !== "opening") return;
    const nav = navRef.current;
    if (!nav) return;
    const tl = newMenuTl();
    gsap.set(panelRef.current, { height: 0 });
    const target = nav.getBoundingClientRect().width;
    tl.fromTo(
      nav,
      { width: closedWidthRef.current },
      { width: target, autoRound: false, clearProps: "width", ...MENU_OPEN },
      0
    );
    tl.to(rowRef.current, { x: MENU_ROW_NUDGE, y: MENU_ROW_NUDGE, ...MENU_OPEN }, 0);
    tl.call(() => setMenu("open"), undefined, 0.2);
  }, [menu]);

  // open: the white panel drops down
  useLayoutEffect(() => {
    if (menu !== "open") return;
    gsap.fromTo(panelRef.current, { height: 0 }, { height: "auto", ...MENU_PANEL_OPEN });
  }, [menu]);

  // closed: hand the width back to the stylesheet before paint
  useLayoutEffect(() => {
    if (menu !== "closed") return;
    gsap.set(navRef.current, { clearProps: "width" });
    gsap.set(rowRef.current, { clearProps: "transform" });
  }, [menu]);

  // Escape closes; growing past the mobile breakpoint resets at once
  useEffect(() => {
    if (!menuShown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (!mq.matches) return;
      menuTlRef.current?.kill();
      gsap.set(panelRef.current, { height: 0 });
      setMenu("closed");
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menuShown, closeMenu]);

  const onMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu();
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

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={`${s.nav} ${s[effectiveTheme]} ${hovered ? s.isHovered : ""} ${
        menuShown ? s.menuShown : ""
      } ${menu === "open" || menu === "closing" ? s.menuTall : ""}`}
      onMouseEnter={onNavEnter}
      onMouseLeave={onNavLeave}
    >
      <div className={s.ring} />

      <div ref={rowRef} className={s.row}>
        <span ref={pillRef} className={s.pill} aria-hidden="true" />

        <Link
          href="/"
          aria-label="Cloverfield home"
          className={s.item}
          onClick={onLogoClick}
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
            onClick={(e) => onHashClick(e, item.href)}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`${s.item} ${s.desktopOnly}`}
            onMouseEnter={onItemEnter}
            onFocus={onItemEnter}
          >
            <span className={s.itemBg} />
            {/* "Sight" shimmers blue once the nav is off the dark hero (and
                always on pages without one). The class clips a moving
                gradient to the letters, so it goes on the text, not the pill. */}
            <span className={s.label}>
              {/* Same roll as the call to action: two stacked copies in a
                  clipped box, and hover slides the stack up one row. The
                  shimmer goes on each copy, since a moving child breaks a
                  text clip set on its parent. */}
              <span className={s.flip}>
                {[0, 1].map((copy) => (
                  <span
                    key={copy}
                    aria-hidden={copy === 1 || undefined}
                    className={`${s.flipRow} ${
                      item.href === "/sight" && effectiveTheme === "light" ? "sight-nav-link" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        ))}

        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${s.item} ${s.isCta} ${rowLabelsHidden ? s.rowHidden : ""}`}
          tabIndex={rowLabelsHidden ? -1 : undefined}
          onMouseEnter={onItemEnter}
          onFocus={onItemEnter}
        >
          <span className={s.itemBg} />
          <span className={s.label}>
            {/* Two stacked copies in a clipped box: hover slides the stack up
                one row, so the label flips out the top and back in from below. */}
            <span className={s.flip}>
              <span className={s.flipRow}>Book A Free Call</span>
              <span className={s.flipRow} aria-hidden>
                Book A Free Call
              </span>
            </span>
          </span>
        </a>

        <button
          type="button"
          className={`${s.item} ${s.menuButton}`}
          aria-label="Open menu"
          aria-expanded={menuShown}
          aria-controls="mobile-menu"
          onClick={menuShown ? closeMenu : openMenu}
        >
          <span className={s.itemBg} />
          <span className={`${s.label} ${rowLabelsHidden ? s.rowHidden : ""}`}>Menu</span>
        </button>
      </div>

      {/* Mobile menu panel: white, drops out of the bar (see top of file) */}
      <div
        ref={panelRef}
        id="mobile-menu"
        className={`${s.panel} ${menu === "open" ? "" : s.panelInert}`}
        hidden={!menuShown}
      >
        <div className={s.panelInner}>
          <div className={s.panelList}>
            {MENU_MAIN.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => onMenuLinkClick(e, item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={s.panelLink}
              >
                {item.label}
              </Link>
            ))}
            {MENU_AFTER_RULE.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => onMenuLinkClick(e, item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`${s.panelLink} ${s.panelLinkRuled}`}
              >
                <span className="sight-nav-link">{item.label}</span>
              </Link>
            ))}
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className={s.panelCta}
            >
              Book A Free Call
            </a>
          </div>
        </div>
      </div>

      {rowLabelsHidden && (
        <button type="button" className={s.close} onClick={closeMenu} aria-label="Close menu">
          Close
        </button>
      )}
    </nav>
  );
}
