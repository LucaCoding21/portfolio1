"use client";

/**
 * The free home page design page (/free-homepage-design, Oct 2026), laid out
 * like a "Get your free sample kit" landing, centred, under the site nav.
 * One screen: the headline, one line, three perks with icons and "Trusted
 * by 15 businesses" with client faces at the top, one site reel playing in
 * the middle, and the quiz's first question under it. Answering hands the
 * screen to the quiz:
 *
 *   site     Do you have a website? (Yes / Not yet)
 *   type     I'm a… (BUSINESS_TYPES; "Something else" asks what they do)
 *   contact  website (when they have one), name, phone and email, all
 *            required; business name (when they have no site) and a note,
 *            optional
 *   done     thanks, and where we'll reach them
 *
 * Nothing is sent before the contact step: /api/design-lead then emails
 * William and buzzes his phone.
 *
 * PLACEHOLDER: the copy is a first pass and the reel is a sample.
 */

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowCta from "@/components/ArrowCta";
import { projects } from "@/data/projects";
import { BUSINESS_TYPES, OTHER_TYPE, type BusinessType } from "@/data/freeDesign";
import { WILLIAM_PHONE } from "@/lib/giftShared";
import { LOOKS_LIKE_AN_EMAIL, LOOKS_LIKE_A_SITE, looksLikeAPhone } from "@/lib/reviewLead";
import { track } from "@/lib/track";
import s from "./FreeDesign.module.css";

/** PLACEHOLDER: a sample site reel (Innovative Aluminum's, from /work). */
const SAMPLE_REEL = {
  video: "/success/innovative-aluminum-work.mp4",
  poster: "/success/innovative-aluminum.webp",
};

const TRUSTED_COUNT = 15;

/** "+17789970335" reads as "778-997-0335". */
const WILLIAM_PHONE_READ = WILLIAM_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

/** Faces for the trust line, read from the client quotes in projects.ts. */
const FACES = ["Innovative Aluminum", "WrapCity", "Flow State Therapy", "ACE"]
  .map((name) => projects.find((p) => p.name === name)?.quote)
  .filter((q): q is { author: string; avatar: string; texts: string[]; role: string } => !!q?.avatar);

/* 24px line icons on a 1.5px stroke, like the hero's. */
const PERKS: { label: string; icon: string }[] = [
  {
    label: "Free, no obligation",
    icon: "M4.75 10.25h14.5v8.5a1.5 1.5 0 0 1-1.5 1.5H6.25a1.5 1.5 0 0 1-1.5-1.5v-8.5ZM3.75 7.25h16.5v3H3.75v-3ZM12 7.25v13M12 7.25S10.9 3.75 8.6 3.75c-1.3 0-2.1.9-2.1 1.8 0 1.7 2.6 1.7 5.5 1.7ZM12 7.25s1.1-3.5 3.4-3.5c1.3 0 2.1.9 2.1 1.8 0 1.7-2.6 1.7-5.5 1.7Z",
  },
  {
    label: "Made for your business",
    icon: "M14.25 6.25l3.5 3.5M4.75 19.25l1-4.5 9.85-9.85a1.5 1.5 0 0 1 2.12 0l1.38 1.38a1.5 1.5 0 0 1 0 2.12L9.25 18.25l-4.5 1Z",
  },
  {
    label: "Local to Surrey, BC",
    icon: "M12 20.25s6.25-5.4 6.25-10.5a6.25 6.25 0 1 0-12.5 0c0 5.1 6.25 10.5 6.25 10.5ZM12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z",
  },
];

type Step = "site" | "type" | "contact" | "done";
type Problem = "other" | "website" | "name" | "phone" | "email" | "send";
type Fields = { website: string; business: string; name: string; phone: string; email: string; notes: string };

const STEP_NUMBER: Record<Exclude<Step, "done">, number> = { site: 1, type: 2, contact: 3 };
const EMPTY: Fields = { website: "", business: "", name: "", phone: "", email: "", notes: "" };

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({
  label,
  optional,
  error,
  multiline,
  ...input
}: {
  label: string;
  optional?: boolean;
  error?: string;
  multiline?: boolean;
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
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
        {optional && <span className={s.optional}> (optional)</span>}
      </label>
      {multiline ? <textarea rows={2} {...props} /> : <input {...props} />}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function FreeDesign() {
  const [step, setStep] = useState<Step>("site");
  const [hasSite, setHasSite] = useState<boolean | null>(null);
  const [type, setType] = useState<BusinessType | null>(null);
  const [typeOther, setTypeOther] = useState("");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [error, setError] = useState<Problem | null>(null);
  const [sending, setSending] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Each new step starts at the top of the screen, with its question
  // focused so screen readers follow. The landing keeps the page's own focus.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
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
    if (t === OTHER_TYPE) return;
    track("design_quiz_type", { business_type: t });
    setStep("contact");
  };

  const submitOther = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!typeOther.trim()) {
      setError("other");
      return;
    }
    track("design_quiz_type", { business_type: OTHER_TYPE });
    setStep("contact");
  };

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const website = fields.website.trim().replace(/\s+/g, "");
    const problem: Problem | null =
      hasSite && !LOOKS_LIKE_A_SITE.test(website)
        ? "website"
        : !fields.name.trim()
          ? "name"
          : !looksLikeAPhone(fields.phone)
            ? "phone"
            : !LOOKS_LIKE_AN_EMAIL.test(fields.email.trim())
              ? "email"
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
          typeOther,
          website,
          business: fields.business,
          name: fields.name,
          phone: fields.phone,
          email: fields.email,
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

  const back = () => {
    setError(null);
    setStep(step === "contact" ? "type" : "site");
  };

  const number = step === "done" ? null : STEP_NUMBER[step];
  const firstName = fields.name.trim().split(/\s+/)[0];

  const progress = number ? (
    <div className={s.progress}>
      {step !== "site" && (
        <button type="button" className={s.back} onClick={back}>
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden fill="none">
            <path
              d="M13.5 8h-11M7 3.5 2.5 8 7 12.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      )}
      <span className={s.meter}>
        <span className={s.segments} aria-hidden>
          {[1, 2, 3].map((i) => (
            <span key={i} data-on={i <= number || undefined} />
          ))}
        </span>
        Step {number} of 3
      </span>
    </div>
  ) : null;

  return (
    <main className={s.page}>
      <div className={s.fold} data-mode={step === "site" ? "landing" : "quiz"}>
        {step === "site" && (
          <>
            <section className={s.intro} aria-labelledby="free-design-title">
              <h1 id="free-design-title" className={s.title}>
                Get your free home page design
              </h1>
              <p className={s.sub}>
                Answer three quick questions and we&rsquo;ll design a new home
                page for your business, at no cost to you.
              </p>
              <ul className={s.perks}>
                {PERKS.map((perk) => (
                  <li key={perk.label} className={s.perk}>
                    <Glyph d={perk.icon} />
                    {perk.label}
                  </li>
                ))}
              </ul>
              <div className={s.trust}>
                <span className={s.faces} aria-hidden>
                  {FACES.map((face) => (
                    <Image key={face.author} src={face.avatar} alt="" width={64} height={64} className={s.face} />
                  ))}
                </span>
                Trusted by {TRUSTED_COUNT} businesses
              </div>
            </section>

            <div className={s.reel}>
              <div className={s.reelFrame}>
                <video
                  src={SAMPLE_REEL.video}
                  poster={SAMPLE_REEL.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  aria-label="A home page we designed, scrolling"
                  className={s.reelVideo}
                />
              </div>
            </div>
          </>
        )}

        <section className={s.quiz} aria-label="Free home page design questions">
          {step !== "site" && <p className={s.eyebrow}>Free home page design</p>}
          {progress}

          {/* Keyed by step, so each question rises in fresh. */}
          <div key={step} className={s.enter}>
            {step === "site" && (
              <>
                <h2 ref={headingRef} tabIndex={-1} className={s.question}>
                  Do you have a website?
                </h2>
                <div className={`${s.choices} ${s.two}`}>
                  <button type="button" className={s.choice} aria-pressed={hasSite === true} onClick={() => answerSite(true)}>
                    Yes, I do
                  </button>
                  <button type="button" className={s.choice} aria-pressed={hasSite === false} onClick={() => answerSite(false)}>
                    Not yet
                  </button>
                </div>
              </>
            )}

            {step === "type" && (
              <>
                <h2 ref={headingRef} tabIndex={-1} className={s.question}>
                  I&rsquo;m a&hellip;
                </h2>
                <div className={s.choices}>
                  {BUSINESS_TYPES.map((t) => (
                    <button key={t} type="button" className={s.choice} aria-pressed={type === t} onClick={() => answerType(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                {type === OTHER_TYPE && (
                  <form className={s.other} onSubmit={submitOther} noValidate>
                    <Field
                      label="What do you do?"
                      name="other"
                      autoFocus
                      value={typeOther}
                      placeholder="A bakery, a law office, a gym…"
                      onChange={(e) => {
                        setTypeOther(e.target.value);
                        if (error === "other") setError(null);
                      }}
                      error={error === "other" ? "Tell us in a few words." : undefined}
                    />
                    <ArrowCta full>Continue</ArrowCta>
                  </form>
                )}
              </>
            )}

            {step === "contact" && (
              <>
                <h2 ref={headingRef} tabIndex={-1} className={s.question}>
                  Where should we send your design?
                </h2>
                <form className={s.form} onSubmit={submitContact} noValidate>
                  {hasSite ? (
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
                  ) : (
                    <Field
                      label="Business name"
                      optional
                      name="business"
                      autoComplete="organization"
                      value={fields.business}
                      onChange={set("business")}
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
                      label="Phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={set("phone")}
                      error={error === "phone" ? "Add a phone number with its area code." : undefined}
                    />
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
                  <ArrowCta full>{sending ? "Sending…" : "Get my free design"}</ArrowCta>
                  {error === "send" && (
                    <p className={s.error} role="alert">
                      That didn&rsquo;t send. Try again, or text William at{" "}
                      <a href={`sms:${WILLIAM_PHONE}`}>{WILLIAM_PHONE_READ}</a>.
                    </p>
                  )}
                </form>
              </>
            )}

            {step === "done" && (
              <div className={s.done}>
                <h2 ref={headingRef} tabIndex={-1} className={s.question}>
                  Thanks{firstName ? `, ${firstName}` : ""}. We&rsquo;re on it.
                </h2>
                <p className={s.sub}>
                  We&rsquo;ll design your new home page and be in touch at{" "}
                  {fields.email.trim()}.
                </p>
                <Link href="/" className={s.home}>
                  Back to the homepage
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
