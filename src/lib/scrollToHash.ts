/**
 * Scroll to a homepage section by hash (#about, #how-we-do-it). One place for
 * the nav, the mobile menu, and arriving from another page.
 *
 * A sticky section held under a card (How We Do It sits under the More Work
 * card on desktop) starts its box while the card still covers it, so we land
 * where the hold ends instead: the stage's top plus its extra height. Plain
 * sections land a little above their top, so their first line clears the
 * floating nav instead of tucking right under it.
 */

const NAV_CLEARANCE = 40;
export function hashTargetTop(el: HTMLElement): number {
  const stage = el.parentElement;
  if (stage && getComputedStyle(el).position === "sticky") {
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    return stageTop + Math.max(0, stage.offsetHeight - el.offsetHeight);
  }
  return el.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
}

/* A scroll the nav started (not the user's wheel or finger). Sections that
   lock the page while pinned, like the Selected Works deck, let these pass
   straight through instead of catching them. Ends when the scroll settles. */
let jumpUntil = 0;
const JUMP_FALLBACK_MS = 2500;
export const isJumping = () => performance.now() < jumpUntil;
function markJump() {
  jumpUntil = performance.now() + JUMP_FALLBACK_MS;
  window.addEventListener("scrollend", () => (jumpUntil = 0), { once: true });
}

/** Returns false when the hash has no element on this page. */
export function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth"): boolean {
  const el = hash ? document.querySelector<HTMLElement>(hash) : null;
  if (!el) return false;
  if (behavior === "smooth") markJump();
  window.scrollTo({ top: hashTargetTop(el), behavior });
  return true;
}

/** Back up to the hero, smoothly, past anything pinned on the way. */
export function scrollToTop() {
  markJump();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
