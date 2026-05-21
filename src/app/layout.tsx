import type { Metadata } from "next";
import {
  Geist,
  Outfit,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CursorLoader from "@/components/CursorLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Web Design Surrey BC | Cloverfield Studio",
  description:
    "Web design in Surrey BC that generates leads. Custom websites for small businesses — no templates, launched in under a week. Book a free consultation.",
  keywords: [
    "web design surrey bc",
    "web design companies in surrey bc",
    "surrey bc web design",
    "web design in surrey bc",
    "small business web design",
    "custom website design",
    "lead generating websites",
    "web design Vancouver",
    "web development Surrey BC",
  ],
  alternates: {
    canonical: "https://cloverfield.studio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Web Design Surrey BC | Cloverfield Studio",
    description:
      "Custom web design in Surrey BC for small businesses. No templates, launched in under a week. Websites that generate leads.",
    url: "https://cloverfield.studio",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://cloverfield.studio/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Cloverfield Studio — Web Design Agency in Surrey BC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Surrey BC | Cloverfield Studio",
    description:
      "Custom web design in Surrey BC for small businesses. No templates, launched in under a week. Websites that generate leads.",
    images: ["https://cloverfield.studio/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TXDFN6PB');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["LocalBusiness", "ProfessionalService"],
                  "@id": "https://cloverfield.studio/#business",
                  "name": "Cloverfield Studio",
                  "alternateName": "Cloverfield",
                  "description":
                    "Web design and development agency in Surrey BC building custom, lead-generating websites for small businesses. No templates, launched in under a week. AI-search optimized.",
                  "url": "https://cloverfield.studio",
                  "logo": "https://cloverfield.studio/og-image.jpeg",
                  "image": "https://cloverfield.studio/og-image.jpeg",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Surrey",
                    "addressRegion": "BC",
                    "addressCountry": "CA",
                  },
                  "areaServed": [
                    "Surrey BC",
                    "Vancouver BC",
                    "Burnaby BC",
                    "Langley BC",
                    "Richmond BC",
                    "Coquitlam BC",
                    "Delta BC",
                    "White Rock BC",
                    "North Vancouver BC",
                    "West Vancouver BC",
                    "Lower Mainland",
                    "British Columbia",
                    "Canada",
                  ],
                  "knowsAbout": [
                    "Web design",
                    "Web development",
                    "Custom website design",
                    "Small business websites",
                    "Lead generation websites",
                    "Next.js development",
                    "SEO-optimized websites",
                    "AI search optimization",
                    "Generative engine optimization",
                    "LLM SEO",
                    "Landing page design",
                    "E-commerce websites",
                    "Brand identity",
                    "Realtor website design",
                    "Photographer website design",
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Web Design Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Custom Web Design",
                          "description":
                            "Bespoke websites designed and built from scratch for small businesses in Surrey, Vancouver, and the Lower Mainland.",
                        },
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Web Development",
                          "description":
                            "Fast, modern websites built with Next.js and optimized for performance and SEO.",
                        },
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Lead-Generating Landing Pages",
                          "description":
                            "Conversion-focused landing pages that turn visitors into booked calls and customers.",
                        },
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Search Optimization",
                          "description":
                            "Websites optimized to be read, indexed, and cited by ChatGPT, Claude, Perplexity, and Google AI Overviews.",
                        },
                      },
                    ],
                  },
                  "priceRange": "$$",
                  "inLanguage": "en-CA",
                  "sameAs": [
                    "https://www.instagram.com/cloverfield.studio/",
                    "https://www.linkedin.com/company/cloverfieldstudio/",
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "5",
                    "ratingCount": "7",
                    "reviewCount": "7",
                  },
                  "review": [
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Taylor Paige",
                        "jobTitle": "Founder",
                        "worksFor": { "@type": "Organization", "name": "WrapCity" },
                      },
                      "reviewBody":
                        "Just wanted to let you know I landed a $7000 job this morning because of the website. I didn't even advertise it. Also my Google Ads are working way better since the new site.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Nancy Tran",
                        "jobTitle": "Realtor",
                        "worksFor": { "@type": "Organization", "name": "Grand Central Realty" },
                      },
                      "reviewBody":
                        "After 5 years in real estate, this is the first website I'm actually proud to share with clients.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Christopher Hamade",
                        "jobTitle": "Executive Director",
                        "worksFor": { "@type": "Organization", "name": "Real Estate Institute of BC" },
                      },
                      "reviewBody":
                        "Nice work, William. I love this. It feels fresh and interesting and keeps me scrolling.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Ace Suasola",
                        "jobTitle": "Owner",
                        "worksFor": { "@type": "Organization", "name": "ACE" },
                      },
                      "reviewBody":
                        "Bro you guys actually got the vibe, that was the hard part.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Israel Njagih",
                        "jobTitle": "Owner",
                        "worksFor": { "@type": "Organization", "name": "Njagih Studios" },
                      },
                      "reviewBody":
                        "Best designers I've worked with, no exaggeration.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Jacob Abraham",
                        "jobTitle": "Co-founder",
                        "worksFor": { "@type": "Organization", "name": "League1v1" },
                      },
                      "reviewBody":
                        "Dude I honestly didn't think we needed a website, I'm glad you guys proved me wrong.",
                    },
                    {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5",
                      },
                      "author": {
                        "@type": "Person",
                        "name": "Alex",
                        "jobTitle": "Founder",
                        "worksFor": { "@type": "Organization", "name": "Clover Studio" },
                      },
                      "reviewBody":
                        "They actually get design. Best agency I've worked with.",
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://cloverfield.studio/#website",
                  "url": "https://cloverfield.studio",
                  "name": "Cloverfield Studio",
                  "description":
                    "Web design agency in Surrey BC. Custom websites, launched in under a week. AI-search optimized.",
                  "publisher": { "@id": "https://cloverfield.studio/#business" },
                  "inLanguage": "en-CA",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${outfit.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TXDFN6PB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <CursorLoader />
        {children}
      </body>
    </html>
  );
}
