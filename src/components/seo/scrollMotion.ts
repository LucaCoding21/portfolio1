/**
 * Shared by the scroll motion on /seo: SeoMotion ("The problem") and
 * SeoOffer (the solution band, and "How it works" when it's on the page).
 */
import gsap from "gsap";
import type { SplitText } from "gsap/dist/SplitText";

let ready: Promise<typeof SplitText> | undefined;

/**
 * ScrollTrigger and SplitText, loaded once, after the page is up rather than
 * with it, so they don't hold up the hero on a phone (Nov 23 2026), and only
 * once the fonts are in: split before Outfit had loaded, on a slow iPhone,
 * the headings broke into one word per line.
 */
export function loadScrollMotion() {
  ready ??= Promise.all([import("gsap/dist/ScrollTrigger"), import("gsap/dist/SplitText"), document.fonts.ready]).then(
    ([a, b]) => {
      gsap.registerPlugin(a.ScrollTrigger, b.SplitText);
      return b.SplitText;
    },
  );
  return ready;
}

/**
 * True when part of the element is on screen or above it already. On a slow
 * phone the visitor can reach a section before this script has arrived, and
 * hiding the words they were reading to play the entrance made them vanish
 * and come back (Nov 25 2026), so anything already seen is left as it is.
 */
export const seen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight;
