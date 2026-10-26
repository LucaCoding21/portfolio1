/**
 * GA4 events. Names are fixed because the GA key events and reports point
 * at them: book_call_click, booking_complete, review_url_submit, video_unmute,
 * the referral gift funnel: gift_sent, gift_link_shared, gift_opened,
 * gift_claim_start, gift_claimed, gift_site_click, gift_text_william,
 * gift_pass_on; and the free home page design: free_design_click (any link
 * to the page, by placement), design_quiz_start, design_quiz_type,
 * design_quiz_goal, design_quiz_revenue, design_contact_start,
 * design_note_open, design_lead (with `qualified`, $100K a year and up),
 * design_lead_fix_open and design_lead_fix ("Wrong number? Fix it"),
 * design_section_view (how, reviews, sample, owners, faq, closing) and
 * design_faq_open; and on every page (components/Analytics): section_view,
 * panel_open and video_progress. Every event also goes to PostHog where
 * it's running (instrumentation-client.ts).
 */

import type { PostHog } from "posthog-js";

type Params = Record<string, string | number | boolean | undefined>;

/** PostHog once instrumentation-client.ts has loaded and started it. It
    loads on its own, after the page's scripts, so until then (and wherever
    it doesn't run) events go to GA only. */
let posthog: PostHog | undefined;

export function setPosthog(client: PostHog) {
  posthog = client;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Sends to Google Analytics and, where it's running, PostHog. */
export function track(event: string, params: Params = {}) {
  window.gtag?.("event", event, params);
  posthog?.capture(event, params);
}

/** The Meta Pixel standard events the site sends, and its custom ones. */
export type PixelEvent = "PageView" | "ViewContent" | "Lead" | "SubmitApplication" | "Contact";
export type PixelCustomEvent = "LeadFormStart" | "ScheduleIntent";

/**
 * Meta Pixel events for the ads (Oct 25 2026), the only calls to fbq after
 * the base code in layout.tsx. Quiet where the pixel doesn't run (blocked,
 * off the live domain, on ?internal=1 devices); in dev each call is logged
 * instead. PageView on later pages and the free page's ViewContent, Contact
 * and ScheduleIntent come from components/Analytics; LeadFormStart, Lead and
 * SubmitApplication from the quiz. Lead and SubmitApplication pass the
 * `eventId` the server sends the same events with (lib/metaConversions), so
 * Meta counts each lead once. No contact details or typed answers go from
 * the browser.
 */
export function pixel(event: PixelEvent, params: Params = {}, eventId?: string) {
  sendPixel("track", event, params, eventId);
}

export function pixelCustom(event: PixelCustomEvent, params: Params = {}) {
  sendPixel("trackCustom", event, params);
}

function sendPixel(method: "track" | "trackCustom", event: string, params: Params, eventId?: string) {
  const args = eventId ? [method, event, params, { eventID: eventId }] : [method, event, params];
  if (process.env.NODE_ENV === "development") console.info("[meta pixel]", ...args);
  window.fbq?.(...args);
}

/**
 * Ties this visitor, and the sessions before and after, to a lead in
 * PostHog, so a lead's replays and ad source sit on their person. Only
 * PostHog: GA's terms forbid personal details.
 */
export function identify(email: string, props: Params = {}) {
  const id = email.trim().toLowerCase();
  if (!id || !posthog) return;
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
