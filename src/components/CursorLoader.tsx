"use client";

import { useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

// any-hover/any-pointer (not hover/pointer) so a mouse qualifies even when the
// device also has a touchscreen. Firefox reports the touchscreen as the
// *primary* pointer on hybrid laptops, which made the stricter
// (hover: hover) and (pointer: fine) query fail there — and because the native
// cursor is hidden via CSS, that left Firefox with no cursor at all.
const QUERY = "(any-hover: hover) and (any-pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export default function CursorLoader() {
  const show = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false // no custom cursor during SSR
  );

  // Hide the native cursor only while the custom one is mounted. This keeps the
  // two decisions in lock-step, so the page can never hide the native cursor
  // without rendering a replacement.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("custom-cursor-active", show);
    return () => root.classList.remove("custom-cursor-active");
  }, [show]);

  return show ? <CustomCursor /> : null;
}
