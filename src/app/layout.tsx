import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Playfair_Display, Instrument_Serif } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

// Playfair Display - closest free alternative to Freight Big Pro
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Instrument Serif - elegant editorial font for logo/branding
const instrumentSerif = Instrument_Serif({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Studio | Digital Experiences",
  description: "We craft digital experiences worth talking about. Product design, development, and brand strategy for innovative startups and reputable brands.",
  keywords: ["design studio", "digital agency", "product design", "web development", "brand strategy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${instrumentSerif.variable} antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
