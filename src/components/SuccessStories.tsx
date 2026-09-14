"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CustomEase } from "gsap/dist/CustomEase";
import { SUCCESS_STORIES } from "@/data/successStories";
import styles from "./SuccessStories.module.css";

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface SuccessStoriesProps {
  ready: boolean;
}

/** The reference's "ease-transition" curve. */
const EASE_TRANSITION = "ss-ease-transition";

/** Seconds. The reference's `fast` / `normal` timing tokens. */
const FAST = 0.3;
const NORMAL = 0.65;

/** Pixels the cover image drifts, from entering the viewport to leaving it. */
const PARALLAX = 125;

/** The eyebrow's two words, animated in one after the other. */
const EYEBROW_WORDS = ["Success", "Stories"];

export default function SuccessStories({ ready }: SuccessStoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const eyebrowTextRef = useRef<HTMLDivElement>(null);
  const eyebrowCircleRef = useRef<HTMLDivElement>(null);

  // Loader lifts `position: fixed` off the body when it finishes; measure again.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh(true);
  }, [ready]);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const eyebrowText = eyebrowTextRef.current;
    const eyebrowCircle = eyebrowCircleRef.current;
    if (!section || !eyebrow || !eyebrowText || !eyebrowCircle) return;

    if (!CustomEase.get(EASE_TRANSITION)) {
      CustomEase.create(EASE_TRANSITION, "0.22, 1, 0.36, 1");
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Eyebrow intro: words slide in from the left with a skew, the circle
      // scales up, and the whole label eases across. Plays once on entry.
      const words = eyebrowText.querySelectorAll(`.${styles.eyebrowWord}`);
      const intro = gsap.timeline({ paused: true });
      intro
        .set(words, { xPercent: -40, opacity: 0, skewX: 15 })
        .set(eyebrowText, { xPercent: -10 })
        .set(eyebrowCircle, { scale: 0.4, opacity: 0, transformOrigin: "center center" })
        .set(eyebrow, { autoAlpha: 1 })
        .to(
          words,
          { xPercent: 0, opacity: 1, skewX: 0, duration: NORMAL, stagger: 0.05, ease: EASE_TRANSITION },
          0
        )
        .to(eyebrowText, { xPercent: 0, duration: FAST, ease: EASE_TRANSITION }, "-=0.15")
        .to(eyebrowCircle, { scale: 1, opacity: 1, duration: NORMAL, ease: EASE_TRANSITION }, "<");

      ScrollTrigger.create({
        trigger: eyebrow,
        start: "clamp(top 85%)",
        once: true,
        onEnter: () => intro.play(),
      });

      const mm = gsap.matchMedia();

      // Cover image parallax, desktop only. Scrubs from -125px to +125px as
      // the cover crosses the viewport, on top of the fixed 1.15 scale.
      mm.add("(min-width: 992px)", () => {
        if (reduced) return;
        section.querySelectorAll<HTMLElement>(`.${styles.cover}`).forEach((cover) => {
          const img = cover.querySelector<HTMLElement>(`.${styles.image}`);
          if (!img) return;
          gsap.fromTo(
            img,
            { y: -PARALLAX, scale: 1.15 },
            {
              y: PARALLAX,
              scale: 1.15,
              ease: "none",
              scrollTrigger: {
                trigger: cover,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
              immediateRender: false,
            }
          );
        });
      });

      // No hover on touch: the item in the middle band of the screen stands
      // its reel up instead.
      mm.add("(hover: none), (pointer: coarse)", () => {
        const triggers = Array.from(
          section.querySelectorAll<HTMLElement>(`.${styles.item}`)
        ).map((item) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => item.classList.add(styles.isActive),
            onLeave: () => item.classList.remove(styles.isActive),
            onEnterBack: () => item.classList.add(styles.isActive),
            onLeaveBack: () => item.classList.remove(styles.isActive),
          })
        );
        return () => triggers.forEach((t) => t.kill());
      });
    }, section);

    // Reels play only while on screen, so the hover reveal always lands on a
    // frame that is already moving.
    const videos = section.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0 }
    );
    videos.forEach((v) => io.observe(v));

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className={styles.wrap}>
      <div className={styles.contain}>
        <div className={styles.left}>
          <div ref={eyebrowRef} className={styles.eyebrow}>
            <div ref={eyebrowCircleRef} className={styles.eyebrowCircle} />
            <div
              ref={eyebrowTextRef}
              className={styles.eyebrowText}
              aria-label="Success Stories"
            >
              {EYEBROW_WORDS.map((word, i) => (
                <span key={word}>
                  {i > 0 ? " " : null}
                  <span className={styles.eyebrowWord} aria-hidden="true">
                    {word}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.collection}>
          <div role="list" className={styles.list}>
            {SUCCESS_STORIES.map((story, i) => (
              <div role="listitem" key={story.title} className={styles.item}>
                <Link href={story.href} className={`${styles.link} cursor-view`}>
                  <div className={styles.cover}>
                    <div className={styles.image}>
                      <Image
                        src={story.image}
                        alt=""
                        fill
                        sizes="(max-width: 479px) 100vw, (max-width: 991px) 58vw, 48vw"
                        priority={i === 0}
                      />
                    </div>
                    <div className={styles.overlay} />
                    <div className={styles.reel}>
                      <div className={styles.reelVideo}>
                        <video
                          className={styles.video}
                          src={story.video}
                          loop
                          muted
                          playsInline
                          preload="none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.content}>
                    <div className={styles.title}>
                      <h2 className={styles.heading}>{story.title}</h2>
                      <p className={styles.description}>{story.description}</p>
                    </div>
                    <div className={styles.result}>
                      <h3 className={styles.resultValue}>{story.resultValue}</h3>
                      <p className={styles.resultLabel}>{story.resultLabel}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
