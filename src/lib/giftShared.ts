/**
 * Referral gifts: the rules and helpers both the pages and the server use.
 */

export const GIFT_AMOUNT = 500;
export const CLAIM_DAYS = 14;
export const FRIEND_NAME_MAX = 20;
// The note is printed on the card, two lines at most.
export const NOTE_MAX = 100;
export const DEFAULT_NOTE = "These guys built our site. Thought of you.";
// "Try another" on the send page steps through these, starting from the default.
export const NOTE_SUGGESTIONS = [
  DEFAULT_NOTE,
  "Our new site has been great. Worth a call.",
  "You mentioned needing a website. Here you go.",
];

export const GIFT_ID_RE = /^[A-Za-z0-9]{12}$/;

/** localStorage, on the phone that sent a gift: its own opens aren't the friend's. */
export const senderKey = (giftId: string) => `cf_gift_sent:${giftId}`;
export const CLIENT_TOKEN_RE = /^[A-Za-z0-9]{10,64}$/;

export type GiftStatus = "sent" | "claimed" | "signed";

// Dates are Vancouver dates: "Claim by Oct 28" holds until the end of Oct 28
// there, not until the hour the gift happened to be sent.
const TZ = "America/Vancouver";

function offsetAt(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(utcMs));
  const p = Object.fromEntries(parts.map((x) => [x.type, Number(x.value)]));
  const asWall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asWall - (utcMs - (utcMs % 1000));
}

/** The last moment of the 14th day after `created`, Vancouver time. */
export function claimByFor(created: Date): Date {
  const later = new Date(created.getTime() + CLAIM_DAYS * 86_400_000);
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(later)
    .split("-")
    .map(Number);
  const wall = Date.UTC(y, m - 1, d, 23, 59, 59, 999);
  return new Date(wall - offsetAt(wall));
}

/** "Oct 28, 2026", for the card. */
export function cardDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric" }).format(d);
}

/** "October 28", for sentences. */
export function longDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "long", day: "numeric" }).format(d);
}

/** Whole Vancouver calendar days from `now` to the claim-by date: 14 on the day it's sent, 0 on the last day. */
export function daysLeft(claimBy: Date, now = new Date()): number {
  const day = (d: Date) => {
    const [y, m, dd] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
      .format(d)
      .split("-")
      .map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  return Math.max(0, Math.round((day(claimBy) - day(now)) / 86_400_000));
}

/** William's number, as in the site's business listing (layout.tsx). The friend's page texts it. */
export const WILLIAM_PHONE = "+17789970335";

// Form checks, shared so the inline errors and the API always agree.

const LOOKS_LIKE_AN_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOOKS_LIKE_A_PHONE = /^[+()\-.\s\d]+$/;

export function friendNameError(name: string): string | undefined {
  if (!name.trim()) return "Add your friend's first name.";
  if (name.trim().length > FRIEND_NAME_MAX) return `Use ${FRIEND_NAME_MAX} characters or fewer.`;
}

export type ClaimFields = { name: string; business: string; phone: string; email: string };
export type ClaimErrors = Partial<Record<keyof ClaimFields, string>>;

export function claimErrors(f: ClaimFields): ClaimErrors {
  const errors: ClaimErrors = {};
  if (!f.name.trim()) errors.name = "Add your name.";
  if (!f.business.trim()) errors.business = "Add your business name.";
  const phone = f.phone.trim();
  const digits = phone.replace(/\D/g, "").length;
  if (!phone) errors.phone = "Add your phone number so William can reach you.";
  else if (!LOOKS_LIKE_A_PHONE.test(phone) || digits < 7 || digits > 15)
    errors.phone = "That doesn't look like a phone number.";
  if (f.email.trim() && !LOOKS_LIKE_AN_EMAIL.test(f.email.trim())) errors.email = "That doesn't look like an email.";
  return errors;
}

export const isEmail = (s: string) => LOOKS_LIKE_AN_EMAIL.test(s.trim());
