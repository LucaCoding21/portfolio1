/**
 * The free home page design offer (Oct 2026), which replaces the free website
 * review. Its page is a four-step quiz (have a site? what kind of business?
 * what should the site bring you more of? where do we reach you?) that emails
 * William and buzzes his phone through /api/design-lead. Shared by the page,
 * the route and every link to it.
 */

export const FREE_DESIGN_URL = "/free-homepage-design";

/** The quiz's "What kind of business do you run?" answers. */
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

/** One answer to "What should your new site bring you more of?". `focus`
    finishes the last screen's "We'll design your home page around ...". */
export type Goal = { label: string; focus: string };

/** That question's answers, by business type (added Oct 22 2026). One pick,
    so the sample is designed around a single main action. */
export const GOALS: Record<BusinessType, readonly Goal[]> = {
  "Trades business": [
    { label: "Quote requests", focus: "getting you more quote requests" },
    { label: "Phone calls", focus: "getting you more phone calls" },
    { label: "Bigger jobs", focus: "winning you bigger jobs" },
  ],
  Realtor: [
    { label: "Buyer leads", focus: "getting you more buyer leads" },
    { label: "Seller leads", focus: "getting you more seller leads" },
    { label: "Name recognition in my area", focus: "making your name known in your area" },
  ],
  Photographer: [
    { label: "Bookings", focus: "getting you more bookings" },
    { label: "Higher-paying clients", focus: "bringing you higher-paying clients" },
    { label: "Inquiries for the work I love", focus: "bringing you inquiries for the work you love" },
  ],
  "Clinic or therapy practice": [
    { label: "New client bookings", focus: "getting you more new client bookings" },
    { label: "Calls from the right clients", focus: "bringing you calls from the right clients" },
    { label: "Trust before the first visit", focus: "earning trust before the first visit" },
  ],
  "Ecommerce or Shopify store": [
    { label: "Sales", focus: "getting you more sales" },
    { label: "Bigger orders", focus: "getting you bigger orders" },
    { label: "Repeat customers", focus: "bringing customers back" },
  ],
  "Something else": [
    { label: "Calls", focus: "getting you more calls" },
    { label: "Inquiries", focus: "getting you more inquiries" },
    { label: "Bookings", focus: "getting you more bookings" },
    { label: "Sales", focus: "getting you more sales" },
  ],
};
