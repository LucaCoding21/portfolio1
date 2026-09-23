"use client";

/**
 * Client wall under the hero: the old logo strip's framing (paper, eyebrow,
 * edge fades) holding two strips of cards cloned from clay.com's logo wall,
 * with tall quote cards spanning both strips beside logos, horizontal quotes
 * and outcome stats. Runs as a draggable marquee.
 *
 * Motion, from their logos.ts:
 * - The grid is cloned enough times to cover the track and each copy is
 *   translated by ((i * W + offset + W) % total) - W, advancing 24px/s to the
 *   left on the GSAP ticker (dt capped at 50ms). Hovering the track tweens
 *   the speed to 0 over 0.6s power2.out; leaving tweens it back.
 * - Draggable on a proxy with inertia moves the same offset; the ticker
 *   holds while a drag is down and resumes on release.
 * - Cards are plain, no links, no arrows, no per-card hover.
 *
 * Fonts: the reference sets Roobert; we use Outfit, the closest face already
 * loaded. Copy and people are SAMPLE placeholders, see data/clientWall.ts.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
import { WALL_CARDS, WALL_COLUMNS, WALL_LABEL, type WallCard } from "@/data/clientWall";
import s from "./ClientWall.module.css";

gsap.registerPlugin(Draggable, InertiaPlugin);

const SPEED = 24; // px per second
/* logo heights come from the strip data; bare cells use them as is (capped
   like the old strip), boxed cards cap lower to clear their 16px padding */
const MAX_BARE_LOGO = 52;
const MAX_BOXED_LOGO = 44;
const DIRECTION = -1; // left

function Card({ card }: { card: WallCard }) {
  const { logo, variant } = card;
  const style = {
    "--row": card.row,
    "--col": card.col,
    "--span": card.span ?? 1,
    "--tall": card.tall ?? 1,
  } as React.CSSProperties;
  return (
    <div
      className={s.card}
      style={style}
      data-variant={variant}
      data-item=""
    >
      <div className={s.logoBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={logo.name}
          loading="eager"
          className={`${s.logo} ${logo.dark ? s.logoDark : ""}`}
          style={
            {
              "--logo-h": `${card.logoHeight ?? Math.min(logo.height, variant === "logo" ? MAX_BARE_LOGO : MAX_BOXED_LOGO)}px`,
            } as React.CSSProperties
          }
        />
      </div>

      {(variant === "quote" || variant === "hquote") && (
        <div
          className={s.quote}
          style={
            {
              "--quote-w": card.quoteWidth != null ? `${card.quoteWidth}px` : "auto",
              "--quote-max-w": card.quoteMaxWidth != null ? `${card.quoteMaxWidth}px` : "none",
            } as React.CSSProperties
          }
        >
          {card.title && (
            <div className={s.title}>
              <div className={s.titleBig}>{card.title.big}</div>
              <div className={s.titleSmall}>{card.title.small}</div>
            </div>
          )}
          <p className={s.quoteText}>{card.quote}</p>
        </div>
      )}

      {/* Who the quote or stat belongs to. Hidden on screen, where the logo
          already says it; read by screen readers and page-text readers. */}
      {variant !== "logo" && (
        <span className="sr-only">
          {!card.person
            ? logo.name
            : [
                card.person.name,
                card.person.title,
                card.person.name === logo.name ? null : logo.name,
              ]
                .filter(Boolean)
                .join(", ")}
        </span>
      )}

      {variant === "hstat" && card.stat && (
        <div className={s.stat}>
          <div className={s.statValue}>{card.stat.value}</div>
          <div className={s.statLabel}>
            {card.stat.lines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientWall() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const base = baseRef.current;
    if (!wrap || !base) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;

    /* marquee */
    let track: HTMLDivElement | null = null;
    let copies: HTMLElement[] = [];
    let proxy: HTMLDivElement | null = null;
    let drag: Draggable | null = null;
    let unwire: (() => void)[] = [];
    let tickerFn: (() => void) | null = null;
    let width = 0;
    let total = 0;
    let offset = 0;
    let lastTime = 0;
    let dragging = false;
    const speed = { scale: 1 };

    const layout = () => {
      const n = copies.length;
      for (let i = 0; i < n; i++) {
        const x = ((i * width + offset + width) % total) - width;
        copies[i].style.transform = `translate3d(${x}px, 0, 0)`;
      }
    };
    const shift = (dx: number) => {
      offset += dx;
      if (offset < 0 || offset >= total) offset = ((offset % total) + total) % total;
    };

    const teardown = () => {
      unwire.forEach((f) => f());
      unwire = [];
      if (tickerFn) gsap.ticker.remove(tickerFn);
      tickerFn = null;
      dragging = false;
      lastTime = 0;
      offset = 0;
      gsap.killTweensOf(speed);
      speed.scale = 1;
      drag?.kill();
      drag = null;
      if (proxy) {
        gsap.killTweensOf(proxy);
        proxy.remove();
        proxy = null;
      }
      if (track && track.isConnected) {
        track.parentElement?.insertBefore(base, track);
        track.remove();
      }
      track = null;
      for (const c of copies) if (c !== base) c.remove();
      copies = [];
      base.style.transform = "";
      gsap.set(base, { clearProps: "all" });
    };

    const build = () => {
      const rect = base.getBoundingClientRect();
      width = rect.width;
      const height = rect.height;
      if (width === 0) return;
      const trackWidth = wrap.getBoundingClientRect().width;
      const clones = Math.max(1, Math.ceil(trackWidth / width) + 1);

      track = document.createElement("div");
      track.setAttribute("data-track", "");
      Object.assign(track.style, {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: `${height}px`,
        touchAction: "pan-y",
      });
      wrap.insertBefore(track, base);
      track.appendChild(base);
      copies = [base];
      for (let i = 0; i < clones; i++) {
        const clone = base.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
        copies.push(clone);
      }
      gsap.set(copies, { position: "absolute", top: 0, left: 0, width, height, willChange: "transform" });
      total = width * copies.length;
      offset = 0;
      layout();

      const tweenSpeed = (v: number) => gsap.to(speed, { scale: v, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      const onEnter = () => tweenSpeed(0);
      const onLeave = () => tweenSpeed(1);
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      lastTime = 0;
      tickerFn = () => {
        if (dragging) {
          lastTime = 0;
          return;
        }
        const now = performance.now();
        const dt = lastTime === 0 ? 0 : Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        if (dt === 0 || speed.scale === 0) return;
        shift(DIRECTION * SPEED * speed.scale * dt);
        layout();
      };
      gsap.ticker.add(tickerFn);

      proxy = document.createElement("div");
      let lastX = 0;
      const onDragMove = () => {
        if (!drag) return;
        const dx = drag.x - lastX;
        lastX = drag.x;
        if (dx === 0) return;
        shift(dx);
        layout();
      };
      drag = Draggable.create(proxy, {
        type: "x",
        trigger: track,
        inertia: true,
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: true,
        onPressInit() {
          lastX = 0;
          gsap.set(proxy, { x: 0 });
          dragging = true;
        },
        onDrag: onDragMove,
        onRelease() {
          dragging = false;
        },
        onThrowUpdate: onDragMove,
      })[0];

      const t = track;
      unwire.push(() => {
        t.removeEventListener("mouseenter", onEnter);
        t.removeEventListener("mouseleave", onLeave);
      });
    };

    const imagesReady = async () => {
      try {
        await document.fonts?.ready;
      } catch {}
      const imgs = Array.from(base.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  const done = () => resolve();
                  img.addEventListener("load", done, { once: true });
                  img.addEventListener("error", done, { once: true });
                  setTimeout(done, 300);
                })
        )
      );
    };

    let lastWidth = window.innerWidth;
    const rebuild = async () => {
      teardown();
      if (disposed) return;
      await imagesReady();
      if (disposed) return;
      build();
    };
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      rebuild();
    };
    window.addEventListener("resize", onResize);
    rebuild();

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      teardown();
    };
  }, []);

  return (
    <section className={s.section} aria-label={WALL_LABEL}>
      <p className={s.label}>{WALL_LABEL}</p>
      <div ref={wrapRef} className={s.wrap}>
        <div ref={baseRef} className={s.base} style={{ "--cols": WALL_COLUMNS } as React.CSSProperties}>
          {WALL_CARDS.map((card) => (
            <Card key={`${card.logo.name}-${card.row}-${card.col}`} card={card} />
          ))}
        </div>
        <div className={`${s.shade} ${s.shadeRight}`} />
        <div className={s.shade} />
      </div>

    </section>
  );
}
