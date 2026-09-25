"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Pill from "./Pill";
import { AppPanel, Icon, P, T } from "./SightUI";
import { gsap, reducedMotion, useSightGsap } from "./motion";
import { BOOK_URL } from "./constants";

/**
 * FAQ: the questions that come up on every first call, answered the way
 * we'd answer them out loud. One wide painted field, and one app
 * window floating on it that holds everything: eyebrow, headline and
 * the lead down the left, and on the right a ruled list, one question
 * per row with a small mark before it and a thin plus after, the
 * answer opening under it, one open at a time. Same paint and panel
 * as the rest of the page, but one window on one field, not the
 * two-column card.
 */

/* the icon that sits before each question, lucide-style from SightUI */
const ICONS = [P.layers, P.check, P.refresh, P.calendar, P.lock, P.wrench];

/* the headline, a word at a time, with the blue ones marked */
const HEADLINE: [string, boolean][] = [
  ["What", false],
  ["owners", false],
  ["ask", false],
  ["us", false],
  ["on", true],
  ["the", true],
  ["first", true],
  ["call", true],
];

const ITEMS: [string, string][] = [
  [
    "Will it connect to the tools we already use?",
    "Yes. If it has a login or an export, it connects. QuickBooks, Jobber, a Google Sheet with the price list in it, whatever you run the business on today. You keep using those tools exactly as you do now.",
  ],
  [
    "Can I trust the numbers?",
    "Every number is computed from your own records, not estimated. The AI only writes the sentence around it. If something ever looks off, tell us and we trace it back to the record it came from.",
  ],
  [
    "Do we have to change how we work?",
    "No. Nothing gets re-entered and nobody learns a new system. Sight reads what your tools already hold and keeps it current on its own, so the business runs the way it always has.",
  ],
  [
    "How much of my time does this take?",
    "About an hour. You give us access to your tools and walk us through how the business runs, and we do the connecting ourselves. You see it again when it is ready to use.",
  ],
  [
    "Where is our data, and who can see it?",
    "It is stored in Canada, and only you and the people you choose can see it. Your business sits on its own, never mixed with anyone else's.",
  ],
  [
    "What if it doesn't work out?",
    "Then you don't pay. If Sight isn't live and answering questions about your business within 45 days, there is no bill. That is the promise, and it is why we only take on businesses we are sure we can do this for.",
  ],
];

/**
 * The + that turns into a −: the whole mark makes a half turn while the
 * upright bar folds away, so the cross-bar is all that's left. Reverses
 * the same way. Colour follows the row.
 */
function PlusMinus({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
      style={{
        transform: active ? "rotate(180deg)" : "rotate(0deg)",
        color: active ? T.BLUE : T.INK,
        transitionProperty: "transform, color",
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path
        d="M12 5v14"
        className="origin-center transition-transform duration-300 ease-out"
        style={{
          transform: active ? "scaleY(0)" : "scaleY(1)",
          transitionDelay: active ? "0ms" : "150ms",
        }}
      />
    </svg>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  /* The entrance, as one timeline off the band: the paint opens out
     from a smaller rounded frame while the window rises into it and
     settles, the headline's words climb out of their slots one by one,
     the lead sharpens out of a blur, and on the right each rule draws
     across, its icon pops, the question slides in and the plus turns
     into place, row after row. */
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const band = root.querySelector("[data-band]");
    const paint = root.querySelector("[data-paint]");
    const win = root.querySelector("[data-window]");
    const eyebrow = root.querySelector("[data-eyebrow]");
    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
    const lead = root.querySelector("[data-lead]");
    const cta = root.querySelector("[data-cta]");
    const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", root);
    const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", root);
    const qs = gsap.utils.toArray<HTMLElement>("[data-q]", root);
    const pluses = gsap.utils.toArray<HTMLElement>("[data-plus]", root);
    if (!band || !win) return;

    if (reduced) {
      gsap.from(win, {
        opacity: 0,
        duration: 0.7,
        scrollTrigger: { trigger: band, start: "top 78%" },
      });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: band, start: "top 72%" },
    });
    tl.fromTo(
      band,
      { clipPath: "inset(18% 8% 18% 8% round 2rem)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 2rem)",
        duration: 1.3,
        ease: "power3.inOut",
      },
      0,
    )
      .from(
        paint,
        {
          scale: 1.12,
          transformOrigin: "50% 0%",
          duration: 1.6,
          ease: "power2.out",
        },
        0,
      )
      .from(win, { y: 72, scale: 0.94, opacity: 0, duration: 1.1 }, 0.3)
      .from(eyebrow, { x: -14, opacity: 0, duration: 0.6 }, 0.75)
      .from(
        words,
        { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.055 },
        0.8,
      )
      .from(
        lead,
        { y: 14, opacity: 0, filter: "blur(10px)", duration: 0.9 },
        1.15,
      )
      .from(cta, { y: 10, opacity: 0, duration: 0.6 }, 1.35)
      .from(
        rules,
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.inOut",
          stagger: 0.07,
        },
        0.9,
      )
      .from(
        icons,
        {
          scale: 0,
          rotate: -35,
          transformOrigin: "center",
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: 0.07,
        },
        1.05,
      )
      .from(qs, { x: 22, opacity: 0, duration: 0.7, stagger: 0.07 }, 1.05)
      .from(
        pluses,
        {
          rotate: -90,
          scale: 0.4,
          opacity: 0,
          transformOrigin: "center",
          duration: 0.7,
          ease: "back.out(1.8)",
          stagger: 0.07,
        },
        1.15,
      );
  });

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const duration = reducedMotion() ? 0 : 0.4;

    if (open !== null && panels.current[open]) {
      gsap.to(panels.current[open], {
        height: 0,
        duration,
        ease: "power2.inOut",
      });
    }
    if (next !== null && panels.current[next]) {
      const panel = panels.current[next];
      gsap.fromTo(
        panel,
        { height: 0 },
        { height: "auto", duration, ease: "power2.inOut" },
      );
      /* the answer lands a beat after the row opens */
      gsap.fromTo(
        panel.firstElementChild,
        { opacity: 0, y: duration ? 6 : 0 },
        {
          opacity: 1,
          y: 0,
          duration: duration * 1.2,
          delay: duration * 0.3,
          ease: "power2.out",
        },
      );
    }
    setOpen(next);
  };

  return (
    <section
      ref={scope}
      id="faq"
      data-track="sight-faq"
      className="scroll-mt-24 pb-24 pt-16 md:pb-36 md:pt-24"
    >
      <div className="mx-auto w-[95%] max-w-[1280px]">
        {/* the painted field, with one app window on it */}
        {/* Phones drop the painting (a flat surface behind the window) and
            run a tighter corner. */}
        <div data-band className="relative overflow-hidden rounded-2xl bg-[var(--surface)] md:rounded-[2rem]">
          {/* the painting is portrait and the band is wide, so a single
              cover crop blows it up ~3×. Five copies at a fixed height,
              every other one mirrored, tile across with no seam. The
              height is fixed and the strip is pinned to the top, so opening an
              answer reveals more paint instead of rescaling it. */}
          <div
            className="absolute inset-0 hidden overflow-hidden bg-[#2b4a7a] md:block"
            aria-hidden="true"
          >
            <div
              data-paint
              className="absolute left-1/2 top-0 flex h-[1400px] -translate-x-1/2"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  src="/sight/abstract-blue-oil-painting.webp"
                  alt=""
                  width={1050}
                  height={1400}
                  sizes="1050px"
                  quality={85}
                  className={`h-full w-auto max-w-none shrink-0 ${i % 2 ? "-scale-x-100" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="relative z-10 flex justify-center px-3 py-6 md:px-10 md:py-16 lg:py-20">
            <div data-window className="w-full max-w-[1040px]">
              <AppPanel pad={false}>
                <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-14 lg:py-14">
                  {/* left: eyebrow, headline, and the lead at the foot */}
                  <div className="flex flex-col justify-between gap-10">
                    <div>
                      <p
                        data-eyebrow
                        className="text-[13px] font-medium"
                        style={{ color: T.MUTED }}
                      >
                        FAQ
                      </p>
                      {/* each word sits in its own clipped slot and rises into it */}
                      <h2
                        className="mt-5 max-w-[14ch] font-semibold leading-[1.04] tracking-[-0.03em] [text-wrap:balance]"
                        style={{
                          fontSize: "clamp(1.9rem, 3.4vw, 3rem)",
                          color: T.INK,
                        }}
                      >
                        {HEADLINE.map(([word, blue], i) => (
                          <span
                            key={i}
                            className="inline-block overflow-hidden align-bottom pb-[0.08em] pr-[0.25em] -mb-[0.08em]"
                          >
                            <span
                              data-word
                              className="inline-block"
                              style={blue ? { color: T.BLUE } : undefined}
                            >
                              {word}
                            </span>
                          </span>
                        ))}
                      </h2>
                    </div>
                    <div className="max-w-[24rem]">
                      <p
                        data-lead
                        className="text-[14.5px] leading-[1.65]"
                        style={{ color: T.MUTED }}
                      >
                        The same six, nearly every time. Open one and
                        here&rsquo;s how we answer it out loud. Something else?
                        Bring it to the call.
                      </p>
                      <div data-cta className="mt-5">
                        <Pill href={BOOK_URL} variant="primary" size="sm">
                          Book a demo
                        </Pill>
                      </div>
                    </div>
                  </div>

                  {/* right: the ruled list, one question per row. The rules
                      are drawn as their own spans so they can be drawn in. */}
                  <div className="relative">
                    {ITEMS.map(([question, answer], i) => {
                      const active = open === i;
                      return (
                        <div key={question} data-row className="relative">
                          <span
                            data-rule
                            className="absolute inset-x-0 top-0 h-px bg-[#d4d7de]"
                            aria-hidden="true"
                          />
                          <h3>
                            <button
                              onClick={() => toggle(i)}
                              aria-expanded={active}
                              aria-controls={`faq-panel-${i}`}
                              id={`faq-button-${i}`}
                              className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-5 py-5 text-left md:py-6"
                            >
                              <span data-icon style={{ color: T.INK }}>
                                <Icon
                                  d={ICONS[i]}
                                  className="h-5 w-5"
                                  strokeWidth={1.5}
                                />
                              </span>
                              <span
                                data-q
                                className="text-[15px] font-medium leading-snug md:text-[17px]"
                                style={{ color: T.INK }}
                              >
                                {question}
                              </span>
                              <span data-plus className="flex">
                                <PlusMinus active={active} />
                              </span>
                            </button>
                          </h3>
                          <div
                            id={`faq-panel-${i}`}
                            role="region"
                            aria-labelledby={`faq-button-${i}`}
                            ref={(el) => {
                              panels.current[i] = el;
                            }}
                            style={{
                              height: i === 0 ? "auto" : 0,
                              overflow: "hidden",
                            }}
                          >
                            <p
                              className="max-w-[36rem] pb-6 pl-[calc(1.25rem+1.25rem)] pr-10 text-[14.5px] leading-[1.7]"
                              style={{ color: T.MUTED }}
                            >
                              {answer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <span
                      data-rule
                      className="absolute inset-x-0 bottom-0 h-px bg-[#d4d7de]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </AppPanel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
