"use client";

/**
 * The first screen once the quiz has gone (Oct 22 2026): the whole hero
 * becomes the thank-you, laid out like the hero it replaces. On the left,
 * "You're in, [first name].", what the sample will be built around, William
 * and Irish, and a quiet link to /work for the wait (no "Book a free call"
 * anywhere on this screen, the header's included: William calls them
 * himself). On the right, where the quiz was, a card with what happens next
 * as three steps down a thick green rail with an icon in it at each: in a
 * few minutes (in the morning outside his calling hours) William calls from
 * the number the card names, with "Not [their number]? Fix it", which
 * reopens the last quiz step filled in; within 3 days we walk them through
 * the sample on a call; after that, building it if they like it. The rail is
 * filled down to the gap under the first step, the call, which is the step
 * they're on. William makes every call and shows every sample on a call or
 * in a video, never only by email, so the card says so lightly: people who
 * expect the call, from a number they know, pick up.
 *
 * The page passes its own layout classes, so this sits exactly where the
 * promise and the quiz sat. Its pieces carry data-hero, so they rise in as
 * the hero did.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import { track } from "@/lib/track";
import type { QuizResult } from "./Quiz";
import s from "./Thanks.module.css";

const TEAM = [
  { name: "William", photo: "/free-homepage-design/team/william-face.webp" },
  { name: "Irish", photo: "/free-homepage-design/team/irish-photo.webp" },
];

const WILLIAM_PHONE_READ = WILLIAM_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

/** A step's icon in the rail: Lucide's shapes, drawn inline (the site has no icon set). */
function StepIcon({ children }: { children: ReactNode }) {
  return (
    <span className={s.stepIcon} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

/** William calls leads from 8am to 8pm, Pacific; outside that, the next morning. */
function inCallingHours() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Vancouver", hour: "numeric", hourCycle: "h23" }).format(new Date()),
  );
  return hour >= 8 && hour < 20;
}

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
  // Read once, when the lead is sent, so the card doesn't change under them.
  const [soon] = useState(inCallingHours);
  const caller = (
    <a href={`tel:${WILLIAM_PHONE}`} className={s.number}>
      {WILLIAM_PHONE_READ}
    </a>
  );

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
        {/* A new tab: back from /work would reload this page with the quiz
            empty, as if the request hadn't gone. */}
        <p className={s.call} data-hero="3">
          In the meantime,{" "}
          <a
            href="/work"
            target="_blank"
            rel="noopener"
            onClick={() => track("design_thanks_work")}
            className={s.link}
          >
            see the websites we&rsquo;ve built
          </a>
          .
        </p>
      </div>

      {/* Where the quiz was; the page's links to #quiz land here now. */}
      <div className={classes.card} data-hero="4">
        <div id="quiz" className={s.card} role="region" aria-label="What happens next">
          <span className={s.bar} aria-hidden />
          <h2 className={s.title}>What happens next</h2>
          {/* The full lines on laptops and up, short ones on phones. */}
          <ol className={s.steps}>
            {/* The one thing they need to do: pick up. */}
            <li className={`${s.step} ${s.now}`} aria-current="step">
              <StepIcon>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </StepIcon>
              <h3 className={s.stepHead}>{soon ? "In a few minutes" : "In the morning"}</h3>
              <p className={s.stepBody}>
                <span className={s.long}>William calls you from {caller} to get a few details right.</span>
                <span className={s.short}>William calls from {caller} to confirm a few details.</span>
              </p>
              <button type="button" className={s.fix} onClick={onFix}>
                Not {lead.fields.phone}? <span className={s.fixLink}>Fix it</span>
              </button>
            </li>
            <li className={s.step}>
              <StepIcon>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 9h20" />
                <path d="M6 6.5h.01" />
                <path d="M9 6.5h.01" />
              </StepIcon>
              <h3 className={s.stepHead}>Within 3 days</h3>
              <p className={s.stepBody}>
                <span className={s.long}>We walk you through your sample on a quick call.</span>
                <span className={s.short}>We walk you through your sample on a call.</span>
              </p>
            </li>
            <li className={s.step}>
              <StepIcon>
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </StepIcon>
              <h3 className={s.stepHead}>After that</h3>
              <p className={s.stepBody}>If you like it, we&rsquo;ll build it. If not, no hard feelings.</p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
