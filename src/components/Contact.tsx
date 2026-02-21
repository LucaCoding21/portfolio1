"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useCallback } from "react";

export default function Contact() {
  useEffect(() => {
    (async function () {
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
  }, []);

  const handleMouseEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor:hide"));
  }, []);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor:show"));
  }, []);

  return (
    <section
      id="contact"
      className="relative z-10 py-20 md:py-28 pb-20 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,5vw,3rem)] uppercase tracking-tight text-center mb-3 md:mb-4">
          Book a Call
        </h2>
        <p className="text-center text-black/50 text-sm md:text-base mb-8 md:mb-12">
          Have a project in mind? Schedule a free consultation.
        </p>

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex justify-center border border-black/10 rounded-2xl overflow-hidden"
        >
          <Cal
            calLink="cloverfield/30min"
            config={{ layout: "column_view" }}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
