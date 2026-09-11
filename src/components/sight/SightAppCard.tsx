"use client";

import {
  gsap,
  ScrollTrigger,
  useSightGsap,
  counterTween,
  countFormats,
} from "./motion";

/**
 * The hero centerpiece: the actual product, stripped to its one magic
 * moment — the Ask box with its blue halo and a full-bleed answer.
 * A two-question demo loop (typing → thinking shimmer → a plain-English
 * reply, then the data panel with live counters and self-drawing bars)
 * built as real DOM animated with GSAP. Pauses off-screen; with
 * prefers-reduced-motion it holds the completed first answer. The panel
 * is height-locked (min-h) so the hero's scroll choreography keeps the
 * same footprint it was tuned against.
 */

/* ---------- product tokens (hex from the app's CSS variables) ---------- */

const INK = "#212630";
const MUTED = "#6b7280";
const LINE = "#d4d7de";
const BLUE = "#2563eb";
const AMBER = "#c76c05";
const RED = "#ca2121";

/* ---------- tiny inline icons (lucide-style, strokeWidth 1.75) ---------- */

function Icon({
  d,
  className = "",
  strokeWidth = 1.75,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const PATHS = {
  arrowUp: "M12 19V5 M5 12l7-7 7 7",
};

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 1.2 9.7 6l4.8 1.7-4.8 1.7L8 14.2 6.3 9.4 1.5 7.7 6.3 6 8 1.2Z" />
    </svg>
  );
}

/* ---------- product primitives ---------- */

function StatusChip({
  tone,
  children,
}: {
  tone: "red" | "amber";
  children: React.ReactNode;
}) {
  const color = tone === "red" ? RED : AMBER;
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium"
      style={{
        borderColor: `${color}4d`,
        backgroundColor: `${color}1a`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function Thinking() {
  return (
    <div
      data-thinking
      className="items-center gap-2 text-[#2563eb]"
      style={{ display: "none" }}
    >
      <span
        data-thinking-label
        className="sight-app-thinking text-[14px] font-medium"
      >
        Thinking…
      </span>
    </div>
  );
}

type BarRowData = {
  name: string;
  note: string;
  value: string;
  width: number;
  hot?: boolean;
};

function AnswerCard({
  label,
  chip,
  chipTone,
  big,
  bigCount,
  caption,
  rows,
  footer,
}: {
  label: string;
  chip: string;
  chipTone: "red" | "amber";
  big: string;
  bigCount: { from: number; to: number; format: string };
  caption: string;
  rows: BarRowData[];
  footer: string;
}) {
  const barColor = chipTone === "red" ? RED : AMBER;
  return (
    <div
      data-answer
      className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.06)]"
      style={{ borderColor: `${LINE}b3` }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b bg-[#fafbfc] px-4 py-2.5"
        style={{ borderColor: `${LINE}b3` }}
      >
        <span className="text-[11px] font-medium" style={{ color: MUTED }}>
          {label}
        </span>
        <StatusChip tone={chipTone}>{chip}</StatusChip>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
        <div className="flex items-baseline gap-2.5">
          <p
            data-item
            className="text-[2.1rem] font-semibold leading-none tracking-tight tabular-nums"
            style={{ color: INK }}
          >
            <span
              data-count
              data-from={bigCount.from}
              data-to={bigCount.to}
              data-format={bigCount.format}
            >
              {big}
            </span>
          </p>
          <p data-item className="text-[12px]" style={{ color: MUTED }}>
            {caption}
          </p>
        </div>

        <div className="mt-3">
          {rows.map(({ name, note, value, width, hot }) => (
            <div
              key={name}
              data-item
              className="border-b py-3 last:border-b-0"
              style={{ borderColor: `${LINE}80` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="truncate text-[13px] font-medium"
                    style={{ color: INK }}
                  >
                    {name}
                  </span>
                  {hot ? (
                    <StatusChip tone={chipTone}>{note}</StatusChip>
                  ) : (
                    <span
                      className="whitespace-nowrap text-[11px] tabular-nums"
                      style={{ color: MUTED }}
                    >
                      {note}
                    </span>
                  )}
                </span>
                <span
                  className="text-[13px] font-semibold tabular-nums"
                  style={{ color: INK }}
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
                    backgroundColor: barColor,
                    opacity: hot ? 1 : 0.45,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          data-item
          className="mt-auto border-t pt-3 text-[11px]"
          style={{ borderColor: `${LINE}b3`, color: "#9aa0a6" }}
        >
          {footer}
        </p>
      </div>
    </div>
  );
}

/* ---------- the card ---------- */

export default function SightAppCard({ className = "" }: { className?: string }) {
  const scope = useSightGsap<HTMLDivElement>((root, reduced) => {
    const exchanges = gsap.utils.toArray<HTMLElement>("[data-exchange]", root);
    const typed = root.querySelector<HTMLElement>("[data-typed]")!;
    const placeholder = root.querySelector<HTMLElement>("[data-placeholder]");
    const first = exchanges[0];

    // Stamp an exchange as fully answered: rows in, bars drawn, counters
    // at their final values. Used for prefers-reduced-motion.
    const showComplete = (ex: HTMLElement) => {
      gsap.set(ex, { autoAlpha: 1, y: 0 });
      gsap.set(ex.querySelectorAll("[data-q-echo], [data-reply], [data-answer]"), {
        autoAlpha: 1,
        y: 0,
      });
      gsap.set(ex.querySelectorAll("[data-item]"), { autoAlpha: 1, y: 0 });
      gsap.set(ex.querySelectorAll("[data-bar]"), { scaleX: 1 });
      ex.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const format =
          countFormats[el.dataset.format ?? "plain"] ?? countFormats.plain;
        el.textContent = format(parseFloat(el.dataset.to ?? "0"));
      });
    };

    if (reduced) {
      exchanges.forEach((ex, i) => gsap.set(ex, { autoAlpha: i === 0 ? 1 : 0 }));
      showComplete(first);
      return;
    }

    const master = gsap.timeline({ repeat: -1 });

    exchanges.forEach((ex) => {
      const question = ex.dataset.question ?? "";
      const qEcho = ex.querySelector("[data-q-echo]");
      const reply = ex.querySelector<HTMLElement>("[data-reply]");
      const thinking = ex.querySelector<HTMLElement>("[data-thinking]");
      const thinkingLabel = ex.querySelector<HTMLElement>(
        "[data-thinking-label]"
      );
      const thinking2 = ex.dataset.thinking2 ?? "";

      // Split the reply into word spans so streaming can fade each word in
      // smoothly. Every word keeps its layout slot from the start, so the
      // text never reflows while it streams.
      const replyWords: HTMLElement[] = [];
      if (reply) {
        const words = (reply.textContent ?? "").split(/\s+/).filter(Boolean);
        reply.textContent = "";
        words.forEach((word, i) => {
          const span = document.createElement("span");
          span.textContent = i ? ` ${word}` : word;
          span.style.opacity = "0";
          reply.appendChild(span);
          replyWords.push(span);
        });
      }
      const answer = ex.querySelector("[data-answer]");
      const items = ex.querySelectorAll("[data-item]");
      const bars = ex.querySelectorAll("[data-bar]");
      const counts = ex.querySelectorAll<HTMLElement>("[data-count]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Reset the exchange into its pre-send state.
      tl.set(ex, { autoAlpha: 0, y: 0 });
      tl.set([qEcho, reply, answer], { autoAlpha: 0 });
      tl.set(items, { autoAlpha: 0, y: 10 });
      tl.set(bars, { scaleX: 0, transformOrigin: "0% 50%" });
      tl.set(thinking, { autoAlpha: 0, display: "none" });
      tl.set(replyWords, { opacity: 0 });

      // 1. Idle caret moment.
      tl.to({}, { duration: 0.6 });

      // 2. The question types character-by-character.
      tl.set(placeholder, { autoAlpha: 0 });
      const proxy = { i: 0 };
      tl.fromTo(
        proxy,
        { i: 0 },
        {
          i: question.length,
          duration: question.length * 0.042,
          ease: "none",
          onUpdate: () => {
            typed.textContent = question.slice(0, Math.round(proxy.i));
          },
        }
      );
      // Hold on the fully-typed question for a beat before sending.
      tl.to({}, { duration: 1 });

      // 3. Send: input clears and the thinking shimmer runs alone,
      // "Thinking…" first, then a working status ("Pulling invoices…") —
      // nothing else shows until Sight has "worked it out".
      tl.call(() => {
        typed.textContent = "";
        if (thinkingLabel) thinkingLabel.textContent = "Thinking…";
      });
      tl.set(placeholder, { autoAlpha: 1 });
      tl.set(ex, { autoAlpha: 1 });
      tl.set(thinking, { display: "flex" });
      tl.fromTo(thinking, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      tl.to({}, { duration: 0.8 });
      tl.to(thinking, { autoAlpha: 0, duration: 0.15 });
      tl.call(() => {
        if (thinkingLabel) thinkingLabel.textContent = thinking2;
      });
      tl.to(thinking, { autoAlpha: 1, duration: 0.15 });
      tl.to({}, { duration: 1.0 });

      // 4. The shimmer gives way: the question lands as a bold heading,
      // the reply streams in word by word, then the data panel rises in —
      // rows stagger, bars draw, counters run.
      tl.to(thinking, { autoAlpha: 0, duration: 0.2 });
      tl.set(thinking, { display: "none" });
      tl.fromTo(
        qEcho,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.35 }
      );
      tl.set(reply, { autoAlpha: 1, y: 0 }, "+=0.1");
      tl.to(replyWords, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
        stagger: 0.05,
      });
      tl.to({}, { duration: 0.35 });
      tl.fromTo(
        answer,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45 }
      );
      tl.to(
        items,
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
        "-=0.2"
      );
      tl.to(
        bars,
        { scaleX: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "<0.15"
      );
      counts.forEach((el) => tl.add(counterTween(el), "<0.1"));

      // 5. Hold on the answer — most of the loop lives here.
      tl.to({}, { duration: 2 });
      tl.to(ex, { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.inOut" });
      tl.set(ex, { y: 0 });

      master.add(tl);
    });

    // The card sits sticky inside the hero, so its own box is useless as
    // a trigger (ScrollTrigger measures the resting position and would
    // pause the loop while the card is still pinned on screen). Watch the
    // enclosing section instead.
    const st = ScrollTrigger.create({
      trigger: root.closest("section") ?? root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? master.play() : master.pause()),
    });
    if (!st.isActive) master.pause();
  });

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className={`sight-app w-full ${className}`}
    >
      {/* White content panel — min-h locks the hero footprint the scroll
          choreography was tuned against. */}
      <div
        className="flex min-h-[640px] flex-col rounded-2xl border bg-white p-4 shadow-[0_1px_2px_0_rgba(20,24,33,0.05),0_24px_60px_-24px_rgba(20,24,33,0.28)]"
        style={{ borderColor: `${LINE}b3` }}
      >
        {/* The Ask box */}
        <div
          className="relative rounded-2xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.05),0_0_15px_-2px_rgba(37,99,235,0.13)]"
          style={{ borderColor: `${BLUE}33` }}
        >
          <SparkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2563eb]" />
          <div className="flex min-w-0 items-center py-3.5 pl-10 pr-11">
            <span
              data-typed
              className="truncate text-[13px]"
              style={{ color: INK }}
            />
            <span className="sight-caret ml-px h-4 w-px shrink-0 bg-[#212630]" />
            <span
              data-placeholder
              className="pointer-events-none absolute left-10 right-11 truncate text-[13px]"
              style={{ color: "#9aa0a6" }}
            >
              Ask anything about the business…
            </span>
          </div>
          <span className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white">
            <Icon d={PATHS.arrowUp} className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>

        {/* Answer states, stacked in one grid cell */}
        <div className="mt-4 grid min-h-0 flex-1">
          {/* Answer 1 — overdue AR */}
          <div
            data-exchange
            data-question="Who owes us money past 45 days?"
            data-thinking2="Pulling invoices from QuickBooks…"
            className="col-start-1 row-start-1 flex min-h-0 flex-col opacity-0"
          >
            <Thinking />
            <p
              data-q-echo
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: INK }}
            >
              Who owes us money past 45 days?
            </p>
            <p
              data-reply
              className="mt-2.5 text-[13px] leading-relaxed"
              style={{ color: INK }}
            >
              12 invoices are past 45 days, and three dealers carry most of
              it. Here&apos;s the breakdown:
            </p>
            <AnswerCard
              label="Overdue receivables · past 45 days"
              chip="12 invoices"
              chipTone="red"
              big="$48,200"
              bigCount={{ from: 0, to: 48200, format: "money" }}
              caption="oldest is 62 days"
              rows={[
                {
                  name: "Coast Building Supply",
                  note: "62 days",
                  value: "$18,400",
                  width: 100,
                  hot: true,
                },
                {
                  name: "Fraser Valley Hardware",
                  note: "55 days",
                  value: "$12,750",
                  width: 69,
                },
                {
                  name: "Delta Fastener Co",
                  note: "48 days",
                  value: "$9,300",
                  width: 51,
                },
              ]}
              footer="From QuickBooks, matched to CRM contacts · synced 4 min ago"
            />
          </div>

          {/* Answer 2 — quiet dealers */}
          <div
            data-exchange
            data-question="Which dealers are going quiet?"
            data-thinking2="Comparing each dealer's pace to their history…"
            className="col-start-1 row-start-1 flex min-h-0 flex-col opacity-0"
          >
            <Thinking />
            <p
              data-q-echo
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: INK }}
            >
              Which dealers are going quiet?
            </p>
            <p
              data-reply
              className="mt-2.5 text-[13px] leading-relaxed"
              style={{ color: INK }}
            >
              3 dealers are ordering well below their usual pace. Here&apos;s
              what&apos;s at risk:
            </p>
            <AnswerCard
              label="Quiet dealers · ordering pace"
              chip="3 flagged"
              chipTone="amber"
              big="$310k"
              bigCount={{ from: 0, to: 310, format: "moneyk" }}
              caption="a year at risk"
              rows={[
                {
                  name: "Northgate Builders",
                  note: "↓ 44%",
                  value: "$128k/yr",
                  width: 100,
                  hot: true,
                },
                {
                  name: "Harbourview Supply",
                  note: "↓ 31%",
                  value: "$104k/yr",
                  width: 81,
                },
                {
                  name: "Peak Contracting",
                  note: "↓ 22%",
                  value: "$78k/yr",
                  width: 61,
                },
              ]}
              footer="Ordering pace vs each dealer's own history · synced 4 min ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
