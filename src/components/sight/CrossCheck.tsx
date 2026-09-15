"use client";

import Image from "next/image";
import { AppPanel, Icon, P, StatusPill, T } from "./SightUI";
import { gsap, useSightGsap } from "./motion";
import { M, type LogoMark } from "./logos";

/**
 * The Cross-check screen of Sight, for the "checks every number against
 * every other one" card. One job at a time: its name, then one line per
 * tool with the number that tool holds for it. Lines land one after
 * another and a check pops when a line agrees with the ones above. The
 * last line lands amber when it doesn't, and a flag drops into the
 * title row saying what's wrong. On a clean job every line is green and
 * the flag says so. Holds, slides off, the next job slides in. Four
 * jobs, clean and caught in turn, so it reads as a check that usually
 * passes. Plays only while on screen; with prefers-reduced-motion it
 * shows the first job fully checked.
 */

type Line = { mark: LogoMark; label: string; value: string; warn?: boolean };

type Job = { name: string; ref: string; flag: string; ok?: boolean; lines: Line[] };

const JOBS: Job[] = [
  {
    name: "Henderson furnace",
    ref: "Job #1188",
    flag: "Unpaid 34 days",
    lines: [
      { mark: M.jobber, label: "Quoted", value: "$2,400" },
      { mark: M.gcal, label: "Done", value: "Aug 7" },
      { mark: M.quickbooks, label: "Invoiced", value: "$2,400" },
      { mark: M.quickbooks, label: "Paid", value: "Nothing yet", warn: true },
    ],
  },
  {
    name: "Patel kitchen",
    ref: "Job #1191",
    flag: "All matched",
    ok: true,
    lines: [
      { mark: M.jobber, label: "Quoted", value: "$4,200" },
      { mark: M.gcal, label: "Done", value: "Wed 8am" },
      { mark: M.quickbooks, label: "Invoiced", value: "$4,200" },
      { mark: M.quickbooks, label: "Paid", value: "$4,200" },
    ],
  },
  {
    name: "Oakridge reno",
    ref: "Job #1163",
    flag: "32 hours over",
    lines: [
      { mark: M.jobber, label: "Quoted", value: "$18,500" },
      { mark: M.quickbooks, label: "Invoiced", value: "$18,500" },
      { mark: M.jobber, label: "Hours quoted", value: "180" },
      { mark: M.gcal, label: "Hours logged", value: "212", warn: true },
    ],
  },
  {
    name: "Lakeview strata",
    ref: "Quote #402",
    flag: "Never booked",
    lines: [
      { mark: M.jobber, label: "Quoted", value: "$22,000" },
      { mark: M.jobber, label: "Sent", value: "Mar 2" },
      { mark: M.jobber, label: "Approved", value: "Mar 9" },
      { mark: M.gcal, label: "Booked", value: "Nothing", warn: true },
    ],
  },
  {
    name: "Coast Building Supply",
    ref: "Job #1194",
    flag: "All matched",
    ok: true,
    lines: [
      { mark: M.jobber, label: "Quoted", value: "$6,150" },
      { mark: M.jobber, label: "Hours quoted", value: "40" },
      { mark: M.gcal, label: "Hours logged", value: "38" },
      { mark: M.quickbooks, label: "Paid", value: "$6,150" },
    ],
  },
];

const CHECKS = "M18 6 7 17l-5-5|m22 10-7.5 7.5L13 16";

/* geometry (px) */
const PAD = 16;
const TITLE = 44;
const LINE = 36;
const BODY = PAD + TITLE + 8 + JOBS[0].lines.length * LINE + PAD;

/* timing (s) */
const STEP = 0.5; // between lines landing
const HOLD = 3.2; // fully checked, before the next job

const MARK_H = 13;
const markH = (m: LogoMark) => MARK_H * (m.scale ?? 1);
const markW = (m: LogoMark) => (markH(m) * m.w) / m.h;

function Mark({ mark }: { mark: LogoMark }) {
  return (
    <Image
      src={mark.src}
      alt={mark.name}
      width={Math.round(markW(mark))}
      height={Math.round(markH(mark))}
      style={{ height: markH(mark), width: "auto" }}
      loading="eager"
      draggable={false}
    />
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <div data-job={index} className="absolute inset-0" style={{ padding: PAD }}>
      <div className="flex items-center justify-between gap-3" style={{ height: TITLE }}>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold" style={{ color: T.INK }}>
            {job.name}
          </span>
          <span className="mt-0.5 block text-[11px]" style={{ color: T.MUTED }}>
            {job.ref}
          </span>
        </span>
        <StatusPill
          data-flag
          tone={job.ok ? T.GREEN : T.AMBER}
          className="shrink-0 tabular-nums"
        >
          {job.flag}
        </StatusPill>
      </div>

      <div className="mt-2">
        {job.lines.map((line, i) => (
          <div
            key={i}
            data-line
            className="grid items-center gap-3 border-t text-[12px]"
            style={{
              height: LINE,
              gridTemplateColumns: "84px 1fr auto 16px",
              borderColor: `${T.LINE}80`,
            }}
          >
            <span className="flex items-center">
              <Mark mark={line.mark} />
            </span>
            <span className="truncate" style={{ color: T.MUTED }}>
              {line.label}
            </span>
            <span
              className="font-medium tabular-nums"
              style={{ color: line.warn ? T.AMBER : T.INK }}
            >
              {line.value}
            </span>
            {line.warn ? (
              <span data-mark className="flex h-4 w-4 items-center justify-center">
                <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: T.AMBER }} />
              </span>
            ) : (
              <span
                data-mark
                className="flex h-4 w-4 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: T.GREEN }}
              >
                <Icon d={P.check} className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CrossCheck() {
  const scope = useSightGsap((root, reduced) => {
    const jobs = gsap.utils.toArray<HTMLElement>("[data-job]", root);
    const busy = root.querySelector<HTMLElement>("[data-busy]");
    const idle = root.querySelector<HTMLElement>("[data-idle]");

    const parts = (job: HTMLElement) => ({
      lines: gsap.utils.toArray<HTMLElement>("[data-line]", job),
      marks: gsap.utils.toArray<HTMLElement>("[data-mark]", job),
      flag: job.querySelector<HTMLElement>("[data-flag]"),
    });

    // First frame, applied immediately: first job only, no lines yet.
    jobs.forEach((job, i) => {
      const p = parts(job);
      gsap.set(job, { autoAlpha: i === 0 ? 1 : 0, x: 0 });
      gsap.set(p.lines, { autoAlpha: 0, y: 8 });
      gsap.set(p.marks, { autoAlpha: 0, scale: 0.5 });
      gsap.set(p.flag, { autoAlpha: 0, y: -6, scale: 0.96 });
    });
    gsap.set(busy, { autoAlpha: 1 });
    gsap.set(idle, { autoAlpha: 0 });

    if (reduced) {
      const p = parts(jobs[0]);
      gsap.set(p.lines, { autoAlpha: 1, y: 0 });
      gsap.set(p.marks, { autoAlpha: 1, scale: 1 });
      gsap.set(p.flag, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(busy, { autoAlpha: 0 });
      gsap.set(idle, { autoAlpha: 1 });
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

    // set() renders at build time by default, which would stomp the first
    // frame above; these only apply when the playhead reaches them.
    const later = (target: gsap.TweenTarget, vars: gsap.TweenVars, at: number) =>
      tl.set(target, { ...vars, immediateRender: false }, at);

    jobs.forEach((j) => later(j, { autoAlpha: 0 }, 0));

    jobs.forEach((job, i) => {
      const p = parts(job);
      const at = tl.duration();

      // reset, then the card slides in from the right and eases to a stop
      later(job, { autoAlpha: 0, x: 48 }, at);
      later(p.lines, { autoAlpha: 0, y: 8 }, at);
      later(p.marks, { autoAlpha: 0, scale: 0.5 }, at);
      later(p.flag, { autoAlpha: 0, y: -6, scale: 0.96 }, at);
      later(busy, { autoAlpha: 1 }, at);
      later(idle, { autoAlpha: 0 }, at);
      tl.to(job, { autoAlpha: 1, x: 0, duration: 0.55, ease: i === 0 ? "power3.out" : "back.out(1.2)" }, at + 0.05);

      // lines land one after another; each agreement pops a check
      const t0 = at + 0.7;
      p.lines.forEach((line, li) => {
        const t = t0 + li * STEP;
        const warn = JOBS[i].lines[li].warn;
        tl.to(
          line,
          { autoAlpha: 1, y: 0, duration: warn ? 0.5 : 0.35, ease: warn ? "back.out(1.7)" : "power2.out" },
          t
        );
        tl.to(p.marks[li], { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)" }, t + 0.22);
      });

      // the flag drops into the title row, the header settles. A clean
      // job's flag arrives softly; a catch lands with a bit of recoil.
      const done = t0 + (p.lines.length - 1) * STEP + 0.55;
      tl.to(
        p.flag,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: JOBS[i].ok ? "power2.out" : "back.out(1.8)" },
        done
      )
        .to(busy, { autoAlpha: 0, duration: 0.2 }, done)
        .to(idle, { autoAlpha: 1, duration: 0.3 }, done + 0.1);

      // hold, then the card leaves to the left, picking up speed
      tl.to(job, { autoAlpha: 0, x: -40, duration: 0.4, ease: "power3.in" }, done + HOLD);
    });
  });

  return (
    <div ref={scope} className="w-full max-w-[400px]">
      <AppPanel pad={false}>
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3"
          style={{ borderColor: `${T.LINE}b3` }}
        >
          <span className="flex items-center gap-2">
            <span style={{ color: T.BLUE }}>
              <Icon d={CHECKS} className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
              Cross-check
            </span>
          </span>
          {/* the two header states share one cell */}
          <span className="grid justify-items-end text-[11px] font-medium">
            <span data-busy className="col-start-1 row-start-1">
              <span className="sight-thinking">Checking</span>
            </span>
            <span data-idle className="col-start-1 row-start-1 flex items-center gap-1.5" style={{ color: T.MUTED }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: T.GREEN }} />
              3 tools
            </span>
          </span>
        </div>

        {/* one job at a time; the cards share one box */}
        <div className="relative" style={{ height: BODY }}>
          {JOBS.map((job, i) => (
            <JobCard key={job.name} job={job} index={i} />
          ))}
        </div>

        <div
          className="flex items-center gap-2 border-t px-4 py-3 text-[12px]"
          style={{ borderColor: `${T.LINE}b3`, color: T.MUTED }}
        >
          412 jobs checked
        </div>
      </AppPanel>
    </div>
  );
}
