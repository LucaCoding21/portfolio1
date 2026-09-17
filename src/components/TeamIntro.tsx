"use client";

/**
 * Sits straight under the logo strip: headline, a line of studio copy, a row
 * of stats and the "See what we'd fix" button on the left; the two of us on the
 * right with the hand labels landing on the arrows already drawn in the photo.
 *
 * Text rises in on scroll and the stat figures count up from zero; the labels
 * write themselves in through HandLabel's own trigger.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HandLabel, { type HandLabelSpec } from "@/components/HandLabel";
import ArrowCta from "@/components/ArrowCta";
import s from "./TeamIntro.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * `value` counts up from zero on scroll, with thousands separators; `prefix`
 * and `suffix` are printed around it.
 */
const STATS = [
  { value: 5000, prefix: "", suffix: "+", label: "Customer inquiries generated" },
  { value: 35, prefix: "+", suffix: "%", label: "Conversion lift" },
  { value: 30, prefix: "", suffix: "+", label: "Websites launched" },
  { value: 40, prefix: "+", suffix: "%", label: "More inquiries" },
];

const formatCount = (n: number) => Math.round(n).toLocaleString("en-CA");

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
            el.textContent = formatCount(counter.n);
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
            Your business has outgrown the website that got you here.
          </h2>

          <p className={s.body} data-rise>
            We make your business look as established online as it is in real
            life. Then we make it easier for the right customers to understand
            why you&rsquo;re worth choosing.
          </p>

          <dl className={s.stats} data-rise>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <dt className={s.statLabel}>{stat.label}</dt>
                <dd className={s.statValue}>
                  {/* The resting markup holds the final figure, so it reads
                      without JS; the tween overwrites it from zero. */}
                  {stat.prefix}
                  <span data-count={stat.value}>{formatCount(stat.value)}</span>
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>

          <div data-rise>
            <ArrowCta href="/#contact" note="Free review of your current website.">
              See what we&apos;d fix
            </ArrowCta>
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
