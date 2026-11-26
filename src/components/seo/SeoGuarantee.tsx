"use client";

/**
 * The guarantee on /seo, between the results and the FAQ, `id="guarantee"`
 * (the hero's "How it works" link lands on it and opens it).
 *
 * A white card straddles the seam, half over the dark results and half over
 * the grey FAQ, opening on the quote and signed by William and Irish with
 * their two small faces (William's pick of five drafts, Nov 25 2026; an "Our
 * guarantee" eyebrow over the quote read as AI). Later the same day he asked
 * whether a bigger section explaining the guarantee would get more owners to
 * book, and from four drafts (a dark card with an example chart, the doubts
 * as question cards, ruled rows, and this) he kept the strip with the
 * explanation behind a button: "How it works" where the green "Our
 * guarantee" pill was, opening the questions owners have about it
 * (GUARANTEE_POINTS) under the signature. The button is the site's own
 * (ArrowCta's chip fill, with a chevron), his pick of five button drafts (a
 * filling outline, a rolling label, the guarantee's green and a ringed
 * chevron were the others). "Surrey, BC" came off the signature by request.
 * On phones the questions are an accordion, one answer open at a time and
 * the first open to start: the six answers stacked made the opened card
 * 1,210px tall on a 375px phone, and this brings it to about 905px (his
 * pick of five phone drafts; one-line answers, swipe cards, chips and a
 * sheet from the foot of the screen were the others).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { CAL_URL } from "@/data/projects";
import { useChipFill } from "@/lib/useChipFill";
import { GUARANTEE_CLOSE, GUARANTEE_POINTS, GUARANTEE_QUOTE } from "./guarantee";
import s from "./SeoGuarantee.module.css";

const FACES = [
  "/free-homepage-design/team/william-face.webp",
  "/free-homepage-design/team/irish-photo.webp",
];

export default function SeoGuarantee() {
  const [open, setOpen] = useState(false);
  // phones: which answer is open in the accordion (-1 for none)
  const [phoneAt, setPhoneAt] = useState(0);

  // "How it works": the paper chip swells to fill the pill on hover
  const howRef = useRef<HTMLButtonElement>(null);
  const howFillRef = useRef<HTMLSpanElement>(null);
  const howArrowRef = useRef<HTMLSpanElement>(null);
  const howLabelRef = useRef<HTMLSpanElement>(null);
  useChipFill({ btn: howRef, fill: howFillRef, arrow: howArrowRef, label: howLabelRef }, { turn: false });

  // arriving from the hero's "How it works" (#guarantee) opens it, since
  // that's what the link promised
  useEffect(() => {
    const onHash = () => {
      if (location.hash === "#guarantee") setOpen(true);
    };
    const t = window.setTimeout(onHash, 0);
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // The faces sit level with the middle of the quote and signature. Opening,
  // they stay put while the questions slide open, then glide up to the top
  // on their own short delay (Nov 25 2026, by request: they jumped there the
  // instant the card opened). So the card is top-aligned once this has
  // measured, and the faces are moved down to the middle with a transform
  // that can animate. Stacked on phones, there's nothing to move.
  const figRef = useRef<HTMLElement>(null);
  const facesRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const fig = figRef.current;
    const faces = facesRef.current;
    const body = bodyRef.current;
    const foot = footRef.current;
    if (!fig || !faces || !body || !foot) return;

    const measure = () => {
      const b = body.getBoundingClientRect();
      const f = faces.getBoundingClientRect();
      const side = f.right <= b.left + 1;
      // the closed card: the quote and the signature, not the questions
      const closed = foot.getBoundingClientRect().bottom - b.top;
      const y = side ? Math.max(0, (closed - f.height) / 2) : 0;
      fig.style.setProperty("--faces-y", `${y}px`);
    };

    measure();
    fig.dataset.measured = "";
    // only animate once the first measure is in place
    const raf = requestAnimationFrame(() => {
      fig.dataset.anim = "";
    });
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section id="guarantee" className={s.strip} data-section="guarantee" aria-label="Our guarantee">
      <figure ref={figRef} className={`${s.card} ${open ? s.cardOpen : ""}`}>
        <span ref={facesRef} className={s.faces}>
          {FACES.map((src) => (
            <Image key={src} src={src} alt="" width={64} height={64} className={s.face} />
          ))}
        </span>
        <div ref={bodyRef}>
          <blockquote className={s.quote}>{GUARANTEE_QUOTE}</blockquote>
          <figcaption ref={footRef} className={s.foot}>
            <span className={s.who}>
              <strong>William and Irish</strong>
              <span>Founders, Cloverfield Studio</span>
            </span>
            <button
              ref={howRef}
              type="button"
              className={s.how}
              aria-expanded={open}
              aria-controls="guarantee-more"
              onClick={() => setOpen((o) => !o)}
            >
              <span ref={howFillRef} aria-hidden className={s.howFill} />
              <span className={s.howContent}>
                <span ref={howLabelRef}>How it works</span>
                <span ref={howArrowRef} aria-hidden className={s.howArrow}>
                  <svg className={s.chev} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </button>
          </figcaption>
          <div id="guarantee-more" className={`${s.more} ${open ? s.moreOpen : ""}`} inert={!open}>
            <div className={s.moreInner}>
              <ul className={s.moreList}>
                {GUARANTEE_POINTS.map((pt) => (
                  <li key={pt.q}>
                    <h3 className={s.moreQ}>{pt.q}</h3>
                    <p className={s.moreA}>{pt.a}</p>
                  </li>
                ))}
              </ul>
              {/* phones: the same questions as an accordion, in place of the
                  list above */}
              <ul className={s.acc}>
                {GUARANTEE_POINTS.map((pt, i) => {
                  const on = phoneAt === i;
                  return (
                    <li key={pt.q} className={s.accItem}>
                      <button
                        type="button"
                        className={s.accQ}
                        aria-expanded={on}
                        onClick={() => setPhoneAt(on ? -1 : i)}
                      >
                        {pt.q}
                        <svg className={s.accPlus} viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <div className={`${s.accA} ${on ? s.accAOpen : ""}`} inert={!on}>
                        <div>
                          <p>{pt.a}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className={s.moreClose}>
                {GUARANTEE_CLOSE}{" "}
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
                  Book a free SEO call
                </a>
              </p>
            </div>
          </div>
        </div>
      </figure>
    </section>
  );
}
