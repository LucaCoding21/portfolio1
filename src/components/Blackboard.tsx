"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { SCRIBBLES, type Scribble } from "@/data/blackboardScribbles";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Reference palette. */
const PAPER = "#F8F2E8";
const CITRON = "#8b8d73";
const CHARCOAL = "#272727";
const EVERGREEN = "#2B2D2A";
const OFF_WHITE = "#fffefa";
const CHALK_MUTED = "#bec2a5";

/** Left column copy. PLACEHOLDER wording from the project board. */
const HEADLINE = "most agencies optimize for one thing.";
const BODY =
  "a beautiful website that doesn’t convert is decoration. a conversion-focused website that looks cheap hurts the brand. a technically great website with bad positioning still won’t sell.";

/**
 * Handwritten lines on the board, positioned in percent of the canvas like
 * the reference's text plates. Each wipes in left to right on the timeline.
 */
const LINES = [
  { key: "premise", text: "all three, together", left: 0, top: 0, size: 6.2, color: CHALK_MUTED, rotate: 0 },
  { key: "understand", text: "make them understand you", left: 25, top: 16, size: 8, color: OFF_WHITE, rotate: -2 },
  { key: "want", text: "make them want you", left: 31, top: 39, size: 8, color: OFF_WHITE, rotate: 1 },
  { key: "produce", text: "make it produce", left: 34, top: 60, size: 8, color: OFF_WHITE, rotate: -1 },
  { key: "result", text: "a site that sells", left: 22, top: 79, size: 8.5, color: OFF_WHITE, rotate: 0 },
];

function Mark({ s, className, mark }: { s: Scribble; className?: string; mark: string }) {
  return (
    <div data-mark={mark} className={`absolute ${className ?? ""}`}>
      <svg viewBox={s.viewBox} className="relative block w-full">
        {s.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.fill ?? "none"}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap="round"
            strokeMiterlimit={10}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Blackboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const board = boardRef.current;
    if (!section || !heading || !board) return;

    const ctx = gsap.context(() => {
      // Top rule draws left to right once the section is 200px into view.
      const rule = section.querySelector<HTMLElement>("[data-rule]");
      if (rule) {
        gsap.set(rule, { scaleX: 0 });
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom-=200px",
          once: true,
          onEnter: () => gsap.to(rule, { scaleX: 1, duration: 2, ease: "power2.out" }),
        });
      }

      // Headline rises in character by character behind its line clips.
      gsap.set(heading, { opacity: 0, visibility: "hidden" });
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.set(heading, { opacity: 1, visibility: "visible" });
        const split = new SplitText(heading, { type: "lines,chars" });
        split.lines.forEach((l) => ((l as HTMLElement).style.overflow = "hidden"));
        gsap.set(split.chars, { display: "inline-block" });
        gsap.fromTo(split.chars, { yPercent: 120 }, { yPercent: 0, duration: 1, stagger: 0.02, ease: "expo.out" });
      };
      ScrollTrigger.create({ trigger: section, start: "top bottom-=200px", end: "bottom top+=200px", onEnter: play, onEnterBack: play });

      // The board. Same choreography as the reference, with one extra plus.
      const q = (sel: string) => board.querySelector<HTMLElement>(sel);
      const qa = (sel: string) => Array.from(board.querySelectorAll<SVGPathElement>(sel));
      const lines = LINES.map((l) => q(`[data-line="${l.key}"]`)!);
      const arrow = qa('[data-mark="arrow"] path');
      const plus1 = qa('[data-mark="plus1"] path');
      const plus2 = qa('[data-mark="plus2"] path');
      const equals = qa('[data-mark="equals"] path');
      const underline = qa('[data-mark="underline"] path');

      gsap.set(board, { opacity: 0 });
      lines.forEach((l) => gsap.set(l, { clipPath: "inset(0 100% 0 0)", opacity: 1 }));
      [...arrow, ...underline].forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: underline.includes(p) ? len : -len, opacity: 0 });
      });
      gsap.set([...plus1, ...plus2, ...equals], { opacity: 0, scale: 0, transformOrigin: "center center" });

      const tl = gsap.timeline({ scrollTrigger: { trigger: board, start: "top 75%", once: true } });
      tl.to(board, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
      tl.to(lines[0], { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power1.inOut" }, 0);
      arrow.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, opacity: 1, duration: 0.5, ease: "power2.inOut" }, i === 0 ? 0.4 : "<0.1"));
      tl.to(lines[1], { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power1.inOut" }, 0.7);
      tl.to(plus1, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, 1.4);
      tl.to(lines[2], { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power1.inOut" }, 1.6);
      tl.to(plus2, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, 2.2);
      tl.to(lines[3], { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power1.inOut" }, 2.4);
      tl.to(equals, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)", stagger: 0.05 }, 3.0);
      tl.to(lines[4], { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power1.inOut" }, 3.2);
      underline.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }, i === 0 ? 4.0 : "<0.1"));
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="approach" className="relative w-full overflow-hidden lg:flex lg:justify-center" style={{ backgroundColor: PAPER }}>
      {/* Drawn top rule. */}
      <div data-rule aria-hidden className="absolute left-0 right-0 top-0 z-20 h-px origin-left" style={{ backgroundColor: CITRON }} />

      <div className="relative w-full">
        <div className="relative mx-auto grid w-full max-w-[1680px] grid-cols-4 gap-x-2 px-4 md:grid-cols-8 md:px-8 lg:grid-cols-12 lg:px-14">
          {/* Left: the claim. */}
          <div className="relative col-span-full py-10 md:py-12 lg:col-span-6 lg:py-[72px] lg:pr-[20%]">
            <p className="font-[family-name:var(--font-outfit)] text-[12px] font-bold uppercase leading-[1.4] tracking-[0.08em] md:text-[16px]" style={{ color: CHARCOAL }}>
              Approach
            </p>
            <h2
              ref={headingRef}
              className="mb-6 mt-3 font-[family-name:var(--font-outfit)] text-[38px] font-light leading-[1.2] md:mb-8 md:mt-4 md:text-[56px] lg:text-[38px] xl:text-[56px]"
              style={{ color: CHARCOAL }}
            >
              {HEADLINE}
            </h2>
            <p className="font-[family-name:var(--font-outfit)] text-[22px] font-light leading-[1.3] md:text-[28px] lg:text-[21px] xl:text-[28px]" style={{ color: CHARCOAL }}>
              {BODY}
            </p>
          </div>

          {/* Right: the board. Its ground bleeds to the viewport edge. */}
          <div className="relative col-span-full py-10 lg:col-span-6 lg:pb-12 lg:pl-14 lg:pt-16">
            <div aria-hidden className="absolute inset-y-0 left-[-16px] w-[calc(100%+32px)] md:left-[-32px] md:w-[calc(100%+64px)] lg:left-0 lg:w-[50vw]" style={{ backgroundColor: EVERGREEN }} />
            <h2 className="relative z-10 font-[family-name:var(--font-outfit)] text-[32px] font-light leading-[1.2] md:text-[40px]" style={{ color: OFF_WHITE }}>
              the cloverfield formula
            </h2>

            <div
              ref={boardRef}
              className="relative mt-2 aspect-[1056/1172] w-full overflow-hidden lg:aspect-[1606/1510] lg:w-[90%] [container-type:inline-size]"
            >
              {LINES.map((l) => (
                <p
                  key={l.key}
                  data-line={l.key}
                  className="absolute m-0 whitespace-nowrap font-[family-name:var(--font-reenie)] leading-[0.9]"
                  style={{ left: `${l.left}%`, top: `${l.top}%`, fontSize: `${l.size}cqw`, color: l.color, transform: `rotate(${l.rotate}deg)` }}
                >
                  {l.text}
                </p>
              ))}

              <Mark mark="arrow" s={SCRIBBLES.arrow} className="left-[2%] top-[13%] w-[13%] rotate-[37deg] md:top-[10%] lg:left-[10%] lg:top-[12.25%] lg:rotate-0" />
              <Mark mark="plus1" s={SCRIBBLES.plus} className="left-[50%] top-[31%] w-[3.75%] lg:left-[61%]" />
              <Mark mark="plus2" s={SCRIBBLES.plus} className="left-[50%] top-[52%] w-[3.75%] lg:left-[61%]" />
              <Mark mark="equals" s={SCRIBBLES.equals} className="left-[50%] top-[73%] w-[4.5%] lg:left-[59%]" />
              <Mark mark="underline" s={SCRIBBLES.underline} className="left-[10%] top-[92%] w-[80%] lg:left-[34%] lg:top-[91.25%] lg:w-[54%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
