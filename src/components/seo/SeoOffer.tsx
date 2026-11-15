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
 * out of masks (SplitText, as on the homepage), the grey box lifts in and its
 * quote badge pops onto the corner, the quote follows line by line, the
 * photo is uncovered from below and then drifts as you scroll, and each step
 * draws its rule left to right before its words rise. Nothing moves with
 * reduced motion.
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import s from "./SeoOffer.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const QUOTE =
  "We’ll pick 5 searches with you. Within 6 months you’ll be in the top 3 on Google for at least 3 of them. If you’re not, we keep working for free until you are.";

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
    when: "Months 2 to 5",
    step: "Climb every month",
    text: "More reviews, more mentions and new pages, plus work on what AI says about you. A short video each month shows what changed.",
  },
  {
    when: "Month 6",
    step: "Check the promise",
    text: "Top 3 on Google for at least 3 of your 5, on the map or in the regular results.",
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
    const splits: SplitText[] = [];
    const lines = (node: Element) => {
      const sp = SplitText.create(node, { type: "lines", mask: "lines", linesClass: s.line });
      splits.push(sp);
      return sp.lines;
    };

    const ctx = gsap.context(() => {
      // the promise: title lines, then the box, its badge, quote and signature
      const promise = q("[data-m='promise']");
      const tl = gsap.timeline({ scrollTrigger: { trigger: promise, start: "top 78%", once: true } });
      tl.fromTo(
        q("[data-m='promiseBg'] img"),
        { scale: 1.15 },
        { scale: 1, duration: 2.2, ease: EASE },
        0,
      )
        .from(q("[data-m='promiseLabel']"), { y: 12, opacity: 0, duration: 0.7, ease: EASE }, 0)
        .from(lines(q("[data-m='title']")), { yPercent: 105, duration: 1.1, ease: EASE, stagger: 0.09 })
        .from(q("[data-m='box']"), { y: 70, opacity: 0, scale: 0.96, duration: 1.2, ease: EASE }, 0.15)
        .from(q("[data-m='badge']"), { scale: 0, rotate: -20, transformOrigin: "left bottom", duration: 0.8, ease: "back.out(2.2)" }, 0.6)
        .from(lines(q("[data-m='quote']")), { yPercent: 105, duration: 0.9, ease: EASE, stagger: 0.07 }, 0.45)
        .from(q("[data-m='sign']"), { x: -18, opacity: 0, duration: 0.8, ease: EASE }, 0.85);

      // the solution's photo drifts slower than the page (parallax): the
      // layer is taller than the band (see .promiseBg) and slides through it
      gsap.fromTo(
        q("[data-m='promiseBg']"),
        { yPercent: -9 },
        { yPercent: 9, ease: "none", scrollTrigger: { trigger: promise, start: "top bottom", end: "bottom top", scrub: true } },
      );

      // how it works: label and heading, then the photo uncovered from below
      const left = q("[data-m='processHead']");
      gsap
        .timeline({ scrollTrigger: { trigger: left, start: "top 78%", once: true } })
        .from(q("[data-m='label']"), { y: 12, opacity: 0, duration: 0.7, ease: EASE })
        .from(lines(q("[data-m='processTitle']")), { yPercent: 105, duration: 1.1, ease: EASE, stagger: 0.09 }, 0.1);

      const photo = q("[data-m='photo']");
      const img = q("[data-m='photo'] img");
      gsap
        .timeline({ scrollTrigger: { trigger: photo, start: "top 85%", once: true } })
        .fromTo(photo, { clipPath: "inset(100% 0% 0% 0% round 10px)" }, { clipPath: "inset(0% 0% 0% 0% round 10px)", duration: 1.4, ease: "expo.inOut" })
        .from(img, { scale: 1.3, duration: 1.8, ease: EASE }, 0.1);
      // then it drifts a little as the page scrolls past
      gsap.fromTo(
        q("[data-m='photoInner']"),
        { yPercent: -5 },
        { yPercent: 5, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } },
      );

      // the steps: the top rule, then each row draws its rule and its words rise
      gsap.from(q("[data-m='topRule']"), {
        scaleX: 0,
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: { trigger: q("[data-m='steps']"), start: "top 85%", once: true },
      });
      qa("[data-m='step']").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
          .from(row.querySelector("[data-m='rule']"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from(row.querySelectorAll("[data-m='rise']"), { y: 22, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.08 }, 0.1);
      });
    }, el);

    return () => {
      ctx.revert();
      splits.forEach((sp) => sp.revert());
    };
  }, [root]);
}

export default function SeoOffer() {
  const root = useRef<HTMLElement>(null);
  useOfferMotion(root);
  return (
    <section ref={root} className={s.offer} data-section="offer">
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
              We help your business get to the top when people near you look you up.
            </h2>
          </div>
          <figure className={s.box} data-m="box">
            <span className={s.badge} data-m="badge" aria-hidden>
              <svg viewBox="4 6 16 12" fill="currentColor">
                <path d="M10 6.5C6.6 7.4 4.5 10.2 4.5 13.8v3.7h5.6v-5.6H7.4c.1-2 1.3-3.4 3.2-4l-.6-1.4Zm9 0c-3.4.9-5.5 3.7-5.5 7.3v3.7h5.6v-5.6h-2.7c.1-2 1.3-3.4 3.2-4l-.6-1.4Z" />
              </svg>
            </span>
            <blockquote className={s.quote} data-m="quote">{QUOTE}</blockquote>
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

        <div className={s.processHead} data-m="processHead">
          <p className={s.label} data-m="label">
            How it works
          </p>
          <h3 className={s.processTitle} data-m="processTitle">Everything it takes to get you into the top 3, month by month.</h3>
        </div>
        <div className={s.process}>
          <div className={s.processLeft}>
            <div className={s.photo} data-m="photo">
              <div className={s.photoInner} data-m="photoInner">
                <Image src="/seo/offer-planing.webp" alt="" fill sizes="(max-width: 900px) 100vw, 34vw" className={s.photoImg} />
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
