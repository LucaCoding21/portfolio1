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
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CAL_URL } from "@/data/projects";
import { useReducedMotion } from "./StageKit";
import AiAnswerScene from "./get-scenes/AiAnswerScene";
import ArticleBlogScene from "./get-scenes/ArticleBlogScene";
import ChecksRadarScene from "./get-scenes/ChecksRadarScene";
import ListingMapScene from "./get-scenes/ListingMapScene";
import MentionsPileScene from "./get-scenes/MentionsPileScene";
import PagesTreeScene from "./get-scenes/PagesTreeScene";
import ReviewsCountScene from "./get-scenes/ReviewsCountScene";
import s from "./SeoGet.module.css";

type SceneProps = { playing: boolean; still: boolean; lead?: number };

// Nov 23 2026: the hover pictures (warm Pexels photos, still in
// public/seo/get-*.webp, unused) became small animated scenes in x.ai/bot's
// style, as on the problem cards (get-scenes/, built on StageKit). The first
// set were all one white window with a title bar and a badge, which read as
// the same thing six times (William), so the same day each card got its own
// kind of picture: a pin on a map, a site tree, a big review count, a pile
// of clippings, a question and its answer, and a radar sweep. The first set
// (ListingScene, PagesScene...) stays in get-scenes/, unused.
const ITEMS: { title: string; text: string; Scene: (p: SceneProps) => React.ReactNode; icon: React.ReactNode }[] = [
  {
    // Nov 24 2026, William's pick: it's optimization, not just keeping it up to
    // date (was "Your Google listing" / "Filled in properly and kept up to
    // date, so you show up on the map for the jobs you want.")
    title: "Google Business Profile optimization",
    Scene: ListingMapScene,
    text: "Optimized for the searches that bring you work, not just kept up to date.",
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    // second since Nov 24 2026, by request
    title: "What AI says about you",
    Scene: AiAnswerScene,
    text: "We work on what ChatGPT and Google’s AI say when people ask who to call.",
    icon: (
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    ),
  },
  {
    title: "Pages for your jobs and towns",
    Scene: PagesTreeScene,
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
    // Nov 23 2026, by request: the monthly articles, drafted with AI and
    // edited by us (never "written by our writers"); the scene is the
    // site's articles page growing month by month, each checked by a person
    // (William's pick of three drafts, Nov 24 2026)
    title: "Articles your customers search for",
    Scene: ArticleBlogScene,
    text: "Planned around what your customers search, and edited by us so they’re correct.",
    icon: (
      <>
        <path d="M13 21h8" />
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      </>
    ),
  },
  {
    title: "More reviews",
    Scene: ReviewsCountScene,
    text: "We make it easy for your customers to leave a review and help you ask for them.",
    icon: (
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    ),
  },
  {
    title: "Mentions on other sites",
    Scene: MentionsPileScene,
    text: "Your business listed and talked about on the sites Google trusts.",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
  {
    // Nov 23 2026: was "A video every month", which isn't something we do
    // (William called it AI slop); the monthly map check is (Local Falcon)
    title: "Your rankings, checked monthly",
    Scene: ChecksRadarScene,
    text: "Every month we check where you show up on the Google map for your searches.",
    icon: (
      <>
        <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
        <path d="M4 6h.01" />
        <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
        <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
        <path d="M12 18h.01" />
        <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
        <circle cx="12" cy="12" r="2" />
        <path d="m13.41 10.59 5.66-5.66" />
      </>
    ),
  },
];

// play in view, not on hover, on touch screens and wherever the row is the
// phone and tablet layout (900px and under), so a narrow window or a phone
// that reports hover still plays them while scrolling (Nov 23 2026)
const touchQuery = "(hover: none), (max-width: 900px)";
function useTouch() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(touchQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(touchQuery).matches,
    () => false,
  );
}

/**
 * One card. Hovering it uncovers its scene from below in the empty space
 * between the icon and the words, so the title and line stay on white and
 * readable; on touch screens the scene opens and plays while most of the
 * card is in view, as the problem cards' scenes do on phones.
 */
function Card({ it }: { it: (typeof ITEMS)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);
  const [inView, setInView] = useState(false);
  const touch = useTouch();
  const still = useReducedMotion();
  const shown = touch ? inView : on;

  useEffect(() => {
    const el = ref.current;
    if (!el || !touch) return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [touch]);

  const { Scene } = it;
  return (
    <li
      ref={ref}
      className={s.card}
      data-on={shown || undefined}
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
        {/* on desktop the scene starts as the reveal (0.6s) lands */}
        <Scene playing={shown} still={still} lead={touch ? 0 : 450} />
      </div>
      <div>
        <h3 className={s.cardTitle}>{it.title}</h3>
        <p className={s.cardText}>{it.text}</p>
      </div>
    </li>
  );
}

export default function SeoGet() {
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
    // "01 / Get found" since Nov 24 2026: the first of the three pillars
    // (SeoPillars), whose "Learn more" lands here; the line is William's
    <section id="get-found" className={s.get} data-section="get">
      <div className={s.inner}>
        <div className={s.side}>
          <div>
            <p className={s.eyebrow}>01 / Get found</p>
            <h2 className={s.title}>What we take care of for you.</h2>
            <p className={s.lede}>We handle your SEO so you can focus on running your business.</p>
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
