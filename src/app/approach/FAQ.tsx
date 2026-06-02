"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FAQ_ITEMS, type FAQItem } from "./faq-data";

function FAQRow({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.45,
      ease: "power2.inOut",
    });
  }, [open]);

  return (
    <div className="border-t border-black/15">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-baseline justify-between gap-6 py-6 md:py-7 text-left"
      >
        <span className="flex items-baseline gap-4 md:gap-6">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-black/40 font-medium font-[family-name:var(--font-geist-sans)] shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-[family-name:var(--font-outfit)] font-medium text-lg md:text-xl tracking-tight leading-snug">
            {item.q}
          </span>
        </span>
        <span
          className="shrink-0 text-xl md:text-2xl text-black/45 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
      >
        <p className="pl-0 md:pl-[5rem] pb-7 pr-12 md:pr-16 text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch]">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="border-b border-black/15">
      {FAQ_ITEMS.map((item, i) => (
        <FAQRow key={item.q} item={item} index={i} />
      ))}
    </div>
  );
}
