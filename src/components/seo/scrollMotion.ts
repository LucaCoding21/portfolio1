/**
 * Shared by the scroll motion on /seo: SeoMotion ("The problem") and
 * SeoOffer (the solution band, and "How it works" when it's on the page).
 */
import gsap from "gsap";

let ready: Promise<void> | undefined;

/**
 * ScrollTrigger, loaded once, after the page is up rather than with it, so it
 * doesn't hold up the hero on a phone (Nov 23 2026), and only once the fonts
 * are in, so headings are measured in Outfit.
 */
export function loadScrollMotion() {
  ready ??= Promise.all([import("gsap/dist/ScrollTrigger"), document.fonts.ready]).then(([a]) => {
    gsap.registerPlugin(a.ScrollTrigger);
  });
  return ready;
}

/**
 * True when part of the element is on screen or above it already. On a slow
 * phone the visitor can reach a section before this script has arrived, and
 * hiding the words they were reading to play the entrance made them vanish
 * and come back (Nov 25 2026), so anything already seen is left as it is.
 */
export const seen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight;

type Split = { lines: HTMLElement[]; revert: () => void; wraps: () => boolean };

/**
 * Wraps each line of a plain-text heading in a mask, exactly as the browser
 * has already broken it, or returns null when it can't do that faithfully.
 *
 * This replaced GSAP's SplitText on /seo (Nov 25 2026). SplitText finds the
 * lines by wrapping every word in an inline-block and seeing where each one
 * lands; on William's iPhone that layout came out different from the real
 * one, so "People near you are searching…" rose in as "People / near / you /
 * are searching for what you do," and snapped back when the reveal ended.
 * Here the words are measured where they are, with ranges over the text, so
 * measuring changes nothing; and the result is checked against the heading's
 * own height before anything moves.
 */
function splitLines(el: HTMLElement): Split | null {
  const text = el.firstChild;
  if (el.childNodes.length !== 1 || !text || text.nodeType !== Node.TEXT_NODE) return null;
  const style = getComputedStyle(el);
  const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  // layout sizes, not on-screen ones: the quote's box is scaled as it lifts in
  const rows = Math.round((el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) / lh);

  const range = document.createRange();
  const lines: string[][] = [];
  let lineTop = -Infinity;
  for (const m of (text.textContent ?? "").matchAll(/\S+/g)) {
    range.setStart(text, m.index);
    range.setEnd(text, m.index + m[0].length);
    const top = range.getClientRects()[0]?.top;
    if (top === undefined) return null;
    if (top > lineTop + lh / 2) {
      lines.push([]);
      lineTop = top;
    }
    lines[lines.length - 1].push(m[0]);
  }
  if (!lines.length || lines.length !== rows) return null;

  const label = el.getAttribute("aria-label");
  // its own block formatting context, so the masks' margins can't pass
  // through the heading and make its box taller while it's split
  const display = el.style.display;
  if (style.display === "block") el.style.display = "flow-root";
  const lineEls = lines.map((words, i) => {
    const line = document.createElement("span");
    line.style.display = "block";
    // the space keeps copied text whole; at the end of a line it takes no room
    line.textContent = words.join(" ") + (i < lines.length - 1 ? " " : "");
    return line;
  });
  el.setAttribute("aria-label", (text.textContent ?? "").trim());
  el.replaceChildren(
    ...lineEls.map((line) => {
      // room under the line for descenders, given back by the margin, so
      // the heading is exactly as tall split as it is as plain text (the
      // old padding on the lines made it grow about 8px, then jump back)
      const mask = document.createElement("span");
      mask.style.cssText = "display:block;overflow:clip;padding-bottom:0.1em;margin-bottom:-0.1em";
      mask.appendChild(line);
      return mask;
    }),
  );
  // the original text node goes back, so React still finds what it rendered
  const revert = () => {
    el.replaceChildren(text);
    el.style.display = display;
    if (label === null) el.removeAttribute("aria-label");
    else el.setAttribute("aria-label", label);
  };
  // every line must still sit on one line; if one wraps, show the plain text
  const wraps = () => lineEls.some((line) => line.offsetHeight > lh * 1.5);
  if (wraps()) {
    revert();
    return null;
  }
  return { lines: lineEls, revert, wraps };
}

/**
 * The heading's lines rise out of masks at `at` on `tl`, then it goes back to
 * plain text, so a later resize or font swap can't leave it broken. Until then
 * the heading is hidden in place (nothing around it moves), and it's split
 * only when its turn comes, so it's measured in the layout the visitor sees.
 * If it can't be split, it simply appears. Returns a cleanup for unmount.
 */
export function riseLines(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  at: number,
  vars: gsap.TweenVars,
) {
  gsap.set(el, { visibility: "hidden" });
  let finish: (() => void) | undefined;
  tl.add(() => {
    const sp = splitLines(el);
    if (sp) {
      // from far enough below that no ink shows under the mask's extra room
      const tween = gsap.from(sp.lines, { yPercent: 118, ...vars, onComplete: () => finish?.() });
      const done = () => {
        document.fonts.removeEventListener("loadingdone", check);
        finish = undefined;
        tween.kill();
        sp.revert();
      };
      // a font arriving mid-reveal can rewrap a line: if it does, end there
      // (any font load fires this, so only a line that wrapped ends it)
      const check = () => sp.wraps() && done();
      finish = done;
      document.fonts.addEventListener("loadingdone", check);
    }
    el.style.visibility = "";
  }, at);
  return () => finish?.();
}
