"use client";

/**
 * A small picture card in the homepage's bottom-right corner pointing to
 * Sight: the painted mountain lookout from the Sight page fills the card, a
 * line of white copy sits over the top, and the studio's ArrowCta (flipped to
 * paper) sits in the bottom corner. A click anywhere on it goes to /sight.
 *
 * It rises in a moment after the intro has finished, shows over the hero
 * only, and stays closed for the rest of the visit once dismissed.
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

export default function SightPeek({ ready }: { ready: boolean }) {
  const [shown, setShown] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  /* It belongs to the hero: it steps aside as the hero scrolls away, and
     comes back when you return to the top. */
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {}
    const t = setTimeout(() => setShown(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [ready]);

  const dismiss = () => {
    setShown(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  const visible = shown && !pastHero;

  return (
    <aside className={s.peek} data-shown={visible || undefined} inert={!visible} aria-label="Sight by Cloverfield">
      <Image src="/sight/mountain-lookout.jpg" alt="" fill sizes="300px" className={s.img} />
      <span aria-hidden className={s.shade} />

      {/* Under the copy and the button, so the whole picture is a link too.
          The button is the one keyboard stop. */}
      <Link href="/sight" className={s.cover} tabIndex={-1} aria-hidden />

      <p className={s.copy}>
        <span className={s.eyebrow}>New from Cloverfield</span>
        Sight: ask your business anything.
      </p>

      <ArrowCta href="/sight" className={s.cta}>
        Meet Sight
      </ArrowCta>

      <button type="button" className={s.close} onClick={dismiss} aria-label="Close">
        <svg viewBox="0 0 12 12" aria-hidden>
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
