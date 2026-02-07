"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
];

export default function LoadingScreen({
  onLoadingComplete,
}: LoadingScreenProps) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const assetsLoadedRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const wordsCompleteRef = useRef(false);
  const isExitingRef = useRef(false);

  // Wait for mount to avoid SSR mismatch
  useEffect(() => {
    setReady(true);
  }, []);

  // Preload assets in background
  useEffect(() => {
    const assets = [
      "/hero.mp4",
      "/njagih2.jpg",
      "/njagih studios.png",
      "/ace.png",
      "/Clover Studio.png",
      "/Sophie.png",
    ];

    const preloadAsset = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (src.endsWith(".mp4")) {
          const video = document.createElement("video");
          video.preload = "auto";
          video.oncanplaythrough = () => resolve();
          video.onerror = () => resolve();
          video.src = src;
          video.load();
        } else {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }
      });
    };

    Promise.all(assets.map(preloadAsset)).then(() => {
      assetsLoadedRef.current = true;
    });

    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
    }, 2000);

    return () => clearTimeout(minTimer);
  }, []);

  // Cycle through words
  useEffect(() => {
    if (index === words.length - 1) {
      wordsCompleteRef.current = true;
      return;
    }
    const timeout = setTimeout(
      () => setIndex(index + 1),
      index === 0 ? 1000 : 150
    );
    return () => clearTimeout(timeout);
  }, [index]);

  // Exit animation — scale up + fade mask + fade container
  const triggerExit = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    const tl = gsap.timeline({ onComplete: onLoadingComplete });

    // Scale entire preloader (zoom into the text)
    tl.to(
      containerRef.current,
      {
        scale: 3,
        duration: 1,
        ease: "power3.inOut",
      },
      0
    );

    // Fade out the black mask (video becomes fully visible)
    tl.to(
      maskRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.2
    );

    // Fade out entire container (reveals page)
    tl.to(
      containerRef.current,
      {
        autoAlpha: 0,
        duration: 0.3,
      },
      0.7
    );
  }, [onLoadingComplete]);

  // Watch for all conditions to trigger exit
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        wordsCompleteRef.current &&
        assetsLoadedRef.current &&
        minTimeElapsedRef.current
      ) {
        clearInterval(interval);
        triggerExit();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [triggerExit]);

  return (
    <div ref={containerRef} className="preloader">
      {ready && (
        <>
          <video autoPlay muted loop playsInline className="preloader-video">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div ref={maskRef} className="preloader-mask">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="preloader-word"
            >
              {words[index]}
            </motion.p>
          </div>
        </>
      )}
    </div>
  );
}
