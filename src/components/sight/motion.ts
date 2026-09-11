"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs a GSAP setup function inside gsap.context scoped to the returned ref.
 * Everything created in `setup` (tweens, timelines, ScrollTriggers) is
 * reverted on unmount / dependency change.
 */
export function useSightGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (root: T, reduced: boolean) => void,
  deps: unknown[] = []
) {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const ctx = gsap.context(() => setup(root, reducedMotion()), scope);
    return () => ctx.revert();
  }, deps);

  return scope;
}

/** Formats used by [data-count] counters across the demos. */
export const countFormats: Record<string, (v: number) => string> = {
  plain: (v) => `${Math.round(v)}`,
  plus: (v) => `${Math.round(v)}+`,
  pct: (v) => `${Math.round(v)}%`,
  money: (v) => `$${Math.round(v).toLocaleString("en-US")}`,
  moneyk: (v) => `$${Math.round(v)}k`,
};

/**
 * Builds a counter tween for an element carrying data-from / data-to /
 * data-format attributes, and stamps the starting value immediately so the
 * element never flashes its final value before the timeline reaches it.
 */
export function counterTween(el: HTMLElement, duration = 1.1) {
  const from = parseFloat(el.dataset.from ?? "0");
  const to = parseFloat(el.dataset.to ?? "0");
  const format = countFormats[el.dataset.format ?? "plain"] ?? countFormats.plain;
  const proxy = { v: from };
  el.textContent = format(from);
  return gsap.fromTo(
    proxy,
    { v: from },
    {
      v: to,
      duration,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = format(proxy.v);
      },
    }
  );
}
