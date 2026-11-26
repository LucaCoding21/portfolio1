/**
 * The 3× guarantee in William's words (Nov 23 2026). The hero's green line,
 * the FAQ's "Can you guarantee results?", the meta and share descriptions and
 * llms.txt say the same thing, so change them together.
 */
export const GUARANTEE_QUOTE =
  "We’re aiming to generate 3× your SEO investment in additional gross profit within 12 months. If we don’t get you there, we’ll keep working for free until we do.";

/**
 * What "How it works" opens under the quote (Nov 25 2026): the questions an
 * owner has after reading the guarantee, two to a row: why we offer it
 * (William's philosophy: SEO as an investment that should pay back, measured
 * by what it earns, not by rankings) and whether they wait 12 months to see
 * anything (William: most clients see AI results in the first 1 to 2
 * weeks); the two outcomes side by side (missing it, and what happens once
 * they hit 3×); then the fine print (his ask: answer leads fast and close the
 * deals) and the qualifier ("this isn't for everyone"). "How do you know
 * what came from Google?" was cut: owners don't ask it. The exact count of
 * gross profit and the minimum term are left for the call, as William wants.
 */
export const GUARANTEE_POINTS = [
  {
    q: "Why do you offer this?",
    a: "We see SEO as an investment, not just a monthly service. So we measure our work by the money it brings back to you, not by rankings.",
  },
  {
    q: "Do I have to wait 12 months to see anything?",
    a: "No. Most clients start showing up in ChatGPT and other AI answers within the first 1 to 2 weeks, and it only goes up from there.",
  },
  {
    q: "What if you don’t get there?",
    a: "You stop paying, and we keep doing the same work for free until you get there.",
  },
  {
    q: "What happens once I hit 3×?",
    a: "You can keep going month to month or stop. By then the work is paying for itself, so it’s an easy choice.",
  },
  {
    q: "Is there fine print?",
    a: "All we ask is that you answer your leads fast and close your deals. We can bring in the calls, but you’re the one who turns them into jobs.",
  },
  {
    q: "Is this for everyone?",
    a: "No. If we don’t think we can get you there, we’ll tell you before you sign anything.",
  },
];

export const GUARANTEE_CLOSE = "We’ll go through exactly how we count it on your free call.";
