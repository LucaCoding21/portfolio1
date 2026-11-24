"use client";

/**
 * "What AI says about you" (the six things we work on, /seo): someone asks
 * an AI assistant who to call. Their question pops in, a soft shimmer runs
 * over "Thinking", then the answer streams in, "A few well reviewed
 * options:", with three businesses as grey lines; the second line turns into
 * a "Your business" pill (the second, never the first: AI answers are worked
 * on, never promised). No brand names or logos, only a plain sparkle, and no
 * cursor, since the one asking is a customer, not you. Drawn as x.ai/bot's
 * feature cards are (one white window, grey placeholder lines, a few real
 * words, their "Thinking" shimmer), played on StageKit's timings (Nov 23
 * 2026).
 */
import { Fragment } from "react";
import { Skel, script, ticks, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import a from "./AiScene.module.css";

const QUESTION = "Who should I call for a new deck in Surrey, BC?";
const LINE = "A few well reviewed options:".split(" ");
// each answer: a name and a little detail, as grey lines; the second's name
// becomes "Your business"
const ROWS: { name: number; detail: number }[] = [
  { name: 74, detail: 34 },
  { name: 66, detail: 40 },
  { name: 60, detail: 30 },
];

type Ai = { q: boolean; think: boolean; words: number; rows: number; reveal: boolean };

const AI = script<Ai>(
  { q: false, think: false, words: 0, rows: 0, reveal: false },
  [
    [300, { q: true }],
    [1000, { think: true }],
    [3150, { think: false }],
    // the answer streams a word at a time, then the businesses one by one
    ...ticks<Ai>(3250, LINE.length, 70, "words"),
    ...ticks<Ai>(3800, ROWS.length, 280, "rows"),
    [5000, { reveal: true }],
  ],
  8400,
  5000,
);

const Sparkle = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

export default function AiScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(AI, playing, still, lead);
  return (
    <div className={`${k.stage} ${a.root}`} data-dim={dim || undefined}>
      <div className={k.frame}>
        <div className={`${k.panel} ${a.panel}`}>
          {/* the customer's question */}
          <p className={`${a.q} ${s.q ? k.popIn : ""}`} data-hidden={!s.q || undefined}>
            {QUESTION}
          </p>

          {/* the assistant: "Thinking", then the answer's first line in its place */}
          <div className={a.answer}>
            <span className={a.spark} data-on={s.think || s.words > 0 || undefined}>
              <Sparkle />
            </span>
            <span className={a.lineStack}>
              <span className={a.thinking} data-hidden={!s.think || undefined}>
                Thinking
              </span>
              <span className={a.line}>
                {LINE.map((w, i) => (
                  <Fragment key={i}>
                    {i ? " " : null}
                    <span data-on={i < s.words || undefined}>{w}</span>
                  </Fragment>
                ))}
              </span>
            </span>
          </div>

          <ul className={a.rows}>
            {ROWS.map((row, i) => (
              <li
                key={i}
                className={`${a.row} ${i < s.rows ? k.popIn : ""}`}
                data-hidden={i >= s.rows || undefined}
              >
                <span className={a.dot} />
                {i === 1 ? (
                  <span className={`${k.pages} ${a.cell}`}>
                    <span data-hidden={s.reveal || undefined}>
                      <Skel w={row.name} strong />
                    </span>
                    <span data-hidden={!s.reveal || undefined}>
                      <span className={a.pill} data-on={s.reveal || undefined}>
                        Your business
                      </span>
                    </span>
                  </span>
                ) : (
                  <Skel w={row.name} strong />
                )}
                <Skel w={row.detail} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
