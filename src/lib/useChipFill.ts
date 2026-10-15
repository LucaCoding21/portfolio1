import { type RefObject, useEffect } from "react";
import gsap from "gsap";

/**
 * The studio buttons' hover (ArrowCta, the hero's review buttons). On hover
 * (fine pointer only, motion allowed) a paper circle swells from the arrow
 * until it covers the button, the arrow turns to point up and right, and the
 * label nudges forward; leaving drains it back. The label sits in a
 * `difference` blend layer, so it flips from paper to ink as the circle
 * passes under it.
 *
 * `rest` is the circle's scale at rest: 1 when it shows as a chip
 * (ArrowCta), 0 when the button is plain until hovered. `place` centres the
 * circle on the arrow on each hover, for buttons whose arrow moves with the
 * layout; otherwise the stylesheet places it.
 */
export function useChipFill(
  refs: {
    btn: RefObject<HTMLElement | null>;
    fill: RefObject<HTMLElement | null>;
    arrow: RefObject<HTMLElement | null>;
    label: RefObject<HTMLElement | null>;
  },
  { rest = 1, place = false }: { rest?: number; place?: boolean } = {},
) {
  useEffect(() => {
    const btn = refs.btn.current;
    const fill = refs.fill.current;
    const arrow = refs.arrow.current;
    const label = refs.label.current;
    if (!btn || !fill || !arrow || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(fill, { scale: rest });

      /* Scale that takes the circle from its spot to the button's farthest
         corner. Measured each time: sizes can be overridden per use, and a
         stale size stops the wipe short. */
      const coverScale = () => {
        const b = btn.getBoundingClientRect();
        const f = fill.getBoundingClientRect();
        const cx = f.left + f.width / 2 - b.left;
        const cy = f.top + f.height / 2 - b.top;
        const reach = Math.max(
          Math.hypot(cx, cy),
          Math.hypot(b.width - cx, cy),
          Math.hypot(cx, b.height - cy),
          Math.hypot(b.width - cx, b.height - cy),
        );
        return (reach * 2 + 4) / fill.offsetWidth;
      };

      const onEnter = () => {
        if (place && gsap.getProperty(fill, "scale") === rest) {
          const b = btn.getBoundingClientRect();
          const a = arrow.getBoundingClientRect();
          gsap.set(fill, {
            left: a.left + a.width / 2 - b.left - btn.clientLeft - fill.offsetWidth / 2,
            top: a.top + a.height / 2 - b.top - btn.clientTop - fill.offsetHeight / 2,
          });
        }
        gsap.to(fill, { scale: coverScale(), duration: 0.75, ease: "expo.out", overwrite: true });
        gsap.to(arrow, { rotate: -45, x: 1, y: -1, duration: 0.55, ease: "back.out(1.8)", overwrite: true });
        gsap.to(label, { x: 3, duration: 0.6, ease: "expo.out", overwrite: true });
      };

      const onLeave = () => {
        gsap.to(fill, { scale: rest, duration: 0.55, ease: "power3.inOut", overwrite: true });
        gsap.to(arrow, { rotate: 0, x: 0, y: 0, duration: 0.45, ease: "power3.inOut", overwrite: true });
        gsap.to(label, { x: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
      };

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      return () => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      };
    }, btn);

    return () => ctx.revert();
  }, [refs.btn, refs.fill, refs.arrow, refs.label, rest, place]);
}
