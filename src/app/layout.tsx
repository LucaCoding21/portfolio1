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
              "@type": "LocalBusiness",
              "name": "Cloverfield Studio",
              "description":
                "Web design and development agency in Surrey BC building custom websites that generate leads for small businesses",
              "url": "https://cloverfield.studio",
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
                "Lower Mainland",
              ],
              "priceRange": "$",
              "sameAs": [],
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
