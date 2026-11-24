/**
 * The SEO page's hero (Nov 13 2026): photo 3 of William's picks (a
 * woodworker in his shop, flipped in CSS) in one card under the nav. The
 * headline, sub-line and promise sit top left; "Book a free SEO call" and
 * the trust line bottom right. William
 * chose this (layout 5) and its overlay (2) from six of each.
 */

import Image from "next/image";
import { CAL_URL } from "@/data/projects";
import AiSwap from "./AiSwap";
import s from "./SeoPage.module.css";

/** Trust line faces, as on the free homepage sample page: WrapCity, Innovative Aluminum, Flow State, ACE. */
const FACES = [
  "/wrapcity-headshot-v3.webp",
  "/testimonials/mike-victory.webp",
  "/flowstate/paula-headshot.jpg",
  "/ACE/ace-headshot-v5.webp",
];

export default function SeoHero() {
  return (
    <section className={s.hero} data-section="hero">
      <div className={s.heroCard}>
        <Image
          src="/seo/hero.webp"
          alt=""
          fill
          priority
          // the page's largest paint on phones: fetched ahead of everything else
          fetchPriority="high"
          sizes="100vw"
          className={s.heroImage}
          style={{ objectPosition: "50% 45%" }}
        />
        <div className={s.heroShade} aria-hidden />

        <div className={s.heroCopy}>
          <h1 className={s.h1}>
            Get more calls from Google and{" "}
            <span className={s.nowrap}>
              AI <AiSwap />
            </span>{" "}
            without paying for ads.
          </h1>
          <p className={s.lede}>Turn Google into another source of customers, so you rely less on word of mouth.</p>
          <p className={s.promiseText}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden className={s.shield}>
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
            <span>3× your SEO investment back in gross profit, or we work for free until you get there.</span>
          </p>
          {/* the buttons and trust line share a column (bottom right on
              desktop), so on short laptop windows they sit beside the
              headline instead of adding to the hero's height (Nov 15 2026) */}
          <div className={s.heroSide}>
            <div className={s.heroCtas}>
              <a className={s.heroBtn} href={CAL_URL} target="_blank" rel="noopener noreferrer">
                Book a free SEO call
              </a>
              <a className={s.heroBtnGhost} href="#results">
                See our results
              </a>
            </div>
            <div className={s.proof}>
              <div className={s.faces} aria-hidden>
                {FACES.map((src) => (
                  <Image key={src} src={src} alt="" width={40} height={40} className={s.face} />
                ))}
              </div>
              <p className={s.proofText}>
                <strong>3,000+ inquiries</strong>{" "}
                <span className={s.proofLong}>generated for local businesses by sites we&rsquo;ve built</span>
                {/* phones: the short version, so it fits beside the faces */}
                <span className={s.proofShort}>from sites we&rsquo;ve built</span>
              </p>
            </div>
          </div>
          {/* The copy shows once the browser has read this far (see
              .heroCopy in the CSS), so it never paints half-built. */}
          <span data-hero-done hidden />
        </div>
      </div>
    </section>
  );
}
