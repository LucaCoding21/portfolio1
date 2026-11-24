"use client";

/**
 * GSAP motion for "The problem" on /seo (Nov 14 2026, by request), mounted
 * once by SeoPage so the section can stay server-rendered. It renders nothing;
 * it finds the section by its data-section. The hero has no motion: William
 * turned down an entrance and a scroll drift on it the same day.
 *
 *   stall   the label fades up, the heading rises line by line out of masks
 *           (SplitText, as on the homepage), the line beside it follows, then
 *           the three cards lift in one after another.
 *
 * Nothing moves with reduced motion. The offer section has its own motion
 * (SeoOffer).
 */
import { useEffect } from "react";
import gsap from "gsap";
// the scroll plugins load after the page is up (below), not with it, so they
// don't hold up the hero on a phone (Nov 23 2026)
import type { SplitText } from "gsap/dist/SplitText";

const loadPlugins = () =>
  Promise.all([import("gsap/dist/ScrollTrigger"), import("gsap/dist/SplitText")]).then(([a, b]) => {
    gsap.registerPlugin(a.ScrollTrigger, b.SplitText);
    return b.SplitText;
  });

const EASE = "expo.out";

export default function SeoMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stall = document.querySelector<HTMLElement>("[data-section='stall']");
    const splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // after the fonts, so the heading splits into its real lines (split
    // before Outfit had loaded on a slow phone, it came out "People / near /
    // you / are searching...", Nov 23 2026)
    Promise.all([document.fonts.ready, loadPlugins()]).then(([, Split]) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        if (stall) {
          const label = stall.querySelector("[data-stall='label']");
          const title = stall.querySelector("[data-stall='title']");
          // in the order they're seen: on phones and tablets CSS puts the
          // slow months first and the competitor last (Nov 24 2026), so the
          // lift-in goes top to bottom and starts on the card that's on top
          const cards = Array.from(stall.querySelectorAll<HTMLElement>("[data-section='stall'] ol > li")).sort(
            (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          );
          const tl = gsap.timeline({
            scrollTrigger: { trigger: stall, start: "top 75%", once: true },
          });
          if (label) tl.from(label, { y: 14, opacity: 0, duration: 0.7, ease: EASE });
          if (title) {
            const sp = Split.create(title, {
              type: "lines",
              mask: "lines",
            });
            splits.push(sp);
            // then the split is undone, so it flows as normal text again
            tl.from(
              sp.lines,
              {
                yPercent: 105,
                duration: 1.1,
                ease: EASE,
                stagger: 0.09,
                onComplete: () => sp.revert(),
              },
              0.1,
            );
          }
          if (cards.length) {
            gsap.from(cards, {
              y: 70,
              opacity: 0,
              duration: 1.1,
              ease: EASE,
              stagger: 0.12,
              scrollTrigger: {
                trigger: cards[0],
                start: "top 88%",
                once: true,
              },
            });
          }
        }
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((sp) => sp.revert());
    };
  }, []);

  return null;
}
