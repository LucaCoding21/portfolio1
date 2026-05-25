import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import CaseStudyHeroVideo from "@/components/CaseStudyHeroVideo";
import CaseStudySidebar from "@/components/CaseStudySidebar";

const SECTIONS = [
  { id: "mission", label: "Mission" },
  {
    id: "solution",
    label: "Solution",
    children: [
      { id: "solution-visual", label: "Premium look" },
      { id: "solution-tool", label: "Designer Tool" },
      { id: "solution-ai", label: "AI search" },
    ],
  },
  { id: "result", label: "Result" },
  { id: "reflection", label: "Reflection" },
];

export const metadata: Metadata = {
  title: "Innovative Aluminum Systems Case Study | Cloverfield Studio",
  description:
    "How Cloverfield Studio rebuilt Innovative Aluminum's website so Claude recommends them by name. Two weeks after launch. New leads. New referral source.",
  keywords: [
    "aluminum railing website design",
    "manufacturer web design case study",
    "B2B web design case study",
    "AI SEO case study",
    "AI search optimization",
    "Claude recommends",
    "Cloverfield Studio case study",
    "Innovative Aluminum Systems",
    "Surrey BC web design",
    "premium website design",
  ],
  alternates: {
    canonical:
      "https://cloverfield.studio/case-studies/innovative-aluminum",
  },
  openGraph: {
    title:
      "Innovative Aluminum Systems Case Study | Cloverfield Studio",
    description:
      "Two weeks after launch, Claude recommends Innovative Aluminum by name. Inside Cloverfield Studio's rebuild of a 20-year Canadian aluminum railing manufacturer's website.",
    url: "https://cloverfield.studio/case-studies/innovative-aluminum",
    siteName: "Cloverfield Studio",
    locale: "en_CA",
    type: "article",
    images: [
      {
        url: "https://cloverfield.studio/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Innovative Aluminum Systems Case Study by Cloverfield Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Innovative Aluminum Systems Case Study | Cloverfield Studio",
    description:
      "Two weeks after launch, Claude recommends Innovative Aluminum by name. Inside the rebuild of a 20-year Canadian aluminum railing manufacturer's website.",
    images: ["https://cloverfield.studio/og-image.jpeg"],
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
      {children}
    </p>
  );
}

function ClaudeMention() {
  return (
    <a
      href="https://claude.ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Claude by Anthropic"
      className="inline-flex items-center gap-1.5 text-[#cc785c] font-medium align-[-0.05em] whitespace-nowrap"
    >
      <img
        src="/claude123.svg"
        alt=""
        aria-hidden="true"
        className="h-[0.95em] w-[0.95em]"
      />
      Claude
    </a>
  );
}

function Placeholder({
  label,
  ratio = "16/9",
}: {
  label: string;
  ratio?: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden bg-black/[0.04] rounded-xl"
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-black/35 font-[family-name:var(--font-geist-sans)] leading-relaxed max-w-[60ch]">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function InnovativeAluminumCaseStudy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline":
          "Two weeks after launch, Claude recommends Innovative Aluminum by name.",
        "description":
          "How Cloverfield Studio rebuilt Innovative Aluminum's website so AI assistants like Claude recommend them by name. Two weeks. New leads. A new referral source on their dealer application form.",
        "image": "https://cloverfield.studio/og-image.jpeg",
        "datePublished": "2026-05-18",
        "dateModified": "2026-05-20",
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
          "name": "Innovative Aluminum Systems",
          "url": "https://innovativealuminum.com",
          "description":
            "Canadian manufacturer of premium aluminum railing systems, based in Aldergrove, BC. Founded 2004. Sells exclusively through 70+ authorized dealers.",
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id":
            "https://cloverfield.studio/case-studies/innovative-aluminum",
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
            "name": "Innovative Aluminum",
            "item":
              "https://cloverfield.studio/case-studies/innovative-aluminum",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <section className="pt-32 md:pt-40 pb-10 md:pb-14 px-6 md:px-10">
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1100px] mx-auto text-[13px] font-[family-name:var(--font-geist-sans)] text-black/50"
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
              Innovative Aluminum
            </li>
          </ol>
        </nav>
      </section>

      {/* Title block — heading row + content row align across columns */}
      <section className="px-6 md:px-10 mb-16 md:mb-24">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-10 md:gap-x-16 gap-y-6 md:gap-y-8">
          <h1 className="md:col-span-8 order-1 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05]">
            Innovative Aluminum
          </h1>

          <h2 className="md:col-span-4 order-3 md:order-2 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05] mt-6 md:mt-0">
            Scope
          </h2>

          <div className="md:col-span-8 order-2 md:order-3">
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch] mb-4">
              Innovative Aluminum Systems is a well-established Canadian manufacturer with 20 years of experience specializing in premium aluminum railings. They distribute through over 70 authorized dealers across North America, who sell to homeowners and companies participating in the construction market, something their previous website failed to clearly communicate.
            </p>
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch]">
              We completely rebuilt their website from the ground up. Just two weeks after the new site launched, <ClaudeMention /> began recommending Innovative Aluminum Systems by name whenever people inquired about Canadian aluminum railing manufacturers.
            </p>
          </div>

          <div className="order-4 md:col-span-4">
            <ul className="text-base md:text-lg text-black/80 space-y-1.5 font-[family-name:var(--font-geist-sans)]">
              <li>Website redesign</li>
              <li>Website development</li>
              <li>SEO optimization</li>
              <li>AI search optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hero video — scroll-driven scale (kept) */}
      <section className="px-6 md:px-10 mb-16 md:mb-24">
        <div className="max-w-[1600px] mx-auto">
          <CaseStudyHeroVideo
            src="/innovative-aluminum-hero.mp4"
            aspectRatio="1920 / 932"
            ariaLabel="Live preview of the Innovative Aluminum Systems website built by Cloverfield Studio"
            href="https://www.innovativealuminum.com/"
          />
        </div>
      </section>

      {/* Stat strip — outcome teaser */}
      <section className="px-6 md:px-10 mb-24 md:mb-40">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-black/15 pt-8 md:pt-10">
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              5/yr → 1 in 7 days
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Dealer inquiries
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              Day 2
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              First homeowner lead arrived
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              Named by <ClaudeMention />
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Now recommended by AI assistants
            </p>
          </div>
        </div>
      </section>

      {/* Content body with sticky sidebar */}
      <div className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
          <aside className="md:col-span-2 md:-ml-6 lg:-ml-10">
            <CaseStudySidebar sections={SECTIONS} />
          </aside>

          <div className="md:col-span-10 flex flex-col gap-24 md:gap-36">
            {/* Mission */}
            <section id="mission" className="scroll-mt-32">
              <Eyebrow>The Mission</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                Get the site to bring in more <span className="text-[#16a34a]">leads</span>.
              </h2>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch]">
                The old site brought in five dealer inquiries a year. Homeowners and dealers landed on the same homepage with the same generic copy. We had to fix both.
              </p>
            </section>

            {/* Solution */}
            <section id="solution" className="scroll-mt-32 flex flex-col gap-20 md:gap-28">
              <div id="solution-visual" className="scroll-mt-32">
                <Eyebrow>Solution · 01</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Made the site look as premium as the product.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  Their railings sell for thousands of dollars per project. The old site looked like a wholesale supplier. We rebuilt the visual language to match the product: cinematic photography, large typography, scroll-driven moments closer to a luxury auto brand than a manufacturer. And it loads fast.
                </p>

                <div className="border-t border-black/15 pt-8 md:pt-10">
                  <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-6">
                    Lighthouse · innovativealuminum.com
                  </p>
                  <img
                    src="/lighthouse-scores.png"
                    alt="Lighthouse audit for innovativealuminum.com: 98 Performance, 96 Accessibility, 100 Best Practices, 100 SEO."
                    className="w-full rounded-xl border border-black/10"
                  />
                </div>
              </div>

              <div id="solution-tool" className="scroll-mt-32">
                <Eyebrow>Solution · 02</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Their best sales tool wasn&apos;t on the website.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  The Designer Tool lets dealers draw railings on a customer&apos;s blueprint and quote on the spot. It&apos;s their strongest closing asset. It wasn&apos;t on the old website. We treated it like a product: a dedicated landing page, demo videos, and a path to book a walkthrough.
                </p>
                <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-black">
                  <video
                    src="/herofinal.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Demo of the Innovative Aluminum Designer Tool: a dealer drawing a railing on a blueprint and generating a quote."
                    className="w-full h-auto block"
                  />
                </div>
              </div>

              <div id="solution-ai" className="scroll-mt-32">
                <Eyebrow>Solution · 03</Eyebrow>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                  Built to be found by AI, not just Google.
                </h2>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                  More buyers are starting in <ClaudeMention /> and ChatGPT instead of Google. AI assistants only recommend sites they can confidently read. We built every page to be both human-readable and machine-readable.
                </p>

                <div className="flex flex-col gap-6 md:gap-7 max-w-[62ch] mb-12 md:mb-14">
                  {[
                    {
                      lead: "Server-rendered content.",
                      body: "Every page ships real HTML, not an empty shell that fills in with JavaScript. AI crawlers see exactly what humans see.",
                    },
                    {
                      lead: "Schema markup on every page.",
                      body: "Structured data tells machines what's a product, what's a business, what's an FAQ. AI cites it with confidence.",
                    },
                    {
                      lead: "Text-first content.",
                      body: "Warranty terms, engineering specs, product details. All in readable text, never baked into graphics. AI can't read JPGs.",
                    },
                    {
                      lead: "AI crawlers explicitly welcomed.",
                      body: "Most sites block GPTBot, ClaudeBot, and PerplexityBot at the firewall. We let them in. Most competitors disqualified themselves before they even tried.",
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

                <figure>
                  <div className="rounded-xl overflow-hidden border border-black/10 bg-black">
                    <picture>
                      <source
                        media="(min-width: 768px)"
                        srcSet="/claude-recommends-desktop.png"
                      />
                      <img
                        src="/claude-recommends-mobile.png"
                        alt="Claude conversation: asked 'Premium aluminum railings in Canada,' Claude lists Innovative Aluminum Systems first, with citations to innovativealuminum.com."
                        className="w-full h-auto block"
                      />
                    </picture>
                  </div>
                  <figcaption className="mt-4 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
                    <ClaudeMention /> when asked &ldquo;Premium aluminum railings in Canada&rdquo;
                  </figcaption>
                </figure>

                <div className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl bg-black text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
                  <div
                    aria-hidden="true"
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#cc785c]/20 blur-3xl pointer-events-none"
                  />
                  <div className="relative">
                    <h3 className="font-[family-name:var(--font-outfit)] font-bold text-2xl md:text-[2.2rem] tracking-tight leading-[1.1] mb-4 max-w-[20ch]">
                      Want this on your site?
                    </h3>
                    <p className="text-sm md:text-base text-white/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[44ch]">
                      We don&apos;t publish all the moves. If AI search matters to your business, let&apos;s talk.
                    </p>
                  </div>
                  <Link
                    href="/#contact"
                    className="cursor-book relative self-start md:self-auto inline-flex items-center px-7 py-3.5 md:px-8 md:py-4 rounded-full bg-white text-black text-xs md:text-sm uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
                  >
                    Book a call
                  </Link>
                </div>
              </div>
            </section>

            {/* Result */}
            <section id="result" className="scroll-mt-32">
              <Eyebrow>The Result</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-10 max-w-[26ch]">
                Two weeks after launch.
              </h2>

              <dl className="grid grid-cols-[auto_1fr] gap-x-8 md:gap-x-16 gap-y-5 md:gap-y-6 mb-16 md:mb-20">
                {[
                  { when: "Day 0", event: "Site launches." },
                  {
                    when: "Day 2",
                    event: "First homeowner lead. Routed to a dealer.",
                  },
                  {
                    when: "Day 7",
                    event:
                      "First dealer inquiry. Old site averaged 5 a year.",
                  },
                  {
                    when: "Week 2",
                    event:
                      "Claude recommends Innovative Aluminum by name.",
                  },
                ].map(({ when, event }) => (
                  <div key={when} className="contents">
                    <dt className="font-[family-name:var(--font-outfit)] font-medium text-xs md:text-sm tracking-[0.18em] uppercase text-black/45 pt-1.5">
                      {when}
                    </dt>
                    <dd className="font-[family-name:var(--font-outfit)] font-light text-lg md:text-2xl tracking-tight leading-snug text-black/85">
                      {event}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl md:text-2xl tracking-tight leading-snug mb-4 max-w-[28ch]">
                Then the team added a new option to their dealer form.
              </h3>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch] mb-10">
                A dealer mentioned finding them through an AI assistant. The team added &ldquo;AI Assistant&rdquo; to the &ldquo;How did you find us?&rdquo; dropdown on the dealer application form. A new referral source, tracked alongside Google, social media, and trade shows.
              </p>

              <figure className="max-w-xl mx-auto">
                <div className="relative rounded-xl overflow-hidden border border-black/10 bg-white">
                  <img
                    src="/dealer-form-ai-referral.png"
                    alt="Innovative Aluminum dealer application form, step 2, showing 'How did you find us?' options: Google Search, AI Assistant, Social Media, Industry Referral, Trade Show / Event, Existing Dealer, Other."
                    className="w-full h-auto block"
                  />
                  <svg
                    viewBox="0 0 843 761"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="236"
                      cy="578"
                      rx="62"
                      ry="22"
                      fill="none"
                      stroke="#cc785c"
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform="rotate(-3 236 578)"
                    />
                  </svg>
                </div>
                <figcaption className="mt-4 text-xs md:text-sm text-black/55 font-[family-name:var(--font-geist-sans)] text-center">
                  innovativealuminum.com — dealer application form
                </figcaption>
              </figure>
            </section>

            {/* Reflection */}
            <section id="reflection" className="scroll-mt-32">
              <Eyebrow>Reflection</Eyebrow>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]">
                Most of the work was already in the business.
              </h2>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch]">
                Innovative Aluminum already had a premium product, a proprietary closing tool, and engineering depth no competitor could match. None of it was on the old website. The work was finding what was already there and putting it where buyers, dealers, and AI could see it.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-32 md:pb-48 pt-12 md:pt-16 border-t border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-8">
              <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
                Next move
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.6rem)] tracking-tight leading-[1.05] max-w-[22ch]">
                Want a site that does the same for your business?
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/#contact"
                className="inline-flex items-center px-8 py-4 md:px-10 md:py-5 rounded-full bg-black text-white text-sm md:text-base uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-black/80 transition-all duration-300 cursor-book"
              >
                Book a call
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-24 pt-8 border-t border-black/10 flex items-center justify-between text-xs text-black/40 font-[family-name:var(--font-geist-sans)] tracking-wide">
            <span>Cloverfield Studio · 2026</span>
            <Link
              href="/work"
              className="hover:text-black transition-colors cursor-view"
            >
              See more work →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
