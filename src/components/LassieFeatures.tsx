"use client";

/**
 * Lassie's "AI that runs the doctor's office" intro and the pinned feature
 * cards beneath it, cloned from their FeaturesCarousel. The card plates carry
 * our Success Stories covers, and the story reel that normally stands up on
 * hover stands up on its own while a card is the live one.
 *
 * Motion is their scroll timeline verbatim: the section pins for 2.2 viewport
 * heights on desktop (3 on tablet, 2.5 on mobile) and a scrubbed timeline of
 * three parallel tracks runs across 3 viewport heights. Track 0 brings the
 * first card in and out, track 1 holds the second card back (scale .85, 12%
 * down) then brings it in and out, track 2 holds the third card two steps
 * back (scale .7, 24% down), one step back, then in.
 *
 * PLACEHOLDER: intro headline and the three card titles and bodies are the
 * reference's copy, kept verbatim for the first pass. Their Lottie flower above
 * the headline is left out by request.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SUCCESS_STORIES } from "@/data/successStories";
import s from "./LassieFeatures.module.css";

gsap.registerPlugin(ScrollTrigger);

const BP = { mobile: 394, tablet: 1024, desktop: 1280, desktopLarge: 1440 };

/* Shown in sequence; the last in the DOM is the first one up. */
const CARDS = [
  {
    title: "Lassie does your paperwork",
    body: "Handling enrollments, converting payments to EFTs, and posting them automatically, without delay.",
    align: "left" as const,
    story: SUCCESS_STORIES[0],
  },
  {
    title: "Keeps you in the loop",
    body: "Watch Lassie complete your paperwork, asking for your input when needed on the most complex issues.",
    align: "right" as const,
    story: SUCCESS_STORIES[1],
  },
  {
    title: "And answers your questions",
    body: "Got a question about a claim? Want to see how your week is tracking? Lassie is always ready to help.",
    align: "left" as const,
    story: SUCCESS_STORIES[2],
  },
];

const play = (v: HTMLVideoElement | null) => {
  if (v && v.paused) {
    v.currentTime = 0;
    v.play().catch(() => {});
  }
};
const pause = (v: HTMLVideoElement | null) => {
  if (v && !v.paused) {
    v.currentTime = 0;
    v.pause();
  }
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
    const els = [cardRefs.current[2], cardRefs.current[1], cardRefs.current[0]];
    if (!carousel || els.some((e) => !e)) return;
    const elements = els as HTMLDivElement[];

    const w = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const setLive = (el: HTMLElement, on: boolean) => {
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
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => {
          const p = tl.progress();
          if (p > 0.5 && p < 0.8) setLive(el, true);
          if (p < 0.5) setLive(el, false);
        },
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
       power1.out: the lift starts fast and settles. Measured, not assumed. */
    const leave = (el: HTMLElement) => {
      const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
      const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
      const tl = gsap.timeline({
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
          opacity: 0,
          y: () => (w() >= BP.desktop ? "-60%" : `-${vh()}px`),
          duration: () =>
            w() < BP.desktop && w() >= BP.tablet ? 2 : w() >= BP.desktop ? 0.5 : 3,
        },
        0
      );
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
        tl.set(
          desc,
          {
            opacity: 0,
            y: () => "50%",
            scale: () => (w() < BP.desktop && i > 0 ? 0.8 : 1),
            immediateRender: true,
          },
          0
        );
      });
      return tl;
    };

    const next = (i: number) => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const el = elements[i];
      if (i === 0) {
        tl.add(enter(el), 0);
        tl.add(leave(el));
      }
      if (i === 1) {
        tl.add(back(el, 1, 0), 0);
        tl.add(enter(el));
        tl.add(leave(el));
      }
      if (i === 2) {
        tl.add(back(el, 2, 0), 0);
        tl.add(back(el, 2, 1));
        tl.add(enter(el));
      }
      return tl;
    };

    const ctx = gsap.context(() => {
      const initial = start();

      ScrollTrigger.create({
        trigger: carousel,
        start: "center center",
        end: () =>
          w() >= BP.desktop
            ? `+=${2.2 * vh()}`
            : w() >= BP.tablet
              ? `+=${3 * vh()}`
              : `+=${2.5 * vh()}`,
        pin: true,
        invalidateOnRefresh: true,
      });

      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: carousel,
          start: () => (w() < BP.tablet ? "top center-=100" : "top center+=100"),
          end: () => `+=${3 * vh()}`,
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
      master.add(initial, 0);
      master.add(next(0), 0);
      master.add(next(1), 0);
      master.add(next(2), 0);
    }, carousel);

    return () => ctx.revert();
  }, []);

  return (
    <section className={s.section}>
      <section className={s.intro}>
        <h2 className={s.title}>
          AI that runs the
          <br />
          doctor’s office
        </h2>
      </section>

      <section ref={carouselRef} className={s.carousel}>
        {/* DOM order is reversed so the first card up sits on top of the stack */}
        {[...CARDS].reverse().map((card, domIndex) => (
          <div
            key={card.title}
            ref={(el) => {
              cardRefs.current[domIndex] = el;
            }}
            className={s.card}
            style={{ pointerEvents: "none" }}
          >
            <div className={s.inner}>
              <article className={`${s.description} ${card.align === "right" ? s.isRight : ""}`}>
                <div className={s.descriptionAnim}>
                  <h3 className={s.cardTitle}>{card.title}</h3>
                  <p className={s.cardBody}>{card.body}</p>
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
                      <video src={card.story.video} loop muted playsInline preload="metadata" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
