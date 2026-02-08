"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  sourceBorderRadius: string;
  getSourceRect: () => DOMRect | null;
  getSourceBorderRadius: () => string;
  videoSrc: string;
  initialTime: number;
  onTimeSync: (time: number) => void;
}

export default function VideoPlayer({
  isOpen,
  onClose,
  sourceRect,
  sourceBorderRadius,
  videoSrc,
  initialTime,
  onTimeSync,
}: VideoPlayerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pauseIconRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock — just overflow hidden, no position shift
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }
  }, [isOpen]);

  // Open animation
  useEffect(() => {
    if (!isOpen || !sourceRect || !containerRef.current || !overlayRef.current || !backdropRef.current || !closeRef.current) return;

    isClosingRef.current = false;
    isAnimatingRef.current = true;
    setIsPlaying(true);

    const container = containerRef.current;
    const backdrop = backdropRef.current;
    const overlay = overlayRef.current;
    const close = closeRef.current;
    const video = videoRef.current;

    gsap.set(container, {
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius: sourceBorderRadius,
    });
    gsap.set(overlay, { pointerEvents: "auto", visibility: "visible" });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(close, { opacity: 0, scale: 0.5 });

    if (video) {
      video.currentTime = initialTime;
      video.muted = true;
      video.play();
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        isAnimatingRef.current = false;
        gsap.to(close, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
      },
    });

    tl.to(backdrop, { opacity: 1, duration: 0.7, ease: "power2.inOut" }, 0);
    tl.to(container, {
      top: 0, left: 0, width: vw, height: vh,
      borderRadius: "0px", duration: 0.85,
    }, 0.05);

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sourceRect]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const flashPauseIcon = useCallback(() => {
    const icon = pauseIconRef.current;
    if (!icon) return;
    gsap.killTweensOf(icon);
    gsap.fromTo(icon,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.5, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    flashPauseIcon();
  }, [flashPauseIcon]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current || isAnimatingRef.current) return;
    isClosingRef.current = true;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const container = containerRef.current;
    const close = closeRef.current;

    if (!overlay || !backdrop || !container || !close) {
      onTimeSync(videoRef.current?.currentTime ?? 0);
      onClose();
      isClosingRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: "none", visibility: "hidden" });
        onTimeSync(videoRef.current?.currentTime ?? 0);
        onClose();
        isClosingRef.current = false;
      },
    });

    // Simple, clean fade out — no shrink-back animation
    tl.to(close, { opacity: 0, duration: 0.15, ease: "power2.in" }, 0);
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 0.05);
    tl.to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.1);
  }, [onClose, onTimeSync]);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimatingRef.current) return;
    togglePlay();
  }, [togglePlay]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  if (!isOpen && !isClosingRef.current) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0"
      style={{ zIndex: 9999, pointerEvents: "none", visibility: "hidden" }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black"
        style={{ opacity: 0 }}
        onClick={handleBackdropClick}
      />

      {/* Video container */}
      <div
        ref={containerRef}
        className="absolute overflow-hidden will-change-transform"
        style={{ top: 0, left: 0, width: 0, height: 0 }}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Center flash icon on play/pause */}
        <div
          ref={pauseIconRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <rect x="5" y="3" width="4" height="18" rx="1" />
                <rect x="15" y="3" width="4" height="18" rx="1" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        ref={closeRef}
        onClick={handleClose}
        className="pointer-events-auto absolute top-6 right-6 w-11 h-11 rounded-full bg-white flex items-center justify-center"
        style={{ opacity: 0 }}
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="3" x2="13" y2="13" />
          <line x1="13" y1="3" x2="3" y2="13" />
        </svg>
      </button>
    </div>,
    document.body
  );
}
