"use client";

/**
 * Shared "real product" UI kit. Every Sight screenshot on the landing page is
 * built from these primitives so the whole page looks like the actual
 * Command Center app — same Inter type, same tokens, same card/KPI/alert/ask
 * recipes as the hero card. Nothing here is 1:1 with the codebase, but it
 * reads as the same product designed by the same hand.
 *
 * Presentational only: sections layer their own scroll animation on top via
 * the [data-count] / [data-bar] / [data-reveal] hooks the motion helpers read.
 */

import type { ReactNode } from "react";

/* ---------- product tokens (hex from the app's CSS variables) ---------- */

export const T = {
  INK: "#212630",
  MUTED: "#6b7280",
  FAINT: "#9aa0a6",
  LINE: "#d4d7de",
  CANVAS: "#f4f5f7",
  SURFACE2: "#fafbfc",
  WELL: "#eeeff2",
  BLUE: "#2563eb",
  GREEN: "#199a48",
  AMBER: "#c76c05",
  RED: "#ca2121",
} as const;

type Tone = "blue" | "green" | "amber" | "red" | "grey";

const TONE_HEX: Record<Tone, string> = {
  blue: T.BLUE,
  green: T.GREEN,
  amber: T.AMBER,
  red: T.RED,
  grey: T.MUTED,
};

/* ---------- lucide-style icons (strokeWidth 1.75) ---------- */

export function Icon({
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
      {d.split("|").map((seg, i) => (
        <path key={i} d={seg} />
      ))}
    </svg>
  );
}

export const P = {
  arrowUp: "M12 19V5|M5 12l7-7 7 7",
  chevronRight: "m9 18 6-6-6-6",
  trendUp: "M16 7h6v6|M22 7l-8.5 8.5-5-5L2 17",
  trendDown: "M16 17h6v-6|M22 17l-8.5-8.5-5 5L2 7",
  box: "m7.5 4.27 9 5.15|M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z|M3.3 7 12 12l8.7-5|M12 22V12",
  alertTriangle:
    "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z|M12 9v4|M12 17h.01",
  alertCircle: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20|M12 8v4|M12 16h.01",
  bell: "M10.268 21a2 2 0 0 0 3.464 0|M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
  mail: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7|M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  calendar:
    "M8 2v4|M16 2v4|M3 10h18|M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  refresh:
    "M3 12a9 9 0 0 1 15-6.7L21 8|M21 3v5h-5|M21 12a9 9 0 0 1-15 6.7L3 16|M3 21v-5h5",
  layers:
    "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z|M2 12.18a1 1 0 0 0 .6.9l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 .58-.91|M2 17.18a1 1 0 0 0 .6.9l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 .58-.91",
  check: "M20 6 9 17l-5-5",
};

export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1.2 9.7 6l4.8 1.7-4.8 1.7L8 14.2 6.3 9.4 1.5 7.7 6.3 6 8 1.2Z" />
    </svg>
  );
}

/* ---------- surfaces ---------- */

/**
 * The floating white product panel. Everything product-looking sits on one of
 * these. `sight-app` gives it Inter + the app's font features.
 */
export function AppPanel({
  children,
  className = "",
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`sight-app overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.05),0_24px_60px_-24px_rgba(20,24,33,0.28)] ${
        pad ? "p-4 md:p-5" : ""
      } ${className}`}
      style={{ borderColor: `${T.LINE}b3` }}
    >
      {children}
    </div>
  );
}

/**
 * The grey frost canvas the app floats on. Wrap an AppPanel in this to sell the
 * "Arc-style frosted dashboard" look.
 */
export function AppCanvas({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.6rem] p-4 md:p-6 ${className}`}
      style={{ backgroundColor: T.CANVAS }}
    >
      {children}
    </div>
  );
}

/* ---------- an inner card (a panel within a panel) ---------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.06)] ${className}`}
      style={{ borderColor: `${T.LINE}b3` }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  icon,
  title,
  count,
  tone = "grey",
  action = "View all",
}: {
  icon: string;
  title: string;
  count?: string;
  tone?: Tone;
  action?: string | null;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-4 py-3"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      <span className="flex items-center gap-2">
        <span style={{ color: TONE_HEX[tone] }}>
          <Icon d={icon} className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
          {title}
        </span>
        {count && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums"
            style={{ backgroundColor: T.WELL, color: T.MUTED }}
          >
            {count}
          </span>
        )}
      </span>
      {action && (
        <span
          className="flex items-center gap-0.5 text-[11px] font-medium"
          style={{ color: T.MUTED }}
        >
          {action}
          <Icon d={P.chevronRight} className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}

/* ---------- KPI tile ---------- */

export function Kpi({
  label,
  icon,
  value,
  count,
  context,
  delta,
  deltaDir = "up",
  tone = "grey",
  hero = false,
}: {
  label: string;
  icon: string;
  value: string;
  count?: { from: number; to: number; format: string };
  context?: string;
  delta?: string;
  deltaDir?: "up" | "down";
  tone?: Tone;
  hero?: boolean;
}) {
  const toneHex = TONE_HEX[tone];
  const isWarn = tone === "red" || tone === "amber";
  return (
    <div
      className="rounded-xl border bg-white p-3.5 transition-all duration-150 hover:-translate-y-px"
      style={{
        borderColor: hero
          ? `${T.BLUE}4d`
          : isWarn
            ? `${toneHex}4d`
            : `${T.LINE}b3`,
        backgroundColor: hero ? `${T.BLUE}0a` : "#ffffff",
      }}
    >
      <span
        className="flex items-center gap-1.5 text-[11px] font-medium"
        style={{ color: hero ? T.BLUE : T.MUTED }}
      >
        <Icon d={icon} className="h-3.5 w-3.5" />
        {label}
      </span>
      <p
        className="mt-2 truncate text-[1.6rem] font-semibold leading-none tracking-tight tabular-nums"
        style={{ color: isWarn ? toneHex : T.INK }}
        {...(count
          ? {
              "data-count": true,
              "data-from": count.from,
              "data-to": count.to,
              "data-format": count.format,
            }
          : {})}
      >
        {value}
      </p>
      {context && (
        <p
          className="mt-1.5 flex items-center gap-1 text-[11px]"
          style={{ color: T.MUTED }}
        >
          {delta && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-1 py-px font-medium tabular-nums"
              style={{
                backgroundColor: `${deltaDir === "up" ? T.GREEN : T.RED}1a`,
                color: deltaDir === "up" ? T.GREEN : T.RED,
              }}
            >
              <Icon
                d={deltaDir === "up" ? P.trendUp : P.trendDown}
                className="h-3 w-3"
              />
              {delta}
            </span>
          )}
          {context}
        </p>
      )}
    </div>
  );
}

/* ---------- alert row ---------- */

export function AlertRow({
  tone,
  title,
  detail,
  category,
}: {
  tone: Tone;
  title: string;
  detail: string;
  category: string;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border bg-white px-3 py-2.5 shadow-[0_1px_2px_0_rgba(20,24,33,0.05)] transition-all duration-150 hover:-translate-y-px"
      style={{ borderColor: `${T.LINE}b3` }}
    >
      <span
        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: TONE_HEX[tone] }}
      />
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
        className="shrink-0 self-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
        style={{ backgroundColor: T.WELL, color: T.MUTED }}
      >
        {category}
      </span>
    </div>
  );
}

/* ---------- status pill ---------- */

export function StatusPill({
  tone,
  children,
}: {
  tone: Tone;
  children: ReactNode;
}) {
  const hex = TONE_HEX[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{ borderColor: `${hex}4d`, backgroundColor: `${hex}1a`, color: hex }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {children}
    </span>
  );
}

/* ---------- connected / live-sync badge ---------- */

export function ConnectedBadge({
  text = "synced 4 min ago · 1,284 records",
}: {
  text?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{ borderColor: `${T.GREEN}4d`, backgroundColor: `${T.GREEN}12`, color: T.INK }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="sight-pulse absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: `${T.GREEN}99` }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: T.GREEN }}
        />
      </span>
      Connected
      <span className="font-normal" style={{ color: T.MUTED }}>
        {text}
      </span>
    </span>
  );
}

/* ---------- the Ask box (static display) ---------- */

export function AskBox({
  query,
  placeholder = "Ask anything about the business…",
}: {
  query?: string;
  placeholder?: string;
}) {
  return (
    <div
      className="relative rounded-2xl border bg-white shadow-[0_1px_2px_0_rgba(20,24,33,0.05),0_0_15px_-2px_rgba(37,99,235,0.13)]"
      style={{ borderColor: `${T.BLUE}33` }}
    >
      <div
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: T.BLUE }}
      >
        <Spark className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 items-center py-3.5 pl-10 pr-11">
        <span
          className="truncate text-[13px]"
          style={{ color: query ? T.INK : T.FAINT }}
        >
          {query ?? placeholder}
        </span>
      </div>
      <span
        className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: T.BLUE }}
      >
        <Icon d={P.arrowUp} className="h-4 w-4" strokeWidth={2} />
      </span>
    </div>
  );
}

/* ---------- suggestion chip ---------- */

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[11px]"
      style={{ borderColor: `${T.LINE}b3`, color: T.MUTED }}
    >
      <span style={{ color: `${T.BLUE}b3` }}>
        <Spark className="h-3 w-3" />
      </span>
      {children}
    </span>
  );
}
