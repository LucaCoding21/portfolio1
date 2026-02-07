"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}
      <Header />
      <Hero ready={!isLoading} />
      <About ready={!isLoading} />
      <Work />
      <Contact />
    </div>
  );
}
