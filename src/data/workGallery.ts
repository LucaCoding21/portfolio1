/**
 * /work gallery (Revelatio-style grid + list, restyled to the homepage).
 *
 * Each item carries the project's headline result and its client quote from
 * `projects.ts`, so the card can show what the site did and what the owner
 * said. Media: projects with a reel in /public/success play it on their
 * own while on screen; the rest show their cover and swap to the mockup on
 * hover.
 *
 * PLACEHOLDER: the headline is lifted verbatim from the reference and
 * `services` is a stand-in until real per-project services exist.
 */
import { projects, type Project } from "@/data/projects";

export interface WorkResult {
  value: string;
  /** Reads as one line with the value; starts lowercase unless it is a name. */
  label: string;
  /** "Built and launched in 7 days": the label leads and the figure ends the line. */
  labelFirst?: boolean;
}

export interface WorkQuote {
  texts: string[];
  author: string;
  role: string;
  avatar?: string;
}

export interface WorkGalleryItem {
  id: number;
  name: string;
  description: string;
  /** Industry tags, also used as the filter chips. */
  tags: string[];
  /** Right column of the list view. */
  services: string[];
  /** Cover at rest. */
  poster: string;
  posterPosition?: string;
  /** Screen-recorded reel, played while the card is on screen. */
  video?: string;
  /** Mockup shown on hover when there is no reel. */
  hoverImage?: string;
  hoverImagePosition?: string;
  /** Headline figure and what it measures. */
  result?: WorkResult;
  quote?: WorkQuote;
  /** Grid card shows `description` in the quote slot when there is no quote. */
  showDescription?: boolean;
  href: string;
  /** In-site case study, linked under the grid card. */
  caseStudy?: string;
}

/** The headline, one entry per line; the page breaks between them. */
export const WORK_HEADLINE_LINES = [
  "Strategy, brand systems",
  "and digital products, built for clarity.",
];
export const WORK_HEADLINE = WORK_HEADLINE_LINES.join(" ");
/** Phones get a shorter line; the full one would run five lines there. */
export const WORK_HEADLINE_LINES_SHORT = ["Websites and brands,", "built for clarity."];

/**
 * Reels by project id, all 16:10 and played on their own while the card is on
 * screen. Most are the owner's own screen recordings; Southbound Sips was
 * recorded frame by frame with Playwright. Files ending in -work are /work
 * only: the homepage Success Stories keep their original storyboarded reels.
 */
const REELS: Record<number, { video: string; poster: string }> = {
  8: { video: "/success/wrapcity.mp4", poster: "/wrapcity-cover.webp" },
  14: { video: "/success/northwest-railing.mp4", poster: "/northwest-railing/northwest-railing-cover.jpg" },
  12: { video: "/success/innovative-aluminum-work.mp4", poster: "/success/innovative-aluminum.webp" },
  13: { video: "/success/caddie-companion-work.mp4", poster: "/success/caddie-companion-cover.jpg" },
  9: { video: "/success/transforming-landscapes-work.mp4", poster: "/success/transforming-landscapes.webp" },
  11: { video: "/success/afterparty.mp4", poster: "/afterparty/afterparty-cover.jpg" },
  1: { video: "/success/ace-work.mp4", poster: "/success/ace.webp" },
  15: { video: "/success/shoobydoo.mp4", poster: "/shoobydoo/shoobydoo-cover.jpg" },
  16: { video: "/success/southboundsips.mp4", poster: "/southboundsips/southboundsips-cover.jpg" },
  17: { video: "/success/dreamhouse.mp4", poster: "/dreamhouse/dreamhouse-cover.jpg" },
  18: { video: "/success/re360.mp4", poster: "/re360/re360-cover.jpg" },
  19: { video: "/success/flowstate.mp4", poster: "/flowstate/flowstate-cover.jpg" },
  10: { video: "/success/bloomkey.mp4", poster: "/bloomkey/bloomkey-cover.jpeg" },
  4: { video: "/success/njagih.mp4", poster: "/Njagih/njagih-cover.jpg" },
  6: { video: "/success/nancy-tran.mp4", poster: "/sophia/sophia-cover2.jpg" },
};

/**
 * The headline figure: `metrics[0]` when the project has one, otherwise the
 * first `kpi` that carries a figure, split into figure and label: a leading
 * figure ("+34% booking inquiries") or a trailing "in N units" ("Built and
 * launched in 7 days"). Claims with no figure ("Newly launched") show none.
 */
function headline(p: Project): WorkResult | undefined {
  // Lowercase the first letter so the label reads on from the figure, but
  // leave acronyms ("BC industry speakers") alone.
  const lower = (t: string) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
  if (p.metrics?.length)
    return { value: p.metrics[0].value, label: lower(p.metrics[0].label) };
  for (const kpi of p.kpis ?? []) {
    const lead = kpi.match(/^([+~$]?\d[\d,.]*[%kK]?(?:\/\d+)?)\s+(.+)$/);
    if (lead) return { value: lead[1], label: lead[2] };
    const trail = kpi.match(/^(.+?\s+in)\s+(\d+\s+\w+)$/);
    if (trail) return { value: trail[2], label: trail[1], labelFirst: true };
  }
  return undefined;
}

/** Case studies by project id. */
const CASE_STUDIES: Record<number, string> = {
  12: "/case-studies/innovative-aluminum",
  13: "/case-studies/caddie-companion",
};

/** These lead the gallery in this order (Innovative Aluminum, WrapCity,
    Northwest Railing); the rest follow in projects.ts order. */
const LEAD_IDS = [12, 8, 14];
const ordered = [
  ...LEAD_IDS.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => !!p),
  ...projects.filter((p) => !LEAD_IDS.includes(p.id)),
];

export const WORK_ITEMS: WorkGalleryItem[] = ordered.map((p) => {
  const reel = REELS[p.id];
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    tags: p.tags,
    services: ["Website"],
    poster: reel?.poster ?? p.image,
    posterPosition: reel ? undefined : p.imagePosition,
    video: reel?.video,
    hoverImage: reel ? undefined : p.hoverImage,
    hoverImagePosition: p.hoverImagePosition,
    result: headline(p),
    quote: p.quote,
    showDescription: p.showDescription,
    href: p.url ?? "/work",
    caseStudy: CASE_STUDIES[p.id],
  };
});

/** Filter order. Any tag not listed here still gets a filter, after these.
    Keep each filter at two or more projects (owner's call, September 2026). */
const FILTER_ORDER = [
  "Real Estate",
  "Trades & Manufacturing",
  "Clinics & Therapy",
  "Events & Hospitality",
  "Photography",
  "Ecommerce & Shopify",
];
const used = new Set(WORK_ITEMS.flatMap((p) => p.tags));
export const WORK_FILTERS: string[] = [
  ...FILTER_ORDER.filter((t) => used.has(t)),
  ...[...used].filter((t) => !FILTER_ORDER.includes(t)),
];
