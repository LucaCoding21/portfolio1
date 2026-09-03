"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLS = 28;
const ROWS = 6;

/**
 * Deterministic pseudo-random, so the server and the client render an
 * identical grid. `Math.random()` here would trip a hydration mismatch.
 */
function noise(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Animated pixel dissolve for a section's leading edge. The tile grid overhangs
 * upward out of its parent (`bottom-full`), so it sits over whatever is above.
 * Tiles are the parent's own colour; while they're transparent the layer behind
 * shows through, and as they fill in the boundary dissolves in blocks instead
 * of sweeping past as a straight line.
 *
 * The fill is scrubbed on scroll and ordered bottom-row-first with a random
 * jitter, so the solid colour appears to eat upward in pixels.
 */
export default function PixelTransition({
  color = "var(--charcoal)",
}: {
  /** Colour of the tiles — must match the section this sits on top of. */
  color?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(grid.children);

      gsap.fromTo(
        tiles,
        { opacity: 0 },
        {
          opacity: 1,
          // Short per-tile fade so tiles read as discrete pixels snapping on
          // rather than a soft gradient sweeping through.
          duration: 0.1,
          ease: "none",
          // Bottom row goes first (it meets the solid block), top row last,
          // with per-tile jitter so rows don't read as hard bands.
          stagger: (i) => {
            const row = Math.floor(i / COLS);
            const fromBottom = (ROWS - 1 - row) / (ROWS - 1);
            return fromBottom * 0.75 + noise(i) * 0.35;
          },
          scrollTrigger: {
            trigger: grid,
            start: "top bottom",
            end: "bottom 40%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-full select-none"
    >
      <div
        ref={gridRef}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span
            key={i}
            className="aspect-square opacity-0"
            // Inline rather than Tailwind so the colour can be passed in. The
            // 1px bleed closes the sub-pixel seams that fractional grid columns
            // otherwise leave between neighbouring tiles.
            style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}` }}
          />
        ))}
      </div>
    </div>
  );
}
