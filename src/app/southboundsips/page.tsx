import type { Metadata } from "next";
import CountdownPage from "./CountdownPage";

export const metadata: Metadata = {
  title: "South Bound Sips | Coming Soon",
  description:
    "South Bound Sips - Artisan Sodas & Traveling Bar. New website launching March 1, 2026.",
  robots: { index: false, follow: false },
};

export default function SouthBoundSipsPage() {
  return <CountdownPage />;
}
