"use client";

/**
 * The free competitor check on the monthly SEO page (/seo), in the handoff's
 * card (Nov 9 2026). The flow was rebuilt on Nov 10 2026 as taps, then
 * contact, under a progress bar, with the thank-you in the same card:
 *
 *   0  "Free competitor check", "See what the top 3 businesses near you do
 *      on Google that you don't." and "Do you have a competitor in mind?"
 *      (three lines, no sub-line: four stacked lines said "competitor" three
 *      times and muddled which line mattered). "Yes" opens a small
 *      "Who is it? (optional)" box
 *      right under it with Continue (no new screen); "Not sure, find them
 *      for me" moves straight on. Neither answer is a wrong one, and nobody
 *      needs to know SEO to answer.
 *   1  "What do you want more of?": more of the jobs they already do, bigger
 *      jobs that pay more, or jobs in a new area (one tap)
 *   2  "Where should we send it?": business name, name, email and phone
 *   3  "You're in, [first name]." and what happens next
 *
 * Nothing is typed before contact: William finds what the business does and
 * where from its name and picks the
 * search himself. The copy is plain on purpose: William wants obvious,
 * third-grade English with nothing salesy, and the card should make owners
 * want to fill it in, not test them. Gone for good: the "How many customers
 * are you losing on Google?" headline, the example graphics (a leaderboard,
 * then a reviews comparison), typing the job and city, a separate "Who is
 * it?" screen and any promise of a video.
 *
 * Sending posts to /api/competitor-check, which emails William and buzzes
 * his phone. The contact step's error shows once its button was tried, and
 * goes as soon as the fields are right.
 */

import { useEffect, useRef, useState } from "react";
import ArrowCta from "@/components/ArrowCta";
import { CHECK_COMPETITOR, CHECK_DAYS, CHECK_WANTS, type CheckCompetitor } from "@/data/competitorCheck";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import { LOOKS_LIKE_AN_EMAIL, looksLikeAPhone } from "@/lib/reviewLead";
import { identify, track } from "@/lib/track";
import s from "./CompetitorCheck.module.css";

const WILLIAM_PHONE_READ = WILLIAM_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

type Step = 0 | 1 | 2 | 3;
type Fields = { rival: string; business: string; name: string; email: string; phone: string };
const EMPTY: Fields = { rival: "", business: "", name: "", email: "", phone: "" };

export default function CompetitorCheck() {
  const [step, setStep] = useState<Step>(0);
  const [competitor, setCompetitor] = useState<CheckCompetitor | "">("");
  const [want, setWant] = useState("");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const started = useRef(false);

  // After a step changes, keyboard and screen reader users land on its heading.
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next: Step) => {
    moved.current = true;
    setTried(false);
    setSendFailed(false);
    setStep(next);
  };

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const has = (key: keyof Fields) => fields[key].trim().length > 0;
  const contactOk =
    has("business") && has("name") && LOOKS_LIKE_AN_EMAIL.test(fields.email.trim()) && looksLikeAPhone(fields.phone);
  // A name typed after Yes counts only while Yes stands (switching to Not sure drops it).
  const rival = competitor === "yes" ? fields.rival.trim() : "";
  const yesOpen = competitor === "yes";

  const chooseCompetitor = (value: CheckCompetitor) => {
    if (!started.current) {
      started.current = true;
      track("check_start", { competitor: value });
    }
    if (value === "yes") {
      // A second tap on Yes folds the box away again.
      setCompetitor((c) => (c === "yes" ? "" : "yes"));
      return;
    }
    setCompetitor("not_sure");
    go(1);
  };

  const fromRival = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    track("check_rival", { named: !!rival });
    go(1);
  };

  const chooseWant = (value: string) => {
    setWant(value);
    track("check_want", { want: value, competitor });
    go(2);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (!contactOk) return setTried(true);
    const form = e.currentTarget;
    setSending(true);
    setSendFailed(false);
    try {
      const res = await fetch("/api/competitor-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitor, want, ...fields, rival, company: new FormData(form).get("company") }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSending(false);
      setSendFailed(true);
      return;
    }
    track("check_lead", { competitor, want, named_rival: !!rival });
    identify(fields.email, {
      name: fields.name.trim(),
      business: fields.business.trim(),
      rival,
      competitor,
      want,
      lead_from: "seo_check",
    });
    setSending(false);
    go(3);
  };

  const firstName = fields.name.trim().split(/\s+/)[0] || "there";

  const head = (
    <div className={s.head}>
      <span className={s.eyebrow}>Free competitor check</span>
      <button type="button" className={s.back} onClick={() => go((step - 1) as Step)}>
        Back
      </button>
    </div>
  );

  return (
    <div className={s.card}>
      <div className={s.bar} aria-hidden>
        <div className={s.barFill} style={{ width: `${(step + 1) * 25}%` }} />
      </div>

      {step === 0 && (
        <div className={s.stepFirst}>
          <div className={s.intro}>
            <span className={s.eyebrow}>Free competitor check</span>
            <h2 ref={headingRef} tabIndex={-1} className={s.h2}>
              See what the top 3 businesses near you do on Google that you don&rsquo;t.
            </h2>
          </div>
          <div className={s.question}>
            <p className={s.ask}>Do you have a competitor in mind?</p>
            <div className={s.options}>
              <div className={`${s.optWrap} ${yesOpen ? s.optOpen : ""}`}>
                <button
                  type="button"
                  className={s.opt}
                  aria-expanded={yesOpen}
                  onClick={() => chooseCompetitor("yes")}
                >
                  {CHECK_COMPETITOR[0].label}
                </button>
                {yesOpen && (
                  <form className={s.optPanel} onSubmit={fromRival} noValidate>
                    <label className={s.label}>
                      <span>
                        Who is it? <span className={s.optional}>(optional)</span>
                      </span>
                      <input
                        className={s.field}
                        type="text"
                        value={fields.rival}
                        onChange={set("rival")}
                        placeholder="Their business name"
                        autoFocus
                      />
                    </label>
                    <ArrowCta full>Continue</ArrowCta>
                  </form>
                )}
              </div>
              <button type="button" className={s.opt} onClick={() => chooseCompetitor("not_sure")}>
                {CHECK_COMPETITOR[1].label}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={s.step}>
          {head}
          <h2 ref={headingRef} tabIndex={-1} className={s.h2}>
            What do you want more of?
          </h2>
          <div className={s.options}>
            {CHECK_WANTS.map((w) => (
              <button key={w} type="button" className={s.opt} onClick={() => chooseWant(w)}>
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form className={s.step} onSubmit={submit} noValidate>
          {head}
          <h2 ref={headingRef} tabIndex={-1} className={s.h2}>
            Where should we send it?
          </h2>
          <div className={s.fields}>
            <label className={s.label}>
              Business name
              <input
                className={s.field}
                type="text"
                value={fields.business}
                onChange={set("business")}
                autoComplete="organization"
              />
            </label>
            <label className={s.label}>
              Your name
              <input className={s.field} type="text" value={fields.name} onChange={set("name")} autoComplete="name" />
            </label>
            <label className={s.label}>
              Email
              <input
                className={s.field}
                type="email"
                value={fields.email}
                onChange={set("email")}
                autoComplete="email"
              />
            </label>
            <label className={s.label}>
              Phone
              <input className={s.field} type="tel" value={fields.phone} onChange={set("phone")} autoComplete="tel" />
            </label>
          </div>
          {tried && !contactOk && (
            <p role="alert" className={s.error}>
              Please fill in all four.
            </p>
          )}
          {/* Honeypot: hidden from people, so anything in it is a bot. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className={s.honeypot} />
          <ArrowCta full>{sending ? "Sending…" : "Check my competitors"}</ArrowCta>
          {sendFailed && (
            <p role="alert" className={s.error}>
              That didn&rsquo;t send. Try again, or text William at{" "}
              <a href={`sms:${WILLIAM_PHONE}`}>{WILLIAM_PHONE_READ}</a>.
            </p>
          )}
          <p className={s.fine}>We use this to send your check and go over it with you.</p>
        </form>
      )}

      {step === 3 && (
        <div className={s.done}>
          <h2 ref={headingRef} tabIndex={-1} className={s.doneTitle}>
            You&rsquo;re in, {firstName}.
          </h2>
          <ol className={s.next}>
            <li>
              <h3>We look you up</h3>
              <p>
                We find the top 3 businesses for your main job in your area on Google and compare you to them.
                {rival ? ` We look at ${rival} too.` : ""}
              </p>
            </li>
            <li>
              <h3>We send you what we found</h3>
              <p>
                You see what they have that you don&rsquo;t, and if you can catch them. You get it within {CHECK_DAYS}.
              </p>
            </li>
            <li>
              <h3>You decide</h3>
              <p>If you want our help, we&rsquo;ll talk. If not, that&rsquo;s okay.</p>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
