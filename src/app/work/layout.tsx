import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { projects } from "@/data/projects";

// Stand-in for the reference's licensed Neue Haas Grotesk Text Pro (pass 1
// only; the Cloverfield pass swaps this for Outfit).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Our Work | Cloverfield Studio, Web Design Surrey BC",
  description:
    "Websites we've built for local businesses in Surrey BC, Vancouver, and across the Lower Mainland, and the customers they brought in. Trades, real estate, clinics, hospitality, ecommerce, and photography.",
  alternates: {
    canonical: "https://cloverfield.studio/work",
  },
  openGraph: {
    title: "Our Work | Cloverfield Studio",
    description:
      "Websites that bring in customers, for trades, real estate, clinics, hospitality, ecommerce, and photography businesses in Surrey BC and Vancouver.",
    url: "https://cloverfield.studio/work",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cloverfield.studio",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Work",
            "item": "https://cloverfield.studio/work",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": "https://cloverfield.studio/work#collection",
        "name": "Cloverfield Studio · Work",
        "description":
          "Websites Cloverfield Studio has built for local businesses, a web design studio in Surrey BC.",
        "url": "https://cloverfield.studio/work",
        "isPartOf": { "@id": "https://cloverfield.studio/#website" },
        "publisher": { "@id": "https://cloverfield.studio/#business" },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": projects.length,
          "itemListElement": projects.map((proj, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": proj.name,
            "description": proj.description,
            "url": proj.url ?? "https://cloverfield.studio/work",
          })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={inter.variable}>{children}</div>
    </>
  );
}
