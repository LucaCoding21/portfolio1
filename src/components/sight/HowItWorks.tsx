"use client";

import Image from "next/image";
import { gsap, ScrollTrigger, useSightGsap } from "./motion";
import { BOOK_URL } from "./constants";
import ConnectionsWindow from "./ConnectionsWindow";
import CrossCheck from "./CrossCheck";
import AskWindow from "./AskWindow";
import FoundersNote from "./FoundersNote";
import { Icon, P, T } from "./SightUI";
import { useTrade } from "./trades";
import Cinematic, { Words } from "./Cinematic";

/**
 * "How it works": four stacked feature cards. Layout, spacing, type
 * sizes and motion are copied 1:1 from clay.com's home feature stack
 * (section_home-features); colours and radii follow the Sight tokens
 * in sight.css. All four cards have real copy: Connect, Check, Ask (or
 * let it tell you), and Built for you as the closer, since this is the
 * last section before the footer. Every card has media. The callout under each card rotates
 * three lines: for Sight these are questions an owner asked and the
 * answer that came back, not customer quotes. The tile is a product
 * icon in a tone colour (the tool marks in /logos are wordmarks and
 * don't fit a 43px tile).
 *
 * Measured on clay.com at 1440 wide:
 *  - section padding 64 0 48; container 95% wide, max 1280
 *  - each card is a sticky wrapper (top 72px) with margin-bottom -48px,
 *    so the next card slides up over the previous one. No transforms,
 *    no fades: the stacking is pure CSS sticky.
 *  - card grid 640 / 640; left pad 48 0 64 48; right pad 24
 *  - title 48/48 w500 ls -1.92; body 16/24 max 448; quote 14/18.2
 *  - call-out logos 43x43 tiles stepping 32px; quote + logos rotate
 *    every ~3.8s (0.25s out, 0.5s shuffle, 0.3s in, ~3.05s hold)
 *  - buttons 42 tall, pad 8 16, gap 10 (radius is ours: pill)
 */

/** One rotating line: a question and its answer, with the tile icon. */
type Quote = { icon: string; tone: string; q: string; a: string };

type Card = {
  tag: string;
  title: string;
  highlight: string;
  body: string;
  /** One-sentence version of `body` shown on phones. */
  short: string;
  /** Small label above the rotating lines, saying what they are. */
  label: string;
  /** Three lines. Shown in order 0, 2, 1: the back tile comes to the front. */
  quotes: Quote[];
  primary: string;
  /** Optional second, lighter button. Omit it and only the primary shows. */
  secondary?: string;
  /** What sits in the card's media slot (592x568 at desktop). */
  media?: React.ReactNode;
  /** Optional photo filling the slot behind `media`. */
  photo?: string;
};

const CARDS: Card[] = [
  {
    tag: "Connect",
    title: "Plugs into the tools",
    highlight: "you already use",
    body: "QuickBooks, Jobber, your calendar, the spreadsheet with the price list in it. Sight connects to each one once, reads what's already there, and keeps it current from then on. Nothing to re-enter, and nothing changes about how you work.",
    short: "Sight connects once to QuickBooks, Jobber and the rest, and keeps itself current without you re-entering anything.",
    label: "What it reads",
    quotes: [
      {
        icon: P.layers,
        tone: T.BLUE,
        q: "Your books.",
        a: "Every invoice, bill and payment, read once and kept current from then on.",
      },
      {
        icon: P.calendar,
        tone: T.GREEN,
        q: "Your jobs.",
        a: "Every quote, visit and crew, with who did it and what it took.",
      },
      {
        icon: P.box,
        tone: T.AMBER,
        q: "The spreadsheet.",
        a: "The price list and whatever else lives in one, exactly as you keep it.",
      },
    ],
    primary: "Book a demo",
    media: <ConnectionsWindow />,
    photo: "/sight/shepherd-field.webp",
  },
  {
    tag: "Cross check",
    title: "Checks every number",
    highlight: "against every other one",
    body: "Quotes against bookings, invoices against payments, hours against what was quoted. Sight reads the lot and lines it all up, so it knows a job finished but never got billed without anyone telling it to look.",
    short: "Sight lines up quotes, invoices and hours, so it spots a finished job that never got billed on its own.",
    label: "Now it catches things",
    // One reassurance among the findings, so checks read as routine,
    // not as alarms.
    quotes: [
      {
        icon: P.alertTriangle,
        tone: T.AMBER,
        q: "Quotes against bookings.",
        a: "Sixty-one sent, nine never booked, $44,700 sitting there.",
      },
      {
        icon: P.layers,
        tone: T.BLUE,
        q: "Hours against quotes.",
        a: "Three jobs ran more than 20 hours over what was priced.",
      },
      {
        icon: P.check,
        tone: T.GREEN,
        q: "Invoices against payments.",
        a: "Every job from June paid, nothing outstanding.",
      },
    ],
    primary: "Book a demo",
    media: <CrossCheck />,
    photo: "/sight/country-road.webp",
  },
  {
    tag: "Ask",
    title: "Ask it anything,",
    highlight: "or let it tell you",
    body: "Type a question the way you'd say it out loud and the number comes back in a sentence, pulled from the tools it just checked. The things you didn't think to ask about arrive on their own, the week they happen.",
    short: "Ask the way you'd say it out loud and the number comes back in a sentence.",
    label: "Now you can ask",
    quotes: [
      // Each answer needs at least two tools crossed, and the three
      // together are: money leaking out, what a job really made, money
      // about to walk away. The text is a fallback: at render the words
      // come from the trade picked on the wall (trades.ts), so the wall
      // and this card ask the same things. Tiles and tones stay.
      {
        icon: P.alertTriangle,
        tone: T.AMBER,
        q: "Which jobs finished but never got invoiced?",
        a: "Four from last week, $11,200 between them.",
      },
      {
        icon: P.layers,
        tone: T.BLUE,
        q: "What did the Oakridge job actually make us?",
        a: "$4,100 on an $18,500 quote, and labour ran 30 hours over.",
      },
      {
        icon: P.trendUp,
        tone: T.GREEN,
        q: "Which customers went quiet this year?",
        a: "14 who booked every spring haven't yet, worth $31,000 last year.",
      },
    ],
    primary: "Book a demo",
    media: <AskWindow />,
    photo: "/sight/mountain-lookout.jpg",
  },
  {
    tag: "Built for you",
    title: "We build it.",
    highlight: "Live in 45 days, or you don't pay.",
    body: "Nothing to set up on your end. We connect your tools, learn how the business actually runs, and work out with you which checks matter for your trade. Your team gets trained on it, and if it isn't live by day 45, you don't pay.",
    short: "We connect your tools and set it up around your trade, and if it isn't live by day 45, you don't pay.",
    label: "How the 45 days go",
    quotes: [
      {
        icon: P.refresh,
        tone: T.BLUE,
        q: "Day one.",
        a: "We connect your tools and sit down with whoever runs the books and the schedule.",
      },
      {
        icon: P.layers,
        tone: T.AMBER,
        q: "Weeks two to five.",
        a: "We build the checks and questions that fit your trade, and run them on your real numbers until they're right.",
      },
      {
        icon: P.check,
        tone: T.GREEN,
        q: "Day 45.",
        a: "It's live, your team's trained, and we stay on it for 30 more days of tuning.",
      },
    ],
    primary: "Book a demo",
    media: <FoundersNote />,
    photo: "/sight/sheep-hill.jpg",
  },
];

/* Rotation timing, measured on clay.com */
const HOLD = 3.05;
const OUT = 0.25;
const SHUFFLE = 0.5;
const IN = 0.3;
const SLOT = 32; // px between logo tiles (43 wide, -11.2 margin)

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/** Tile icon: a product icon in its tone colour on a tinted square (24x24). */
function Mark({ icon, tone }: { icon: string; tone: string }) {
  return (
    <span
      className="hiw-mark"
      aria-hidden="true"
      style={{ color: tone, backgroundColor: `${tone}1f` }}
    >
      <Icon d={icon} className="h-[14px] w-[14px]" strokeWidth={2} />
    </span>
  );
}

export default function HowItWorks() {
  // The Ask card's three lines follow the trade picked on the questions
  // wall. Only the text changes; the tiles, order and rotation are the
  // card's own, and the quote elements are keyed by slot so GSAP keeps
  // hold of the same nodes when the words swap.
  const trade = useTrade();
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const callouts = gsap.utils.toArray<HTMLElement>("[data-callout]", root);

    // Below desktop the cards stack with a 16px sticky top (sight.css). A
    // card taller than the screen would have its bottom covered by the next
    // one before it was ever seen, so it sticks once its bottom reaches the
    // bottom of the screen instead.
    const themes = gsap.utils.toArray<HTMLElement>(".hiw-theme", root);
    const fitTops = () => {
      const below = window.innerWidth < 992;
      themes.forEach((t) => {
        const room = window.innerHeight - t.offsetHeight - 16;
        t.style.setProperty("--hiw-top", below && room < 16 ? `${room}px` : "");
      });
    };
    fitTops();
    const ro = new ResizeObserver(fitTops);
    themes.forEach((t) => ro.observe(t));
    window.addEventListener("resize", fitTops);

    callouts.forEach((co) => {
      const logos = gsap.utils.toArray<HTMLElement>("[data-logo]", co);
      const quotes = gsap.utils.toArray<HTMLElement>("[data-quote]", co);
      if (logos.length < 2 || quotes.length !== logos.length) return;

      // order[slot] = logo index. Slot 0 is the front tile.
      let order = logos.map((_, i) => i);
      const place = () => {
        order.forEach((li, slot) => {
          gsap.set(logos[li], { x: slot * SLOT, zIndex: logos.length - slot });
        });
      };
      place();
      quotes.forEach((q, i) => gsap.set(q, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.98 }));

      const step = () => {
        // Only animate while the card is on screen; otherwise just wait.
        if (!ScrollTrigger.isInViewport(co)) {
          gsap.delayedCall(HOLD, step);
          return;
        }
        const from = order[0];
        const to = order[order.length - 1];
        order = [to, ...order.slice(0, -1)];

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.delayedCall(HOLD, step);
          },
        });

        if (reduced) {
          tl.set(quotes[from], { autoAlpha: 0 })
            .set(quotes[to], { autoAlpha: 1, scale: 1 })
            .add(place);
          return;
        }

        tl.to(quotes[from], { autoAlpha: 0, scale: 0.98, duration: OUT, ease: "power1.out" }, 0);
        order.forEach((li, slot) => {
          tl.to(
            logos[li],
            { x: slot * SLOT, duration: SHUFFLE, ease: "power2.inOut" },
            0.12
          );
        });
        // The incoming tile takes the front z-index part way through its move.
        tl.set(logos[to], { zIndex: logos.length }, 0.12 + SHUFFLE * 0.6);
        order.forEach((li, slot) => {
          if (li !== to) tl.set(logos[li], { zIndex: logos.length - slot }, 0.12 + SHUFFLE * 0.6);
        });
        tl.fromTo(
          quotes[to],
          { autoAlpha: 0, scale: 0.98 },
          { autoAlpha: 1, scale: 1, duration: IN, ease: "power1.out" },
          0.45
        );
      };

      gsap.delayedCall(HOLD, step);
    });

    // gsap.context calls this on revert.
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fitTops);
    };
  });

  return (
    <section ref={scope} data-track="sight-how-it-works" className="hiw" aria-labelledby="hiw-heading">
      <div className="hiw-container">
        <Cinematic className="hiw-head">
          <Words
            id="hiw-heading"
            className="font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
          >
            How it works
          </Words>
          <p
            data-blur
            className="mx-auto mt-5 max-w-[36rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
          >
            Four steps, from the tools you already use to answers that come
            to you.
          </p>
        </Cinematic>
        <div className="hiw-list">
          {CARDS.map((card, index) => {
            const quotes =
              card.tag === "Ask"
                ? card.quotes.map((q, i) => ({ ...q, ...trade.ask[i] }))
                : card.quotes;
            return (
            <div key={card.tag} className="hiw-theme">
              <article className="hiw-item">
                <div className="hiw-left">
                  <div className="hiw-stack">
                    <div className="hiw-tag">
                      <span className="hiw-step">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="hiw-eyebrow">{card.tag}</span>
                    </div>
                    <div className="hiw-stack-rg">
                      <h3 className="hiw-title">
                        {card.title} <span>{card.highlight}</span>
                      </h3>
                      <div className="hiw-desc">
                        <p>
                          <span className="md:hidden">{card.short}</span>
                          <span className="hidden md:inline">{card.body}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hiw-btm">
                    <div className="hiw-callout" data-callout>
                      <p className="hiw-callout-label">{card.label}</p>
                      <div className="hiw-callout-row">
                        <div className="hiw-callout-top">
                          {quotes.map((q, i) => (
                            <div key={i} className="hiw-logo" data-logo>
                              <Mark icon={q.icon} tone={q.tone} />
                            </div>
                          ))}
                        </div>
                        <div className="hiw-callout-quote">
                          {quotes.map((q, i) => (
                            <div key={i} className="hiw-callout-item" data-quote>
                              <p>{q.q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="hiw-buttons">
                      <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="hiw-btn hiw-btn--dark">
                        <span>{card.primary}</span>
                        <span className="hiw-icon-track" aria-hidden="true">
                          <span className="hiw-icon hiw-icon--abs">
                            <Arrow />
                          </span>
                          <span className="hiw-icon">
                            <Arrow />
                          </span>
                        </span>
                      </a>
                      {card.secondary && (
                        <a href="#" className="hiw-btn hiw-btn--light">
                          <span>{card.secondary}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hiw-right">
                  {/* Media slot: 592x568 at desktop. */}
                  <div className="hiw-media">
                    {card.photo && (
                      <Image
                        src={card.photo}
                        alt=""
                        fill
                        sizes="(min-width: 992px) 592px, 100vw"
                        quality={85}
                        className="object-cover"
                      />
                    )}
                    {card.media && <div className="hiw-media-content">{card.media}</div>}
                  </div>
                </div>
              </article>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
