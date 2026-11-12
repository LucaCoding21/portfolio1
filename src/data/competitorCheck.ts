/**
 * The free competitor check on the monthly SEO page (/seo, Nov 2026). It
 * replaced the handoff's "free map snapshot" on Nov 9, was called the "free
 * lost customer check" for a day, and took its plain name back on Nov 10.
 * William compares the business with the top 3 businesses for its main job
 * in its area on Google (and who ChatGPT suggests), and says plainly whether
 * it can catch them. How the results reach the owner (an email, a call) isn't
 * decided yet; it's not a video.
 *
 * Shared by the card (components/seo/CompetitorCheck) and its route
 * (/api/competitor-check), so an answer the card sends is never refused.
 */

/** "Do you have a competitor in mind?", the card's first tap. */
export const CHECK_COMPETITOR = [
  { value: "yes", label: "Yes" },
  { value: "not_sure", label: "Not sure, find them for me" },
] as const;

export type CheckCompetitor = (typeof CHECK_COMPETITOR)[number]["value"];

/**
 * "What do you want more of?", the second tap. It replaced typing the job
 * and city (Nov 10 2026): every owner can answer it, and it tells William
 * which search to check. He finds the business, what it does and where from
 * the business name.
 */
export const CHECK_WANTS = ["More of the jobs I already do", "Bigger jobs that pay more", "Jobs in a new area"] as const;

/**
 * How long the check takes, as the thank-you promises it. Left as the
 * designer's placeholder until William sets it.
 */
export const CHECK_DAYS = "[X DAYS]";
