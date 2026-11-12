/**
 * The monthly SEO page (/seo), 1:1 from the designer's "Landing page"
 * handoff (Nov 9 2026, `~/Downloads/Landing page-html`). It runs under the
 * site nav and dock like any other page; the handoff's own sticky header
 * (logo, "Book a free call" and a button to its form) was taken out the same
 * day by request, and the hero starts lower by its height so the rest sits
 * where the handoff has it. Top to bottom:
 *
 *   hero      the promise and the trust line on the left, the free
 *             competitor check (CompetitorCheck, id="check") on the right,
 *             which replaced the handoff's "free map snapshot"
 *   stall     "The problem": the problem as owners think it (Nov 10 2026),
 *             a competitor first, slow months, empty SEO promises
 *   results   dark band: "Our websites alone got these businesses into the top
 *             3 on Google.", then a wall of real screenshots (ProofShots:
 *             each Google result paired with what ChatGPT said), Nov 10 2026
 *             ("How it works", four steps from Qualify to Prove, came out
 *             after it on Nov 11 2026, and so did a Hook Agency style
 *             "How are we different?" table that replaced it for a day)
 *   promise   green band: the promise and what happens if it's missed, in
 *             two sentences, and the button (Nov 11 2026; it replaced the
 *             handoff's "What do I get?" list and promise card, after five
 *             longer drafts read as too much text). The terms live in the FAQ.
 *   faq       dark band: "Still have questions?"
 *   footer    logo, copyright and the privacy policy
 *
 * The handoff's design tool left fixed widths and heights on several boxes.
 * They're dropped here (they broke phones and clipped the FAQ over the
 * footer), and the few that set spacing on desktop are kept as minimum
 * heights or paddings that come out the same at 1440 wide. The page has no
 * scroll motion: the handoff has none.
 */

import Image from "next/image";
import Link from "next/link";
import { CAL_URL } from "@/data/projects";
import ProofShots from "./ProofShots";
import CompetitorCheck from "./CompetitorCheck";
import AiSwap from "./AiSwap";
import s from "./SeoPage.module.css";

/** Trust line faces, as on the free homepage sample page: WrapCity, Innovative Aluminum, Flow State, ACE. */
const FACES = [
  "/wrapcity-headshot-v3.webp",
  "/testimonials/mike-victory.webp",
  "/flowstate/paula-headshot.jpg",
  "/ACE/ace-headshot-v5.webp",
];

const STALLS = [
  {
    title: "A competitor shows up first",
    body: "You search for your own service in your city, and someone else comes up before you. Some of them aren’t even as good as you.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    title: "Some months are slow",
    body: "Most of your work comes from word of mouth, so some months are busy and some are slow.",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    ),
  },
  {
    title: "You’ve heard the promises before",
    body: "Every week, someone emails you promising #1 on Google. If you’ve hired one, you got a monthly report and no new calls.",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
];

/** How many searches a plan works on, set by budget (William, Nov 11 2026). */
const SEARCH_RANGE = "10 to 40";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How much does it cost?",
    a: "It depends on how fast you want to build. Every plan gets the same system, and we’ll go through the options after your free check.",
  },
  {
    q: "What do you do each month?",
    a: `Depending on your plan, we work on ${SEARCH_RANGE} searches. We fix your Google listing, add pages for the jobs and towns you want, help you get more reviews and get you mentioned on other sites. We also work on what ChatGPT and Google’s AI say about you. Each month you get a short video showing what we did and what changed.`,
  },
  {
    q: "Do I need a website from you?",
    a: "No. We can work on the website you have now. If it’s holding you back, we’ll tell you in your free check.",
  },
  {
    q: "My website already shows up. Why pay monthly?",
    a: "Your website gets you showing up for the searches it was built for. Monthly SEO adds the pages, reviews and links that win more searches and more areas, and it keeps what you’ve built from fading.",
  },
  {
    q: "When will I see results?",
    a: "By day 30, tracking is live, your Google listing is fixed and the quick wins are done. By day 90, we’re aiming for your first page-one spots and first tracked leads from Google. By day 180, we’re aiming for steady leads.",
  },
  {
    q: "Can you promise #1 on Google?",
    a: "No one can promise #1, and we’d be careful with anyone who does. What we promise is the top 3 on Google within 6 months, on the map or in the regular results, for at least 3 of your 5 main searches. We pick those 5 together, like “deck railings yakima”, and write them into your agreement. Ads don’t count. We check every month (the map with Local Falcon) and send you the results.",
  },
  {
    q: "What if you don’t get there?",
    a: "You stop paying, and we keep doing the same work every month for free until you do. There’s no end date on that. We can promise it because we only take you on if your free check shows you can get there.",
  },
  {
    q: "What do I have to do?",
    a: "Give us access to your Google listing and website, and ask happy customers for reviews. We’ll give you the text to send. The rest is on us.",
  },
  {
    q: "What happens if I stop?",
    a: "You keep everything. Rankings fade slowly instead of stopping the day you do. After the first 6 months, you can leave any month.",
  },
  {
    q: "Have you done monthly SEO before?",
    a: "The results on this page came from our websites alone. We’re opening monthly SEO to a few founding clients first, and that’s why the promise is this strong: we want to earn the numbers with you.",
  },
  {
    q: "Who is this not for?",
    a: "Businesses that want #1 for broad searches or results in 30 days, whose jobs are too small for a monthly fee to pay back, or who won’t approve content or ask for reviews. We also won’t do fake reviews or filter out unhappy customers.",
  },
  {
    q: "Will you keep calling me?",
    a: "No. We’ll walk you through your check, and if it’s not for you, that’s the end of it.",
  },
  {
    q: "Who are you guys?",
    a: (
      <>
        We&rsquo;re{" "}
        <span className={s.nowrap}>
          William{" "}
          <Image src="/free-homepage-design/team/william-face.webp" alt="" width={30} height={30} className={s.inlineFace} />
        </span>{" "}
        and{" "}
        <span className={s.nowrap}>
          Irish{" "}
          <Image src="/free-homepage-design/team/irish-photo.webp" alt="" width={30} height={30} className={s.inlineFace} />
        </span>
        , the two people behind Cloverfield Studio in Surrey, BC. Irish designs every page and William builds it, and
        the sites we&rsquo;ve made have brought our clients 3,000+ inquiries.{" "}
        <Link href="/" className={s.faqLink}>
          Visit our home page
        </Link>
      </>
    ),
  },
];

function Plus() {
  return (
    <svg className={s.plus} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SeoPage() {
  return (
    <div className={s.page}>
      <main>
        <section className={s.hero} data-section="hero">
          <div className={s.heroCopy}>
            <h1 className={s.h1}>
              Get more calls from Google and{" "}
              <span className={s.nowrap}>
                AI <AiSwap />
              </span>{" "}
              without paying for ads.
            </h1>
            <p className={s.lede}>
              Monthly SEO for local businesses, from a small web design team in Surrey, BC.
            </p>
            <div className={s.promiseLine}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden className={s.shield}>
                <path
                  d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m8.8 11.8 2.2 2.2 4.2-4.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className={s.promiseText}>
                <mark className={s.mark}>Top 3 on Google in 6 months, or we work for free until you get there.</mark>
              </p>
            </div>
            <div className={s.proof}>
              <div className={s.faces} aria-hidden>
                {FACES.map((src) => (
                  <Image key={src} src={src} alt="" width={40} height={40} className={s.face} />
                ))}
              </div>
              <p className={s.proofText}>
                <strong>3,000+ inquiries</strong> generated for local businesses by sites we&rsquo;ve built
              </p>
            </div>
          </div>

          <div id="check" className={s.check}>
            <CompetitorCheck />
            {/* For owners who already want help and don't need the check
                (since Nov 11 2026 the page sells to any local business, not
                only our own website clients): a quiet second
                way in, worded as on the free sample page's header. */}
            <p className={s.talk}>
              Prefer to talk?{" "}
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
                Book a free call
              </a>
            </p>
          </div>
        </section>

        <section className={s.stall} data-section="stall">
          <div className={s.stallInner}>
            <p className={s.sideLabel}>The problem</p>
            <div className={s.stallBody}>
              <h2 className={s.h2}>People near you are searching for what you do, and calling someone else.</h2>
              <ol className={s.stallCards}>
                {STALLS.map((c) => (
                  <li key={c.title} className={s.stallCard}>
                    <span className={s.stallIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {c.icon}
                      </svg>
                    </span>
                    <h3 className={s.h3}>{c.title}</h3>
                    <p className={s.stallText}>{c.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={s.results} data-section="results">
          <div className={s.resultsInner}>
            <h2 className={s.h2}>Our websites alone got these businesses into the top 3 on Google.</h2>
            <p className={s.resultsLede}>
              None of them had monthly SEO. We&rsquo;re starting that now with a few founding clients.
            </p>

            <ProofShots />

            <div className={s.resultsFoot}>
              <p className={s.asideNote}>Searches checked in November 2026. Ads aren&rsquo;t counted.</p>
              <a className={`${s.btn} ${s.btnLight}`} href="#check">
                Check my competitors
              </a>
            </div>
          </div>
        </section>

        <section className={s.promiseBand} data-section="promise">
          <div className={s.promiseBandInner}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden className={s.promiseBandIcon}>
              <path
                d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m8.8 11.8 2.2 2.2 4.2-4.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className={s.promiseBandTitle}>Top 3 on Google in 6 months, or we work for free until you get there.</h2>
            <p className={s.promiseBandText}>
              We pick your 5 main searches together. If you&rsquo;re not in the top 3 for at least 3 of them by month 6,
              you stop paying and we keep working until you are.
            </p>
            <a className={`${s.btn} ${s.btnLight}`} href="#check">
              Check my competitors
            </a>
          </div>
        </section>

        <section className={s.faq} data-section="faq">
          <div className={s.faqInner}>
            <div className={s.faqIntro}>
              <h2 className={s.faqTitle}>Still have questions?</h2>
              <p className={s.faqLede}>
                Here are the ones we expect. Or{" "}
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
                  book a free call
                </a>{" "}
                and ask us anything.
              </p>
            </div>
            <div className={s.faqList}>
              {FAQS.map((f) => (
                <details key={f.q} className={s.faqItem}>
                  <summary className={s.faqQ}>
                    {f.q}
                    <Plus />
                  </summary>
                  <p className={`${s.faqA} ${typeof f.a === "string" ? "" : s.faqAWithFaces}`}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <Image src="/cloverfield-logo.png" alt="Cloverfield Studio" width={4162} height={662} sizes="126px" className={s.footerLogo} />
        <div className={s.footerLinks}>
          <span>&copy; {new Date().getFullYear()} Cloverfield Studio Inc.</span>
          <Link href="/privacy" target="_blank" rel="noopener">
            Privacy policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
