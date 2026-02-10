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
  title: "Cloverfield Studio | Web Design & Development in Vancouver & Surrey BC",
  description:
    "Cloverfield is a creative studio in Vancouver and Surrey, BC specializing in web design, development, and brand identity. We craft beautiful digital experiences for ambitious brands.",
  keywords: [
    "web design Vancouver",
    "web development Surrey BC",
    "creative studio Vancouver",
    "digital agency Surrey",
    "brand identity Vancouver",
    "website design BC",
    "product design Vancouver",
    "web developer Surrey BC",
  ],
  openGraph: {
    title: "Cloverfield Studio | Web Design & Development in Vancouver & Surrey BC",
    description: "Creative studio in Vancouver and Surrey, BC crafting beautiful digital experiences for ambitious brands.",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Cloverfield Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloverfield Studio | Web Design & Development in Vancouver & Surrey BC",
    description: "Creative studio in Vancouver and Surrey, BC crafting beautiful digital experiences for ambitious brands.",
    images: ["/og-image.jpeg"],
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
