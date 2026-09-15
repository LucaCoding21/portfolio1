"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import Cinematic, { Words } from "./Cinematic";
import { T, P, AppPanel, Icon, Spark } from "./SightUI";
import { gsap, useSightGsap } from "./motion";

/**
 * "Notices what you'd catch, if you had the time": the section after the
 * questions wall. Asking is half of it; this is the other half, the small
 * things that slip while the owner is busy running the place. Sight keeps
 * an eye on them and flags each one the week it happens.
 * Three cards side by side: what it catches, what it finds, then how it
 * reaches you (the Monday page is the roundup, not the only time it
 * speaks up; flags land whenever they happen). Each card is one small
 * product window centred on a full-bleed photo, then the moment as a
 * title and one line of copy underneath (a label sitting on the photo
 * itself went unread).
 * Each window holds three lines and nothing else. The calm is the point:
 * an owner should be able to read a card in the time it takes to scroll
 * past it. No sticky rail, no scroll lock.
 * Runs on the Summit Ridge demo profile so it doesn't retread the Pacific
 * Fasteners content used elsewhere.
 */

/* ---------- shared window chrome ---------- */

function WindowHeader({
  icon,
  title,
  count,
  aside,
  tone = T.BLUE,
}: {
  icon: React.ReactNode;
  title: string;
  /** a small count right after the title, like CardHeader's */
  count?: React.ReactNode;
  aside?: React.ReactNode;
  tone?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-4 py-3"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      <span className="flex items-center gap-2">
        <span style={{ color: tone }}>{icon}</span>
        <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
          {title}
        </span>
        {count}
      </span>
      {aside}
    </div>
  );
}

function Count({ n }: { n: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums"
      style={{ backgroundColor: T.WELL, color: T.MUTED }}
    >
      {n}
    </span>
  );
}

/* ---------- card 1: what Sight caught overnight ---------- */

/**
 * Every line is a deviation or an unhandled gap, never a total an owner
 * would shrug at. The meta line says how early it was caught: days, not
 * the months it would normally take to notice.
 */
const OVERNIGHT: { tone: string; title: string; when: string }[] = [
  { tone: T.RED, title: "8 members paid for tune-ups, never booked", when: "9 days in" },
  { tone: T.AMBER, title: "The Hendersons' $9,800 quote, no follow-up", when: "sent 11 days ago" },
  { tone: T.AMBER, title: "Callbacks are double your average", when: "since last Tuesday" },
];

function OvernightWindow() {
  return (
    <AppPanel pad={false} shadow="soft">
      <WindowHeader
        icon={<Icon d={P.alertTriangle} className="h-4 w-4" />}
        tone={T.AMBER}
        title="Needs attention"
        aside={<Count n="3" />}
      />
      {OVERNIGHT.map(({ tone, title, when }) => (
        <div
          key={title}
          data-row
          className="flex items-start gap-3 border-b px-4 py-3.5 last:border-b-0"
          style={{ borderColor: `${T.LINE}80` }}
        >
          <span
            className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: tone }}
          />
          <span className="min-w-0">
            <span className="block text-[14px] font-medium leading-snug" style={{ color: T.INK }}>
              {title}
            </span>
            <span className="mt-1 block text-[11px] tabular-nums" style={{ color: T.MUTED }}>
              {when}
            </span>
          </span>
        </div>
      ))}
    </AppPanel>
  );
}

/* ---------- card 2: the Monday report, in the inbox ---------- */

const WEEK: { tone: string; text: string }[] = [
  { tone: T.GREEN, text: "Best week since March: $42,300." },
  { tone: T.BLUE, text: "Thursday still has room for two crews." },
  { tone: T.AMBER, text: "Talk to the Maple Ridge crew about callbacks." },
];

function MondayWindow() {
  return (
    <AppPanel pad={false} shadow="soft">
      <WindowHeader
        icon={<Icon d={P.mail} className="h-4 w-4" />}
        title="Monday report"
        aside={
          <span className="text-[11px] tabular-nums" style={{ color: T.MUTED }}>
            7:02am
          </span>
        }
      />
      <div className="px-4 pb-4 pt-3.5">
        <p className="text-[14px]" style={{ color: T.INK }}>
          Good morning, Dave.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {WEEK.map(({ tone, text }) => (
            <p key={text} data-row className="flex items-start gap-2.5">
              <span
                className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: tone }}
              />
              <span className="text-[14px] leading-snug" style={{ color: T.INK }}>
                {text}
              </span>
            </p>
          ))}
        </div>
      </div>
    </AppPanel>
  );
}

/* ---------- card 3: the found money ---------- */

/* Each row is a join the owner would never run: offense, priced out. */
const FOUND: { icon: string; tone: string; title: string; value: string }[] = [
  { icon: P.trendUp, tone: T.GREEN, title: "23 furnaces, 12+ years old", value: "$90k+" },
  { icon: P.refresh, tone: T.AMBER, title: "9 members still on the old rate", value: "$4,300/yr" },
  { icon: P.calendar, tone: T.BLUE, title: "11 open hours on Thursday", value: "6 visits" },
];

function FoundWindow() {
  return (
    <AppPanel pad={false} shadow="soft">
      <WindowHeader
        icon={<Spark className="h-3.5 w-3.5" />}
        title="Found this week"
        aside={<Count n="3" />}
      />
      {FOUND.map(({ icon, tone, title, value }) => (
        <div
          key={title}
          data-row
          className="flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0"
          style={{ borderColor: `${T.LINE}80` }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${tone}14`, color: tone }}
          >
            <Icon d={icon} className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium" style={{ color: T.INK }}>
            {title}
          </span>
          <span className="shrink-0 text-[14px] font-semibold tabular-nums" style={{ color: T.INK }}>
            {value}
          </span>
        </div>
      ))}
    </AppPanel>
  );
}

/* ---------- the three moments ---------- */

const MOMENTS: {
  title: string;
  src: string;
  caption: string;
  window: React.ReactNode;
}[] = [
  {
    title: "Flagged while it's still small.",
    src: "/sight/abstract-teal-orange-film-texture.webp",
    caption:
      "A short list of what's slipped and how long each one has been going on.",
    window: <OvernightWindow />,
  },
  {
    title: "Money you didn't know was there.",
    src: "/sight/12323.png",
    caption:
      "It was sitting in your records the whole time, it just took someone to look.",
    window: <FoundWindow />,
  },
  {
    title: "It comes to you.",
    src: "/sight/weathered-blue-painted-wall.webp",
    caption:
      "Nothing to log into or check, it lands in your inbox when it matters.",
    window: <MondayWindow />,
  },
];

export default function ComesToYou() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    if (reduced) return;
    // Each card runs its own entrance once it's on screen: the window pops
    // onto the photo with a slight overshoot, then its rows land one by one.
    gsap.utils.toArray<HTMLElement>("[data-moment]", root).forEach((moment) => {
      const win = moment.querySelector("[data-window]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", moment);
      if (!win) return;
      gsap.set(win, { autoAlpha: 0, y: 26, scale: 0.95 });
      gsap.set(rows, { autoAlpha: 0, y: 10 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: moment, start: "top 72%", once: true },
      });
      tl.to(win, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.4)",
      });
      tl.to(
        rows,
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.09 },
        0.3
      );
    });
  });

  return (
    <section
      ref={scope}
      id="comes-to-you"
      className="scroll-mt-24 pb-28 pt-16 md:pb-40 md:pt-20"
    >
      <p className="sr-only">
        Sight keeps an eye on the small things that slip when you are busy,
        like a job never invoiced or a quote nobody followed up, and flags
        each one while it is still small. It finds money that was sitting in
        your own records the whole time, and it comes to you: anything worth
        knowing lands in your inbox, and on Monday you get the whole week on
        one page.
      </p>

      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Cinematic className="mx-auto max-w-[48rem] text-center">
          <Words
            className="font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
          >
            Notices what you&apos;d catch, if you had the time.
          </Words>
          <p
            data-blur
            className="mx-auto mt-5 max-w-[40rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]"
          >
            Small things slip when you&apos;re busy, like a job that never got
            invoiced, a quote nobody followed up, or a supplier price that
            crept up. Sight keeps an eye on all of it and tells you the week
            it happens.
          </p>
        </Cinematic>

        <Reveal
          selector="[data-moment]"
          stagger={0.12}
          className="mx-auto mt-14 grid max-w-[520px] gap-8 md:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-5"
        >
          {MOMENTS.map(({ title, src, caption, window }) => (
            <article key={title} data-moment className="flex flex-col">
              <div
                aria-hidden="true"
                className="relative flex h-[400px] items-center overflow-hidden rounded-2xl px-5 shadow-[0_16px_40px_-18px_rgba(20,24,33,0.4)]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 520px"
                  className="object-cover"
                />
                {/* The product window: one small panel, centred on the photo */}
                <div data-window className="relative w-full">
                  {window}
                </div>
              </div>
              <h3 className="mt-6 text-[1.15rem] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
                {title}
              </h3>
              <p className="mt-2 text-[0.98rem] leading-[1.55] text-[var(--ink-soft)]">
                {caption}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
