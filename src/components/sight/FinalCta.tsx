"use client";

import Pill from "./Pill";
import SkyCanvas from "./SkyCanvas";
import { Icon, P } from "./SightUI";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useSightGsap } from "./motion";
import { BOOK_URL } from "./constants";
import Cinematic, { Words } from "./Cinematic";
import { useTrade } from "./trades";

/**
 * Final CTA: a white card floating on a live painted sky, the clouds
 * drifting behind it, the card drifting against them as you scroll. Inside,
 * the ask bar from the top of the page is back, and the reader's own
 * questions type themselves into it, one after another, so the last
 * thing they see is the thing they came for. One button.
 */

/*
 * The questions come from the trade picked on the questions wall, so the
 * last thing a roofer sees is a roofer's question. They're read fresh at
 * the start of each question, so a change on the wall shows up here on
 * the next one without restarting the loop.
 */

/* timing (s) */
const CHAR = 0.045;
const ERASE = 0.014;
const HOLD = 2.2;
const GAP = 0.5;

export default function FinalCta() {
  const trade = useTrade();
  const questionsRef = useRef(trade.cta);
  useEffect(() => {
    questionsRef.current = trade.cta;
  }, [trade]);

  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const card = root.querySelector<HTMLElement>("[data-cta-card]");
    const typed = root.querySelector<HTMLElement>("[data-typed]");
    const caret = root.querySelector<HTMLElement>("[data-caret]");
    const send = root.querySelector<HTMLElement>("[data-send]");

    const setTyped = (t: string) => {
      if (typed) typed.textContent = t;
    };

    if (reduced) {
      setTyped(questionsRef.current[0]);
      if (caret) gsap.set(caret, { autoAlpha: 0 });
      return;
    }

    // the card drifts up against the sky as you scroll
    gsap.fromTo(
      card,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      }
    );

    // the card arrives once
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 60%", once: true },
    });

    // questions type themselves into the ask bar, one at a time. Each
    // question is its own small timeline; when it finishes, the next one
    // is read from the current trade and started. Off screen the loop
    // pauses where it is.
    setTyped("");
    let current: gsap.core.Timeline | null = null;
    let i = 0;
    let onScreen = false;

    const play = () => {
      const list = questionsRef.current;
      const q = list[i % list.length];
      i += 1;
      const proxy = { n: 0 };
      current = gsap.timeline({ paused: !onScreen, onComplete: play });
      current.to(
        proxy,
        {
          n: q.length,
          duration: q.length * CHAR,
          ease: "none",
          onUpdate: () => setTyped(q.slice(0, Math.round(proxy.n))),
        },
        GAP
      );
      const done = GAP + q.length * CHAR;
      // the send button dips when the question is complete
      current
        .to(send, { scale: 0.86, duration: 0.12, ease: "power2.in" }, done + 0.15)
        .to(send, { scale: 1, duration: 0.4, ease: "back.out(2.5)" }, done + 0.27);
      current.to(
        proxy,
        {
          n: 0,
          duration: q.length * ERASE,
          ease: "none",
          onUpdate: () => setTyped(q.slice(0, Math.round(proxy.n))),
        },
        done + HOLD
      );
    };

    ScrollTrigger.create({
      trigger: root,
      start: "top 60%",
      onToggle: (self) => {
        onScreen = self.isActive;
        if (onScreen) current?.play();
        else current?.pause();
      },
    });
    play();
  });

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <SkyCanvas />
      </div>
      {/* the sky dissolves into the white page above and below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[26vh]"
        style={{ background: "linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh]"
        style={{ background: "linear-gradient(to top, #fff 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 100%)" }}
      />

      <div className="relative flex min-h-[92vh] items-center justify-center px-6 py-28 md:py-40">
        <div
          data-cta-card
          className="w-full max-w-[640px] rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_70px_-24px_rgba(20,24,33,0.32)] md:p-14"
        >
          <Cinematic start="top 85%">
            <Words
              className="font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--ink)]"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)" }}
            >
              Bring three questions you can&apos;t easily answer.
            </Words>
          </Cinematic>

          {/* the ask bar, with the reader's questions typing themselves in */}
          <div
            aria-hidden="true"
            className="mx-auto mt-8 flex max-w-[30rem] items-center gap-3 rounded-full border border-[var(--line)] bg-white py-2.5 pl-5 pr-2.5 text-left shadow-[0_8px_24px_-14px_rgba(20,24,33,0.25)]"
          >
            <span className="flex min-w-0 flex-1 items-center text-[0.98rem] text-[var(--ink)]">
              <span data-typed className="truncate" />
              <span
                data-caret
                className="sight-caret ml-px inline-block h-[1.05em] w-[2px] shrink-0 rounded-full bg-[var(--blue)]"
              />
            </span>
            <span
              data-send
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--blue)] text-white"
            >
              <Icon d={P.arrowUp} className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </div>

          <Cinematic start="top 90%" delay={0.2}>
            <p
              data-blur
              className="mx-auto mt-7 max-w-[26rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
            >
              Fifteen minutes. We&apos;ll show you Sight answering them about a
              business like yours, in seconds, not Thursday.
            </p>
          </Cinematic>

          <div className="mt-8">
            <Pill href={BOOK_URL} variant="primary">
              Book a 15-minute demo
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
