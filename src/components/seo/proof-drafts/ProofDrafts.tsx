"use client";

/**
 * Five drafts of the proof section on /seo ("Our websites alone got these
 * businesses into the top 3 on Google."), redone in the light, editorial look
 * of "The problem" and the offer above it: off-white and white, a small
 * uppercase label, the big Outfit heading, white cards, hairline rules and
 * the grey box. Nov 15 2026, for William to pick from on the dev board
 * (/seo-proof-board). The copy and screenshots are the live section's.
 *
 *   1 Cards       the live rows (Google left, AI right, taking turns), each
 *                 in a white card, one row per business
 *   2 Sticky      the offer's two columns: words and button held on the left,
 *                 the screenshots scrolling past on the right
 *   3 Searches    ruled rows like "How it works", one per search or AI
 *                 answer; hovering (a tap on phones) opens its screenshot
 *   4 Cards, hover  the problem cards' slide: six tall white cards, hovering
 *                 one widens it and slides its screenshot in
 *   5 List        a ruled list of every result on the left, the screenshot
 *                 big in the grey box on the right, stepping every 4s
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { CAL_URL } from "@/data/projects";
import { Icon, Marks, ROWS, Turns, Zoom, type Pic, type Shot } from "../ProofShots";
import p from "../SeoPage.module.css";
import d from "./ProofDrafts.module.css";

const TITLE = "Our websites alone got these businesses into the top 3 on Google.";
const LEDE = "None of them had monthly SEO. We’re starting that now with a few founding clients.";
const NOTE = "Searches checked in November 2026. Ads aren’t counted.";

const noChange = () => () => {};
function useStill() {
  return useSyncExternalStore(
    noChange,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Every result, flat, with the business it belongs to. */
type Item = { shot: Shot; who: string };
const ALL: Item[] = ROWS.flatMap((r) => [...r.google, ...r.ai].map((shot) => ({ shot, who: r.who })));

/** The line that says what the result is for. */
function forWhat(sh: Shot) {
  if (sh.search) return <>&ldquo;{sh.search}&rdquo;</>;
  if (sh.kind === "googleai") return <>&ldquo;{sh.ask}&rdquo;</>;
  return <>{sh.ask}</>;
}

function Label() {
  return <p className={d.label}>The proof</p>;
}

/** Label, heading and the lede to its right, laid out like "The problem". */
function Head() {
  return (
    <>
      <Label />
      <div className={d.headRow}>
        <h2 className={d.title}>{TITLE}</h2>
        <p className={d.aside}>{LEDE}</p>
      </div>
    </>
  );
}

function Foot() {
  return (
    <div className={d.foot}>
      <p className={d.note}>{NOTE}</p>
      <a className={p.btn} href={CAL_URL} target="_blank" rel="noopener noreferrer">
        Book a free SEO call
      </a>
    </div>
  );
}

/** One screenshot, still, fitted in a box of the given shape on its own page colour. */
function Still({
  shot,
  id,
  ratio,
  onOpen,
  fill,
}: {
  shot: Shot;
  id: string;
  ratio?: string;
  onOpen: (p: Pic) => void;
  fill?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${d.shot} ${fill ? d.shotFill : ""}`}
      style={{ background: shot.bg, aspectRatio: fill ? undefined : (ratio ?? `${shot.w} / ${shot.h}`) }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(shot);
      }}
      aria-label={`Enlarge: ${shot.alt}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.w}
        height={shot.h}
        sizes="(max-width: 760px) 92vw, 760px"
        className={d.shotImg}
      />
      <Marks shot={shot} id={id} />
    </button>
  );
}

/* ---------------------------------------------------------------- 1 */

function DraftCards({ onOpen }: { onOpen: (p: Pic) => void }) {
  return (
    <div className={d.inner}>
      <Head />
      <ul className={d.cardRows}>
        {ROWS.map((row, i) => {
          const ratio = `${row.google[0].w} / ${row.google[0].h}`;
          return (
            <li key={row.who}>
              <p className={d.rowWho}>{row.who}</p>
              <div className={d.cardPair}>
                <div className={d.whiteCard}>
                  <Turns light shots={row.google} ratio={ratio} lag={0} id={`d1g${i}`} onOpen={onOpen} />
                </div>
                <div className={d.whiteCard}>
                  <Turns light shots={row.ai} ratio={ratio} lag={2000} id={`d1a${i}`} onOpen={onOpen} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Foot />
    </div>
  );
}

/* ---------------------------------------------------------------- 2 */

function DraftSticky({ onOpen }: { onOpen: (p: Pic) => void }) {
  return (
    <div className={`${d.inner} ${d.sticky}`}>
      <div className={d.stickyLeft}>
        <div className={d.stickyHold}>
          <Label />
          <h2 className={d.title}>{TITLE}</h2>
          <p className={d.lede}>{LEDE}</p>
          <a className={p.btn} href={CAL_URL} target="_blank" rel="noopener noreferrer">
            Book a free SEO call
          </a>
          <p className={d.note}>{NOTE}</p>
        </div>
      </div>
      <ol className={d.stickyList}>
        {ROWS.map((row, i) => {
          const ratio = `${row.google[0].w} / ${row.google[0].h}`;
          return (
            <li key={row.who} className={d.stickyGroup}>
              <p className={d.ruledWho}>
                <span>{row.who}</span>
                <span className={d.count}>{row.google.length + row.ai.length} results</span>
              </p>
              <Turns light shots={row.google} ratio={ratio} lag={0} id={`d2g${i}`} onOpen={onOpen} />
              <Turns light shots={row.ai} ratio={ratio} lag={2000} id={`d2a${i}`} onOpen={onOpen} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- 3 */

function DraftSearches({ onOpen }: { onOpen: (p: Pic) => void }) {
  const [open, setOpen] = useState(0);
  const fine = useRef(false);
  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);
  let n = -1;
  return (
    <div className={d.inner}>
      <Head />
      {ROWS.map((row) => (
        <div key={row.who} className={d.searchGroup}>
          <p className={d.searchWho}>{row.who}</p>
          <ul className={d.searchList}>
            {[...row.google, ...row.ai].map((sh) => {
              n += 1;
              const i = n;
              const on = open === i;
              return (
                <li
                  key={sh.src}
                  className={d.searchRow}
                  data-on={on || undefined}
                  onMouseEnter={() => fine.current && setOpen(i)}
                  onClick={() => !fine.current && setOpen(on ? -1 : i)}
                >
                  <div className={d.searchHead}>
                    <span className={d.searchKind}>
                      <Icon kind={sh.kind} />
                      {sh.kind === "google"
                        ? "Google"
                        : sh.kind === "googleai"
                          ? "Google AI"
                          : sh.kind === "chatgpt"
                            ? "ChatGPT"
                            : "Claude"}
                    </span>
                    <span className={d.searchQ}>{forWhat(sh)}</span>
                    <span className={d.searchTag}>{sh.tag}</span>
                  </div>
                  <div className={d.searchBody}>
                    <div className={d.searchBodyIn}>
                      <div className={d.searchShot}>
                        <Still shot={sh} id={`d3-${i}`} onOpen={onOpen} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <Foot />
    </div>
  );
}

/* ---------------------------------------------------------------- 4 */

type HoverCard = { pick: string; small: string; body: string; title: string };
const HOVER_CARDS: HoverCard[][] = [
  [
    {
      pick: "/seo/proof/google-wrap-shop-langley.webp",
      small: "A wrap shop in Langley, BC",
      body: "Search “wrap shop langley” and they’re the first business on the map, right under one ad.",
      title: "#1 on the Google map",
    },
    {
      pick: "/seo/proof/google-vehicle-wraps-langley.webp",
      small: "The same wrap shop",
      body: "Search “vehicle wraps langley” and they’re first on the map again.",
      title: "#1 again, another search",
    },
    {
      pick: "/seo/proof/google-custom-railing-yakima.webp",
      small: "A railing company in Yakima, WA",
      body: "Search “custom railing yakima” and they’re the first result, and the third.",
      title: "#1 on Google",
    },
  ],
  [
    {
      pick: "/seo/proof/wrapcity-chatgpt.webp",
      small: "A wrap shop in Langley, BC",
      body: "Ask ChatGPT for the best wrap shop in Langley and it names them first.",
      title: "ChatGPT’s top pick",
    },
    {
      pick: "/seo/proof/claude-wrap-shop-langley.webp",
      small: "The same wrap shop",
      body: "Ask Claude the same question and they’re first there too.",
      title: "Claude’s top pick",
    },
    {
      pick: "/seo/proof/google-ai-overview-deck-railing-yakima.webp",
      small: "A railing company in Yakima, WA",
      body: "Search “deck railing yakima” and Google’s AI answer lists them first.",
      title: "First in Google’s AI answer",
    },
  ],
];
const bySrc = (src: string) => ALL.find((it) => it.shot.src === src)!.shot;

function HoverCardEl({ c, id, onOpen }: { c: HoverCard; id: string; onOpen: (p: Pic) => void }) {
  const [on, setOn] = useState(false);
  const shot = bySrc(c.pick);
  return (
    <li
      className={d.hCard}
      data-on={on || undefined}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <div className={d.hText}>
        <div>
          <p className={d.hSmall}>
            <Icon kind={shot.kind} /> {c.small}
          </p>
          <p className={d.hBody}>{c.body}</p>
        </div>
        <h3 className={d.hTitle}>{c.title}</h3>
      </div>
      <div className={d.hMedia}>
        <Still shot={shot} id={id} onOpen={onOpen} fill />
      </div>
    </li>
  );
}

function DraftHoverCards({ onOpen }: { onOpen: (p: Pic) => void }) {
  return (
    <div className={d.inner}>
      <Head />
      {HOVER_CARDS.map((row, r) => (
        <ol key={r} className={d.hCards}>
          {row.map((c, i) => (
            <HoverCardEl key={c.pick} c={c} id={`d4-${r}-${i}`} onOpen={onOpen} />
          ))}
        </ol>
      ))}
      <Foot />
    </div>
  );
}

/* ---------------------------------------------------------------- 5 */

const STEP_MS = 4000;

function DraftList({ onOpen }: { onOpen: (p: Pic) => void }) {
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  const still = useStill();
  const turning = !held && !still;

  useEffect(() => {
    if (!turning) return;
    const t = window.setTimeout(() => setOn((n) => (n + 1) % ALL.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [turning, on]);

  const cur = ALL[on].shot;
  let n = -1;

  return (
    <div className={d.inner}>
      <Head />
      <div className={d.list} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
        <div className={d.listItems}>
          {ROWS.map((row) => (
            <div key={row.who}>
              <p className={d.listWho}>{row.who}</p>
              <ul className={d.listUl}>
                {[...row.google, ...row.ai].map((sh) => {
                  n += 1;
                  const i = n;
                  return (
                    <li key={sh.src}>
                      <button
                        type="button"
                        className={d.listBtn}
                        data-on={i === on || undefined}
                        onClick={() => setOn(i)}
                      >
                        <Icon kind={sh.kind} />
                        <span className={d.listTag}>{sh.tag}</span>
                        <span className={d.listFor}>{forWhat(sh)}</span>
                        {i === on && (
                          <span
                            key={`${on}-${turning}`}
                            className={`${d.listBar} ${turning ? d.listBarRun : ""}`}
                            style={{ animationDuration: `${STEP_MS}ms` }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <figure className={d.greyBox}>
          <div className={d.greyStage}>
            {ALL.map((it, i) => (
              <div key={it.shot.src} className={`${d.greyShot} ${i === on ? d.greyOn : ""}`} aria-hidden={i !== on}>
                <Still shot={it.shot} id={`d5-${i}`} onOpen={onOpen} fill />
              </div>
            ))}
          </div>
          <figcaption className={d.greyCap}>
            <Icon kind={cur.kind} />
            <span>
              <strong>{cur.tag}</strong> {cur.search ? <>for &ldquo;{cur.search}&rdquo;</> : null}
            </span>
          </figcaption>
        </figure>
      </div>
      <Foot />
    </div>
  );
}

/* ---------------------------------------------------------------- board */

const DRAFTS = [
  {
    name: "Cards",
    note: "The live rows, each box in a white card, on the off-white of “The problem”.",
    C: DraftCards,
    bg: "off",
  },
  {
    name: "Sticky",
    note: "The offer’s two columns: the words and button stay put while the screenshots scroll past.",
    C: DraftSticky,
    bg: "white",
  },
  {
    name: "Searches",
    note: "Ruled rows like “How it works”, one per result. Hover a row (tap on phones) to open its screenshot.",
    C: DraftSearches,
    bg: "white",
  },
  {
    name: "Cards, hover",
    note: "The problem cards’ slide: hover a card and its screenshot slides in. Six cards, Google then AI.",
    C: DraftHoverCards,
    bg: "off",
  },
  {
    name: "List and grey box",
    note: "Every result in a ruled list, the screenshot big in the grey box. Steps every 4s, stops on hover.",
    C: DraftList,
    bg: "white",
  },
] as const;

export default function ProofDrafts() {
  const [zoom, setZoom] = useState<Pic | null>(null);
  return (
    <div className={`${p.page} ${d.board}`}>
      <nav className={d.jump} aria-label="Drafts">
        {DRAFTS.map((x, i) => (
          <a key={x.name} href={`#draft-${i + 1}`}>
            {i + 1} {x.name}
          </a>
        ))}
      </nav>
      {DRAFTS.map(({ name, note, C, bg }, i) => (
        <div key={name} id={`draft-${i + 1}`} className={d.draft}>
          <div className={d.tagBar}>
            <span className={d.num}>{i + 1}</span>
            <strong>{name}</strong>
            <span>{note}</span>
          </div>
          <section className={bg === "white" ? d.secWhite : d.secOff}>
            <C onOpen={setZoom} />
          </section>
        </div>
      ))}
      {zoom && <Zoom pic={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
