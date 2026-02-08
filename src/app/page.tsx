"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scroll during loading, reset to top when done
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white text-black">
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}
      <Header />
      <Hero ready={!isLoading} />
      <div className="relative z-10 bg-white">
        <About ready={!isLoading} />
        <Work />
        <Contact />
      </div>
    </div>
  );
}
