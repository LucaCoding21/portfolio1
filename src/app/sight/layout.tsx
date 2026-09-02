import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./sight.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// The product UI snippets render in Inter, same as the real app.
const inter = Inter({
  variable: "--font-inter-sight",
  subsets: ["latin"],
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
    <div className={`sight-root ${dmSans.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
