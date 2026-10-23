"use client";

/**
 * "What's it like working with us?" on /free-homepage-design (until Oct 22
 * 2026 "Hear it from the owners" under a Testimonials eyebrow): the title in
 * the top left corner, then the three owners' videos as 3:4 crops, side by side on
 * laptops and up and swiped sideways on tablets and phones (the arrows
 * went on Oct 22 2026: three videos don't need them). Each plays muted
 * while on screen. A "Tap for sound" pill in its top left corner (Oct 22
 * 2026, where it covers no face or caption), or a tap anywhere on the video,
 * plays it from the start with sound and quiets the others; the pill then
 * reads "Sound on" and mutes it again. Under the videos, the ink ArrowCta
 * "Get your free homepage sample" up to the quiz (Oct 22 2026).
 *
 * Motion comes from the page: the copy carries data-rise and the videos
 * data-card inside the section's data-reveal.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowCta from "@/components/ArrowCta";
import { TESTIMONIAL_VIDEOS } from "@/data/testimonials";
import { track } from "@/lib/track";
import s from "./OwnerVideos.module.css";

const VIDEOS = TESTIMONIAL_VIDEOS;

/** Each business's logo, before the owner's name (Oct 22 2026), so a real
    business shows behind the face. Flow State’s tile shows as a circle. */
const LOGOS: Record<string, { src: string; width: number; height: number; tile?: boolean }> = {
  "Ellen and Vien": { src: "/free-homepage-design/logos/afterparty.png", width: 84, height: 96 },
  "Paula Wilson": { src: "/free-homepage-design/logos/flow-state.webp", width: 96, height: 96, tile: true },
  "Taylor Paige": { src: "/free-homepage-design/logos/wrapcity.png", width: 312, height: 96 },
};

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

function Head() {
  return (
    <div className={s.head}>
      <h2 className={s.title} data-rise>
        What&rsquo;s it like working with us?
      </h2>
      <p className={s.sub} data-rise>
        The owners of Afterparty, Flow State Therapy and WrapCity on how it went and what changed for their business
        after.
      </p>
    </div>
  );
}

/** The three videos in a row, swiped sideways on smaller screens. */
function Band() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [loud, setLoud] = useState<number | null>(null);

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
    <div className={s.band} aria-label="Owner videos">
      {VIDEOS.map((v, i) => (
        <figure key={v.name} className={s.tile} data-card>
          <div className={s.frame}>
            <video
              ref={(el) => {
                refs.current[i] = el;
              }}
              src={v.video}
              data-video={v.name}
              poster={v.poster}
              style={{ objectPosition: v.position }}
              muted
              loop
              playsInline
              preload="metadata"
              className={s.media}
              aria-label={`Video from ${v.name}, ${v.role}`}
              onClick={() => toggle(i)}
            />
            <button
              type="button"
              className={s.sound}
              aria-pressed={loud === i}
              aria-label={loud === i ? `Mute ${v.name}` : `Unmute ${v.name}`}
              onClick={() => toggle(i)}
            >
              <SoundIcon on={loud === i} />
              <span aria-hidden>{loud === i ? "Sound on" : "Tap for sound"}</span>
            </button>
          </div>
          <figcaption className={s.caption}>
            {LOGOS[v.name] && (
              <Image
                src={LOGOS[v.name].src}
                alt=""
                width={LOGOS[v.name].width}
                height={LOGOS[v.name].height}
                className={`${s.logo} ${LOGOS[v.name].tile ? s.logoTile : ""}`}
              />
            )}
            <span className={s.who}>
              <strong>{v.name}</strong>
              {v.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** `container` is the page's width class. */
export default function OwnerVideos({ container = "" }: { container?: string }) {
  return (
    <section className={`${s.section} ${container}`} data-reveal data-section="owners">
      <div className={s.top}>
        <Head />
      </div>
      <Band />
      {/* After the videos, once they've heard from owners like them. */}
      <div className={s.cta} data-card>
        <ArrowCta href="#quiz">Get your free homepage sample</ArrowCta>
      </div>
    </section>
  );
}
