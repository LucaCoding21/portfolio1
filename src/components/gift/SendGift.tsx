"use client";

/**
 * A client's private page (/g/<token>), laid out from the designer's
 * "Cloverfield Gift Screen" redesign (October 2026): "Give $500, get $500",
 * the card filling in as they type, the friend's name and a note (with a few
 * ready-made ones under "Try another"), and a short "How it works". Sharing
 * saves the gift, then the page turns into the sent screen: text it, email
 * it or copy the link. The design's printed card back was left out on
 * purpose; the back stays William's blank artwork.
 * `preview` starts the page partway through, for the dev screens board
 * (/gift-screens): nothing is saved.
 */

import { useEffect, useRef, useState } from "react";
import GiftCard from "@/components/gift/GiftCard";
import GiftHeader from "@/components/gift/GiftHeader";
import {
  DEFAULT_NOTE,
  FRIEND_NAME_MAX,
  NOTE_MAX,
  NOTE_SUGGESTIONS,
  friendNameError,
  senderKey,
} from "@/lib/giftShared";
import { track } from "@/lib/track";
import s from "./gift.module.css";

type Sent = { id: string; url: string; friendName: string; note: string; claimByCard: string };

export type SendPreview = { friend?: string; note?: string; nameError?: boolean; sentUrl?: string };

// The note's count only shows once it's getting long.
const NOTE_COUNT_FROM = 80;

const possessive = (name: string) => (/s$/i.test(name) ? `${name}’` : `${name}’s`);

export default function SendGift({
  token,
  firstName,
  business,
  claimByCard,
  hasEmail = false,
  preview,
}: {
  token: string;
  firstName: string;
  business: string;
  /** "Oct 31, 2026" */
  claimByCard: string;
  /** Command Center has their email, so they'll hear when the friend claims. */
  hasEmail?: boolean;
  preview?: SendPreview;
}) {
  const [friend, setFriend] = useState(preview?.friend ?? "");
  const [note, setNote] = useState(preview?.note ?? DEFAULT_NOTE);
  const [suggestion, setSuggestion] = useState(0);
  const [nameError, setNameError] = useState(preview?.nameError ? friendNameError("") : undefined);
  const [formError, setFormError] = useState<string>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Sent | null>(() =>
    preview?.sentUrl ? { id: "", url: preview.sentUrl, friendName: friend, note: DEFAULT_NOTE, claimByCard } : null,
  );
  const [copied, setCopied] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // The form and the sent screen swap out the button that was just pressed,
  // so focus moves on to the new screen instead of dropping to the page.
  const focusNext = useRef<"title" | "name" | null>(null);

  useEffect(() => {
    if (focusNext.current === "title") titleRef.current?.focus({ preventScroll: true });
    if (focusNext.current === "name") nameRef.current?.focus({ preventScroll: true });
    focusNext.current = null;
  }, [sent]);

  const from = `${firstName}, ${business}`;
  const name = friend.trim();
  // "Oct 31" for the steps
  const claimDay = claimByCard.replace(/,\s*\d{4}$/, "");

  function tryAnother() {
    const next = (suggestion + 1) % NOTE_SUGGESTIONS.length;
    setSuggestion(next);
    setNote(NOTE_SUGGESTIONS[next]);
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // No clipboard API (plain http on a phone): copy from a hidden field.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track("gift_link_shared", { method: "copy" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const error = friendNameError(friend);
    setNameError(error);
    setFormError(undefined);
    if (error) {
      nameRef.current?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, friendName: friend, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors?.friendName) setNameError(data.errors.friendName);
        else setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const gift: Sent = {
        id: data.id,
        url: data.url,
        friendName: name,
        note: note.trim(),
        claimByCard: data.claimByCard ?? claimByCard,
      };
      // So opening the link on this phone to see it doesn't count as the
      // friend opening it.
      try {
        localStorage.setItem(senderKey(gift.id), "1");
      } catch {}
      track("gift_sent", { custom_note: !NOTE_SUGGESTIONS.includes(note.trim()) });
      focusNext.current = "title";
      setSent(gift);
      window.scrollTo({ top: 0 });
    } catch {
      setFormError("Couldn't reach us. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  function sendAnother() {
    setFriend("");
    setNote(DEFAULT_NOTE);
    setSuggestion(0);
    focusNext.current = "name";
    setSent(null);
    setCopied(false);
    window.scrollTo({ top: 0 });
  }

  if (sent) {
    const message = sent.note || `A gift for you from ${firstName}`;
    // "sms:?&body=" opens Messages with the text filled in on both iOS and Android.
    const textHref = `sms:?&body=${encodeURIComponent(`${message}\n${sent.url}`)}`;
    const emailHref = `mailto:?subject=${encodeURIComponent("A gift for you")}&body=${encodeURIComponent(
      `${message}\n\n${sent.url}`,
    )}`;

    return (
      <div className={s.page}>
        <main className={s.main}>
          <GiftHeader />

          <div className={s.done}>
            <span className={s.doneIcon} aria-hidden="true">
              <CheckIcon size={26} strokeWidth={2.4} />
            </span>
            <h1 ref={titleRef} tabIndex={-1} className={s.doneTitle}>
              {possessive(sent.friendName)} gift is ready
            </h1>
            <p className={s.doneLede}>
              Send it however you usually reach {sent.friendName}.
              {hasEmail && " We’ll let you know when they claim it."}
            </p>
          </div>

          <div className={s.cardWrap}>
            <GiftCard friendName={sent.friendName} from={from} claimBy={sent.claimByCard} />
          </div>

          <div className={s.actions}>
            <a className={s.button} href={textHref} onClick={() => track("gift_link_shared", { method: "text" })}>
              <MessageIcon />
              Text it to {sent.friendName}
            </a>
            <div className={s.altRow}>
              <a className={s.alt} href={emailHref} onClick={() => track("gift_link_shared", { method: "email" })}>
                <MailIcon />
                Email
              </a>
              <button type="button" className={s.alt} onClick={() => copy(sent.url)}>
                {copied ? <CheckIcon className={s.copiedIcon} strokeWidth={2.4} /> : <CopyIcon />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <button type="button" className={s.textLink} onClick={sendAnother}>
              Send another gift
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <main className={s.main}>
        <GiftHeader />

        <div className={s.intro}>
          <h1 className={s.titleLg}>Give $500, get $500</h1>
          <p className={s.lede}>
            Send a friend $500 off a new website. When they become a client, you get <strong>$500 too</strong>.
          </p>
        </div>

        <div className={s.cardWrap}>
          <GiftCard friendName={name || "your friend"} from={from} claimBy={claimByCard} />
        </div>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <div className={s.field}>
            <label className={s.label} htmlFor="gift-friend">
              Friend&rsquo;s first name
            </label>
            <input
              ref={nameRef}
              id="gift-friend"
              className={s.input}
              value={friend}
              onChange={(e) => {
                setFriend(e.target.value);
                if (nameError) setNameError(undefined);
              }}
              placeholder="e.g. Sam"
              maxLength={FRIEND_NAME_MAX}
              autoComplete="off"
              autoCapitalize="words"
              enterKeyHint="next"
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? "gift-friend-error" : undefined}
            />
            {nameError && (
              <p id="gift-friend-error" className={s.error}>
                {nameError}
              </p>
            )}
          </div>

          <div className={`${s.field} ${s.noteField}`}>
            <div className={s.labelRow}>
              <label className={s.label} htmlFor="gift-note">
                Note <span className={s.optional}>(optional)</span>
              </label>
              <button type="button" className={s.ghost} onClick={tryAnother}>
                <ShuffleIcon />
                Try another
              </button>
            </div>
            <textarea
              id="gift-note"
              className={s.input}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={NOTE_MAX}
              rows={3}
            />
            {note.length > NOTE_COUNT_FROM && (
              <p className={s.count}>
                {note.length}/{NOTE_MAX}
              </p>
            )}
          </div>

          {formError && (
            <p className={s.error} role="alert">
              {formError}
            </p>
          )}

          <div className={s.send}>
            <button type="submit" className={s.button} disabled={sending}>
              <ShareIcon />
              {sending ? "Sending..." : name ? `Share ${possessive(name)} gift` : "Share gift"}
            </button>
            <p className={s.sendNote}>
              You&rsquo;ll get a link to text or email.
              <br />
              {name || "Your friend"} has until {claimByCard} to claim it.
            </p>
          </div>
        </form>

        <section className={s.how} aria-labelledby="gift-how">
          <h2 id="gift-how" className={s.howTitle}>
            How it works
          </h2>
          <ol className={s.steps}>
            {[
              "Share your link with a friend.",
              `They claim it by ${claimDay}, and we reach out.`,
              "When they become a client, you get $500 toward your hosting, SEO or upgrades.",
            ].map((step, i) => (
              <li key={step} className={s.step}>
                <span className={s.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={s.stepText}>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

// The design's icons: 24 x 24, stroked in the text colour.

function Icon({
  size = 18,
  strokeWidth = 2,
  className,
  children,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function ShareIcon() {
  return (
    <Icon>
      <path d="M12 15V3" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </Icon>
  );
}

function ShuffleIcon() {
  return (
    <Icon size={16}>
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </Icon>
  );
}

function CheckIcon({ size, strokeWidth, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Icon>
  );
}

function MessageIcon() {
  return (
    <Icon>
      <path d="M21 12a8 8 0 0 1-11.8 7.05L4 20l1.1-4.4A8 8 0 1 1 21 12z" />
    </Icon>
  );
}

function MailIcon() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Icon>
  );
}

function CopyIcon() {
  return (
    <Icon>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </Icon>
  );
}
