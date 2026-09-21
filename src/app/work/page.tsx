"use client";

import WorkGallery from "@/components/WorkGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1a1613]">
      <div className="relative z-10 bg-[#f9f8f5]">
        <WorkGallery />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
