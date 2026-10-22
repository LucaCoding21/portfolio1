"use client";

/**
 * The first screen once the quiz has gone (Oct 22 2026): the whole hero
 * becomes the thank-you, laid out like the hero it replaces. On the left,
 * "You're in, [first name].", what the sample will be built around, William
 * and Irish, and a quiet "Can't wait? Book a free call". On the right, where
 * the quiz was, a card with what happens next: today (we start, and call
 * them at the number they gave to get details right, with "Wrong number?
 * Fix it", which reopens the last quiz step filled in), within 3 days (we
 * walk them through the sample on a call), then building it if they like it.
 * William shows every sample on a call or in a video, never only by email,
 * so the card says so lightly: people who expect the call pick up.
 *
 * The page passes its own layout classes, so this sits exactly where the
 * promise and the quiz sat. Its pieces carry data-hero, so they rise in as
 * the hero did.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CAL_URL } from "@/data/projects";
import type { QuizResult } from "./Quiz";
import s from "./Thanks.module.css";

const TEAM = [
  { name: "William", photo: "/free-homepage-design/team/william-face.webp" },
  { name: "Irish", photo: "/free-homepage-design/team/irish-photo.webp" },
];

export default function Thanks({
  lead,
  onFix,
  classes,
}: {
  lead: QuizResult;
  onFix: () => void;
  /** The hero's own classes for its two columns and its type. */
  classes: { copy: string; card: string; h1: string; lede: string };
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = lead.fields.name.trim().split(/\s+/)[0];

  // Screen readers land on the news.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <div className={classes.copy}>
        <h1 ref={headingRef} tabIndex={-1} className={`${classes.h1} ${s.heading}`} data-hero="1">
          You&rsquo;re in{first ? `, ${first}` : ""}.
        </h1>
        <p className={classes.lede} data-hero="2">
          {lead.goal
            ? `We’ll design your home page around ${lead.goal.focus}.`
            : "We’ll start on your home page today."}
        </p>
        <div className={s.team} data-hero="3">
          <span className={s.faces} aria-hidden>
            {TEAM.map((p) => (
              <Image key={p.name} src={p.photo} alt="" width={96} height={96} className={s.face} />
            ))}
          </span>
          <p className={s.teamText}>
            <strong>William and Irish</strong> will be the ones designing it.
          </p>
        </div>
        <p className={s.call} data-hero="3">
          Can&rsquo;t wait?{" "}
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer" data-track="thanks" className={s.link}>
            Book a free call
          </a>
        </p>
      </div>

      {/* Where the quiz was; the page's links to #quiz land here now. */}
      <div className={classes.card} data-hero="4">
        <div id="quiz" className={s.card} role="region" aria-label="What happens next">
          <span className={s.bar} aria-hidden />
          <h2 className={s.title}>What happens next</h2>
          <ol className={s.steps}>
            <li className={s.step}>
              <span className={s.when}>Today</span>
              <p className={s.what}>
                We start studying your competitors. One of us will give you a quick call at{" "}
                <strong className={s.email}>{lead.fields.phone}</strong> to get a few details right.
              </p>
              <button type="button" className={s.fix} onClick={onFix}>
                Wrong number? Fix it
              </button>
            </li>
            <li className={s.step}>
              <span className={s.when}>Within 3 days</span>
              <p className={s.what}>We walk you through your sample on a quick call.</p>
            </li>
            <li className={s.step}>
              <span className={s.when}>Then</span>
              <p className={s.what}>If you like it, we&rsquo;ll talk about building it. If not, no hard feelings.</p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
