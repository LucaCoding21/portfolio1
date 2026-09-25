"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const CalEmbed = dynamic(
  () => import("@calcom/embed-react").then((mod) => mod.default),
  { ssr: false }
);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only mount Cal.com when the section is near the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The embed loads a second or two after it mounts and grows by ~900px.
  // The footer below is pinned, so the browser has nothing to anchor the
  // scroll to and a visitor already past the calendar gets shoved back up
  // into it. When it resizes above the middle of the screen, shift the
  // scroll by the same amount so they stay put. The box keeps the
  // placeholder's 400px as a floor so it only ever grows while loading.
  useEffect(() => {
    const box = embedRef.current;
    if (!box) return;

    let prev = box.offsetHeight;
    const observer = new ResizeObserver(() => {
      const height = box.offsetHeight;
      const delta = height - prev;
      prev = height;
      if (!delta) return;
      const oldBottom = box.getBoundingClientRect().bottom - delta;
      if (oldBottom >= window.innerHeight / 2) return;
      const doc = document.documentElement;
      const wasAtBottom =
        doc.scrollHeight - delta - window.innerHeight - window.scrollY <= 8;
      if (wasAtBottom) {
        window.scrollTo({ top: doc.scrollHeight, behavior: "instant" });
      } else {
        window.scrollBy({ top: delta, behavior: "instant" });
      }
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Configure Cal UI after embed loads
  useEffect(() => {
    if (!visible) return;

    (async function () {
      const { getCalApi } = await import("@calcom/embed-react");
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#000000",
            "cal-text": "#000000",
            "cal-text-emphasis": "#000000",
            "cal-border-emphasis": "#000000",
            "cal-text-muted": "#666666",
            "cal-border": "rgba(0,0,0,0.1)",
            "cal-border-default": "rgba(0,0,0,0.1)",
            "cal-border-subtle": "rgba(0,0,0,0.06)",
            "cal-bg": "#ffffff",
            "cal-bg-emphasis": "#f5f5f5",
            "cal-bg-subtle": "#fafafa",
            "cal-bg-muted": "#f5f5f5",
          },
          dark: {
            "cal-brand": "#000000",
            "cal-text": "#000000",
            "cal-text-emphasis": "#000000",
            "cal-border-emphasis": "#000000",
            "cal-text-muted": "#666666",
            "cal-border": "rgba(0,0,0,0.1)",
            "cal-border-default": "rgba(0,0,0,0.1)",
            "cal-border-subtle": "rgba(0,0,0,0.06)",
            "cal-bg": "#ffffff",
            "cal-bg-emphasis": "#f5f5f5",
            "cal-bg-subtle": "#fafafa",
            "cal-bg-muted": "#f5f5f5",
          },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, [visible]);

  const handleMouseEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor:hide"));
  }, []);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor:show"));
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 py-20 md:py-28 pb-20 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,5vw,3rem)] uppercase tracking-tight text-center mb-3 md:mb-4">
          Book a Free Consultation
        </h2>
        <p className="text-center text-black/55 text-sm md:text-base mb-8 md:mb-12">
          Ready for a website that generates leads? Let&apos;s talk about your project.
        </p>

        <div
          ref={embedRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex min-h-[400px] justify-center border border-black/10 rounded-2xl overflow-hidden"
        >
          {visible ? (
            <CalEmbed
              calLink="cloverfield/30min"
              config={{ layout: "column_view" }}
              style={{ width: "100%", height: "100%", overflow: "auto" }}
            />
          ) : (
            <div style={{ width: "100%" }} />
          )}
        </div>
      </div>
    </section>
  );
}
