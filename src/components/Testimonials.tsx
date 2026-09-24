"use client";

/**
 * Testimonials, all on show at once: copy on the left, three portrait cards
 * side by side on the right, the same language as the prints in More Work.
 * The first two are client videos; every reel plays muted while the row is
 * on screen, and the sound button on a card unmutes that one from the start
 * and quiets the other. The third card cycles through the written quotes.
 *
 * PLACEHOLDER: section copy is a first pass. Videos and quotes are real.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TESTIMONIAL_QUOTES, TESTIMONIAL_VIDEOS } from "@/data/testimonials";
import s from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

const REELS = TESTIMONIAL_VIDEOS;

/* How long each written quote stays up before the next. */
const QUOTE_MS = 7000;

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <path d="m16 9 5 6M21 9l-5 6" />
      )}
    </svg>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === "left" ? <path d="M10 3.5 5.5 8l4.5 4.5" /> : <path d="M6 3.5 10.5 8 6 12.5" />}
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

/* Written quotes, one at a time in a reel-shaped card. Advances on a timer
   while on screen, holds while hovered or focused; the dots jump and the arrows step. */
function QuoteCard() {
  const ref = useRef<HTMLLIElement>(null);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (held || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % TESTIMONIAL_QUOTES.length), QUOTE_MS);
    return () => window.clearTimeout(id);
  }, [i, held, visible]);

  const t = TESTIMONIAL_QUOTES[i];
  const n = TESTIMONIAL_QUOTES.length;
  const step = (d: number) => setI((c) => (c + d + n) % n);

  return (
    <li
      ref={ref}
      className={`${s.card} ${s.quoteCard}`}
      data-card
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <figure key={i} className={s.quoteBody} aria-live="polite">
        {t.stat && (
          <div className={s.stat}>
            <span className={s.statValue}>{t.stat.value}</span>
            <span className={s.statLabel}>{t.stat.label}</span>
          </div>
        )}
        <blockquote className={s.quote}>
          <p>&ldquo;{t.quote}&rdquo;</p>
        </blockquote>
        <figcaption className={s.who}>
          {t.avatar ? (
            <Image src={t.avatar} alt="" width={40} height={40} className={s.avatar} />
          ) : (
            <span className={s.avatar} aria-hidden>
              {initials(t.name)}
            </span>
          )}
          <span>
            <span className={s.whoName}>{t.name}</span>
            <span className={s.whoRole}>{t.role}</span>
          </span>
        </figcaption>
      </figure>
      <div className={s.controls}>
        <div className={s.dots}>
          {TESTIMONIAL_QUOTES.map((q, n) => (
            <button
              key={q.name}
              type="button"
              className={s.dot}
              aria-label={`Quote from ${q.name}`}
              aria-current={n === i}
              onClick={() => setI(n)}
            />
          ))}
        </div>
        <div className={s.arrows}>
          <button type="button" className={s.arrow} aria-label="Previous quote" onClick={() => step(-1)}>
            <ArrowIcon dir="left" />
          </button>
          <button type="button" className={s.arrow} aria-label="Next quote" onClick={() => step(1)}>
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [loud, setLoud] = useState<number | null>(null);

  /* Reels run while the row is on screen, and rest when it is not. */
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.3 }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  /* Entry: copy rises, then the three cards come up one after another. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-rise]"), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
      gsap.from(section.querySelectorAll("[data-card]"), {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const toggleSound = (i: number) => {
    const next = loud === i ? null : i;
    videoRefs.current.forEach((v, j) => {
      if (!v) return;
      const on = j === next;
      v.muted = !on;
      if (on) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
    setLoud(next);
  };

  return (
    <section ref={sectionRef} className={s.wrap} aria-label="Testimonials">
      <div className={s.inner}>
        <div className={s.copy}>
          <p className={s.eyebrow} data-rise>
            Testimonials
          </p>
          <h2 className={s.title} data-rise>
            They said it better than we could.
          </h2>
          <p className={s.body} data-rise>
            These are some of the owners we&apos;ve worked with, sharing in their
            own words what it was like to work with us and what changed after
            their site went live.
          </p>
        </div>

        <ul className={s.row}>
          {REELS.map((r, i) => (
            <li key={r.name} className={s.card} data-card>
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={r.video}
                poster={r.poster}
                muted
                loop
                playsInline
                preload="metadata"
                className={s.video}
                style={{ objectPosition: r.position }}
                aria-label={`${r.name}, ${r.role}`}
              />
              <div className={s.scrim} />
              <button
                type="button"
                className={s.sound}
                aria-pressed={loud === i}
                aria-label={loud === i ? `Mute ${r.name}` : `Unmute ${r.name}`}
                onClick={() => toggleSound(i)}
              >
                <SoundIcon on={loud === i} />
              </button>
              <div className={s.meta}>
                <p className={s.metaName}>{r.name}</p>
                <p className={s.metaRole}>{r.role}</p>
              </div>
            </li>
          ))}
          <QuoteCard />
        </ul>
      </div>
    </section>
  );
}
