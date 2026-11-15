"use client";

/**
 * "What you get" on /seo (Nov 15 2026), between the proof and the FAQ: the
 * six things we do every month. Laid out from a reference William sent: the
 * heading, the plan line and a button under it on the left (the heading's
 * arrow taken off by request), the six
 * as tall white cards in a sideways row on the right that runs off the
 * page's edge, with arrows under it (no progress bars: William turned those
 * down on the proof shots). The cards (redone Nov 15 2026 by request): the
 * icon at the top, the title and its line together at the foot, in the
 * problem cards' pattern, with no dash between them. Every line comes from the FAQ's "What do you do
 * each month?" and the offer's steps, so keep them saying the same thing. AI
 * answers are worked on, never promised; monthly content is drafted with AI
 * and edited by us, so nothing here claims in-house writers.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CAL_URL } from "@/data/projects";
import s from "./SeoGet.module.css";

// Hover pictures (Nov 15 2026), Pexels, all in one warm, film-graded look
// (William turned down several rounds of posed or flat stock shots, then
// picked most of these by number from a dev board of card-sized options):
// 23841869 (a shop lit up at night), 29561705 (new houses at dusk with lit
// windows, T13), 18286117 (a restaurant counter at night, cut from the
// lower half of the tall original: lights, plates and a waiter passing,
// A73), 27988858 (people reading the paper in a cafe), 6255367 (a phone
// glowing in a hand in the dark, B27), 28225039 (a laptop by a desk lamp
// in a dim room, V16). In public/seo/get-*.webp.
const ITEMS: { title: string; text: string; pic: string; icon: React.ReactNode }[] = [
  {
    title: "Your Google listing",
    pic: "/seo/get-listing-2.webp",
    text: "Filled in properly and kept up to date, so you show up on the map for the jobs you want.",
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Pages for your jobs and towns",
    pic: "/seo/get-pages-4.webp",
    text: "New pages on your website for each job you do and each town you work in.",
    icon: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </>
    ),
  },
  {
    title: "More reviews",
    pic: "/seo/get-reviews-7.webp",
    text: "We make it easy for your customers to leave a review and help you ask for them.",
    icon: (
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    ),
  },
  {
    title: "Mentions on other sites",
    pic: "/seo/get-mentions-4.webp",
    text: "Your business listed and talked about on the sites Google trusts.",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
  {
    title: "What AI says about you",
    pic: "/seo/get-ai-6.webp",
    text: "We work on what ChatGPT and Google’s AI say when people ask who to call.",
    icon: (
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    ),
  },
  {
    title: "A video every month",
    pic: "/seo/get-video-4.webp",
    text: "A short video showing what we did and what changed, so you always know where you stand.",
    icon: (
      <>
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </>
    ),
  },
];

/**
 * One card. Hovering it (a tap on touch screens) uncovers its picture from
 * below in the empty space between the icon and the words, so the title and
 * line stay on white and readable.
 */
function Card({ it }: { it: (typeof ITEMS)[number] }) {
  const [on, setOn] = useState(false);
  return (
    <li
      className={s.card}
      data-on={on || undefined}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <span className={s.iconWrap} aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {it.icon}
        </svg>
      </span>
      <div className={s.pic} aria-hidden>
        <Image src={it.pic} alt="" fill sizes="340px" className={s.picImg} />
      </div>
      <div>
        <h3 className={s.cardTitle}>{it.title}</h3>
        <p className={s.cardText}>{it.text}</p>
      </div>
    </li>
  );
}

export default function SeoGet({ searchRange }: { searchRange: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: still ? "auto" : "smooth" });
  };

  return (
    <section className={s.get} data-section="get">
      <div className={s.inner}>
        <div className={s.side}>
          <div>
            <h2 className={s.title}>The six things we work on for you every month.</h2>
            <p className={s.lede}>
              Depending on your plan, we work on {searchRange} searches, including your 5 main ones.
            </p>
            <a className={s.cta} href={CAL_URL} target="_blank" rel="noopener noreferrer">
              Book a free SEO call
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className={s.main}>
          <ul ref={track} className={s.track} onScroll={update}>
            {ITEMS.map((it) => (
              <Card key={it.title} it={it} />
            ))}
          </ul>
          <div className={s.arrows}>
            <button type="button" className={s.arrow} onClick={() => step(-1)} disabled={atStart} aria-label="Previous">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className={s.arrow} onClick={() => step(1)} disabled={atEnd} aria-label="Next">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
