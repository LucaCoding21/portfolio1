"use client";

/**
 * "Our selected works" intro and the pinned feature cards beneath
 * it, cloned from a reference site's features carousel. The card plates carry
 * our Success Stories covers, and the story reel that normally stands up on
 * hover stands up on its own while a card is the live one.
 *
 * Motion follows calebwu.ca's card deck rather than a scrub: the section
 * pins, and while it is pinned each scroll gesture (wheel, swipe or arrow
 * key) steps one card, played as a fixed 700ms tween on his ease. The front
 * card lifts straight off the top; the ones behind wait at scale .85 / 12%
 * down, .7 / 24% down, and so on. Stepping past either end hands the scroll
 * back to the page.
 *
 * Card copy is the project's title, blurb and headline result from
 * `successStories`. Their Lottie flower above
 * the headline is left out by request.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CustomEase } from "gsap/dist/CustomEase";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
import { SUCCESS_STORIES } from "@/data/successStories";
import { isJumping } from "@/lib/scrollToHash";
import StoryDescription from "./StoryDescription";
import s from "./SelectedWorks.module.css";

gsap.registerPlugin(ScrollTrigger, CustomEase, ScrambleTextPlugin);
// iOS shows and hides its address bar mid-scroll; without this each one
// fires a resize, ScrollTrigger refreshes, and the pinned carousel jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

const BP = { tablet: 1024, desktop: 1280 };

/* Shown in sequence; the last in the DOM is the first one up. Title, blurb
   and the headline result all come from the story. Copy alternates sides. */
const CARDS = SUCCESS_STORIES.map((story, i) => ({
  align: i % 2 ? ("right" as const) : ("left" as const),
  story,
}));

/* calebwu.ca's card deck: one scroll gesture is one card, played as a fixed
   700ms tween on his --ease-fast curve, however hard or slow the wheel. */
const EASE = "cw-ease-fast";
const STEP = 0.7;
/* The desktop hover label and the characters it scrambles through. */
const VIEW_LABEL = "Click to view";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+";
/* Wheel events this far apart start a new gesture. */
const GESTURE_GAP = 200;
/* Minimum time between two steps. */
const STEP_GAP = 225;
/* A swipe counts past this speed (px/ms) or distance (px). */
const SWIPE_V = 0.3;
const SWIPE_D = 50;

/* Both run only on a change of state (see setLive): a play() on a phone
   reports `paused` for a moment while it starts. */
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

export default function SelectedWorks({ ready }: { ready: boolean }) {
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
    const cards = (els as HTMLDivElement[]).map((el) => ({
      el,
      plate: el.querySelector<HTMLElement>(`.${s.plate}`)!,
      media: el.querySelector<HTMLElement>(`.${s.media}`)!,
      desc: el.querySelector<HTMLElement>(`.${s.descriptionAnim}`)!,
    }));
    const last = cards.length - 1;

    if (!CustomEase.get(EASE)) CustomEase.create(EASE, "0.62, 0.61, 0.02, 1");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = () => window.innerWidth;
    const vh = () => window.innerHeight;

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
    const liveTimers: gsap.core.Tween[] = [];

    let arrived = false;
    let current = 0;

    /* Every card's pose for where the deck is. `stagger` spaces the cards
       behind by 150ms a slot, as the stack builds on arrival. */
    const render = (instant = false, stagger = false) => {
      const d = instant || reduced ? 0 : STEP;
      const below = w() < BP.desktop;
      liveTimers.splice(0).forEach((t) => t.kill());

      cards.forEach(({ el, plate, media, desc }, i) => {
        const opts = { duration: d, ease: EASE, overwrite: "auto" as const };

        if (!arrived) {
          // Waiting under the title: every plate stacked a little low, and
          // on phones the first card's copy already showing above it.
          const shown = w() < BP.tablet && i === 0;
          gsap.to(plate, { ...opts, scale: 0.95, y: "10%", opacity: 1 });
          gsap.to(media, { ...opts, scale: 1.2, opacity: 1 });
          gsap.to(desc, {
            ...opts,
            opacity: shown ? 1 : 0,
            y: shown ? "0%" : "50%",
            scale: below && i > 0 ? 0.8 : 1,
          });
          setLive(el, false);
          return;
        }

        const slot = i - current;
        if (slot < 0) {
          // Lifted straight off the top.
          gsap.to(plate, { ...opts, scale: 1, y: -vh(), opacity: 1 });
          gsap.to(desc, { ...opts, y: below ? -vh() : "-60%" });
          gsap.to(desc, { ...opts, opacity: 0, duration: d * 0.45 });
          setLive(el, false);
        } else if (slot === 0) {
          gsap.to(plate, { ...opts, scale: 1, y: 0, opacity: 1 });
          gsap.to(media, { ...opts, scale: 1, opacity: 1 });
          gsap.to(desc, { ...opts, opacity: 1, y: "0%", scale: 1, delay: d ? 0.1 : 0 });
          // Live from halfway in, like the scrubbed version.
          if (d) liveTimers.push(gsap.delayedCall(d / 2, () => setLive(el, true)));
          else setLive(el, true);
        } else {
          const delay = stagger && d ? 0.15 * Math.min(slot, 2) : 0;
          gsap.to(plate, { ...opts, delay, scale: 1 - 0.15 * slot, y: `${12 * slot}%`, opacity: 1 });
          gsap.to(media, { ...opts, delay, scale: 1.05, opacity: Math.max(0, 0.5 - slot / 5) });
          gsap.to(desc, { ...opts, opacity: 0, y: `${90 * slot}%`, scale: below ? 0.8 : 1 });
          setLive(el, false);
        }
      });
    };

    render(true);

    /* ---- the lock: while pinned, scroll gestures step the deck ---- */

    let pin: ScrollTrigger | null = null;
    let locked = false;
    let lastStep = 0;

    // A phone flick keeps coasting after the finger lifts, and blocking
    // touchmove can't stop that; hiding the page's overflow does. Touch only,
    // so a desktop scrollbar never disappears and shifts the layout.
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const setLocked = (on: boolean) => {
      locked = on;
      if (touch) document.documentElement.style.overflow = on ? "hidden" : "";
    };

    const lock = () => {
      // A nav link's scroll (back to the hero, down to a section) runs
      // straight through the deck; only the user's own scrolling is caught.
      if (isJumping()) return;
      setLocked(true);
      // The wheel stream that carried the page here is still running;
      // treat it as the gesture in progress so it doesn't also step a card.
      inGesture = true;
      lastWheel = performance.now();
      endGestureSoon();
    };

    const release = (dir: 1 | -1) => {
      setLocked(false);
      if (!pin) return;
      // Anywhere inside the pin looks the same, so jumping to its edge is
      // invisible, and the next scroll carries straight on out.
      window.scrollTo({ top: dir > 0 ? pin.end : pin.start, behavior: "instant" });
    };

    const step = (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastStep < STEP_GAP) return;
      lastStep = now;
      const next = current + dir;
      if (next < 0 || next > last) {
        release(dir);
        return;
      }
      current = next;
      render();
    };

    // Wheel: calebwu.ca's gesture rule. A gesture steps once when it starts;
    // a sudden jump in speed mid-stream (a fresh flick through trackpad
    // momentum) counts as a new one.
    let inGesture = false;
    let lastWheel = 0;
    let lastSpeed = 0;
    let gestureEnd: ReturnType<typeof setTimeout> | undefined;
    const endGestureSoon = () => {
      clearTimeout(gestureEnd);
      gestureEnd = setTimeout(() => {
        inGesture = false;
        lastSpeed = 0;
      }, GESTURE_GAP);
    };
    const onWheel = (e: WheelEvent) => {
      if (!locked) return;
      e.preventDefault();
      const now = performance.now();
      const dy = Math.abs(e.deltaY);
      const dt = now - lastWheel;
      const speed = dt > 0 ? dy / dt : 0;
      const spike = lastSpeed > 0 && speed > 2 * lastSpeed && speed > 1;
      if ((!inGesture || spike) && dy > 0) step(e.deltaY > 0 ? 1 : -1);
      inGesture = true;
      lastSpeed = speed;
      lastWheel = now;
      endGestureSoon();
    };

    // Touch: one swipe, one card.
    let touchStartY = 0;
    let touchY = 0;
    let touchT = 0;
    let touchV = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!locked) return;
      touchStartY = touchY = e.touches[0].clientY;
      touchT = Date.now();
      touchV = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!locked) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const now = Date.now();
      const dt = now - touchT;
      if (dt > 0) touchV = (touchY - y) / dt;
      touchY = y;
      touchT = now;
    };
    const onTouchEnd = () => {
      if (!locked) return;
      const dist = touchStartY - touchY;
      if (Math.abs(touchV) > SWIPE_V || Math.abs(dist) > SWIPE_D) {
        step((Math.abs(touchV) > SWIPE_V ? touchV : dist) > 0 ? 1 : -1);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!locked) return;
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      step(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    // Desktop hover: "Click to view" scrambles in over the card, letters
    // cycling through random characters before they settle, left to right.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hoverOff: (() => void)[] = [];
    if (fine && !reduced) {
      cards.forEach(({ el }) => {
        const link = el.querySelector<HTMLElement>(`.${s.plateLink}`);
        const text = el.querySelector<HTMLElement>("[data-view-text]");
        if (!link || !text) return;
        const onViewEnter = () =>
          gsap.to(text, {
            duration: 0.7,
            ease: "none",
            overwrite: true,
            scrambleText: { text: VIEW_LABEL, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.1 },
          });
        link.addEventListener("mouseenter", onViewEnter);
        hoverOff.push(() => link.removeEventListener("mouseenter", onViewEnter));
      });
    }

    const ctx = gsap.context(() => {
      // The first card comes up as the section scrolls in, and the stack
      // builds behind it.
      ScrollTrigger.create({
        trigger: carousel,
        start: () => (w() < BP.tablet ? "top center-=100" : "top center+=100"),
        onEnter: () => {
          arrived = true;
          current = 0;
          render(false, true);
        },
        onLeaveBack: () => {
          // Normally the deck is back on its first card by now. After a jump
          // (a nav link) it may not be, and the lifted cards would fly down
          // across the section above, so they snap instead.
          const jumped = current !== 0;
          arrived = false;
          current = 0;
          render(jumped);
        },
      });

      pin = ScrollTrigger.create({
        trigger: carousel,
        start: "center center",
        // One viewport of pin: room to catch a fast flick before it locks.
        end: () => `+=${vh()}`,
        pin: true,
        // Pin a frame early so a fast flick on a phone doesn't show the
        // carousel scroll past before it locks.
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (current !== 0) {
            current = 0;
            render();
          }
          lock();
        },
        onEnterBack: () => {
          arrived = true;
          if (current !== last) {
            current = last;
            render();
          }
          lock();
        },
        onLeave: () => setLocked(false),
        onLeaveBack: () => setLocked(false),
      });
    }, carousel);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      hoverOff.forEach((off) => off());
      clearTimeout(gestureEnd);
      liveTimers.forEach((t) => t.kill());
      setLocked(false);
      ctx.revert();
    };
  }, []);

  return (
    <section className={s.section}>
      <section className={s.intro}>
        <h2 className={s.title}>
          Our
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
                  {card.story.caseStudy && (
                    <Link href={card.story.caseStudy} className={s.caseStudy}>
                      <span className={s.caseStudyLabel}>View case study</span>
                      <svg
                        viewBox="0 0 12 12"
                        aria-hidden
                        className={s.caseStudyArrow}
                      >
                        <path
                          d="M3 9 9 3M4.5 3H9v4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  )}
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
                {/* Desktop hover label; the text scrambles in (see onViewEnter). */}
                <span aria-hidden className={s.viewLabel}>
                  <span data-view-text>{VIEW_LABEL}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
