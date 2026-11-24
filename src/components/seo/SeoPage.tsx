/**
 * The monthly SEO page (/seo), 1:1 from the designer's "Landing page"
 * handoff (Nov 9 2026, `~/Downloads/Landing page-html`). It runs under the
 * site nav and dock like any other page; the handoff's own sticky header
 * (logo, "Book a free call" and a button to its form) was taken out the same
 * day by request, and the hero starts lower by its height so the rest sits
 * where the handoff has it. Top to bottom:
 *
 *   hero      a photo card (Nov 13 2026, from a reference): headline, sub-line,
 *             the promise, "Book a free SEO call" and the trust line, centred
 *             low. The free competitor check card that sat on the right
 *             (CompetitorCheck, still in this folder) was taken out.
 *   stall     "The problem": the problem as owners think it (Nov 10 2026),
 *             a competitor first, slow months, empty SEO promises; hovering
 *             a card widens it and slides a picture in (StallCards, Nov 14)
 *   offer     white: the promise and a signed quote in a grey box, then
 *             "How it works" in five ruled steps (SeoOffer, Nov 14 2026)
 *   results   dark band: "Our websites alone got these businesses into the top
 *             3 on Google.", its line beside it, then ruled rows (Nov 15 2026,
 *             from a reference): the business on the left, its real
 *             screenshots beside it (ProofShots: each Google result paired
 *             with what AI said), the button centred below, Nov 10 2026
 *             ("How it works", four steps from Qualify to Prove, came out
 *             after it on Nov 11 2026, and so did a Hook Agency style
 *             "How are we different?" table that replaced it for a day)
 *   get       white: "What you get", the six things we do every month,
 *             three across (SeoGet, Nov 15 2026)
 *             (a green promise band sat here from Nov 11 2026, the promise
 *             and what happens if it's missed; taken out Nov 15 2026 by
 *             request, as the hero and the offer already say it. The terms
 *             live in the FAQ.)
 *   faq       grey: "Still have questions?" and six questions in one white
 *             container, one open at a time (FaqList, Nov 15 2026)
 *   footer    the homepage's footer (HomeFooter, Nov 15 2026; the handoff's
 *             small logo and copyright footer was swapped out by request)
 *
 * The handoff's design tool left fixed widths and heights on several boxes.
 * They're dropped here (they broke phones and clipped the FAQ over the
 * footer), and the few that set spacing on desktop are kept as minimum
 * heights or paddings that come out the same at 1440 wide. The handoff has no
 * scroll motion; on Nov 14 2026 William asked for some at the top of the page
 * (SeoMotion for "The problem", SeoOffer's own for the offer); the hero
 * stays still, by request.
 */

import Image from "next/image";
import Link from "next/link";
import HomeFooter from "@/components/HomeFooter";
import { CAL_URL } from "@/data/projects";
import FaqList from "./FaqList";
import ProofShots from "./ProofShots";
import SeoCro from "./SeoCro";
import SeoGet from "./SeoGet";
import SeoHero from "./SeoHero";
import SeoMotion from "./SeoMotion";
import SeoOffer from "./SeoOffer";
import SeoPillars from "./SeoPillars";
import StallCards from "./StallCards";
import s from "./SeoPage.module.css";

/** How many searches a plan works on, set by budget (William, Nov 11 2026). */
const SEARCH_RANGE = "10 to 40";

/** The six questions on the page (Nov 15 2026: William asked for fewer). The
 *  rest stay in FAQS, written and ready to bring back. The promise's four
 *  (#1, missing it, what you do, each month) must stay in step with the hero,
 *  the green band and the meta. */
const FAQ_SHOWN = [
  "How much does it cost?",
  "What do you do each month?",
  "Do I need a website from you?",
  "Can you promise #1 on Google?",
  "What if you don’t get there?",
  "What do I have to do?",
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How much does it cost?",
    a: "It depends on how fast you want to build. Every plan gets the same system, and we’ll go through the options after your free check.",
  },
  {
    q: "What do you do each month?",
    a: `Depending on your plan, we work on ${SEARCH_RANGE} searches. We fix your Google listing, add pages for the jobs and towns you want, add articles that answer what your customers search (planned to rank and edited by us so they’re correct), help you get more reviews and get you mentioned on other sites. We also work on what ChatGPT and Google’s AI say about you.`,
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

export default function SeoPage() {
  return (
    <>
      {/* rounded at the foot, it lifts off the homepage's pinned footer reel,
          as on /sight; overflow clip (not hidden) keeps sticky parts working */}
      <div className={`${s.page} relative z-10 overflow-clip rounded-b-[28px] md:rounded-b-[48px]`}>
      <main>
        <SeoHero />
        <SeoMotion />

        <section className={s.stall} data-section="stall">
          <div className={s.stallInner}>
            <p className={s.stallLabel} data-stall="label">
              The problem
            </p>
            <div className={s.stallHeadRow}>
              <h2 className={s.stallTitle} data-stall="title">
                People near you are searching for what you do, and calling someone else.
              </h2>
            </div>
            <StallCards />
          </div>
        </section>

        {/* the solution band, then (Nov 24 2026, William's low-fi) the three
            pillars, "01 / Get found" (the things we take care of) and
            "02 / Get chosen" (the CRO showcase) */}
        <SeoOffer part="promise" />
        <SeoPillars />
        <SeoGet />
        <SeoCro />

        <section id="results" className={s.results} data-section="results">
          <div className={s.resultsInner}>
            {/* Nov 15 2026, from a reference William sent: the heading on
                the left and its line on the right, then one ruled row per
                business (its name on the left, the shots beside it), the
                button centred at the foot */}
            <div className={s.resultsHead}>
              <div>
                <p className={s.resultsLabel}>Results</p>
                <h2 className={s.h2}>Our websites alone got these businesses into the top 3 on Google.</h2>
              </div>
              <p className={s.resultsLede}>
                They show up at the top when people nearby search, without paying for ads.
              </p>
            </div>

            <ProofShots />

            <div className={s.resultsFoot}>
              <a className={`${s.btn} ${s.btnLight}`} href={CAL_URL} target="_blank" rel="noopener noreferrer">
                Book a free SEO call
              </a>
              <p className={s.asideNote}>Searches checked in November 2026. Ads aren&rsquo;t counted.</p>
            </div>
          </div>
        </section>

        {/* "How it works" (<SeoOffer part="process" />) sat here until Nov 23
            2026; taken out by request so the page goes from the proof to
            the FAQ and the booking. It still renders if put back. */}

        {/* Nov 15 2026: grey and centred, "Still have questions?" and its
            line over one wide white container of questions, one open at a
            time (FaqList); full-width photos and a big heading on the left
            were tried first */}
        <section className={s.faq} data-section="faq">
          <div className={s.faqInner}>
            <div className={s.faqIntro}>
              <h2 className={s.faqTitle}>Still have questions?</h2>
              <p className={s.faqLede}>
                Here are the ones we expect. Or{" "}
                <a className={s.faqCall} href={CAL_URL} target="_blank" rel="noopener noreferrer">
                  book a free call
                  {/* slides in pointing up and right on hover */}
                  <svg className={s.faqCallArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path d="M7 17 17 7M8 7h9v9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>{" "}
                and ask us anything.
              </p>
            </div>
            <FaqList items={FAQS.filter((f) => FAQ_SHOWN.includes(f.q))} />
          </div>
        </section>
      </main>
      </div>
      <HomeFooter />
    </>
  );
}
