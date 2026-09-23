"use client";

/**
 * Hero cloned from lassie.ai, running on our hero reel. Once you scroll 100px
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
 * underneath it all, so the shade never snaps on.
 *
 * Copy is Cloverfield's: headline, subline, rotating wins. The reference's
 * bottom email form was removed; the nav carries "Book a call".
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CustomEase } from "gsap/dist/CustomEase";
import { LOADER_HANDOFF_EVENT, MOBILE_MEDIA, POSTER, POSTER_MOBILE, REEL, REEL_MOBILE } from "./LoadingScreen";
import { INTRO_EVENT } from "@/lib/intro";
import s from "./LassieHero.module.css";

gsap.registerPlugin(ScrollTrigger, CustomEase);

const DURATION_SLOW = 1;
const EASE_OUT = "expo.out";
const TASK_INTERVAL_MS = 2500;

/* calebwu.ca's motion: --ease-fast for anything structural, the sticker
   overshoot for the one line that should feel physical. */
const EASE_FAST = "cf-ease-fast";
const RECOIL = "cf-recoil";

const HEADLINE = ["We make websites", "that bring in customers."];

/* Each message carries the icon for what happened. */
type TaskIcon = "mail" | "calendar" | "bell" | "user";
const TASKS: { label: string; icon: TaskIcon }[] = [
  { label: "New quote request from Surrey", icon: "mail" },
  { label: "Booking confirmed for Thursday", icon: "calendar" },
  { label: "3 new leads came in overnight", icon: "bell" },
  { label: "Estimate request from Langley", icon: "mail" },
  { label: "Consultation booked from Google", icon: "calendar" },
  { label: "New customer from White Rock", icon: "user" },
  { label: "New inquiry from Delta", icon: "mail" },
];

/* 24px line icons on the same 1.5px white stroke, drawn in the calendar's
   style so the set reads as one family. */
const ICON_PATHS: Record<TaskIcon, string> = {
  calendar:
    "M3.75 9.75H20.25M7.75 4.75V2.75M16.25 4.75V2.75M6.75 20.25H17.25C18.9069 20.25 20.25 18.9069 20.25 17.25V7.75C20.25 6.09315 18.9069 4.75 17.25 4.75H6.75C5.09315 4.75 3.75 6.09315 3.75 7.75V17.25C3.75 18.9069 5.09315 20.25 6.75 20.25Z",
  mail: "M3.75 7.25L11.4 12.35C11.76 12.59 12.24 12.59 12.6 12.35L20.25 7.25M6.75 19.25H17.25C18.9069 19.25 20.25 17.9069 20.25 16.25V7.75C20.25 6.09315 18.9069 4.75 17.25 4.75H6.75C5.09315 4.75 3.75 6.09315 3.75 7.75V16.25C3.75 17.9069 5.09315 19.25 6.75 19.25Z",
  bell: "M9.75 19.25C10.2 20.1 11.03 20.75 12 20.75C12.97 20.75 13.8 20.1 14.25 19.25M5.75 16.25H18.25L17.25 14.75V10C17.25 7.1 14.9 4.75 12 4.75C9.1 4.75 6.75 7.1 6.75 10V14.75L5.75 16.25Z",
  user: "M12 11.25C13.7949 11.25 15.25 9.79493 15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 10.2051 11.25 12 11.25ZM5.75 19.25C6.4 16.4 8.95 14.25 12 14.25C15.05 14.25 17.6 16.4 18.25 19.25",
};

function TaskGlyph({ icon }: { icon: TaskIcon }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g opacity="0.7">
        <path d={ICON_PATHS[icon]} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function LassieHero({ ready }: { ready: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const [tasksOn, setTasksOn] = useState(false);

  /* entrance: hidden before first paint, built in on the loader's handoff
     (or on `ready` when the loader was skipped) */
  useLayoutEffect(() => {
    const headline = headlineRef.current;
    const sub = subRef.current;
    const tasks = tasksRef.current;
    if (!headline || !sub || !tasks) return;
    if (!CustomEase.get(EASE_FAST)) CustomEase.create(EASE_FAST, "0.62, 0.61, 0.02, 1");
    if (!CustomEase.get(RECOIL)) CustomEase.create(RECOIL, "0.34, 1.56, 0.64, 1");

    const lines = Array.from(headline.querySelectorAll<HTMLElement>(`.${s.line}`)).map((l) =>
      Array.from(l.querySelectorAll<HTMLElement>(`.${s.word}`))
    );
    const words = lines.flat();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTasksOn(true);
      return;
    }
    // Everything starts above its place and drops in, the same way the nav
    // slides down.
    gsap.set(words, { autoAlpha: 0, y: "-0.45em" });
    gsap.set(sub, { autoAlpha: 0, y: -14 });
    gsap.set(tasks, { autoAlpha: 0, y: -12, scale: 0.9 });
    // The loader's reel has no scrim; starting clear makes the handoff
    // invisible, and the shade then eases in under the words.
    const scrim = scrimRef.current;
    if (scrim) gsap.set(scrim, { opacity: 0 });
    return () => {
      gsap.set([...words, sub, tasks, scrim], { clearProps: "all" });
    };
  }, []);

  const playedRef = useRef(false);
  const introRef = useRef<() => void>(() => {});
  introRef.current = () => {
    if (playedRef.current) return;
    playedRef.current = true;
    window.dispatchEvent(new CustomEvent(INTRO_EVENT));
    const headline = headlineRef.current;
    const sub = subRef.current;
    const tasks = tasksRef.current;
    if (!headline || !sub || !tasks) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [first = [], second = []] = Array.from(headline.querySelectorAll<HTMLElement>(`.${s.line}`)).map((l) =>
      Array.from(l.querySelectorAll<HTMLElement>(`.${s.word}`))
    );
    // Everything overlaps, as on calebwu.ca: the nav, both headline lines,
    // the subline and the task row all start inside the first ~0.35s, so the
    // page reads as one move with a ripple through it, not a queue.
    gsap
      .timeline()
      .to(scrimRef.current, { opacity: 1, duration: 1.4, ease: "sine.inOut" }, 0)
      .to(first, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: EASE_FAST }, 0)
      .to(second, { autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "power1.out" }, 0.12)
      .to(second, { y: 0, duration: 0.7, stagger: 0.05, ease: RECOIL }, 0.12)
      .to(sub, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_FAST }, 0.25)
      .to(tasks, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: EASE_FAST }, 0.35)
      .call(() => setTasksOn(true), [], 0.55);
  };

  useEffect(() => {
    const onHandoff = () => introRef.current();
    window.addEventListener(LOADER_HANDOFF_EVENT, onHandoff);
    return () => window.removeEventListener(LOADER_HANDOFF_EVENT, onHandoff);
  }, []);

  useEffect(() => {
    if (ready) introRef.current();
  }, [ready]);

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
      window.removeEventListener("resize", setVars);
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

  /* task rotator: RafInterval at 2.5s, slide up 100% with expo.out over 1s */
  useEffect(() => {
    const wrap = tasksRef.current;
    if (!wrap || !tasksOn) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-task-item]", wrap);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      // The icon lands a beat after its line, with calebwu.ca's sticker
      // recoil: past full size with a small twist, then back.
      const icon = next.querySelector<HTMLElement>(`.${s.taskIcon}`);
      if (icon && !reduced) {
        gsap.fromTo(
          icon,
          { scale: 0, rotate: -14 },
          { scale: 1, rotate: 0, duration: 0.55, delay: 0.12, ease: RECOIL }
        );
      }
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
  }, [tasksOn]);

  return (
    <section ref={heroRef} aria-label="Hero section" className={s.hero} data-nav-theme="dark">
      <div ref={mediaRef} className={s.plate}>
        <div className={s.inner}>
          {/* The video carries no poster attribute: it would paint the
              landscape still over this responsive one on phones. Until the
              first frame decodes the video is transparent and this shows. */}
          <picture>
            <source srcSet={POSTER_MOBILE} media={MOBILE_MEDIA} />
            <img src={POSTER} alt="" aria-hidden="true" fetchPriority="high" decoding="async" className={s.poster} />
          </picture>
          <video
            muted
            loop
            playsInline
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
          <div ref={scrimRef} aria-hidden="true" className={s.scrim} />
        </div>
      </div>

      <div className={s.content}>
        <h1 ref={headlineRef} className={s.headline} aria-label={HEADLINE.join(" ")}>
          {HEADLINE.map((line, i) => (
            <span key={line} aria-hidden="true" className={`${s.line} ${i === 1 ? s.italic : ""}`}>
              {line.split(" ").map((word, j) => (
                <span key={j}>
                  {j > 0 ? " " : null}
                  <span className={s.word}>{word}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p ref={subRef} className={`${s.bodyMd} ${s.sub}`}>
          Our work has generated more than 3,000 inquiries for local businesses.
          {/* The break is hidden on phones, so the sentences need a real space between them. */}
          <br />{" "}
          We design every site to make you more money.
        </p>
        <div ref={tasksRef} className={s.tasks} aria-live="polite">
          {TASKS.map(({ label, icon }, i) => (
            <div key={`${label}-${i}`} data-task-item="" className={s.task}>
              <p className={`${s.bodyMd} ${s.taskText}`}>
                <span className={s.taskIcon}>
                  <TaskGlyph icon={icon} />
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
