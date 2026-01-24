"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        cursorX = mouseX;
        cursorY = mouseY;
      }
    };

    const animate = () => {
      const ease = 0.35;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("hoverable") ||
        target.closest(".hoverable")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      if (relatedTarget && (
        relatedTarget.tagName === "BUTTON" ||
        relatedTarget.tagName === "A" ||
        relatedTarget.closest("button") ||
        relatedTarget.closest("a") ||
        relatedTarget.classList.contains("hoverable") ||
        relatedTarget.closest(".hoverable")
      )) {
        return;
      }

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("hoverable") ||
        target.closest(".hoverable")
      ) {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, isVisible]);

  // Animate cursor state changes
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || isTouchDevice) return;

    if (isHovering) {
      // Fade out dot, scale up ring
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      // Fade in dot, scale down ring
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(ring, {
        scale: 0.3,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [isHovering, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        mixBlendMode: "difference",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Main dot */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 18,
          height: 18,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
        }}
      />
      {/* Expanding ring */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0.3)",
          width: 60,
          height: 60,
          backgroundColor: "transparent",
          border: "1.5px solid rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
          opacity: 0,
        }}
      />
    </div>
  );
}
