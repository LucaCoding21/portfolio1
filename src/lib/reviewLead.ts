/**
 * The free website review's checks, shared by the forms (ReviewField,
 * HeroReview) and the lead route, so a value the form lets through is never
 * refused by the server.
 */

export const LOOKS_LIKE_A_SITE = /^(https?:\/\/)?[^\s./]+(\.[^\s./]+)+(\/\S*)?$/i;
export const LOOKS_LIKE_AN_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Ten digits: a North American number with its area code. */
export const looksLikeAPhone = (phone: string) => phone.replace(/\D/g, "").length >= 10;

/** "https://www.acme.ca/" reads as "acme.ca" in the copy. */
export const bare = (site: string) =>
  site.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
