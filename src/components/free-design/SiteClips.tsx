"use client";

/**
 * The dark band's work (Oct 22 2026, was three clips beside a note): the
 * band's heading (passed in), then after a wide gap the note on the right
 * ("Sites we've designed" and the outline ArrowCta "Get your free homepage
 * sample" up to the quiz, worded so by request), then
 * seven site clips in a row that scrolls sideways, three and a bit on
 * screen, with the arrows under it, so a doubter can keep going and see
 * every site is this good. Each clip is its /work reel with the site's result under it, read
 * from the work strip's SITES so the figures match; only sites with a
 * result are here. A clip plays while it is on screen (the row's edges
 * count) and rests when it is not. Arrows and row as in OwnerVideos.
 */

import { useEffect, useRef, useState } from "react";
import ArrowCta from "@/components/ArrowCta";
import { SITES } from "./WorkStrip";
import s from "./SiteClips.module.css";

/** `file` finds the site's result in SITES; `start` skips an opening and
    loops from there. Posters are each reel's frame at `start`. */
const CLIPS = [
  {
    name: "Northwest Railing",
    file: "northwest-railing",
    video: "/success/northwest-railing.mp4",
    poster: "/free-homepage-design/clips/northwest-railing.jpg",
    label: "Northwest Railing website, scrolling through the home page",
  },
  {
    name: "Southbound Sips",
    file: "southbound-sips",
    video: "/success/southboundsips.mp4",
    poster: "/free-homepage-design/clips/southbound-sips.jpg",
    label: "Southbound Sips website, scrolling through the home page",
  },
  {
    name: "ACE",
    file: "ace-cut",
    // The /work reel with 4.55s to 0:11 cut out (Oct 22 2026, by request):
    // no "Every Frame Tells a Story" hero, straight to the gallery.
    video: "/success/ace-work-v3.mp4",
    poster: "/free-homepage-design/clips/ace.jpg",
    label: "ACE photography website, scrolling through the portfolio",
    start: 2.5,
  },
  {
    name: "Innovative Aluminum",
    file: "innovative-aluminum",
    video: "/success/innovative-aluminum-work.mp4",
    poster: "/free-homepage-design/clips/innovative-aluminum.jpg",
    label: "Innovative Aluminum website, scrolling through the home page",
  },
  {
    name: "WrapCity",
    file: "wrapcity",
    video: "/success/wrapcity.mp4",
    poster: "/free-homepage-design/clips/wrapcity.jpg",
    label: "WrapCity website, showing the before and after gallery",
  },
  {
    name: "Caddie Companion",
    file: "caddie-companion",
    video: "/success/caddie-companion-work.mp4",
    poster: "/free-homepage-design/clips/caddie-companion.jpg",
    label: "Caddie Companion online store, showing the product page",
    start: 6,
  },
  {
    name: "Nancy Tran",
    file: "nancy-tran",
    video: "/success/nancy-tran.mp4",
    poster: "/free-homepage-design/clips/nancy-tran.jpg",
    label: "Nancy Tran realtor website, scrolling through the home page",
  },
];

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
      style={back ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A site clip: muted, looping, and only playing while on screen. */
function Clip({ clip }: { clip: (typeof CLIPS)[number] }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const stat = SITES.find((site) => site.file === clip.file)?.stat;

  const fromStart = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (clip.start) e.currentTarget.currentTime = clip.start;
  };

  return (
    <figure className={s.clip}>
      <video
        ref={ref}
        poster={clip.poster}
        muted
        playsInline
        loop={!clip.start}
        preload="none"
        aria-label={clip.label}
        className={s.video}
        onLoadedMetadata={fromStart}
        onEnded={(e) => {
          fromStart(e);
          e.currentTarget.play().catch(() => {});
        }}
      >
        {/* Phones get the same cut at 720px and 30fps (public/success/phone,
            about a fifth of the size): the clip shows about 300px wide. */}
        <source src={clip.video.replace("/success/", "/success/phone/")} media="(max-width: 640px)" type="video/mp4" />
        <source src={clip.video} type="video/mp4" />
      </video>
      <figcaption className={s.name}>
        {clip.name}
        {stat && (
          <span className={s.stat}>
            {stat.lead && `${stat.lead} `}
            <span className={s.figure}>{stat.figure}</span>
            {stat.rest && ` ${stat.rest}`}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/** `children` is the band's heading, above everything else. */
export default function SiteClips({ children }: { children: React.ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
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

  // One clip's width (plus the gap) per press.
  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    const clip = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !clip) return;
    rail.scrollBy({ left: dir * (clip.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <div className={s.work}>
      {children}
      <div className={s.lower}>
        <div className={s.note} data-rise>
          <p className={s.noteTitle}>Sites we&rsquo;ve designed</p>
          <p className={s.noteBody}>Each one started with the same homework yours will.</p>
          <ArrowCta href="#quiz" outline className={s.cta}>
            Get your free homepage sample
          </ArrowCta>
        </div>
        <div className={s.row}>
          {/* The row rises in as one (data-card here, not on each clip):
              a clip moved inside a scroll box overflows it and makes it
              scroll up and down under the mouse until the rise ends. */}
          <div
            ref={railRef}
            className={s.rail}
            tabIndex={0}
            role="region"
            aria-label="Sites we've designed, scroll sideways"
            data-card
          >
            {CLIPS.map((clip) => (
              <Clip key={clip.name} clip={clip} />
            ))}
          </div>
          <div className={s.arrows}>
            <button
              type="button"
              className={s.arrow}
              aria-label="Previous sites"
              disabled={edge.start}
              onClick={() => step(-1)}
            >
              <Arrow back />
            </button>
            <button type="button" className={s.arrow} aria-label="More sites" disabled={edge.end} onClick={() => step(1)}>
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
