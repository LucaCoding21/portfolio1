"use client";

/**
 * The free home page design quiz, the card in the page's hero (id="quiz",
 * which the page's CTAs scroll to). Built from the Page A handoff (Oct
 * 2026): a 6px bar along the card's top edge fills a third per step, with
 * "Step n of 3" under it and Back on the right from step 2.
 *
 *   site     Do you have a website? (Yes, I do / Not yet)
 *   type     What kind of business do you run? (BUSINESS_TYPES)
 *   contact  website (when they have one), name and email required; phone
 *            and a note optional
 *   done     You're all set, and Start over
 *
 * Picking an option moves straight on. Nothing is sent before the contact
 * step: /api/design-lead then emails William and buzzes his phone.
 */

import { useEffect, useId, useRef, useState } from "react";
import ArrowCta from "@/components/ArrowCta";
import { BUSINESS_TYPES, type BusinessType } from "@/data/freeDesign";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, looksLikeAPhone } from "@/lib/reviewLead";
import { track } from "@/lib/track";
import s from "./Quiz.module.css";

type Step = "site" | "type" | "contact" | "done";
type Problem = "website" | "name" | "email" | "phone" | "send";
type Fields = { website: string; name: string; email: string; phone: string; notes: string };

const STEP_NUMBER: Record<Step, number> = { site: 1, type: 2, contact: 3, done: 3 };
const EMPTY: Fields = { website: "", name: "", email: "", phone: "", notes: "" };

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

export default function Quiz() {
  const [step, setStep] = useState<Step>("site");
  const [hasSite, setHasSite] = useState<boolean | null>(null);
  const [type, setType] = useState<BusinessType | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [error, setError] = useState<Problem | null>(null);
  const [sending, setSending] = useState(false);

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
    setStep("type");
  };

  const answerType = (t: BusinessType) => {
    setType(t);
    setError(null);
    track("design_quiz_type", { business_type: t });
    setStep("contact");
  };

  const back = () => {
    setError(null);
    setStep(step === "contact" ? "type" : "site");
  };

  const restart = () => {
    setHasSite(null);
    setType(null);
    setFields(EMPTY);
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
            : phone && !looksLikeAPhone(phone)
              ? "phone"
              : null;
    if (problem) {
      setError(problem);
      (form.elements.namedItem(problem) as HTMLElement | null)?.focus();
      return;
    }

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/design-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasSite,
          type,
          website,
          name: fields.name,
          email: fields.email,
          phone,
          notes: fields.notes,
          company: new FormData(form).get("company"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSending(false);
      setError("send");
      return;
    }

    track("design_lead", { has_site: !!hasSite, business_type: type ?? "" });
    setSending(false);
    setStep("done");
  };

  const number = STEP_NUMBER[step];

  return (
    <div ref={cardRef} id="quiz" className={s.card} aria-label="Free home page design questions" role="region">
      <div
        className={s.bar}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={number}
      >
        <span style={{ width: step === "site" ? "33.4%" : step === "type" ? "66.7%" : "100%" }} />
      </div>

      <div className={s.head}>
        <span className={s.stepLabel}>{step === "done" ? "Done" : `Step ${number} of 3`}</span>
        {(step === "type" || step === "contact") && (
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

        {step === "contact" && (
          <form className={s.form} onSubmit={submit} noValidate>
            <h2 ref={headingRef} tabIndex={-1} className={`${s.question} ${s.formQuestion}`}>
              Where should we send your design?
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
                optional
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={fields.phone}
                onChange={set("phone")}
                error={error === "phone" ? "Add the area code, or leave it blank." : undefined}
              />
            </div>
            <Field
              label="Anything we should know?"
              optional
              multiline
              name="notes"
              placeholder="Colours you like, a site you love, what customers should do first"
              value={fields.notes}
              onChange={set("notes")}
            />
            {/* Honeypot: hidden from people, so anything in it is a bot. */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className={s.honeypot} />
            <ArrowCta full className={s.submit}>
              {sending ? "Sending…" : "Get my free design"}
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
              Thanks! We have what we need to start on your home page. We&rsquo;ll be in touch by email with next
              steps.
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
