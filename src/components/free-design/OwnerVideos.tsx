"use client";

/**
 * "Hear it from the owners" on /free-homepage-design: the title in the top
 * left corner with arrow buttons on the right, then the three owners'
 * videos as 3:4 crops in a row that scrolls sideways by hand (swipe,
 * trackpad or the arrows), wider than the page. Each plays muted while on
 * screen; its sound button plays it from the start with sound and quiets
 * the others.
 *
 * Motion comes from the page: the copy carries data-rise and the videos
 * data-card inside the section's data-reveal.
 */

import { useEffect, useRef, useState } from "react";
import { TESTIMONIAL_VIDEOS } from "@/data/testimonials";
import { track } from "@/lib/track";
import s from "./OwnerVideos.module.css";

const VIDEOS = TESTIMONIAL_VIDEOS;

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
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

function Arrow({ back }: { back?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        d={back ? "M19 12H5M11 18l-6-6 6-6" : "M5 12h14M13 6l6 6-6 6"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Head() {
  return (
    <div className={s.head}>
      <p className={s.eyebrow} data-rise>
        Testimonials
      </p>
      <h2 className={s.title} data-rise>
        Hear it from the owners.
      </h2>
      <p className={s.sub} data-rise>
        Real clients sharing, in their own words, what it was like to work with us and what changed after their site
        went live.
      </p>
    </div>
  );
}

/** The three videos in a sideways-scrolling row, with arrows to step it. */
function Band() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const [loud, setLoud] = useState<number | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  // Which ends the row has reached, for the arrows' disabled states.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () =>
      setEdge({
        start: rail.scrollLeft <= 2,
        end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
      });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // One card's width (plus the gap) per press.
  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    rail.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  // Each video runs muted while on screen, and rests when it is not.
  useEffect(() => {
    const videos = refs.current.filter(Boolean) as HTMLVideoElement[];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.3 },
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const toggle = (i: number) => {
    const next = loud === i ? null : i;
    refs.current.forEach((v, j) => {
      if (!v) return;
      v.muted = j !== next;
      if (j === next) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
    setLoud(next);
    if (next !== null) track("video_unmute", { video: VIDEOS[next].name, placement: "free_design" });
  };

  return (
    <>
      <div className={s.arrows}>
        <button
          type="button"
          className={s.arrow}
          aria-label="Previous video"
          disabled={edge.start}
          onClick={() => step(-1)}
        >
          <Arrow back />
        </button>
        <button type="button" className={s.arrow} aria-label="Next video" disabled={edge.end} onClick={() => step(1)}>
          <Arrow />
        </button>
      </div>
      <div ref={railRef} className={s.band} tabIndex={0} aria-label="Owner videos, scroll sideways">
        {VIDEOS.map((v, i) => (
          <figure key={v.name} className={s.tile} data-card>
            <div className={s.frame}>
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                src={v.video}
                poster={v.poster}
                style={{ objectPosition: v.position }}
                muted
                loop
                playsInline
                preload="metadata"
                className={s.media}
                aria-label={`Video from ${v.name}, ${v.role}`}
              />
              <button
                type="button"
                className={s.sound}
                aria-pressed={loud === i}
                aria-label={loud === i ? `Mute ${v.name}` : `Unmute ${v.name}`}
                onClick={() => toggle(i)}
              >
                <SoundIcon on={loud === i} />
              </button>
            </div>
            <figcaption className={s.caption}>
              <strong>{v.name}</strong>
              {v.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

/** `container` is the page's width class. */
export default function OwnerVideos({ container = "" }: { container?: string }) {
  return (
    <section className={`${s.section} ${container}`} data-reveal>
      <div className={s.top}>
        <Head />
      </div>
      <Band />
    </section>
  );
}
