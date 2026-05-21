import type { MetadataRoute } from "next";

const SITE = "https://cloverfield.studio";

// Existing case studies with dedicated pages. Add new slugs here as they ship.
const CASE_STUDY_SLUGS = ["innovative-aluminum"];

// Planned service pages — uncomment as each goes live so it's instantly indexable.
// Keeping commented (not in sitemap) avoids 404s being submitted to Google.
const SERVICE_SLUGS: string[] = [
  // "realtor-websites",
  // "photographer-websites",
  // "local-business-websites",
  // "landing-page-design",
];

// Planned location pages — same pattern: only list when published.
const LOCATION_SLUGS: string[] = [
  // "vancouver",
  // "burnaby",
  // "langley",
  // "richmond",
];

// Planned articles in /insights — uncomment as each goes live.
const INSIGHTS_SLUGS: string[] = [
  // "small-business-website-cost-canada",
  // "ai-search-optimization-guide",
  // "wordpress-vs-nextjs-small-business",
  // "website-launch-checklist",
  // "realtor-website-design-guide",
  // "lighthouse-100-how-we-do-it",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/approach`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const caseStudyEntries: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map(
    (slug) => ({
      url: `${SITE}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    })
  );

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const locationEntries: MetadataRoute.Sitemap = LOCATION_SLUGS.map((slug) => ({
    url: `${SITE}/web-design/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const insightsEntries: MetadataRoute.Sitemap = INSIGHTS_SLUGS.map((slug) => ({
    url: `${SITE}/insights/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...caseStudyEntries,
    ...serviceEntries,
    ...locationEntries,
    ...insightsEntries,
  ];
}
