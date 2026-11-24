"use client";

/**
 * "Mentions on other sites" (the six things we work on, /seo): clippings
 * landing on a pile, like papers dropped on a desk, with no window. Three
 * white pages drop in one at a time, each from a different kind of site and
 * each a little tilted: a local news story, the Chamber of Commerce's member
 * list and a local directory listing with five stars. As each one lands,
 * "Your business" on it gets a swipe of yellow highlighter. Grey lines stand
 * for everything else, so no other business is named. Played on StageKit's
 * timings, in x.ai/bot's light feature-card style (Nov 23 2026).
 */
import type { ReactNode } from "react";
import { Skel, script, useScript } from "../StageKit";
import k from "../StallScenes.module.css";
import c from "./MentionsPileScene.module.css";

type St = { pages: number; marks: number };

const PILE = script<St>(
  { pages: 0, marks: 0 },
  [
    // a beat of empty slot, then a page every 1.4s, its highlight 0.55s after it lands
    [400, { pages: 1 }],
    [950, { marks: 1 }],
    [1800, { pages: 2 }],
    [2350, { marks: 2 }],
    [3200, { pages: 3 }],
    [3750, { marks: 3 }],
  ],
  8200,
  // the still frame: the whole pile, every highlight on
  3750,
);

/** The yellow marker swipe over "Your business". */
function Mark({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span className={c.mark} data-on={on || undefined}>
      {children}
    </span>
  );
}

/** A grey line that takes up the rest of its row. */
const Fill = ({ h = 4 }: { h?: number }) => <span className={`${k.skel} ${c.fill}`} style={{ height: h }} />;

const Star = () => (
  <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden>
    <path
      d="M6 .9l1.5 3.15 3.45.45-2.53 2.4.63 3.42L6 8.66 2.95 10.32l.63-3.42L1.05 4.5l3.45-.45z"
      fill="currentColor"
    />
  </svg>
);

/** A shop front, for the business's square in the directory (no logo). */
const Shop = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 4.6 2.8 2h6.4l.8 2.6" />
    <path d="M2 4.6c0 .9.7 1.4 1.33 1.4S4.67 5.5 4.67 4.6c0 .9.66 1.4 1.33 1.4s1.33-.5 1.33-1.4c0 .9.7 1.4 1.34 1.4S10 5.5 10 4.6" />
    <path d="M2.75 6v4h6.5V6M5 10V8h2v2" />
  </svg>
);

function News({ on }: { on: boolean }) {
  return (
    <div className={c.page} data-p="news">
      <div className={c.masthead}>Local news</div>
      <div className={c.headline}>
        <Skel w="94%" h={6} strong />
        <Skel w="58%" h={6} strong />
      </div>
      <div className={c.body}>
        <Skel w="100%" h={4} />
        <span className={c.textRow}>
          <Skel w={26} h={4} />
          <Mark on={on}>Your business</Mark>
          <Fill />
        </span>
        <Skel w="91%" h={4} />
        <Skel w="97%" h={4} />
        <Skel w="84%" h={4} />
        <Skel w="93%" h={4} />
        <Skel w="62%" h={4} />
      </div>
    </div>
  );
}

function Chamber({ on }: { on: boolean }) {
  const row = (name: string) => (
    <span className={c.member}>
      <i className={c.bullet} />
      <Skel w={name} h={5} />
      <span className={c.trade}>
        <Skel w={26} h={4} />
      </span>
    </span>
  );
  return (
    <div className={c.page} data-p="chamber">
      <div className={c.label}>
        <span>
          Chamber of Commerce<span className={c.labelMore}> · Members</span>
        </span>
      </div>
      <div className={c.members}>
        {row("44%")}
        <span className={c.member}>
          <i className={c.bullet} data-you />
          <Mark on={on}>Your business</Mark>
          <span className={c.trade}>
            <Skel w={22} h={4} />
          </span>
        </span>
        {row("52%")}
        {row("38%")}
        {row("47%")}
        {row("41%")}
      </div>
    </div>
  );
}

function Directory({ on }: { on: boolean }) {
  const other = (a: string, b: string) => (
    <span className={c.listing}>
      <i className={c.avatar} />
      <span className={c.who}>
        <Skel w={a} h={5} strong />
        <Skel w={b} h={4} />
      </span>
    </span>
  );
  return (
    <div className={c.page} data-p="dir">
      <div className={c.label}>
        Local directory
      </div>
      <div className={c.listings}>
        <span className={c.listing}>
          <i className={c.avatar} data-you>
            <Shop />
          </i>
          <span className={c.who}>
            <span className={c.name}>
              <Mark on={on}>Your business</Mark>
            </span>
            <span className={c.stars}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </span>
          </span>
        </span>
        {other("56%", "34%")}
        {other("48%", "40%")}
        {other("60%", "30%")}
      </div>
    </div>
  );
}

export default function MentionsPileScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const { s, dim } = useScript(PILE, playing, still, lead);
  return (
    <div className={`${k.stage} ${c.scene}`} data-dim={dim || undefined}>
      <div className={c.room}>
        {/* each page mounts as it drops, so its landing replays every loop */}
        <div className={c.pile}>
          {s.pages >= 1 ? <News on={s.marks >= 1} /> : null}
          {s.pages >= 2 ? <Chamber on={s.marks >= 2} /> : null}
          {s.pages >= 3 ? <Directory on={s.marks >= 3} /> : null}
        </div>
      </div>
    </div>
  );
}
