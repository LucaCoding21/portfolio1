"use client";

/**
 * The "Search engine optimization" pillar card (SeoPillars; "Get found." until
 * William asked for the plain names, Nov 24 2026), William's pick of three takes
 * (Nov 24 2026; a climbing rank and a phone with the map results were the
 * others, and the type-only card before them). Searches drift up the card in
 * pills, each with a yellow #1, under the title, line and link (at the top
 * since Nov 24 2026, as on the other two cards, by request). They're
 * examples across the kinds of businesses we work with, local and not,
 * therapy too (by request: not our clients' real results, which the proof
 * section shows). The drift starts when half the card is on screen and
 * stands still with reduced motion. Sizes count in cqw of the card.
 */
import { useEffect, useRef, useState } from "react";
import f from "./FoundCard.module.css";

type Props = { title: string; text: string; href: string };

// examples, not results: local trades and services, health, and a few
// that aren't tied to a town ("Surrey bc" as people type it)
const SEARCHES = [
  "therapist near me",
  "deck builder surrey bc",
  "emergency plumber langley",
  "online therapy bc",
  "family dentist white rock",
  "roofing company abbotsford",
  "couples counselling vancouver",
  "landscaper burnaby",
  "physiotherapy near me",
  "wedding photographer bc",
];

const Magnifier = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/** true once half the card has been on screen (at once with reduced motion) */
function useSeen(ref: React.RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- shows the end state at once
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

export default function FoundCard({ title, text, href }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref);
  return (
    <div ref={ref} className={f.card} data-seen={seen || undefined}>
      <div className={f.words}>
        <h3 className={f.title}>{title}</h3>
        <p className={f.text}>{text}</p>
        <a className={f.more} href={href}>
          Learn more
          <span className={f.round}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </div>
      <div className={f.ticker} aria-hidden>
        <div className={f.tickerTrack}>
          {[...SEARCHES, ...SEARCHES].map((q, i) => (
            <span key={i} className={f.pill}>
              <Magnifier />
              <span className={f.pillText}>{q}</span>
              <b className={f.one}>#1</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
