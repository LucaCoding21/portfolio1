"use client";

/**
 * "See what we'd fix": the free website review, sent by email. Three steps in
 * one place, with no new tab:
 *
 *   1. site     the visitor types their site into the pill.
 *   2. contact  the pill opens into a card asking where to send the review:
 *               name, email, and a phone number if they like (only the email
 *               is required).
 *   3. done     the card confirms it's sent and where, lists what the review
 *               will show them, and offers an optional call.
 *
 * Step 1 already emails us the URL, so a lead who stops at step 2 is not
 * lost; step 2 emails us again with their contact details.
 *
 * `source` says which placement it is, in the lead emails and the analytics
 * events, so the placements can be compared. `tone="dark"` is for footage
 * (the closing reel): centred, with the text in white. The cards stay paper
 * on footage too.
 */

import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ArrowCta from "@/components/ArrowCta";
import { REVIEW_CAL_URL, projects } from "@/data/projects";
import { track } from "@/lib/track";
import s from "./ReviewField.module.css";

const LOOKS_LIKE_A_SITE = /^(https?:\/\/)?[^\s./]+(\.[^\s./]+)+(\/\S*)?$/i;
const LOOKS_LIKE_AN_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Next to the call on the confirmation: Mike's line from the Innovative
 *  Aluminum testimonial, read from projects.ts so the two never drift. */
const proofProject = projects.find((p) => p.name === "Innovative Aluminum");
const PROOF = proofProject?.quote && {
  text: proofProject.quote.texts[proofProject.quote.texts.length - 1],
  author: proofProject.quote.author,
  company: proofProject.name,
  avatar: proofProject.quote.avatar,
  url: proofProject.url,
};

type Step = "site" | "contact" | "done";
type Source = "team" | "closing" | "work" | "case-caddie" | "web-design";
type Problem = "site" | "email" | "phone" | "send";

/** "https://www.acme.ca/" reads as "acme.ca" in the copy. */
const bare = (site: string) => site.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden fill="none">
      <path
        d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden fill="none">
      <path
        d="M5 10.5 8.5 14 15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={s.checkPath}
      />
    </svg>
  );
}

export default function ReviewField({
  source,
  tone = "light",
  className = "",
}: {
  source: Source;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [step, setStep] = useState<Step>("site");
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<Problem | null>(null);
  const [sending, setSending] = useState(false);

  // Several fields on one page: ids must be unique for the labels and notes.
  const id = useId();
  const noteId = `${id}-note`;

  const boxRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef(0);
  const lastStep = useRef<Step | null>(null);

  // Each step swap eases the box from its old height to its new one and
  // lifts the new content in, so the pill reads as opening into the card.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const to = box.offsetHeight;
    const from = lastHeight.current;
    const swapped = lastStep.current !== null && lastStep.current !== step;
    lastHeight.current = to;
    lastStep.current = step;
    if (!swapped) return;

    box.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        box,
        { height: from, overflow: "hidden" },
        { height: to, duration: 0.65, ease: "expo.out", clearProps: "height,overflow" },
      );
      gsap.from("[data-in]", { opacity: 0, y: 10, duration: 0.55, ease: "power3.out", stagger: 0.06, delay: 0.05 });
    }, box);
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

    fetch("/api/review-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "site", website: site, source }),
      keepalive: true,
    }).catch(() => {});
    track("review_url_submit", { placement: source });

    setWebsite(site);
    setError(null);
    setStep("contact");
  };

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const who = String(data.get("name") ?? "").trim();
    const address = String(data.get("email") ?? "").trim();
    const number = String(data.get("phone") ?? "").trim();
    if (!LOOKS_LIKE_AN_EMAIL.test(address)) {
      setError("email");
      return;
    }
    if (number && number.replace(/\D/g, "").length < 7) {
      setError("phone");
      return;
    }

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/review-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "contact",
          website,
          name: who,
          email: address,
          phone: number,
          source,
          company: data.get("company"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSending(false);
      setError("send");
      return;
    }

    track("review_contact_submit", { placement: source, has_phone: Boolean(number) });
    setName(who);
    setEmail(address);
    setPhone(number);
    setSending(false);
    setStep("done");
  };

  // The call instead of (or after) the written review: the review booking,
  // with what they told us prefilled.
  const callHref = (who: string, address: string) =>
    `${REVIEW_CAL_URL}?${new URLSearchParams({
      website,
      ...(who && { name: who }),
      ...(address && { email: address }),
    })}`;

  // From the card, the name and email aren't submitted yet: read them off the
  // form at click time so Cal still opens with them filled in.
  const prefillCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const data = new FormData(form);
    e.currentTarget.href = callHref(
      String(data.get("name") ?? "").trim(),
      String(data.get("email") ?? "").trim(),
    );
  };

  const firstName = name.split(/\s+/)[0];

  const eyebrow = (
    <p className={s.eyebrow}>
      Your review of <span className={s.site}>{bare(website)}</span>
    </p>
  );

  /** What the review shows them: the reason to look forward to it. */
  const inside = [
    "Where visitors drop off before getting in touch",
    "The changes that would bring in more customers",
    "A clear list you can act on, with or without us",
  ];

  return (
    <div ref={boxRef} className={`${s.form} ${tone === "dark" ? s.dark : ""} ${className}`}>
      {step === "site" && (
        <form className={s.step} onSubmit={submitSite} noValidate>
          <div className={s.field} data-invalid={error === "site" || undefined}>
            <label htmlFor={`${id}-website`} className={s.srOnly}>
              Your website
            </label>
            <input
              id={`${id}-website`}
              name="website"
              className={s.input}
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="yourbusiness.com"
              defaultValue={website}
              aria-invalid={error === "site"}
              aria-describedby={noteId}
              onChange={clearError}
              {...(website && { "data-focus": true })}
            />
            {/* Honeypot: hidden from people, filled in by bots. */}
            <input name="company" tabIndex={-1} autoComplete="off" className={s.honeypot} aria-hidden />
            <ArrowCta className={s.cta}>See what we&apos;d fix</ArrowCta>
          </div>
          <p id={noteId} className={s.note} role="status">
            {error === "site"
              ? "Add your website first, like yourbusiness.com."
              : "A free review of your current website, sent to your inbox."}
          </p>
        </form>
      )}

      {step === "contact" && (
        <form className={`${s.step} ${s.card}`} onSubmit={submitContact} noValidate>
          <div className={s.head} data-in>
            {eyebrow}
            <button type="button" className={s.change} onClick={() => setStep("site")}>
              Change
            </button>
          </div>
          <h3 className={s.title} data-in>
            Where should we send it?
          </h3>

          <div className={s.grid} data-in>
            <div className={s.control}>
              <label htmlFor={`${id}-name`} className={s.label}>
                Name
              </label>
              <input
                id={`${id}-name`}
                name="name"
                className={s.box}
                type="text"
                autoComplete="name"
                placeholder="Your name"
                defaultValue={name}
                data-focus
              />
            </div>
            <div className={s.control} data-invalid={error === "email" || undefined}>
              <label htmlFor={`${id}-email`} className={s.label}>
                Email
              </label>
              <input
                id={`${id}-email`}
                name="email"
                className={s.box}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="you@yourbusiness.com"
                defaultValue={email}
                aria-invalid={error === "email"}
                aria-describedby={noteId}
                onChange={clearError}
              />
            </div>
            <div className={`${s.control} ${s.wide}`} data-invalid={error === "phone" || undefined}>
              <label htmlFor={`${id}-phone`} className={s.label}>
                Phone <span className={s.optional}>· optional</span>
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                className={s.box}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(604) 555 0123"
                defaultValue={phone}
                aria-invalid={error === "phone"}
                aria-describedby={noteId}
                onChange={clearError}
              />
            </div>
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="company" tabIndex={-1} autoComplete="off" className={s.honeypot} aria-hidden />

          <div className={s.submit} data-in>
            <ArrowCta full>{sending ? "Sending" : "Get my review"}</ArrowCta>
            <p id={noteId} className={s.cardNote} role="status">
              {error === "email"
                ? "Add your email so we know where to send it."
                : error === "phone"
                  ? "That number looks short. Leave it blank if you'd rather."
                  : error === "send"
                    ? "That didn't go through. Try again, or email william@cloverfield.studio."
                    : null}
            </p>
          </div>

          <div className={s.callOption} data-in>
            <p className={s.callLead}>
              Want a deeper look at how to get more leads?
              <a
                className={s.call}
                href={callHref("", "")}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`review-card-${source}`}
                onClick={prefillCall}
              >
                Book a live 30-minute review
                <ArrowUpRight />
              </a>
            </p>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className={`${s.step} ${s.card}`} role="status" tabIndex={-1} data-focus>
          <div className={s.head} data-in>
            {eyebrow}
            <span className={s.sent}>
              <Check />
              Sent
            </span>
          </div>
          <h3 className={s.title} data-in>
            {firstName ? `Thanks, ${firstName}. ` : "Thanks. "}Your review is on its way.
          </h3>
          <p className={s.sub} data-in>
            We&apos;ll email it to {email}.
          </p>

          <div className={s.inside} data-in>
            <p className={s.insideLabel}>What you&apos;ll get</p>
            <ul className={s.list}>
              {inside.map((line) => (
                <li key={line} data-in>
                  <span className={s.tick} aria-hidden>
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
                      <path
                        d="M5 10.5 8.5 14 15 6.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className={s.callOption} data-in>
            <p className={s.callLead}>
              Want a deeper look at how to get more leads?
              <a
                className={s.call}
                href={callHref(name, email)}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`review-${source}`}
              >
                Book a live 30-minute review
                <ArrowUpRight />
              </a>
            </p>
            {PROOF && (
              <figure className={s.proof}>
                {PROOF.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={PROOF.avatar} alt="" width={28} height={28} loading="lazy" />
                )}
                <div>
                  <blockquote>&ldquo;{PROOF.text}&rdquo;</blockquote>
                  <figcaption>
                    {PROOF.author}, {PROOF.company}
                    {PROOF.url && (
                      <a
                        className={s.visit}
                        href={PROOF.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View the ${PROOF.company} website`}
                      >
                        View site
                        <ArrowUpRight />
                      </a>
                    )}
                  </figcaption>
                </div>
              </figure>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
