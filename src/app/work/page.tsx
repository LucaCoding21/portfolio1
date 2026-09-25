"use client";

import WorkGallery from "@/components/WorkGallery";
import VideoCta from "@/components/VideoCta";
import HomeFooter from "@/components/HomeFooter";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1a1613]">
      {/* overflow-clip, not hidden: it rounds the closing section's own
          square background without breaking the gallery's sticky parts */}
      <main className="relative z-10 overflow-clip rounded-b-[28px] bg-[#f9f8f5] md:rounded-b-[48px]">
        <WorkGallery />
        {/* The homepage's closing reel and review field, tagged "work". */}
        <VideoCta source="work" onPaper />
      </main>
      {/* The homepage's footer, pinned underneath; the block above lifts off it. */}
      <HomeFooter />
    </div>
  );
}
