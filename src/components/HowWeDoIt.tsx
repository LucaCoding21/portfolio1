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
 * Phones skip the curtain and run the section in normal flow (see the
 * stylesheet).
 *
 * Top left, the question in oversized grotesque, its first line spread edge
 * to edge of its own column and the shorter lines flush left. Under it the
 * journey: one row per phase with a hairline above, the phase name on the
 * left, what happens in the middle, and a reel on the right. Rows rise in as
 * they arrive, the body copy line by line out of a mask (SplitText, re-split
 * on resize and once fonts land); reels only play while on screen.
 *
 * Each phase has its own reel in public/ (approach-<phase>.mp4 with a jpg
 * poster).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import s from "./HowWeDoIt.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const LINES = [
  ["How", "do", "we"],
  ["actually"],
  ["do", "it?"],
];

/** `note` is microcopy under the title; an array stacks one line per entry. */
const PHASES: { name: string; body: string; note?: string | string[]; video: string; poster: string }[] = [
  {
    name: "Kickoff",
    body: "We start with one focused call to understand your business, your customers, and what the new site needs to do. From there, we take the lead.",
    // Small line under the body: the owner's time cost, stated up front.
    note: "About 45 minutes of your time.",
    video: "/approach-kickoff.mp4",
    poster: "/approach-kickoff-poster.jpg",
  },
  {
    name: "Research",
    body: "We get deep into your industry before we touch the design. We study your competitors, your customers, and what actually influences someone to choose you, so every decision has a reason behind it.",
    video: "/approach-research.mp4",
    poster: "/approach-research-poster.jpg",
  },
  {
    name: "Design",
    body: "We turn the strategy into the site. With the direction clear, we design the full website around what your customers need to understand, trust and act on. You see exactly how it looks and works before we build anything.",
    note: "Full design ready for review in ~1–2 weeks",
    video: "/approach-design.mp4",
    poster: "/approach-design-poster.jpg",
  },
  {
    name: "Build & Launch",
    body: "Once the design is approved, we take it from there. We build the full site, test everything across devices, handle the technical details, and get it live. You review the finished site, give us the green light, and we handle the rest.",
    note: "Usually live in ~2–3 weeks",
    video: "/approach-build.mp4",
    poster: "/approach-build-poster.jpg",
  },
];

function Headline() {
  return (
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
  );
}

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

        // The body: each line rises out of its own mask, one after the
        // other. autoSplit re-splits when the fonts land or the width
        // changes, and the tween returned from onSplit is rebuilt with it.
        const body = row.querySelector<HTMLElement>("[data-lines]");
        if (body) {
          SplitText.create(body, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.07,
                scrollTrigger: { trigger: row, start: "top 85%", once: true },
              }),
          });
        }
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
        <Headline />

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
                {/* Microcopy under the title, inside the head column so the
                    row's three-column grid is untouched. */}
                {phase.note && (
                  <span className={s.note} data-rise>
                    {(Array.isArray(phase.note) ? phase.note : [phase.note]).map((line, j) => (
                      <span key={line}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <p className={s.body} data-lines>
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
