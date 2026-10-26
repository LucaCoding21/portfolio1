import type { Metadata } from "next";
import { Geist, Inter, Outfit, Caveat, Sometype_Mono, Reenie_Beanie, DM_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import MobileDock from "@/components/MobileDock";
import ScrollToTop from "@/components/ScrollToTop";
import Analytics from "@/components/Analytics";
import ChromeGate from "@/components/ChromeGate";
import { STEADY_VH_SCRIPT } from "@/lib/viewport";

// No face is preloaded. Each loads when a page first lays out text in it
// (the CSS is inlined, so that is immediate), and pages that never use a
// face never download it. Outfit, DM Sans and Inter were preloaded until
// Oct 23 2026, but any font preload made headless Chrome, which PageSpeed
// runs, hold the first frame for 1 to 2.4s (free page mobile 63 to 66
// against 91 without); a visible Chrome painted at the same time either way.
const geistSans = Geist({
  variable: "--font-geist-sans",
  preload: false,
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  preload: false,
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Handwriting accent used for the highlighted word in the hero headline and
// the figures in About. Variable font (wght 400-700), so no `weight` — the
// spans pick from the axis.
const script = Caveat({
  variable: "--font-script",
  preload: false,
  subsets: ["latin"],
});

// Monospace face, used for the small uppercase labels and CTAs in the sections
// below the fold — they read as measurements rather than as more marketing copy.
// Variable (wght 400-700), so no `weight`; consumers pick off the axis.
const sometype = Sometype_Mono({
  variable: "--font-sometype",
  preload: false,
  subsets: ["latin"],
});

// Faces from the cloned reference (homepage hero, selected works, nav): DM Sans is theirs;
// Cormorant Garamond stands in for their licensed ABC Marist.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  preload: false,
  subsets: ["latin"],
});

const marist = Cormorant_Garamond({
  variable: "--font-marist",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

// The mobile dock (cloned from a Framer template set in Inter), /work and
// the Sight product mockups. Variable, so every weight comes from one file.
const inter = Inter({
  variable: "--font-inter",
  preload: false,
  subsets: ["latin"],
});

// Handwritten face for the partner labels and names in Why Cloverfield.
const reenie = Reenie_Beanie({
  variable: "--font-reenie",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cloverfield Studio | Websites That Bring In Customers",
  description:
    "Cloverfield Studio is a two-person web design studio in Surrey, BC. Our sites have generated 3,000+ inquiries for local businesses. Book a free call.",
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
    title: "Cloverfield Studio | Websites That Bring In Customers",
    description:
      "We make websites that bring in customers. Our work has generated more than 3,000 inquiries for local businesses in Surrey, BC and the Lower Mainland.",
    url: "https://cloverfield.studio",
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
    title: "Cloverfield Studio | Websites That Bring In Customers",
    description:
      "We make websites that bring in customers. Our work has generated more than 3,000 inquiries for local businesses in Surrey, BC and the Lower Mainland.",
    images: ["https://cloverfield.studio/og-image-v2.jpeg"],
  },
  // Meta Business Settings checks this tag to verify cloverfield.studio.
  verification: {
    other: { "facebook-domain-verification": "26tzbkvsjtqh2o9eu3gh5a0kf2w0go" },
  },
};

/** Schema: cities served, first four in the order people search them. */
const SERVICE_CITIES: [string, string][] = [
  ["Surrey", "Surrey,_British_Columbia"],
  ["Vancouver", "Vancouver"],
  ["Burnaby", "Burnaby"],
  ["Richmond", "Richmond,_British_Columbia"],
  ["Langley", "Langley,_British_Columbia_(city)"],
  ["Coquitlam", "Coquitlam"],
  ["Delta", "Delta,_British_Columbia"],
  ["White Rock", "White_Rock,_British_Columbia"],
  ["North Vancouver", "North_Vancouver_(city)"],
  ["West Vancouver", "West_Vancouver"],
];

/** Schema: the two founders, as on the Sight page. */
const FOUNDERS = [
  { id: "william", name: "William Nguyen", role: "Founder" },
  { id: "irish", name: "Irish Catungal", role: "Co-founder" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Before first paint: a viewport height that holds still in in-app
            browsers (see lib/viewport). */}
        <script dangerouslySetInnerHTML={{ __html: STEADY_VH_SCRIPT }} />
        {/* Only the live domain reports. Open any page with ?internal=1 once on
            your own devices to stop counting yourself (?internal=0 undoes it).
            gtag.js is added at the end, once the page has hydrated, rather
            than as its own <Script src>: Next preloads those from the HTML,
            which put its 200KB at the front of every first load, beside the
            fonts and the first screen's pictures. */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`(function(){
var q = new URLSearchParams(location.search).get('internal');
try {
  if (q === '1') localStorage.setItem('cf_internal', '1');
  if (q === '0') localStorage.removeItem('cf_internal');
  var me = localStorage.getItem('cf_internal') === '1';
} catch (e) {}
var live = /(^|\\.)cloverfield\\.studio$/.test(location.hostname);
if (!live || me) window['ga-disable-G-KHS5MBDWV5'] = true;
})();
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KHS5MBDWV5');
(function(){
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=G-KHS5MBDWV5';
document.head.appendChild(s);
})();`}
        </Script>
        {/* Meta Pixel (Oct 25 2026), for the ads on the free page: PageView
            here, Lead and SubmitApplication from the quiz (pixel() in
            lib/track). The same rule as GA: only the live domain, never a
            device opened with ?internal=1. fbevents.js waits for the page's
            load event and a quiet moment, so it never competes with the
            first screen; events wait in fbq's queue until it arrives. Meta's
            <noscript> image is left out, as it can't skip those devices. */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`(function(){
var q = new URLSearchParams(location.search).get('internal');
var me = q === '1';
try { if (q !== '0' && localStorage.getItem('cf_internal') === '1') me = true; } catch (e) {}
if (me || window.fbq || !/(^|\.)cloverfield\.studio$/.test(location.hostname)) return;
var n = window.fbq = function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
if (!window._fbq) window._fbq = n;
n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
fbq('init', '2627321397702969');
fbq('track', 'PageView');
function load(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
}
function idle(){
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1);
}
if (document.readyState === 'complete') idle();
else addEventListener('load', idle, { once: true });
})();`}
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
                    "Web design and development studio in Surrey, BC. We make websites that bring in customers for local businesses, designed around what their customers are looking for. Our work has generated more than 3,000 inquiries.",
                  "url": "https://cloverfield.studio",
                  "logo": "https://cloverfield.studio/og-image-v2.jpeg",
                  "image": "https://cloverfield.studio/og-image-v2.jpeg",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Surrey",
                    "addressRegion": "BC",
                    "addressCountry": "CA",
                  },
                  // Cities are typed and tied to their Wikipedia pages so
                  // "Surrey" can't be read as Surrey, England.
                  "areaServed": [
                    ...SERVICE_CITIES.map(([name, wiki]) => ({
                      "@type": "City",
                      "name": `${name}, BC`,
                      "sameAs": `https://en.wikipedia.org/wiki/${wiki}`,
                      "containedInPlace": {
                        "@type": "AdministrativeArea",
                        "name": "British Columbia, Canada",
                      },
                    })),
                    { "@type": "AdministrativeArea", "name": "Lower Mainland, BC" },
                  ],
                  "founder": FOUNDERS.map((f) => ({
                    "@type": "Person",
                    "@id": `https://cloverfield.studio/#${f.id}`,
                    "name": f.name,
                    "jobTitle": f.role,
                    "worksFor": { "@id": "https://cloverfield.studio/#business" },
                  })),
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
                        // Schema only for now; the page doesn't show prices yet.
                        "priceSpecification": {
                          "@type": "PriceSpecification",
                          "minPrice": 4500,
                          "priceCurrency": "CAD",
                        },
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
                  // Same number as the Google Business Profile, so the two match.
                  "telephone": "+1-778-997-0335",
                  // The Google Business Profile: its Maps listing (by CID) and
                  // its Knowledge Graph entry.
                  "hasMap": "https://maps.google.com/?cid=9213707083497837897",
                  "sameAs": [
                    "https://maps.google.com/?cid=9213707083497837897",
                    "https://www.google.com/search?kgmid=/g/11yzw8bm3p",
                    "https://www.instagram.com/cloverfield.studio/",
                    "https://www.linkedin.com/company/cloverfieldstudio/",
                  ],
                  // No aggregateRating: Google ignores star ratings a business
                  // marks up about itself, and it can't be filled with the
                  // Google Business Profile's own rating. Those stars come from
                  // the profile, which `sameAs` links to.
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
                    "Web design studio in Surrey, BC. We make websites that bring in customers for local businesses.",
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
        <Analytics />
        <ChromeGate>
          <SiteNav />
          <MobileDock />
        </ChromeGate>
        {children}
      </body>
    </html>
  );
}
