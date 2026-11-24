"use client";

/**
 * "Articles your customers search for" (what we take care of, /seo):
 * an editor's pass on one article, with no window. One white sheet holds a
 * small grey "Draft" tag, the article's title ("How often should you clean
 * your gutters?", not a deck: William didn't want deck content here, as
 * the other cards lean on decks) and its body as grey lines, so the picture never states a
 * fact that could be wrong. Then the edit, a mark at a time, in a warm red
 * pen: a strike across part of one line with a green replacement written
 * above it at a caret, a shorter fix on another line, and a "Checked" note
 * in the margin on a hairline. Last, the tag turns to a green "Edited" with
 * a check. It stands for the articles we draft with AI and a person edits.
 * No pointer: the pen is the person. Played on StageKit's timings in
 * x.ai/bot's light feature-card style (Nov 23 2026).
 */
import { Swap, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ArticleEditScene.module.css";

// a, b: the two fixes (0 not yet, 1 struck, 2 replaced); note: 0, 1 its
// hairline drawn, 2 the note in
type St = { a: number; b: number; note: number; edited: boolean };

const EDIT = script<St>(
  { a: 0, b: 0, note: 0, edited: false },
  [
    // a beat on the draft, then a mark every 0.8 to 0.9s, as a careful pen
    // goes; each rewrite comes 0.4s after its strike
    [700, { a: 1 }],
    [1100, { a: 2 }],
    [1900, { b: 1 }],
    [2300, { b: 2 }],
    [3100, { note: 1 }],
    [3350, { note: 2 }],
    [4250, { edited: true }],
  ],
  8600,
  // the still frame: both fixes, the note and the green tag
  4250,
);

const TITLE = "How often should you clean your gutters?";

/** A run of words as one grey line; `g` is its share of the row. */
const Seg = ({ g }: { g: number }) => <span className={c.seg} style={{ flexGrow: g }} />;

const Caret = () => (
  <svg className={c.caret} viewBox="0 0 8 6" width="8" height="6" fill="none" aria-hidden>
    <path d="M1 5.2 4 1.2l3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ size }: { size: number }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} fill="none" aria-hidden>
    <path d="M2.3 6.4 4.9 9l4.8-5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Words struck through and rewritten above: `ins` is the new words' width,
 * against the old; `caret` marks where they go (the first fix only, so the
 * second stays light and clear of the slot's foot).
 */
function Fix({ g, step, ins, caret }: { g: number; step: number; ins: string; caret?: boolean }) {
  return (
    <span className={c.seg} data-struck={step >= 1 || undefined} style={{ flexGrow: g }}>
      {step >= 1 ? <i className={c.strike} /> : null}
      {step >= 2 ? (
        <>
          {caret ? <Caret /> : null}
          <i className={c.insert} style={{ width: ins }} />
        </>
      ) : null}
    </span>
  );
}

export default function ArticleEditScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(EDIT, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.wrap}>
        <div className={c.sheet}>
          <span className={c.tag} data-edited={s.edited || undefined}>
            <span className={c.icon}>{s.edited ? <Check size={9} /> : <i className={c.dot} />}</span>
            <Swap className={c.word} items={["Draft", "Edited"]} index={s.edited ? 1 : 0} />
          </span>

          <p className={c.title}>{TITLE}</p>

          {/* the body as grey lines; marks mount as they're made, so they replay every loop */}
          <div className={c.body}>
            <span className={c.row}>
              <Seg g={3.2} />
              <Seg g={6.8} />
            </span>
            <span className={c.row}>
              <Seg g={2.2} />
              <Fix g={4} step={s.a} ins="80%" caret />
              <Seg g={3.4} />
            </span>
            <span className={c.row}>
              <span className={c.text}>
                <Seg g={3} />
                <Seg g={2.2} />
              </span>
              <span className={c.leader}>{s.note >= 1 ? <i /> : null}</span>
              <span
                className={`${c.note} ${s.note >= 2 ? k.popIn : ""}`}
                data-on={s.note >= 2 || undefined}
              >
                <Check size={8} />
                Checked
              </span>
            </span>
            <span className={c.row} data-para>
              <Seg g={2} />
              <Fix g={2.4} step={s.b} ins="72%" />
              <Seg g={5} />
            </span>
            <span className={c.row}>
              <Seg g={4.4} />
              <Seg g={2.6} />
              <Seg g={3} />
            </span>
            <span className={c.row} style={{ width: "78%" }}>
              <Seg g={5} />
              <Seg g={3} />
            </span>
            <span className={c.sub} />
            <span className={c.row}>
              <Seg g={2.8} />
              <Seg g={5.2} />
              <Seg g={2} />
            </span>
            <span className={c.row}>
              <Seg g={6} />
              <Seg g={3.4} />
            </span>
            <span className={c.row}>
              <Seg g={3} />
              <Seg g={4} />
              <Seg g={2.6} />
            </span>
            <span className={c.row} style={{ width: "64%" }}>
              <Seg g={4} />
              <Seg g={3} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
