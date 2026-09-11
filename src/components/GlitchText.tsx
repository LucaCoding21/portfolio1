"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Seconds before the first word starts. */
const START = 0.18;
/** Seconds between one word starting and the next. */
const STAGGER = 0.062;
/** The whole thing plays this much faster than the figures below say. */
const SPEED = 1.12;

/** How long the dot shows before a word starts decoding. */
const DOT = 0.15;
/** Decode steps, relative to the moment the dot goes. */
const S2 = 0.082;
const S3 = 0.148;
const S4 = 0.218;
const DONE = 0.286;

interface Step {
  scale: number;
  /** Percent of the word uncovered, from its origin edge. */
  clip: number;
  shift: number;
  opacity?: number;
  jitter?: number;
  contrast?: number;
}

/**
 * One decode step. Everything lives in custom properties the CSS reads, so a
 * step is a handful of property writes and no layout: only transform,
 * clip-path, opacity and filter ever change, and the word keeps its real
 * width throughout.
 */
function setStep(
  w: HTMLElement,
  { scale, clip, shift, opacity = 1, jitter = 0, contrast = 0 }: Step
) {
  const s = w.style;
  const right = w.dataset.origin === "right";
  w.classList.toggle("is-pixelating", jitter > 0 || contrast > 0);
  s.setProperty("--copy-opacity", String(opacity));
  s.setProperty("--step-scale", String(scale));
  s.setProperty("--shift", `${shift}px`);
  s.setProperty("--pixel-jitter", `${jitter}px`);
  s.setProperty("--pixel-contrast", `${contrast}px`);
  const hidden = `${(100 - clip).toFixed(2)}%`;
  s.setProperty("--clip-left", right ? hidden : "0%");
  s.setProperty("--clip-right", right ? "0%" : hidden);
}

/** Back to the resting state, with the inline overrides gone. */
function finish(w: HTMLElement) {
  w.removeAttribute("style");
  w.classList.remove("is-pixelating");
  w.classList.add("is-done");
}

interface GlitchTextProps {
  text: string;
  /** Word index after which to force a line break. */
  breakAfter?: number;
  /** Extra seconds before the first word, e.g. to wait for a loader. */
  delay?: number;
  /** Reveal right-to-left instead: dot on the right, clip from the left. */
  origin?: "left" | "right";
  /**
   * Holds the animation back until true — pass the page's `ready` flag so
   * the scroll position isn't measured while the loader has the body fixed.
   */
  active?: boolean;
  /**
   * Leave undefined and the reveal plays itself the first time the text
   * scrolls into view. Pass a boolean to drive it instead: it waits, and
   * plays once this turns true.
   */
  play?: boolean;
  /** Fires once the last word has landed. */
  onComplete?: () => void;
  className?: string;
}

/**
 * "Glitch-in" word reveal. Reads as a typewriter, but each word is a
 * stop-motion pixel decode: a dot appears at the word's origin, then the word
 * grows out of it in four discrete jumps — squashed, smeared and offset —
 * before landing crisp. No tweens between steps; the choppiness is the point.
 *
 * Plays once, the first time the text scrolls into view. Words are split at
 * render so the server and client markup match; the CSS hides the copies
 * until the steps run, and shows them outright under reduced motion.
 */
export default function GlitchText({
  text,
  breakAfter,
  delay = 0,
  origin = "left",
  active = true,
  play,
  onComplete,
  className = "",
}: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const words = text.trim().split(/\s+/);
  const manual = play !== undefined;

  // Read through refs inside the build effect so a new callback or a flipped
  // `play` doesn't rebuild (and restart) the timeline. Synced in effects of
  // their own, declared first so they run before the build on any commit.
  const playRef = useRef(play);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    playRef.current = play;
    onCompleteRef.current = onComplete;
  }, [play, onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>(".glitch-word"));
    if (!spans.length) return;

    const ctx = gsap.context(() => {
      // A timeline of callbacks: GSAP owns the clock (so it pauses with the
      // tab, scales with `timeScale`, and reverts cleanly), the callbacks
      // own the steps.
      const tl = manual
        ? gsap.timeline({ paused: !playRef.current })
        : gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
      tl.timeScale(SPEED);
      tl.eventCallback("onComplete", () => onCompleteRef.current?.());
      tlRef.current = tl;

      spans.forEach((w, i) => {
        const dir = w.dataset.origin === "right" ? 1 : -1;
        const t = delay + START + i * STAGGER;
        const a = t + DOT;

        tl.call(
          () => {
            w.style.setProperty("--dot-opacity", "1");
            w.style.setProperty("--dot-scale", "1.18");
            setStep(w, { scale: 0.14, clip: 0, shift: 0, opacity: 0 });
          },
          [],
          t
        );
        tl.call(
          () => {
            w.style.setProperty("--dot-opacity", "0");
            w.style.setProperty("--dot-scale", "0.78");
            setStep(w, {
              scale: 0.22,
              clip: 18,
              shift: dir * 14,
              jitter: 2,
              contrast: 1,
            });
          },
          [],
          a
        );
        tl.call(
          () =>
            setStep(w, {
              scale: 0.46,
              clip: 42,
              shift: dir * -8,
              jitter: 3,
              contrast: 2,
            }),
          [],
          a + S2
        );
        tl.call(
          () =>
            setStep(w, {
              scale: 0.78,
              clip: 76,
              shift: dir * 5,
              jitter: 1,
              contrast: 1,
            }),
          [],
          a + S3
        );
        tl.call(() => setStep(w, { scale: 1, clip: 100, shift: 0 }), [], a + S4);
        tl.call(() => finish(w), [], a + DONE);
      });
    }, el);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [text, active, delay, origin, manual]);

  useEffect(() => {
    if (play) tlRef.current?.play();
  }, [play]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="glitch-word" data-origin={origin} aria-hidden>
            <span className="glitch-word__copy">{word}</span>
          </span>
          {i < words.length - 1 && (i === breakAfter ? <br /> : " ")}
        </Fragment>
      ))}
    </span>
  );
}
