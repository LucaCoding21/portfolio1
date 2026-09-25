"use client";

import { AppPanel, Icon, P, T } from "./SightUI";
import { gsap, useSightGsap } from "./motion";

/**
 * The rollout screen of Sight, for the "we build it, live in 45 days"
 * card. A day counter runs from one to forty-five while a line fills
 * down a list of milestones. Each one ticks green as its day passes,
 * the next one lights up as the one in hand, and on day 45 the last
 * row becomes a green Live pill. Holds, then runs again. Plays only
 * while on screen; with prefers-reduced-motion it shows day 45, done.
 */

type Milestone = { day: number; title: string; detail: string };

const MILESTONES: Milestone[] = [
  { day: 1, title: "Tools connected", detail: "Books, jobs and calendar read in" },
  { day: 3, title: "First answers on your numbers", detail: "Real questions, your real data" },
  { day: 12, title: "Checks built for your trade", detail: "The ones that matter, agreed with you" },
  { day: 28, title: "Running on real jobs", detail: "Tuned until the flags are right" },
  { day: 40, title: "Team trained", detail: "Whoever runs the books and the schedule" },
  { day: 45, title: "Live", detail: "Then 30 more days of tuning" },
];

const TOTAL = 45;

/* geometry (px) */
const ROW = 46;
const DOT = 16;

/* timing (s) */
const RUN = 9; // day 1 to day 45
const HOLD = 3.6; // live, before it runs again

const dayAt = (day: number) => (RUN * (day - 1)) / (TOTAL - 1);

export default function Rollout() {
  const scope = useSightGsap((root, reduced) => {
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
    const pending = gsap.utils.toArray<HTMLElement>("[data-pending]", root);
    const current = gsap.utils.toArray<HTMLElement>("[data-current]", root);
    const done = gsap.utils.toArray<HTMLElement>("[data-done]", root);
    const fill = root.querySelector<HTMLElement>("[data-fill]");
    const bar = root.querySelector<HTMLElement>("[data-bar]");
    const dayEl = root.querySelector<HTMLElement>("[data-day]");
    const dayPill = root.querySelector<HTMLElement>("[data-day-pill]");
    const live = root.querySelector<HTMLElement>("[data-live]");
    const liveDay = root.querySelector<HTMLElement>("[data-live-day]");

    const setDay = (d: number) => {
      if (dayEl) dayEl.textContent = `Day ${Math.max(1, Math.min(TOTAL, Math.round(d)))} of ${TOTAL}`;
    };

    // First frame, applied immediately: day one, first milestone in hand.
    gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
    gsap.set(pending, { autoAlpha: 1 });
    gsap.set(current, { autoAlpha: 0, scale: 0.6 });
    gsap.set(done, { autoAlpha: 0, scale: 0.5 });
    gsap.set(rows, { opacity: 0.45 });
    gsap.set(rows[0], { opacity: 1 });
    gsap.set(current[0], { autoAlpha: 1, scale: 1 });
    gsap.set(pending[0], { autoAlpha: 0 });
    gsap.set(live, { autoAlpha: 0, scale: 0.9 });
    gsap.set(dayPill, { backgroundColor: T.WELL, color: T.MUTED });
    setDay(1);

    if (reduced) {
      gsap.set(fill, { scaleY: 1 });
      gsap.set(bar, { scaleX: 1 });
      gsap.set(pending, { autoAlpha: 0 });
      gsap.set(current, { autoAlpha: 0 });
      gsap.set(done, { autoAlpha: 1, scale: 1 });
      gsap.set(rows, { opacity: 1 });
      gsap.set(live, { autoAlpha: 1, scale: 1 });
      gsap.set(liveDay, { autoAlpha: 0 });
      gsap.set(dayPill, { backgroundColor: `${T.GREEN}14`, color: T.GREEN_INK });
      setDay(TOTAL);
      return;
    }

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        toggleActions: "play pause resume pause",
      },
    });
    const later = (target: gsap.TweenTarget, vars: gsap.TweenVars, at: number) =>
      tl.set(target, { ...vars, immediateRender: false }, at);

    // the counter and both lines run together, one to forty-five
    const start = 0.6;
    const proxy = { d: 1 };
    tl.to(proxy, { d: TOTAL, duration: RUN, ease: "none", onUpdate: () => setDay(proxy.d) }, start);
    tl.to(fill, { scaleY: 1, duration: RUN, ease: "none" }, start);
    tl.to(bar, { scaleX: 1, duration: RUN, ease: "none" }, start);

    // each milestone ticks as its day passes, and hands off to the next
    MILESTONES.forEach((m, i) => {
      const t = start + dayAt(m.day);
      const last = i === MILESTONES.length - 1;
      if (i > 0) {
        tl.to(rows[i], { opacity: 1, duration: 0.3 }, t - 0.05);
        tl.to(pending[i], { autoAlpha: 0, duration: 0.15 }, t - 0.05);
      }
      if (last) {
        tl.to(current[i], { autoAlpha: 0, scale: 0.6, duration: 0.15 }, t);
        tl.to(done[i], { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t);
        tl.to(liveDay, { autoAlpha: 0, duration: 0.15 }, t);
        tl.to(live, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, t + 0.05);
        tl.to(dayPill, { backgroundColor: `${T.GREEN}14`, color: T.GREEN_INK, duration: 0.3 }, t);
      } else {
        // this one is in hand until the next one's day
        const next = start + dayAt(MILESTONES[i + 1].day);
        if (i > 0) tl.to(current[i], { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
        tl.to(current[i], { autoAlpha: 0, scale: 0.6, duration: 0.15 }, next - 0.1);
        tl.to(done[i], { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, next - 0.1);
      }
    });

    // live: hold, fade out, reset to day one behind the fade, fade in
    const end = start + RUN + HOLD;
    const reset = end + 0.4;
    tl.to(root, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, end);
    later(fill, { scaleY: 0 }, reset);
    later(bar, { scaleX: 0 }, reset);
    later(pending, { autoAlpha: 1 }, reset);
    later(current, { autoAlpha: 0, scale: 0.6 }, reset);
    later(done, { autoAlpha: 0, scale: 0.5 }, reset);
    later(rows, { opacity: 0.45 }, reset);
    later(rows[0], { opacity: 1 }, reset);
    later(current[0], { autoAlpha: 1, scale: 1 }, reset);
    later(pending[0], { autoAlpha: 0 }, reset);
    later(live, { autoAlpha: 0, scale: 0.9 }, reset);
    later(liveDay, { autoAlpha: 1 }, reset);
    later(dayPill, { backgroundColor: T.WELL, color: T.MUTED }, reset);
    tl.add(() => setDay(1), reset);
    tl.to(root, { autoAlpha: 1, duration: 0.3 }, reset + 0.1);
  });

  const lineH = (MILESTONES.length - 1) * ROW;

  return (
    <div ref={scope} className="w-full max-w-[400px]">
      <AppPanel pad={false}>
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3"
          style={{ borderColor: `${T.LINE}b3` }}
        >
          <span className="flex items-center gap-2">
            <span style={{ color: T.BLUE }}>
              <Icon d={P.calendar} className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
              Your rollout
            </span>
          </span>
          <span
            data-day-pill
            className="rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums"
            style={{ backgroundColor: T.WELL, color: T.MUTED }}
          >
            <span data-day>Day 1 of {TOTAL}</span>
          </span>
        </div>

        {/* progress */}
        <div className="px-4 pt-4">
          <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: T.WELL }}>
            <div data-bar className="h-full rounded-full" style={{ backgroundColor: T.BLUE }} />
          </div>
        </div>

        {/* milestones */}
        <div className="relative px-4 pb-2 pt-3">
          {/* the track and its fill sit behind the dots */}
          <div
            className="absolute w-px"
            style={{ left: 16 + DOT / 2, top: 12 + ROW / 2, height: lineH, backgroundColor: T.LINE }}
          >
            <div data-fill className="h-full w-full" style={{ backgroundColor: T.BLUE }} />
          </div>

          {MILESTONES.map((m, i) => {
            const last = i === MILESTONES.length - 1;
            return (
              <div key={m.day} data-row className="relative flex items-center gap-3" style={{ height: ROW }}>
                {/* the three dot states share one spot */}
                <span className="relative shrink-0" style={{ width: DOT, height: DOT }}>
                  <span
                    data-pending
                    className="absolute inset-0 rounded-full border-2 bg-white"
                    style={{ borderColor: T.LINE }}
                  />
                  <span
                    data-current
                    className="absolute inset-0 rounded-full border-2 bg-white"
                    style={{ borderColor: T.BLUE }}
                  >
                    <span
                      className="absolute inset-[3px] rounded-full"
                      style={{ backgroundColor: T.BLUE }}
                    />
                  </span>
                  <span
                    data-done
                    className="absolute inset-0 flex items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: T.GREEN }}
                  >
                    <Icon d={P.check} className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium" style={{ color: T.INK }}>
                    {m.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px]" style={{ color: T.MUTED }}>
                    {m.detail}
                  </span>
                </span>

                {last ? (
                  <span className="relative shrink-0 text-right">
                    <span data-live-day className="text-[11px] tabular-nums" style={{ color: T.MUTED }}>
                      Day {m.day}
                    </span>
                    <span
                      data-live
                      className="absolute inset-y-0 right-0 flex items-center whitespace-nowrap rounded-[5px] px-2.5 text-[11px] font-medium"
                      style={{ backgroundColor: `${T.GREEN}1f`, color: T.GREEN_INK }}
                    >
                      Live
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] tabular-nums" style={{ color: T.MUTED }}>
                    Day {m.day}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="flex items-center gap-2 border-t px-4 py-3 text-[12px]"
          style={{ borderColor: `${T.LINE}b3`, color: T.MUTED }}
        >
          Built with you, on your real numbers
        </div>
      </AppPanel>
    </div>
  );
}
