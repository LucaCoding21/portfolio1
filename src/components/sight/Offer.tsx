"use client";

import Reveal from "./Reveal";
import { T } from "./SightUI";

/**
 * The offer: one plain centered card, no fireworks. The only motion is the
 * card's single fade-up and a gentle opacity pulse on the spots dot.
 * Prices never animate; moving prices read as gimmick.
 */

const PIECES = [
  "The system, built for you",
  "The ask-anything AI",
  "Alerts and the Monday report",
  "Your team, trained",
  "30 days of tuning after launch",
  "A 4-page website rebuild, free",
];

export default function Offer() {
  return (
    <section id="offer" className="scroll-mt-24 py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal className="mx-auto max-w-[720px]">
          <div className="rounded-[2rem] bg-[var(--surface)] p-8 md:p-14">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[12px] font-medium"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.1)", color: T.BLUE }}
            >
              Founding clients
            </span>

            <div className="mt-8">
              {PIECES.map((piece) => (
                <div
                  key={piece}
                  className="border-b py-3.5 text-[1rem] text-[var(--ink)] md:text-[1.06rem]"
                  style={{ borderColor: "#ECEDEF" }}
                >
                  {piece}
                </div>
              ))}
            </div>

            <p
              className="mt-10 font-medium leading-[1.3] tracking-[-0.01em] text-[var(--ink)]"
              style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.7rem)" }}
            >
              $12,000 to build · $1,500/month to keep it alive and growing.
            </p>
            <p className="mt-2 text-[1.06rem] text-[var(--ink-soft)]">
              First month free.
            </p>

            <div className="mt-9">
              <p className="text-[0.875rem] font-medium text-[var(--ink-faint)]">
                How you pay
              </p>
              <p className="mt-2 max-w-[34rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]">
                You pay when it&apos;s live and answering your questions. Not
                live in 45 days? You don&apos;t pay.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--ink-soft)]">
                <span className="sight-dot h-2 w-2 rounded-full bg-[var(--green)]" />
                2 of 3 open
              </span>
              <p className="text-[0.95rem] leading-[1.6] text-[var(--ink-soft)]">
                Three founding spots: that&apos;s what two people can build
                well. Founders keep their rate forever.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
