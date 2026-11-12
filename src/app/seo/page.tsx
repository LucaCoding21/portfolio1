import type { Metadata } from "next";
import SeoPage from "@/components/seo/SeoPage";

const TITLE = "Monthly SEO | Cloverfield Studio, Surrey, BC";
const DESCRIPTION =
  "Get more calls from Google and AI without paying for ads. Monthly SEO from Cloverfield Studio in Surrey, BC: top 3 on Google in 6 months, or we work for free until you get there.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://cloverfield.studio/seo",
  },
  // Its own share card text; a page's openGraph replaces the layout's whole,
  // so the homepage's image is set here too.
  openGraph: {
    title: "Monthly SEO | Cloverfield Studio",
    description: "Get more calls from Google and AI without paying for ads. Top 3 on Google in 6 months, or we work for free until you get there.",
    url: "https://cloverfield.studio/seo",
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
    title: "Monthly SEO | Cloverfield Studio",
    description: "Get more calls from Google and AI without paying for ads. Top 3 on Google in 6 months, or we work for free until you get there.",
    images: ["https://cloverfield.studio/og-image-v2.jpeg"],
  },
};

export default function Page() {
  return <SeoPage />;
}
