import { cache } from "react";
import type { DocumentData } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebaseAdmin";
import type { MetricKind, ReportKeyword, ReportMetric, ReportMonth, ReportView, ReportWork, WorkStatus } from "@/lib/seoReportShared";

export type { ReportView } from "@/lib/seoReportShared";

/**
 * SEO client reports, server side (Nov 2026). Each SEO client gets a live
 * report at /report/<token>: no login, read only. The work log and the
 * monthly results are added in Command Center (the ~/mysoftware repo, its SEO
 * reports page and lib/seo-reports-server.ts), which owns this layout:
 *
 *   seo_reports/{id}                business, site_url, token, active,
 *                                   started_month, metrics[{id, label, kind}],
 *                                   keywords[{id, term, where}],
 *                                   referral_client_id, updated_at
 *   seo_reports/{id}/work/{id}      title, why, link, status (done, doing,
 *                                   next), date (YYYY-MM-DD)
 *   seo_reports/{id}/months/{YYYY-MM}  month, values {metricId: n},
 *                                   ranks {keywordId: position, 0 = not
 *                                   showing yet}
 *
 * A report that is switched off (active false) reads as not found. The token
 * is 16 random characters, so a link can't be guessed.
 */

export const REPORT_TOKEN_RE = /^[A-Za-z0-9]{10,64}$/;

const TZ = "America/Vancouver";

const str = (v: unknown) => (typeof v === "string" ? v : "");
const numMap = (v: unknown): Record<string, number> => {
  const out: Record<string, number> = {};
  if (v && typeof v === "object") {
    for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
      if (typeof n === "number" && Number.isFinite(n)) out[k] = n;
    }
  }
  return out;
};

function toDate(v: unknown): Date | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") return (v as { toDate: () => Date }).toDate();
  return null;
}

export const getReportByToken = cache(async (token: string): Promise<ReportView | null> => {
  if (!REPORT_TOKEN_RE.test(token)) return null;
  const db = firestore();
  const snap = await db.collection("seo_reports").where("token", "==", token).limit(1).get();
  const doc = snap.docs[0];
  if (!doc) return null;
  const d: DocumentData = doc.data();
  if (d.active === false) return null;

  const [workSnap, monthSnap] = await Promise.all([
    doc.ref.collection("work").get(),
    doc.ref.collection("months").get(),
  ]);

  const metrics: ReportMetric[] = (Array.isArray(d.metrics) ? d.metrics : [])
    .filter((m: DocumentData) => m && str(m.id) && str(m.label))
    .map((m: DocumentData) => ({
      id: str(m.id),
      label: str(m.label),
      kind: (["number", "money", "percent"].includes(m.kind) ? m.kind : "number") as MetricKind,
    }));
  const keywords: ReportKeyword[] = (Array.isArray(d.keywords) ? d.keywords : [])
    .filter((k: DocumentData) => k && str(k.id) && str(k.term))
    .map((k: DocumentData) => ({ id: str(k.id), term: str(k.term), where: k.where === "maps" ? "maps" : "google" }));

  const work: ReportWork[] = workSnap.docs
    .map((w) => {
      const x = w.data();
      return {
        id: w.id,
        title: str(x.title),
        why: str(x.why),
        link: /^https?:\/\//i.test(str(x.link)) ? str(x.link) : null,
        status: (["done", "doing", "next"].includes(x.status) ? x.status : "done") as WorkStatus,
        date: /^\d{4}-\d{2}-\d{2}$/.test(str(x.date)) ? str(x.date) : "",
        added: toDate(x.created_at)?.getTime() ?? 0,
      };
    })
    .filter((w) => w.title && w.date)
    // Newest day first; the same day, newest added first (as Command Center lists them).
    .sort((a, b) => (a.date !== b.date ? (a.date < b.date ? 1 : -1) : b.added - a.added))
    .map((w): ReportWork => ({ id: w.id, title: w.title, why: w.why, link: w.link, status: w.status, date: w.date }));

  const months: ReportMonth[] = monthSnap.docs
    .map((m) => {
      const x = m.data();
      return { month: str(x.month) || m.id, values: numMap(x.values), ranks: numMap(x.ranks) };
    })
    .filter((m) => /^\d{4}-\d{2}$/.test(m.month))
    .sort((a, b) => (a.month < b.month ? 1 : -1));

  const set = new Set<string>();
  for (const m of months) if (Object.keys(m.values).length || Object.keys(m.ranks).length) set.add(m.month);
  for (const w of work) if (w.status === "done") set.add(w.date.slice(0, 7));
  const monthList = [...set].sort().reverse();
  const thisMonth = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" })
    .format(new Date())
    .slice(0, 7);

  const updatedAt = toDate(d.updated_at) ?? toDate(d.created_at) ?? new Date();

  // The gift box at the foot links to the client's own referral page, when
  // Command Center has the report tied to one of the referral clients.
  let giftLink: string | null = null;
  const referralId = str(d.referral_client_id);
  if (referralId) {
    const ref = await db.collection("referral_clients").doc(referralId).get();
    const t = str(ref.data()?.token);
    if (REPORT_TOKEN_RE.test(t)) giftLink = `/g/${t}`;
  }

  return {
    business: str(d.business),
    siteUrl: /^https?:\/\//i.test(str(d.site_url)) ? str(d.site_url) : "",
    startedMonth: /^\d{4}-\d{2}$/.test(str(d.started_month)) ? str(d.started_month) : null,
    updated: new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric" }).format(updatedAt),
    metrics,
    keywords,
    months,
    work,
    monthList,
    defaultMonth: monthList[0] ?? thisMonth,
    fresh: Date.now() - updatedAt.getTime() < 14 * 86_400_000,
    giftLink,
  };
});

