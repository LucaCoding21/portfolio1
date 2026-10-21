"use client";

import { usePathname } from "next/navigation";

/** The site nav and phone dock everywhere except the referral gift pages
 *  (/g/<token> and /gift/<id>, and their dev board /gift-screens) and the
 *  free home page design page, which stand on their own. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/(g\/|gift\/|gift-screens|free-homepage-design)/.test(pathname)) return null;
  return children;
}
