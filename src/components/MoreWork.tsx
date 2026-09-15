"use client";

/**
 * The bridge from the four featured works to the full list, above How Do We
 * Do It. Two rows of big type run through the middle in opposite directions,
 * every project's name in ink on top and what we do a tone lighter
 * underneath, and they take their
 * speed from the scroll: coast at rest, rush when you scroll, reverse when
 * you scroll back. Over the rows, a loose deck of the other project covers
 * fans out from a stack as the section arrives, drifts on its own, and tilts
 * toward the cursor. A hand note points at it. Then breathing room, one line
 * of copy, and the magnetic button to the work page.
 *
 * Reduced motion: the rows sit still, the deck is laid out fanned.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { projects } from "@/data/projects";
import { SUCCESS_STORIES } from "@/data/successStories";
import MagneticCta from "@/components/MagneticCta";
import s from "./MoreWork.module.css";

gsap.registerPlugin(ScrollTrigger);

const NAMES = projects.map((p) => p.name);
const CRAFT = [
  "Web design",
  "Development",
  "Branding",
  ...Array.from(new Set(projects.flatMap((p) => p.tags))),
];

/* Covers of the projects that are not already on a card above. */
const featured = new Set(SUCCESS_STORIES.map((story) => story.title));
const DECK = projects.filter((p) => !featured.has(p.name)).slice(0, 5);

/* Resting pose per card: x and y offsets as a share of the deck width, and a
   tilt. Written as a loose fan, heaviest in the middle. */
const POSES = [
  { x: -0.42, y: 0.08, r: -7 },
  { x: -0.2, y: -0.05, r: -3 },
  { x: 0, y: 0.02, r: 1 },
  { x: 0.21, y: -0.06, r: 4 },
  { x: 0.43, y: 0.07, r: 8 },
];

/* One full loop of a row at rest, in seconds, and the most a fast scroll can
   multiply that. */
const LOOP_SECONDS = 70;
const MAX_TIMESCALE = 2.2;

function Row({ words, light, reverse }: { words: string[]; light?: boolean; reverse?: boolean }) {
  const list = [...words, ...words];
  return (
    <div className={`${s.row} ${light ? s.rowLight : ""}`} data-row data-reverse={reverse || undefined}>
      <div className={s.track} data-track>
        {list.map((w, i) => (
          <span key={i} className={s.word} aria-hidden={i >= words.length || undefined}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MoreWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const deck = section.querySelector<HTMLElement>("[data-deck]");
      const note = section.querySelector<HTMLElement>("[data-note]");

      /* Rows: an endless slide, one row each way, whose speed follows the
         scroll velocity. */
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]").map((row) => {
        const track = row.querySelector<HTMLElement>("[data-track]")!;
        const reverse = row.dataset.reverse === "true";
        const tween = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: LOOP_SECONDS, ease: "none", repeat: -1 }
        );
        if (reduce) tween.pause();
        return tween;
      });

      if (!reduce) {
        let settle: gsap.core.Tween | null = null;
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // px/s of scroll, mapped to a speed multiplier; sign follows direction.
            const v = self.getVelocity();
            const scale = gsap.utils.clamp(-MAX_TIMESCALE, MAX_TIMESCALE, 1 + v / 900);
            const target = v < 0 ? Math.min(-1, scale) : Math.max(1, scale);
            settle?.kill();
            rows.forEach((t) => {
              gsap.to(t, { timeScale: target, duration: 0.2, overwrite: true });
            });
            // Then ease back to a forward coast.
            settle = gsap.to(rows, { timeScale: 1, duration: 1.4, ease: "power2.out", delay: 0.2 });
          },
        });
      }

      /* Deck: fans out from a stack as the section comes up, then floats. */
      if (deck && cards.length) {
        const w = () => deck.offsetWidth;
        cards.forEach((card, i) => {
          const pose = POSES[i] ?? POSES[2];
          gsap.set(card, { zIndex: i === 2 ? 3 : 2 - Math.abs(i - 2) });
          if (reduce) {
            gsap.set(card, { x: () => pose.x * w(), y: () => pose.y * w(), rotation: pose.r });
            return;
          }
          gsap.fromTo(
            card,
            { x: 0, y: 0, rotation: 0, scale: 0.86 },
            {
              x: () => pose.x * w(),
              y: () => pose.y * w(),
              rotation: pose.r,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.6, invalidateOnRefresh: true },
            }
          );
          // A slow independent bob so the deck never sits dead still.
          gsap.to(card.firstElementChild, {
            y: () => gsap.utils.random(-8, 8),
            rotation: () => gsap.utils.random(-1.5, 1.5),
            duration: () => gsap.utils.random(3, 4.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: i * 0.3,
          });
        });

        if (note && !reduce) {
          gsap.from(note, {
            opacity: 0,
            y: 12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 40%", once: true },
          });
        }

        /* Cursor tilt on the whole deck, on a fine pointer only. */
        if (finePointer && !reduce) {
          const rx = gsap.quickTo(deck, "rotationX", { duration: 0.9, ease: "power3.out" });
          const ry = gsap.quickTo(deck, "rotationY", { duration: 0.9, ease: "power3.out" });
          const onMove = (e: MouseEvent) => {
            const r = section.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry(px * 16);
            rx(-py * 12);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          section.addEventListener("mousemove", onMove);
          section.addEventListener("mouseleave", onLeave);
          return () => {
            section.removeEventListener("mousemove", onMove);
            section.removeEventListener("mouseleave", onLeave);
          };
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={s.wrap} aria-label="More of our work">
      <div className={s.stage}>
        <Row words={NAMES} />
        <Row words={CRAFT} light reverse />

        <div className={s.deck} data-deck aria-hidden>
          {DECK.map((p, i) => (
            <div key={p.id} className={s.card} data-card style={{ ["--i" as string]: i }}>
              <div className={s.cardInner}>
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 30vw, 14vw"
                  className={s.cardImg}
                  style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                />
              </div>
            </div>
          ))}
          <span className={s.note} data-note>
            and the rest of them
            <svg viewBox="0 0 64 40" className={s.noteArrow} aria-hidden>
              {/* Up and to the left, at the nearest card. */}
              <path
                d="M62 38C44 34 24 22 8 6M6 16 8 6l10 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className={s.foot}>
        <p className={s.copy}>
          Four is a taste. Every project here was drawn from scratch for the
          business behind it, and they all live on one page.
        </p>
        <MagneticCta href="/work">See all projects</MagneticCta>
      </div>
    </section>
  );
}
