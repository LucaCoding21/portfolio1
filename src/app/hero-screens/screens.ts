import type { StaticImageData } from "next/image";
import type { HeroPreview } from "@/components/HeroReview";
import step1Desktop from "./design/step1-desktop.jpg";
import step2Desktop from "./design/step2-desktop.jpg";
import step1Phone from "./design/step1-phone.jpg";

/**
 * Every state of the homepage hero's free site review, for the dev board at
 * /hero-screens. Each one is the real hero started at that step with sample
 * values; it still clicks through, but sends nothing. Numbered so a change
 * can be asked for by number. `design` is the matching screen from the
 * "Cloverfield Hero + Lead Form" PDF, where there is one.
 */

const SITE = "yourbusiness.ca";
const FILLED = { name: "Jordan Lee", email: "jordan@yourbusiness.ca", phone: "604 555 0123" };

export type Screen = {
  key: string;
  title: string;
  note: string;
  size: "desktop" | "phone";
  preview: HeroPreview;
  design?: StaticImageData;
};

export type Group = { title: string; note: string; screens: Screen[] };

export const GROUPS: Group[] = [
  {
    title: "Desktop",
    note: "1440 × 900, the design's artboard",
    screens: [
      {
        key: "site",
        title: "Step 1 · Your website",
        note: "What everyone sees first. Type a site and press the button to walk the rest.",
        size: "desktop",
        preview: {},
        design: step1Desktop,
      },
      {
        key: "site-error",
        title: "Step 1 · No website yet",
        note: "The button pressed with the field empty or not a site.",
        size: "desktop",
        preview: { error: "site" },
      },
      {
        key: "contact",
        title: "Step 2 · Where to send it",
        note: "After the site. We already have the URL by email at this point.",
        size: "desktop",
        preview: { step: "contact", website: SITE },
        design: step2Desktop,
      },
      {
        key: "contact-error",
        title: "Step 2 · Missing a field",
        note: "Checked in order: name, then email, then a 10-digit phone.",
        size: "desktop",
        preview: { step: "contact", website: SITE, error: "name" },
      },
      {
        key: "contact-failed",
        title: "Step 2 · Didn't go through",
        note: "The send failed (offline, server error). Their details stay filled in.",
        size: "desktop",
        preview: { step: "contact", website: SITE, ...FILLED, error: "send" },
      },
      {
        key: "done",
        title: "Step 3 · Sent",
        note: "The lead email and the phone alert have gone out. Try another site starts over.",
        size: "desktop",
        preview: { step: "done", website: SITE, ...FILLED },
      },
    ],
  },
  {
    title: "Phone",
    note: "390 × 844, the design's mobile artboard. Steps 2 and 3 weren't drawn for phones.",
    screens: [
      {
        key: "site-phone",
        title: "Step 1 · Your website",
        note: "The pill stacks into a card at the bottom of the screen.",
        size: "phone",
        preview: {},
        design: step1Phone,
      },
      {
        key: "contact-phone",
        title: "Step 2 · Where to send it",
        note: "Fields stack in one column.",
        size: "phone",
        preview: { step: "contact", website: SITE },
      },
      {
        key: "done-phone",
        title: "Step 3 · Sent",
        note: "Same card, with the button full width.",
        size: "phone",
        preview: { step: "done", website: SITE, ...FILLED },
      },
    ],
  },
];

export const SCREENS = GROUPS.flatMap((g) => g.screens);
