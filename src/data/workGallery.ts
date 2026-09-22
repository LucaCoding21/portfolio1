/**
 * /work gallery (Revelatio-style grid + list, restyled to the homepage).
 *
 * Each item carries the project's headline result and its client quote from
 * `projects.ts`, so the card can show what the site did and what the owner
 * said. Media: projects with a storyboarded reel in /public/success use it
 * (played on hover only); the rest show their cover and swap to the mockup
 * on hover.
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
  /** Storyboarded reel, played on hover. */
  video?: string;
  /** Mockup shown on hover when there is no reel. */
  hoverImage?: string;
  hoverImagePosition?: string;
  /** Headline figure and what it measures. */
  result?: WorkResult;
  quote?: WorkQuote;
  href: string;
}

/** The headline, one entry per line; the page breaks between them. */
export const WORK_HEADLINE_LINES = [
  "Strategy, brand systems",
  "and digital products, built for clarity.",
];
export const WORK_HEADLINE = WORK_HEADLINE_LINES.join(" ");
/** Phones get a shorter line; the full one would run five lines there. */
export const WORK_HEADLINE_LINES_SHORT = ["Websites and brands,", "built for clarity."];

/** Reels by project id: the storyboarded 12s walkthroughs in /public/success. */
const REELS: Record<number, { video: string; poster: string }> = {
  9: {
    video: "/success/transforming-landscapes.mp4",
    poster: "/success/transforming-landscapes.webp",
  },
  1: { video: "/success/ace.mp4", poster: "/success/ace.webp" },
  12: { video: "/success/innovative-aluminum.mp4", poster: "/success/innovative-aluminum.webp" },
  // The product photo stays as the cover; the reel plays over it on hover.
  13: { video: "/success/caddie-companion.mp4", poster: "/success/caddie-companion-cover.jpg" },
  // 16 down: recorded frame by frame with Playwright (1920x1200, 60fps).
  // Share images stay as covers until real photos land.
  16: { video: "/success/southboundsips.mp4", poster: "/southboundsips/southboundsips-cover.jpg" },
  14: { video: "/success/northwest-railing.mp4", poster: "/northwest-railing/northwest-railing-cover.jpg" },
  8: { video: "/success/wrapcity.mp4", poster: "/wrapcity-cover.webp" },
  15: { video: "/success/shoobydoo.mp4", poster: "/shoobydoo/shoobydoo-cover.jpg" },
};

/**
 * The headline figure: `metrics[0]` when the project has one, otherwise the
 * first `kpi` that carries a figure, split into figure and label: a leading
 * figure ("+34% booking inquiries") or a trailing "in N units" ("Built and
 * launched in 7 days"). Claims with no figure ("Newly launched") show none.
 */
function headline(p: Project): WorkResult | undefined {
  const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
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

export const WORK_ITEMS: WorkGalleryItem[] = projects.map((p) => {
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
    href: p.url ?? "/work",
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
