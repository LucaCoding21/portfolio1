import type { Metadata } from "next";
import { Geist, Inter, Outfit, Caveat, Sometype_Mono, Reenie_Beanie, DM_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import MobileDock from "@/components/MobileDock";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Handwriting accent used for the highlighted word in the hero headline and
// the figures in About. Variable font (wght 400-700), so no `weight` — the
// spans pick from the axis.
const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

// Monospace face, used for the small uppercase labels and CTAs in the sections
// below the fold — they read as measurements rather than as more marketing copy.
// Variable (wght 400-700), so no `weight`; consumers pick off the axis.
const sometype = Sometype_Mono({
  variable: "--font-sometype",
  subsets: ["latin"],
});

// Faces from the cloned reference (homepage hero, selected works, nav): DM Sans is theirs;
// Cormorant Garamond stands in for their licensed ABC Marist.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const marist = Cormorant_Garamond({
  variable: "--font-marist",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

// The mobile dock, cloned from a Framer template set in Inter.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Handwritten face for the partner labels and names in Why Cloverfield.
const reenie = Reenie_Beanie({
  variable: "--font-reenie",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Web Design Surrey BC | Cloverfield Studio",
  description:
    "Web design in Surrey BC for local businesses that want more customers. Our sites have generated 3,000+ inquiries for our clients. Book a free call.",
  keywords: [
    "web design surrey bc",
    "web design companies in surrey bc",
    "surrey bc web design",
    "web design in surrey bc",
    "small business web design",
    "lead generation web design",
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
      "We make websites that bring in customers. Our work has generated more than 3,000 inquiries for local businesses in Surrey and the Lower Mainland.",
    url: "https://cloverfield.studio",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://cloverfield.studio/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Cloverfield Studio, web design in Surrey BC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Surrey BC | Cloverfield Studio",
    description:
      "We make websites that bring in customers. Our work has generated more than 3,000 inquiries for local businesses in Surrey and the Lower Mainland.",
    images: ["https://cloverfield.studio/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KHS5MBDWV5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KHS5MBDWV5');`}
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
                    "Web design and development studio in Surrey BC. We make websites that bring in customers for local businesses, designed around what their customers are looking for. Our work has generated more than 3,000 inquiries.",
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
                    "Lead generation websites for local businesses",
                    "Small business websites",
                                        "Next.js development",
                    "Shopify development",
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
                          "name": "Web Design",
                          "description":
                            "Websites designed around what your customers are looking for, so more visitors call, book, or ask for a quote. For local businesses in Surrey, Vancouver, and the Lower Mainland.",
                        },
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Web Development",
                          "description":
                            "Fast, modern websites built with Next.js.",
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
                          "name": "Shopify Stores",
                          "description":
                            "Shopify stores designed and built for local brands selling online.",
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
                    "worstRating": "1",
                    "ratingCount": "5",
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
                        "Just wanted to let you know I landed a $7,000 job this morning because of the website. I didn't even advertise it. Also my Google Ads are working way better since the new site.",
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
                        "I sent them my photos and answered one call. Nine days later the site was live. I did almost nothing.",
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://cloverfield.studio/#website",
                  "url": "https://cloverfield.studio",
                  "name": "Cloverfield Studio",
                  "description":
                    "Web design studio in Surrey BC. We make websites that bring in customers for local businesses.",
                  "publisher": { "@id": "https://cloverfield.studio/#business" },
                  "inLanguage": "en-CA",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${outfit.variable} ${script.variable} ${sometype.variable} ${reenie.variable} ${dmSans.variable} ${marist.variable} ${inter.variable} antialiased`}
      >
        <ScrollToTop />
        <SiteNav />
        <MobileDock />
        {children}
      </body>
    </html>
  );
}
