"use client";

import { useEffect } from "react";
import { placementOf, track } from "@/lib/track";

/**
 * Site-wide click tracking. One listener covers every Cal.com link (nav, dock,
 * sight pills, case studies) so new CTAs are tracked without extra wiring.
 */
export default function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, location.href);

      if (url.hostname === "cal.com") {
        track("book_call_click", {
          placement: placementOf(link),
          cal_event: url.pathname.split("/").pop(),
        });
      } else if (url.protocol === "mailto:" || url.protocol === "tel:") {
        track("contact_click", { method: url.protocol.replace(":", ""), placement: placementOf(link) });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
