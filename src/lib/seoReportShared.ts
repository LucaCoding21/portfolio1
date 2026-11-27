/**
 * SEO client reports: the types and month math the report page shares with
 * the server loader (seoReports.ts). Safe in the browser: no Firestore here,
 * as importing firebase-admin into a client component breaks the bundle.
 */

export type MetricKind = "number" | "money" | "percent";
export type WorkStatus = "done" | "doing" | "next";

export interface ReportMetric {
  id: string;
  label: string;
  kind: MetricKind;
}

export interface ReportKeyword {
  id: string;
  term: string;
  where: "google" | "maps";
}

export interface ReportMonth {
  month: string;
  values: Record<string, number>;
  ranks: Record<string, number>;
}

export interface ReportWork {
  id: string;
  title: string;
  why: string;
  link: string | null;
  status: WorkStatus;
  date: string;
}

/** Everything the client's page shows, and nothing else (no token, no ids of people). */
export interface ReportView {
  business: string;
  siteUrl: string;
  startedMonth: string | null;
  /** "Nov 26", Vancouver time. */
  updated: string;
  metrics: ReportMetric[];
  keywords: ReportKeyword[];
  months: ReportMonth[]; // newest first
  work: ReportWork[]; // newest date first
  /** Months with results or finished work, newest first. */
  monthList: string[];
  /** The month the page opens on. */
  defaultMonth: string;
  /** Changed in the last two weeks (the "Updated" chip gets its green dot). */
  fresh: boolean;
  /** The client's referral gift page (/g/<token>), when the report is linked to one. */
  giftLink: string | null;
}

// ---- The month math, as Command Center's lib/seo-reports.ts does it ----

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const monthName = (key: string) => MONTHS[Number(key.slice(5, 7)) - 1] ?? key;
export const monthShort = (key: string) => monthName(key).slice(0, 3);
export const monthLabel = (key: string) => `${monthName(key)} ${key.slice(0, 4)}`;

/** "2026-11-12" -> "Nov 12". */
export const dayLabel = (iso: string) => `${monthShort(iso.slice(0, 7))} ${Number(iso.slice(8, 10))}`;

export function shiftMonth(key: string, n: number): string {
  const [y, m] = key.split("-").map(Number) as [number, number];
  const total = y * 12 + (m - 1) - n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export function formatMetric(value: number, kind: MetricKind): string {
  if (kind === "money") return `$${Math.round(value).toLocaleString("en-US")}`;
  if (kind === "percent") return `${Number(value.toFixed(1))}%`;
  return Number.isInteger(value) ? value.toLocaleString("en-US") : String(Number(value.toFixed(1)));
}

export interface MetricChange {
  text: string;
  dir: "up" | "down" | "same";
  against: string;
  lastMonth: boolean;
}

/** How a number moved since the closest earlier month that has it. */
export function metricChange(months: ReportMonth[], month: string, metric: ReportMetric): MetricChange | null {
  const now = months.find((m) => m.month === month)?.values[metric.id];
  if (now == null) return null;
  const before = months.filter((m) => m.month < month && m.values[metric.id] != null).sort((a, b) => (a.month < b.month ? 1 : -1))[0];
  if (!before) return null;
  const was = before.values[metric.id]!;
  const lastMonth = before.month === shiftMonth(month, 1);
  if (metric.kind === "percent") {
    const pts = Number((now - was).toFixed(1));
    return { text: `${Math.abs(pts)} pts`, dir: pts > 0 ? "up" : pts < 0 ? "down" : "same", against: before.month, lastMonth };
  }
  if (was === 0) return null;
  const pct = Math.round(((now - was) / was) * 100);
  return { text: `${Math.abs(pct)}%`, dir: pct > 0 ? "up" : pct < 0 ? "down" : "same", against: before.month, lastMonth };
}
