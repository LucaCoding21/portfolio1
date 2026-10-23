"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FREE_DESIGN_URL } from "@/data/freeDesign";
import { placementOf, track } from "@/lib/track";

/**
 * Site-wide tracking, so new pages, sections and CTAs are covered without
 * extra wiring (Oct 2026):
 *
 * - Clicks: every Cal.com link (book_call_click), every link to the free
 *   home page design page (free_design_click), mailto and tel links
 *   (contact_click).
 * - panel_open: any <details> or aria-expanded control opened (FAQs, bios,
 *   menus), with its label.
 * - section_view: how far down each page people get. Every top-level
 *   section (and the footer) reports once per page view, as its top passes
 *   60% of the way up the screen, named by its data-section, else its id,
 *   aria-label, data-track or heading. On the free page the data-section
 *   ones also send design_section_view, which its PostHog insight reads.
 * - video_progress: 25, 50, 75 and 95% of any video watched with sound on,
 *   named by its data-video, else its file name.
 */

const SECTIONS = "[data-section], section, footer";
const MILESTONES = [25, 50, 75, 95];

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

/** A section's name for the reports; null when it has nothing to go by. */
function sectionName(el: HTMLElement): string | null {
  const own =
    el.dataset.section ||
    el.id ||
    el.getAttribute("aria-label") ||
    el.dataset.track ||
    (el.tagName === "FOOTER" ? "footer" : "") ||
    el.querySelector("h1, h2, h3")?.textContent ||
    "";
  return slug(own) || null;
}

/** What a control says: its aria-label, else its text, kept short. */
const labelOf = (el: Element) =>
  (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;

      // Read before the click lands, so "false" means it's opening.
      const toggle = target?.closest?.("[aria-expanded]");
      if (toggle && toggle.getAttribute("aria-expanded") === "false") {
        track("panel_open", { label: labelOf(toggle), placement: placementOf(toggle) });
      }

      const link = target?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, location.href);

      if (url.hostname === "cal.com") {
        track("book_call_click", {
          placement: placementOf(link),
          cal_event: url.pathname.split("/").pop(),
        });
      } else if (url.origin === location.origin && url.pathname === FREE_DESIGN_URL) {
        track("free_design_click", { placement: placementOf(link) });
      } else if (url.protocol === "mailto:" || url.protocol === "tel:") {
        track("contact_click", { method: url.protocol.replace(":", ""), placement: placementOf(link) });
      }
    };

    // <details> opening (toggle doesn't bubble, so listen on the way down).
    const onToggle = (e: Event) => {
      const details = e.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open) return;
      const summary = details.querySelector("summary");
      track("panel_open", { label: summary ? labelOf(summary) : "", placement: placementOf(details) });
    };

    // How much of a video people watch with the sound on (looping reels
    // with no sound are left out).
    const reached = new WeakMap<HTMLVideoElement, Set<number>>();
    const onTime = (e: Event) => {
      const video = e.target;
      if (!(video instanceof HTMLVideoElement) || video.muted || !video.duration) return;
      const done = reached.get(video) ?? new Set<number>();
      reached.set(video, done);
      const percent = (video.currentTime / video.duration) * 100;
      for (const m of MILESTONES) {
        if (percent < m || done.has(m)) continue;
        done.add(m);
        track("video_progress", {
          video: video.dataset.video || (video.currentSrc.split("/").pop() ?? "").split("?")[0],
          percent: m,
          placement: placementOf(video),
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("toggle", onToggle, { capture: true });
    document.addEventListener("timeupdate", onTime, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("toggle", onToggle, { capture: true });
      document.removeEventListener("timeupdate", onTime, { capture: true });
    };
  }, []);

  // Section reach, started over on every page. Sections that render late
  // (after the homepage's loader, dynamic imports) are picked up as they
  // appear.
  useEffect(() => {
    const seen = new Set<string>();
    const watched = new WeakSet<Element>();
    const freePage = pathname === FREE_DESIGN_URL;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const name = sectionName(el);
          if (!name || seen.has(name)) return;
          seen.add(name);
          track("section_view", { section: name });
          if (freePage && el.dataset.section) track("design_section_view", { section: el.dataset.section });
        }),
      { rootMargin: "0px 0px -40% 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(SECTIONS).forEach((el) => {
        // Top-level only: a section inside another counts as part of it.
        if (watched.has(el) || el.parentElement?.closest("[data-section], section")) return;
        watched.add(el);
        io.observe(el);
      });
    };

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = window.setTimeout(() => {
        queued = 0;
        scan();
      }, 250);
    });

    scan();
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(queued);
    };
  }, [pathname]);

  return null;
}
