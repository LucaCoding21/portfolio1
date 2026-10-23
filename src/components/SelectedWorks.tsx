"use client";

/**
 * "Our selected works" intro and the pinned feature cards beneath
 * it, cloned from a reference site's features carousel. The card plates carry
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
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SUCCESS_STORIES } from "@/data/successStories";
import StoryDescription from "./StoryDescription";
import { steadyVh } from "@/lib/viewport";
import s from "./SelectedWorks.module.css";

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

/* The desktop hover label. */
const VIEW_LABEL = "Click to view";

/* Below desktop each card holds in front for a stretch of scroll before it
   lifts (the reference runs straight from arriving into leaving). In
   timeline units, where a card's arrival is 2; the scroll distances grow by
   the same share so the moves themselves keep their pace. */
const HOLD = 1.2;

/* The first card is already in front as the section pins on a phone, so
   its hold is shorter; the scroll distances drop by the same amount. */
const FIRST_HOLD = 0.5;

/* Both run only on a change of state (see setLive), never per frame: a
   play() on a phone reports `paused` for a moment while it starts, and
   resetting the time on every scrub frame kept the reel stuck on frame 0. */
/* A seek makes a video load, so only rewind one that has moved: resetting
   the cards that never played would pull every reel in on page load. */
const rewind = (v: HTMLVideoElement) => {
  if (v.currentTime !== 0) v.currentTime = 0;
};
const play = (v: HTMLVideoElement | null) => {
  if (!v) return;
  rewind(v);
  v.play().catch(() => {});
};
const pause = (v: HTMLVideoElement | null) => {
  if (!v) return;
  v.pause();
  rewind(v);
};

export default function SelectedWorks({ ready }: { ready: boolean }) {
  const carouselRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh(true);
  }, [ready]);

  /* The reels buffer in full, but only once the section is about a screen
     and a half away: early enough that the first frames are there the moment a card
     goes live, late enough that they don't compete with the first screen. */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.querySelectorAll("video").forEach((v) => {
          v.preload = "auto";
          if (v.readyState === 0) v.load();
        });
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    // sequence order: index 0 = DOM last
    const els = [...cardRefs.current].reverse();
    if (!carousel || !track || els.some((e) => !e)) return;
    const elements = els as HTMLDivElement[];

    const w = () => window.innerWidth;
    // The same height the stylesheet sizes the carousel with (lib/viewport).
    const vh = steadyVh;
    // Set once at build: the hold is baked into the timeline's positions.
    const hold = w() < BP.tablet ? HOLD : 0;
    const firstHold = w() < BP.tablet ? FIRST_HOLD : 0;
    const stretch = (2 + hold) / 2;
    // Viewport heights saved by the shorter first hold (a timeline unit is
    // half a viewport height of scroll).
    const trim = (hold - firstHold) / 2;
    const holdFor = (k: number) => (k === 0 ? firstHold : hold);

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
    const leave = (el: HTMLElement) => (w() < BP.tablet ? fadeAway(el) : lift(el));

    /* Phones: the card doesn't travel a full screen up. It rises a little
       and fades, the copy first, so the next card shows through behind it.
       It stays live until it has faded: switching it off mid-move sent the
       reel back down on its own CSS transition while the plate scrubbed up
       with the finger, so the video trailed the card. Padded to the full
       lift's length so every later card keeps its place in the scroll. */
    const fadeAway = (el: HTMLElement) => {
      const plate = el.querySelector<HTMLElement>(`.${s.plate}`);
      const desc = el.querySelector<HTMLElement>(`.${s.descriptionAnim}`);
      const tl = gsap.timeline({
        defaults: { ease: "power1.in" },
        onUpdate: () => setLive(el, tl.time() < 1.4),
      });
      if (!plate || !desc) return tl;
      tl.to(el, { scale: 1, y: 0 }, 0);
      tl.to(desc, { y: "-40%", opacity: 0, duration: 0.6 }, 0);
      tl.to(plate, { y: "-22%", scale: 0.96, duration: 1.4 }, 0);
      tl.to(plate, { opacity: 0, duration: 1.1 }, 0.3);
      tl.to({}, { duration: 3 }, 0);
      return tl;
    };

    const lift = (el: HTMLElement) => {
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
        if (holdFor(k)) tl.to({}, { duration: holdFor(k) });
      }
      tl.add(enter(el), i === 0 ? 0 : undefined);
      if (holdFor(i)) tl.to({}, { duration: holdFor(i) });
      if (i < elements.length - 1) tl.add(leave(el));
      return tl;
    };

    // Desktop hover: a "Click to view" tag rides just below and right of the cursor.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hoverOff: (() => void)[] = [];
    if (fine) {
      elements.forEach((el) => {
        const link = el.querySelector<HTMLElement>(`.${s.plateLink}`);
        const label = el.querySelector<HTMLElement>(`.${s.viewLabel}`);
        if (!link || !label) return;
        const toX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
        const toY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });
        // The plate is scaled while it moves; map the pointer back into its
        // own unscaled box so the tag stays pinned to the cursor.
        const local = (e: MouseEvent) => {
          const r = link.getBoundingClientRect();
          const k = link.offsetWidth / r.width || 1;
          return [(e.clientX - r.left) * k, (e.clientY - r.top) * k];
        };
        const onViewEnter = (e: MouseEvent) => {
          const [x, y] = local(e);
          gsap.set(label, { x, y });
        };
        const onViewMove = (e: MouseEvent) => {
          const [x, y] = local(e);
          toX(x);
          toY(y);
        };
        link.addEventListener("mouseenter", onViewEnter);
        link.addEventListener("mousemove", onViewMove);
        hoverOff.push(() => {
          link.removeEventListener("mouseenter", onViewEnter);
          link.removeEventListener("mousemove", onViewMove);
        });
      });
    }

    // Below tablet each card's copy sits above its plate, and the copy runs
    // to different heights. Measure them so the stylesheet can clear the
    // menu for the tallest (--copy-h) and centre every card on the same
    // line (--dy moves a card up by half of what its copy is short by).
    // Runs before each ScrollTrigger measure, so fonts landing or a
    // rotation are picked up.
    // Not parentElement: once pinned, that is GSAP's pin-spacer.
    const section = carousel.closest<HTMLElement>(`.${s.section}`);
    const fitCopy = () => {
      if (!section) return;
      const heights = elements.map(
        (el) => el.querySelector<HTMLElement>(`.${s.description}`)?.offsetHeight ?? 0
      );
      if (w() >= BP.tablet || heights.some((h) => h === 0)) {
        section.style.removeProperty("--copy-h");
        elements.forEach((el) => el.style.removeProperty("--dy"));
        return;
      }
      const tallest = Math.max(...heights);
      section.style.setProperty("--copy-h", `${tallest + 25}px`);
      elements.forEach((el, i) => el.style.setProperty("--dy", `${-(tallest - heights[i]) / 2}px`));
    };
    fitCopy();
    ScrollTrigger.addEventListener("refreshInit", fitCopy);

    // Below tablet the carousel holds still with CSS sticky instead of a
    // GSAP pin. A pin is moved by script, a frame behind iOS's own scrolling,
    // so the cards jerked as it caught and let go, worst on a flick; sticky
    // is placed by the browser in step with the finger. The track is the
    // pin's spacer: the carousel's height plus the distance it holds for,
    // and the carousel sticks with its centre on the screen's centre, where
    // the pin started ("center center"). Set once at build, like the hold.
    const sticky = w() < BP.tablet;
    const holdDistance = () =>
      w() >= BP.desktop
        ? (2.2 + EXTRA) * vh()
        : w() >= BP.tablet
          ? (3 + EXTRA) * vh() * stretch
          : ((2.5 + EXTRA) * stretch - trim) * vh();
    const sizeTrack = () => {
      track.style.height = `${carousel.offsetHeight + holdDistance()}px`;
      carousel.style.top = `${(vh() - carousel.offsetHeight) / 2}px`;
    };
    if (sticky) {
      track.dataset.sticky = "";
      sizeTrack();
      ScrollTrigger.addEventListener("refreshInit", sizeTrack);
    }

    const ctx = gsap.context(() => {
      const initial = start();

      if (!sticky) {
        ScrollTrigger.create({
          trigger: carousel,
          start: "center center",
          end: () => `+=${holdDistance()}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      // Touch screens scrub straight off the finger; a mouse wheel gets the
      // reference's short smoothing.
      const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // A stuck carousel moves with the screen, so measure from the
          // track, which starts where the carousel rests.
          trigger: sticky ? track : carousel,
          start: () => (w() < BP.tablet ? "top center-=100" : "top center+=100"),
          end: () => `+=${((3 + EXTRA) * stretch - trim) * vh()}`,
          scrub: touch ? true : 0.25,
          invalidateOnRefresh: true,
        },
      });
      master.add(initial, 0);
      elements.forEach((_, i) => master.add(next(i), 0));
    }, carousel);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", fitCopy);
      ScrollTrigger.removeEventListener("refreshInit", sizeTrack);
      delete track.dataset.sticky;
      track.style.removeProperty("height");
      carousel.style.removeProperty("top");
      hoverOff.forEach((off) => off());
      ctx.revert();
    };
  }, []);

  return (
    <section className={s.section} data-section="selected-works">
      <section className={s.intro}>
        <h2 className={s.title}>
          Our
          <br />
          selected works
        </h2>
      </section>

      <div ref={trackRef} className={s.track}>
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
                        {/* Buffered as the section approaches (see above). */}
                        <video src={card.story.video} loop muted playsInline preload="none" />
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
                  {/* Desktop hover tag that follows the cursor (see onViewMove). */}
                  <span aria-hidden className={s.viewLabel}>
                    <span className={s.viewPill}>
                      {VIEW_LABEL}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
