"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Cinematic, { Words } from "./Cinematic";
import Button from "./Pill";
import { T, P, Icon, Spark } from "./SightUI";
import { BOOK_URL } from "./constants";
import { reducedMotion } from "./motion";
import { TRADES, setTrade, nextTrade, useTradeState, type Q } from "./trades";

/**
 * The questions wall: the section right after the hero story. Its job is
 * to make one owner think "that's my question". The hero already proves
 * Sight answers; this one shows the questions a roofer, a distributor, a
 * print shop would actually type, one trade at a time.
 * A row of trade chips sits under the heading. The trade rotates on its
 * own every few seconds so nobody has to click; hovering the chips or the
 * wall holds it, clicking a chip pins it for the rest of the page (the
 * Ask card and the final CTA follow the same choice). The last chip,
 * "Something else", is the safety net for any trade not on the row: the
 * questions every business has, with its own subline. Rotation skips it.
 * Under the chips, three rows of ask-bar pills drift past in alternating
 * directions and crossfade when the trade changes. On hover a pill lifts,
 * its send button fills, and the question gives way to what answering it
 * used to take.
 */

/* Seconds per marquee loop. Slow enough to read a pill, fast enough to feel alive. */
const SPEEDS = [150, 165, 140];
/* Seconds a trade holds before the wall moves to the next one. */
const ROTATE = 5.6;
/* Crossfade when the trade changes (ms). Matches .sight-wall-rows in CSS. */
const FADE = 240;

function Pill({ q, before }: Q) {
  return (
    <li
      className="sight-app sight-pill flex shrink-0 cursor-default items-center gap-2.5 rounded-full border bg-white py-2.5 pl-4 pr-2 shadow-[0_1px_2px_0_rgba(20,24,33,0.04)] md:gap-3 md:py-3.5 md:pl-6 md:pr-3"
      style={{ borderColor: "#ECEDEF" }}
    >
      <span className="shrink-0" style={{ color: T.BLUE }}>
        <Spark className="h-4 w-4" />
      </span>
      {/* The question sets the width; the "before" line sits on top of it */}
      <span className="relative block whitespace-nowrap text-[14px] font-medium md:text-[17px]">
        <span className="sight-pill-q block" style={{ color: T.INK }}>
          {q}
        </span>
        <span
          aria-hidden="true"
          className="sight-pill-before absolute inset-0 block overflow-hidden text-ellipsis"
          style={{ color: T.MUTED }}
        >
          <span style={{ color: T.FAINT }}>Before ·</span> {before}
        </span>
      </span>
      <span
        className="sight-pill-send flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10"
        style={{ backgroundColor: `${T.BLUE}14`, color: T.BLUE }}
      >
        <Icon d={P.arrowUp} className="h-4 w-4" strokeWidth={2} />
      </span>
    </li>
  );
}

function Row({ items, reverse, seconds }: { items: Q[]; reverse: boolean; seconds: number }) {
  return (
    <div
      className="sight-marquee flex w-max"
      style={{ "--marquee-seconds": `${seconds}s` } as React.CSSProperties}
      {...(reverse ? { "data-reverse": true } : {})}
    >
      {/* Two identical copies; the track slides exactly one copy per loop. */}
      <ul className="flex gap-3 pr-3">
        {items.map((item) => (
          <Pill key={item.q} {...item} />
        ))}
      </ul>
      <ul aria-hidden="true" className="flex gap-3 pr-3">
        {items.map((item) => (
          <Pill key={item.q} {...item} />
        ))}
      </ul>
    </div>
  );
}

export default function QuestionsWall() {
  const { index, pinned } = useTradeState();
  const sectionRef = useRef<HTMLElement>(null);

  // `shown` lags `index` by one crossfade so the old rows fade out before
  // the new ones fade in.
  const [shown, setShown] = useState(index);
  const fading = shown !== index;
  useEffect(() => {
    if (!fading) return;
    const t = window.setTimeout(() => setShown(index), FADE);
    return () => window.clearTimeout(t);
  }, [fading, index]);

  // Auto-rotate while the wall is on screen, nobody is hovering it, and
  // the reader hasn't pinned a trade. Reduced motion: no rotation, the
  // chips still work.
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const rotating = onScreen && !hovered && !pinned && !reducedMotion();
  useEffect(() => {
    if (!rotating) return;
    const t = window.setInterval(nextTrade, ROTATE * 1000);
    return () => window.clearInterval(t);
  }, [rotating, index]);

  const trade = TRADES[index];
  const rows = TRADES[shown].rows;

  return (
    <section ref={sectionRef} id="questions" className="scroll-mt-24 pb-14 pt-10 md:pb-20 md:pt-40">
      <Cinematic className="mx-auto max-w-[52rem] px-6 text-center md:px-10">
        <Words
          className="font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
          style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
        >
          What{" "}
          <span className="sight-wall-noun" key={trade.id}>
            {trade.noun}
          </span>{" "}
          asks.
        </Words>
        <p
          data-blur
          className="mx-auto mt-5 max-w-[42rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
        >
          <span key={trade.tagline ?? "default"} className="sight-wall-sub">
            {trade.tagline ??
              "Every one of these used to be a phone call, three exports and a spreadsheet. Now it's one line and five seconds."}
          </span>
        </p>
      </Cinematic>

      {/* One line of chips, wider than the copy above. Centred when it fits,
          scrolls sideways when it doesn't (phones). */}
      <Reveal
        className="sight-chips mt-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div role="tablist" aria-label="Pick a trade" className="sight-chips-track">
          {TRADES.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                className="sight-chip"
                data-active={active || undefined}
                data-quiet={t.catchAll || undefined}
                onClick={() => setTrade(i, true)}
              >
                <span className="relative z-[1]">{t.label}</span>
                {active && rotating && (
                  <span
                    key={`${t.id}-${index}`}
                    aria-hidden="true"
                    className="sight-chip-sweep"
                    style={{ animationDuration: `${ROTATE}s` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal
        className="sight-marquee-band -mb-3 mt-9 overflow-hidden py-3 md:mt-12"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="sight-wall-rows flex flex-col gap-3 md:gap-4" data-fading={fading || undefined}>
          {rows.map((items, i) => (
            <Row
              key={`${TRADES[shown].id}-${i}`}
              items={items}
              reverse={i % 2 === 1}
              seconds={SPEEDS[i]}
            />
          ))}
        </div>
      </Reveal>

      {/* The ask, right under the wall, for the reader who just saw their
          own question go by. One path on this page: thirty minutes with
          us, where we show it on a business like theirs. */}
      <Reveal
        selector="[data-reveal]"
        className="mx-auto mt-10 flex max-w-[38rem] flex-col items-center px-6 text-center md:mt-12"
      >
        <div data-reveal>
          <Button href={BOOK_URL} variant="primary">
            Book a 30-minute demo
          </Button>
        </div>
        <p data-reveal className="mt-4 text-[0.95rem] leading-[1.6] text-[var(--ink-faint)]">
          We show you Sight on a business like yours. Nothing to set up,
          nothing to prepare.
        </p>
      </Reveal>
    </section>
  );
}
