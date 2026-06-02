import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ApproachContent from "./ApproachContent";
import { FAQ_ITEMS } from "./faq-data";

export const metadata: Metadata = {
  title: "Approach | Cloverfield Studio",
  description:
    "How Cloverfield Studio builds websites. Competitor audits before we open Figma. Lighthouse 95+ as a floor. Every section defended against a conversion goal.",
  alternates: {
    canonical: "https://cloverfield.studio/approach",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://cloverfield.studio/approach/#faq",
      "url": "https://cloverfield.studio/approach",
      "inLanguage": "en-CA",
      "publisher": { "@id": "https://cloverfield.studio/#business" },
      "mainEntity": FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://cloverfield.studio/approach/#breadcrumb",
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
          "name": "Approach",
          "item": "https://cloverfield.studio/approach",
        },
      ],
    },
  ],
};

export default function ApproachPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ApproachContent />
      <Footer />
    </>
  );
}
