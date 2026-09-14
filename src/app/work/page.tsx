"use client";

import WorkGallery from "@/components/WorkGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative z-10 bg-white">
        <WorkGallery />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
