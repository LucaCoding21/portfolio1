"use client";

/**
 * "Articles your customers search for" (what we take care of, /seo), draft
 * B: this month's articles, done by a person. A small "November" sits over
 * three white rows on the slot's grey, each titled with a question a roofing
 * and gutter company's customers type into Google (gutters and roofs, not
 * decks: the other cards already lean on decks), with a status pill on the
 * right. All three start "Drafted", grey, with AI's small sparkle in a dashed
 * ring where a person would be. Then the work goes down the list, a row at a
 * time: a face pops into the ring and the pill turns "Edited", then a green
 * check lands on the face and the pill turns green, "Live". The faces are
 * William and Irish, the photos the page already shows, since we edit every
 * article. No window and no pointer; drawn in x.ai/bot's light feature-card
 * style (their pop-in, check-in and text swap) on StageKit's timings
 * (Nov 24 2026).
 */
import Image from "next/image";
import { script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ArticlePlanScene.module.css";

// the questions as an owner's customers type them; `mid` from 300px wide,
// `short` in the narrower slots (topic first, so a cut never loses it)
const ARTICLES = [
  { mid: "How often to clean gutters?", short: "Gutters: how often?", face: "william" },
  { mid: "When to replace your roof?", short: "Time for a new roof?", face: "irish" },
  { mid: "Questions to ask a roofer", short: "What to ask a roofer", face: "william" },
] as const;

const FACES = {
  william: "/free-homepage-design/team/william-face.webp",
  irish: "/free-homepage-design/team/irish-photo.webp",
};

const WORDS = ["Drafted", "Edited", "Live"];

// each row: 0 drafted, 1 edited, 2 live
type St = { r0: number; r1: number; r2: number };
const KEYS = ["r0", "r1", "r2"] as const;

const PLAN = script<St>(
  { r0: 0, r1: 0, r2: 0 },
  [
    // a beat on the drafts, then steady work down the list: each row is
    // edited, then goes live 0.8s later, and the next row starts 0.6s after
    [700, { r0: 1 }],
    [1500, { r0: 2 }],
    [2100, { r1: 1 }],
    [2900, { r1: 2 }],
    [3500, { r2: 1 }],
    [4300, { r2: 2 }],
  ],
  8000,
  // the still frame: all three edited and live
  4300,
);

// AI's plain sparkle (as the AI answers card draws it): the draft, before a person
const Sparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2.6 6.3 5 8.6l4.4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ArticlePlanScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(PLAN, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined} data-still={still || undefined}>
      <div className={c.fit}>
        <div className={c.list}>
          <span className={c.month}>November</span>
          {ARTICLES.map((a, i) => {
            const step = s[KEYS[i]];
            return (
              <div key={a.short} className={c.row}>
                <span className={c.title}>
                  <span className={c.mid}>{a.mid}</span>
                  <span className={c.short}>{a.short}</span>
                </span>
                <span className={c.status} data-step={step}>
                  <span className={c.who}>
                    <i className={c.ring}>
                      <Sparkle />
                    </i>
                    {/* always in the page, so the photo is loaded before its turn */}
                    <span className={c.face} data-on={step >= 1 || undefined}>
                      <Image src={FACES[a.face]} alt="" width={30} height={30} />
                    </span>
                    <i className={c.ok} data-on={step >= 2 || undefined}>
                      <Check />
                    </i>
                  </span>
                  <span className={c.word}>
                    {WORDS.map((w, j) => (
                      <span key={w} data-on={j === step || undefined}>
                        {w}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
