import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoReport from "@/components/report/SeoReport";
import { getReportByToken } from "@/lib/seoReports";

// An SEO client's live report (Nov 2026): what we're working on and their
// results each month, no login. Made and filled in from Command Center's SEO
// reports page, which hands out this link.

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const report = await getReportByToken(token);
  const title = report ? `${report.business} SEO report · Cloverfield Studio` : "SEO report · Cloverfield Studio";
  return {
    title,
    robots: { index: false, follow: false },
    // Its own preview with no og:url, so a shared link opens this report
    // rather than the homepage the layout's tags point to.
    openGraph: {
      title,
      description: "What we're working on and how it's going, updated as we go.",
      siteName: "Cloverfield Studio",
      locale: "en_CA",
      type: "website",
      images: [{ url: "https://cloverfield.studio/og-image-v2.jpeg", width: 1200, height: 630, alt: "Cloverfield Studio" }],
    },
    twitter: { card: "summary_large_image", title, images: ["https://cloverfield.studio/og-image-v2.jpeg"] },
  };
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params;
  const report = await getReportByToken(token);
  if (!report) notFound();
  return <SeoReport report={report} />;
}
