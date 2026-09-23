"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import { scrollToHash } from "@/lib/scrollToHash";
import LassieHero from "@/components/LassieHero";
import LassieFeatures from "@/components/LassieFeatures";
import ClientWall from "@/components/ClientWall";
import TeamIntro from "@/components/TeamIntro";
import MoreWork from "@/components/MoreWork";

// Lives in module memory, so it resets on every full page load (refresh, hard
// refresh, typed URL) and the intro plays again. It only survives client-side
// navigation, so clicking back to "/" from /work skips straight to the page.
let loaderPlayed = false;

const HowWeDoIt = dynamic(() => import("@/components/HowWeDoIt"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const VideoCta = dynamic(() => import("@/components/VideoCta"));
const Contact = dynamic(() => import("@/components/Contact"));
const HomeFooter = dynamic(() => import("@/components/HomeFooter"));

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Before paint, decide whether to skip the loader: if it already played in
  // this page load, or if the URL has a hash (we're arriving at /#about etc).
  useLayoutEffect(() => {
    const hasHash = !!window.location.hash;
    if (hasHash || loaderPlayed) {
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

      loaderPlayed = true;

      const hash = window.location.hash;
      if (skipped && hash) {
        // Arrived from another page via /#about-style link — jump to the section
        // on the next frame so the layout is settled.
        requestAnimationFrame(() => {
          scrollToHash(hash, "instant");
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
      <div className="relative z-10 rounded-b-[28px] bg-white md:rounded-b-[48px]">
        <Testimonials />
        <VideoCta />
        <Contact />
      </div>
      {/* The footer is pinned underneath; the white block above lifts off it. */}
      <HomeFooter />
    </div>
  );
}
