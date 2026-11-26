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
  // Nov 25 2026 copy pass after the call with Mike and Fred: the right
  // customers finding you, not distance (William: "its not about nearby")
  text: "We help the customers you want find you, on Google and in AI answers.",
  href: "#get-found",
};

const CRO = {
  title: "Conversion rate optimization",
  // plain, no marketing words (William, Nov 24 2026)
  // the dream is a team that owns the website, not a report to read (Nov 25
  // 2026); "site" and "call" so it stays on two lines like the other two cards
  text: "Like having a web team on staff, we keep improving your site so more visitors call.",
  href: "#get-chosen",
};

const TRACKING = {
  title: "Tracking and reporting",
  // the point is reassurance that the work is being done, not counting
  // inquiries (William, Nov 24 2026)
  // where you stand, in words an owner reads (Nov 25 2026)
  text: "Every month you see what we did and where you stand, in plain English.",
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
              problem" directly. Later the same day, by request, the "The
              solution" eyebrow came off and "Our solution" became the
              heading; the line under it is about people choosing you, not
              calling (William's pick of five). It was
              "How we get people near you to call you instead." as the
              heading, with "Here's what you get every month." under it. */}
          <h2 id="solution-title" className={s.gaTitle}>
            Our solution
          </h2>
          {/* Nov 25 2026 copy pass: shorter, the handoff in it, and no
              "Every monthly plan includes all three" (the yellow tab says
              that); no comparison with other agencies (William: no shade) */}
          <p className={s.gaLede}>Here&apos;s how we get people near you to choose you, and we do all of the work.</p>

          {/* the three cards are one plan (Nov 25 2026, William's pick of
              four ways to show it, after a "+" between cards was turned
              down; a bracket over them, one shared frame and the cards
              joined into one block were the others): a tab on a rule across
              their tops, like a folder, in our yellow (his pick over green,
              ink and warm grey). */}
          <div className={s.bundle}>
            <p className={s.bundleLabel}>Included in every plan</p>
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
      </div>
    </section>
  );
}
