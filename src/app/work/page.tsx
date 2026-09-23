"use client";

import WorkGallery from "@/components/WorkGallery";
import VideoCta from "@/components/VideoCta";
import Footer from "@/components/Footer";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1a1613]">
      <div className="relative z-10 bg-[#f9f8f5]">
        <WorkGallery />
        {/* The homepage's closing reel and review field, tagged "work". */}
        <VideoCta source="work" onPaper />
        <Footer />
      </div>
    </div>
  );
}
