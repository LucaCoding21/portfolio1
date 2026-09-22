"use client";

/**
 * Jumps to the top on every route change (/ -> /work -> /sight ...). The
 * App Router does this itself, but with `scroll-behavior: smooth` on <html>
 * the jump is animated and gets cut short by the GSAP pins mounting on the
 * next page, so the user lands part-way down. Hash links (/#contact) are
 * left to the page: HomeClient scrolls those into place.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
