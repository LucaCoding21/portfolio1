"use client";

/**
 * "Pages for your jobs and towns" (the six things we work on, /seo): the
 * website as a site map that grows. Home sits on the left with the pages it
 * already has as two faint chips (grey lines, no words); then a line draws
 * down the trunk and out, and a new page buds off the end of it, one job in
 * one town, with a green dot to say it's new. Three of them, about a second
 * apart, then the grown tree holds. No window and no pointer: the chips sit
 * on the slot's warm grey, drawn as x.ai/bot's feature cards are (white
 * chips, grey placeholder lines, a few real words, their pop-in and check-in
 * timings), played on StageKit's timings (Nov 23 2026).
 */
import { Skel, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./PagesTreeScene.module.css";

const House = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1.75 5.6 6 2l4.25 3.6" />
    <path d="M2.9 4.7v4.8a.5.5 0 0 0 .5.5h1.85V7.6h1.5V10H8.6a.5.5 0 0 0 .5-.5V4.7" />
  </svg>
);

// the pages the site already has, as grey lines (their widths); the third
// shows only in the tall slot
const OLD = [56, 44, 50];
// the new pages, one job in one town each, in the order they're added; the
// short names go in the narrow slots
const NEW = [
  { long: "Deck building · Surrey, BC", short: "Decks · Surrey, BC" },
  { long: "Fence repair · Langley", short: "Fences · Langley" },
  { long: "Decks · White Rock", short: "Decks · White Rock" },
];

type Tree = { added: number };

const TREE = script<Tree>(
  { added: 0 },
  [
    [700, { added: 1 }],
    [1800, { added: 2 }],
    [2900, { added: 3 }],
  ],
  8200,
  // the still frame: the grown tree, all three new pages in
  2900,
);

export default function PagesTreeScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(TREE, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined} data-still={still || undefined}>
      <div className={c.fit}>
        <div className={c.tree}>
          <span className={c.home}>
            <House />
            Home
          </span>
          <div className={c.list}>
            {OLD.map((w, i) => (
              <div
                key={`old-${i}`}
                className={c.row}
                data-kind="old"
                data-after={i === 0 ? undefined : i === 1 ? "first" : "old"}
                data-extra={i === 2 || undefined}
              >
                <i className={i ? c.elbow : c.across} />
                <span className={c.old}>
                  <Skel w={w * 0.6} h={4} strong />
                </span>
              </div>
            ))}
            {NEW.map((pg, i) => {
              const live = s.added > i;
              return (
                <div key={pg.long} className={c.row} data-kind="new" data-after={i ? "new" : "old"}>
                  {/* the branch draws, then the page buds off its end (keyed, so both replay each loop) */}
                  {live ? <i key="branch" className={c.elbow} data-draw /> : null}
                  <span key={live ? "live" : "ghost"} className={c.page} data-ghost={!live || undefined}>
                    <i className={c.dot} />
                    <span className={c.long}>{pg.long}</span>
                    <span className={c.short}>{pg.short}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
