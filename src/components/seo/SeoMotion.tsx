"use client";

/**
 * GSAP motion for "The problem" on /seo (Nov 14 2026, by request), mounted
 * once by SeoPage so the section can stay server-rendered. It renders nothing;
 * it finds the section by its data-section. The hero has no motion: William
 * turned down an entrance and a scroll drift on it the same day.
 *
 *   stall   the label fades up, the heading rises line by line out of masks
 *           (SplitText, as on the homepage), then the three cards lift in one
 *           after another.
 *
 * Nothing moves with reduced motion, and anything already on screen when the
 * script arrives stays still (see `seen`). The offer section has its own
 * motion (SeoOffer).
 */
import { useEffect } from "react";
import gsap from "gsap";
import type { SplitText } from "gsap/dist/SplitText";
import { loadScrollMotion, seen } from "./scrollMotion";

const EASE = "expo.out";

export default function SeoMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stall = document.querySelector<HTMLElement>("[data-section='stall']");
    if (!stall) return;
    const splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    loadScrollMotion()
      .then((Split) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          const label = stall.querySelector("[data-stall='label']");
          const title = stall.querySelector("[data-stall='title']");
          // in the order they're seen: on phones and tablets CSS puts the
          // slow months first and the competitor last (Nov 24 2026), so the
          // lift-in goes top to bottom and starts on the card that's on top
          const cards = Array.from(stall.querySelector("ol")?.children ?? [])
            .filter((c) => !seen(c))
            .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: stall, start: "top 75%", once: true },
          });
          if (label && !seen(label)) tl.from(label, { y: 14, opacity: 0, duration: 0.7, ease: EASE });
          if (title && !seen(title)) {
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
        });
      })
      // if the script can't load, the words simply stay where they are
      .catch(() => {});

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((sp) => sp.revert());
    };
  }, []);

  return null;
}
