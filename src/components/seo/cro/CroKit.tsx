"use client";

/**
 * Shared parts of the CRO showcase (SeoCro, Nov 24 2026): a clock that
 * plays a panel's loop and pauses while the section is off screen, and the
 * browser window that shows a real site we built (Northwest Railing's home
 * page, captured Nov 24 2026 at 1440 wide, public/seo/cro/nwr-page.webp).
 * Everything drawn over the page is placed in that capture's pixels
 * (PAGE_W x PAGE_H) so it stays on its button at any size.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import s from "../SeoCro.module.css";

export type PanelProps = { playing: boolean; still: boolean };

export const PAGE_W = 1440;
export const PAGE_H = 3260;

/** A box on the captured page, in its pixels. */
export function box(x: number, y: number, w?: number, h?: number): CSSProperties {
  return {
    left: `${(x / PAGE_W) * 100}%`,
    top: `${(y / PAGE_H) * 100}%`,
    ...(w != null ? { width: `${(w / PAGE_W) * 100}%` } : null),
    ...(h != null ? { height: `${(h / PAGE_H) * 100}%` } : null),
  };
}

/**
 * Plays a loop of `length` ms while `playing` and holds where it was while
 * not, so a panel picks up where it left off when the section comes back on
 * screen. `run` counts the loops (key a panel on it to restart its CSS
 * animations); `dim` is true for the last 350ms, for a fade between runs.
 * With reduced motion it sits on the loop's end.
 */
export function useClock(length: number, playing: boolean, still: boolean) {
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  const elapsed = useRef(0);

  useEffect(() => {
    if (!playing || still) return;
    let start = performance.now() - elapsed.current;
    const id = window.setInterval(() => {
      let e = performance.now() - start;
      if (e >= length) {
        start = performance.now();
        e = 0;
        setRun((r) => r + 1);
      }
      elapsed.current = e;
      setT(e);
    }, 80);
    return () => window.clearInterval(id);
  }, [playing, still, length]);

  return { t: still ? length - 400 : t, run, dim: !still && t > length - 350 };
}

/** The value of the last step at or before `t`. */
export function pick<T>(t: number, steps: [number, T][]): T {
  let v = steps[0][1];
  for (const [at, val] of steps) if (at <= t) v = val;
  return v;
}

/** mm:ss */
export function clock(sec: number) {
  const m = Math.floor(sec / 60);
  const r = Math.floor(sec % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/**
 * The browser window with the site in it. `y` scrolls the page (in its
 * pixels); `page` is drawn on the page and scrolls with it; `over` sits on
 * the window (the cursor); `tools` go at the right of the address bar.
 */
export function Browser({
  y = 0,
  scrollMs = 1100,
  page,
  over,
  tools,
  viewRef,
  className,
  pageClassName,
  layers,
}: {
  y?: number;
  scrollMs?: number;
  page?: ReactNode;
  over?: ReactNode;
  tools?: ReactNode;
  viewRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  pageClassName?: string;
  /** extra copies of the page stacked over it (the A/B test's variant) */
  layers?: ReactNode;
}) {
  return (
    <div className={`${s.browser} ${className ?? ""}`}>
      <div className={s.bar}>
        <span className={s.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          northwestrailing.com
        </span>
        <span className={s.tools}>{tools}</span>
      </div>
      <div ref={viewRef} className={s.view}>
        <div
          className={`${s.page} ${pageClassName ?? ""}`}
          style={{ transform: `translateY(${(-y / PAGE_H) * 100}%)`, transitionDuration: `${scrollMs}ms` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed capture, sized by its frame */}
          <img className={s.shot} src="/seo/cro/nwr-page.webp" width={1280} height={2898} alt="" loading="lazy" />
          {page}
        </div>
        {layers}
        {over}
      </div>
    </div>
  );
}

/** "We saw" / "We changed": every tab ends on what the data led to. */
export function Takeaway({ saw, changed }: { saw: string; changed: string }) {
  return (
    <div className={s.takeaway}>
      <p>
        <span className={s.takeLabel}>We saw</span>
        {saw}
      </p>
      <p>
        <span className={`${s.takeLabel} ${s.takeGood}`}>We changed</span>
        {changed}
      </p>
    </div>
  );
}
