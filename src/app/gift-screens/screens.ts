import { DEFAULT_NOTE, cardDate, claimByFor, daysLeft, longDate } from "@/lib/giftShared";
import type { GiftPreview } from "@/components/gift/GiftReveal";
import type { SendPreview } from "@/components/gift/SendGift";

/**
 * Every screen of the referral gift flow, for the dev board at /gift-screens.
 * Each one is the real page started partway through, with sample data and
 * nothing saved. Numbered so a change can be asked for by number.
 */

export const SAMPLE = {
  client: {
    firstName: "Dave",
    business: "Northline Roofing",
    siteUrl: "https://cloverfield.studio/work",
  },
  friend: "Mike",
  // what Mike gives when claiming, for the claimed screen
  details: { name: "Mike Chen", business: "Peak Plumbing", phone: "(604) 555-0142", email: "" },
  note: DEFAULT_NOTE,
  giftUrl: "https://cloverfield.studio/gift/Xk3pQ9wLm2Tz",
};

export function sampleDates(now = new Date()) {
  const claimBy = claimByFor(now);
  const lapsed = claimByFor(new Date(now.getTime() - 20 * 86_400_000));
  return {
    card: cardDate(claimBy),
    long: longDate(claimBy),
    daysLeft: daysLeft(claimBy, now),
    expiredCard: cardDate(lapsed),
    expiredLong: longDate(lapsed),
  };
}

type Base = { key: string; title: string; note: string };

export type Screen = Base &
  (
    | { kind: "send"; preview?: SendPreview }
    | {
        kind: "gift";
        state: "sealed" | "claimed" | "signed" | "expired";
        preview?: GiftPreview;
      }
    // a real route, shown as is
    | { kind: "url"; src: string; size?: "phone" | "desktop" }
    | { kind: "og" }
  );

export type Group = { title: string; note: string; screens: Screen[] };

export const GROUPS: Group[] = [
  {
    title: "Dave sends a gift",
    note: "/g/<token>, the client's private link from Command Center",
    screens: [
      {
        key: "send",
        kind: "send",
        title: "Send page",
        note: "What Dave sees when he opens his link.",
      },
      {
        key: "send-typing",
        kind: "send",
        title: "Typing a name",
        note: "The card fills in as he types.",
        preview: { friend: SAMPLE.friend },
      },
      {
        key: "send-error",
        kind: "send",
        title: "No name",
        note: "He tapped Send gift with the name empty.",
        preview: { nameError: true },
      },
      {
        key: "send-long-note",
        kind: "send",
        title: "Long note",
        note: "The count shows past 80 characters.",
        preview: {
          friend: SAMPLE.friend,
          note: "They built our site last spring and it brings us more calls than anything else we do.",
        },
      },
      {
        key: "sent",
        kind: "send",
        title: "Sent",
        note: "Text it, email it or copy the link.",
        preview: { friend: SAMPLE.friend, sentUrl: SAMPLE.giftUrl },
      },
      {
        key: "send-404",
        kind: "url",
        src: "/g/x",
        title: "Wrong link",
        note: "A token that doesn't exist.",
      },
    ],
  },
  {
    title: "Mike opens it",
    note: "/gift/<id>, the link Dave texts him",
    screens: [
      {
        key: "og",
        kind: "og",
        title: "The text",
        note: "Dave's note and the link preview in Messages.",
      },
      {
        key: "sealed",
        kind: "gift",
        state: "sealed",
        title: "Envelope",
        note: "Tap it to watch it open. Reload closes it again.",
      },
      {
        key: "open",
        kind: "gift",
        state: "sealed",
        title: "Opened",
        note: "Where the animation ends.",
        preview: { open: true },
      },
      {
        key: "flipped",
        kind: "gift",
        state: "sealed",
        title: "Card turned over",
        note: "Any tap on the card flips it.",
        preview: { open: true, flipped: true },
      },
      {
        key: "claim",
        kind: "gift",
        state: "sealed",
        title: "Claim form",
        note: "After Claim your gift. His name is filled in.",
        preview: { open: true, claim: "form" },
      },
      {
        key: "claim-errors",
        kind: "gift",
        state: "sealed",
        title: "Claim form, missing fields",
        note: "He tapped Claim your $500 with it empty.",
        preview: { open: true, claim: "form", claimErrors: true },
      },
      {
        key: "claimed",
        kind: "gift",
        state: "sealed",
        title: "Claimed",
        note: "Right after Claim. Fix it reopens the form for an hour.",
        preview: { open: true, claim: "done", details: SAMPLE.details },
      },
      {
        key: "claim-fix",
        kind: "gift",
        state: "sealed",
        title: "Fixing his details",
        note: "After Wrong number? Fix it. The form again, filled in.",
        preview: { open: true, claim: "fix", details: SAMPLE.details },
      },
      {
        key: "claimed-later",
        kind: "gift",
        state: "claimed",
        title: "Back after claiming",
        note: "Opening the link again. No envelope this time.",
      },
      {
        key: "signed",
        kind: "gift",
        state: "signed",
        title: "Signed",
        note: "Once he's marked Signed in Command Center.",
      },
      {
        key: "expired",
        kind: "gift",
        state: "expired",
        title: "Expired",
        note: "Past the claim-by date.",
      },
      {
        key: "gift-404",
        kind: "url",
        src: "/gift/x",
        title: "Wrong link",
        note: "A gift that doesn't exist.",
      },
    ],
  },
  {
    title: "On a computer",
    note: "Same pages, wider window",
    screens: [
      {
        key: "desktop-send",
        kind: "url",
        src: "/gift-screens/sent",
        size: "desktop",
        title: "Sent",
        note: "Dave on a laptop.",
      },
      {
        key: "desktop-open",
        kind: "url",
        src: "/gift-screens/open",
        size: "desktop",
        title: "Opened",
        note: "Mike on a laptop.",
      },
    ],
  },
  {
    title: "Command Center",
    note: "Where clients are added and gifts are tracked. Live, so it needs Command Center running and you signed in",
    screens: [
      {
        key: "command-center",
        kind: "url",
        src: `${process.env.COMMAND_CENTER_URL ?? "http://localhost:3006"}/referrals`,
        size: "desktop",
        title: "Referrals",
        note: "Live. Click a gift or a client.",
      },
    ],
  },
];

export const SCREENS = GROUPS.flatMap((g) => g.screens);
