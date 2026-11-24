"use client";

/**
 * "Pages for your jobs and towns" (the six things we work on, /seo): a
 * website's Pages list. Home, About, Contact and three grey rows are already
 * there (6 pages); the pointer clicks "+ New page" three times, and each time
 * a page for one job in one town opens at the top of the list, marked New,
 * pushing the old ones down while the count rolls from 6 to 9. The pointer
 * has no "You" label, since we add the pages, not the owner (and a label
 * would sit over the new rows). Drawn as x.ai/bot's feature cards are (one
 * white window, grey placeholder lines, a few real words, a cursor doing one
 * thing), played on StageKit's timings (Nov 23 2026).
 */
import { useRef } from "react";
import { Digits, Skel, StageCursor, script, useScript, useTargetPoint } from "../StageKit";
import k from "../StallScenes.module.css";
import p from "./PagesScene.module.css";

/* ---------- small glyphs, as x.ai's ---------- */

const Doc = () => (
  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 1.75h4l2.25 2.25v5.75a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-7.5a.5.5 0 0 1 .5-.5Z" />
    <path d="M7 1.75V4h2.25" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
    <path d="M6 2.5v7M2.5 6h7" />
  </svg>
);

// the site as it is: three named pages and three more as grey lines (6 in all)
const OLD = ["Home", "About", "Contact"];
const OLD_GREY = ["42%", "34%", "38%"];
// the new pages, one job in one town each, in the order they're added
const NEW = ["Deck building · Surrey", "Fence repair · Langley", "Decks · White Rock"];

type Pg = { shown: boolean; count: boolean; added: number; at: string | null; hover: boolean; press: boolean };

const PAGES = script<Pg>(
  { shown: false, count: false, added: 0, at: null, hover: false, press: false },
  [
    [300, { shown: true }],
    [800, { count: true }],
    [1200, { at: "new" }],
    [1600, { hover: true }],
    [1850, { press: true }],
    [1950, { press: false, added: 1 }],
    [3050, { press: true }],
    [3150, { press: false, added: 2 }],
    [4250, { press: true }],
    [4350, { press: false, added: 3 }],
    [5000, { at: "after", hover: false }],
  ],
  8800,
  // the still frame: all three new pages in, the pointer resting
  5000,
);

export default function PagesScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(PAGES, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.added);
  // newest first: each new page opens at the top
  const fresh = NEW.slice(0, s.added).reverse();
  return (
    <div ref={root} className={`${k.stage} ${p.scene}`} data-dim={dim || undefined}>
      <div className={k.frame}>
        <div className={k.panel}>
          <div className={k.head}>
            <div className={p.headLeft}>
              <span className={k.title}>Pages</span>
              <span className={p.count} data-hidden={!s.count || undefined}>
                <Digits value={OLD.length + OLD_GREY.length + s.added} />
              </span>
            </div>
            <span
              className={p.newBtn}
              data-target="new"
              data-ax="0.5"
              data-ay="0.45"
              data-hover={s.hover || undefined}
              data-pressed={(s.press && s.at === "new") || undefined}
            >
              <Plus />
              New page
            </span>
          </div>
          <div>
            {fresh.map((name) => (
              <div key={name} className={`${p.row} ${p.rowNew}`}>
                <div className={p.rowInner}>
                  <span className={p.icon}>
                    <Doc />
                  </span>
                  <span className={p.name}>{name}</span>
                  <span className={p.status}>
                    <span className={p.pill}>New</span>
                  </span>
                </div>
              </div>
            ))}
            {s.shown
              ? OLD.map((name, i) => (
                  <div key={name} className={`${p.row} ${p.old} ${k.popIn}`} style={{ animationDelay: `${i * 50}ms` }}>
                    <span className={p.icon}>
                      <Doc />
                    </span>
                    <span className={p.name}>{name}</span>
                    <span className={p.status}>
                      <Skel w={22} />
                    </span>
                  </div>
                ))
              : null}
            {s.shown
              ? OLD_GREY.map((w, i) => (
                  <div key={w} className={`${p.row} ${p.old} ${k.popIn}`} style={{ animationDelay: `${(i + OLD.length) * 50}ms` }}>
                    <span className={p.icon}>
                      <Doc />
                    </span>
                    <Skel w={w} />
                    <span className={p.status}>
                      <Skel w={22} />
                    </span>
                  </div>
                ))
              : null}
          </div>
        </div>
        {/* the pointer comes in from below the cut, and rests in the empty middle of the Home row */}
        <span className={k.anchor} data-target="home" style={{ right: "24%", top: 156 }} />
        <span className={k.anchor} data-target="after" style={{ left: "50%", top: 127 }} />
      </div>
      <StageCursor at={pt} pressed={s.press} still={still} name="" />
    </div>
  );
}
