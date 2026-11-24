"use client";

/**
 * "Articles your customers search for" (what we take care of, /seo), draft
 * A: a search page's "People also ask" box, set on the slot's grey with no
 * window. Questions a home owner types in ("When should I clean my
 * gutters?"...) sit as rows with a chevron. One at a time a row opens: the
 * chevron turns, the row grows, and the answer comes in as two grey lines
 * with its source under them, a small round icon and "Your business" with
 * "Article" in grey. Then the next row opens as the last one closes, so
 * question after question is answered by your articles. The answers are grey
 * lines only, so the picture states no facts; no brand names or colours, and
 * no pointer. Played on StageKit's timings in x.ai/bot's light style
 * (Nov 24 2026).
 */
import { Skel, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ArticleAskScene.module.css";

// each question as a home owner types it, short enough for one line in the
// narrowest slot (236 wide); the fourth only shows in the tall slots and
// never opens. `lines`: the answer's two grey lines.
const QUESTIONS = [
  { q: "When should I clean my gutters?", lines: ["100%", "62%"] },
  { q: "How long does a roof last?", lines: ["94%", "74%"] },
  { q: "Do I need a permit for a shed?", lines: ["100%", "54%"] },
  { q: "Can a roof leak be patched?", lines: ["96%", "68%"] },
];

// open: the row showing its answer (0 none); was: the row closing as the next opens
type St = { open: number; was: number };

const ASK = script<St>(
  { open: 0, was: 0 },
  [
    // a beat on the closed list, then a new question every 2.3s
    [600, { open: 1 }],
    [2900, { open: 2, was: 1 }],
    [5200, { open: 3, was: 2 }],
  ],
  8600,
  // the still frame: the first question open, "Your business" under it
  600,
);

const Chevron = () => (
  <svg className={c.chev} viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 4.6 6 7.6l3-3" />
  </svg>
);

/** A small house, the business's round icon (no logo). */
const House = () => (
  <svg viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1.8 5.6 6 2l4.2 3.6" />
    <path d="M3.2 4.6V10h5.6V4.6" />
  </svg>
);

function Answer({ lines }: { lines: string[] }) {
  return (
    <div className={c.answer}>
      <span className={c.lines}>
        {lines.map((w, i) => (
          <Skel key={i} w={w} />
        ))}
      </span>
      <span className={c.source}>
        <i className={c.icon}>
          <House />
        </i>
        <span className={c.name}>Your business</span>
        <span className={c.kind}>Article</span>
      </span>
    </div>
  );
}

export default function ArticleAskScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(ASK, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.room}>
        <div className={c.col}>
          <p className={c.heading}>People also ask</p>
          <ul className={c.box}>
            {QUESTIONS.map((q, i) => {
              const open = s.open === i + 1;
              const was = s.was === i + 1;
              return (
                <li key={i} className={c.row} data-open={open || undefined} data-was={was || undefined}>
                  <div className={c.q}>
                    <span className={c.text}>{q.q}</span>
                    <Chevron />
                  </div>
                  {/* the answer mounts as its row opens, so it comes in fresh every loop */}
                  <div className={c.fold}>
                    <div className={c.foldIn}>{open || was ? <Answer lines={q.lines} /> : null}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
