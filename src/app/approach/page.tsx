import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ApproachContent from "./ApproachContent";

export const metadata: Metadata = {
  title: "Approach | Cloverfield Studio",
  description:
    "How Cloverfield Studio builds websites. Competitor audits before we open Figma. Lighthouse 95+ as a floor. Every section defended against a conversion goal.",
  alternates: {
    canonical: "https://cloverfield.studio/approach",
  },
};

export default function ApproachPage() {
  return (
    <>
      <ApproachContent />
      <Footer />
    </>
  );
}
