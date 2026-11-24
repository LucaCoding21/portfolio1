"use client";

/**
 * "What AI says about you" (the six things we work on, /seo): just the
 * question and the answer, set in type on the slot's grey, with one white
 * search box near the top and no window. The box sits empty with a blinking
 * caret, a customer's question types itself in ("Who should I call for a new
 * deck in Surrey, BC?"), the box gives a small press as it's sent, "Thinking"
 * shimmers under it, then the answer writes itself out: "A few well reviewed
 * options:" and three numbered rows, the first and last grey lines (other
 * businesses, never named) and the second "Your business", marked in pale
 * green as it lands. Second, never first: AI answers are worked on, never
 * promised. No brand names or logos, only a plain sparkle, and no pointer,
 * since the one asking is a customer. Played on StageKit's timings in
 * x.ai/bot's light style (Nov 23 2026).
 */
import { Fragment, useLayoutEffect, useRef } from "react";
import { Skel, script, ticks, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./AiAnswerScene.module.css";

const QUESTION = "Who should I call for a new deck in Surrey, BC?";
const LEAD = "A few well reviewed options:".split(" ");
// each answer: a name and a little detail, as grey lines across the row's
// width (so wider slots fill out); the second is ours
const ROWS = [
  { name: "37%", detail: "15%" },
  { name: "", detail: "17%" },
  { name: "30%", detail: "20%" },
];

type St = { n: number; press: boolean; sent: boolean; think: boolean; words: number; rows: number };

const ANSWER = script<St>(
  { n: 0, press: false, sent: false, think: false, words: 0, rows: 0 },
  [
    // typed a letter at a time (about 1.5s), then a beat before it's sent
    ...ticks<St>(700, QUESTION.length, 32, "n"),
    [2550, { press: true }],
    [2650, { press: false, sent: true }],
    // "Thinking" for one pass of its shimmer
    [2750, { think: true }],
    [3750, { think: false }],
    // the answer writes itself out a word at a time, then the rows one by one
    ...ticks<St>(3820, LEAD.length, 70, "words"),
    ...ticks<St>(4350, ROWS.length, 320, "rows"),
  ],
  9400,
  4990,
);

const Sparkle = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const Send = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </svg>
);

/**
 * The box grows smoothly as the question wraps to a second line, and goes
 * back at once (the loop's reset, while the stage fades back in).
 */
function useGrowBox() {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    let last = 0;
    const fit = () => {
      const h = i.offsetHeight;
      b.style.transition = last && h > last ? "height 0.24s cubic-bezier(0.2, 0, 0, 1)" : "none";
      b.style.height = `${h}px`;
      last = h;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return { box, inner };
}

export default function AiAnswerScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(ANSWER, playing, still, lead);
  const { box, inner } = useGrowBox();
  const typing = s.n > 0 && s.n < QUESTION.length;

  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.wrap}>
        <div className={c.col}>
          {/* the search box, the only white thing in the picture */}
          <div className={c.press} data-press={s.press || undefined}>
            <div ref={box} className={c.box}>
              <div ref={inner} className={c.boxIn}>
                <span className={c.spark}>
                  <Sparkle />
                </span>
                <p className={c.q}>
                  {QUESTION.slice(0, s.n)}
                  {s.sent ? null : <i className={c.caret} data-solid={typing || undefined} />}
                  {s.n === 0 ? <span className={c.ph}>Ask a question</span> : null}
                </p>
                {/* dark once there's a question, quiet again once it's sent */}
                <span className={c.send} data-on={(s.n > 0 && !s.sent) || undefined} data-done={s.sent || undefined}>
                  <Send />
                </span>
              </div>
            </div>
          </div>

          {/* the answer, straight on the grey */}
          <div className={c.answer}>
            <div className={c.lead}>
              <span className={c.thinking} data-hidden={!s.think || undefined}>
                Thinking
              </span>
              <span className={c.leadLine}>
                {LEAD.map((w, i) => (
                  <Fragment key={i}>
                    {i ? " " : null}
                    <span data-on={i < s.words || undefined}>{w}</span>
                  </Fragment>
                ))}
              </span>
            </div>
            <ol className={c.rows}>
              {ROWS.map((row, i) => (
                <li key={i} className={`${c.row} ${i < s.rows ? k.popIn : ""}`}>
                  {i < s.rows ? (
                    <>
                      <span className={c.num}>{i + 1}.</span>
                      {i === 1 ? <span className={c.mark}>Your business</span> : <Skel w={row.name} strong />}
                      <Skel w={row.detail} />
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
