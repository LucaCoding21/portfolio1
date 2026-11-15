"use client";

/**
 * The proof on the monthly SEO page (/seo): real screenshots, one row per
 * business, Google results on the left and AI answers on the right in a box
 * of the same size. Both boxes take turns through their shots every 4s, the
 * AI box 2s behind the Google box so they never change together, with a
 * short bar per shot under each box (the showing one fills until the next;
 * a tap jumps to one). Turning stops while the pointer is on a box, and with
 * reduced motion. No client names: each Google shot shows the search box,
 * each AI shot the question. On Google everything but the search box and
 * the business is dimmed; the business is ringed in yellow everywhere. A
 * tap opens the shot big (on phones it pans sideways so the words can be
 * read); a tap anywhere, the close button or Escape shuts it.
 *
 * History (Nov 10 2026): cards per client were too much text, a tilted
 * collage too playful; William picked "Rows" from six drafts, asked for the
 * AI shot to be as big as Google's, then for taking turns every 4s, for
 * Innovative Aluminum to come out ("2 websites is enough" for now) and for
 * more searches and AI answers so the proof feels abundant.
 *
 * All taken Nov 10 2026 in William's Chrome. Google with personalization off
 * and visited links shown in Google's normal blue. Wrap City: #1 on the map
 * for "wrap shop langley" (after one ad) and "vehicle wraps langley" (it
 * wasn't top 3 for "car wrap langley"). Northwest Railing: #1 in the regular
 * results for "custom railing yakima" (and #3), "railing installation
 * yakima" and "deck railing yakima", where Google's AI Overview also lists
 * it first (its map listing, with 3 reviews, is left out on purpose; the AI
 * Overview card shows the 3 reviews). ChatGPT in an unpersonalized temporary
 * chat, Claude in an incognito chat, one ask per question, kept only when
 * the client came first: ChatGPT's answers change between asks (a second
 * "best wrap shop in Langley" named Monster Auto Lab), Claude named Classic
 * Welding both times it was asked about Yakima, and Gemini errored or
 * stalled every time on William's Workspace account. Northwest Railing's
 * "top 3 railing installers" answer is from Nov 5. Ads aren't counted.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { CLAUDE_D, OPENAI_D } from "./marks";
import s from "./SeoPage.module.css";

/** x, y, width, height in the screenshot's own pixels */
export type Box = [number, number, number, number];
export type Pic = { src: string; w: number; h: number; alt: string };
export type Shot = Pic & {
  kind: "google" | "googleai" | "chatgpt" | "claude";
  /** the line under the box */
  tag: string;
  /** the Google search, for the line under the box */
  search?: string;
  /** what the AI was asked, in our words (not the exact prompt); for Google’s AI, the search */
  ask?: string;
  /** what the ring goes around */
  ring: Box[];
  /** on a results page, left bright (the search box) along with the ring; the rest is dimmed */
  keep?: Box[];
  /** the page colour around the shot, so a shorter shot fills its box */
  bg: string;
};
/** `who` describes the business without naming it */
export type Row = { who: string; google: Shot[]; ai: Shot[] };

const GOOGLE_BG = "#23242a";
const CHATGPT_BG = "#000";
const CLAUDE_BG = "#181818";
const CHATGPT_PICK = "ChatGPT’s top pick";

export const ROWS: Row[] = [
  {
    who: "A wrap shop in Langley, BC",
    google: [
      {
        kind: "google",
        src: "/seo/proof/google-wrap-shop-langley.webp",
        w: 1095,
        h: 731,
        alt: "Google search for wrap shop langley: one sponsored listing, then Wrap City first on the map",
        tag: "#1 on the Google map",
        search: "wrap shop langley",
        keep: [[240, 16, 1400, 78]],
        ring: [[278, 512, 412, 214]],
        bg: GOOGLE_BG,
      },
      {
        kind: "google",
        src: "/seo/proof/google-vehicle-wraps-langley.webp",
        w: 1344,
        h: 896,
        alt: "Google search for vehicle wraps langley, with Wrap City first on the map",
        tag: "#1 on the Google map",
        search: "vehicle wraps langley",
        keep: [[292, 18, 1100, 98]],
        ring: [[350, 250, 488, 248]],
        bg: GOOGLE_BG,
      },
    ],
    ai: [
      {
        kind: "chatgpt",
        src: "/seo/proof/wrapcity-chatgpt.webp",
        ask: "Asked for the best wrap shop in Langley",
        w: 1568,
        h: 680,
        alt: "ChatGPT asked what's the best wrap shop in Langley, BC, answering that its top recommendation is Wrap City",
        tag: CHATGPT_PICK,
        ring: [[886, 246, 170, 58]],
        bg: CHATGPT_BG,
      },
      {
        kind: "claude",
        src: "/seo/proof/claude-wrap-shop-langley.webp",
        ask: "Asked for the best wrap shop in Langley",
        w: 1400,
        h: 742,
        alt: "Claude asked what's the best wrap shop in Langley, BC, listing Wrap City first as its top pick for colour-change wraps",
        tag: "Claude’s top pick",
        ring: [[866, 570, 484, 162]],
        bg: CLAUDE_BG,
      },
      {
        kind: "chatgpt",
        src: "/seo/proof/chatgpt-vehicle-wraps-langley.webp",
        ask: "Asked who’s best for vehicle wraps in Langley",
        w: 1444,
        h: 840,
        alt: "ChatGPT asked who's the best for vehicle wraps in Langley, BC, listing Wrap City first",
        tag: CHATGPT_PICK,
        ring: [[282, 528, 190, 50]],
        bg: CHATGPT_BG,
      },
    ],
  },
  {
    who: "A railing company in Yakima, WA",
    google: [
      {
        kind: "google",
        src: "/seo/proof/google-custom-railing-yakima.webp",
        w: 1290,
        h: 761,
        alt: "Google search for custom railing yakima, with Northwest Railing the first and third results",
        tag: "#1 on Google",
        search: "custom railing yakima",
        keep: [[240, 16, 1400, 78]],
        ring: [
          [254, 136, 994, 188],
          [254, 570, 994, 186],
        ],
        bg: GOOGLE_BG,
      },
      {
        kind: "google",
        src: "/seo/proof/google-railing-installation-yakima.webp",
        w: 1568,
        h: 395,
        alt: "Google search for railing installation yakima, with Northwest Railing the first result",
        tag: "#1 on Google",
        search: "railing installation yakima",
        keep: [[290, 18, 1300, 98]],
        ring: [[318, 156, 1180, 222]],
        bg: GOOGLE_BG,
      },
      {
        kind: "google",
        src: "/seo/proof/google-deck-railing-yakima.webp",
        w: 1568,
        h: 398,
        alt: "Google search for deck railing yakima, with Northwest Railing the first result",
        tag: "#1 on Google",
        search: "deck railing yakima",
        keep: [[290, -20, 1300, 114]],
        ring: [[318, 164, 1180, 226]],
        bg: GOOGLE_BG,
      },
    ],
    ai: [
      {
        kind: "chatgpt",
        src: "/seo/chatgpt-yakima.webp",
        ask: "Asked for the top 3 railing installers in Yakima",
        w: 790,
        h: 224,
        alt: "ChatGPT's top 3 railing installers in Yakima, with Northwest Railing listed first",
        tag: CHATGPT_PICK,
        ring: [[158, 60, 170, 40]],
        bg: CHATGPT_BG,
      },
      {
        kind: "googleai",
        src: "/seo/proof/google-ai-overview-deck-railing-yakima.webp",
        ask: "deck railing yakima",
        w: 1425,
        h: 840,
        alt: "Google's AI Overview for deck railing yakima, listing Northwest Railing first under custom railing contractors and installers in Yakima",
        tag: "First in Google’s AI Overview",
        ring: [[288, 648, 444, 180]],
        bg: GOOGLE_BG,
      },
      {
        kind: "chatgpt",
        src: "/seo/proof/chatgpt-deck-railing-yakima.webp",
        ask: "Asked who to hire for deck railings in Yakima",
        w: 1568,
        h: 438,
        alt: "ChatGPT asked who to hire for deck railings in Yakima, WA, answering that it would start with Northwest Railing",
        tag: CHATGPT_PICK,
        ring: [[676, 190, 282, 48]],
        bg: CHATGPT_BG,
      },
    ],
  },
];

const TURN_MS = 4000;
/** how far the AI box runs behind the Google box */
const AI_LAG_MS = 2000;

export function Icon({ kind }: { kind: Shot["kind"] }) {
  if (kind === "chatgpt") {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
        <path fill="currentColor" fillRule="evenodd" d={OPENAI_D} />
      </svg>
    );
  }
  if (kind === "claude") {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
        <path fill="#D97757" d={CLAUDE_D} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

/** The dim (results pages only) and the yellow ring, drawn in the screenshot's own pixels. */
export function Marks({ shot, id }: { shot: Shot; id: string }) {
  const r = (b: Box, key: string, extra?: React.SVGProps<SVGRectElement>) => (
    <rect key={key} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx={Math.min(16, b[3] / 2)} {...extra} />
  );
  // Centred and fitted like the image (object-fit: contain), so the marks
  // land on the same pixels whatever the box's shape. The dim reaches past
  // the shot (the svg shows overflow) to cover the box around a shorter one.
  const far = { x: -shot.w, y: -shot.h, width: shot.w * 3, height: shot.h * 3 };
  return (
    <svg className={s.marks} viewBox={`0 0 ${shot.w} ${shot.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      {shot.keep && (
        <>
          <mask id={id} maskUnits="userSpaceOnUse" {...far}>
            <rect {...far} fill="#fff" />
            {shot.keep.map((b, i) => r(b, `k${i}`, { fill: "#000", rx: b[3] / 2 }))}
            {shot.ring.map((b, i) => r(b, `h${i}`, { fill: "#000" }))}
          </mask>
          <rect {...far} className={s.marksDim} mask={`url(#${id})`} />
        </>
      )}
      {shot.ring.map((b, i) => r(b, `r${i}`, { className: s.marksRing }))}
    </svg>
  );
}

export type Open = (p: Pic) => void;

const noChange = () => () => {};

/**
 * A box the shape of the row's first Google shot, holding its shots stacked
 * and taking turns; each fits inside on its own page colour.
 */
export function Turns({
  shots,
  ratio,
  lag,
  id,
  onOpen,
  light,
}: {
  shots: Shot[];
  ratio: string;
  lag: number;
  id: string;
  onOpen: Open;
  /** on a light page (the drafts board) */
  light?: boolean;
}) {
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  // The first turn waits the lag on top, so the two boxes stay apart.
  const [started, setStarted] = useState(false);
  const still = useSyncExternalStore(
    noChange,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const turning = shots.length > 1 && !held && !still;
  const wait = started ? TURN_MS : TURN_MS + lag;
  const timer = useRef(0);

  useEffect(() => {
    if (!turning) return;
    timer.current = window.setTimeout(() => {
      setStarted(true);
      setOn((n) => (n + 1) % shots.length);
    }, wait);
    return () => window.clearTimeout(timer.current);
  }, [turning, on, wait, shots.length]);

  const shot = shots[on];

  return (
    <figure
      className={`${s.fig} ${light ? s.figLight : ""}`}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <div className={s.box} style={{ aspectRatio: ratio }}>
        {shots.map((sh, i) => (
          <button
            key={sh.src}
            type="button"
            className={`${s.shot} ${i === on ? s.shotOn : s.shotOff}`}
            style={{ background: sh.bg }}
            onClick={() => onOpen(sh)}
            aria-label={`Enlarge: ${sh.alt}`}
            aria-hidden={i !== on}
            tabIndex={i === on ? 0 : -1}
          >
            <Image
              src={sh.src}
              alt={sh.alt}
              width={sh.w}
              height={sh.h}
              sizes="(max-width: 760px) 92vw, 600px"
              className={s.shotImg}
            />
            <Marks shot={sh} id={`${id}-${i}`} />
          </button>
        ))}
      </div>
      <figcaption className={s.capRow}>
        <span className={s.cap}>
          <Icon kind={shot.kind} />
          <span>
            <strong>{shot.tag}</strong>
            {shot.search && <> for &ldquo;{shot.search}&rdquo;</>}
          </span>
        </span>
        {shots.length > 1 && (
          <span className={s.ticks}>
            {shots.map((sh, n) => (
              <button
                key={sh.src}
                type="button"
                className={s.tick}
                onClick={() => {
                  setStarted(true);
                  setOn(n);
                }}
                aria-label={`Show screenshot ${n + 1} of ${shots.length}`}
                aria-pressed={n === on}
              >
                <span
                  // keyed on the turn so the fill restarts each time
                  key={n === on ? `on-${on}-${started}` : "off"}
                  className={`${s.tickFill} ${n === on ? (turning ? s.tickRun : s.tickFull) : ""}`}
                  style={n === on && turning ? { animationDuration: `${wait}ms` } : undefined}
                />
              </button>
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/** The enlarged screenshot; a tap anywhere, the close button or Escape shuts it. */
export function Zoom({ pic, onClose }: { pic: Pic; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={s.zoom} role="dialog" aria-modal="true" aria-label={pic.alt}>
      <button
        type="button"
        aria-label="Close the enlarged screenshot"
        className={s.zoomBackdrop}
        onClick={() => onClose()}
      />
      <div className={s.zoomPan}>
        <Image src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} sizes={`${pic.w}px`} className={s.zoomImg} />
      </div>
      <button type="button" aria-label="Close" className={s.zoomClose} onClick={() => onClose()} autoFocus>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function ProofShots() {
  const [open, setOpen] = useState<Pic | null>(null);

  return (
    <>
      <ul className={s.rows}>
        {ROWS.map((row, i) => {
          const ratio = `${row.google[0].w} / ${row.google[0].h}`;
          return (
            <li key={row.google[0].src} className={s.row}>
              <p className={s.rowWho}>{row.who}</p>
              {/* Nov 15 2026: one shot each, no taking turns and no bars, by
                  request; the rest stay in ROWS for the drafts board */}
              <Turns shots={row.google.slice(0, 1)} ratio={ratio} lag={0} id={`g-${i}`} onOpen={setOpen} />
              <Turns shots={row.ai.slice(0, 1)} ratio={ratio} lag={AI_LAG_MS} id={`ai-${i}`} onOpen={setOpen} />
            </li>
          );
        })}
      </ul>

      {open && <Zoom pic={open} onClose={() => setOpen(null)} />}
    </>
  );
}
