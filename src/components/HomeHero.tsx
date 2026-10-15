"use client";

/**
 * Hero cloned from a reference site, running on our hero reel. Once you scroll 100px
 * the media plate shrinks in from the edges (inset 32px, 64px corners on
 * desktop; 16px / 24px below) over 1s on their ease-out-quint. The reference
 * animates clip-path; we animate transform only (see the zoom effect) so the
 * move is compositor-driven and stays smooth on a cold load. While the hero
 * is on screen the nav runs dark.
 *
 * Entrance (calebwu.ca's build): as the loader hands over, everything starts
 * at once with small offsets, all dropping into place like the nav: the
 * headline comes down a word at a time on his ease, the italic line lands
 * with a small spring, the subline drops 14px and the task row drops in,
 * all inside ~0.35s, with the nav sliding down on the same beat
 * (INTRO_EVENT). The scrim behind the copy eases in from clear over 1.4s
 * underneath it all, so the shade never snaps on. It runs as CSS keyframes
 * (data-intro, see the stylesheet), which play on the compositor: the page
 * is busiest exactly at the handoff (every section measures itself for its
 * scroll triggers), and a script-driven entrance dropped frames there.
 *
 * Layout, sizes, overlay and review field are 1:1 from the "Cloverfield
 * Hero + Lead Form" design (option A, Oct 2026): the 1440px artboard on
 * desktop, the 390px one on phones, where the copy sits at the bottom. The
 * free site review (HeroReview) sits under the subline. The design's win
 * ticker and the old Sight card are gone. The hero is at least a screen tall
 * and grows if the review card needs the room.
 */

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HeroReview, { type HeroPreview } from "./HeroReview";
import { LOADER_HANDOFF_EVENT, MOBILE_MEDIA, POSTER, POSTER_MOBILE, REEL, REEL_MOBILE } from "./LoadingScreen";
import { INTRO_EVENT } from "@/lib/intro";
import s from "./HomeHero.module.css";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ["We make websites", "that bring in customers."];

export default function HomeHero({ ready, preview }: { ready: boolean; preview?: HeroPreview }) {
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  /* entrance: hidden before first paint, played on the loader's handoff
     (or on `ready` when the loader was skipped) */
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Everything starts above its place and drops in, the same way the nav
    // slides down. The loader's reel has no scrim; starting clear makes the
    // handoff invisible, and the shade then eases in under the words.
    hero.dataset.intro = "wait";
    return () => {
      delete hero.dataset.intro;
    };
  }, []);

  const playedRef = useRef(false);
  const playIntro = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    window.dispatchEvent(new CustomEvent(INTRO_EVENT));
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hero.dataset.intro = "play";
  }, []);

  useEffect(() => {
    window.addEventListener(LOADER_HANDOFF_EVENT, playIntro);
    return () => window.removeEventListener(LOADER_HANDOFF_EVENT, playIntro);
  }, [playIntro]);

  useEffect(() => {
    if (ready) playIntro();
  }, [ready, playIntro]);

  /* nav theme, plate zoom, video gating */
  useEffect(() => {
    const hero = heroRef.current;
    const plate = mediaRef.current;
    if (!hero || !plate) return;
    const video = hero.querySelector("video");
    const setTheme = (t: "dark" | "light") =>
      window.dispatchEvent(new CustomEvent("cloverfield:nav-theme", { detail: t }));

    // The plate is an oversized rounded frame that scales down, with the
    // media inside counter-scaled so the picture never moves. Only transform
    // animates, so the whole zoom runs on the compositor: no clip-path mask
    // to rasterize each frame, and a busy main thread cannot drop frames.
    // The frame overhangs the hero by enough that its rounded corners sit
    // outside the viewport at rest, and the radius is pre-divided by the
    // scale so it lands on the reference's 64px (24px below desktop).
    const setVars = () => {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const desktop = W >= 1280;
      const pad = desktop ? 32 : 16;
      const rad = desktop ? 64 : 24;
      const need = (L: number) => {
        const d = L - 2 * pad - 2 * rad;
        return d > 0 ? (rad * L) / d : 128;
      };
      // The stylesheet's overhang (48px, 136px from 1280px up) covers any
      // normal window, so the plate is laid out at its final size from the
      // server render and never shifts; only very short windows need more.
      const base = desktop ? 136 : 48;
      const o = Math.max(base, Math.ceil(Math.max(need(W), need(H), rad)) + 8);
      const sx = (W - 2 * pad) / (W + 2 * o);
      const sy = (H - 2 * pad) / (H + 2 * o);
      if (o > base) hero.style.setProperty("--o", `${o}px`);
      else hero.style.removeProperty("--o");
      hero.style.setProperty("--pad", `${pad}px`);
      hero.style.setProperty("--sx", String(sx));
      hero.style.setProperty("--sy", String(sy));
      hero.style.setProperty("--rx", `${rad / sx}px`);
      hero.style.setProperty("--ry", `${rad / sy}px`);
    };
    // Re-measured whenever the hero changes size: a resize, or the review
    // card making it taller. A change of height alone moves every section
    // below, so their scroll triggers are refreshed too.
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      if (W === lastW && H === lastH) return;
      const grew = lastH !== 0 && W === lastW;
      lastW = W;
      lastH = H;
      setVars();
      if (grew) ScrollTrigger.refresh();
    });
    ro.observe(hero);

    // Play as soon as the hero is on screen and no zoom is in flight. The
    // video is transparent until its first frame decodes, so the poster
    // covers the wait and nothing lands mid-transition. Don't gate this on
    // canplay: iOS Safari only buffers once play() is called, so waiting
    // for it left the poster up for the whole fallback timer on a refresh.
    let inHero = false;
    let zooming = false;
    const tryPlay = () => {
      if (video && inHero && !zooming) video.play().catch(() => {});
    };
    const onTrStart = (e: TransitionEvent) => {
      if (e.target === plate && e.propertyName === "transform") zooming = true;
    };
    const onTrDone = (e: TransitionEvent) => {
      if (e.target === plate && e.propertyName === "transform") {
        zooming = false;
        tryPlay();
      }
    };
    plate.addEventListener("transitionstart", onTrStart);
    plate.addEventListener("transitionend", onTrDone);
    plate.addEventListener("transitioncancel", onTrDone);

    // The loader's reel hands over its timestamp just before it fades, so
    // this video continues on the same frame instead of restarting.
    const onHandoff = (e: Event) => {
      const time = (e as CustomEvent<{ time: number }>).detail?.time;
      if (!video || typeof time !== "number") return;
      try {
        video.currentTime = time;
      } catch {}
      video.play().catch(() => {});
    };
    window.addEventListener(LOADER_HANDOFF_EVENT, onHandoff);

    const ctx = gsap.context(() => {
      const enter = () => {
        inHero = true;
        tryPlay();
        setTheme("dark");
      };
      const leave = () => {
        inHero = false;
        video?.pause();
        setTheme("light");
      };
      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        invalidateOnRefresh: true,
        onEnter: enter,
        onEnterBack: enter,
        onLeave: leave,
      });
      const y = st.scroll();
      if (y >= st.start && y < st.end) enter();
      else leave();

      // Toggle the class straight on the DOM: a React re-render in the same
      // frame the zoom starts showed up as a dropped frame.
      const zoom = (on: boolean) => plate.classList.toggle(s.isZoomed, on);
      ScrollTrigger.create({
        start: 100,
        invalidateOnRefresh: true,
        onEnter: () => zoom(true),
        onEnterBack: () => zoom(true),
        onLeave: () => zoom(false),
        onLeaveBack: () => zoom(false),
      });
    });
    return () => {
      ro.disconnect();
      window.removeEventListener(LOADER_HANDOFF_EVENT, onHandoff);
      plate.removeEventListener("transitionstart", onTrStart);
      plate.removeEventListener("transitionend", onTrDone);
      plate.removeEventListener("transitioncancel", onTrDone);
      ctx.revert();
    };
  }, []);

  // One safe refresh for the page once the loader releases the body; the
  // other sections do the same and GSAP folds them into a single pass.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh(true);
  }, [ready]);

  return (
    <section ref={heroRef} aria-label="Hero section" className={s.hero} data-nav-theme="dark">
      <div ref={mediaRef} className={s.plate}>
        <div className={s.inner}>
          {/* The video carries no poster attribute: it would paint the
              landscape still over this responsive one on phones. Until the
              first frame decodes the video is transparent and this shows.
              Low priority: the loader covers this screen until the reel is
              playing, so it is only a fallback and shouldn't hold up the
              first paint's fonts and scripts. */}
          <picture>
            <source srcSet={POSTER_MOBILE} media={MOBILE_MEDIA} />
            <img src={POSTER} alt="" aria-hidden="true" fetchPriority="low" decoding="async" className={s.poster} />
          </picture>
          {/* autoPlay lets iOS start the muted reel natively. Left to play()
              alone, Safari drew its own play button over the paused video
              and on some phones never started it. */}
          <video
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label="Cloverfield Studio web design showcase reel"
            className={s.video}
          >
            {/* Phones get the 9:16 crop; the list must match the loader's so
                both videos share one cache entry and the handoff is seamless. */}
            <source src={REEL_MOBILE} media={MOBILE_MEDIA} type="video/mp4" />
            <source src={REEL} type="video/mp4" />
          </video>
          {/* scrim: darkens only the band behind the copy and the top edge
              under the nav; the frame edges stay bright so the reel reads */}
          <div aria-hidden="true" className={s.scrim} />
        </div>
      </div>

      <div className={s.content}>
        {/* data-flip: HeroReview glides these to their new places when a
            step swap changes its height. */}
        <div className={s.copy} data-flip="">
          <h1 className={s.headline} aria-label={HEADLINE.join(" ")}>
            {HEADLINE.map((line, i) => (
              <span key={line} aria-hidden="true" className={`${s.line} ${i === 1 ? s.italic : ""}`}>
                {line.split(" ").map((word, j) => (
                  <span key={j}>
                    {j > 0 ? " " : null}
                    <span className={s.word} style={{ "--i": j } as React.CSSProperties}>
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className={s.sub}>
            Our work has generated more than 3,000 inquiries for local businesses.
            {/* The break is hidden on phones, so the sentences need a real space between them. */}
            <br />{" "}
            We design every site to make you more money.
          </p>
        </div>

        <HeroReview className={s.review} preview={preview} />
      </div>
    </section>
  );
}
