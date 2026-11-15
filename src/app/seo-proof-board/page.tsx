import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProofDrafts from "@/components/seo/proof-drafts/ProofDrafts";

// Dev board: five drafts of the /seo proof section (Nov 15 2026). Development only.

export const metadata: Metadata = {
  title: "SEO proof drafts",
  robots: { index: false, follow: false },
};

export default function SeoProofBoard() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ProofDrafts />;
}
