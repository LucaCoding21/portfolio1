"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps the videos inside `ref` out of the first page load, then wakes them
 * once they come within `margin` of the viewport: each video gets its poster
 * (written as data-poster in the markup) and starts buffering. At a normal
 * scrolling pace that is a couple of seconds before it comes into view, so
 * the first frames are there when it does; the first screen no longer
 * shares the connection with clips far down the page.
 *
 * Mark the videos preload="none" and move `poster` to `data-poster`.
 */
export function useWakeMedia(ref: RefObject<HTMLElement | null>, margin = "200% 0px") {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wake = () => {
      const videos = root instanceof HTMLVideoElement ? [root] : Array.from(root.querySelectorAll("video"));
      videos.forEach((v) => {
        const poster = v.dataset.poster;
        if (poster && !v.getAttribute("poster")) v.poster = poster;
        if (v.preload === "none") {
          v.preload = "auto";
          if (v.readyState === 0 && v.paused) v.load();
        }
      });
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        wake();
      },
      { rootMargin: margin }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [ref, margin]);
}
