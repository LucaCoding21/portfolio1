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
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "expo.out";

export default function SeoMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stall = document.querySelector<HTMLElement>("[data-section='stall']");
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      if (stall) {
        const label = stall.querySelector("[data-stall='label']");
        const title = stall.querySelector("[data-stall='title']");
        const aside = stall.querySelector("[data-stall='aside']");
        const cards = stall.querySelectorAll("[data-section='stall'] ol > li");
        const tl = gsap.timeline({ scrollTrigger: { trigger: stall, start: "top 75%", once: true } });
        if (label) tl.from(label, { y: 14, opacity: 0, duration: 0.7, ease: EASE });
        if (title) {
          const sp = SplitText.create(title, { type: "lines", mask: "lines" });
          splits.push(sp);
          tl.from(sp.lines, { yPercent: 105, duration: 1.1, ease: EASE, stagger: 0.09 }, 0.1);
        }
        if (aside) tl.from(aside, { y: 16, opacity: 0, duration: 0.8, ease: EASE }, 0.45);
        if (cards.length) {
          gsap.from(cards, {
            y: 70,
            opacity: 0,
            duration: 1.1,
            ease: EASE,
            stagger: 0.12,
            scrollTrigger: { trigger: cards[0], start: "top 88%", once: true },
          });
        }
      }
    });

    return () => {
      ctx.revert();
      splits.forEach((sp) => sp.revert());
    };
  }, []);

  return null;
}
