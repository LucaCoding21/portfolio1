"use client";

/**
 * "Cloverfield selected works" intro and the pinned feature cards beneath
 * it, cloned from Lassie's FeaturesCarousel. The card plates carry
 * our Success Stories covers, and the story reel that normally stands up on
 * hover stands up on its own while a card is the live one.
 *
 * Motion is their scroll timeline, generalised to any number of cards: the
 * section pins for 2.2 viewport heights on desktop (3 on tablet, 2.5 on
 * mobile) plus one per card beyond three, and a scrubbed timeline of parallel
 * tracks runs across 3 (+1 per extra card) viewport heights. Track 0 brings
 * the first card in and out, track 1 holds the second card back (scale .85,
 * 12% down) then brings it in and out, track 2 holds the third two steps back
 * (scale .7, 24% down), one step back, then in, and so on.
 *
 * Card copy is the project's title, blurb and headline result from
 * `successStories`. Their Lottie flower above
 * the headline is left out by request.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SUCCESS_STORIES } from "@/data/successStories";
import StoryDescription from "./StoryDescription";
import s from "./LassieFeatures.module.css";

gsap.registerPlugin(ScrollTrigger);
// iOS shows and hides its address bar mid-scroll; without this each one
// fires a resize, ScrollTrigger refreshes, and the pinned carousel jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

const BP = { mobile: 394, tablet: 1024, desktop: 1280, desktopLarge: 1440 };

/* Shown in sequence; the last in the DOM is the first one up. Title, blurb
   and the headline result all come from the story. Copy alternates sides. */
const CARDS = SUCCESS_STORIES.map((story, i) => ({
  align: i % 2 ? ("right" as const) : ("left" as const),
  story,
}));

/* Viewport heights the section stays pinned for: the reference's 2.2 / 3 /
   2.5 for three cards, plus one per extra card. */
const EXTRA = CARDS.length - 3;

/* Below desktop each card holds in front for a stretch of scroll before it
   lifts (the reference runs straight from arriving into leaving). In
   timeline units, where a card's arrival is 2; the scroll distances grow by
   the same share so the moves themselves keep their pace. */
const HOLD = 1.2;

/* Both run only on a change of state (see setLive), never per frame: a
   play() on a phone reports `paused` for a moment while it starts, and
   resetting the time on every scrub frame kept the reel stuck on frame 0. */
const play = (v: HTMLVideoElement | null) => {
  if (!v) return;
  v.currentTime = 0;
  v.play().catch(() => {});
};
const pause = (v: HTMLVideoElement | null) => {
  if (!v) return;
  v.pause();
  v.currentTime = 0;
};

export default function LassieFeatures({ ready }: { ready: boolean }) {
  const carouselRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh(true);
  }, [ready]);

  useEffect(() => {
    const carousel = carouselRef.current;
    // sequence order: index 0 = DOM last
    const els = [...cardRefs.current].reverse();
    if (!carousel || els.some((e) => !e)) return;
    const elements = els as HTMLDivElement[];

    const w = () => window.innerWidth;
    const vh = () => window.innerHeight;
    // Set once at build: the hold is baked into the timeline's positions.
    const hold = w() < BP.tablet ? HOLD : 0;
    const stretch = (2 + hold) / 2;

    // Called on every scrub frame by the timelines below, so it only does
    // work when the state actually flips.
    const live = new WeakSet<HTMLElement>();
    const setLive = (el: HTMLElement, on: boolean) => {
      if (live.has(el) === on) return;
      if (on) live.add(el);
      else live.delete(el);
      el.classList.toggle(s.isLive, on);
      el.style.pointerEvents = on ? "auto" : "none";
      const reel = el.querySelector<HTMLVideoElement>("video");
      if (on) play(reel);
      else pause(reel);
    };

    /* a card comes up to the front */
    const enter = (el: HTMLElement) => {
      const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
      const media = el.querySelector<HTMLElement>(`.${s.media}`);
      const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
      // Live from halfway in, and it stays live (onComplete covers a flick
      // that skips straight past the window, and the hold after it); the
      // lift turns it off again.
      // Phones hold each card in front for a stretch, so the arrival eases
      // into the stop instead of hitting it at full speed.
      const tl = gsap.timeline({
        defaults: { ease: w() < BP.tablet ? "power1.out" : "none" },
        onUpdate: () => setLive(el, tl.progress() >= 0.5),
        onComplete: () => setLive(el, true),
      });
      if (!plate || !media || !desc) return tl;
      const below = w() < BP.desktop;
      tl.to(el, { scale: 1, y: 0 }, 0);
      tl.to(desc, { opacity: 1, duration: () => (below ? 0.5 : 1) }, below ? 0 : 0.1);
      tl.to(desc, { duration: () => (below ? 2 : 1), scale: 1, y: "0%" }, below ? 0 : 0.1);
      tl.to(plate, { scale: () => 1, y: () => 0, opacity: () => 1, duration: 2 }, 0);
      tl.to(plate, { background: "#F9F8F5", duration: 0.1 }, 0);
      tl.to(media, { opacity: () => 1 }, 0);
      tl.fromTo(media, { scale: 1.05 }, { scale: 1, duration: 2 }, 0);
      return tl;
    };

    /* a card waits behind, `t - r` steps back */
    const back = (el: HTMLElement, t: number, r: number) => {
      const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
      const media = el.querySelector<HTMLElement>(`.${s.media}`);
      const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => setLive(el, false),
      });
      if (!plate || !media || !desc) return tl;
      const l = t - r;
      tl.to(el, { scale: 1, y: 0 }, 0);
      tl.to(desc, { opacity: 0, y: () => `${(90 - r) * l}%` }, 0);
      tl.to(plate, { background: "#F9F8F5", duration: 0.1 }, 0);
      tl.to(plate, { scale: () => 1 - 0.15 * l, duration: 2, y: () => `${(12 - r) * l}%`, opacity: () => 1 }, 0);
      tl.to(media, { opacity: () => (l <= 0 ? 1 : 0.5 - l / 5) }, 0);
      return tl;
    };

    /* a card lifts off the top. The reference passes `ease: "linear"` as a
       timeline option, which GSAP ignores, so these tweens run on the default
       power1.out: the lift starts fast and settles. Measured, not assumed.
       Phones come out of a hold, so there the lift starts gently too. */
    const leave = (el: HTMLElement) => {
      const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
      const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
      const tl = gsap.timeline({
        defaults: { ease: w() < BP.tablet ? "power1.inOut" : "power1.out" },
        onUpdate: () => {
          const p = tl.progress();
          if (p > 0.3) setLive(el, false);
          else setLive(el, true);
        },
      });
      if (!plate || !desc) return tl;
      tl.to(el, { scale: 1, y: 0 }, 0);
      tl.to(
        desc,
        {
          y: () => (w() >= BP.desktop ? "-60%" : `-${vh()}px`),
          duration: () =>
            w() < BP.desktop && w() >= BP.tablet ? 2 : w() >= BP.desktop ? 0.5 : 3,
        },
        0
      );
      // Below desktop the copy would otherwise ride up half-transparent over
      // the next card for the whole lift, so it fades out in the first
      // stretch of the move.
      tl.to(desc, { opacity: 0, duration: () => (w() >= BP.desktop ? 0.5 : 0.35) }, 0);
      tl.to(plate, { background: "transparent", duration: 0.1 }, 0);
      tl.to(
        plate,
        {
          scale: () => 1,
          duration: () => (w() >= BP.desktop ? 3 : w() >= BP.tablet ? 2 : 3),
          y: () => `${-vh()}px`,
        },
        0
      );
      return tl;
    };

    const start = () => {
      const tl = gsap.timeline({});
      elements.forEach((el, i) => {
        const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
        const media = el.querySelector<HTMLElement>(`.${s.media}`);
        const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
        if (!plate || !media || !desc) return;
        tl.set(plate, { scale: 0.95, y: "10%", immediateRender: true });
        tl.set(media, { scale: 1.2, immediateRender: true });
        // On phones the first card's copy is already showing above its
        // plate as the section scrolls in, so the gap under the title
        // isn't blank; the enter tween then has nothing to do for it.
        const shown = () => w() < BP.tablet && i === 0;
        tl.set(
          desc,
          {
            opacity: () => (shown() ? 1 : 0),
            y: () => (shown() ? "0%" : "50%"),
            scale: () => (w() < BP.desktop && i > 0 ? 0.8 : 1),
            immediateRender: true,
          },
          0
        );
      });
      return tl;
    };

    /* card i waits i steps back, one step per card ahead of it, then comes
       up; every card but the last lifts off afterwards */
    const next = (i: number) => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const el = elements[i];
      // Each step back is padded by the hold too, so a card starts up
      // exactly as the one in front of it starts to lift.
      for (let k = 0; k < i; k++) {
        tl.add(back(el, i, k), k === 0 ? 0 : undefined);
        if (hold) tl.to({}, { duration: hold });
      }
      tl.add(enter(el), i === 0 ? 0 : undefined);
      if (hold) tl.to({}, { duration: hold });
      if (i < elements.length - 1) tl.add(leave(el));
      return tl;
    };

    const ctx = gsap.context(() => {
      const initial = start();

      ScrollTrigger.create({
        trigger: carousel,
        start: "center center",
        end: () =>
          w() >= BP.desktop
            ? `+=${(2.2 + EXTRA) * vh()}`
            : w() >= BP.tablet
              ? `+=${(3 + EXTRA) * vh() * stretch}`
              : `+=${(2.5 + EXTRA) * vh() * stretch}`,
        pin: true,
        // Pin a frame early so a fast flick on a phone doesn't show the
        // carousel scroll past before it locks.
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Touch screens scrub straight off the finger; a mouse wheel gets the
      // reference's short smoothing.
      const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: carousel,
          start: () => (w() < BP.tablet ? "top center-=100" : "top center+=100"),
          end: () => `+=${(3 + EXTRA) * vh() * stretch}`,
          scrub: touch ? true : 0.25,
          invalidateOnRefresh: true,
        },
      });
      master.add(initial, 0);
      elements.forEach((_, i) => master.add(next(i), 0));
    }, carousel);

    return () => ctx.revert();
  }, []);

  return (
    <section className={s.section}>
      <section className={s.intro}>
        <h2 className={s.title}>
          Cloverfield
          <br />
          selected works
        </h2>
      </section>

      <section ref={carouselRef} className={s.carousel}>
        {/* DOM order is reversed so the first card up sits on top of the stack */}
        {[...CARDS].reverse().map((card, domIndex) => (
          <div
            key={card.story.title}
            ref={(el) => {
              cardRefs.current[domIndex] = el;
            }}
            className={s.card}
            style={{ pointerEvents: "none" }}
          >
            <div className={s.inner}>
              <article className={`${s.description} ${card.align === "right" ? s.isRight : ""}`}>
                <div className={s.descriptionAnim}>
                  <h3 className={s.cardTitle}>{card.story.title}</h3>
                  <p className={s.cardBody}>
                    <StoryDescription description={card.story.description} />
                  </p>
                  <p className={s.cardResult}>
                    <span className={s.resultValue}>{card.story.resultValue}</span>
                    <span className={s.resultLabel}>{card.story.resultLabel}</span>
                  </p>
                </div>
              </article>

              <div className={s.plate}>
                <div className={s.media}>
                  <Image
                    src={card.story.image}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 1100px"
                  />
                </div>
                <div className={s.overlay} />
                <div className={s.reelSlot}>
                  <div className={s.reel}>
                    <div className={s.reelVideo}>
                      {/* Buffered up front so the first frames are there the moment a card goes live. */}
                      <video src={card.story.video} loop muted playsInline preload="auto" />
                    </div>
                  </div>
                </div>
                {/* The whole plate opens the live site; only the card in front takes the click. */}
                <a
                  href={card.story.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the ${card.story.title} website in a new tab`}
                  className={s.plateLink}
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
