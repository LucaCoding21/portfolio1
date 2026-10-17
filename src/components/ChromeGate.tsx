"use client";

import { usePathname } from "next/navigation";

/** The site nav and phone dock everywhere except the referral gift pages
 *  (/g/<token> and /gift/<id>, and their dev board /gift-screens), which
 *  stand on their own, and the hero's dev board (/hero-screens; its frames
 *  keep the nav, since it's part of the hero). */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/(g\/|gift\/|gift-screens|hero-screens\/?$)/.test(pathname)) return null;
  return children;
}
