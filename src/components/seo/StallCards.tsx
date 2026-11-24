"use client";

/**
 * The three cards under "The problem" (Nov 14 2026). Hovering a card (a tap
 * on touch screens) widens it, the other two narrow, and a picture or video
 * slides in from its right edge while the text stays on the left. William
 * picked this from a board of hover reveals and animations (a slide over the
 * card, pictures drawn in CSS, taps, flips, fades, wipes, smoother slides);
 * he kept the first slide as it was.
 *
 * Nov 15 2026: cards 2 and 3 got small animated scenes in x.ai/bot's style
 * (StallScenes) in place of the photos, the calendar and the invoice, which
 * William picked from drafts; on Nov 23 2026 card 3 got new copy and the
 * pull (a phone's inquiries folder, refreshed while nothing comes in). On phones and tablets the picture sits under
 * the text and plays when the card scrolls into view, as x.ai's cards do on
 * phones.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import StallScene, { type SceneId } from "./StallScenes";
import { useReducedMotion } from "./StageKit";
import s from "./SeoPage.module.css";

type Media =
  | { kind: "img" | "video"; src: string; position?: string }
  | { kind: "scene"; scene: SceneId };

// Picked by William:
// 1: Google's real "Businesses" box for "deck builders surrey bc", signed
//    out, light mode, 2x, cropped to the top two listings (a drawn mock-up
//    looked AI-made), Nov 14 2026; its big "Businesses" heading cropped
//    off on Nov 23 2026 by request (stall-competitor-v2; the first cut stays)
// 2 and 3: scenes (Nov 15 2026); the photos before them, a woodworker
//    tapping in a nail and Pexels 5973925, stay in public/seo (stall-slow,
//    stall-promises), unused
const STALLS: { title: string; body: string; media: Media }[] = [
  {
    title: "A competitor shows up first",
    body: "You search for your own service in your city, and someone else comes up before you. Some of them aren’t even as good as you.",
    media: { kind: "img", src: "/seo/stall-competitor-v2.webp" },
  },
  {
    title: "Some months are slow",
    body: "Most of your work comes from word of mouth, so some months are busy and some are slow.",
    media: { kind: "scene", scene: "calendar" },
  },
  {
    // Nov 23 2026, William's words: the website itself isn't bringing leads
    // (before: "You don't know what you're paying for", about agencies, with
    // the invoice, and "You've heard the promises before" before that). The
    // line break keeps the title as narrow as the description.
    title: "Your website isn’t\nbringing in leads",
    // picked from three tries (his first, "You have a website, but you don't
    // know how many customers it's actually bringing you.", read as weak)
    body: "You keep checking for new inquiries from your website, and most days there aren’t any.",
    media: { kind: "scene", scene: "pull" },
  },
];

const stackedQuery = "(max-width: 900px)";
function useStacked() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(stackedQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(stackedQuery).matches,
    () => false,
  );
}

/** A video plays only while its card is open. */
function MediaBox({ media, on, still, lead }: { media: Media; on: boolean; still: boolean; lead: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (on) v.play().catch(() => {});
    else v.pause();
  }, [on]);
  if (media.kind === "scene") return <StallScene id={media.scene} playing={on} still={still} lead={lead} />;
  return media.kind === "video" ? (
    <video ref={ref} className={s.stallMediaEl} src={media.src} muted loop playsInline preload="none" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={s.stallMediaEl}
      src={media.src}
      alt=""
      loading="lazy"
      decoding="async"
      style={media.position ? { objectPosition: media.position } : undefined}
    />
  );
}

function Card({ c, media }: { c: (typeof STALLS)[number]; media: Media }) {
  const ref = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);
  const [inView, setInView] = useState(false);
  const stacked = useStacked();
  const still = useReducedMotion();

  // phones and tablets: play while a third of the card is on screen (x.ai's 0.35)
  useEffect(() => {
    const el = ref.current;
    if (!el || !stacked) return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [stacked]);

  return (
    <li
      ref={ref}
      className={s.stallCard}
      data-on={on || undefined}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <div className={s.stallCardText}>
        <p className={s.stallText}>{c.body}</p>
        <h3 className={s.stallHead}>{c.title}</h3>
      </div>
      <div className={s.stallMedia} aria-hidden>
        {/* on desktop the scene starts as the slide-in (0.15s + 0.6s) lands */}
        <MediaBox media={media} on={stacked ? inView : on} still={still} lead={stacked ? 0 : 450} />
      </div>
    </li>
  );
}

export default function StallCards() {
  return (
    <ol className={s.stallCards}>
      {STALLS.map((c) => (
        <Card key={c.title} c={c} media={c.media} />
      ))}
    </ol>
  );
}
