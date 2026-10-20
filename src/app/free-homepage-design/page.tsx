import type { Metadata } from "next";
import FreeDesign from "@/components/free-design/FreeDesign";

export const metadata: Metadata = {
  title: "Free Home Page Design | Cloverfield Studio, Surrey, BC",
  description:
    "Answer three quick questions and Cloverfield Studio, a web design studio in Surrey, BC, will design a new home page for your business at no cost.",
  alternates: {
    canonical: "https://cloverfield.studio/free-homepage-design",
  },
};

export default function FreeDesignPage() {
  return <FreeDesign />;
}
