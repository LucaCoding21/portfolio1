"use client";

/**
 * The small scenes that slide into the problem cards (Nov 15 2026), drawn the
 * way x.ai/bot draws its feature cards: one plain white window, grey lines
 * for everything that isn't the point, a few real words, a cursor that does
 * one thing, and their timings (StageKit). William asked for that look 1:1
 * with our own story, and picked the calendar from drafts on Nov 15 2026 (a
 * quiet phone, a calls chart, a jargon report and a vague reply were the
 * others) and the pull on Nov 23 2026.
 *
 * Card 2, "Some months are slow": the calendar, a full October, then six
 * jobs in November.
 * Card 3, "Your website isn't bringing in leads": the pull, a phone's
 * inquiries folder pulled to refresh while the days pass, and nothing new
 * comes in. William liked the idea of refreshing and waiting for leads, and
 * picked this from four takes on it (the contact form inbox, a message that
 * turns out to be spam, a counter that lands on 0); before that, numbers and
 * a "How did they find you?" card were turned down, and the invoice was card
 * 3's scene for "You don't know what you're paying for" (Nov 15 to 23).
 */
import { useRef, type ReactNode } from "react";
import { Digits, Skel, StageCursor, Swap, script, ticks, useScript, useTargetPoint } from "./StageKit";
import k from "./StallScenes.module.css";

export type SceneId = "calendar" | "pull";

type SceneProps = { playing: boolean; still: boolean; lead?: number };

/* ---------- small glyphs, 1.8px strokes as x.ai's ---------- */

const Chevron = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 4.5 3 3 3-3" />
  </svg>
);
const Check = ({ size = 10 }: { size?: number }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6.2 5 8l4-4.2" />
  </svg>
);
function Stage({
  root,
  dim,
  children,
}: {
  root: React.RefObject<HTMLDivElement | null>;
  dim: boolean;
  children: ReactNode;
}) {
  return (
    <div ref={root} className={k.stage} data-dim={dim || undefined}>
      {children}
    </div>
  );
}

/* ---------- card 2: the calendar ---------- */

type Cal = {
  booked: number;
  badge: boolean;
  at: string | null;
  press: boolean;
  menu: boolean;
  hover: boolean;
  month: number;
  nov: number;
};
// Sunday first (as North American calendars), five weeks; the weekends
// (the first and last columns) stay free
const OCT = [1, 2, 3, 4, 8, 9, 11, 12, 15, 16, 17, 22, 23, 25, 29, 30];
// November: 6 jobs (William, Nov 15 2026; 2 read as too few), spread over the month
const NOV = [2, 8, 12, 17, 23, 26];
const CELLS = Array.from({ length: 35 }, (_, i) => i);
const MONTHS = ["October", "November", "December"];

const CAL = script<Cal>(
  { booked: 0, badge: false, at: null, press: false, menu: false, hover: false, month: 0, nov: 0 },
  [
    ...ticks<Cal>(300, OCT.length, 70, "booked"),
    [1550, { badge: true }],
    [2050, { at: "month" }],
    [2650, { press: true }],
    [2750, { press: false, menu: true }],
    [3050, { at: "nov" }],
    [3400, { hover: true }],
    [3600, { press: true }],
    [3700, { press: false, menu: false, hover: false, month: 1 }],
    // slower than October's 70ms: a job every 450ms
    ...ticks<Cal>(4100, NOV.length, 450, "nov"),
    [6800, { at: "after" }],
  ],
  9300,
  6800,
);

function Calendar({ playing, still, lead }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(CAL, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.menu);
  const jobs = s.month ? s.nov : OCT.length;
  return (
    <Stage root={root} dim={dim}>
      <div className={k.frame}>
        <div className={k.panel}>
          <div className={k.head}>
            <div className={k.rel}>
              <span
                className={k.select}
                data-target="month"
                data-ax="0.86"
                data-pressed={(s.press && s.at === "month") || undefined}
              >
                <Swap items={MONTHS.slice(0, 2)} index={s.month} />
                <Chevron />
              </span>
              <div className={k.menu} data-closed={!s.menu || undefined}>
                {MONTHS.map((m, i) => (
                  <span
                    key={m}
                    className={k.menuItem}
                    data-target={i === 1 ? "nov" : undefined}
                    data-ax="0.62"
                    data-hover={(i === 1 && s.hover) || undefined}
                  >
                    <span className={k.menuCheck}>{i === 0 ? <Check /> : null}</span>
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <span className={k.badge} data-tone={s.month ? "warning" : "success"} data-hidden={!s.badge || undefined}>
              <Digits value={jobs} />
              <span>{jobs === 1 ? "job" : "jobs"}</span>
            </span>
          </div>
          <div className={k.week}>
            {"SMTWTFS".split("").map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className={k.pages}>
            {[OCT, NOV].map((days, m) => (
              <div key={m} className={k.grid} data-hidden={s.month !== m || undefined}>
                {CELLS.map((c) => {
                  const n = days.indexOf(c);
                  const on = n > -1 && n < (m ? s.nov : s.booked);
                  return (
                    <span key={c} className={k.day} data-weekend={c % 7 === 0 || c % 7 === 6 || undefined} data-on={on || undefined}>
                      <i />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <span className={k.anchor} data-target="home" style={{ right: "22%", top: 150 }} />
        <span className={k.anchor} data-target="after" style={{ right: "14%", top: 118 }} />
      </div>
      <StageCursor at={pt} pressed={s.press} still={still} />
    </Stage>
  );
}

/* ---------- card 3: your website isn't bringing in leads (Nov 23 2026) ---------- */

const Refresh = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 6a4 4 0 1 1-1.2-2.85" />
    <path d="M10 1.8v2.4H7.6" />
  </svg>
);

const OLD_MESSAGES = ["Oct 29", "Oct 2"];

/* the pull: the inquiries folder on your phone; you pull down to refresh,
   it spins, and the days go by with nothing new */
type Pl = { shown: boolean; at: string | null; press: boolean; pull: boolean; spin: boolean; day: number; touch: boolean };
const PULL_DAYS = ["Updated Mon 9:02 AM", "Updated Wed 4:15 PM", "Updated Fri 11:30 AM"];
const PULL = script<Pl>(
  { shown: false, at: null, press: false, pull: false, spin: false, day: 0, touch: false },
  [
    [300, { shown: true }],
    [800, { touch: true, at: "pullFrom" }],
    [1300, { press: true }],
    [1400, { at: "pullTo", pull: true }],
    [2000, { press: false, pull: false, spin: true }],
    [2900, { spin: false, day: 1 }],
    [3400, { at: "pullFrom" }],
    [3900, { press: true }],
    [4000, { at: "pullTo", pull: true }],
    [4600, { press: false, pull: false, spin: true }],
    [5500, { spin: false, day: 2 }],
    [6000, { touch: false }],
  ],
  8400,
  6000,
);

function Pull({ playing, still, lead }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const { s, dim } = useScript(PULL, playing, still, lead);
  const pt = useTargetPoint(root, s.at, s.shown);
  return (
    <Stage root={root} dim={dim}>
      <div className={k.phoneFrame}>
        <span className={k.island} />
        <div className={k.phoneHead}>
          <span className={k.title}>Inquiries</span>
          <Swap className={k.phoneUpdated} items={PULL_DAYS} index={s.day} />
        </div>
        <div className={k.pullZone}>
          <span className={k.pullSpin} data-on={s.pull || s.spin || undefined} data-spin={s.spin || undefined}>
            <Refresh />
          </span>
          <div className={k.pullList} data-pull={s.pull || undefined} data-spin={s.spin || undefined}>
            <span className={k.anchor} data-target="pullFrom" style={{ left: "58%", top: 6 }} />
            <span className={k.anchor} data-target="pullTo" style={{ left: "58%", top: 52 }} />
            <p className={k.formNote} data-hidden={s.day < 1 || s.spin || undefined}>
              No new inquiries
            </p>
            {s.shown
              ? OLD_MESSAGES.map((date) => (
                  <div key={date} className={`${k.oldMsg} ${k.popIn}`}>
                    <span className={k.oldDot} />
                    <Skel w="54%" />
                    <span className={k.oldDate}>{date}</span>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
      <StageCursor at={pt} pressed={s.press} hidden={!s.touch} still={still} touch />
    </Stage>
  );
}

const SCENES: Record<SceneId, (p: SceneProps) => ReactNode> = {
  calendar: Calendar,
  pull: Pull,
};

export default function StallScene({ id, ...props }: { id: SceneId } & SceneProps) {
  const Scene = SCENES[id];
  return <Scene {...props} />;
}
