"use client";

/**
 * How we do it: the question, then the project journey. Revealed from under
 * More Work, which scrolls off like a rounded card while this section holds
 * at the top of the viewport; once the card has cleared, the section scrolls
 * on normally and the dark block below follows straight after it.
 *
 * The stage starts one viewport early, tucked behind the card, and carries a
 * trailing viewport of run (a sticky child only holds inside its parent's
 * content box) that the section itself ends up covering once it lets go.
 *
 * Top left, the question in oversized grotesque, its first line spread edge
 * to edge of its own column and the shorter lines flush left. Under it the
 * journey: one row per phase with a hairline above, the phase name on the
 * left, what happens in the middle, and a reel on the right. Rows rise in as
 * they arrive; reels only play while on screen.
 *
 * PLACEHOLDER: the reels are the project reels standing in until each phase
 * has its own footage.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./HowWeDoIt.module.css";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  ["How", "do", "we"],
  ["actually"],
  ["do", "it?"],
];

const PHASES = [
  {
    name: "Research",
    body: "We study your market, your competitors and the people you want to reach before we design anything, so every decision has a reason behind it.",
    video: "/success/transforming-landscapes.mp4",
    poster: "/success/transforming-landscapes.webp",
  },
  {
    name: "Kickoff",
    body: "One call to lock how it looks and what it has to do. You leave with a direction, a scope and a date.",
    video: "/success/ace.mp4",
    poster: "/success/ace.webp",
  },
  {
    name: "Design",
    body: "Drawn from scratch around your business. Every section earns the next scroll, and you see it move before we build it.",
    video: "/success/caddie-companion.mp4",
    poster: "/success/caddie-companion.webp",
  },
  {
    name: "Build and launch",
    body: "Built in Next.js and GSAP, tested on real phones, and launched with a 95+ speed score on nearly every site.",
    video: "/success/innovative-aluminum.mp4",
    poster: "/success/innovative-aluminum.webp",
  },
  {
    name: "Post-launch support",
    body: "Once you're live the whole site is on us: hosting, updates, fixes and the small changes that come up in the first months.",
    video: "/success/transforming-landscapes.mp4",
    poster: "/success/transforming-landscapes.webp",
  },
];

export default function HowWeDoIt() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Reels run only while they are on screen. */
    const reels = Array.from(section.querySelectorAll<HTMLVideoElement>("video"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { rootMargin: "10% 0px" }
    );
    reels.forEach((v) => io.observe(v));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => io.disconnect();
    }

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
        tl.from(row, { "--rule": 0, duration: 1, ease: "power3.out" }, 0);
        tl.from(
          row.querySelectorAll("[data-rise]"),
          { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          0.1
        );
        tl.from(row.querySelector("[data-reel]"), { scale: 1.06, duration: 1.4, ease: "power3.out" }, 0);
      });
    }, section);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.stage}>
      <section ref={sectionRef} id="how-we-do-it" className={s.wrap} aria-label="How we do it">
        <h2 className={s.headline}>
          {LINES.map((words, i) => (
            <span key={i} className={`${s.line} ${i === 0 ? s.spread : ""}`}>
              {words.map((word, j) => (
                <span key={j} className={s.word}>
                  {word}
                  {/* Real spaces so the text reads as a sentence when copied or read aloud. */}
                  {j < words.length - 1 ? " " : ""}
                </span>
              ))}
              {i < LINES.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <ol className={s.rows} aria-label="Project journey">
          {PHASES.map((phase, i) => (
            <li key={phase.name} className={s.row} data-row>
              <div className={s.head}>
                <span className={s.index} data-rise>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={s.name} data-rise>
                  {phase.name}
                </h3>
              </div>
              <p className={s.body} data-rise>
                {phase.body}
              </p>
              <div className={s.reel}>
                <video
                  data-reel
                  src={phase.video}
                  poster={phase.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
