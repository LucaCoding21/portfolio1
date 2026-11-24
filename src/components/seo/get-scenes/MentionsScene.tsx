"use client";

/**
 * "Mentions on other sites" (the six things we work on, /seo): you look your
 * business up. The pointer clicks a search field, "Your business" types in
 * letter by letter, the arrow is pressed, and four results land one under
 * another, each a different kind of site with a small glyph and a grey line
 * for its snippet: a local directory, the Chamber of Commerce and a home
 * services site, each marked Listed, then the local news, marked Mentioned.
 * No brand names or logos. Drawn as x.ai/bot's feature cards are (one white
 * window, grey placeholder lines, a few real words, a "You" cursor, their
 * typed fields), played on StageKit's timings (Nov 23 2026).
 */
import { useRef, type ReactNode } from "react";
import { Skel, StageCursor, script, ticks, useScript, useTargetPoint } from "../StageKit";
import k from "../StallScenes.module.css";
import m from "./MentionsScene.module.css";

/* ---------- small glyphs, as x.ai's ---------- */

const Glyph = ({ size = 9, children }: { size?: number; children: ReactNode }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6.2 5 8l4-4.2" />
  </svg>
);

const QUERY = "Your business";

// each result: the kind of site, a glyph for its favicon (no logos), what it
// does for you, and how long its grey snippet runs
const RESULTS: { name: string; tag: string; snip: string; icon: ReactNode }[] = [
  {
    name: "Local directory",
    tag: "Listed",
    snip: "64%",
    icon: (
      <>
        <path d="M4.75 3.5h4.75M4.75 6h4.75M4.75 8.5h4.75" />
        <path d="M2.5 3.5h.01M2.5 6h.01M2.5 8.5h.01" />
      </>
    ),
  },
  {
    name: "Chamber of Commerce",
    tag: "Listed",
    snip: "50%",
    icon: (
      <>
        <path d="M2 9.75h8M2.5 4.25 6 2.25l3.5 2" />
        <path d="M3.5 5.25v3M6 5.25v3M8.5 5.25v3" />
      </>
    ),
  },
  {
    name: "Home services site",
    tag: "Listed",
    snip: "58%",
    icon: (
      <>
        <path d="M2.5 5.25 6 2.5l3.5 2.75V9.5h-7Z" />
        <path d="M5 9.5V7.25h2V9.5" />
      </>
    ),
  },
  {
    name: "Local news",
    tag: "Mentioned",
    snip: "72%",
    icon: (
      <>
        <rect x="2.25" y="2.5" width="7.5" height="7" rx="1" />
        <path d="M4 4.75h4M4 6.5h4M4 8h2.5" />
      </>
    ),
  },
];

type Mn = { at: string | null; press: boolean; focus: boolean; typed: number; found: number; gone: boolean };

const MENTIONS = script<Mn>(
  { at: null, press: false, focus: false, typed: 0, found: 0, gone: false },
  [
    [400, { at: "field" }],
    [1000, { press: true }],
    [1100, { press: false, focus: true }],
    // x.ai's typed fields: a letter every 45ms
    ...ticks<Mn>(1300, QUERY.length, 45, "typed"),
    [2050, { at: "go" }],
    [2600, { press: true }],
    [2700, { press: false, focus: false }],
    // the pointer leaves down the right side, then fades, so it never sits on a result
    [2850, { at: "after" }],
    [3000, { found: 1 }],
    [3500, { gone: true }],
    [3600, { found: 2 }],
    [4200, { found: 3 }],
    [4800, { found: 4 }],
  ],
  8900,
  // the still frame: the search done and all four results in
  4800,
);

export default function MentionsScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(MENTIONS, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.found);
  return (
    <div ref={root} className={`${k.stage} ${m.scene}`} data-dim={dim || undefined}>
      <div className={k.frame}>
        <div className={k.panel}>
          <div className={m.searchHead}>
            <div className={m.field} data-target="field" data-focus={s.focus || undefined}>
              <Glyph size={11}>
                <circle cx="5.25" cy="5.25" r="3.25" />
                <path d="m7.75 7.75 2 2" />
              </Glyph>
              <span className={m.query}>
                {QUERY.slice(0, s.typed)}
                <span className={m.caret} data-on={s.focus || undefined} />
                {s.typed === 0 ? <Skel w={58} /> : null}
              </span>
              <span
                className={m.go}
                data-target="go"
                data-ax="0.5"
                data-ay="0.55"
                data-ready={s.typed > 0 || undefined}
                data-pressed={(s.press && s.at === "go") || undefined}
              >
                <Glyph>
                  <path d="M2.75 6h6.5M6.5 3.25 9.25 6 6.5 8.75" />
                </Glyph>
              </span>
            </div>
          </div>
          <div className={m.results}>
            {RESULTS.slice(0, s.found).map((r) => (
              <div key={r.name} className={`${m.result} ${k.popIn}`}>
                <span className={m.fav}>
                  <Glyph>{r.icon}</Glyph>
                </span>
                <span className={m.name}>{r.name}</span>
                <span className={m.pill}>
                  <Check />
                  {r.tag}
                </span>
                <span className={m.snip}>
                  <Skel w={r.snip} />
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* the pointer comes in from below the cut and leaves past the lower right */}
        <span className={k.anchor} data-target="home" style={{ left: "60%", top: 156 }} />
        <span className={k.anchor} data-target="after" style={{ right: "3%", top: 176 }} />
      </div>
      <StageCursor at={pt} pressed={s.press} hidden={s.gone} still={still} />
    </div>
  );
}
