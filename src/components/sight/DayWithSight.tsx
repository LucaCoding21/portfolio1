"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import {
  T,
  P,
  AppPanel,
  Card,
  CardHeader,
  Kpi,
  AlertRow,
  AskBox,
  ConnectedBadge,
  StatusPill,
  Icon,
  Spark,
} from "./SightUI";
import { gsap, ScrollTrigger, useSightGsap, counterTween } from "./motion";

/**
 * "A day with Sight" — the section under the hero story. A big floating
 * intro line on the right, then a sticky left rail (three moments of the
 * owner's week) whose underlines fill with scroll progress while the right
 * column walks through three product scenes: each one an app window
 * floating over a full-bleed photo, cropped and zoomed differently so the
 * rhythm never repeats. Runs on the Summit Ridge demo profile so it
 * doesn't retread the Pacific Fasteners content used elsewhere.
 */

/* ---------- scene: a photo with app windows cropped over it ---------- */

function Scene({
  src,
  children,
  className = "",
}: {
  src: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative mt-8 h-[440px] overflow-hidden rounded-md shadow-[0_16px_40px_-18px_rgba(20,24,33,0.4)] md:mt-10 md:h-[600px] ${className}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 768px) 62vw, 100vw"
        className="object-cover"
      />
      {children}
    </div>
  );
}

/* ---------- scene 1: what Sight caught overnight ---------- */

/* Summit Ridge brand mark — round chip, initials, ember-orange ground. */
function SrMark() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
      style={{ backgroundColor: "#c2410c" }}
    >
      SR
    </span>
  );
}

/**
 * The numbers are demoted by content, not by crop: the window is clean and
 * whole, but the "Needs attention" card owns most of its area, its rows
 * carry found-at timestamps, and they animate in one by one. Every alert
 * states a deviation or an unhandled gap, never a total an owner would
 * shrug at ("I know that, Karen's on it").
 */
function MorningScene() {
  return (
    <Scene src="/sight/mountain.jpg">
      <div className="absolute left-[8%] right-[10%] top-[6%]">
        <div data-pop>
          <AppPanel>
          <div className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2.5">
              <SrMark />
              <span className="min-w-0">
                <span
                  className="block text-[14px] font-semibold leading-tight"
                  style={{ color: T.INK }}
                >
                  Good morning
                </span>
                <span
                  className="block truncate text-[11px]"
                  style={{ color: T.MUTED }}
                >
                  Summit Ridge Heating &amp; Air · Thursday, July 10
                </span>
              </span>
            </span>
            <span className="hidden shrink-0 sm:block">
              <ConnectedBadge text="synced 5 min ago · 2,318 records" />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi
              hero
              label="Revenue MTD"
              icon={P.trendUp}
              value="$168k"
              context="vs last year"
              delta="12%"
              deltaDir="up"
            />
            <Kpi
              label="Booked this week"
              icon={P.calendar}
              value="84%"
              context="of tech hours, Mon to Sat"
            />
            <Kpi
              tone="amber"
              label="Unsold estimates"
              icon={P.mail}
              value="$86,400"
              context="14 quotes waiting on a yes"
            />
            <Kpi
              tone="red"
              label="Tune-ups unbooked"
              icon={P.bell}
              value="8"
              context="Comfort Club members, already paid"
            />
          </div>

          <div className="mt-3">
            <Card>
              <CardHeader
                icon={P.alertTriangle}
                title="Needs attention"
                count="4"
                tone="amber"
                action={null}
              />
              <div className="flex flex-col gap-2 p-3">
                <div data-attn>
                  <AlertRow
                    tone="red"
                    title="8 members paid for tune-ups they never booked"
                    detail="Found 3:12am · membership list checked against the schedule"
                    category="Members"
                  />
                </div>
                <div data-attn>
                  <AlertRow
                    tone="amber"
                    title="A quote crossed 30 days, no follow-up logged"
                    detail="Found 3:14am · the Hendersons, $9,800, sent June 9"
                    category="Sales"
                  />
                </div>
                <div data-attn>
                  <AlertRow
                    tone="amber"
                    title="Callbacks are double your 12-month average"
                    detail="Found 3:15am · 5 this month against your usual 2"
                    category="Jobs"
                  />
                </div>
                <div data-attn>
                  <AlertRow
                    tone="blue"
                    title="Thursday afternoon has room for two crews"
                    detail="Found 3:15am · this week's jobs laid against tech hours"
                    category="Schedule"
                  />
                </div>
              </div>
            </Card>
          </div>
          </AppPanel>
        </div>
      </div>
    </Scene>
  );
}

/* ---------- scene 2: ask a question, zoomed in close ---------- */

const CALLBACK_ROWS = [
  {
    name: "Maple Ridge fourplex",
    note: "installed May 12",
    value: "3 callbacks",
    width: 100,
    hot: true,
  },
  {
    name: "Cedar Court duplex",
    note: "installed Apr 30",
    value: "1 callback",
    width: 33,
    hot: false,
  },
  {
    name: "Hillside Ave furnace",
    note: "service, June 18",
    value: "1 callback",
    width: 33,
    hot: false,
  },
];

function AskScene() {
  return (
    <Scene src="/sight/cloud1.jpg">
      {/* Zoomed composition: the window renders larger than the frame and
          crops off the right and bottom edges, like leaning into the screen. */}
      {/* data-pop sits inside the wrapper: GSAP animates scale, and the
          zoom's md:scale-[1.3] on the outer div must not be clobbered. */}
      <div className="absolute left-[4%] top-[8%] w-[92%] origin-top-left md:left-[9%] md:top-[11%] md:w-[70%] md:scale-[1.3]">
        <div data-pop>
          <AppPanel>
          <AskBox />

          <p
            className="mt-4 text-[15px] font-semibold tracking-tight"
            style={{ color: T.INK }}
          >
            Why are callbacks up?
          </p>
          <p
            className="mt-2 text-[13px] leading-relaxed"
            style={{ color: T.INK }}
          >
            Five callbacks this month, against your usual 2 or 3. Three
            trace back to the same May install:
          </p>

          <Card className="mt-3">
            <div
              className="flex items-center justify-between gap-3 border-b bg-[#fafbfc] px-4 py-2.5"
              style={{ borderColor: `${T.LINE}b3` }}
            >
              <span
                className="text-[11px] font-medium"
                style={{ color: T.MUTED }}
              >
                Callbacks · this month
              </span>
              <StatusPill tone="amber">2x average</StatusPill>
            </div>
            <div className="px-4 pb-4 pt-4">
              <div className="flex items-baseline gap-2.5">
                <p
                  className="text-[2.1rem] font-semibold leading-none tracking-tight tabular-nums"
                  style={{ color: T.INK }}
                >
                  <span data-count data-from={0} data-to={5} data-format="plain">
                    5
                  </span>
                </p>
                <p className="text-[12px]" style={{ color: T.MUTED }}>
                  against a 12-month average of 2.4
                </p>
              </div>

              <div className="mt-3">
                {CALLBACK_ROWS.map(({ name, note, value, width, hot }) => (
                  <div
                    key={name}
                    className="border-b py-3 last:border-b-0"
                    style={{ borderColor: `${T.LINE}80` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="truncate text-[13px] font-medium"
                          style={{ color: T.INK }}
                        >
                          {name}
                        </span>
                        <span
                          className="whitespace-nowrap text-[11px] tabular-nums"
                          style={{ color: T.MUTED }}
                        >
                          {note}
                        </span>
                      </span>
                      <span
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ color: T.INK }}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeeff2]">
                      <div
                        data-bar
                        className="h-full rounded-full"
                        style={{
                          width: `${width}%`,
                          backgroundColor: T.AMBER,
                          opacity: hot ? 1 : 0.45,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p
                className="mt-3 border-t pt-3 text-[11px]"
                style={{ borderColor: `${T.LINE}b3`, color: T.FAINT }}
              >
                Warranty visits matched to the original job and crew ·
                synced 5 min ago
              </p>
            </div>
          </Card>
          </AppPanel>
        </div>
      </div>
    </Scene>
  );
}

/* ---------- scene 3: the found money, with the Monday report behind it ---------- */

const WEEK_LINES: { tone: "green" | "blue" | "amber"; text: string }[] = [
  {
    tone: "green",
    text: "Revenue $42,300 last week, your best since March.",
  },
  {
    tone: "blue",
    text: "This week is 87% booked. Thursday still has room.",
  },
  {
    tone: "amber",
    text: "Talk to the crew about the Maple Ridge callbacks.",
  },
];

const WEEK_TONE_HEX = { green: T.GREEN, blue: T.BLUE, amber: T.AMBER } as const;

/* Each row is a join the owner would never run: offense, priced out. */
const FOUND_ROWS = [
  {
    icon: P.trendUp,
    tone: T.GREEN,
    title: "23 furnaces you installed, now 12+ years old",
    detail: "From your install history · winter replacement pipeline",
    value: "$90k+",
  },
  {
    icon: P.calendar,
    tone: T.BLUE,
    title: "11 open tech hours this Thursday",
    detail: "6 overdue tune-ups could fill them",
    value: "6 visits",
  },
  {
    icon: P.mail,
    tone: T.AMBER,
    title: "5 quotes past two weeks, untouched",
    detail: "No follow-up logged on any of them",
    value: "$44,700",
  },
];

/**
 * The Monday scene runs its own loop instead of a one-shot entrance:
 * the report card pops in whole, the found-money card slides up over it
 * a beat later, both hold, fade out together, and the cycle repeats.
 * Pauses off-screen; with prefers-reduced-motion both cards just show.
 */
function MondayScene() {
  const scope = useSightGsap<HTMLDivElement>((root, reduced) => {
    const report = root.querySelector("[data-loop-report]");
    const found = root.querySelector("[data-loop-found]");
    if (!report || !found || reduced) return;

    gsap.set([report, found], { autoAlpha: 0 });

    const tl = gsap.timeline({ repeat: -1, paused: true });
    tl.fromTo(
      report,
      { autoAlpha: 0, scale: 0.9, y: 16 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.6)" },
      0.2
    );
    tl.fromTo(
      found,
      { autoAlpha: 0, y: 56 },
      { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out" },
      1.7
    );
    tl.to({}, { duration: 3 });
    tl.to([report, found], {
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.inOut",
    });
    tl.to({}, { duration: 0.35 });

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    if (st.isActive) tl.play();
  });

  return (
    <div ref={scope}>
      <Scene src="/sight/12323.png">
        {/* The Monday report page, behind: the vessel, not the star. */}
        <div className="absolute left-[4%] top-[9%] w-[78%] md:left-[6%] md:w-[56%]">
          <div data-loop-report>
            <AppPanel>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span style={{ color: T.BLUE }}>
                <Icon d={P.mail} className="h-4 w-4" />
              </span>
              <span
                className="text-[13px] font-semibold"
                style={{ color: T.INK }}
              >
                Monday report
              </span>
            </span>
            <span className="text-[11px]" style={{ color: T.MUTED }}>
              Sent 7:02am
            </span>
          </div>

          <p
            className="mt-4 text-[13px] leading-relaxed"
            style={{ color: T.INK }}
          >
            Good morning. Last week in one page:
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {WEEK_LINES.map(({ tone, text }) => (
              <p key={text} className="flex items-start gap-2.5">
                <span
                  className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: WEEK_TONE_HEX[tone] }}
                />
                <span
                  className="text-[13px] leading-relaxed"
                  style={{ color: T.INK }}
                >
                  {text}
                </span>
              </p>
            ))}
          </div>
          </AppPanel>
        </div>
      </div>

      {/* The found money, overlapping in front: the star of the panel. */}
      <div className="absolute bottom-[-3%] right-[3%] w-[88%] md:right-[5%] md:w-[64%]">
        <div data-loop-found>
          <AppPanel pad={false} className="sight-app">
          <div
            className="flex items-center justify-between gap-3 border-b px-4 py-3"
            style={{ borderColor: `${T.LINE}b3` }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: T.BLUE }}>
                <Spark className="h-3.5 w-3.5" />
              </span>
              <span
                className="text-[13px] font-semibold"
                style={{ color: T.INK }}
              >
                Found this week
              </span>
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums"
              style={{ backgroundColor: T.WELL, color: T.MUTED }}
            >
              3
            </span>
          </div>
          {FOUND_ROWS.map(({ icon, tone, title, detail, value }) => (
            <div
              key={title}
              className="flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0"
              style={{ borderColor: `${T.LINE}80` }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${tone}14`, color: tone }}
              >
                <Icon d={icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block truncate text-[13px] font-medium"
                  style={{ color: T.INK }}
                >
                  {title}
                </span>
                <span
                  className="mt-0.5 block truncate text-[11px]"
                  style={{ color: T.MUTED }}
                >
                  {detail}
                </span>
              </span>
              <span
                className="shrink-0 text-[13px] font-semibold tabular-nums"
                style={{ color: T.INK }}
              >
                {value}
              </span>
            </div>
          ))}
          </AppPanel>
        </div>
      </div>
      </Scene>
    </div>
  );
}

/* ---------- the three moments ---------- */

const MOMENTS: {
  rail: string;
  heading: string;
  body: React.ReactNode;
  scene: React.ReactNode;
}[] = [
  {
    rail: "Every morning",
    heading: "The morning check, already done.",
    body: "Open Sight with your coffee and the morning is a glance. The checking happened overnight: every system against every other one, and only what needs you gets flagged.",
    scene: <MorningScene />,
  },
  {
    rail: "Any question",
    heading: "Then you've got a follow-up question.",
    body: (
      <>
        One morning flag nags at you:{" "}
        <span className="sight-shimmer-blue font-medium">
          callbacks are up
        </span>
        .
        <br />
        Why? That question used to mean a week of asking around. Ask it
        the way you&apos;d say it, get the answer in seconds, and see
        exactly where it came from.
      </>
    ),
    scene: <AskScene />,
  },
  {
    rail: "More money?",
    heading: "Automatically uncover hidden opportunities.",
    body: "While you run the business, Sight digs through your own history for the money you'd never have time to find: old installs coming due, idle hours next to overdue tune-ups, quotes going cold. It all lands in Monday's report.",
    scene: <MondayScene />,
  },
];

export default function DayWithSight() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const moments = gsap.utils.toArray<HTMLElement>("[data-moment]", root);
    const labels = gsap.utils.toArray<HTMLElement>("[data-rail-label]", root);
    const fills = gsap.utils.toArray<HTMLElement>("[data-rail-fill]", root);

    moments.forEach((moment, i) => {
      // The rail is a scroll position indicator: the active moment's label
      // darkens and its underline fills with progress through that panel.
      ScrollTrigger.create({
        trigger: moment,
        start: "top 55%",
        end: "bottom 55%",
        onUpdate: (self) => {
          if (fills[i]) gsap.set(fills[i], { scaleX: self.progress });
        },
        onToggle: (self) => {
          labels[i]?.style.setProperty(
            "color",
            self.isActive ? "var(--ink)" : "var(--ink-faint)"
          );
        },
      });

      // Scene choreography: the app windows pop onto the photo first
      // (slight overshoot), then rows land one by one, then counters run
      // and bars draw. The morning scene deliberately has no counters:
      // the discovery theater belongs to the alerts, not the money.
      if (reduced) return;
      const counts = moment.querySelectorAll<HTMLElement>("[data-count]");
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", moment);
      const pops = gsap.utils.toArray<HTMLElement>("[data-pop]", moment);
      const items = gsap.utils.toArray<HTMLElement>("[data-attn]", moment);
      if (!counts.length && !bars.length && !pops.length && !items.length)
        return;
      gsap.set(bars, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(pops, { autoAlpha: 0, y: 26, scale: 0.95 });
      gsap.set(items, { autoAlpha: 0, y: 10 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: moment, start: "top 65%", once: true },
      });
      tl.to(
        pops,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
          stagger: 0.16,
        },
        0
      );
      counts.forEach((el) => tl.add(counterTween(el), 0.35));
      tl.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.1,
        },
        0.3
      );
      tl.to(
        bars,
        { scaleX: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
        0.45
      );
    });
  });

  const jumpTo = (i: number) => {
    const moment =
      scope.current?.querySelectorAll<HTMLElement>("[data-moment]")[i];
    moment?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={scope} className="relative">
      <p className="sr-only">
        Sight fits the way an owner already works: a morning check-in with
        the numbers cross-checked, plain-English answers the moment a
        question comes up, and money it digs up on its own, delivered in
        the Monday report.
      </p>

      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* The floating intro line, big and alone on the right */}
        <div className="flex min-h-[46vh] items-center justify-end pb-32 pt-48 md:pb-[22vh] md:pt-[36vh]">
          <Reveal className="md:mr-[2%] md:w-[58%]">
            <h2
              className="max-w-[40rem] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
              style={{ fontSize: "clamp(2.1rem, 3.7vw, 3.2rem)" }}
            >
              Running the business is a full-time job. Checking on it
              shouldn&apos;t be.
            </h2>
          </Reveal>
        </div>

        {/* Bottom spacing lives on the grid, not the panels column: the
            sticky rail is contained by its column, so the column must end
            exactly where the last photo ends for the rail to release and
            scroll off with it. */}
        <div className="pb-16 md:grid md:grid-cols-[200px_1fr] md:gap-x-24 md:pb-28 lg:gap-x-44">
          {/* Sticky rail */}
          <div className="hidden md:block">
            <div className="sticky top-32 flex flex-col gap-6 lg:-ml-16">
              {MOMENTS.map(({ rail }, i) => (
                <button
                  key={rail}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="group block text-left"
                >
                  <span
                    data-rail-label
                    className="block text-[0.8rem] transition-colors duration-300 group-hover:text-[var(--ink-soft)]"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {rail}
                  </span>
                  <span className="relative mt-2.5 block h-px bg-[var(--line)]">
                    <span
                      data-rail-fill
                      aria-hidden="true"
                      className="absolute -top-px left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--ink)]"
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* The three scenes */}
          <div>
            {MOMENTS.map(({ rail, heading, body, scene }) => (
              <article
                key={rail}
                data-moment
                className="scroll-mt-28 py-12 last:pb-0 md:scroll-mt-32 md:py-0 md:pb-48 md:last:pb-0"
              >
                <Reveal selector="[data-reveal]">
                  <p
                    data-reveal
                    className="text-[0.85rem] font-medium text-[var(--blue)] md:hidden"
                  >
                    {rail}
                  </p>
                  <h3
                    data-reveal
                    className="mt-3 text-[1.5rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--ink)] md:mt-0 md:text-[1.75rem]"
                  >
                    {heading}
                  </h3>
                  <p
                    data-reveal
                    className="mt-4 max-w-[34rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
                  >
                    {body}
                  </p>
                </Reveal>
                <Reveal>{scene}</Reveal>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
