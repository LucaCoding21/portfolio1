"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type FAQItem = { q: string; a: string };

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How long does a project take?",
    a: "Most sites launch in 7 to 14 days from kickoff. Larger builds with bigger page counts, custom CMS work, or multi-language take three to four weeks. We'll give you a realistic timeline before any money changes hands.",
  },
  {
    q: "How much does a website cost?",
    a: "Pricing scales with scope, but every project includes the same baseline: custom design, custom code, Lighthouse 95+, initial SEO, and post-launch support. Book a call and we'll quote against your specific goals. No template tiers, no surprise upcharges.",
  },
  {
    q: "Do you only work with businesses in Surrey BC?",
    a: "No. We're based in Surrey and a chunk of our work is local, but most of our clients are remote, across Vancouver, the Lower Mainland, Canada, and the US. The process is identical either way.",
  },
  {
    q: "What's included in the monthly retainer?",
    a: "Performance monitoring, content updates, A/B tests on the sections that matter, and proactive recommendations when we spot something underperforming. The retainer is optional and cancellable any month. It's there because most sites are worth improving, not because we want to lock you in.",
  },
  {
    q: "Why don't you do ongoing SEO?",
    a: "Because that's a different specialty. We get you ranking at launch for the searches that close: buyer-intent, branded, local. Ongoing content strategy, link building, and topical authority work is best handled by agencies that do nothing else. We'll happily recommend a few.",
  },
  {
    q: "Can we keep our existing branding?",
    a: "Yes. Most clients come in with branding they want to honour. We extend it into a web language (typography, motion, layout system) rather than reinventing the wheel.",
  },
  {
    q: "Do we own the code at the end?",
    a: "Yes. Your repo, your hosting account, your domain, your everything. We don't build on a proprietary platform and we don't keep anything hostage. If we ever stop working together, the site keeps running exactly as it is.",
  },
];

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
