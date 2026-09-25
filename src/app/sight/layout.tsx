import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./sight.css";

// DM Sans and Inter (the product UI snippets render in Inter, same as the
// real app) come from the root layout: declaring them again here made the
// same files download twice under different names.

// The founders' signatures on the "we build it" note, far down the page, so
// it loads when it is reached rather than with the first screen.
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Sight by Cloverfield · Ask your business anything",
  description:
    "Sight connects your spreadsheets, CRM, and accounting into one screen, with an AI that knows your whole business and alerts that catch problems before they cost you money. Live in 45 days or you don't pay.",
  alternates: {
    canonical: "https://cloverfield.studio/sight",
  },
  openGraph: {
    title: "Sight by Cloverfield · Ask your business anything",
    description:
      "One dashboard for your whole business, an AI that answers any question in seconds, and alerts that catch problems early. Live in 45 days or you don't pay.",
    url: "https://cloverfield.studio/sight",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
  },
};

export default function SightLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`sight-root ${hand.variable}`}>
      {children}
    </div>
  );
}
