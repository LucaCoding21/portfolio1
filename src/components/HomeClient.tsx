"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { homepageProjects } from "@/data/projects";

const About = dynamic(() => import("@/components/About"));
const Work = dynamic(() =>
  import("@/components/Work").then((m) => ({ default: m.default }))
);
const ViewAllWork = dynamic(() =>
  import("@/components/Work").then((m) => ({ default: m.ViewAllWork }))
);
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Ensure page starts at top on refresh (no visible scroll)
  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Lock scroll during loading, reset to top when done
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.inset = "0";
      document.body.style.width = "100%";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
      window.scrollTo(0, 0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setReady(true);
        });
      });
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white text-black">
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}
      <Header />
      <Hero ready={ready} />
      <div className="relative z-10 bg-white">
        <About ready={ready} />
        <Work projectList={homepageProjects} showFilters={false} />
        <ViewAllWork />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
