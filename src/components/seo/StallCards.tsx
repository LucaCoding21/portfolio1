"use client";

/**
 * The three cards under "The problem" (Nov 14 2026). Hovering a card (a tap
 * on touch screens) widens it, the other two narrow, and a picture or video
 * slides in from its right edge while the text stays on the left. William
 * picked this from a board of hover reveals and animations (a slide over the
 * card, pictures drawn in CSS, taps, flips, fades, wipes, smoother slides);
 * he kept the first slide as it was.
 */
import { useEffect, useRef, useState } from "react";
import s from "./SeoPage.module.css";

type Media = { kind: "img" | "video"; src: string; position?: string };

// Nov 14 2026, picked by William:
// 1: Google's real "Businesses" box for "deck builders surrey bc", signed
//    out, light mode, 2x, cropped to the top two listings (a drawn mock-up
//    looked AI-made)
// 2: a woodworker tapping in a nail, sent by William to match 3's warm light
// 3: Pexels 5973925 (a woodworker typing at his bench)
const STALLS: { title: string; body: string; media: Media }[] = [
  {
    title: "A competitor shows up first",
    body: "You search for your own service in your city, and someone else comes up before you. Some of them aren’t even as good as you.",
    media: { kind: "img", src: "/seo/stall-competitor.webp" },
  },
  {
    title: "Some months are slow",
    body: "Most of your work comes from word of mouth, so some months are busy and some are slow.",
    media: { kind: "img", src: "/seo/stall-slow.webp", position: "center" },
  },
  {
    // the line break keeps the title as narrow as the description
    title: "You’ve heard the\npromises before",
    body: "Every week, someone emails you promising #1 on Google. If you’ve hired one, you got a monthly report and no new calls.",
    media: { kind: "img", src: "/seo/stall-promises.webp", position: "center" },
  },
];

/** A video plays only while its card is open. */
function MediaBox({ media, on }: { media: Media; on: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (on) v.play().catch(() => {});
    else v.pause();
  }, [on]);
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

function Card({ c }: { c: (typeof STALLS)[number] }) {
  const [on, setOn] = useState(false);
  return (
    <li
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
        <MediaBox media={c.media} on={on} />
      </div>
    </li>
  );
}

export default function StallCards() {
  return (
    <ol className={s.stallCards}>
      {STALLS.map((c) => (
        <Card key={c.title} c={c} />
      ))}
    </ol>
  );
}
