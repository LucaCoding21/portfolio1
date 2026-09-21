"use client";

/**
 * A peek at the video testimonials: copy on the left, three portrait reels on
 * the right. The reels autoplay muted while on screen; the sound button on a
 * card unmutes that one from the top and quiets the others.
 *
 * This section is the curtain over Our Approach, which starts a viewport
 * early behind it, so it carries the rounded bottom edge and a stacking level.
 *
 * PLACEHOLDER: copy is a first pass. The reels are the Innovative Aluminum
 * dealer testimonials, straight from that project.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./TestimonialPeek.module.css";

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

export default function TestimonialPeek() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [loud, setLoud] = useState<number | null>(null);

  /* play while on screen, pause off it */
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
      { threshold: 0.35 }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  /* entry: copy rises, cards stagger up */
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
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
      gsap.from(section.querySelectorAll(`.${s.card}`), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
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
          <div data-rise>
            <Link href="/work" className={s.link}>
              See the work
              <span aria-hidden className={s.linkArrow}>
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <ul className={s.cards}>
          {REELS.map((reel, i) => (
            <li key={reel.name} className={s.card}>
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={reel.video}
                poster={reel.poster}
                muted
                loop
                playsInline
                preload="metadata"
                className={s.video}
                style={{ objectPosition: reel.position }}
                aria-label={`${reel.name}, ${reel.role}`}
              />
              <button
                type="button"
                className={`${s.sound} ${loud === i ? s.isLoud : ""}`}
                aria-pressed={loud === i}
                aria-label={loud === i ? `Mute ${reel.name}` : `Unmute ${reel.name}`}
                onClick={() => toggleSound(i)}
              >
                <SoundIcon on={loud === i} />
              </button>
              <div className={s.scrim} />
              <div className={s.meta}>
                <p className={s.name}>{reel.name}</p>
                <p className={s.role}>{reel.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
