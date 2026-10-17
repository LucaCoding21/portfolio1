/**
 * GA4 events. Names are fixed because the GA key events and reports point
 * at them: book_call_click, booking_complete, review_url_submit, video_unmute,
 * and the referral gift funnel: gift_sent, gift_link_shared, gift_opened,
 * gift_claim_start, gift_claimed, gift_site_click, gift_text_william,
 * gift_pass_on.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  window.gtag?.("event", event, params);
}

/** Where on the page an element sits: data-track, else its section, else nav/footer. */
export function placementOf(el: Element): string {
  const tagged = el.closest("[data-track]");
  if (tagged) return tagged.getAttribute("data-track") ?? "unknown";
  if (el.closest("nav, header")) return "nav";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section");
  return section?.id || section?.getAttribute("aria-label")?.toLowerCase() || "page";
}
