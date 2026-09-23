"use client";

/**
 * "See what we'd fix": the visitor types their site, the pill opens the review
 * booking in a new tab with the site prefilled, and we get an email with the
 * URL straight away (so a lead who never books is not lost). One field, one
 * button, one line under it saying what they get.
 *
 * `source` says which placement it is, in the lead email and the analytics
 * event, so the placements can be compared. `tone="dark"` is for footage
 * (the closing reel): centred, with the note in white.
 */

import { useId, useState } from "react";
import ArrowCta from "@/components/ArrowCta";
import { REVIEW_CAL_URL } from "@/data/projects";
import s from "./ReviewField.module.css";

const LOOKS_LIKE_A_SITE = /^(https?:\/\/)?[^\s./]+(\.[^\s./]+)+(\/\S*)?$/i;
const NOTE = "Free review of your current website.";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ReviewField({
  source,
  tone = "light",
  className = "",
}: {
  source: "team" | "closing" | "work";
  tone?: "light" | "dark";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "invalid" | "sent">("idle");
  // Two fields on one page: ids must be unique for the label and the note.
  const id = useId();
  const inputId = `${id}-website`;
  const noteId = `${id}-note`;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const website = String(data.get("website") ?? "").trim().replace(/\s+/g, "");
    if (!LOOKS_LIKE_A_SITE.test(website)) {
      setState("invalid");
      return;
    }

    // Open first, inside the click, or popup blockers step in. No "noopener"
    // feature: with it window.open always returns null, and we could not tell
    // a blocked popup from an open one. Cut the opener link by hand instead.
    const url = `${REVIEW_CAL_URL}?website=${encodeURIComponent(website)}`;
    const tab = window.open(url, "_blank");
    if (tab) tab.opener = null;
    else window.location.href = url;

    fetch("/api/review-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website, source, company: data.get("company") }),
      keepalive: true,
    }).catch(() => {});
    window.gtag?.("event", "review_url_submit", { placement: source });
    setState("sent");
  };

  return (
    <form
      className={`${s.form} ${tone === "dark" ? s.dark : ""} ${className}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className={s.field} data-invalid={state === "invalid" || undefined}>
        <label htmlFor={inputId} className={s.srOnly}>
          Your website
        </label>
        <input
          id={inputId}
          name="website"
          className={s.input}
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="yourbusiness.com"
          aria-invalid={state === "invalid"}
          aria-describedby={noteId}
          onChange={() => state === "invalid" && setState("idle")}
        />
        {/* Honeypot: hidden from people, filled in by bots. */}
        <input name="company" tabIndex={-1} autoComplete="off" className={s.honeypot} aria-hidden />
        <ArrowCta className={s.cta}>See what we&apos;d fix</ArrowCta>
      </div>
      <p id={noteId} className={s.note} role="status">
        {state === "invalid"
          ? "Add your website first, like yourbusiness.com."
          : state === "sent"
            ? "Pick a time in the tab we just opened."
            : NOTE}
      </p>
    </form>
  );
}
