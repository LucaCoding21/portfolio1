"use client";

/**
 * Google reviews under "How does it work?" (Oct 22 2026), laid out like the
 * scattered review cards on acquisition.com's workshop page: three cards as
 * Google shows them, a little tilted and overlapping, the line that matters
 * in each marked in yellow. No title. The words are the reviews' own, cut
 * short where Google would with "… More" (plain text: William doesn't want it
 * sending people to his Google listing).
 * The two photos are cut from the reviewers' Google profile pictures
 * (public/free-homepage-design/reviews).
 *
 * "3 weeks ago" and NEW are worked out from when each review went up, so
 * they age the way Google's do. The dates are approximate: all three read
 * "3 weeks ago" on Oct 22 2026.
 */

import { useSyncExternalStore } from "react";
import Image from "next/image";
import s from "./Reviews.module.css";

const DAY = 86_400_000;
const POSTED = Date.UTC(2026, 9, 1);
/** The day the page was written, used until the browser knows today. */
const WRITTEN = Date.UTC(2026, 9, 22);

type Review = {
  name: string;
  meta: string;
  photo?: string;
  /** A letter on Google's colour when the reviewer has no photo. */
  initial?: { letter: string; colour: string };
  posted: number;
  /** Its paragraphs, the line that matters in a <mark>. */
  body: React.ReactNode[];
  /** Cut short, so the last paragraph ends in "… More". */
  more?: boolean;
};

const REVIEWS: Review[] = [
  {
    name: "Michael Victory",
    meta: "Local Guide · 12 reviews · 4 photos",
    photo: "/free-homepage-design/reviews/michael-victory.webp",
    posted: POSTED,
    body: [
      <>
        Cloverfield have been an outstanding partner for <mark>building high converting, beautiful websites</mark>{" "}
        for us that impresses everyone that sees them. They are <mark>fairly priced</mark>, <mark>don&rsquo;t use templates</mark>,
        are incredibly responsive and work fast.
      </>,
    ],
    more: true,
  },
  {
    name: "Gabrial Winkler",
    meta: "5 reviews",
    photo: "/free-homepage-design/reviews/gabrial-winkler.webp",
    posted: POSTED,
    body: [
      <>
        Cloverfield Studios redesigned both my Northwest Railing and Caddie Companion websites, and I couldn&rsquo;t be
        happier with the results. They took what I had and transformed both sites into something that feels like a
        work of art&mdash;clean, polished, and incredibly professional.
      </>,
      <mark key="2">The difference from my previous websites is night and day.</mark>,
    ],
    more: true,
  },
  {
    name: "Mishele Blumke",
    meta: "5 reviews",
    initial: { letter: "M", colour: "#749e47" },
    posted: POSTED,
    body: [
      <>
        William is very professional, knowledgeable and provides exceptional service.{" "}
        <mark>He takes time to understand my business</mark> and goes the extra mile to provide ongoing support. I
        don&rsquo;t hesitate to recommend Cloverfield to any business looking for a Website Designer!
      </>,
    ],
  },
];

/** Today, in whole days. The server and the first paint use WRITTEN. */
const today = () => Math.floor(Date.now() / DAY);
const noChange = () => () => {};

/** Google's wording: "5 days ago", "3 weeks ago", "2 months ago". */
function ago(days: number) {
  if (days < 7) return days <= 1 ? "a day ago" : `${days} days ago`;
  if (days < 35) return days < 14 ? "a week ago" : `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return days < 60 ? "a month ago" : `${Math.floor(days / 30)} months ago`;
  return days < 730 ? "a year ago" : `${Math.floor(days / 365)} years ago`;
}

function Stars() {
  return (
    <span className={s.stars} role="img" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleMark() {
  return (
    <svg className={s.google} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.5 0 20.1 0 24s1 7.5 2.7 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/** `container` is the page's width class. */
export default function Reviews({ container = "" }: { container?: string }) {
  const day = useSyncExternalStore(noChange, today, () => Math.floor(WRITTEN / DAY));

  return (
    <section className={`${s.reviews} ${container}`} aria-label="Reviews on Google" data-reveal data-section="reviews">
      <div className={s.board}>
        {REVIEWS.map((r) => {
          const days = Math.max(0, day - Math.floor(r.posted / DAY));
          return (
            <article key={r.name} className={s.card} aria-label={`Review by ${r.name}`} data-card>
              <header className={s.head}>
                {r.photo ? (
                  <Image src={r.photo} alt="" width={48} height={48} className={s.avatar} />
                ) : (
                  <span className={s.avatar} style={{ background: r.initial?.colour }} aria-hidden>
                    {r.initial?.letter}
                  </span>
                )}
                <div className={s.who}>
                  <p className={s.name}>{r.name}</p>
                  <p className={s.meta}>{r.meta}</p>
                </div>
                <GoogleMark />
              </header>
              <div className={s.rating}>
                <Stars />
                <span className={s.when}>{ago(days)}</span>
                {days < 35 && <span className={s.new}>New</span>}
              </div>
              <div className={s.body}>
                {r.body.map((paragraph, i) => (
                  <p key={i}>
                    {paragraph}
                    {r.more && i === r.body.length - 1 && (
                      <>
                        {" "}
                        &hellip;{" "}
                        <span className={s.more}>More</span>
                      </>
                    )}
                  </p>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
