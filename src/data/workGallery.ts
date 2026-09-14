/**
 * /work gallery (Revelatio-style grid + list). PLACEHOLDER: the headline is
 * lifted verbatim from the reference and `services` is a stand-in until real
 * per-project services exist. Media cycles through the three homepage sample
 * pairs (poster + reel) until each project has its own assets.
 */
import { projects } from "@/data/projects";

export interface WorkGalleryItem {
  id: number;
  name: string;
  description: string;
  /** Industry tags, also used as the filter chips. */
  tags: string[];
  /** Right column of the list view. */
  services: string[];
  poster: string;
  video: string;
  href: string;
}

export const WORK_HEADLINE =
  "We create strategy, brand systems, and digital products for companies looking to move forward with clarity.";

const MEDIA_POOL: { poster: string; video: string }[] = [
  { poster: "/success/innovative-aluminum.webp", video: "/success/innovative-aluminum.mp4" },
  { poster: "/success/oh-architecture.avif", video: "/success/oh-architecture.webm" },
  { poster: "/hero-v2-poster.webp", video: "/hero-v2.mp4" },
];

export const WORK_ITEMS: WorkGalleryItem[] = projects.map((p, i) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  tags: p.tags,
  services: ["Website"],
  poster: MEDIA_POOL[i % MEDIA_POOL.length].poster,
  video: MEDIA_POOL[i % MEDIA_POOL.length].video,
  href: p.url ?? "/work",
}));

export const WORK_FILTERS: string[] = Array.from(
  new Set(WORK_ITEMS.flatMap((p) => p.tags))
);
