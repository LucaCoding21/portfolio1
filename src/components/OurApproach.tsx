"use client";

/**
 * "Our approach", revealed from under the features section. The section is
 * sticky at the top of the viewport and starts one viewport early, tucked
 * behind the paper section above it; as that section scrolls off (with its
 * rounded bottom corners) this one is uncovered like a curtain, then scrolls
 * on normally once the curtain has cleared.
 *
 * A giant wordmark up top, then one row per phase: number, name and summary,
 * cover on the right, hairline rules between. Phases are the ones on
 * /approach. PLACEHOLDER: row covers are project shots standing in until
 * each phase has its own art.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./OurApproach.module.css";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    name: "Research",
    summary: "We study your market before we design anything.",
    image: "/success/innovative-aluminum.webp",
  },
  {
    name: "Kickoff",
    summary: "One call to lock how it looks and what it has to do.",
    image: "/success/wrapcity.webp",
  },
  {
    name: "Design",
    summary: "Every section earns the next scroll.",
    image: "/success/afterparty.webp",
  },
  {
    name: "Build and launch",
    summary: "Built in Next.js and GSAP. A 95+ speed score on nearly every site.",
    image: "/sophia/sophia-cover1.jpg",
  },
  {
    name: "Post-launch support",
    summary: "Once you're live, the whole site is on us.",
    image: "/clover/clover-cover.jpg",
  },
];

export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>(`.${s.row}`).forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
        tl.from(row, { "--rule": 0, duration: 1, ease: "power3.out" }, 0);
        tl.from(
          row.querySelectorAll("[data-rise]"),
          { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          0.1
        );
        tl.from(
          row.querySelector(`.${s.cover} img`),
          { scale: 1.08, duration: 1.4, ease: "power3.out" },
          0
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div className={s.stage}>
      <section ref={sectionRef} id="our-approach" className={s.wrap} aria-label="Our approach">
        <h2 className={s.wordmark}>Our approach</h2>

        <ol className={s.rows}>
          {PHASES.map((phase, i) => (
            <li key={phase.name} className={s.row}>
              <span className={s.index} data-rise>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={s.text}>
                <h3 className={s.name} data-rise>
                  {phase.name}
                </h3>
                <p className={s.summary} data-rise>
                  {phase.summary}
                </p>
              </div>
              <div className={s.cover}>
                <Image
                  src={phase.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 30vw"
                />
              </div>
            </li>
          ))}
        </ol>

        <div className={s.foot}>
          <Link href="/approach" className={s.link}>
            The whole process
            <span aria-hidden className={s.linkArrow}>
              &rarr;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
