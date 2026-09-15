"use client";

/**
 * Sits straight under the logo strip: headline, a line of studio copy, a row
 * of stats and the magnetic "Book a call" on the left; the two of us on the
 * right with the hand labels landing on the arrows already drawn in the photo.
 *
 * Text rises in on scroll and the stat figures count up from zero; the labels
 * write themselves in through HandLabel's own trigger.
 *
 * PLACEHOLDER: headline is lorem from the mockup and the four stats are the
 * mockup's figures. Swap for real ones.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HandLabel, { type HandLabelSpec } from "@/components/HandLabel";
import MagneticCta from "@/components/MagneticCta";
import s from "./TeamIntro.module.css";

gsap.registerPlugin(ScrollTrigger);

/** `value` counts up from zero on scroll; `suffix` is printed after it. */
const STATS = [
  { value: 500, suffix: "+", label: "Global Campaigns Delivered" },
  { value: 30, suffix: "+", label: "Global Filming Locations" },
  { value: 10, suffix: "M+", label: "Audience Views Generated" },
  { value: 100, suffix: "+", label: "Agencies Partnered With" },
];

/**
 * Same artwork and pairing as WhyCloverfield: the developer label sits above
 * the top-right arrow and runs past the photo's edge into the margin; the
 * designer label hangs under the bottom-left arrow, which runs to the very
 * bottom of the photo.
 */
const LABELS: readonly HandLabelSpec[] = [
  {
    key: "developer",
    title: "The Developer",
    className: "right-[-14%] top-[-9%] w-[62%]",
  },
  {
    key: "designer",
    title: "The Designer",
    className: "left-[-6%] top-[103%] w-[52%]",
  },
];

export default function TeamIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-rise]"), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
      gsap.from(section.querySelector("[data-photo]"), {
        y: 24,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      // Each figure counts from zero to its target as the row comes into
      // view, slowing into the final number.
      section.querySelectorAll<HTMLElement>("[data-count]").forEach((el, i) => {
        const target = Number(el.dataset.count);
        const counter = { n: 0 };
        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: "power3.out",
          delay: 0.25 + i * 0.1,
          onUpdate: () => {
            el.textContent = Math.round(counter.n).toString();
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={s.wrap} aria-label="About the studio">
      <div className={s.inner}>
        <div className={s.copy}>
          <h2 className={s.title} data-rise>
            Lorem ipsum dolor sit amet consectetur. Semper enim quam ipsum.
          </h2>

          <p className={s.body} data-rise>
            We build the site we would want for our own business. No templates,
            no waiting, nothing that only looks good. Every project is drawn
            from scratch, built around
          </p>

          <dl className={s.stats} data-rise>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <dt className={s.statLabel}>{stat.label}</dt>
                <dd className={s.statValue}>
                  {/* The resting markup holds the final figure, so it reads
                      without JS; the tween overwrites it from zero. */}
                  <span data-count={stat.value}>{stat.value}</span>
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>

          <div data-rise>
            <MagneticCta href="/#contact">Book a call</MagneticCta>
          </div>
        </div>

        <div className={s.photo} data-photo>
          <Image
            src="/team.webp"
            alt="The two of us behind Cloverfield Studio, the designer and the developer"
            width={1050}
            height={1201}
            sizes="(max-width: 767px) 340px, 30vw"
            className={s.img}
          />
          {LABELS.map((label) => (
            <HandLabel key={label.key} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
