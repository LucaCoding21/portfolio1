/**
 * The free home page design offer (Oct 2026), which replaces the free website
 * review. Its page is a three-step quiz (have a site? what kind of business?
 * where do we reach you?) that emails William and buzzes his phone through
 * /api/design-lead. Shared by the page, the route and every link to it.
 */

export const FREE_DESIGN_URL = "/free-homepage-design";

/** The quiz's "I'm a…" answers. The last one opens a short "what do you do?" field. */
export const BUSINESS_TYPES = [
  "Trades business",
  "Realtor",
  "Photographer",
  "Clinic or therapy practice",
  "Ecommerce or Shopify store",
  "Something else",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
export const OTHER_TYPE: BusinessType = "Something else";
