/**
 * The guarantee, signed by William and Irish, as a small strip between the
 * results and the FAQ on /seo (Nov 25 2026, by request: it was the quote box
 * in the solution band, which came out; a strip, not a full-screen section,
 * with the two small faces from that box). After the proof, it answers the
 * last doubt before booking ("what if it doesn't work for me?").
 *
 * A white card straddles the seam, half over the dark results and half over
 * the grey FAQ: William's pick of five drafts (the others were a ruled row, a
 * centred founders' note, a hand-signed card with a 3× seal, and the quote
 * large with its last line marked in yellow). The card opens on the quote:
 * the "Our guarantee" eyebrow over it read as AI, so it's a small badge at the
 * end of the signature row instead (William's markup, the same day).
 */

import Image from "next/image";
import { GUARANTEE_QUOTE } from "./guarantee";
import s from "./SeoGuarantee.module.css";

const FACES = [
  "/free-homepage-design/team/william-face.webp",
  "/free-homepage-design/team/irish-photo.webp",
];

export default function SeoGuarantee() {
  return (
    <section className={s.strip} data-section="guarantee" aria-label="Our guarantee">
      <figure className={s.card}>
        <span className={s.faces}>
          {FACES.map((src) => (
            <Image key={src} src={src} alt="" width={64} height={64} className={s.face} />
          ))}
        </span>
        <div>
          <blockquote className={s.quote}>{GUARANTEE_QUOTE}</blockquote>
          <figcaption className={s.foot}>
            <span className={s.who}>
              <strong>William and Irish</strong>
              <span>Founders, Cloverfield Studio, Surrey, BC</span>
            </span>
            <span className={s.badge}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
                <path
                  d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m8.8 11.8 2.2 2.2 4.2-4.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Our guarantee
            </span>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
