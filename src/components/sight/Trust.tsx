"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { counterTween, gsap, ScrollTrigger, useSightGsap } from "./motion";

/**
 * Trust: the answer to "who are these people, and would I hand them my
 * books?" Left: the claim and who built it. Right: a
 * landscape with the founders' photo floating over it; on scroll the
 * landscape settles out of a zoom while the card un-tucks from its edge,
 * then both drift so the stack reads as depth. Below: the studio's real
 * client marks.
 */

const LOGOS = [
  { name: "Innovative Aluminum Systems", src: "/ias-newgold.svg", h: "h-14" },
  { name: "Real Estate Institute of BC", src: "/transforming/reibc-logo.png", h: "h-12" },
  { name: "Greater Vancouver REALTORS", src: "/transforming/gvr-logo.png", h: "h-14" },
  { name: "Ondek", src: "/sight/clients/ondek.png", h: "h-14" },
  { name: "Transforming Landscapes", src: "/transforming-landscapes.svg", h: "h-14" },
  { name: "Northwest Railing", src: "/sight/clients/northwest-railing.png", h: "h-20" },
  { name: "Venues Quarterly", src: "/sight/clients/venues-quarterly.png", h: "h-11", white: true },
  { name: "Caddie Companion", src: "/sight/clients/caddie-companion.png", h: "h-12" },
  { name: "WrapCity", src: "/sight/clients/wrapcity.png", h: "h-12" },
  { name: "League1v1", src: "/sight/clients/league1v1.webp", h: "h-16" },
  { name: "Real Estate 360", src: "/sight/clients/real-estate-360-v2.webp", h: "h-14" },
  { name: "Venue Series", src: "/sight/clients/venue-series-2.png", h: "h-16" },
];

/** Two rows: the first drifts left, the second drifts right. */
const ROWS = [LOGOS.slice(0, 6), LOGOS.slice(6)];

function LogoRow({ logos, hidden }: { logos: typeof LOGOS; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex items-center">
      {/* Doubled so a short row still fills wide screens before it loops. */}
      {[...logos, ...logos].map(({ name, src, h, white }, i) => (
        <li
          key={`${name}-${i}`}
          className="flex shrink-0 items-center px-10 md:px-12"
        >
          <Image
            src={src}
            alt={hidden ? "" : name}
            width={240}
            height={80}
            className={`sight-logo ${h} w-auto object-contain ${white ? "brightness-0" : ""}`}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Trust() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    // The project count ticks 0 -> 30+ once the copy is in view. Runs
    // under reduced motion too; a number appearing is not motion.
    const count = root.querySelector<HTMLElement>("[data-count]");
    if (count) {
      const tween = counterTween(count, 1.4).pause();
      ScrollTrigger.create({
        trigger: count,
        start: "top 85%",
        once: true,
        onEnter: () => tween.play(),
      });
    }

    if (reduced) return;
    const bg = root.querySelector("[data-layer-bg]");
    const photo = root.querySelector("[data-layer-photo]");
    if (!bg || !photo) return;

    // Scrubbed over the section's whole pass through the viewport. The
    // first 40% is the "settle": the landscape eases out of a slight zoom
    // and the founder card un-tucks from under its edge, the inverse of
    // the hero's tuck. The rest is a slow drift so the stack keeps
    // breathing while the text is read.
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.fromTo(
      bg,
      { scale: 1.08, yPercent: 5, transformOrigin: "center center" },
      { scale: 1, yPercent: 0, duration: 0.4 },
      0
    )
      .to(bg, { yPercent: -5, duration: 0.6 }, 0.4)
      .fromTo(
        photo,
        { xPercent: 42, yPercent: 14, scale: 0.84, transformOrigin: "right bottom" },
        { xPercent: 0, yPercent: 0, scale: 1, duration: 0.4 },
        0
      )
      .to(photo, { yPercent: -10, duration: 0.6 }, 0.4);
  });

  return (
    <section
      ref={scope}
      id="trust"
      className="scroll-mt-24 pb-28 pt-4 md:pb-40 md:pt-6"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Claim */}
          <Reveal selector="[data-reveal]">
            <h2
              data-reveal
              className="font-medium leading-[1.06] tracking-[-0.025em] text-[var(--ink)]"
              style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.9rem)" }}
            >
              Built after seeing the same mess, up close
            </h2>
            <p
              data-reveal
              className="mt-7 max-w-[34rem] text-[1.1rem] leading-[1.6] text-[var(--ink-soft)]"
            >
              Sight is built by Cloverfield, a Vancouver studio with{" "}
              <span
                data-count
                data-from="0"
                data-to="30"
                data-format="plus"
                className="tabular-nums text-[var(--ink)]"
              >
                30+
              </span>{" "}
              projects shipped for real businesses. Same team, same standard,
              now pointed at your numbers.
            </p>
          </Reveal>

          {/* Stack */}
          <Reveal className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <div className="relative aspect-[1.06] w-full">
              <div
                data-layer-bg
                className="absolute inset-y-0 right-0 w-[84%] overflow-hidden rounded-md bg-[var(--surface)]"
              >
                <Image
                  src="/sight/cloud-trees.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover object-[50%_45%]"
                />
              </div>

              <div
                data-layer-photo
                className="absolute bottom-[8%] left-0 aspect-[1086/1014] w-[50%] overflow-hidden rounded-md bg-[var(--surface)] shadow-[0_24px_60px_-20px_rgba(32,33,36,0.45)]"
              >
                <Image
                  src="/sight/founders-crop.webp"
                  alt="William and Irish, founder and co-founder of Cloverfield"
                  fill
                  sizes="(min-width: 1024px) 320px, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[28%]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0))",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <p className="text-[1.15rem] font-medium leading-tight md:text-[1.3rem]">
                    William &amp; Irish
                  </p>
                  <p className="mt-1 text-[0.8rem] text-white/85 md:text-[0.875rem]">
                    Founder and Co-founder, Cloverfield
                  </p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </div>

      {/* Client marks */}
      <Reveal className="mt-14 md:mt-16">
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-6 md:px-12">
          <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
          <p className="shrink-0 text-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--ink-faint)]">
            Companies Cloverfield has built for
          </p>
          <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        </div>
        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:gap-8">
          {ROWS.map((logos, i) => (
            <div key={i} className="sight-marquee-band overflow-hidden py-2">
              <div
                className="sight-marquee flex w-max"
                data-reverse={i % 2 === 1 ? "" : undefined}
                style={
                  { "--marquee-seconds": i % 2 === 1 ? "110s" : "95s" } as React.CSSProperties
                }
              >
                <LogoRow logos={logos} />
                <LogoRow logos={logos} hidden />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
