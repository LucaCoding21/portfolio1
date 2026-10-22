import posthog from "posthog-js";

/**
 * PostHog (Oct 2026): session replays, scroll depth, heatmaps and funnels,
 * beside Google Analytics. Every `track()` event goes to both (lib/track).
 *
 * Like GA (layout.tsx) it only reports from the live domain and never from
 * William's own devices: open any page with ?internal=1 once on them
 * (?internal=0 undoes it). ?posthog_test=1 lets a device report from
 * anywhere, localhost or a preview, to check the install (?posthog_test=0
 * undoes it). Events go through /ingest on our own domain (next.config.ts)
 * so ad blockers don't drop them. Form inputs are masked in replays.
 */

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const LIVE = /(^|\.)cloverfield\.studio$/;

function shouldReport() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("internal") === "1") localStorage.setItem("cf_internal", "1");
    if (q.get("internal") === "0") localStorage.removeItem("cf_internal");
    if (q.get("posthog_test") === "1") localStorage.setItem("cf_posthog_test", "1");
    if (q.get("posthog_test") === "0") localStorage.removeItem("cf_posthog_test");
    if (localStorage.getItem("cf_posthog_test") === "1") return true;
    return LIVE.test(location.hostname) && localStorage.getItem("cf_internal") !== "1";
  } catch {
    return LIVE.test(location.hostname);
  }
}

if (token && shouldReport()) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
    person_profiles: "identified_only",
    // No surveys on the site: don't load their code.
    disable_surveys: true,
  });
}
