"use client";

import Image from "next/image";
import Pill from "./Pill";
import { gsap, useSightGsap } from "./motion";
import { BOOK_URL } from "./constants";

/**
 * Final CTA: the mountain photography from the hero returns, bookending
 * the page, with a white card floating on it. The card parallaxes gently
 * against the image, and "three" types on once with a caret blink — the
 * ask-bar motif, one last time.
 */

export default function FinalCta() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const caret = root.querySelector<HTMLElement>("[data-caret]");

    if (reduced) {
      if (caret) gsap.set(caret, { autoAlpha: 0 });
      return;
    }

    const card = root.querySelector("[data-cta-card]");
    if (card) {
      gsap.fromTo(
        card,
        { yPercent: 7 },
        {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    const typed = root.querySelector<HTMLElement>("[data-typed]");
    if (typed && caret) {
      const word = typed.textContent ?? "";
      const proxy = { n: 0 };
      typed.textContent = "";
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top 55%", once: true },
        })
        .to(proxy, {
          n: word.length,
          duration: 0.5,
          ease: "none",
          delay: 0.3,
          onUpdate: () => {
            typed.textContent = word.slice(0, Math.round(proxy.n));
          },
        })
        .to(caret, { autoAlpha: 0, duration: 0.3 }, "+=1.4");
    }
  });

  return (
    <section ref={scope} className="relative overflow-hidden">
      <Image
        src="/sight/mountain.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative flex min-h-[92vh] items-center justify-center px-6 py-28 md:py-40">
        <div
          data-cta-card
          className="w-full max-w-[600px] rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_80px_-24px_rgba(20,24,33,0.45)] md:p-14"
        >
          <h2
            className="font-medium leading-[1.15] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
          >
            Bring{" "}
            <span className="relative inline-block">
              <span className="invisible" aria-hidden="true">
                three
              </span>
              <span className="absolute inset-y-0 left-0 whitespace-nowrap">
                <span data-typed>three</span>
                <span
                  data-caret
                  aria-hidden="true"
                  className="sight-caret ml-px inline-block h-[0.85em] w-[2px] translate-y-[0.1em] rounded-full bg-[var(--blue)]"
                />
              </span>
            </span>{" "}
            questions you can&apos;t easily answer.
          </h2>

          <p className="mx-auto mt-5 max-w-[26rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]">
            Fifteen minutes. We&apos;ll show you Sight answering them about a
            business like yours.
          </p>

          <div className="mt-9">
            <Pill href={BOOK_URL} variant="primary">
              Book 15 minutes
            </Pill>
          </div>

          <div className="mt-7 flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-[var(--surface)] px-4 py-2 text-[0.825rem] text-[var(--ink-soft)]">
              <span className="sight-dot h-2 w-2 rounded-full bg-[var(--green)]" />
              Taking founding clients
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
