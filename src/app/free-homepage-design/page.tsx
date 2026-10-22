import type { Metadata } from "next";
import FreeDesign from "@/components/free-design/FreeDesign";

export const metadata: Metadata = {
  title: "Free Homepage Sample | Cloverfield Studio, Surrey, BC",
  description:
    "Answer a few questions and Cloverfield Studio, a web design studio in Surrey, BC, will design a free homepage sample for your business.",
  alternates: {
    canonical: "https://cloverfield.studio/free-homepage-design",
  },
};

export default function FreeDesignPage() {
  return <FreeDesign />;
}
