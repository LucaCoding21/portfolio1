/**
 * "The solution" on /seo (Nov 24 2026, William's low-fi, then a "Where
 * Runners Connect" reference he sent): a centred label, heading and line
 * straight after "The problem" (since Nov 25 2026, when the solution band
 * between them came out), then three tall cards,
 * each redone one at a time and picked from drafts the same day:
 * 1 searches drifting up in pills, each #1 (pillars/FoundCard);
 * 2 the CRO section's funnel under its words (pillars/ChosenCard);
 * 3 a monthly report rising from the foot of a black card
 *   (pillars/ResultsCard), about tracking, not the 3× guarantee.
 * The titles are the services' plain names (William: no "Get found. Get
 * chosen. Get results.", and no small SEO / CRO / ROI tags repeating them).
 * The links go to #get-found (SeoGet), #get-chosen (SeoCro) and #results.
 */
import ChosenCard from "./pillars/ChosenCard";
import FoundCard from "./pillars/FoundCard";
import ResultsCard from "./pillars/ResultsCard";
import s from "./SeoPillars.module.css";

const SEO = {
  title: "Search engine optimization",
  // what we do, not what it is (Nov 24 2026, by request)
  text: "We work on your website and Google listing so more people nearby find you.",
  href: "#get-found",
};

const CRO = {
  title: "Conversion rate optimization",
  // plain, no marketing words (William, Nov 24 2026)
  text: "We monitor your analytics and website, then make changes so more visitors get in touch.",
  href: "#get-chosen",
};

const TRACKING = {
  title: "Tracking and reporting",
  // the point is reassurance that the work is being done, not counting
  // inquiries (William, Nov 24 2026)
  text: "You can see what we're working on any time, and get a report every month.",
  href: "#results",
  cta: "See our results",
};

export default function SeoPillars() {
  return (
    <section className={s.section} data-section="approach" aria-labelledby="solution-title">
      <div className={s.inner}>
        <div className={s.gallery}>
          {/* Nov 24 2026, William: no hook, a short plain line, and no need
              to say "3 pillars" (the cards show it). After the promise the
              owner thinks "okay, how?" and "what am I paying for each
              month?", so the heading answers the first and the line sets up
              the cards for the second, without listing them ("Our approach"
              / "We get you found on Google, help more visitors call you, and
              show you what it brings back." before it). */}
          {/* Nov 25 2026: with the solution band gone it follows "The
              problem" directly, so it's labelled to match and the heading
              answers that one ("…and calling someone else."); "How we get
              you there" pointed back at the band's promise. */}
          <p className={s.gaLabel}>The solution</p>
          <h2 id="solution-title" className={s.gaTitle}>
            How we get people near you to call you instead.
          </h2>
          <p className={s.gaLede}>Here&apos;s what you get every month.</p>

          <ul className={s.gaCards}>
            <li className={s.gaCard}>
              <FoundCard {...SEO} />
            </li>
            <li className={s.gaCard}>
              <ChosenCard {...CRO} />
            </li>
            <li className={s.gaCard}>
              <ResultsCard {...TRACKING} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
