"use client";

/**
 * The free home page design quiz, the card in the page's hero (id="quiz",
 * which the page's CTAs scroll to). Built from the Page A handoff (Oct
 * 2026): a 6px bar along the card's top edge fills a fifth per step, with
 * "Step n of 5" under it and Back on the right from step 2.
 *
 *   site     Do you have a website? (Yes, I do / Not yet)
 *   type     What kind of business do you run? (BUSINESS_TYPES)
 *   goal     What should your new site bring you more of? (GOALS for that
 *            type, added Oct 22 2026; the done screen says it back)
 *   revenue  Roughly what does your business bring in a year?
 *            (REVENUE_RANGES, added Oct 25 2026; $100K and up counts as a
 *            qualified lead: `qualified` on design_lead, and SubmitApplication
 *            on the Meta Pixel, which the ads optimize for)
 *   contact  website (when they have one), name, email and phone required
 *            (phone since Oct 22 2026); a note optional, folded behind
 *            "+ Add a note" until tapped
 *   done     You're all set, and Start over
 *
 * Picking an option moves straight on. Nothing is sent before the contact
 * step: /api/design-lead then emails William and buzzes his phone.
 */

import { useEffect, useId, useRef, useState } from "react";
import ArrowCta from "@/components/ArrowCta";
import {
  BUSINESS_TYPES,
  GOALS,
  REVENUE_RANGES,
  leadEventData,
  type BusinessType,
  type Goal,
  type Revenue,
} from "@/data/freeDesign";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, looksLikeAPhone } from "@/lib/reviewLead";
import { identify, pixel, pixelCustom, track } from "@/lib/track";
import s from "./Quiz.module.css";

type Step = "site" | "type" | "goal" | "revenue" | "contact" | "done";
type Problem = "website" | "name" | "email" | "phone" | "send";
type Fields = { website: string; name: string; email: string; phone: string; notes: string };

/** What a visitor sent: handed to the page for its thank-you screen, and
    handed back to reopen the last step with it all filled in ("Fix it"). */
export type QuizResult = {
  hasSite: boolean | null;
  type: BusinessType | null;
  goal: Goal | null;
  revenue: Revenue | null;
  fields: Fields;
};

const STEPS = 5;
const STEP_NUMBER: Record<Step, number> = { site: 1, type: 2, goal: 3, revenue: 4, contact: 5, done: 5 };
const EMPTY: Fields = { website: "", name: "", email: "", phone: "", notes: "" };
const STARTED_KEY = "cf_quiz_started";

/** "+17789970335" reads as "778-997-0335". */
const WILLIAM_PHONE_READ = WILLIAM_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

function Field({
  label,
  optional,
  error,
  multiline,
  className = "",
  ...input
}: {
  label: string;
  optional?: boolean;
  error?: string;
  multiline?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const props = {
    id,
    className: s.input,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    ...input,
  };
  return (
    <div className={`${s.field} ${className}`}>
      <label htmlFor={id} className={s.label}>
        {label}
        {optional && <span className={s.optional}> (optional)</span>}
      </label>
      {multiline ? <textarea rows={3} {...props} /> : <input {...props} />}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** `onDone` gets what was sent, once it has gone (the page then shows its
    thank-you screen); without it the card shows its own "You're all set".
    `resume` reopens the last step filled in, to correct a detail; sending
    again marks the lead as a correction. */
export default function Quiz({ onDone, resume }: { onDone?: (result: QuizResult) => void; resume?: QuizResult }) {
  const [step, setStep] = useState<Step>(resume ? "contact" : "site");
  const [hasSite, setHasSite] = useState<boolean | null>(resume?.hasSite ?? null);
  const [type, setType] = useState<BusinessType | null>(resume?.type ?? null);
  const [goal, setGoal] = useState<Goal | null>(resume?.goal ?? null);
  const [revenue, setRevenue] = useState<Revenue | null>(resume?.revenue ?? null);
  const [fields, setFields] = useState<Fields>(resume?.fields ?? EMPTY);
  const [error, setError] = useState<Problem | null>(null);
  const [sending, setSending] = useState(false);
  // The optional note stays folded behind a link until it's wanted.
  const [noteOpen, setNoteOpen] = useState(!!resume?.fields.notes);
  // design_contact_start goes once, on the first field they touch.
  const contactStarted = useRef(!!resume);

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Each new step focuses its question so screen readers follow, and brings
  // the card's top back on screen if the visitor had scrolled past it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) cardRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (error === key) setError(null);
  };

  const answerSite = (yes: boolean) => {
    setHasSite(yes);
    setError(null);
    track("design_quiz_start", { has_site: yes });
    // Meta hears about the first start in a visit only, not each Start over.
    let started = false;
    try {
      started = sessionStorage.getItem(STARTED_KEY) === "1";
      sessionStorage.setItem(STARTED_KEY, "1");
    } catch {}
    if (!started) pixelCustom("LeadFormStart", { has_website: yes ? "yes" : "no" });
    setStep("type");
  };

  const answerType = (t: BusinessType) => {
    // Another type has other goals, so an earlier pick no longer applies.
    if (t !== type) setGoal(null);
    setType(t);
    setError(null);
    track("design_quiz_type", { business_type: t });
    setStep("goal");
  };

  const answerGoal = (g: Goal) => {
    setGoal(g);
    setError(null);
    track("design_quiz_goal", { business_type: type ?? "", goal: g.label });
    setStep("revenue");
  };

  const answerRevenue = (r: Revenue) => {
    setRevenue(r);
    setError(null);
    track("design_quiz_revenue", { business_type: type ?? "", revenue: r.label, qualified: r.qualified });
    setStep("contact");
  };

  const back = () => {
    setError(null);
    setStep(step === "contact" ? "revenue" : step === "revenue" ? "goal" : step === "goal" ? "type" : "site");
  };

  const restart = () => {
    setHasSite(null);
    setType(null);
    setGoal(null);
    setRevenue(null);
    setFields(EMPTY);
    setNoteOpen(false);
    setError(null);
    setStep("site");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const website = fields.website.trim().replace(/\s+/g, "");
    const phone = fields.phone.trim();
    const problem: Problem | null =
      hasSite && !LOOKS_LIKE_A_SITE.test(website)
        ? "website"
        : !fields.name.trim()
          ? "name"
          : !LOOKS_LIKE_AN_EMAIL.test(fields.email.trim())
            ? "email"
            : !looksLikeAPhone(phone)
              ? "phone"
              : null;
    if (problem) {
      setError(problem);
      (form.elements.namedItem(problem) as HTMLElement | null)?.focus();
      return;
    }

    setSending(true);
    setError(null);
    // Shared by the pixel below and the server's copy of the same events.
    const eventId = crypto.randomUUID();
    try {
      const res = await fetch("/api/design-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasSite,
          type,
          goal: goal?.label,
          revenue: revenue?.label,
          website,
          name: fields.name,
          email: fields.email,
          phone,
          notes: fields.notes,
          company: new FormData(form).get("company"),
          fix: !!resume,
          eventId,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSending(false);
      setError("send");
      return;
    }

    track(resume ? "design_lead_fix" : "design_lead", {
      has_site: !!hasSite,
      business_type: type ?? "",
      goal: goal?.label ?? "",
      revenue: revenue?.label ?? "",
      qualified: !!revenue?.qualified,
    });
    // A correction isn't a new lead, so Meta only hears about the first send.
    if (!resume) {
      const qualified = !!revenue?.qualified;
      pixel("Lead", leadEventData(qualified), eventId);
      if (qualified) pixel("SubmitApplication", leadEventData(true), eventId);
    }
    identify(fields.email, {
      name: fields.name.trim(),
      website,
      business_type: type ?? "",
      goal: goal?.label ?? "",
      revenue: revenue?.label ?? "",
      lead_from: "free_design",
    });
    setSending(false);
    if (onDone) onDone({ hasSite, type, goal, revenue, fields: { ...fields, website, phone } });
    else setStep("done");
  };

  const number = STEP_NUMBER[step];

  return (
    <div ref={cardRef} id="quiz" className={s.card} aria-label="Free homepage sample questions" role="region">
      <div
        className={s.bar}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={STEPS}
        aria-valuenow={number}
      >
        <span style={{ width: `${(number / STEPS) * 100}%` }} />
      </div>

      <div className={s.head}>
        <span className={s.stepLabel}>{step === "done" ? "Done" : `Step ${number} of ${STEPS}`}</span>
        {step !== "site" && step !== "done" && (
          <button type="button" className={s.back} onClick={back}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Keyed by step, so each question rises in fresh. */}
      <div key={step} className={s.enter}>
        {step === "site" && (
          <div className={s.stack}>
            <h2 ref={headingRef} tabIndex={-1} className={`${s.question} ${s.centred}`}>
              Do you have a website?
            </h2>
            <div className={`${s.choices} ${s.big}`}>
              <button type="button" className={s.choice} aria-pressed={hasSite === true} onClick={() => answerSite(true)}>
                Yes, I do
              </button>
              <button type="button" className={s.choice} aria-pressed={hasSite === false} onClick={() => answerSite(false)}>
                Not yet
              </button>
            </div>
          </div>
        )}

        {step === "type" && (
          <div className={s.stack}>
            <h2 ref={headingRef} tabIndex={-1} className={s.question}>
              What kind of business do you run?
            </h2>
            <div className={s.choices}>
              {BUSINESS_TYPES.map((t) => (
                <button key={t} type="button" className={s.choice} aria-pressed={type === t} onClick={() => answerType(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "goal" && type && (
          <div className={s.stack}>
            <h2 ref={headingRef} tabIndex={-1} className={s.question}>
              What should your new site bring you more of?
            </h2>
            <div className={`${s.choices} ${s.single}`}>
              {GOALS[type].map((g) => (
                <button
                  key={g.label}
                  type="button"
                  className={s.choice}
                  aria-pressed={goal?.label === g.label}
                  onClick={() => answerGoal(g)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "revenue" && (
          <div className={s.stack}>
            <h2 ref={headingRef} tabIndex={-1} className={s.question}>
              Roughly what does your business bring in a year?
            </h2>
            <div className={`${s.choices} ${s.revenue}`}>
              {REVENUE_RANGES.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  className={s.choice}
                  aria-pressed={revenue?.label === r.label}
                  onClick={() => answerRevenue(r)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "contact" && (
          <form
            className={s.form}
            onSubmit={submit}
            noValidate
            onFocus={(e) => {
              if (contactStarted.current) return;
              // Only a field counts: the step moves focus to its heading as it
              // opens, and that focus bubbles up here too.
              if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;
              contactStarted.current = true;
              track("design_contact_start", { business_type: type ?? "", goal: goal?.label ?? "" });
            }}
          >
            <h2 ref={headingRef} tabIndex={-1} className={`${s.question} ${s.formQuestion}`}>
              Where should we send your sample?
            </h2>
            {hasSite && (
              <Field
                label="Your website"
                name="website"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="yourbusiness.ca"
                value={fields.website}
                onChange={set("website")}
                error={error === "website" ? "Add your website, like yourbusiness.ca." : undefined}
              />
            )}
            <Field
              label="Your name"
              name="name"
              autoComplete="name"
              value={fields.name}
              onChange={set("name")}
              error={error === "name" ? "Add your name." : undefined}
            />
            <div className={s.pair}>
              <Field
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={fields.email}
                onChange={set("email")}
                error={error === "email" ? "Add an email we can reach you at." : undefined}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={fields.phone}
                onChange={set("phone")}
                error={error === "phone" ? "Add a phone number, with the area code." : undefined}
              />
            </div>
            {noteOpen ? (
              <Field
                label="Anything we should know?"
                optional
                multiline
                autoFocus
                name="notes"
                placeholder="Colours you like, a site you love, what customers should do first"
                value={fields.notes}
                onChange={set("notes")}
              />
            ) : (
              <button
                type="button"
                className={s.addNote}
                onClick={() => {
                  setNoteOpen(true);
                  track("design_note_open");
                }}
              >
                + Add a note <span className={s.optional}>(optional)</span>
              </button>
            )}
            {/* Honeypot: hidden from people, so anything in it is a bot. */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className={s.honeypot} />
            <ArrowCta full className={s.submit}>
              {sending ? "Sending…" : "Free homepage sample"}
            </ArrowCta>
            {error === "send" && (
              <p className={s.error} role="alert">
                That didn&rsquo;t send. Try again, or text William at{" "}
                <a href={`sms:${WILLIAM_PHONE}`}>{WILLIAM_PHONE_READ}</a>.
              </p>
            )}
          </form>
        )}

        {step === "done" && (
          <div className={s.done}>
            <span className={s.tick} aria-hidden>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 ref={headingRef} tabIndex={-1} className={s.question}>
              You&rsquo;re all set.
            </h2>
            <p className={s.doneText}>
              {goal
                ? `Thanks! We’ll design your home page around ${goal.focus}, and be in touch by email with next steps.`
                : "Thanks! We have what we need to start on your home page. We’ll be in touch by email with next steps."}
            </p>
            <button type="button" className={s.restart} onClick={restart}>
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
