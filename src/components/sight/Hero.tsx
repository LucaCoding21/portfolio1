"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import Pill from "./Pill";
import SightAppCard from "./SightAppCard";
import { gsap, ScrollTrigger, useSightGsap } from "./motion";
import { BOOK_URL } from "./constants";

/**
 * Hero + the pinned story section under it, as one scroll piece:
 * copy on the left, the live app card on the right with two branding
 * photos peeking out behind it. A short scrubbed scroll tucks the photos
 * behind the card, then the card holds sticky while the left rail steps
 * through the feature story. When the story ends the card releases and
 * the page scrolls on into "Sound familiar".
 */

/* ---------- step icons (inline, lucide-style, strokeWidth 1.75) ---------- */

function StepIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[26px] w-[26px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/* ---------- inline flipping tool blanks (fill the blanks in step 1) ---------- */

/**
 * Three blanks, seven rotations. Each STACKS row is one plausible real
 * business (money + ops/CRM + marketing/channel), so every frame of the
 * loop looks like somebody's actual toolset. Marks may repeat across rows,
 * but never in consecutive rows of the same column (the wrap from the last
 * row back to the first counts too) — a back-to-back repeat makes that
 * blank look stuck for a beat. Competing field-service tools (Jobber,
 * ServiceTitan, Housecall Pro) get at most one per stack.
 * Marks are trimmed brand wordmarks (w/h are the files' intrinsic sizes,
 * rendered at a fixed height). Spare in /public/sight/logos: otter.png
 * (167x64).
 */
/** `scale` is an optical-size tweak: squat or busy marks read smaller/larger
 *  than wordmarks at the same pixel height, so nudge them up or down. */
type LogoMark = { name: string; src: string; w: number; h: number; scale?: number };

const M = {
  quickbooks: { name: "QuickBooks", src: "/sight/logos/quickbooks.png", w: 250, h: 64 },
  xero: { name: "Xero", src: "/sight/logos/xero.png", w: 236, h: 64, scale: 0.9 },
  stripe: { name: "Stripe", src: "/sight/logos/stripe.png", w: 154, h: 64 },
  netsuite: { name: "NetSuite", src: "/sight/logos/netsuite.png", w: 256, h: 64 },
  excel: { name: "Excel", src: "/sight/logos/excel.png", w: 177, h: 64 },
  jobber: { name: "Jobber", src: "/sight/logos/jobber.png", w: 375, h: 64 },
  servicetitan: { name: "ServiceTitan", src: "/sight/logos/servicetitan.png", w: 371, h: 64 },
  housecallpro: { name: "Housecall Pro", src: "/sight/logos/housecall-pro.png", w: 454, h: 64, scale: 0.9 },
  monday: { name: "Monday", src: "/sight/logos/monday.png", w: 406, h: 64 },
  sheets: { name: "Google Sheets", src: "/sight/logos/sheets.png", w: 373, h: 64 },
  salesforce: { name: "Salesforce", src: "/sight/logos/salesforce.png", w: 92, h: 64, scale: 1.4 },
  hubspot: { name: "HubSpot", src: "/sight/logos/hubspot.png", w: 226, h: 64 },
  gcal: { name: "Google Calendar", src: "/sight/logos/google-calendar.png", w: 162, h: 64, scale: 1.25 },
  mailchimp: { name: "Mailchimp", src: "/sight/logos/mailchimp.png", w: 236, h: 64, scale: 1.2 },
  semrush: { name: "Semrush", src: "/sight/logos/semrush.png", w: 480, h: 64, scale: 0.9 },
  ahrefs: { name: "Ahrefs", src: "/sight/logos/ahrefs.png", w: 226, h: 64 },
  shopify: { name: "Shopify", src: "/sight/logos/shopify.png", w: 224, h: 64 },
} satisfies Record<string, LogoMark>;

const STACKS: LogoMark[][] = [
  [M.quickbooks, M.jobber, M.gcal], // small home services
  [M.xero, M.monday, M.mailchimp], // agency
  [M.stripe, M.sheets, M.semrush], // SaaS / startup
  [M.quickbooks, M.servicetitan, M.mailchimp], // established HVAC / plumbing
  [M.netsuite, M.salesforce, M.ahrefs], // enterprise B2B
  [M.xero, M.housecallpro, M.gcal], // cleaning company
  [M.excel, M.hubspot, M.shopify], // small e-commerce
];

/** Transposed for rendering: one array per blank, one mark per rotation. */
const LOGO_SLOTS: LogoMark[][] = STACKS[0].map((_, c) =>
  STACKS.map((row) => row[c])
);

/** Base display height of every wordmark; blank widths derive from it. */
const LOGO_H = 17;
const markH = (m: LogoMark) => LOGO_H * (m.scale ?? 1);
const markW = (m: LogoMark) => (markH(m) * m.w) / m.h;
const slotW = (slot: LogoMark[]) => Math.ceil(Math.max(...slot.map(markW)));

/**
 * Three fill-in-the-blank slots sitting mid-sentence, flipping together in
 * a quick left-to-right wave. Each blank holds a fixed width (its widest
 * wordmark, computed from the files' intrinsic sizes, never measured from
 * the DOM: lazy-loaded images report width 0 until they load) so the
 * sentence never reflows while the marks swap. Holds the first stack with
 * prefers-reduced-motion; pauses off-screen.
 */
function InlineLogoBlanks() {
  const scope = useSightGsap<HTMLSpanElement>((root, reduced) => {
    const rows = gsap.utils
      .toArray<HTMLElement>("[data-slot]", root)
      .map((slot) => gsap.utils.toArray<HTMLElement>("[data-logo]", slot));
    if (!rows.length || !rows[0].length) return;

    rows.forEach((row) => gsap.set(row.slice(1), { autoAlpha: 0 }));

    const states = rows[0].length;
    if (reduced || states < 2) return;

    const HOLD = 1.6;
    const SWAP = 0.35;
    const WAVE = 0.08; // per-blank offset; 0 for strict unison
    const tl = gsap.timeline({ repeat: -1, paused: true });
    for (let i = 0; i < states; i++) {
      const at = i * (HOLD + SWAP) + HOLD;
      rows.forEach((row, s) => {
        const cur = row[i];
        const next = row[(i + 1) % states];
        tl.to(
          cur,
          { autoAlpha: 0, y: -10, duration: SWAP, ease: "power2.in" },
          at + s * WAVE
        );
        // set + to instead of fromTo: on each repeat wrap the playhead jumps
        // back over every tween, and fromTo re-renders its explicit `from`
        // values (autoAlpha 0) on all marks — blanking every slot for the
        // whole first hold of each cycle.
        tl.set(next, { autoAlpha: 0, y: 10 }, at + s * WAVE + SWAP * 0.45);
        tl.to(
          next,
          { autoAlpha: 1, y: 0, duration: SWAP, ease: "power3.out" },
          at + s * WAVE + SWAP * 0.45
        );
      });
    }

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    if (st.isActive) tl.play();
  });

  return (
    <>
      <span className="sr-only">
        QuickBooks, Xero, Stripe, NetSuite, Excel, Jobber, ServiceTitan,
        Housecall Pro, Monday, Google Sheets, Salesforce, HubSpot, Google
        Calendar, Mailchimp, Semrush, Ahrefs, Shopify and more.
      </span>
      <span ref={scope} aria-hidden="true">
        {/* The closing "and more." lives here, nowrap-glued to the last
            blank, so it can never drop to its own line. */}
        {LOGO_SLOTS.map((slot, s) => {
          const last = s === LOGO_SLOTS.length - 1;
          return (
            <span
              key={slot[0].name}
              className={last ? "whitespace-nowrap" : undefined}
            >
              {s > 0 && " "}
              <span
                data-slot
                style={{ width: slotW(slot) }}
                className="relative inline-flex h-[1.55em] overflow-hidden border-b border-[var(--line)] align-bottom"
              >
                {slot.map((mark, i) => (
                  <span
                    key={`${mark.name}-${i}`}
                    data-logo
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={mark.src}
                      alt=""
                      width={mark.w}
                      height={mark.h}
                      loading="eager"
                      style={{ width: markW(mark), height: markH(mark) }}
                      className="shrink-0"
                    />
                  </span>
                ))}
              </span>
              {last ? <span className="pl-1.5">and more.</span> : ","}
            </span>
          );
        })}
      </span>
    </>
  );
}

/* ---------- the three story steps, one sentence each ---------- */

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-[var(--ink)]">{children}</span>;
}

const STORY_STEPS: { icon: string; body: React.ReactNode; wide?: boolean }[] = [
  {
    // hub and spoke: many tools feeding one place
    icon: "M12 9.5V6 M9.8 13.3l-3 1.7 M14.2 13.3l3 1.7 M14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0 M14 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M7.1 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20.9 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
    // "and more." is rendered inside InlineLogoBlanks, glued to the last
    // blank. `wide` lets the whole sentence sit on one line on desktop.
    wide: true,
    body: (
      <>
        <Strong>Connects</Strong> <InlineLogoBlanks />
      </>
    ),
  },
  {
    // two counter-rotating arrows: the continuous re-checking
    icon: "M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5",
    body: (
      <>
        <Strong>Cross-checks every number:</Strong> quotes against bookings,
        invoices against payments, members against the schedule.
      </>
    ),
  },
  {
    // flag: echoes the "Flags what needs you" copy
    icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z M4 22v-7",
    body: (
      <>
        <Strong>Flags what needs you:</Strong> overdue invoices, quiet
        customers, orders running late.
      </>
    ),
  },
];

export default function Hero() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    if (reduced) return;
    const left = root.querySelector("[data-tuck-left]");
    const right = root.querySelector("[data-tuck-right]");
    const bottom = root.querySelector("[data-tuck-bottom]");
    const drift = root.querySelector("[data-hero-drift]");
    if (!left || !right) return;

    // The whole trio (card + both photos) drifts slightly down-left with
    // the scroll. Lives on the shared wrapper so it never touches the
    // tuck timeline below.
    if (drift) {
      gsap.fromTo(
        drift,
        { x: 0, y: 0 },
        {
          x: -34,
          y: 52,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=110%",
            scrub: true,
          },
        }
      );
    }

    // The branding panels get pulled inward, shrinking and sliding behind
    // the card until it has swallowed them. Snappy, over a short scroll.
    // data-tuck-left sits on the LEFT of the card → slides right into it.
    // data-tuck-right sits on the RIGHT of the card → slides left into it.
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=110%",
        scrub: true,
      },
    });
    // The scrub spans the hero viewport plus the transition into the story
    // section (~110vh). Slow creep for ~90% of the hero, then the faster
    // tuck lands in the middle of the section handoff.
    tl.fromTo(
      left,
      { xPercent: 0, scale: 1, transformOrigin: "right center" },
      { xPercent: 10, scale: 0.985, duration: 0.44, ease: "none" },
      0
    )
      .to(left, { xPercent: 96, scale: 0.62, duration: 0.21, ease: "none" }, 0.44)
      .fromTo(
        right,
        { xPercent: 0, transformOrigin: "right center" },
        { xPercent: -10, duration: 0.44, ease: "none" },
        0
      )
      .to(right, { xPercent: -96, duration: 0.21, ease: "none" }, 0.44)
      // The big photo is wide enough to poke out past the card's left edge
      // mid-tuck, so its shrink runs ahead of its slide and anchors to its
      // right edge, pulling the far side in under the card.
      .fromTo(right, { scale: 1 }, { scale: 0.985, duration: 0.44, ease: "none" }, 0)
      .to(right, { scale: 0.62, duration: 0.15, ease: "none" }, 0.44)
      .to(left, { autoAlpha: 0, duration: 0.06 }, 0.63)
      .to(right, { autoAlpha: 0, duration: 0.06 }, 0.63);

    // Bottom panel slides UP into the card, same creep-then-tuck rhythm.
    if (bottom) {
      tl.fromTo(
        bottom,
        { yPercent: 0, scale: 1, transformOrigin: "center top" },
        { yPercent: -10, scale: 0.985, duration: 0.44, ease: "none" },
        0
      )
        .to(bottom, { yPercent: -96, scale: 0.62, duration: 0.21, ease: "none" }, 0.44)
        .to(bottom, { autoAlpha: 0, duration: 0.06 }, 0.63);
    }
  });

  return (
    <section id="top" ref={scope} className="relative overflow-x-clip">
      <p className="sr-only">
        Product demo: Sight shows your whole business on one screen and
        answers questions like “Who owes us money past 45 days?” with live
        numbers from your own systems, in seconds.
      </p>

      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="md:grid md:grid-cols-[1.2fr_1fr] md:gap-x-14 lg:gap-x-20">
          {/* Hero copy — first viewport, left */}
          <div className="flex flex-col justify-center pt-32 md:col-start-1 md:row-start-1 md:min-h-screen md:pt-0 md:-ml-16 lg:-ml-28">
            <Reveal selector="[data-reveal]">
              <h1
                data-reveal
                className="font-medium leading-[1.1] tracking-[-0.02em] text-[var(--ink)]"
                style={{ fontSize: "clamp(2.15rem, 3.2vw, 3.05rem)" }}
              >
                Ask your business anything.
                <br />
                Get the answer in 5 seconds.
              </h1>

              <p
                data-reveal
                className="mt-6 max-w-[30rem] text-[1rem] leading-[1.6] text-[var(--ink-soft)] md:text-[1.0625rem]"
              >
                Who owes me money right now? How much cash is stuck in
                inventory?{" "}
                <span className="font-medium text-[var(--blue)]">Sight</span>{" "}
                connects the tools you already use and just answers.
              </p>

              <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
                <Pill href={BOOK_URL} variant="primary">
                  Book a demo
                </Pill>
              </div>

              <p data-reveal className="mt-5 text-[0.875rem] text-[var(--ink-faint)]">
                Built by Cloverfield · Live in 45 days or you don&apos;t pay
              </p>
            </Reveal>
          </div>

          {/* The app card — sticky through the whole story */}
          <div className="mt-14 md:col-start-2 md:row-start-1 md:row-span-2 md:mt-0">
            <div className="flex items-center justify-center md:sticky md:top-0 md:h-screen md:justify-end md:-mr-[8%] md:pt-[24vh]">
              <div data-hero-drift className="relative w-full max-w-[484px]">
                {/* Branding panels, tucked away on scroll */}
                <div
                  data-tuck-bottom
                  className="absolute -bottom-[11rem] left-[32px] z-0 hidden h-[300px] w-[420px] overflow-hidden rounded-md shadow-[0_16px_40px_-18px_rgba(20,24,33,0.4)] md:block"
                >
                  <Image
                    src="/sight/12323.png"
                    alt=""
                    fill
                    sizes="420px"
                    className="object-cover -scale-y-100"
                    priority
                  />
                </div>
                <div
                  data-tuck-right
                  className="absolute -right-[8.5rem] -top-[7%] z-0 hidden h-[106%] w-[332px] overflow-hidden rounded-md shadow-[0_16px_40px_-18px_rgba(20,24,33,0.4)] md:block"
                >
                  <Image
                    src="/sight/mountain.jpg"
                    alt=""
                    fill
                    sizes="332px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div
                  data-tuck-left
                  className="absolute -left-20 -bottom-[6%] z-0 hidden h-[94%] w-[288px] overflow-hidden rounded-md shadow-[0_16px_40px_-18px_rgba(20,24,33,0.4)] md:block"
                >
                  <Image
                    src="/sight/cloud1.jpg"
                    alt=""
                    fill
                    sizes="288px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="relative z-10">
                  <SightAppCard />
                </div>
              </div>
            </div>
          </div>

          {/* Story — one screen next to the pinned card */}
          <div className="pb-24 pt-24 md:col-start-1 md:row-start-2 md:-ml-16 md:flex md:min-h-screen md:flex-col md:justify-center md:translate-y-[10vh] md:pb-[8vh] md:pt-0 lg:-ml-28">
            <Reveal>
              <h2
                className="font-medium leading-[1.15] tracking-[-0.02em] text-[var(--ink)]"
                style={{ fontSize: "clamp(1.9rem, 2.8vw, 2.6rem)" }}
              >
                Turn the tools you already use into answers.
              </h2>
            </Reveal>

            <Reveal selector="[data-reveal]" className="mt-10 md:mt-12">
              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {STORY_STEPS.map(({ icon, body, wide }) => (
                  <div key={icon} data-reveal className="flex items-center gap-5 py-7">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--blue)]">
                      <StepIcon d={icon} />
                    </span>
                    <p
                      className={`${wide ? "max-w-[32rem]" : "max-w-[26rem]"} text-[1.05rem] leading-[1.55] text-[var(--ink-soft)]`}
                    >
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
