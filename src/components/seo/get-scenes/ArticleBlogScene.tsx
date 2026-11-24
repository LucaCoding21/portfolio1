"use client";

/**
 * "Articles your customers search for" (what we take care of, /seo), draft
 * C: the website's articles, growing month after month. A row of white
 * article cards sits on the slot's warm grey with no window, newest first, as
 * a site's articles page lists them. Each card has a small picture drawn in
 * CSS (a house roof, a gutter full of leaves, a window, a front door, a fence
 * beside a hedge, siding), the question it answers as its title and the month
 * it went up, with the face of the one of us who checked it. Then a new month:
 * the row slides along to make room, a new article pops in at the front with
 * a small "New" mark, and a beat later its face pops in with a green check.
 * Three months, the older articles sliding off the right edge, then the row
 * holds with the newest still marked. No pointer and no numbers. Played on
 * StageKit's timings in x.ai/bot's light feature-card style (Nov 24 2026).
 */
import type { CSSProperties } from "react";
import { script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./ArticleBlogScene.module.css";

type Pic = "roof" | "gutter" | "window" | "door" | "fence" | "siding";

// the faces the page already uses (the solution's signatures, the hero's trust line)
const FACES = {
  w: "/free-homepage-design/team/william-face.webp",
  i: "/free-homepage-design/team/irish-photo.webp",
};

// newest first, as the articles page lists them. The first three are the new
// months that pop in; the rest are already on the site. Each question fits two
// lines on the narrowest card.
const CARDS: { pic: Pic; month: string; title: string; who: keyof typeof FACES }[] = [
  { pic: "roof", month: "Nov", title: "How long does a roof last?", who: "w" },
  { pic: "gutter", month: "Oct", title: "How often to clean gutters?", who: "i" },
  { pic: "window", month: "Sep", title: "Do you need new windows?", who: "w" },
  { pic: "door", month: "Aug", title: "Why does my door stick?", who: "i" },
  { pic: "fence", month: "Jul", title: "Fence or hedge?", who: "w" },
  { pic: "siding", month: "Jun", title: "When to replace siding", who: "i" },
];
const NEW = 3;

/** Each picture is a few flat shapes, placed in % of a fixed-shape box so it keeps its proportions on any card. */
function Picture({ pic }: { pic: Pic }) {
  switch (pic) {
    case "roof":
      return (
        <>
          <i className={c.grass} />
          <i className={c.chimney} />
          <i className={c.houseWall} />
          <i className={c.houseRoof} />
          <i className={c.houseDoor} />
          <i className={c.houseWin} />
        </>
      );
    case "gutter":
      return (
        <>
          <i className={c.eave} />
          <i className={c.winFrame} data-gutter>
            <i className={c.winGlass} />
          </i>
          <i className={c.spout} />
          <i className={c.leaf} data-l="1" />
          <i className={c.leaf} data-l="2" />
          <i className={c.leaf} data-l="3" />
          <i className={c.leaf} data-l="4" />
          <i className={c.gutterBar} />
        </>
      );
    case "window":
      return (
        <>
          <i className={c.winFrame}>
            <i className={c.winGlass} />
          </i>
          <i className={c.winSill} />
          <i className={c.shrub} data-s="1" />
          <i className={c.shrub} data-s="2" />
        </>
      );
    case "door":
      return (
        <>
          <i className={c.doorTrim} />
          <i className={c.doorLeaf}>
            <i className={c.doorPanel} data-p="1" />
            <i className={c.doorPanel} data-p="2" />
            <i className={c.doorKnob} />
          </i>
          <i className={c.doorStep} />
          <i className={c.potPlant} />
          <i className={c.pot} />
        </>
      );
    case "fence":
      return (
        <>
          <i className={c.grass} />
          <i className={c.rail} data-r="1" />
          <i className={c.rail} data-r="2" />
          {[0, 1, 2, 3].map((n) => (
            <i key={n} className={c.picket} style={{ "--p": n } as CSSProperties} />
          ))}
          <i className={c.hedge} />
        </>
      );
    case "siding":
      return (
        <>
          <i className={c.sideTrim} />
          <i className={c.winFrame} data-side>
            <i className={c.winGlass} />
          </i>
        </>
      );
  }
}

const Tick = () => (
  <svg viewBox="0 0 12 12" width="7" height="7" fill="none" aria-hidden>
    <path d="M2.4 6.3 4.9 8.8l4.7-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// added: how many new months are up (0 to 3); checked: how many of them have their face
type St = { added: number; checked: number };

const GROW = script<St>(
  { added: 0, checked: 0 },
  [
    // a beat on the page as it is, then a new article every 1.5s: the row
    // slides along, the card pops in, and its face pops in once it has landed
    [700, { added: 1 }],
    [1350, { checked: 1 }],
    [2200, { added: 2 }],
    [2850, { checked: 2 }],
    [3700, { added: 3 }],
    [4350, { checked: 3 }],
  ],
  8600,
  // the still frame: all three new months up and checked, the newest marked
  4350,
);

export default function ArticleBlogScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(GROW, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined} data-still={still || undefined}>
      {/* the row slides one card along per new month; it only eases forward,
          so the reset at the loop's start is instant */}
      <div className={c.row} data-run={s.added > 0 || undefined} style={{ "--n": s.added } as CSSProperties}>
        {CARDS.map((card, i) => {
          const fresh = i < NEW;
          // a new month's card mounts when it goes up, so its pop-in replays every loop
          if (fresh && s.added < NEW - i) return null;
          const checked = !fresh || s.checked >= NEW - i;
          const newest = fresh && s.added === NEW - i;
          return (
            <div
              key={card.month}
              className={c.card}
              data-fresh={fresh || undefined}
              style={{ "--slot": i - NEW } as CSSProperties}
            >
              <div className={c.thumb} data-pic={card.pic}>
                <i className={c.art}>
                  <Picture pic={card.pic} />
                </i>
              </div>
              {fresh ? (
                <span className={c.new} data-gone={!newest || undefined}>
                  <i />
                  New
                </span>
              ) : null}
              <div className={c.text}>
                <div className={c.title}>{card.title}</div>
                <div className={c.byline}>
                  <span className={c.month}>{card.month}</span>
                  {checked ? (
                    <span
                      className={c.face}
                      data-pop={fresh || undefined}
                      style={{ backgroundImage: `url(${FACES[card.who]})` }}
                    >
                      <span className={c.tick}>
                        <Tick />
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
