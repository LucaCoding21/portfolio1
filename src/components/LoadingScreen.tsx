"use client";

/**
 * Intro loader: the plate bloom. About 1.3s from first paint to the hero.
 *
 * 1. "Cloverfield" rises in on the paper, then parts in the middle.
 * 2. The hero reel appears in the gap as a small rounded plate, already
 *    playing.
 * 3. The same plate goes fixed, blooms to fill the viewport while the two
 *    halves of the word slide off, and the paper fades out onto the real
 *    hero underneath. Just before the fade the hero is told the reel's
 *    current time (see LassieHero), so its own video picks up on the same
 *    frame and the swap is invisible.
 *
 * The bloom waits for the reel to be playable (or 2s, whichever is first)
 * so the plate never grows onto an empty frame; the poster sits behind the
 * video as a fallback. Reduced motion: a short fade. HomeClient only
 * mounts this once per session.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./LoadingScreen.module.css";

const POSTER = "/lassie-hero-poster.jpg";
const REEL = "/lassie-hero.mp4";
export const LOADER_HANDOFF_EVENT = "lassie:loader-video";
const MEDIA_TIMEOUT_MS = 2000;
const WORD_IN = 0.4;
const GAP_AT = 0.25;
const GAP_IN = 0.35;
const BLOOM_AT = 0.6;
const BLOOM = 0.75;
const EASE_IN_OUT = "expo.inOut";
const EASE_OUT = "expo.out";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const gapRef = useRef<HTMLSpanElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(onLoadingComplete);

  useEffect(() => {
    doneRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const gap = gapRef.current;
    const plate = plateRef.current;
    const video = videoRef.current;
    if (!root || !left || !right || !gap || !plate || !video) return;

    let disposed = false;
    const finish = () => {
      if (!disposed) doneRef.current();
    };

    // The reel can start; the hero's own <video> shares the cache entry.
    const mediaReady = new Promise<void>((resolve) => {
      if (video.readyState >= 3) return resolve();
      video.addEventListener("canplay", () => resolve(), { once: true });
      video.addEventListener("error", () => resolve(), { once: true });
      window.setTimeout(resolve, MEDIA_TIMEOUT_MS);
    });
    video.play().catch(() => {});

    // Tell the hero where the reel is so its video continues on the same frame.
    const handoff = () => {
      window.dispatchEvent(new CustomEvent(LOADER_HANDOFF_EVENT, { detail: { time: video.currentTime } }));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([left, right], { autoAlpha: 1 });
      mediaReady.then(() => {
        if (disposed) return;
        handoff();
        gsap.to(root, { autoAlpha: 0, duration: 0.4, ease: "power2.out", delay: 0.3, onComplete: finish });
      });
      return () => {
        disposed = true;
      };
    }

    const vw = () => root.clientWidth;
    const gapWidth = () => Math.min(vw() * 0.14, 260);

    gsap.set([left, right], { autoAlpha: 0, y: 12 });
    gsap.set(gap, { width: 0 });

    // Part one runs at once: the word rises and opens.
    const intro = gsap.timeline();
    intro
      .to([left, right], { autoAlpha: 1, y: 0, duration: WORD_IN, ease: EASE_OUT }, 0)
      .to(gap, { width: gapWidth, duration: GAP_IN, ease: EASE_OUT }, GAP_AT);

    // Part two waits for the poster and for the word to have opened.
    const openAt = new Promise<void>((resolve) => {
      window.setTimeout(resolve, BLOOM_AT * 1000);
    });
    let bloom: gsap.core.Timeline | null = null;

    Promise.all([mediaReady, openAt]).then(() => {
      if (disposed) return;
      const R = root.getBoundingClientRect();
      const P = plate.getBoundingClientRect();
      // Same element, so the reel keeps playing: pin it where it sits, then grow.
      gsap.set(plate, {
        position: "fixed",
        left: P.left - R.left,
        top: P.top - R.top,
        width: P.width,
        height: P.height,
        borderRadius: getComputedStyle(plate).borderRadius,
        zIndex: 2,
      });

      bloom = gsap.timeline({ onComplete: finish });
      bloom
        .to(plate, { left: 0, top: 0, width: R.width, height: R.height, borderRadius: 0, duration: BLOOM, ease: EASE_IN_OUT }, 0)
        .to(left, { x: -vw() * 0.6, autoAlpha: 0, duration: BLOOM * 0.8, ease: EASE_IN_OUT }, 0)
        .to(right, { x: vw() * 0.6, autoAlpha: 0, duration: BLOOM * 0.8, ease: EASE_IN_OUT }, 0)
        .to(root, { backgroundColor: "rgba(249, 248, 245, 0)", duration: 0.3, ease: "power1.out" }, BLOOM * 0.6)
        .call(handoff, [], BLOOM - 0.2)
        .to(root, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, BLOOM - 0.05);
    });

    return () => {
      disposed = true;
      intro.kill();
      bloom?.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={s.root} aria-hidden="true">
      <div className={s.word}>
        <span ref={leftRef} className={s.half}>
          Clover
        </span>
        <span ref={gapRef} className={s.gap}>
          <span ref={plateRef} className={s.plate}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTER} alt="" className={s.media} decoding="async" />
            <video
              ref={videoRef}
              src={REEL}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              className={`${s.media} ${s.video}`}
            />
          </span>
        </span>
        <span ref={rightRef} className={s.half}>
          field
        </span>
      </div>
    </div>
  );
}
