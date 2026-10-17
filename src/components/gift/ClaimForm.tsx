"use client";

/** The friend's claim: who they are and how William can reach them. With
 *  `fix`, it reopens with what they gave, to correct it ("Fix it"). */

import { useEffect, useRef, useState } from "react";
import { claimErrors, type ClaimErrors, type ClaimFields } from "@/lib/giftShared";
import s from "./gift.module.css";

const FIELDS: {
  key: keyof ClaimFields;
  label: string;
  optional?: boolean;
  props: React.InputHTMLAttributes<HTMLInputElement>;
}[] = [
  { key: "name", label: "Your name", props: { autoComplete: "name", autoCapitalize: "words" } },
  { key: "business", label: "Business name", props: { autoComplete: "organization", autoCapitalize: "words" } },
  { key: "phone", label: "Phone", props: { type: "tel", inputMode: "tel", autoComplete: "tel" } },
  {
    key: "email",
    label: "Email",
    optional: true,
    props: { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none", autoCorrect: "off" },
  },
];

export default function ClaimForm({
  giftId,
  initial,
  fix = false,
  onDone,
  preview,
}: {
  giftId: string;
  initial: ClaimFields;
  fix?: boolean;
  onDone: (values: ClaimFields) => void;
  /** For the dev screens board (/gift-screens): no focus grab, nothing sent,
   *  and `errors` starts as if Claim was tapped with the form empty. */
  preview?: { errors?: boolean };
}) {
  const [values, setValues] = useState<ClaimFields>(initial);
  const [errors, setErrors] = useState<ClaimErrors>(() => (preview?.errors ? claimErrors(values) : {}));
  const [formError, setFormError] = useState<string>();
  const [sending, setSending] = useState(false);
  const inputs = useRef<Partial<Record<keyof ClaimFields, HTMLInputElement | null>>>({});

  // The name is already filled in, so start them on the business, or on the
  // phone when they came back to fix it.
  useEffect(() => {
    if (!preview) inputs.current[fix ? "phone" : "business"]?.focus();
  }, [preview, fix]);

  function focusFirst(errs: ClaimErrors) {
    const first = FIELDS.find((f) => errs[f.key]);
    if (first) inputs.current[first.key]?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const errs = claimErrors(values);
    setErrors(errs);
    setFormError(undefined);
    if (Object.keys(errs).length) {
      focusFirst(errs);
      return;
    }
    if (preview) return onDone(values);
    setSending(true);
    try {
      const res = await fetch(`/api/gifts/${giftId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, fix }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return onDone(values);
      if (data.errors) {
        setErrors(data.errors);
        focusFirst(data.errors);
      } else {
        setFormError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Couldn't reach us. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={`${s.form} ${s.claimFields} ${s.rise}`} onSubmit={onSubmit} noValidate>
      {FIELDS.map(({ key, label, optional, props }) => (
        <div key={key} className={s.field}>
          <label className={s.label} htmlFor={`claim-${key}`}>
            {label} {optional && <span className={s.optional}>(optional)</span>}
          </label>
          <input
            {...props}
            ref={(el) => {
              inputs.current[key] = el;
            }}
            id={`claim-${key}`}
            className={s.input}
            value={values[key]}
            onChange={(e) => {
              setValues((v) => ({ ...v, [key]: e.target.value }));
              if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
            }}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={errors[key] ? `claim-${key}-error` : undefined}
          />
          {errors[key] && (
            <p id={`claim-${key}-error`} className={s.error}>
              {errors[key]}
            </p>
          )}
        </div>
      ))}

      {formError && (
        <p className={s.error} role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className={`${s.button} ${s.claimSubmit}`} disabled={sending}>
        {sending ? "Claiming..." : "Claim your $500"}
      </button>
    </form>
  );
}
