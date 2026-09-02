"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { T, P, Icon } from "./SightUI";

/**
 * Who's behind this: founder proof. Nearly no animation — the photo and
 * note fade in together as one movement. Trust sections shouldn't perform.
 */

// TODO: swap for a real photo of William (casual, warm, not corporate).
const FOUNDER_PHOTO = "/clover/cloverspace.webp";

export default function Founder() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={FOUNDER_PHOTO}
                alt="William, founder of Cloverfield"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[0.875rem] font-medium text-[var(--ink-faint)]">
                Who&apos;s behind this.
              </p>
              <p className="mt-5 max-w-[32rem] text-[1.15rem] leading-[1.65] text-[var(--ink)] md:text-[1.25rem]">
                I&apos;m William. I run Cloverfield, a Vancouver studio. I built
                Sight for my own company because I was sick of answers living in
                five tabs. Every demo on this page is literally how we run our
                business, daily.
              </p>

              <div
                className="sight-app mt-8 max-w-[420px] overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.06)]"
                style={{ borderColor: `${T.LINE}b3` }}
              >
                <div
                  className="flex items-center gap-1.5 border-b px-4 py-2.5"
                  style={{ borderColor: `${T.LINE}b3`, backgroundColor: T.SURFACE2 }}
                >
                  <span style={{ color: T.GREEN }}>
                    <Icon d={P.trendUp} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: T.MUTED }}>
                    What happened to a client&apos;s leads when we rebuilt their site
                  </span>
                </div>
                <div className="px-4 pb-4 pt-3.5">
                  <p
                    className="text-[1.5rem] font-semibold leading-none tracking-tight tabular-nums"
                    style={{ color: T.INK }}
                  >
                    5 a year <span aria-hidden="true">→</span> 10+ a month
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: T.MUTED }}>
                    Dealer leads for a manufacturing client, before and after.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[0.825rem] text-[var(--ink-faint)]">
                Product shown with sample data.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
