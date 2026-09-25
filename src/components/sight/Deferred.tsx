"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Mounts a section a beat later when the page arrives by client-side
 * navigation (tapping Sight on the homepage), one section per frame, in
 * page order. Mounting every section at once built ~5,000 elements and ran
 * every section's GSAP setup in a single task, which froze a phone for a
 * second or more before the hero could even paint.
 *
 * A full page load renders everything as before: the sections are in the
 * server HTML (search engines and no-JS see the whole page) and hydrate in
 * place. Only mounts after the app has hydrated are staggered.
 */

/* Hydrating the server HTML: the page's <main> is already in the document.
   A client-side navigation renders before it exists. */
const hydrating = () =>
  typeof document === "undefined" || !!document.querySelector("[data-sight-main]");

const queue: (() => void)[] = [];
let running = false;
let open = false;

/* The hero's headline plays as staggered CSS animations (.cine-load, about
   1.5s end to end). On iPhone Safari a delayed animation needs the main
   thread to start, so mounting sections underneath it froze the headline
   after its first word. Wait for it to land, or for the first scroll,
   whichever comes first. */
const ENTRANCE_MS = 1500;
function gate() {
  const go = () => {
    if (open) return;
    open = true;
    clearTimeout(timer);
    window.removeEventListener("scroll", go);
    window.removeEventListener("touchmove", go);
    pump();
  };
  const timer = setTimeout(go, ENTRANCE_MS);
  window.addEventListener("scroll", go, { passive: true });
  window.addEventListener("touchmove", go, { passive: true });
}

/* A frame to paint, then a fresh task: each section mounts in its own
   task with a paint in between, instead of one long one. */
function pump() {
  if (running || !open) return;
  const next = queue.shift();
  if (!next) {
    open = false; // the next visit waits for its headline again
    return;
  }
  running = true;
  requestAnimationFrame(() =>
    setTimeout(() => {
      running = false;
      next();
      pump();
    }, 0)
  );
}

export default function Deferred({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(hydrating);

  useEffect(() => {
    if (shown) return;
    let live = true;
    if (!queue.length && !running && !open) gate();
    queue.push(() => live && setShown(true));
    pump();
    return () => {
      live = false;
    };
  }, [shown]);

  // Holds a screen's worth of room so the footer doesn't ride up under
  // the hero while the rest arrives.
  return shown ? children : <div aria-hidden className="min-h-screen" />;
}
