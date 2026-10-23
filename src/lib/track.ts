/**
 * GA4 events. Names are fixed because the GA key events and reports point
 * at them: book_call_click, booking_complete, review_url_submit, video_unmute,
 * the referral gift funnel: gift_sent, gift_link_shared, gift_opened,
 * gift_claim_start, gift_claimed, gift_site_click, gift_text_william,
 * gift_pass_on; and the free home page design: free_design_click (any link
 * to the page, by placement), design_quiz_start, design_quiz_type,
 * design_quiz_goal, design_contact_start, design_note_open, design_lead,
 * design_lead_fix_open and design_lead_fix ("Wrong number? Fix it"),
 * design_section_view (how, reviews, sample, owners, faq, closing) and
 * design_faq_open; and on every page (components/Analytics): section_view,
 * panel_open and video_progress. Every event also goes to PostHog where
 * it's running (instrumentation-client.ts).
 */

import posthog from "posthog-js";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends to Google Analytics and, where it's running, PostHog. */
export function track(event: string, params: Params = {}) {
  window.gtag?.("event", event, params);
  if (posthog.__loaded) posthog.capture(event, params);
}

/**
 * Ties this visitor, and the sessions before and after, to a lead in
 * PostHog, so a lead's replays and ad source sit on their person. Only
 * PostHog: GA's terms forbid personal details.
 */
export function identify(email: string, props: Params = {}) {
  const id = email.trim().toLowerCase();
  if (!id || !posthog.__loaded) return;
  posthog.identify(id, { email: email.trim(), ...props });
}

/** Where on the page an element sits: data-track, else nav/footer, else its section. */
export function placementOf(el: Element): string {
  const tagged = el.closest("[data-track]");
  if (tagged) return tagged.getAttribute("data-track") ?? "unknown";
  if (el.closest("nav, header")) return "nav";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section");
  return (
    section?.id ||
    section?.getAttribute("aria-label")?.toLowerCase() ||
    el.closest<HTMLElement>("[data-section]")?.dataset.section ||
    "page"
  );
}
