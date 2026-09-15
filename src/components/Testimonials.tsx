"use client";

/**
 * Video testimonials, all on show at once: copy on the left, three portrait
 * reels side by side on the right, the same language as the prints in More
 * Work. Every reel plays muted while the row is on screen; the sound button
 * on a card unmutes that one from the start and quiets the others.
 *
 * PLACEHOLDER: copy is a first pass, and the reels are the Innovative
 * Aluminum dealer testimonials standing in until we have our own.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

const REELS = [
  {
    name: "Gabrial Winkler",
    role: "Founder, N.W. Railings",
    video: "/testimonials/gabrial-winkler.mp4",
    poster: "/testimonials/gabrial-winkler-poster.jpg",
    position: "center 30%",
  },
  {
    name: "Tom Wright",
    role: "Founder, Tuff Deck Lofts and Railings",
    video: "/testimonials/tom-wright.mp4",
    poster: "/testimonials/tom-wright-poster.jpg",
    position: "center 30%",
  },
  {
    name: "Maegan Kimball",
    role: "Sales Administration Coordinator, Modern",
    video: "/testimonials/maegan-kimball.mp4",
    poster: "/testimonials/maegan-kimball-poster.jpg",
    position: "center 60%",
  },
];

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
            The people behind the businesses we build for, on camera, in their
            own words. No scripts, no studio, just what changed once the site
            went live.
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
        </ul>
      </div>
    </section>
  );
}
