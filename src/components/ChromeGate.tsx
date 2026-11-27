"use client";

import { usePathname } from "next/navigation";

/** The site nav and phone dock everywhere except the referral gift pages
 *  (/g/<token> and /gift/<id>, and their dev board /gift-screens), SEO
 *  clients' reports (/report/<token>), the
 *  free home page design page, which stand on their own, and the dev-only
 *  copy viewer /seo-copy-review (it frames /seo, which has its own nav). */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/(g\/|gift\/|gift-screens|free-homepage-design|seo-copy-review|report\/)/.test(pathname)) return null;
  return children;
}
