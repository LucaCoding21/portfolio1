"use client";

/**
 * The offer, under "The problem" on /seo (Nov 14 2026), in two parts:
 *
 *   promise   the answer to "The problem": "The solution" (in its label's type) and a
 *             heading that answers its heading (they call someone else; we
 *             get you showing up first), in the same type (Nov 15 2026; it
 *             repeated the promise word for word before); under it a grey
 *             box with the promise in our words, big black quote marks on
 *             its top edge (no circle), and William and Irish signing it.
 *             Redesigned Nov 15 2026: a full-width photo behind it all
 *             (William's pick: Pexels 36115689, Alinson Torres, black and
 *             white, people hurrying down a white stairwell, cut to a wide
 *             band through its middle), the label and heading in white top left and
 *             the white quote box bottom right (its quote marks inside it),
 *             the person left clear between them
 *   process   "How it works": the label and a big heading across the top
 *             (Nov 15 2026, so it reads as a section heading, laid out after
 *             a reference William sent), then a woodshop photo on the left
 *             and five ruled steps on the right, their tops level, from
 *             week 1 to after month 6
 *
 * Built with William over many rounds on a dev board, from his references
 * (an editorial look: lots of white, small sentence-case labels, hairline
 * rules). Turned down on the way: cards, a photo card, a six-month track, a
 * scorecard, tabs, a slider, big numbers, a sentence with notes, a ruler, a
 * question and answers, a highlighter, a stamp, a typed search. The promise's
 * terms are William's (CLAUDE.md, "Monthly SEO page"); keep them in step with
 * the hero, the FAQ, the meta and llms.txt. The step timings
 * are a first pass that William hasn't confirmed. The photo is Pexels
 * 11127339, a woodworker planing at a sawdusty bench, in warm film colour
 * (Nov 15 2026: William asked for a colour photo in place of the black and
 * white carpenter, Pexels 16850261; a woodshop shot and a welder were tried
 * before that).
 *
 * Scroll motion (Nov 14 2026, by request; the rest of the page has none):
 * each part plays once as it comes into view. The headings rise line by line
 * out of masks (riseLines), the grey box lifts in and its
 * quote badge pops onto the corner, the quote follows line by line, the
 * photo is uncovered from below and then drifts as you scroll, and each step
 * draws its rule left to right before its words rise. Nothing moves with
 * reduced motion.
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { GUARANTEE_QUOTE } from "./guarantee";
import { loadScrollMotion, riseLines, seen } from "./scrollMotion";
import s from "./SeoOffer.module.css";

// Nov 23 2026, William's words: the hero's new guarantee, with its 12 months
// (the steps below check it at month 12) ("We'll pick 5
// searches with you... top 3 on Google for at least 3 of them..." before)
const QUOTE = GUARANTEE_QUOTE;

const STEPS = [
  {
    when: "Week 1",
    step: "Pick your 5 searches",
    text: "We look at who comes up first for the work you want, then pick your 5 main searches together. They go into your agreement.",
  },
  {
    when: "Month 1",
    step: "Fix the foundations",
    text: "Your Google listing filled in properly, pages for your jobs and towns, and your business listed on the sites Google trusts.",
  },
  {
    when: "Months 2 to 11",
    step: "Climb every month",
    text: "More reviews, more mentions and new pages, plus work on what AI says about you.",
  },
  {
    when: "Month 12",
    step: "Check the promise",
    text: "We add up the gross profit from your new work and compare it with what you’ve paid us.",
  },
  {
    when: "After that",
    step: "Month to month, or free",
    text: "If you’re there, it’s month to month. If not, we keep working for free until you are.",
  },
];

const EASE = "expo.out";

function useOfferMotion(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!;
    const qa = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
    const undo: (() => void)[] = [];
    // A heading's lines rise out of masks, then it goes back to plain text
    // (riseLines). Anything already on screen when the script arrives is left
    // still (see `seen`), so a slow phone never sees words vanish and come back.
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    loadScrollMotion()
      .then(() => {
        if (cancelled) return;
        const rise = (tl: gsap.core.Timeline, node: HTMLElement, at: number, vars: gsap.TweenVars) =>
          undo.push(riseLines(tl, node, at, vars));
        ctx = gsap.context(() => {
          // the promise: title lines, then the box, its badge, quote and
          // signature (each part is its own section since Nov 23 2026, so
          // each animates only what it holds)
          const promise = el.querySelector("[data-m='promise']");
          if (promise) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: promise, start: "top 78%", once: true },
            });
            if (!seen(promise)) {
              tl.fromTo(q("[data-m='promiseBg'] img"), { scale: 1.15 }, { scale: 1, duration: 2.2, ease: EASE }, 0);
            }
            const label = q("[data-m='promiseLabel']");
            if (!seen(label)) tl.from(label, { y: 12, opacity: 0, duration: 0.7, ease: EASE }, 0);
            // at 0.1, just after the label: with no position it went after
            // the photo's 2.2s zoom, and the heading stayed blank for about
            // 2.7s once it was on screen (Nov 25 2026)
            const title = q<HTMLElement>("[data-m='title']");
            if (!seen(title)) rise(tl, title, 0.1, { duration: 1.1, ease: EASE, stagger: 0.09 });
            if (!seen(q("[data-m='box']"))) {
              tl.from(q("[data-m='box']"), { y: 70, opacity: 0, scale: 0.96, duration: 1.2, ease: EASE }, 0.15)
                .from(
                  q("[data-m='badge']"),
                  {
                    scale: 0,
                    rotate: -20,
                    transformOrigin: "left bottom",
                    duration: 0.8,
                    ease: "back.out(2.2)",
                  },
                  0.6,
                )
                .from(q("[data-m='sign']"), { x: -18, opacity: 0, duration: 0.8, ease: EASE }, 0.85);
              rise(tl, q<HTMLElement>("[data-m='quote']"), 0.45, { duration: 0.9, ease: EASE, stagger: 0.07 });
            }

            // the solution's photo drifts slower than the page (parallax): the
            // layer is taller than the band (see .promiseBg) and slides through it
            gsap.fromTo(
              q("[data-m='promiseBg']"),
              { yPercent: -9 },
              {
                yPercent: 9,
                ease: "none",
                scrollTrigger: {
                  trigger: promise,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          // how it works: label and heading, then the photo uncovered from below
          const left = el.querySelector("[data-m='processHead']");
          if (!left) return;
          if (!seen(left)) {
            const tl = gsap
              .timeline({
                scrollTrigger: { trigger: left, start: "top 78%", once: true },
              })
              .from(q("[data-m='label']"), {
                y: 12,
                opacity: 0,
                duration: 0.7,
                ease: EASE,
              });
            rise(tl, q<HTMLElement>("[data-m='processTitle']"), 0.1, { duration: 1.1, ease: EASE, stagger: 0.09 });
          }

          const photo = q("[data-m='photo']");
          const img = q("[data-m='photo'] img");
          if (!seen(photo)) {
            gsap
              .timeline({
                scrollTrigger: { trigger: photo, start: "top 85%", once: true },
              })
              .fromTo(
                photo,
                { clipPath: "inset(100% 0% 0% 0% round 10px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 10px)",
                  duration: 1.4,
                  ease: "expo.inOut",
                },
              )
              .from(img, { scale: 1.3, duration: 1.8, ease: EASE }, 0.1);
          }
          // then it drifts a little as the page scrolls past
          gsap.fromTo(
            q("[data-m='photoInner']"),
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: photo,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          // the steps: the top rule, then each row draws its rule and its words rise
          const steps = q("[data-m='steps']");
          if (!seen(steps)) {
            gsap.from(q("[data-m='topRule']"), {
              scaleX: 0,
              duration: 1.2,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: steps,
                start: "top 85%",
                once: true,
              },
            });
          }
          qa("[data-m='step']")
            .filter((row) => !seen(row))
            .forEach((row) => {
              gsap
                .timeline({
                  scrollTrigger: { trigger: row, start: "top 88%", once: true },
                })
                .from(row.querySelector("[data-m='rule']"), {
                  scaleX: 0,
                  duration: 1.2,
                  ease: "expo.inOut",
                })
                .from(
                  row.querySelectorAll("[data-m='rise']"),
                  { y: 22, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.08 },
                  0.1,
                );
            });
        }, el);
      })
      // if the script can't load, the words simply stay where they are
      .catch(() => {});

    return () => {
      cancelled = true;
      undo.forEach((fn) => fn());
      ctx?.revert();
    };
  }, [root]);
}

/**
 * Two sections since Nov 23 2026, when William swapped "How it works" with
 * the six things (SeoGet): `part="promise"` is the solution band under the
 * problem cards, `part="process"` is "How it works", after the proof.
 */
export default function SeoOffer({ part }: { part: "promise" | "process" }) {
  const root = useRef<HTMLElement>(null);
  useOfferMotion(root);
  if (part === "promise") {
    return (
      <section ref={root} className={`${s.offer} ${s.promiseOnly}`} data-section="offer">
        <div className={s.inner}>
          <div className={s.promise} data-m="promise">
            <div className={s.promiseBg} data-m="promiseBg" aria-hidden>
              <Image src="/seo/solution-stairwell.webp" alt="" fill sizes="100vw" className={s.promiseImg} />
            </div>
            <div className={s.promiseHead}>
              <p className={s.promiseLabel} data-m="promiseLabel">
                The solution
              </p>
              <h2 className={s.title} data-m="title">
                We get your business to the top of Google for the jobs and towns you want, and keep it there.
              </h2>
            </div>
            <figure className={s.box} data-m="box">
              <span className={s.badge} data-m="badge" aria-hidden>
                <svg viewBox="4 6 16 12" fill="currentColor">
                  <path d="M10 6.5C6.6 7.4 4.5 10.2 4.5 13.8v3.7h5.6v-5.6H7.4c.1-2 1.3-3.4 3.2-4l-.6-1.4Zm9 0c-3.4.9-5.5 3.7-5.5 7.3v3.7h5.6v-5.6h-2.7c.1-2 1.3-3.4 3.2-4l-.6-1.4Z" />
                </svg>
              </span>
              <blockquote className={s.quote} data-m="quote">
                {QUOTE}
              </blockquote>
              <figcaption className={s.sign} data-m="sign">
                <span className={s.faces}>
                  <Image src="/free-homepage-design/team/william-face.webp" alt="" width={44} height={44} />
                  <Image src="/free-homepage-design/team/irish-photo.webp" alt="" width={44} height={44} />
                </span>
                <span>
                  <strong>William and Irish</strong>
                  <br />
                  Founders, Cloverfield Studio, Surrey, BC
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section ref={root} className={s.offer} data-section="process">
      <div className={s.inner}>
        <div className={s.processHead} data-m="processHead">
          <p className={s.label} data-m="label">
            How it works
          </p>
          <h2 className={s.processTitle} data-m="processTitle">
            Everything it takes to get you into the top 3, month by month.
          </h2>
        </div>
        <div className={s.process}>
          <div className={s.processLeft}>
            <div className={s.photo} data-m="photo">
              <div className={s.photoInner} data-m="photoInner">
                <Image
                  src="/seo/offer-planing.webp"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 34vw"
                  className={s.photoImg}
                />
              </div>
            </div>
          </div>
          <ol className={s.steps} data-m="steps">
            <li className={`${s.rule} ${s.topRule}`} data-m="topRule" aria-hidden />
            {STEPS.map((st, i) => (
              <li key={st.step} className={s.step} data-m="step" data-last={i === STEPS.length - 1 || undefined}>
                <p className={s.stepName} data-m="rise">
                  <span className={s.when}>{st.when}</span> {st.step}
                </p>
                <p className={s.text} data-m="rise">
                  {st.text}
                </p>
                <span className={s.rule} data-m="rule" aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
