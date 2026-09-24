import { projects, STUDIO_STATS, CAL_URL } from "@/data/projects";

/**
 * /llms.txt: the plain-text brief AI assistants read about the studio.
 * The intro is written here; the stats and every project come from
 * src/data/projects.ts, so a project added to /work shows up here on the
 * next deploy. Built once at build time.
 */

export const dynamic = "force-static";

const SITE = "https://cloverfield.studio";

// Projects with their own write-up on the site, by project id.
const CASE_STUDIES: Record<number, string> = {
  12: `${SITE}/case-studies/innovative-aluminum`,
  13: `${SITE}/case-studies/caddie-companion`,
};

const INTRO = `# Cloverfield Studio

> Cloverfield Studio is a two-person web design and development studio in Surrey, British Columbia, Canada: a designer and a developer. We make websites that bring in customers, mostly for local businesses across the Lower Mainland (Surrey, Vancouver, Burnaby, Langley, Richmond), plus a few clients in the US.

Most people meet a business online first. We make a business look as established online as it is in real life, then make it easier for the right customers to understand why it's worth choosing.

How we work:

- We start with one focused call to understand the business, its customers, and what the new site needs to do. After that, most of the work is on our side.
- We get deep into the client's industry before designing: competitors, customers, and what actually makes someone choose them.
- Every page is designed around what the client's customers are looking for, so more visitors call, book, or ask for a quote. The client sees the full design before anything is built.
- We build, test, and launch the site, and document outcomes with named clients and real numbers.

## Services

- [Web Design](${SITE}): Websites designed around what your customers are looking for, so more visitors call, book, or ask for a quote. For local businesses in Surrey, Vancouver, and the Lower Mainland.
- [Web Development](${SITE}): Fast, modern websites built with Next.js.
- [Lead-Generating Landing Pages](${SITE}): Conversion-focused landing pages that turn visitors into booked calls and customers.
- [Shopify Stores](${SITE}/work): Shopify stores designed and built for local brands selling online.
- [Sight](${SITE}/sight): Our own product. Sight connects a business's spreadsheets, CRM, and accounting into one screen, with an AI that answers questions about the whole business and alerts that catch problems before they cost money. Live in 45 days or the client doesn't pay.`;

const OUTRO = `## Pages

- [Homepage](${SITE}): Overview of Cloverfield Studio's services, recent work, and free consultation booking.
- [Work](${SITE}/work): Full portfolio of recent projects.
- [Sight](${SITE}/sight): Sight by Cloverfield, one dashboard and AI for the whole business. Demos book through a 15-minute call.
- [Book a free consultation](${CAL_URL}): 30-minute call via Cal.com.

## Contact

Surrey, British Columbia, Canada. Booking link: ${CAL_URL}

## Service area

Surrey BC, Vancouver BC, Burnaby BC, Langley BC, Richmond BC, Coquitlam BC, Delta BC, White Rock BC, North Vancouver BC, West Vancouver BC, Lower Mainland, British Columbia, Canada. A few clients are in the United States.`;

function stats() {
  const lines = STUDIO_STATS.map(
    (s) => `- ${s.label}: ${s.prefix}${s.value.toLocaleString("en-US")}${s.suffix}`,
  );
  // Most of the inquiries came from clients whose projects can't be shown
  // (their logos can), so the listed work doesn't add up to the total.
  const note = [
    "Combined across all clients over roughly the past year and a half. " +
      "Some client projects are confidential, so not every result is listed under Work.",
    "Conversion lift is the average increase in the share of visitors who become inquiries. " +
      "More inquiries is the average increase in total inquiries per client.",
  ].join("\n\n");
  return `## Results across our work\n\n${lines.join("\n")}\n\n${note}`;
}

function work() {
  const entries = projects.map((p) => {
    const title = p.url ? `[${p.name}](${p.url})` : p.name;
    const lines = [`### ${title}`, "", p.description];
    if (p.tags.length) lines.push(`- Industry: ${p.tags.join(", ")}`);
    if (p.kpis?.length) lines.push(`- Results: ${p.kpis.join("; ")}`);
    if (p.partnerLogos?.length) {
      lines.push(`- Partners: ${p.partnerLogos.map((l) => l.name).join(", ")}`);
    }
    if (CASE_STUDIES[p.id]) lines.push(`- Case study: ${CASE_STUDIES[p.id]}`);
    if (p.quote) {
      lines.push(`- Client quote: "${p.quote.texts.join(" ")}" (${p.quote.author}, ${p.quote.role})`);
    }
    return lines.join("\n");
  });
  return `## Work\n\n${entries.join("\n\n")}`;
}

export function GET() {
  const body = [INTRO, stats(), work(), OUTRO].join("\n\n") + "\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
