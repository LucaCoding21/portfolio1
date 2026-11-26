/**
 * The closing ask on /seo, after the FAQ (Nov 25 2026, by request): the
 * homepage and /work end on a booking section before the footer and /seo
 * went straight from the questions into it. Owners who've read the FAQ are
 * the warmest on the page, so this gives them one clear button. Its line
 * answers what Mike asked first on the Nov 25 call (what will it cost?)
 * without a figure: the price is for the call, as the FAQ says.
 *
 * William's pick from five drafts: the photo bookend's layout (a rounded
 * card inset on the FAQ's grey, the words and a white pill at the bottom left
 * over a dark shade, as the hero is) with the homepage closing's reel behind
 * it in place of the hero photo (ClosingReel). The centred version, an ink
 * card, a split and the homepage's own closing were the others. The founders'
 * faces and "William and Irish, founders" beside the button came off by
 * request.
 */

import { CAL_URL } from "@/data/projects";
import ClosingReel from "./ClosingReel";
import s from "./SeoClosing.module.css";

export default function SeoClosing() {
  return (
    <section className={s.wrap} data-section="closing" aria-labelledby="closing-title">
      <div className={s.card}>
        <ClosingReel className={s.media} />
        <div className={s.shade} aria-hidden />
        <div className={s.copy}>
          <h2 id="closing-title" className={s.heading}>
            Ready to get more calls from Google?
          </h2>
          <p className={s.line}>
            On the free call we look at your business and who you&rsquo;re up against, then tell you honestly whether
            we can help and what it would cost.
          </p>
          <div className={s.row}>
            {/* the white pill on a dark ground, as in the hero */}
            <a className={s.btn} href={CAL_URL} target="_blank" rel="noopener noreferrer">
              Book a free SEO call
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
                <path
                  d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
