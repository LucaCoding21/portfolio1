"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import LassieHero from "@/components/LassieHero";
import LassieFeatures from "@/components/LassieFeatures";
import ClientWall from "@/components/ClientWall";
import TeamIntro from "@/components/TeamIntro";
import MoreWork from "@/components/MoreWork";

const LOADED_FLAG = "cf-loader-seen";

const HowWeDoIt = dynamic(() => import("@/components/HowWeDoIt"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const VideoCta = dynamic(() => import("@/components/VideoCta"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Before paint, decide whether to skip the loader: if we already played it
  // this session, or if the URL has a hash (we're arriving at /#about etc).
  useLayoutEffect(() => {
    const hasHash = !!window.location.hash;
    const alreadyPlayed = sessionStorage.getItem(LOADED_FLAG) === "1";
    if (hasHash || alreadyPlayed) {
      setIsLoading(false);
      setSkipped(true);
    }
  }, []);

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

      sessionStorage.setItem(LOADED_FLAG, "1");

      const hash = window.location.hash;
      if (skipped && hash) {
        // Arrived from another page via /#about-style link — jump to the section
        // on the next frame so the layout is settled.
        requestAnimationFrame(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: "auto" });
          setReady(true);
        });
      } else if (skipped) {
        // Returning to "/" without a hash — just show the homepage at top, no anim.
        window.scrollTo(0, 0);
        setReady(true);
      } else {
        // Normal first-load path: loader finished, run entry animations.
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setReady(true);
          });
        });
      }
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
    };
  }, [isLoading, skipped]);

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#1a1613]">
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}
      <LassieHero ready={ready} />
      <ClientWall />
      <TeamIntro />
      <LassieFeatures ready={ready} />
      <MoreWork />
      {/* More Work is the card that scrolls off to uncover How We Do It,
          which holds until the card has cleared, then scrolls on. */}
      <HowWeDoIt />
      <div className="relative z-10 bg-white">
        <Testimonials />
        <VideoCta />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
