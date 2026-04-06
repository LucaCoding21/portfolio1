"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const CalEmbed = dynamic(
  () => import("@calcom/embed-react").then((mod) => mod.default),
  { ssr: false }
);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
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

  // Configure Cal UI + GA tracking after embed loads
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

      const fireBookingEvent = () => {
        const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
        gtag?.("event", "booking_confirmed", {
          event_category: "booking",
          event_label: "Free Consultation Booked",
        });
      };

      cal("on", { action: "bookingSuccessful", callback: fireBookingEvent });
      cal("on", { action: "bookingSuccessfulV2", callback: fireBookingEvent });
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
        <p className="text-center text-black/50 text-sm md:text-base mb-8 md:mb-12">
          Ready for a website that generates leads? Let&apos;s talk about your project.
        </p>

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex justify-center border border-black/10 rounded-2xl overflow-hidden"
        >
          {visible ? (
            <CalEmbed
              calLink="cloverfield/30min"
              config={{ layout: "column_view" }}
              style={{ width: "100%", height: "100%", overflow: "auto" }}
            />
          ) : (
            <div style={{ width: "100%", minHeight: 400 }} />
          )}
        </div>
      </div>
    </section>
  );
}
