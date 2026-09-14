"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  GRID_NUMBERS_COLUMNS,
  GRID_NUMBERS_INTRO,
  GRID_NUMBERS_LINK,
} from "@/data/gridNumbers";
import styles from "./GridNumbers.module.css";

gsap.registerPlugin(ScrollTrigger);

interface GridNumbersProps {
  ready: boolean;
}

/**
 * Motion is sized against a 2400px design width, so `px(n)`
 * is n/2400 of the viewport. The parallax column travels px(-480) = -20vw
 * and each card rises from px(60) = 2.5vw.
 */
const px = (n: number) => (n / 2400) * window.innerWidth;

/** Splits copy into inline-block words so each can be clipped and lifted. */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 ? " " : null}
          <span className={styles.word} aria-hidden="true">
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

export default function GridNumbers({ ready }: GridNumbersProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content0Ref = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh(true);
  }, [ready]);

  useEffect(() => {
    const section = sectionRef.current;
    const content0 = content0Ref.current;
    const content1 = content1Ref.current;
    if (!section || !content0 || !content1) return;

    const ctx = gsap.context(() => {
      // Word reveal, on every copy block: words start clipped at the bottom
      // and shifted down a line, then rise in a fast stagger on entry.
      section.querySelectorAll<HTMLElement>("[data-words]").forEach((block) => {
        const words = block.querySelectorAll<HTMLElement>(`.${styles.word}`);
        if (!words.length) return;
        gsap.set(words, { y: "100%", clipPath: "inset(0% 0% 100% 0%)" });
        const inView = block.getBoundingClientRect().top < window.innerHeight;
        ScrollTrigger.create({
          trigger: block,
          start: inView ? "top bottom" : "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(words, {
              y: "0%",
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "expo.out",
              duration: 1,
              stagger: 0.01,
            }),
        });
      });

      // Each card rises, un-shrinks and fades in once; cards further right
      // wait a beat longer, so the two columns arrive as a wave.
      section.querySelectorAll<HTMLElement>(`.${styles.group}`).forEach((group) => {
        gsap.set(group, { y: px(60), scale: 0.96, opacity: 0.0001 });
        ScrollTrigger.create({
          trigger: group,
          start: "top bottom",
          end: "bottom top",
          once: true,
          onEnter: () =>
            gsap.to(group, {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 2,
              ease: "expo.out",
              delay: 0.00025 * group.getBoundingClientRect().left,
            }),
        });
      });

      // Desktop parallax: the second column climbs 20vw against the first
      // while the first crosses the viewport.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1101px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: content0,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(content1, { y: () => px(-480), duration: 1 }, 0);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Underline sweeps out to the right on enter, then back in from the left.
  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const line = e.currentTarget.querySelector(`.${styles.underline}`);
    if (!line) return;
    gsap.killTweensOf(line);
    gsap.to(line, { x: "101%", duration: 0.6, ease: "expo.out" });
  };
  const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const line = e.currentTarget.querySelector(`.${styles.underline}`);
    if (!line) return;
    gsap.killTweensOf(line);
    gsap.set(line, { x: "-100%" });
    gsap.to(line, { x: "0%", duration: 0.6, ease: "expo.out" });
  };

  return (
    <section ref={sectionRef} id="about" className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.textItem}>
            <div className={styles.textBlock}>
              <p className={styles.intro} aria-label={GRID_NUMBERS_INTRO} data-words>
                <Words text={GRID_NUMBERS_INTRO} />
              </p>
              <div className={styles.actions}>
                <Link
                  href={GRID_NUMBERS_LINK.href}
                  className={styles.link}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={onLinkLeave}
                >
                  <span className={styles.linkText}>
                    {GRID_NUMBERS_LINK.label}
                    <span className={styles.underline} aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.gridItem}>
            {GRID_NUMBERS_COLUMNS.map((column, c) => (
              <div
                key={c}
                ref={c === 0 ? content0Ref : content1Ref}
                className={`${styles.content} ${c === 1 ? styles.content1 : ""}`}
              >
                {column.map((stat) => (
                  <div key={stat.label} className={styles.group}>
                    <div className={styles.number}>{stat.value}</div>
                    <p className={styles.label} aria-label={stat.label} data-words>
                      <Words text={stat.label} />
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
