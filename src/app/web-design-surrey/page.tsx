import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArrowCta from "@/components/ArrowCta";
import HandLabel, { type HandLabelSpec } from "@/components/HandLabel";
import VideoCta from "@/components/VideoCta";
import HomeFooter from "@/components/HomeFooter";
import { CAL_URL, STUDIO_STATS } from "@/data/projects";

/**
 * /web-design-surrey: the service page for "web design surrey" and its
 * variants. The homepage is the brand page; this is the one page Google
 * should send those searches to, so the homepage title no longer targets the
 * phrase and the homepage (TeamIntro) and footer link here instead.
 *
 * Every claim on the page comes from the site's own records: the process and
 * timings from HowWeDoIt, the quotes and results from projects.ts, the stats
 * from STUDIO_STATS. TO CONFIRM before relying on it:
 * - PRICE_RANGE is empty until it can come from real quotes; the line only
 *   renders once it is filled in.
 * - "One clear price before any work begins" (backed by Bloomkey's quote).
 * - The build timing in the FAQ reads "Usually live in ~2–3 weeks" from
 *   HowWeDoIt as the build phase after design approval.
 * - The monthly maintenance and hosting plan is described without a price.
 *
 * Copy rule: no em dashes. Phones get the `short` version of long paragraphs.
 */

const SITE = "https://cloverfield.studio";
const PAGE_URL = `${SITE}/web-design-surrey`;

/** e.g. "Most projects land between $X and $Y." Leave empty to hide the line. */
const PRICE_RANGE = "";

const TITLE = "Web Design Surrey BC | Cloverfield Studio";
const DESCRIPTION =
  "Web design in Surrey, BC for local businesses. We design and build fast websites that bring in calls, bookings and quote requests. Book a free 30-minute call.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "web design surrey",
    "web design surrey bc",
    "website design surrey",
    "web design company surrey",
    "surrey web design",
    "website development surrey",
    "web designer surrey",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description:
      "We design and build websites for local businesses in Surrey and the Lower Mainland, so more visitors call, book or ask for a quote.",
    url: PAGE_URL,
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: `${SITE}/og-image-v2.jpeg`,
        width: 1200,
        height: 630,
        alt: "Cloverfield Studio, web design in Surrey BC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "We design and build websites for local businesses in Surrey and the Lower Mainland, so more visitors call, book or ask for a quote.",
    images: [`${SITE}/og-image-v2.jpeg`],
  },
};

/* ------------------------------------------------------------------ copy */

const SUITS = [
  "Trades and home services",
  "Clinics and therapy practices",
  "Realtors and real estate",
  "Events and hospitality",
  "Photographers and creatives",
  "Shops selling online",
];

const INCLUDED = [
  {
    title: "Research",
    body: "We study your industry, your competitors and your customers before any design work starts, so every decision has a reason behind it.",
  },
  {
    title: "Design for every page",
    body: "You see the full design on desktop and phone, and nothing gets built until you have approved it.",
  },
  {
    title: "A fast, modern build",
    body: "We build on Next.js, or on Shopify if you sell online, and test the site across phones, tablets and desktops.",
  },
  {
    title: "Clear ways to reach you",
    body: "Every page leads to a call, a booking or a quote request, so interested visitors always know the next step.",
  },
  {
    title: "Search and AI readiness",
    body: "Real text, clean page titles, structured data and quick load times help Google and AI assistants read and recommend the site.",
  },
  {
    title: "Launch",
    body: "We handle the technical details and put the site live once you have reviewed it and given us the green light.",
  },
];

const ADD_ONS = [
  {
    title: "Monthly maintenance and hosting",
    body: "We host the site and keep it maintained after launch, so the technical side stays off your plate.",
  },
  {
    title: "Shopify stores",
    body: "Online stores for local brands, designed and built the same way as our websites.",
  },
  {
    title: "Landing pages",
    body: "Focused pages for ads and campaigns that turn visitors into booked calls and customers.",
  },
];

/* Same steps and timings as the homepage's How We Do It. */
const STEPS = [
  {
    name: "Kickoff",
    note: "About 45 minutes of your time",
    body: "We start with one focused call to understand your business, your customers and what the new site needs to do. After that, most of the work is on our side.",
    short: "One focused call about your business and customers, then most of the work is on our side.",
  },
  {
    name: "Research",
    body: "We get deep into your industry before we touch the design, studying your competitors, your customers and what actually makes someone choose you.",
    short: "We study your industry, competitors and customers before we design anything.",
  },
  {
    name: "Design",
    note: "Ready for review in about 1 to 2 weeks",
    body: "We design every page around what your customers are looking for, and you see exactly how it looks and works before we build anything.",
    short: "You see every page designed before anything gets built.",
  },
  {
    name: "Build and launch",
    note: "Usually live in about 2 to 3 weeks",
    body: "Once the design is approved, we build the full site, test it across devices and handle the technical details. You give the green light and we put it live.",
    short: "We build, test and launch the site once you give the green light.",
  },
];

const PRICE_DRIVERS = [
  "How many pages the site needs",
  "Features like online booking, quote forms or an online store",
  "How much of the content, like photos and copy, is ready to go",
  "Connections to tools you already use, such as a booking system or CRM",
];

/* Results and quotes as they appear in projects.ts. */
const WORK = [
  {
    name: "Innovative Aluminum",
    meta: "Railing manufacturer · Aldergrove, BC",
    body: "A railing manufacturer with more than 70 dealers whose old site spoke clearly to neither dealers nor homeowners.",
    result: "60 inquiries in the first 3 months, up from about 7 a year",
    image: "/success/innovative-aluminum.webp",
    position: "center",
    href: "/case-studies/innovative-aluminum",
    cta: "Read the case study",
  },
  {
    name: "WrapCity",
    meta: "Vinyl car wraps",
    body: "A wrap shop that wanted its website to turn heads the way its cars do on the street.",
    result: "+34% booking inquiries and about $40k in pipeline in 3 months",
    image: "/wrapcity-cover.webp",
    position: "center 62%",
    href: "/work",
    cta: "See it in our work",
  },
  {
    name: "Nancy Tran",
    meta: "Realtor · Vancouver",
    body: "A Vancouver realtor who wanted a website she was proud to share with clients.",
    result: "8 qualified buyer leads in the first month",
    image: "/sophia/sophia-cover2-card.webp",
    position: "center",
    href: "/work",
    cta: "See it in our work",
  },
  {
    name: "Bloomkey",
    meta: "Career counselling · Surrey, BC",
    body: "A career counselling and employment coaching practice here in Surrey.",
    result: "Built and launched in 9 days",
    image: "/bloomkey/bloomkey-cover-card.webp",
    position: "center",
    href: "/work",
    cta: "See it in our work",
  },
];

/* Shown on the page and repeated word for word in the FAQPage schema. */
const FAQS = [
  {
    q: "How much does a website cost?",
    a: "It depends on how many pages you need, the features involved and how much of the content is ready. We quote each project after a free 30-minute call, and you get one clear price before any work begins.",
  },
  {
    q: "How long does a website take?",
    a: "The full design is usually ready for review in about 1 to 2 weeks, and the build takes about 2 to 3 weeks after you approve it. Smaller sites can move faster: Bloomkey and Njagih Studios were both built and launched in 9 days.",
  },
  {
    q: "How much of my time will it take?",
    a: "About 45 minutes for the kickoff call, then a review of the design and a review of the finished site. Most of the work in between is on our side.",
  },
  {
    q: "Do you only work with businesses in Surrey?",
    a: "No. We’re based in Surrey and most of our clients are across the Lower Mainland, in places like Vancouver, Burnaby, Langley and Richmond. We also work with a few businesses in the United States.",
  },
  {
    q: "Will my new website show up on Google?",
    a: "We build every site so search engines and AI assistants can read it properly, with real text, structured data and fast pages. Where you rank also depends on your competition and your Google reviews, so we won’t promise a position, but the site gives you a solid starting point.",
  },
  {
    q: "Can you look after the site after launch?",
    a: "Yes. We offer a monthly maintenance and hosting plan, so updates and the technical side are handled for you after the site goes live.",
  },
];

const AREAS = [
  "Surrey",
  "Langley",
  "White Rock",
  "Delta",
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Coquitlam",
  "North Vancouver",
];

/* The same portrait and label placement as the homepage's TeamIntro. */
const LABELS: HandLabelSpec[] = [
  {
    key: "developer",
    title: "The Developer",
    className: "right-[2%] top-[-5%] w-[58%] md:right-[-14%] md:top-[-9%] md:w-[62%]",
  },
  {
    key: "designer",
    title: "The Designer",
    className: "left-[-6%] top-[103%] w-[52%]",
  },
];

/* ------------------------------------------------------------ helpers */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-[family-name:var(--font-geist-sans)] text-[11px] font-medium uppercase tracking-[0.24em] text-black/50 md:text-xs">
      {children}
    </p>
  );
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`max-w-[22ch] text-[clamp(1.875rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] [text-wrap:balance] ${className}`}
    >
      {children}
    </h2>
  );
}

/** Full copy from md up, the one-sentence version on phones. */
function Copy({ full, short }: { full: string; short: string }) {
  return (
    <>
      <span className="md:hidden">{short}</span>
      <span className="hidden md:inline">{full}</span>
    </>
  );
}

const body = "text-[clamp(1rem,1.15vw,1.125rem)] leading-[1.6] text-black/65";

/* --------------------------------------------------------------- page */

export default function WebDesignSurreyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Web design in Surrey, BC",
        serviceType: "Web design",
        description:
          "Website design and development for local businesses in Surrey and the Lower Mainland: research, design of every page, a fast Next.js or Shopify build, search readiness and launch.",
        url: PAGE_URL,
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          ...AREAS.map((name) => ({ "@type": "City", name: `${name}, BC` })),
          { "@type": "Place", name: "Lower Mainland, British Columbia" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Web design in Surrey", item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f9f8f5] font-[family-name:var(--font-outfit)] text-[#1a1613]">
      {/* overflow-clip rounds the closing section's own background, and keeps
          the hand label that runs past the portrait from widening the page. */}
      <main className="relative z-10 overflow-clip rounded-b-[28px] bg-[#f9f8f5] md:rounded-b-[48px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <section
          aria-label="Web design in Surrey"
          className="px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-40"
        >
          <div className="mx-auto max-w-[1200px]">
            <nav aria-label="Breadcrumb" className="font-[family-name:var(--font-geist-sans)] text-[13px] text-black/50">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-black">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-black/25">/</li>
                <li aria-current="page" className="text-black/80">
                  Web design in Surrey
                </li>
              </ol>
            </nav>

            <div className="mt-12 grid grid-cols-1 items-center gap-x-16 gap-y-20 md:mt-16 md:grid-cols-12">
              <div className="md:col-span-7">
                <Eyebrow>Cloverfield Studio · Surrey, BC</Eyebrow>
                <h1 className="text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
                  Web design in Surrey, BC
                </h1>
                <p className="mt-7 max-w-[44ch] text-[clamp(1.0625rem,1.35vw,1.3125rem)] leading-[1.5] text-black/70 md:mt-9">
                  <Copy
                    full="We design and build websites for local businesses in Surrey and across the Lower Mainland, so more of the people who find you online decide to call, book or ask for a quote."
                    short="We design and build websites for Surrey businesses, so more visitors call, book or ask for a quote."
                  />
                </p>
                <p className="mt-4 hidden max-w-[52ch] text-[15px] leading-[1.6] text-black/50 md:block">
                  It suits trades, clinics, realtors, photographers and hospitality businesses whose
                  website no longer matches the quality of their work.
                </p>
                <div data-track="service-hero" className="mt-9 md:mt-11">
                  <ArrowCta href={CAL_URL} note="A 30-minute call about your business.">
                    Book a free call
                  </ArrowCta>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="relative mx-auto mb-10 w-full max-w-[340px] md:mr-[6%] md:max-w-[420px]">
                  <Image
                    src="/team.webp"
                    alt="The two of us behind Cloverfield Studio, the designer and the developer"
                    width={1050}
                    height={1201}
                    priority
                    sizes="(max-width: 767px) 340px, 420px"
                    className="block h-auto w-full"
                  />
                  {LABELS.map((label) => (
                    <HandLabel key={label.key} label={label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Results" className="px-6 md:px-10">
          <div className="mx-auto max-w-[1200px] border-t border-black/10 pt-10 md:pt-12">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
              {STUDIO_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end gap-2">
                  <dt className="text-sm text-black/55 md:text-[15px]">{stat.label}</dt>
                  <dd className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">
                    {stat.prefix}
                    {stat.value.toLocaleString("en-CA")}
                    {stat.suffix}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-[13px] text-black/45">
              Across all our clients over roughly the past year and a half.
            </p>
          </div>
        </section>

        {/* The service */}
        <section aria-label="The service" className="px-6 py-24 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow>The service</Eyebrow>
              <H2>A website designed around how your customers choose</H2>
              <p className={`mt-7 max-w-[56ch] ${body}`}>
                <Copy
                  full="Web design is how your website looks, reads and works on every screen. We start with your customers: what they search for, what they compare, and what makes them choose one business over another. Then we design every page around those answers and build it as a fast, modern site that people, Google and AI assistants can all understand."
                  short="We design every page around what your customers are looking for, then build it as a fast, modern site."
                />
              </p>
            </div>
            <div className="md:col-span-5 md:pt-14">
              <p className="mb-4 font-[family-name:var(--font-geist-sans)] text-[11px] font-medium uppercase tracking-[0.24em] text-black/50 md:text-xs">
                Who it suits
              </p>
              <ul className="border-t border-black/10">
                {SUITS.map((item) => (
                  <li
                    key={item}
                    className="border-b border-black/10 py-4 text-[17px] font-medium tracking-[-0.01em] md:text-lg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section aria-label="What's included" className="px-3 md:px-10">
          <div className="mx-auto max-w-[1280px] rounded-[28px] bg-white px-6 py-16 md:rounded-[40px] md:px-14 md:py-24">
            <div className="mx-auto max-w-[1100px]">
              <Eyebrow>What&rsquo;s included</Eyebrow>
              <H2>Everything it takes to get the site live</H2>
              <p className={`mt-6 max-w-[52ch] ${body}`}>
                <Copy
                  full="Every project covers the full job, from research to launch, so you deal with one small team from the first call to launch day."
                  short="One small team handles everything from the first call to launch day."
                />
              </p>

              <ol className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-y-14">
                {INCLUDED.map((item, i) => (
                  <li key={item.title} className="border-t border-black/10 pt-6">
                    <span className="font-[family-name:var(--font-geist-sans)] text-xs tabular-nums text-black/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-[19px] font-medium tracking-[-0.015em]">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-[1.6] text-black/60">{item.body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-16 rounded-[20px] bg-[#f9f8f5] p-6 md:mt-24 md:p-10">
                <p className="font-[family-name:var(--font-geist-sans)] text-[11px] font-medium uppercase tracking-[0.24em] text-black/50 md:text-xs">
                  Also available
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3">
                  {ADD_ONS.map((item) => (
                    <li key={item.title}>
                      <h3 className="text-[17px] font-medium tracking-[-0.01em]">{item.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-[1.6] text-black/60">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section aria-label="How it works" className="px-6 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>How it works</Eyebrow>
                <H2>Four steps from the first call to launch</H2>
              </div>
              <Link
                href="/#how-we-do-it"
                className="self-start text-[15px] font-medium text-black/60 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black md:self-auto"
              >
                See the full process
              </Link>
            </div>

            <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.name} className="border-t border-black/15 pt-6">
                  <span className="font-[family-name:var(--font-geist-sans)] text-xs tabular-nums text-black/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[clamp(1.375rem,2vw,1.625rem)] font-semibold tracking-[-0.025em]">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-black/60">
                    <Copy full={step.body} short={step.short} />
                  </p>
                  {step.note && (
                    <p className="mt-4 inline-block rounded-full bg-black/[0.05] px-3 py-1.5 text-[13px] text-black/65">
                      {step.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section aria-label="Pricing" className="px-6 pb-24 md:px-10 md:pb-36">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-x-16 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow>Pricing</Eyebrow>
              <H2>What a website costs</H2>
              <p className={`mt-7 max-w-[54ch] ${body}`}>
                <Copy
                  full="Every business needs something a little different, so we quote each project after the first call, once we understand what the site has to do. You get one clear price for the whole project before any work begins."
                  short="We quote each project after the first call, with one clear price before any work begins."
                />
              </p>
              {PRICE_RANGE && <p className={`mt-4 max-w-[54ch] ${body}`}>{PRICE_RANGE}</p>}

              <h3 className="mt-12 text-[17px] font-medium tracking-[-0.01em]">What changes the price</h3>
              <ul className="mt-4 border-t border-black/10">
                {PRICE_DRIVERS.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-black/10 py-4 text-[15px] leading-[1.55] text-black/70 md:text-base">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-black/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="rounded-[24px] bg-[#1a1613] p-8 text-white md:col-span-5 md:mt-16 md:p-10">
              <svg aria-hidden viewBox="0 0 32 24" className="h-6 w-8 text-white/30" fill="currentColor">
                <path d="M0 24V14.4C0 6.6 4.3 1.6 12.2 0l1.3 3C9 4.4 6.9 7.2 6.6 11h6.2v13H0Zm19.2 0V14.4C19.2 6.6 23.5 1.6 31.4 0l1.3 3c-4.5 1.4-6.6 4.2-6.9 8H32v13H19.2Z" />
              </svg>
              <blockquote className="mt-6 text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]">
                What they quoted is what we paid. No surprise add-ons at the end.
              </blockquote>
              <figcaption className="mt-8 border-t border-white/15 pt-5 text-[15px]">
                <span className="block font-medium">Mishele, Founder of Bloomkey</span>
                <span className="mt-0.5 block text-white/55">Career counselling in Surrey, BC</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Recent work */}
        <section aria-label="Recent work" className="px-6 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <Eyebrow>Recent work</Eyebrow>
            <H2>Websites we&rsquo;ve built for local businesses</H2>

            <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2 md:gap-y-20">
              {WORK.map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-black/[0.04]">
                      <Image
                        src={p.image}
                        alt={`${p.name} website by Cloverfield Studio`}
                        fill
                        sizes="(max-width: 767px) 100vw, 600px"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        style={{ objectPosition: p.position }}
                      />
                    </div>
                    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="text-[22px] font-semibold tracking-[-0.025em]">{p.name}</h3>
                      <p className="text-sm text-black/50">{p.meta}</p>
                    </div>
                    <p className="mt-2 max-w-[48ch] text-[15px] leading-[1.6] text-black/60">{p.body}</p>
                    <p className="mt-4 text-[17px] font-medium leading-[1.4] tracking-[-0.01em]">{p.result}</p>
                    <span className="mt-4 inline-block text-[15px] font-medium text-black/60 underline decoration-black/25 underline-offset-4 transition-colors group-hover:text-black">
                      {p.cta}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-16 md:mt-20">
              <ArrowCta href="/work">See all projects</ArrowCta>
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <section aria-label="Client quote" className="px-6 py-24 md:px-10 md:py-36">
          <figure className="mx-auto max-w-[900px] text-center">
            <blockquote className="text-[clamp(1.5rem,3vw,2.375rem)] font-medium leading-[1.25] tracking-[-0.025em] [text-wrap:balance]">
              &ldquo;I sent them my photos and answered one call. Nine days later the site was live. I did
              almost nothing.&rdquo;
            </blockquote>
            <figcaption className="mt-9 flex items-center justify-center gap-4 text-left">
              <Image
                src="/Njagih/njagih-headshot-v2.webp"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <span className="text-[15px]">
                <span className="block font-medium">Israel Njagih</span>
                <span className="block text-black/55">Owner, Njagih Studios</span>
              </span>
            </figcaption>
          </figure>
        </section>

        {/* FAQ */}
        <section aria-label="Questions" className="px-6 md:px-10">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-32">
                <Eyebrow>Questions</Eyebrow>
                <H2>What people ask before they start</H2>
              </div>
            </div>
            <div className="border-t border-black/10 md:col-span-7">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="group border-b border-black/10">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[17px] font-medium tracking-[-0.01em] md:text-lg [&::-webkit-details-marker]:hidden">
                    {q}
                    <span aria-hidden className="relative mt-[0.45em] h-3.5 w-3.5 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-7 text-[15px] leading-[1.65] text-black/65 md:text-base">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Service area */}
        <section aria-label="Where we work" className="px-6 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1200px] border-t border-black/10 pt-14 md:pt-20">
            <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <Eyebrow>Where we work</Eyebrow>
                <H2>Web design across Surrey and the Lower Mainland</H2>
              </div>
              <div className="md:col-span-5 md:pt-12">
                <p className={body}>
                  <Copy
                    full="We’re a two-person studio based in Surrey, working with businesses in every part of the city, including Cloverdale, Fleetwood, Newton, Guildford, City Centre and South Surrey. Beyond Surrey, our clients are spread across the Lower Mainland, and because most of a project happens over a few calls, distance rarely matters."
                    short="We’re based in Surrey and work with businesses across the city and the rest of the Lower Mainland."
                  />
                </p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {AREAS.map((area) => (
                    <li key={area} className="rounded-full border border-black/15 px-3.5 py-1.5 text-sm text-black/70">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The homepage's closing reel and review field, tagged for this page. */}
        <VideoCta source="web-design" onPaper />
      </main>

      <HomeFooter />
    </div>
  );
}
