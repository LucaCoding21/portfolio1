"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "hover" | "play" | "view" | "read" | "site" | "book";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const playCursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Whether to render at all is decided by CursorLoader (which gates on a
    // fine pointer being available), so no touch check is needed here.
    const cursor = cursorRef.current;
    const playCursor = playCursorRef.current;
    if (!cursor || !playCursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let playCursorX = 0;
    let playCursorY = 0;

    let currentState: CursorState = "default";

    const resolveState = (el: HTMLElement): CursorState => {
      if (el.classList.contains("cursor-book") || el.closest(".cursor-book")) return "book";
      if (el.classList.contains("cursor-site") || el.closest(".cursor-site")) return "site";
      if (el.classList.contains("cursor-read") || el.closest(".cursor-read")) return "read";
      if (el.classList.contains("cursor-play") || el.closest(".cursor-play")) return "play";
      if (el.classList.contains("cursor-view") || el.closest(".cursor-view")) return "view";
      if (
        el.tagName === "BUTTON" || el.tagName === "A" ||
        el.closest("button") || el.closest("a") ||
        el.classList.contains("hoverable") || el.closest(".hoverable")
      ) return "hover";
      return "default";
    };

    const updateState = (next: CursorState) => {
      if (next !== currentState) {
        currentState = next;
        setCursorState(next);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        cursorX = mouseX;
        cursorY = mouseY;
        playCursorX = mouseX;
        playCursorY = mouseY;
      }

      // Resolve cursor state from the event target (cheap) instead of
      // calling elementFromPoint every RAF frame (expensive layout thrash)
      const target = e.target as HTMLElement;
      if (target) updateState(resolveState(target));
    };

    // Re-check cursor state on scroll so momentum-scroll still updates
    const handleScroll = () => {
      const el = document.elementFromPoint(mouseX, mouseY);
      if (el) updateState(resolveState(el as HTMLElement));
    };

    let rafId: number;
    const animate = () => {
      const ease = 0.35;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

      // Play cursor follows a bit slower for a laggy/magnetic feel
      const playEase = 0.18;
      playCursorX += (mouseX - playCursorX) * playEase;
      playCursorY += (mouseY - playCursorY) * playEase;
      playCursor.style.transform = `translate3d(${playCursorX}px, ${playCursorY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      updateState("default");
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      gsap.to(playCursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
      gsap.to(playCursor, { opacity: 1, duration: 0.2 });
    };

    // Hide cursor when hovering over iframes (e.g. Cal.com embed)
    const handleCursorHide = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.15 });
      gsap.to(playCursor, { opacity: 0, duration: 0.15 });
    };
    const handleCursorShow = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.15 });
      gsap.to(playCursor, { opacity: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("cursor:hide", handleCursorHide);
    window.addEventListener("cursor:show", handleCursorShow);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cursor:hide", handleCursorHide);
      window.removeEventListener("cursor:show", handleCursorShow);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Animate cursor state changes
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const play = playRef.current;
    const view = viewRef.current;
    const read = readRef.current;
    const site = siteRef.current;
    const book = bookRef.current;
    if (!dot || !ring || !play || !view || !read || !site || !book) return;

    // Kill any in-flight tweens so a longer "show" can't outlast a shorter "hide"
    gsap.killTweensOf([dot, ring, play, view, read, site, book]);

    if (cursorState === "play") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    } else if (cursorState === "view") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    } else if (cursorState === "read") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    } else if (cursorState === "site") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    } else if (cursorState === "book") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    } else if (cursorState === "hover") {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    } else {
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(play, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(view, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(read, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(site, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(book, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.out" });
    }
  }, [cursorState]);

  return (
    <>
      {/* Default cursor — mix-blend-mode: difference */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99999,
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

      {/* Play reel cursor — normal blend, own color */}
      <div
        ref={playCursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          ref={playRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.3)",
            width: 110,
            height: 110,
            background: "#CDFF50",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              whiteSpace: "nowrap",
            }}
          >
            Play Reel
          </span>
        </div>
        <div
          ref={viewRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.3)",
            width: 90,
            height: 90,
            background: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#0a0a0a",
            }}
          >
            View
          </span>
        </div>
        <div
          ref={readRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.3)",
            width: 110,
            height: 110,
            background: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              whiteSpace: "nowrap",
            }}
          >
            Read more
          </span>
        </div>
        <div
          ref={siteRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.3)",
            width: 88,
            height: 88,
            background: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              whiteSpace: "nowrap",
            }}
          >
            View site
          </span>
        </div>
        <div
          ref={bookRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.3)",
            width: 86,
            height: 86,
            background: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              whiteSpace: "nowrap",
            }}
          >
            Book a call
          </span>
        </div>
      </div>
    </>
  );
}
