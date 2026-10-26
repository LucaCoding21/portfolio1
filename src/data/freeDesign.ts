/**
 * The free home page design offer (Oct 2026), which replaces the free website
 * review. Its page is a five-step quiz (have a site? what kind of business?
 * what should the site bring you more of? roughly what does the business
 * bring in a year? where do we reach you?) that emails William and buzzes his
 * phone through /api/design-lead. Shared by the page, the route and every
 * link to it.
 */

export const FREE_DESIGN_URL = "/free-homepage-design";

/** What a free sample lead is worth, in CAD, for Meta's reports: a guess at
    the chance they buy times what they'd likely pay (sites run $3,000 to
    $10,000). Qualified ($100K a year and up): 1 in 5 at about $6,000; the
    rest: 1 in 20 at about $3,000. Estimates (Oct 26 2026) until there are
    real close rates; revisit after 20 or so leads. */
export const ESTIMATED_LEAD_VALUE = { qualified: 1200, other: 150 } as const;

/** The Lead and SubmitApplication events' details, the same from the pixel
    and from the server. */
export const leadEventData = (qualified: boolean) => ({
  currency: "CAD",
  value: qualified ? ESTIMATED_LEAD_VALUE.qualified : ESTIMATED_LEAD_VALUE.other,
  content_name: "free_homepage_sample",
});

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

/** "Roughly what does your business bring in a year?" (added Oct 25 2026),
    asked just before the contact step. `qualified` marks the businesses big
    enough to pay for a full site (the line is $100K a year): only those
    leads send the Meta Pixel's SubmitApplication, which the ads optimize
    for, so Meta finds more of them rather than the cheapest people to reach. Every answer gets
    the same thank-you, so nobody has a reason to round up. */
export const REVENUE_RANGES = [
  { label: "Just getting started", qualified: false },
  { label: "Under $100K", qualified: false },
  { label: "$100K to $500K", qualified: true },
  { label: "$500K to $1M", qualified: true },
  { label: "Over $1M", qualified: true },
] as const;

export type Revenue = (typeof REVENUE_RANGES)[number];
