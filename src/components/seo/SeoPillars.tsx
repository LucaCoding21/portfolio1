"use client";

/**
 * "Our approach" on /seo (Nov 24 2026, William's low-fi, then a "Where
 * Runners Connect" reference he sent; picked from four drafts the same day):
 * a centred heading and line between the solution band and "01 / Get found"
 * (SeoGet), then three tall cards. 01 is type only, the grey line filling to
 * ink as you scroll (William turned down a picture there, first a Google
 * screenshot, then a shopfront photo); 02 a full photo with a "Learn more"
 * pill; 03 black with twelve months of bars rising to the 3× (a line chart
 * was turned down). The labels are plain small caps, not pills (by request).
 * The links go to #get-found (SeoGet), #get-chosen (SeoCro) and #results.
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./SeoPillars.module.css";

type Key = "seo" | "cro" | "roi";

type Pillar = {
  key: Key;
  num: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  /** the featured card's footer in draft 2: a real line from the page */
  proof: string;
  icon: React.ReactNode;
};

const PILLARS: Pillar[] = [
  {
    key: "seo",
    num: "01 / SEO",
    tag: "SEO",
    title: "Get found.",
    text: "Show up when customers search for you.",
    href: "#get-found",
    // Northwest Railing, from the proof rows
    proof: "#1 on Google for “railing installation yakima”",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    key: "cro",
    num: "02 / CRO",
    tag: "CRO",
    title: "Get chosen.",
    text: "Turn more visitors into customers.",
    href: "#get-chosen",
    // the hero's trust line
    proof: "3,000+ inquiries from sites we’ve built",
    icon: (
      <>
        <path d="M14 4.1 12 6" />
        <path d="m5.1 8-2.9-.8" />
        <path d="m6 12-1.9 2" />
        <path d="M7.2 2.2 8 5.1" />
        <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
      </>
    ),
  },
  {
    key: "roi",
    num: "03 / ROI",
    tag: "ROI",
    title: "Get results.",
    text: "See what your investment brings back.",
    href: "#results",
    // the hero's promise, shortened
    proof: "3× your SEO investment back, or we work for free",
    icon: (
      <>
        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
        <path d="M16 7h6v6" />
      </>
    ),
  },
];

function Icon({
  children,
  size = 16,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ARROW_RIGHT = <path d="M5 12h14M13 6l6 6-6 6" />;

const [SEO, CRO, ROI] = PILLARS;

/** card 03's bars, month 1 to month 12, as % of the chart's height */
const ROI_BARS = [14, 17, 16, 22, 26, 31, 36, 43, 51, 60, 71, 88];

/**
 * The cards' motion (Nov 24 2026, by request): card 01's title rises out of
 * a mask and its grey line fills to ink word by word as the card scrolls
 * through (scrubbed); card 03's bars grow up one after another and
 * the 3× tag pops on the last (once). Nothing moves with reduced motion.
 */
function useGalleryMotion(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const seo = el.querySelector("[data-ga='seo']");
        if (seo) {
          gsap.from(seo.querySelector("[data-ga='title']"), {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: seo, start: "top 80%", once: true },
          });
          gsap.to(seo.querySelectorAll("[data-ga='word']"), {
            color: "#111113",
            stagger: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: seo,
              start: "top 70%",
              end: "center 40%",
              scrub: 0.6,
            },
          });
        }
        const roi = el.querySelector("[data-ga='roi']");
        if (roi) {
          gsap
            .timeline({
              scrollTrigger: { trigger: roi, start: "top 72%", once: true },
            })
            .from(roi.querySelectorAll("[data-ga='bar']"), {
              scaleY: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.06,
            })
            .from(
              roi.querySelector("[data-ga='tag']"),
              { y: 8, opacity: 0, duration: 0.5, ease: "back.out(2)" },
              0.85,
            );
        }
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [root]);
}

function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  useGalleryMotion(root);
  return (
    <div className={s.gallery} ref={root}>
      <h2 className={s.gaTitle}>Getting found is only half the job.</h2>
      <p className={s.gaLede}>
        Showing up on Google is the first step. Then your website has to get
        people to call you. We work on both, and show you what it brings back.
      </p>

      <ul className={s.gaCards}>
        {/* 1: white, big two-tone type */}
        <li className={s.gaCard} data-ga="seo">
          <div className={s.gaType}>
            <p className={s.gaTag}>{SEO.num}</p>
            <div className={s.gaWords}>
              <h3 className={s.gaBig}>
                <span className={s.gaMask}>
                  <span data-ga="title">{SEO.title}</span>
                </span>
              </h3>
              <p className={s.gaSoft} aria-label={SEO.text}>
                {SEO.text.split(" ").map((w, i) => (
                  <span key={i} data-ga="word" aria-hidden>
                    {w}{" "}
                  </span>
                ))}
              </p>
            </div>
            <a className={s.gaFoot} href={SEO.href}>
              Learn more
              <span className={s.gaRound} aria-hidden>
                <Icon size={14}>{ARROW_RIGHT}</Icon>
              </span>
            </a>
          </div>
        </li>

        {/* 2: a full photo, the pill in the middle, the title at the foot */}
        <li className={s.gaCard}>
          <div className={s.gaPhoto}>
            <Image
              src="/seo/faq-workshop.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              loading="lazy"
              className={s.gaPhotoImg}
            />
            <p className={s.gaPhotoNum}>{CRO.num}</p>
            <a className={s.gaView} href={CRO.href}>
              <span className={s.gaViewIcon} aria-hidden>
                <Icon size={12}>{CRO.icon}</Icon>
              </span>
              Learn more
            </a>
            <div className={s.gaPhotoFoot}>
              <h3 className={s.gaPhotoTitle}>{CRO.title}</h3>
              <p className={s.gaPhotoText}>{CRO.text}</p>
            </div>
          </div>
        </li>

        {/* 3: black, a chart rising across it to the 3× */}
        <li className={s.gaCard} data-ga="roi">
          <div className={s.gaDark}>
            <div className={s.gaDarkHead}>
              <h3 className={s.gaDarkTitle}>{ROI.title}</h3>
              <p className={s.gaDarkNum}>{ROI.num}</p>
            </div>
            <div className={s.gaChart} aria-hidden>
              <div className={s.gaBars}>
                {ROI_BARS.map((h, i) => {
                  const last = i === ROI_BARS.length - 1;
                  return (
                    <span
                      key={i}
                      className={s.gaBar}
                      data-last={last || undefined}
                      style={{ height: `${h}%` }}
                      data-ga="bar"
                    >
                      {last && (
                        <span className={s.gaBarTag} data-ga="tag">
                          3×
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <div className={s.gaAxis}>
                <span>Month 1</span>
                <span>Month 12</span>
              </div>
            </div>
            <div className={s.gaDarkFoot}>
              <p className={s.gaDarkText}>
                3× your SEO investment back, or we work for free.
              </p>
              <a className={s.gaPill} href={ROI.href}>
                {ROI.text}
                <Icon size={15}>{ARROW_RIGHT}</Icon>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default function SeoPillars() {
  return (
    <section
      className={s.section}
      data-section="approach"
      aria-label="Our approach"
    >
      <div className={s.inner}>
        <Gallery />
      </div>
    </section>
  );
}
