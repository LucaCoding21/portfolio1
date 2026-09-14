"use client";

/**
 * Hero cloned from lassie.ai, running on our hero reel. Once you scroll 100px
 * the media plate clips in from the edges (inset 32px, 64px corners on
 * desktop; 16px / 24px below) over 1s on their ease-out-quint, and the sign-up
 * form lifts 50px. While the hero is on screen the nav runs dark.
 *
 * PLACEHOLDER: headline, subline, task lines and the email form are the
 * reference's copy and UI, kept verbatim for the first pass.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./LassieHero.module.css";

gsap.registerPlugin(ScrollTrigger);

const DURATION_SLOW = 1;
const EASE_OUT = "expo.out";
const TASK_INTERVAL_MS = 2500;

const TASKS = [
  "Confirmed 42 appointments",
  "Posted $12,430 in payments",
  "Booked 8 hygiene recalls",
  "Confirmed 42 appointments",
  "Rescheduled 3 appointments",
  "Called Cigna for claim status",
  "Completed Humana enrollment",
  "Closed the books for March",
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
  const formRef = useRef<HTMLDivElement>(null);

  /* nav theme + zoom trigger */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const setTheme = (t: "dark" | "light") =>
      window.dispatchEvent(new CustomEvent("lassie:nav-theme", { detail: t }));

    let cleanupArm = () => {};
    const ctx = gsap.context(() => {
      const enter = () => {
        hero.querySelector("video")?.play().catch(() => {});
        setTheme("dark");
      };
      const leave = () => {
        hero.querySelector("video")?.pause();
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

      // Toggle classes straight on the DOM: a React re-render of the hero in
      // the same frame the clip starts moving showed up as a dropped frame.
      //
      // The clip is armed only once the page has settled (fonts in, first
      // video frames decoded, two calm frames in a row). On a cold load a
      // scroll in the first second used to start the 1s clip on top of
      // hydration and decode work and stutter; now it waits for the calm
      // moment and then plays clean. Falls back to arming at 2.5s regardless.
      const media = mediaRef.current;
      const formWrap = formRef.current;
      let armed = false;
      let want = false;
      const apply = () => {
        media?.classList.toggle(s.isZoomed, want);
        formWrap?.classList.toggle(s.isZoomed, want);
      };
      const zoom = (on: boolean) => {
        want = on;
        if (armed) apply();
      };
      ScrollTrigger.create({
        start: 100,
        invalidateOnRefresh: true,
        onEnter: () => zoom(true),
        onEnterBack: () => zoom(true),
        onLeave: () => zoom(false),
        onLeaveBack: () => zoom(false),
      });

      let cancelled = false;
      const arm = () => {
        if (armed || cancelled) return;
        armed = true;
        apply();
      };
      const calmFrames = () =>
        new Promise<void>((resolve) => {
          let last = performance.now();
          let calm = 0;
          const tick = (t: number) => {
            if (cancelled) return;
            calm = t - last < 20 ? calm + 1 : 0;
            last = t;
            if (calm >= 2) resolve();
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      const video = hero.querySelector("video");
      const videoReady = new Promise<void>((resolve) => {
        if (!video || video.readyState >= 3) return resolve();
        video.addEventListener("canplay", () => resolve(), { once: true });
      });
      const fontsReady = "fonts" in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2500));
      Promise.race([Promise.all([videoReady, fontsReady]).then(calmFrames), timeout]).then(arm);
      cleanupArm = () => {
        cancelled = true;
      };
    });
    return () => {
      cleanupArm();
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
      <div ref={mediaRef} className={s.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lassie-hero-poster.jpg" alt="" aria-hidden="true" fetchPriority="high" decoding="async" className={s.poster} />
        <video
          src="/lassie-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/lassie-hero-poster.jpg"
          aria-label="Cloverfield Studio web design showcase reel"
          className={s.video}
        />
      </div>

      <div className={s.content}>
        <h1 className={s.headline}>
          You’re a doctor.
          <br />
          <span className={s.italic}>Not a machine.</span>
        </h1>
        <p className={`${s.bodyMd} ${s.sub}`}>Let Lassie do your admin</p>
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

      <div ref={formRef} className={s.formWrap}>
        <form className={s.form} onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your email"
            className={s.input}
          />
          <button type="submit" className={s.button}>
            <span className={s.buttonInner}>Get started</span>
          </button>
        </form>
      </div>
    </section>
  );
}
