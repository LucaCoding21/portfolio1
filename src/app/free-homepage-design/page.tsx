import type { Metadata } from "next";
import FreeDesign from "@/components/free-design/FreeDesign";

export const metadata: Metadata = {
  title: "Free Homepage Sample | Cloverfield Studio, Surrey, BC",
  description:
    "Answer a few questions and Cloverfield Studio, a web design studio in Surrey, BC, will design a free homepage sample for your business.",
  alternates: {
    canonical: "https://cloverfield.studio/free-homepage-design",
  },
  // Its own share card: without these the page inherited the homepage's,
  // and LinkedIn followed og:url to the homepage. A page's openGraph
  // replaces the layout's whole, so the image is set again here.
  openGraph: {
    title: "Free Homepage Sample | Cloverfield Studio",
    description: "Answer a few questions and we’ll design a free homepage sample for your business.",
    url: "https://cloverfield.studio/free-homepage-design",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://cloverfield.studio/og-image-v2.jpeg",
        width: 1200,
        height: 630,
        alt: "Cloverfield Studio, web design in Surrey, BC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Homepage Sample | Cloverfield Studio",
    description: "Answer a few questions and we’ll design a free homepage sample for your business.",
    images: ["https://cloverfield.studio/og-image-v2.jpeg"],
  },
};

export default function FreeDesignPage() {
  return <FreeDesign />;
}
