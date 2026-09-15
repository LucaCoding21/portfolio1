"use client";

import Image from "next/image";
import { AppPanel, Icon, P, T } from "./SightUI";
import { gsap, useSightGsap } from "./motion";
import { M, type LogoMark } from "./logos";

/**
 * The Connections screen of Sight, for the "connects everything" card.
 * Four tools, each flipping Connect → Connecting (shimmer) → Connected
 * one after another, then a single footer line. Holds, then the toolset
 * swaps to a different kind of business and replays. Plays only while
 * on screen; with prefers-reduced-motion it shows the first stack fully
 * connected.
 */

type Row = { mark: LogoMark; detail: string };

/** One toolset per business, same archetypes as the hero blanks. */
const STACKS: Row[][] = [
  [
    { mark: M.quickbooks, detail: "1,284 invoices" },
    { mark: M.jobber, detail: "412 jobs" },
    { mark: M.gcal, detail: "3 crews" },
    { mark: M.sheets, detail: "price list" },
  ],
  [
    { mark: M.xero, detail: "962 invoices" },
    { mark: M.housecallpro, detail: "388 jobs" },
    { mark: M.gcal, detail: "2 crews" },
    { mark: M.mailchimp, detail: "2,140 contacts" },
  ],
  [
    { mark: M.stripe, detail: "1,900 payments" },
    { mark: M.hubspot, detail: "640 deals" },
    { mark: M.shopify, detail: "3,200 orders" },
    { mark: M.excel, detail: "inventory count" },
  ],
];

const LINK = "M9 17H7A5 5 0 0 1 7 7h2|M15 7h2a5 5 0 1 1 0 10h-2|M8 12h8";

/* timing (s) */
const STEP = 0.55; // between rows starting
const CONNECTING = 0.85; // shimmer time per row
const HOLD = 4; // fully connected, before the stack swaps

const MARK_H = 15;
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

function StackRows({ rows, index }: { rows: Row[]; index: number }) {
  return (
    <div data-stack={index} className="absolute inset-0">
      {rows.map(({ mark, detail }) => (
        <div
          key={mark.name}
          data-row
          className="flex h-[52px] items-center justify-between gap-3 border-b px-4 last:border-b-0"
          style={{ borderColor: `${T.LINE}80` }}
        >
          <span className="flex min-w-0 items-center">
            <Mark mark={mark} />
          </span>
          {/* the three states share one cell so the row never reflows */}
          <span className="grid shrink-0 justify-items-end text-[12px]">
            <span
              data-idle
              className="col-start-1 row-start-1 rounded-full px-2.5 py-1 font-medium"
              style={{ backgroundColor: T.WELL, color: T.MUTED }}
            >
              Connect
            </span>
            <span data-busy className="col-start-1 row-start-1 py-1 font-medium">
              <span className="sight-thinking">Connecting</span>
            </span>
            <span
              data-done
              className="col-start-1 row-start-1 flex items-center gap-1.5 py-1 font-medium"
              style={{ color: T.INK }}
            >
              <span
                data-check
                className="flex h-4 w-4 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: T.GREEN }}
              >
                <Icon d={P.check} className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Connected
              <span data-detail className="tabular-nums" style={{ color: T.MUTED }}>
                · {detail}
              </span>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ConnectionsWindow() {
  const scope = useSightGsap((root, reduced) => {
    const stacks = gsap.utils.toArray<HTMLElement>("[data-stack]", root);
    const count = root.querySelector<HTMLElement>("[data-count]");
    const footer = root.querySelector<HTMLElement>("[data-footer]");
    const total = STACKS[0].length;

    const setCount = (n: number) => {
      if (count) count.textContent = `${n} of ${total}`;
    };

    // First frame, applied immediately so nothing overlaps before the
    // timeline starts: first stack only, every row idle, footer hidden.
    stacks.forEach((s, i) => gsap.set(s, { autoAlpha: i === 0 ? 1 : 0 }));
    gsap.set(gsap.utils.toArray("[data-busy], [data-done], [data-detail]", root), { autoAlpha: 0 });
    gsap.set(gsap.utils.toArray("[data-check]", root), { scale: 0.5 });
    gsap.set(footer, { autoAlpha: 0, y: 4 });

    if (reduced) {
      // Final state of the first stack, nothing moving.
      gsap.set(gsap.utils.toArray("[data-idle], [data-busy]", stacks[0]), { autoAlpha: 0 });
      gsap.set(gsap.utils.toArray("[data-done], [data-detail]", stacks[0]), { autoAlpha: 1 });
      gsap.set(gsap.utils.toArray("[data-check]", stacks[0]), { scale: 1 });
      gsap.set(footer, { autoAlpha: 1, y: 0 });
      setCount(total);
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

    // Every loop starts with nothing showing, whatever the last frame was.
    stacks.forEach((s) => later(s, { autoAlpha: 0 }, 0));

    stacks.forEach((stack) => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", stack);
      const at = tl.duration();

      // reset this stack and bring it in
      later(stack, { autoAlpha: 0 }, at);
      rows.forEach((row) => {
        later(row.querySelector("[data-idle]"), { autoAlpha: 1 }, at);
        later(row.querySelector("[data-busy]"), { autoAlpha: 0 }, at);
        later(row.querySelector("[data-done]"), { autoAlpha: 0 }, at);
        later(row.querySelector("[data-check]"), { scale: 0.5 }, at);
        later(row.querySelector("[data-detail]"), { autoAlpha: 0, x: 4 }, at);
      });
      tl.add(() => setCount(0), at);
      later(footer, { autoAlpha: 0, y: 4 }, at);
      tl.to(stack, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, at + 0.05);

      // connect the rows one after another
      rows.forEach((row, i) => {
        const t = at + 0.6 + i * STEP;
        tl.to(row.querySelector("[data-idle]"), { autoAlpha: 0, duration: 0.18 }, t)
          .to(row.querySelector("[data-busy]"), { autoAlpha: 1, duration: 0.18 }, t + 0.06)
          .to(row.querySelector("[data-busy]"), { autoAlpha: 0, duration: 0.15 }, t + CONNECTING)
          .to(row.querySelector("[data-done]"), { autoAlpha: 1, duration: 0.2 }, t + CONNECTING + 0.05)
          .to(
            row.querySelector("[data-check]"),
            { scale: 1, duration: 0.45, ease: "back.out(2.2)" },
            t + CONNECTING + 0.05
          )
          .to(
            row.querySelector("[data-detail]"),
            { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out" },
            t + CONNECTING + 0.28
          )
          .add(() => setCount(i + 1), t + CONNECTING + 0.05);
      });

      const done = at + 0.6 + (rows.length - 1) * STEP + CONNECTING + 0.45;
      tl.to(footer, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, done)
        .to(stack, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, done + HOLD)
        .to(footer, { autoAlpha: 0, duration: 0.3 }, done + HOLD);
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
              <Icon d={LINK} className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
              Connections
            </span>
          </span>
          <span
            data-count
            className="rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums"
            style={{ backgroundColor: T.WELL, color: T.MUTED }}
          >
            0 of {STACKS[0].length}
          </span>
        </div>

        {/* all stacks share one box; the timeline shows one at a time */}
        <div className="relative" style={{ height: 52 * STACKS[0].length }}>
          {STACKS.map((rows, i) => (
            <StackRows key={i} rows={rows} index={i} />
          ))}
        </div>

        <div
          data-footer
          className="flex items-center gap-2 border-t px-4 py-3 text-[12px]"
          style={{ borderColor: `${T.LINE}b3`, color: T.MUTED }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: T.GREEN }} />
          Syncing every 15 minutes
        </div>
      </AppPanel>
    </div>
  );
}
