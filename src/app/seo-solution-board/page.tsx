import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionDrafts from "@/components/seo/solution-drafts/SolutionDrafts";

// Dev board: five centred drafts of "The solution" on /seo (Nov 15 2026). Development only.

export const metadata: Metadata = {
  title: "SEO solution drafts",
  robots: { index: false, follow: false },
};

export default function SeoSolutionBoard() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SolutionDrafts />;
}
