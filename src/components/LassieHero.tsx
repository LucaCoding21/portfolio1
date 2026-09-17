"use client";

/**
 * Hero cloned from lassie.ai, running on our hero reel. Once you scroll 100px
 * the media plate shrinks in from the edges (inset 32px, 64px corners on
 * desktop; 16px / 24px below) over 1s on their ease-out-quint. The reference
 * animates clip-path; we animate transform only (see the zoom effect) so the
 * move is compositor-driven and stays smooth on a cold load. While the hero
 * is on screen the nav runs dark.
 *
 * Copy is Cloverfield's: headline, subline, rotating wins. The reference's
 * bottom email form was removed; the nav carries "Book a call".
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { LOADER_HANDOFF_EVENT } from "./LoadingScreen";
import s from "./LassieHero.module.css";

gsap.registerPlugin(ScrollTrigger);

const DURATION_SLOW = 1;
const EASE_OUT = "expo.out";
const TASK_INTERVAL_MS = 2500;

const TASKS = [
  "New quote request from Surrey",
  "Booking confirmed for Thursday",
  "Someone just called from your site",
  "3 new leads came in overnight",
  "Estimate request from Langley",
  "Consultation booked from Google",
  "New customer from White Rock",
  "New inquiry from Delta",
];

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g opacity="0.7">
        <path
          d="M3.75 9.75H20.25M7.75 4.75V2.75M16.25 4.75V2.75M6.75 20.25H17.25C18.9069 20.25 20.25 18.9069 20.25 17.25V7.75C20.25 6.09315 18.9069 4.75 17.25 4.75H6.75C5.09315 4.75 3.75 6.09315 3.75 7.75V17.25C3.75 18.9069 5.09315 20.25 6.75 20.25Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function LassieHero({ ready }: { ready: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  /* nav theme, plate zoom, video gating */
  useEffect(() => {
    const hero = heroRef.current;
    const plate = mediaRef.current;
    if (!hero || !plate) return;
    const video = hero.querySelector("video");
    const setTheme = (t: "dark" | "light") =>
      window.dispatchEvent(new CustomEvent("lassie:nav-theme", { detail: t }));

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
      const o = Math.ceil(Math.max(need(W), need(H), rad)) + 8;
      const sx = (W - 2 * pad) / (W + 2 * o);
      const sy = (H - 2 * pad) / (H + 2 * o);
      hero.style.setProperty("--o", `${o}px`);
      hero.style.setProperty("--sx", String(sx));
      hero.style.setProperty("--sy", String(sy));
      hero.style.setProperty("--rx", `${rad / sx}px`);
      hero.style.setProperty("--ry", `${rad / sy}px`);
    };
    setVars();
    window.addEventListener("resize", setVars);

    // Play only once the video can run and no zoom is in flight, so the first
    // decoded frames never land mid-transition on a cold load. The poster
    // covers until then. Fallback timer for browsers that only buffer on play().
    let inHero = false;
    let zooming = false;
    let videoOk = !!video && video.readyState >= 3;
    const tryPlay = () => {
      if (video && videoOk && inHero && !zooming) video.play().catch(() => {});
    };
    const onCanPlay = () => {
      videoOk = true;
      tryPlay();
    };
    video?.addEventListener("canplay", onCanPlay, { once: true });
    const fallback = window.setTimeout(onCanPlay, 3000);
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
      videoOk = true;
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
      window.removeEventListener("resize", setVars);
      window.removeEventListener(LOADER_HANDOFF_EVENT, onHandoff);
      window.clearTimeout(fallback);
      video?.removeEventListener("canplay", onCanPlay);
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

  /* task rotator: RafInterval at 2.5s, slide up 100% with expo.out over 1s */
  useEffect(() => {
    const wrap = tasksRef.current;
    if (!wrap) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-task-item]", wrap);
    if (items.length <= 1) return;

    let prev: HTMLElement | null = null;
    let next: HTMLElement | null = items[0];
    let idx = 0;

    const step = () => {
      if (!next) return;
      gsap.fromTo(
        next,
        { yPercent: 100 },
        { yPercent: 0, autoAlpha: 1, duration: DURATION_SLOW, ease: EASE_OUT }
      );
      if (prev) {
        gsap.fromTo(prev, { yPercent: 0 }, { yPercent: -100, duration: DURATION_SLOW, ease: EASE_OUT });
      }
      if (++idx >= items.length) idx = 0;
      prev = next;
      next = items[idx] ?? null;
    };

    gsap.set(items, { yPercent: 100, autoAlpha: 0 });
    step();

    // rAF-driven interval, like the reference's RafInterval
    let raf = 0;
    let last: number | null = null;
    const loop = (t: number) => {
      if (last === null) last = t;
      const dt = t - last;
      if (dt >= TASK_INTERVAL_MS) {
        const n = Math.floor(dt / TASK_INTERVAL_MS);
        last += n * TASK_INTERVAL_MS;
        step();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={heroRef} aria-label="Hero section" className={s.hero} data-nav-theme="dark">
      <div ref={mediaRef} className={s.plate}>
        <div className={s.inner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lassie-hero-poster.jpg" alt="" aria-hidden="true" fetchPriority="high" decoding="async" className={s.poster} />
          <video
            src="/lassie-hero.mp4"
            muted
            loop
            playsInline
            preload="auto"
            poster="/lassie-hero-poster.jpg"
            aria-label="Cloverfield Studio web design showcase reel"
            className={s.video}
          />
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.headline}>
          We make websites
          <br />
          <span className={s.italic}>that bring in customers.</span>
        </h1>
        <p className={`${s.bodyMd} ${s.sub}`}>
          Our work has generated more than 5,000 inquiries for local businesses.
          <br />
          We design every site to make you more money.
        </p>
        <div ref={tasksRef} className={s.tasks} aria-live="polite">
          {TASKS.map((label, i) => (
            <div key={`${label}-${i}`} data-task-item="" className={s.task}>
              <p className={`${s.bodyMd} ${s.taskText}`}>
                <span className={s.taskIcon}>
                  <CalendarIcon />
                </span>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
