"use client";

/**
 * "Your Google listing" (the six things we work on, /seo): a business
 * profile that's only 60% filled in. Hours, Photos and Website are done
 * (green rows with a check); Services and Service areas are empty, each with
 * an "Add" pill. The pointer adds Services (its row turns green and the badge
 * rolls to 80%), then Service areas, and the badge turns into a green
 * "Complete". No brand marks; the pointer has no "You" label, since we fill
 * the listing in, not the owner. Drawn as x.ai/bot's feature cards are (one
 * white window, grey placeholder lines, a few real words, rows in the style
 * of their "Accounts" list), played on StageKit's timings (Nov 23 2026).
 */
import { useRef, type ReactNode } from "react";
import { Digits, Skel, StageCursor, script, ticks, useScript, useTargetPoint } from "../StageKit";
import k from "../StallScenes.module.css";
import l from "./ListingScene.module.css";

/* ---------- small glyphs (Lucide shapes) ---------- */

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const Check = ({ size = 10 }: { size?: number }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6.2 5 8l4-4.2" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <path d="M6 2.5v7M2.5 6h7" />
  </svg>
);

type Row = { id: string; label: string; icon: ReactNode; done?: boolean; target?: string; fill: string };

// the profile's fields in a fixed order, so the two empty ones sit in the
// top three rows and stay above the cut on the short phone band
const ROWS: Row[] = [
  {
    id: "hours",
    label: "Hours",
    done: true,
    fill: "62%",
    icon: (
      <Glyph>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </Glyph>
    ),
  },
  {
    id: "services",
    label: "Services",
    target: "add1",
    fill: "52%",
    icon: (
      <Glyph>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
      </Glyph>
    ),
  },
  {
    id: "areas",
    label: "Service areas",
    target: "add2",
    fill: "70%",
    icon: (
      <Glyph>
        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
        <path d="M15 5.764v15" />
        <path d="M9 3.236v15" />
      </Glyph>
    ),
  },
  {
    id: "photos",
    label: "Photos",
    done: true,
    fill: "44%",
    icon: (
      <Glyph>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </Glyph>
    ),
  },
  {
    id: "website",
    label: "Website",
    done: true,
    fill: "58%",
    icon: (
      <Glyph>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </Glyph>
    ),
  },
];

type St = {
  rows: number;
  badge: boolean;
  cursor: boolean;
  at: string | null;
  press: boolean;
  services: boolean;
  areas: boolean;
  pct: number;
  complete: boolean;
};

// 3 of 5 fields filled is 60%, each one added is 20% more
const LISTING = script<St>(
  { rows: 0, badge: false, cursor: false, at: null, press: false, services: false, areas: false, pct: 60, complete: false },
  [
    ...ticks<St>(300, ROWS.length, 120, "rows"),
    [1200, { badge: true }],
    [1500, { cursor: true }],
    [1800, { at: "add1" }],
    [2450, { press: true }],
    [2550, { press: false, services: true }],
    [2850, { pct: 80 }],
    [3350, { at: "add2" }],
    [3950, { press: true }],
    [4050, { press: false, areas: true }],
    [4350, { complete: true }],
    [5000, { cursor: false }],
  ],
  8200,
  5000,
);

export default function ListingScene({ playing, still, lead }: { playing: boolean; still: boolean; lead?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(LISTING, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.rows);
  const isDone = (r: Row) => r.done || (r.id === "services" && s.services) || (r.id === "areas" && s.areas);
  return (
    <div ref={root} className={`${k.stage} ${l.scene}`} data-dim={dim || undefined}>
      <div className={k.frame}>
        <div className={k.panel}>
          <div className={k.head}>
            <span className={`${k.title} ${l.title}`}>Business profile</span>
            <span className={k.badge} data-tone={s.complete ? "success" : "warning"} data-hidden={!s.badge || undefined}>
              {s.complete ? (
                <>
                  <span className={l.tick}>
                    <Check size={9} />
                  </span>
                  <Digits value="Complete" />
                </>
              ) : (
                <span className={l.pct}>
                  <Digits value={s.pct} />
                  <span>%</span>
                  <span className={l.word}>complete</span>
                </span>
              )}
            </span>
          </div>
          <div className={l.list}>
            {ROWS.slice(0, s.rows).map((r) => {
              const on = isDone(r);
              return (
                <div key={r.id} className={`${l.row} ${k.popIn}`} data-done={on || undefined}>
                  <span className={l.icon}>{r.icon}</span>
                  <span className={l.label}>{r.label}</span>
                  <span className={l.fill} data-on={on || undefined}>
                    <Skel w={r.fill} />
                  </span>
                  <span className={l.end}>
                    {r.target ? (
                      <span
                        className={l.add}
                        data-target={r.target}
                        data-ax="0.3"
                        data-pressed={(s.press && s.at === r.target) || undefined}
                        data-gone={on || undefined}
                      >
                        <Plus />
                        Add
                      </span>
                    ) : null}
                    <span className={l.check} data-hidden={!on || undefined}>
                      <Check />
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <span className={k.anchor} data-target="home" style={{ right: "18%", top: 150 }} />
      </div>
      <StageCursor at={pt} pressed={s.press} hidden={!s.cursor} still={still} name="" />
    </div>
  );
}
