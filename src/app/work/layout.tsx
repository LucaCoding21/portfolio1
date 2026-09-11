import type { Metadata } from "next";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Our Work | Cloverfield Studio — Web Design Surrey BC",
  description:
    "Browse our portfolio of custom web design projects for established businesses in Surrey BC, Vancouver, and across the Lower Mainland. Realtors, photographers, local businesses, manufacturers.",
  alternates: {
    canonical: "https://cloverfield.studio/work",
  },
  openGraph: {
    title: "Our Work | Cloverfield Studio",
    description:
      "Custom web design portfolio. Realtors, photographers, local businesses, manufacturers. Websites that generate leads in Surrey BC and Vancouver.",
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
        "name": "Cloverfield Studio — Work",
        "description":
          "Portfolio of custom web design projects by Cloverfield Studio, a web design agency in Surrey BC.",
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
      {children}
    </>
  );
}
