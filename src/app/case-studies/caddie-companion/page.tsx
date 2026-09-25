import type { Metadata } from "next";
import Link from "next/link";
import HomeFooter from "@/components/HomeFooter";
import { CAL_URL } from "@/data/projects";
import CaseStudyHeroVideo from "@/components/CaseStudyHeroVideo";
import CaseStudySidebar from "@/components/CaseStudySidebar";
import CaddieExplodedView from "@/components/CaddieExplodedView";
import ReviewField from "@/components/ReviewField";
import LazyLoopVideo from "@/components/LazyLoopVideo";

// Built from the Innovative Aluminum case study template. Assets live in
// public/caddie/ (screenshots, PageSpeed report, the 3D model).

const SECTIONS = [
  { id: "mission", label: "Mission" },
  {
    id: "solution",
    label: "Solution",
    children: [
      { id: "solution-clarity", label: "Clear product" },
      { id: "solution-trust", label: "Trust" },
      { id: "solution-launch", label: "After launch" },
    ],
  },
  { id: "result", label: "Result" },
  { id: "reflection", label: "Reflection" },
];

export const metadata: Metadata = {
  title: "Caddie Companion Case Study | Cloverfield Studio",
  description:
    "How Cloverfield Studio rebuilt Caddie Companion's store and stayed on after launch to keep improving it: 21% more visitors turned into buyers, enough for the owner to scale up his ads.",
  keywords: [
    "headless Shopify case study",
    "ecommerce conversion rate optimization",
    "Shopify store redesign",
    "golf product website",
    "Three.js product viewer",
    "Cloverfield Studio case study",
    "Caddie Companion",
    "Surrey BC web design",
  ],
  alternates: {
    canonical: "https://cloverfield.studio/case-studies/caddie-companion",
  },
  openGraph: {
    title: "Caddie Companion Case Study | Cloverfield Studio",
    description:
      "21% more visitors turned into buyers. Inside Cloverfield Studio's rebuild of a six-in-one golf multi-tool store, and the six weeks after launch.",
    url: "https://cloverfield.studio/case-studies/caddie-companion",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "article",
    images: [
      {
        url: "https://cloverfield.studio/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Caddie Companion Case Study by Cloverfield Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caddie Companion Case Study | Cloverfield Studio",
    description:
      "21% more visitors turned into buyers. Inside the rebuild of a six-in-one golf multi-tool store, and the six weeks after launch.",
    images: ["https://cloverfield.studio/og-image.jpeg"],
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/55 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
      {children}
    </p>
  );
}

export default function CaddieCompanionCaseStudy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline":
          "Caddie Companion: 21% more visitors turned into buyers.",
        "description":
          "How Cloverfield Studio rebuilt Caddie Companion's store on headless Shopify and stayed on for six weeks after launch to improve conversions: 21% more visitors turned into buyers, enough for the owner to confidently scale up his ads.",
        "image": "https://cloverfield.studio/og-image.jpeg",
        "datePublished": "2026-09-23",
        "dateModified": "2026-09-23",
        "author": {
          "@type": "Organization",
          "name": "Cloverfield Studio",
          "url": "https://cloverfield.studio",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Cloverfield Studio",
          "url": "https://cloverfield.studio",
        },
        "about": {
          "@type": "Organization",
          "name": "Caddie Companion",
          "url": "https://www.caddiecompanion.com",
          "description":
            "Maker of a six-in-one golf multi-tool: divot repair fork, magnetic ball markers, T25 Torx driver, knife, bottle opener and groove brush in one milled frame.",
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://cloverfield.studio/case-studies/caddie-companion",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cloverfield.studio",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Work",
            "item": "https://cloverfield.studio/work",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Caddie Companion",
            "item": "https://cloverfield.studio/case-studies/caddie-companion",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-black">
      {/* The white block lifts off the pinned footer, as on the homepage. */}
      <main className="relative z-10 rounded-b-[28px] bg-white md:rounded-b-[48px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <section className="pt-32 md:pt-40 pb-10 md:pb-14 px-6 md:px-10">
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1100px] mx-auto text-[13px] font-[family-name:var(--font-geist-sans)] text-black/55"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-black/30">/</li>
            <li>
              <Link href="/work" className="hover:text-black transition-colors">
                Work
              </Link>
            </li>
            <li aria-hidden className="text-black/30">/</li>
            <li aria-current="page" className="text-black/85">
              Caddie Companion
            </li>
          </ol>
        </nav>
      </section>

      {/* Title block: heading row + content row align across columns */}
      <section className="px-6 md:px-10 mb-16 md:mb-24">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-10 md:gap-x-12 lg:gap-x-16 gap-y-6 md:gap-y-8">
          <h1 className="md:col-span-8 order-1 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05]">
            Caddie Companion
          </h1>

          <h2 className="md:col-span-4 order-3 md:order-2 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05] mt-6 md:mt-0">
            Scope
          </h2>

          <div className="md:col-span-8 order-2 md:order-3">
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch] mb-4">
              Caddie Companion makes a six-in-one golf multi-tool, sold online for $49 and promoted through paid ads. The tool itself is well made, but the store it was selling from was a slow GoDaddy template that never really explained what the tool does or why a golfer would want one in their pocket.
            </p>
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch]">
              We rebuilt the store from the ground up in two and a half weeks, then stayed close to the owner for six weeks after launch, testing and adjusting things while the ads ran. The new store turns 21% more of its visitors into buyers, which gave the owner the confidence to scale up his ads.
            </p>
          </div>

          <div className="order-4 md:col-span-4">
            <ul className="text-base md:text-lg text-black/80 space-y-1.5 font-[family-name:var(--font-geist-sans)]">
              <li>Store redesign</li>
              <li>Headless Shopify build</li>
              <li>3D product viewer</li>
              <li>Conversion optimization</li>
              <li>Launch and ad support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hero video: scroll-driven scale */}
      <section className="px-3 md:px-10 mb-16 md:mb-24">
        <div className="max-w-[1600px] mx-auto">
          <CaseStudyHeroVideo
            src="/success/caddie-companion.mp4"
            mobileSrc="/caddie/hero-mobile.mp4"
            poster="/caddie/hero-poster.webp"
            aspectRatio="1920 / 1050"
            ariaLabel="Live preview of the Caddie Companion store built by Cloverfield Studio"
            href="https://www.caddiecompanion.com/"
          />
        </div>
      </section>

      {/* Stat strip: outcome teaser */}
      <section className="px-6 md:px-10 mb-24 md:mb-40">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-black/15 pt-8 md:pt-10">
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              +21%
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              More visitors turned into buyers
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              6 weeks
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Of hands-on tuning after launch
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              2.5 weeks
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              From kickoff to a live store
            </p>
          </div>
        </div>
      </section>

      {/* Content body with sticky sidebar */}
      <div className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[150px_minmax(0,1fr)] gap-10 md:gap-12 lg:gap-20">
          <aside className="md:-ml-6 lg:-ml-10">
            <CaseStudySidebar sections={SECTIONS} />
          </aside>

          <div className="min-w-0 flex flex-col gap-24 md:gap-36">
            {/* Mission */}
            <section id="mission" className="scroll-mt-32">
              <Eyebrow>The Mission</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                Get the store to <span className="text-[#16a34a]">sell</span> the tool.
              </h2>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                The old store had a well-made product behind it but did very little to sell it, and too many visitors left before they understood what the tool actually does. The goal was to make the store clear enough that a golfer gets it within a few seconds of landing, and to make it convert well enough that the owner could confidently spend more on ads, then keep improving it once real buyers started coming through.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <figure>
                  <img
                    src="/caddie/store-before.webp"
                    alt="The old Caddie Companion store on GoDaddy: a stock photo of two golfers and the headline 'Caddie Companion Golf Equipment'."
                    width={1600}
                    height={807}
                    className="w-full h-auto rounded-xl border border-black/10"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
                    Before: the old GoDaddy store
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src="/caddie/store-after.webp"
                    alt="The new Caddie Companion store: the tool fanned open on grass under the headline '6-in-1 Golf Multi-Tool. Everything but the swing.'"
                    width={1600}
                    height={807}
                    className="w-full h-auto rounded-xl border border-black/10"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
                    After: the new store
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Solution */}
            <section id="solution" className="scroll-mt-32 flex flex-col gap-20 md:gap-28">
              <div id="solution-clarity" className="scroll-mt-32">
                <Eyebrow>Solution · 01</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Make the store explain the tool as well as the owner does.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  A six-in-one tool is hard to picture from a single photo, and people rarely buy something they can&apos;t quite picture. We built an interactive 3D model that takes the tool apart as you scroll, then walked through all six tools one at a time, so a golfer knows exactly what they&apos;re getting within a few seconds of landing. New product video and photography did the rest.
                </p>
                <CaddieExplodedView />

                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mt-12 md:mt-16 mb-6">
                  Because the store only sells one product, we left out the usual product grid and add-to-cart step entirely. An order button with the price and the free shipping offer stays pinned to the top of the screen on every page, so a golfer can buy the moment they&apos;re convinced, wherever they are on the page.
                </p>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  We also rebuilt the store to load quickly, since a slow page quietly undoes all of that. It went from scoring around 30 on PageSpeed to 99, with Shopify still handling products, checkout and orders behind the scenes, so the owner manages everything from the same Shopify admin he already knew.
                </p>
                <div className="border-t border-black/15 pt-8 md:pt-10">
                  <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/55 font-medium font-[family-name:var(--font-geist-sans)] mb-6">
                    PageSpeed · caddiecompanion.com
                  </p>
                  <img
                    src="/caddie/pagespeed.png"
                    alt="PageSpeed Insights for caddiecompanion.com: 99 Performance, 93 Accessibility, 100 Best Practices, 100 SEO."
                    className="w-full max-w-[640px] h-auto rounded-xl border border-black/10"
                  />
                </div>
              </div>

              <div id="solution-trust" className="scroll-mt-32">
                <Eyebrow>Solution · 02</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Give buyers a reason to trust a brand they&apos;ve never heard of.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  Most people landing on the store had never heard of Caddie Companion, so once they understood the tool, the next thing they needed was a reason to believe in it. We went through the owner&apos;s footage and photos and put the best of it where buyers actually look: short clips of the tool in use on the course, real photos of golfers using it, and verified reviews placed right next to the order button.
                </p>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  <div className="col-span-2 aspect-[16/10] overflow-hidden rounded-xl border border-black/10 bg-black/[0.04]">
                    <LazyLoopVideo
                      src="/caddie/divot.mp4"
                      poster="/caddie/divot-poster.webp"
                      label="The Caddie Companion's divot tool repairing a pitch mark on a green."
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/[0.04]">
                    <LazyLoopVideo
                      src="/caddie/pocket.mp4"
                      poster="/caddie/pocket-poster.webp"
                      label="The Caddie Companion in use on the course."
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div id="solution-launch" className="scroll-mt-32">
                <Eyebrow>Solution · 03</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Stay on after launch to keep improving it.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  Launch day is when a store finally meets real buyers, so that&apos;s when we paid the closest attention. For six weeks after launch, we worked alongside the owner, helped him build and audit his ads as he scaled them up, and kept adjusting the store based on how visitors were actually buying.
                </p>

                <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl md:text-2xl tracking-tight leading-snug mb-4 max-w-[30ch]">
                  The change that stood out was a discount you play for.
                </h3>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-8">
                  Instead of a plain discount banner, first-time visitors pick one of three ball markers to reveal their code. It only takes one tap and it fits the product, and more than a quarter of visitors now play it. About half of all orders come through with a code from it.
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-[560px] mb-12 md:mb-14">
                  <figure>
                    <img
                      src="/caddie/popup-pick.webp"
                      alt="Caddie Companion pop-up on mobile: 'Pick your marker. Three markers, one hidden discount.'"
                      className="w-full h-auto rounded-xl border border-black/10"
                      loading="lazy"
                    />
                    <figcaption className="mt-3 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
                      Pick a marker
                    </figcaption>
                  </figure>
                  <figure>
                    <img
                      src="/caddie/popup-reveal.webp"
                      alt="The same pop-up after a tap: the marker flips to reveal 20% off and a code to copy."
                      className="w-full h-auto rounded-xl border border-black/10"
                      loading="lazy"
                    />
                    <figcaption className="mt-3 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
                      Reveal the discount
                    </figcaption>
                  </figure>
                </div>

                <div className="flex flex-col gap-6 md:gap-7 max-w-[62ch]">
                  {[
                    {
                      lead: "A/B testing.",
                      body: "We tested different versions of the store against each other on live traffic and kept whichever one sold more.",
                    },
                    {
                      lead: "Bundles and upsells.",
                      body: "We added a buy-two offer with free shipping and suggested add-ons at the right moment, so more orders include more than one tool.",
                    },
                  ].map(({ lead, body }) => (
                    <p
                      key={lead}
                      className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)]"
                    >
                      <span className="font-semibold text-black">{lead}</span> {body}
                    </p>
                  ))}
                </div>

                <div className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl bg-black text-white p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
                  <div
                    aria-hidden="true"
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#16a34a]/20 blur-3xl pointer-events-none"
                  />
                  <div className="relative">
                    <h3 className="font-[family-name:var(--font-outfit)] font-bold text-2xl md:text-[2.2rem] tracking-tight leading-[1.1] mb-4 max-w-[20ch]">
                      Want to know where your store is losing buyers?
                    </h3>
                    <p className="text-sm md:text-base text-white/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[44ch]">
                      Send us your site and we&apos;ll show you what we&apos;d change first.
                    </p>
                  </div>
                  <ReviewField source="case-caddie" tone="dark" className="relative lg:max-w-[26rem]" />
                </div>
              </div>
            </section>

            {/* Result */}
            <section id="result" className="scroll-mt-32">
              <Eyebrow>The Result</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-10 max-w-[26ch]">
                From kickoff to today.
              </h2>

              <dl className="grid grid-cols-[auto_1fr] gap-x-8 md:gap-x-16 gap-y-5 md:gap-y-6">
                {[
                  {
                    when: "Kickoff",
                    event: "We had one call with the owner to understand the product and the people buying it. From there, most of the work was on our side.",
                  },
                  {
                    when: "Launch",
                    event: "We launched the new store two and a half weeks after kickoff.",
                  },
                  {
                    when: "Next 6 weeks",
                    event:
                      "We tested different versions of the store, added bundles and the marker pop-up, and helped build and audit his ads as he scaled them up.",
                  },
                  {
                    when: "Today",
                    event:
                      "The store turns 21% more of its visitors into buyers, and the owner has scaled up his ads with confidence. We still hop on a call whenever he needs a hand.",
                  },
                ].map(({ when, event }) => (
                  <div key={when} className="contents">
                    <dt className="font-[family-name:var(--font-outfit)] font-medium text-xs md:text-sm tracking-[0.18em] uppercase text-black/55 pt-1.5">
                      {when}
                    </dt>
                    <dd className="font-[family-name:var(--font-outfit)] font-light text-lg md:text-2xl tracking-tight leading-snug text-black/85">
                      {event}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="scroll-mt-32">
              <Eyebrow>Reflection</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                The work that mattered most happened after launch.
              </h2>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch]">
                A clear, well-made store is what earns the first sale, but what kept the conversion rate climbing was staying close once real buyers arrived. Watching how people actually used the store, testing small changes and adjusting things alongside the owner as he grew his ads is where a lot of the gain came from, and it&apos;s the part of the work most stores never get.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-32 md:pb-48 pt-12 md:pt-16 border-t border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-end">
            <div className="md:col-span-8">
              <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/55 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
                Next move
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.6rem)] tracking-tight leading-[1.05] max-w-[22ch]">
                Want a store that sells like this one?
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 md:px-10 md:py-5 rounded-full bg-black text-white text-sm md:text-base uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-black/80 transition-all duration-300 cursor-book"
              >
                Book A Free Call
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-24 pt-8 border-t border-black/10 flex items-center justify-between text-xs text-black/55 font-[family-name:var(--font-geist-sans)] tracking-wide">
            <span>Cloverfield Studio · 2026</span>
            <Link
              href="/work"
              className="hover:text-black transition-colors cursor-view"
            >
              See more work
            </Link>
          </div>
        </div>
      </section>
      </main>

      <HomeFooter />
    </div>
  );
}
