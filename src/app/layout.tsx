import type { Metadata } from "next";
import {
  Geist,
  Cormorant_Garamond,
  Playfair_Display,
  Instrument_Serif,
  Outfit,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0HNWS9W1ZE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0HNWS9W1ZE');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${cormorant.variable} ${playfair.variable} ${instrumentSerif.variable} ${outfit.variable} antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
