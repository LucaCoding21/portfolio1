/**
 * Client wall under the hero: two strips of cards cloned from clay.com's
 * logo wall, sitting straight on the paper like the old logo strip did.
 * Every cell is a boxed card like the reference: most hold a logo, one tall
 * quote card spans both strips and one horizontal quote sits in the top
 * strip. Each cell is pinned by row / col / span / tall.
 *
 * SAMPLE copy: every quote, stat and person name is a placeholder written
 * to fit the layout. Logos come from `clientLogos.ts`.
 */
import { CLIENT_LOGOS, type ClientLogo } from "./clientLogos";

export type WallVariant = "logo" | "quote" | "hquote" | "hstat";

export interface WallPerson {
  name: string;
  title: string;
  avatar: string;
}

export interface WallCard {
  logo: ClientLogo;
  /** Logo height override in px. Defaults to the strip height from `clientLogos.ts`, capped per cell type. */
  logoHeight?: number;
  variant: WallVariant;
  row: 1 | 2;
  col: number;
  span?: number;
  tall?: number;
  quote?: string;
  /** Reference sets these inline: `width` on tall quote cards, `maxWidth` on horizontal ones. */
  quoteWidth?: number;
  quoteMaxWidth?: number;
  /** Optional headline block above the quote on a tall card. */
  title?: { big: string; small: string };
  stat?: { value: string; lines: string[] };
  /** Shown in the cursor bubble on hover. Cards without one do not get the bubble. */
  person?: WallPerson;
  href?: string;
}

const logo = (name: string): ClientLogo => {
  const l = CLIENT_LOGOS.find((c) => c.name === name);
  if (!l) throw new Error(`clientWall: no logo named ${name}`);
  return l;
};

export const WALL_LABEL = "Sites we've built";

export const WALL_CARDS: WallCard[] = [
  /* strip 1 */
  {
    logo: logo("WrapCity"),
    logoHeight: 34,
    variant: "quote",
    row: 1,
    col: 1,
    span: 2,
    tall: 2,
    // His own message, verbatim apart from the comma in the figure.
    quote: "“Just wanted to let you know I landed a $7,000 job this morning because of the website. I didn't even advertise it!”",
    quoteWidth: 208,
    person: { name: "Taylor Paige", title: "Founder", avatar: "/wrapcity-headshot-v3.webp" },
    href: "/work",
  },
  { logo: logo("Ondek"), variant: "logo", row: 1, col: 3 },
  { logo: logo("Transforming Landscapes"), variant: "logo", row: 1, col: 4 },
  {
    logo: logo("Innovative Aluminum Systems"),
    logoHeight: 34,
    variant: "hstat",
    row: 1,
    col: 5,
    span: 2,
    stat: { value: "+180%", lines: ["inquiries"] },
    href: "/case-studies/innovative-aluminum",
  },
  {
    logo: logo("Northwest Railing"),
    logoHeight: 52,
    variant: "quote",
    row: 1,
    col: 7,
    span: 2,
    tall: 2,
    quote: "“Inquiries were up 33% in the first three months. It paid for itself faster than anything else I've spent on.”",
    quoteWidth: 208,
    person: { name: "Gabrial Winkler", title: "Founder", avatar: "/testimonials/gabrial-winkler-poster.jpg" },
    href: "/work",
  },
  { logo: logo("Venue Series"), variant: "logo", row: 1, col: 9 },
  {
    logo: logo("Venues Quarterly"),
    logoHeight: 26,
    variant: "hquote",
    row: 1,
    col: 10,
    span: 2,
    // Price angle. Written with their permission; no named person on file.
    quote: "“The quote was the invoice. Nothing got added on, nothing got padded.”",
    quoteMaxWidth: 190,
    href: "/work",
  },
  {
    logo: logo("Njagih Studios"),
    logoHeight: 26,
    variant: "quote",
    row: 1,
    col: 12,
    span: 2,
    tall: 2,
    quote: "“I sent them my photos and answered one call. A week later the site was live. I did almost nothing.”",
    quoteWidth: 208,
    person: { name: "Israel Njagih", title: "Owner", avatar: "/Njagih/njagih-headshot-v2.webp" },
    href: "/work",
  },
  { logo: logo("Greater Vancouver REALTORS"), variant: "logo", row: 1, col: 14 },
  // Tall narrow art: runs the full content height of the cell.
  { logo: logo("Shoobydoo"), logoHeight: 48, variant: "logo", row: 1, col: 15 },
  { logo: logo("Southbound Sips"), logoHeight: 48, variant: "logo", row: 1, col: 16 },

  /* strip 2 */
  {
    logo: logo("Real Estate Institute of BC"),
    logoHeight: 30,
    variant: "hquote",
    row: 2,
    col: 14,
    span: 2,
    // Promised-vs-delivered angle. Written with their permission; the
    // executive director has no headshot on file, so no hover bubble.
    quote: "“They scoped it, priced it, gave us a date, and hit all three. No surprises, no change orders.”",
    quoteMaxWidth: 200,
    href: "/work",
  },
  { logo: logo("Real Estate 360"), variant: "logo", row: 2, col: 5 },
  { logo: logo("Caddie Companion"), variant: "logo", row: 2, col: 6 },
  {
    logo: logo("Ace Suasola"),
    logoHeight: 36,
    variant: "hstat",
    row: 2,
    col: 9,
    span: 2,
    stat: { value: "3x", lines: ["monthly", "bookings"] },
    person: { name: "Ace Suasola", title: "Photographer", avatar: "/ACE/ace-headshot-v5.webp" },
    href: "/work",
  },
  { logo: logo("Afterparty"), logoHeight: 48, variant: "logo", row: 2, col: 11 },
  { logo: logo("League1v1"), variant: "logo", row: 2, col: 3 },
  { logo: logo("Bloomkey"), variant: "logo", row: 2, col: 4 },
  { logo: logo("Dreamhouse Printing"), logoHeight: 38, variant: "logo", row: 2, col: 16 },
];

/** Number of grid columns the cards actually use, so no empty tracks trail the wall. */
export const WALL_COLUMNS = Math.max(...WALL_CARDS.map((c) => c.col + (c.span ?? 1) - 1));
