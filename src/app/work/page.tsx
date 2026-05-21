"use client";

import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative z-10 bg-white">
        <div className="pt-28">
          <Work />
        </div>
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
