"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type FAQItem = { q: string; a: string };

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How long does it take to build a website?",
    a: "Anywhere from about a week to a month, depending on scope. A focused site can be live in a week. Bigger builds with more pages, a custom CMS, or multiple languages run closer to a month. Either way, we give you a real timeline before any money changes hands.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on scope, but every project includes the same baseline: a custom site built in Next.js, design from scratch, full technical SEO, and post-launch support. No template tiers and no surprise upcharges. Book a call and we'll quote against your actual goals.",
  },
  {
    q: "Do you only work with businesses in Surrey BC?",
    a: "No. We're based in Surrey BC, and some of our work is local, but most of our clients are remote, across Vancouver, the Lower Mainland, the rest of Canada, and the US. The process is the same either way, and most of it runs over calls and email.",
  },
  {
    q: "What does post-launch support include?",
    a: "We watch the site in the background, bring you updates when they're actually worth making, and audit it if it ever stops pulling its weight. It's hands-off for you and built to keep the site improving over time. It's optional, month to month, and easy to step away from whenever you want.",
  },
  {
    q: "Why don't you do ongoing SEO?",
    a: "Because it's a different specialty, and we'd rather be honest than overpromise. We set up all the technical SEO at launch, so you show up when people search your name or your niche locally. Ongoing content, link building, and competing for the most contested keywords is full-time work, best handled by an SEO agency. We're happy to recommend good ones.",
  },
  {
    q: "Can we keep our existing branding?",
    a: "Yes. Most clients come to us with branding they want to keep, and we build around it, carrying your colours, type, and voice into the full site rather than starting over. If something in the brand is holding you back, we'll tell you, but we won't reinvent it for the sake of it.",
  },
  {
    q: "Do we own the website and code at the end?",
    a: "Yes, completely. The code, the hosting account, and the domain are all yours. We don't build on a locked proprietary platform, so nothing is ever held hostage. If we stop working together, the site keeps running exactly as it is.",
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
