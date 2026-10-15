"use client";

/**
 * The free site review in the homepage hero, built 1:1 from the "Cloverfield
 * Hero + Lead Form" design (option A). Three steps in place:
 *
 *   1. site     a paper pill: globe, URL input, "Get my free site review".
 *   2. contact  the pill becomes a card: name, email and phone (required
 *               since Oct 2026, though the design marks it optional).
 *   3. done     "Got it. We're on <site> now." with a way to start over.
 *
 * Same lead flow as ReviewField: step 1 emails us the URL right away, step 2
 * emails the contact details and buzzes William's phone. `source` is "hero".
 *
 * On each step swap the new step lifts in, and the hero's other blocks (the
 * ones marked data-flip beside this one) glide to their re-centred places
 * instead of jumping.
 *
 * `preview` starts it partway through with sample values, for the dev board
 * (/hero-screens). A preview still clicks through, but sends nothing.
 */

import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { track } from "@/lib/track";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, bare, looksLikeAPhone } from "@/lib/reviewLead";
import s from "./HeroReview.module.css";

export type Step = "site" | "contact" | "done";
export type Problem = "site" | "name" | "email" | "phone" | "send";
export type HeroPreview = {
  step?: Step;
  website?: string;
  name?: string;
  email?: string;
  phone?: string;
  error?: Problem;
};

const SOURCE = "hero";

function Globe() {
  return (
    <svg className={s.globe} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Check({ size, stroke }: { size: number; stroke: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const PROBLEMS: Record<Problem, string> = {
  site: "Add your website first, like yourbusiness.ca.",
  name: "Add your name so we know who it's for.",
  email: "Add your email so we know where to send it.",
  phone: "Add your phone number, with the area code.",
  send: "That didn't go through. Try again, or email william@cloverfield.studio.",
};

export default function HeroReview({ className = "", preview }: { className?: string; preview?: HeroPreview }) {
  const [step, setStep] = useState<Step>(preview?.step ?? "site");
  const [website, setWebsite] = useState(preview?.website ?? "");
  const [contact, setContact] = useState({
    name: preview?.name ?? "",
    email: preview?.email ?? "",
    phone: preview?.phone ?? "",
  });
  const [error, setError] = useState<Problem | null>(preview?.error ?? null);
  const [sending, setSending] = useState(false);

  const id = useId();
  const noteId = `${id}-note`;

  const rootRef = useRef<HTMLDivElement>(null);
  const before = useRef<Map<Element, number> | null>(null);

  // Where the neighbouring blocks sit now, read just before the swap.
  const go = (next: Step) => {
    const parent = rootRef.current?.parentElement;
    if (parent) {
      before.current = new Map(
        Array.from(parent.querySelectorAll(":scope > [data-flip]"), (el) => [el, el.getBoundingClientRect().top]),
      );
    }
    setError(null);
    setStep(next);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const tops = before.current;
    before.current = null;
    if (!root || !tops) return;

    root.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      tops.forEach((top, el) => {
        const dy = top - el.getBoundingClientRect().top;
        if (Math.abs(dy) > 0.5) gsap.fromTo(el, { y: dy }, { y: 0, duration: 0.7, ease: "expo.out", clearProps: "transform" });
      });
      gsap.from(root.firstElementChild, { opacity: 0, y: 14, scale: 0.98, duration: 0.6, ease: "expo.out", clearProps: "all" });
      gsap.from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 8, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.08, clearProps: "all" });
    }, root);
    return () => ctx.revert();
  }, [step]);

  const clearError = () => error && setError(null);

  const submitSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const site = String(data.get("website") ?? "").trim().replace(/\s+/g, "");
    if (!LOOKS_LIKE_A_SITE.test(site)) {
      setError("site");
      return;
    }
    if (data.get("company")) return; // honeypot: a bot filled the hidden field

    if (!preview) {
      fetch("/api/review-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "site", website: site, source: SOURCE }),
        keepalive: true,
      }).catch(() => {});
      track("review_url_submit", { placement: SOURCE });
    }

    setWebsite(site);
    go("contact");
  };

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    setContact({ name, email, phone });
    const problem: Problem | null = !name
      ? "name"
      : !LOOKS_LIKE_AN_EMAIL.test(email)
        ? "email"
        : !looksLikeAPhone(phone)
          ? "phone"
          : null;
    if (problem) {
      setError(problem);
      return;
    }
    if (preview) {
      go("done");
      return;
    }

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/review-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "contact", website, name, email, phone, source: SOURCE, company: data.get("company") }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSending(false);
      setError("send");
      return;
    }

    track("review_contact_submit", { placement: SOURCE });
    setSending(false);
    go("done");
  };

  const startOver = () => {
    setWebsite("");
    setContact({ name: "", email: "", phone: "" });
    go("site");
  };

  const field = (
    key: "name" | "email" | "phone",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    focus = false,
  ) => (
    <div className={s.control} data-invalid={error === key || undefined}>
      <label htmlFor={`${id}-${key}`} className={s.label}>
        {label}
      </label>
      <input
        id={`${id}-${key}`}
        name={key}
        className={s.box}
        defaultValue={contact[key]}
        aria-invalid={error === key}
        aria-describedby={noteId}
        onChange={clearError}
        {...props}
        {...(focus && { "data-focus": true })}
      />
    </div>
  );

  return (
    <div ref={rootRef} className={`${s.root} ${className}`} data-step={step}>
      {step === "site" && (
        <form className={s.siteForm} onSubmit={submitSite} noValidate>
          <div className={s.pill} data-hero-pill="" data-invalid={error === "site" || undefined}>
            <div className={s.urlRow}>
              <Globe />
              <label htmlFor={`${id}-website`} className={s.srOnly}>
                Your website
              </label>
              <input
                id={`${id}-website`}
                name="website"
                className={s.urlInput}
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="yourbusiness.ca"
                defaultValue={website}
                aria-invalid={error === "site"}
                aria-describedby={noteId}
                onChange={clearError}
                {...(website && { "data-focus": true })}
              />
            </div>
            {/* Honeypot: hidden from people, filled in by bots. */}
            <input name="company" tabIndex={-1} autoComplete="off" className={s.honeypot} aria-hidden />
            <button type="submit" className={s.btn}>
              Get my free site review
              <Arrow />
            </button>
          </div>
          <p id={noteId} className={s.note} data-hero-note="" data-error={error === "site" || undefined} role="status">
            {error === "site" ? PROBLEMS.site : "We'll go through your site the way a customer would, from the Google search to the quote."}
          </p>
        </form>
      )}

      {step === "contact" && (
        <form className={s.card} data-hero-card="" onSubmit={submitContact} noValidate>
          <div className={s.cardHead} data-in>
            <div className={s.siteRow}>
              <span className={s.tick}>
                <Check size={14} stroke={2.4} />
              </span>
              <span className={s.siteName}>{bare(website)}</span>
              <button type="button" className={s.change} onClick={() => go("site")}>
                Change
              </button>
            </div>
            <span className={s.stepCount}>Step 2 of 2</span>
          </div>
          <h2 className={s.cardTitle} data-in>
            Where should we send your review?
          </h2>
          <div className={s.grid} data-in>
            {field("name", "Name", { type: "text", autoComplete: "name", placeholder: "Jordan Lee" }, true)}
            {field("email", "Email", {
              type: "email",
              inputMode: "email",
              autoComplete: "email",
              autoCapitalize: "off",
              spellCheck: false,
              placeholder: "you@yourbusiness.ca",
            })}
            {field("phone", "Phone", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "604 555 0123" })}
          </div>
          <input name="company" tabIndex={-1} autoComplete="off" className={s.honeypot} aria-hidden />
          <div className={s.cardFoot} data-in>
            {/* Empty until something needs fixing. */}
            <p id={noteId} className={s.cardNote} data-error={error || undefined} role="status">
              {error && PROBLEMS[error]}
            </p>
            <button type="submit" className={s.btn} disabled={sending}>
              {sending ? "Sending" : "Send my free review"}
              <Arrow />
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className={s.done} data-hero-card="" role="status">
          <span className={s.doneTick} data-in>
            <Check size={22} stroke={2.2} />
          </span>
          <div className={s.doneText} data-in>
            <p className={s.doneTitle}>Got it. We&apos;re on {bare(website)} now.</p>
          </div>
          <button type="button" className={s.again} onClick={startOver} data-in data-focus>
            Try another site
          </button>
        </div>
      )}
    </div>
  );
}
