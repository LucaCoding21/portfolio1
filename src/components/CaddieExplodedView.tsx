"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Three.js, the GLTF loader and the Draco decode are heavy, so the canvas is
// its own chunk and only mounts once the panel is about a viewport away.
// Visitors who never scroll this far never download it.
const CaddieExplodeCanvas = dynamic(() => import("./CaddieExplodeCanvas"), {
  ssr: false,
});

const ASSETS = "/caddie";

/** Still frames rendered from the live model: shown while it loads, and in
    place of it for visitors on data saver, low-memory phones or reduced motion. */
function Poster({ state, className }: { state: "assembled" | "exploded"; className?: string }) {
  return (
    <picture className={`absolute inset-0 block ${className ?? ""}`}>
      <source media="(max-width: 767px)" srcSet={`${ASSETS}/poster-mobile-${state}.webp`} />
      <img
        src={`${ASSETS}/poster-desktop-${state}.webp`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        loading="lazy"
      />
    </picture>
  );
}

/** Save the 3D for visitors whose phone or settings ask for less. */
function wantsLite() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return true;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true;
  return false;
}

/**
 * The dark dotted panel from the client's site, holding the live 3D model.
 *
 * Like caddiecompanion.com, the panel pins while scrolling scrubs the
 * explosion 0 → 1, then releases. The pin is created on mount, before the
 * model loads, so its spacing is in place from the first paint and nothing
 * below it jumps when the GLB arrives. The canvas only reads `progress`.
 */
export default function CaddieExplodedView() {
  const pinRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [mode, setMode] = useState<"pending" | "live" | "lite">("pending");
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  // Decide once on the client: live 3D, or the still exploded frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMode(wantsLite() ? "lite" : "live"));
    return () => cancelAnimationFrame(id);
  }, []);

  // Mount the canvas (and start fetching the model) about a viewport early.
  useEffect(() => {
    if (mode !== "live") return;
    const el = pinRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // Pin the panel centred in the viewport and scrub the explosion.
  useEffect(() => {
    if (mode !== "live") return;
    const el = pinRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "center center",
      end: "+=110%",
      pin: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        if (hintRef.current) hintRef.current.style.opacity = self.progress < 0.03 ? "1" : "0";
      },
    });
    // Images above the panel settle their height as they load; re-measure then.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      st.kill();
    };
  }, [mode]);

  return (
    <div ref={pinRef} className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-black/10 bg-[#0e0e11] aspect-[4/5] md:aspect-[16/10]"
        role="img"
        aria-label="3D exploded view of the Caddie Companion: scrolling takes the six-in-one tool apart piece by piece."
      >
        {/* The WebGL canvas is transparent, so these dots show through. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.22) 1.3px, transparent 1.3px)",
            backgroundSize: "20px 20px",
          }}
        />

        {mode === "lite" ? (
          <Poster state="exploded" />
        ) : (
          <>
            {/* Holds the frame until the model has drawn, then fades out. */}
            <Poster
              state="assembled"
              className={`transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
            />
            <div className="relative z-10 h-full w-full">
              {near && (
                <CaddieExplodeCanvas progress={progress} onReady={() => setReady(true)} />
              )}
            </div>
            <div
              ref={hintRef}
              className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-white/45 font-[family-name:var(--font-geist-sans)] transition-opacity duration-500"
            >
              Scroll to take it apart
            </div>
          </>
        )}
      </div>
    </div>
  );
}
