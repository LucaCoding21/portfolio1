"use client";

/**
 * The work strip along the bottom of the free design page's first screen
 * (Option A handoff, Oct 21 2026; it replaced the logo row): ten home
 * pages we've designed drifting left on a loop (BloomKey and Dreamhouse
 * Printing, in the handoff, were taken out, and Flow State Therapy on Oct
 * 22 2026: it's new and has no result yet). Under each, its name and,
 * small under that, what the site did for the business, with only its
 * figure in /work's soft green highlighter (WorkGallery's row stat). The
 * lines are written for the strip (approved Oct 21 2026); the figures are
 * the ones in projects.ts. A site without one shows its /work result.
 *
 * The strip is whole before any video loads. Every card starts as a still,
 * the first frame of its loop (public/success/cards, 640 x 400 WebP, 6 to
 * 28 KB), which is also all iPhone Low Power Mode shows, since it blocks
 * autoplay. The loops are seven seconds of each /work reel cut to the card's
 * size (640 x 400, 30fps, no audio, 70 to 270 KB: 1.5 MB for all ten
 * against the reels' 23 MB), started on the frame the handoff's stills show.
 * None of them loads with the page: once it has finished loading, a card
 * plays while it is on screen, or about to slide on, and pauses when it
 * leaves. The track repeats every card so the loop has no
 * seam, which would otherwise mean 22 videos running at once.
 *
 * Reduced motion: the strip stands still on its stills.
 */

import { useEffect, useRef } from "react";
import { WORK_ITEMS } from "@/data/workGallery";
import s from "./WorkStrip.module.css";

/** One line on what the site did for the business, read as `lead figure
    rest`; only the figure is highlighted. */
export type Stat = { lead?: string; figure: string; rest?: string };

/** In the handoff's order; `file` names the loop and still in
    public/success/cards, `id` the project whose /work result shows when
    there's no `stat`. The dark band's clips read their lines from here
    too, so the figures match. */
export const SITES: { name: string; file: string; id: number; stat?: Stat }[] = [
  {
    name: "Northwest Railing",
    file: "northwest-railing",
    id: 14,
    stat: { figure: "39% more", rest: "inquiries in 3 months" },
  },
  {
    name: "WrapCity",
    file: "wrapcity",
    id: 8,
    stat: { figure: "34% more", rest: "booking inquiries" },
  },
  { name: "Real Estate 360", file: "re360", id: 18 },
  {
    name: "Southbound Sips",
    file: "southbound-sips",
    id: 16,
    stat: { lead: "Paid for itself in", figure: "4 days" },
  },
  // The case study's 60 inquiries in the first 90 days, without its "up
  // from about 7 a year", which compared three months with a year.
  {
    name: "Innovative Aluminum",
    file: "innovative-aluminum",
    id: 12,
    stat: { figure: "60 inquiries", rest: "in its first 3 months" },
  },
  {
    name: "ACE",
    // Cut from the trimmed reel (ace-work-v3), without "Every Frame Tells a
    // Story" (Oct 22 2026).
    file: "ace-cut",
    id: 1,
    stat: { lead: "Monthly bookings", figure: "tripled" },
  },
  { name: "Afterparty", file: "afterparty", id: 11 },
  // The /work "+21% more visitors turned into buyers", as plain words.
  {
    name: "Caddie Companion",
    file: "caddie-companion",
    id: 13,
    stat: { figure: "21% more", rest: "of its visitors buy" },
  },
  // Its other result, "8 qualified buyer leads in 1 month".
  {
    name: "Nancy Tran",
    file: "nancy-tran",
    id: 6,
    stat: { figure: "8 qualified buyer leads", rest: "in a month" },
  },
  { name: "Transforming Landscapes", file: "transforming-landscapes", id: 9 },
];

/** The site's line, with only the figure in the green highlighter. Without
    a `stat`, the /work result the same way ("+39% inquiries in 3 months",
    "Built and launched in 9 days"); one with no label ("Newly launched") is
    a status, not a figure, and stays plain. */
function Result({ site }: { site: (typeof SITES)[number] }) {
  if (site.stat) {
    const { lead, figure, rest } = site.stat;
    return (
      <span className={s.statLine}>
        {lead && `${lead} `}
        <span className={s.figure}>{figure}</span>
        {rest && ` ${rest}`}
      </span>
    );
  }
  const r = WORK_ITEMS.find((item) => item.id === site.id)?.result;
  if (!r) return null;
  if (!r.label) return <span className={s.statLine}>{r.value}</span>;
  const figure = <span className={s.figure}>{r.value}</span>;
  return (
    <span className={s.statLine}>
      {r.labelFirst ? (
        <>
          {r.label} {figure}
        </>
      ) : (
        <>
          {figure} {r.label}
        </>
      )}
    </span>
  );
}

export default function WorkStrip() {
  const stripRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    const marquee = marqueeRef.current;
    if (!strip || !marquee || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = Array.from(marquee.querySelectorAll("video"));

    /* A card plays while the strip is on screen and the card is in it, or
       100px (about three seconds of drift) from sliding in; its still is the
       loop's first frame, so the start doesn't show. The cards are watched
       against the strip, whose edges clip them, and the strip against the
       window. */
    const near = new Set<Element>();
    let shown = false;
    const sync = (v: HTMLVideoElement) => {
      if (shown && near.has(v)) v.play().catch(() => {});
      else v.pause();
    };
    const cards = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) near.add(e.target);
          else near.delete(e.target);
          sync(e.target as HTMLVideoElement);
        }),
      { root: marquee, rootMargin: "0px 100px" }
    );
    const screen = new IntersectionObserver(([e]) => {
      shown = e.isIntersecting;
      videos.forEach(sync);
    });

    /* Nothing loads until the page has. */
    const start = () => {
      videos.forEach((v) => cards.observe(v));
      screen.observe(strip);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      cards.disconnect();
      screen.disconnect();
    };
  }, []);

  return (
    <section ref={stripRef} className={s.strip} data-section="strip" aria-label="Home pages we’ve designed" data-hero="5">
      <p className={s.label}>Home pages we&rsquo;ve designed for businesses across Canada and the US</p>
      <div ref={marqueeRef} className={s.marquee}>
        {/* Both copies in one row: the track slides half its width plus half
            a gap, bringing the second copy to where the first began. The
            second is hidden from screen readers. */}
        <div className={s.track}>
          {[0, 1].map((copy) =>
            SITES.map((site) => (
              <figure key={`${copy}-${site.file}`} className={s.card} aria-hidden={copy === 1 || undefined}>
                <video
                  src={`/success/cards/${site.file}.mp4`}
                  poster={`/success/cards/${site.file}.webp`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={`${site.name} home page`}
                  className={s.video}
                />
                <figcaption className={s.caption}>
                  {site.name}
                  <Result site={site} />
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
