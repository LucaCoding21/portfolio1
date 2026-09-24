"use client";

/**
 * A small picture card in the homepage's bottom-right corner pointing to
 * Sight: the painted mountain lookout from the Sight page fills the card, a
 * line of white copy sits over the top, and the studio's ArrowCta (flipped to
 * paper) sits in the bottom corner. A click anywhere on it goes to /sight.
 *
 * It lives inside the hero (HomeHero places it), so it scrolls away with
 * it. It rises in a moment after the intro has finished and stays closed for
 * the rest of the visit once dismissed.
 *
 * On phones it becomes a bar along the bottom of the screen instead: the
 * painting as an inset thumbnail on the left, a short line on the right.
 *
 * The demo (desktop hover only): the main line gives way to a small Sight
 * ask box. The question
 * types itself, a "thinking" shimmer runs, and the answer settles in. The
 * question is one an owner can't answer from memory and the answer connects
 * two systems (bookings and callbacks); the numbers are a sample.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowCta from "./ArrowCta";
import s from "./SightPeek.module.css";

const DISMISSED_KEY = "cf-sight-peek-dismissed";
/* A beat after the intro, so it follows the hero's entrance rather than
   landing with it. */
const DELAY_MS = 600;

const QUESTION = "Who\u2019s quietly stopped coming back?";
const ANSWER = "11 spring regulars haven\u2019t booked. Four had a callback last visit.";
const TYPE_MS = 34;
const THINK_MS = 900;

type Phase = "idle" | "typing" | "thinking" | "answer";

export default function SightPeek({ ready }: { ready: boolean }) {
  const [shown, setShown] = useState(false);
  const [demo, setDemo] = useState(false);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!ready) return;
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {}
    const t = setTimeout(() => setShown(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [ready]);

  /* Type the question, think, then answer. Reduced motion skips to the end. */
  useEffect(() => {
    if (!demo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => {
        setTyped(QUESTION.length);
        setPhase("answer");
      });
      return () => cancelAnimationFrame(id);
    }
    let i = 0;
    let think: ReturnType<typeof setTimeout> | undefined;
    let cleanup = () => {};
    const start = setTimeout(() => {
      setPhase("typing");
      const type = setInterval(() => {
        i += 1;
        setTyped(i);
        if (i >= QUESTION.length) {
          clearInterval(type);
          setPhase("thinking");
          think = setTimeout(() => setPhase("answer"), THINK_MS);
        }
      }, TYPE_MS);
      cleanup = () => clearInterval(type);
    }, 250);
    return () => {
      clearTimeout(start);
      clearTimeout(think);
      cleanup();
      setTyped(0);
      setPhase("idle");
    };
  }, [demo]);

  const hoverable = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const dismiss = () => {
    setShown(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  const visible = shown;

  return (
    <aside
      className={s.peek}
      data-shown={visible || undefined}
      data-demo={demo || undefined}
      inert={!visible}
      aria-label="Sight by Cloverfield"
      onMouseEnter={() => hoverable() && setDemo(true)}
      onMouseLeave={() => hoverable() && setDemo(false)}
    >
      {/* The whole card on desktop; an inset thumbnail on the phone bar. */}
      <span className={s.media}>
        <Image src="/sight/mountain-lookout.jpg" alt="" fill sizes="(max-width: 767px) 180px, 300px" className={s.img} />
        <span aria-hidden className={s.shade} />
      </span>

      {/* Under the copy and the button, so the whole card is a link too. On
          desktop the button is the keyboard stop; on the phone bar, where the
          button is hidden, this is the link. */}
      <Link href="/sight" className={s.cover} tabIndex={-1} aria-label="Check out Sight" />

      <p className={s.copy}>
        <span className={s.eyebrow}>We built a tool!</span>
        <span className={s.line}>
          Ask about anything in your business, instead of digging through five different apps.
        </span>
        <span className={s.lineShort}>
          Ask your business anything.
          <br />
          Get the answer in 5 seconds.
        </span>
      </p>

      {/* Phone bar only: the link arrow in the bottom corner. */}
      <svg viewBox="0 0 16 16" className={s.go} aria-hidden>
        <path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* A small Sight ask box, as on the Sight page. Decorative: the copy
          above already says what it does. */}
      <div className={s.ask} aria-hidden>
        <p className={s.q}>
          <svg viewBox="0 0 16 16" className={s.spark} fill="currentColor">
            <path d="M8 1.2 9.7 6l4.8 1.7-4.8 1.7L8 14.2 6.3 9.4 1.5 7.7 6.3 6 8 1.2Z" />
          </svg>
          <span>
            {QUESTION.slice(0, typed)}
            {phase === "typing" && <span className={s.caret} />}
          </span>
        </p>
        <p className={s.a} data-phase={phase}>
          {phase === "thinking" ? <span className={s.thinking}>Checking your bookings</span> : ANSWER}
        </p>
      </div>

      <ArrowCta href="/sight" className={s.cta}>
        Check it out
      </ArrowCta>

      <button type="button" className={s.close} onClick={dismiss} aria-label="Close">
        <svg viewBox="0 0 12 12" aria-hidden>
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
