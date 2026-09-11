/**
 * Brand wordmarks used across the Sight page (hero blanks, connections
 * window). Trimmed PNGs; w/h are the files' intrinsic sizes and marks are
 * rendered at a fixed height. Spare in /public/sight/logos: otter.png
 * (167x64).
 */
/** `scale` is an optical-size tweak: squat or busy marks read smaller/larger
 *  than wordmarks at the same pixel height, so nudge them up or down. */
export type LogoMark = { name: string; src: string; w: number; h: number; scale?: number };

export const M = {
  quickbooks: { name: "QuickBooks", src: "/sight/logos/quickbooks.png", w: 250, h: 64 },
  xero: { name: "Xero", src: "/sight/logos/xero.png", w: 236, h: 64, scale: 0.9 },
  stripe: { name: "Stripe", src: "/sight/logos/stripe.png", w: 154, h: 64 },
  netsuite: { name: "NetSuite", src: "/sight/logos/netsuite.png", w: 256, h: 64 },
  excel: { name: "Excel", src: "/sight/logos/excel.png", w: 177, h: 64 },
  jobber: { name: "Jobber", src: "/sight/logos/jobber.png", w: 375, h: 64 },
  servicetitan: { name: "ServiceTitan", src: "/sight/logos/servicetitan.png", w: 371, h: 64 },
  housecallpro: { name: "Housecall Pro", src: "/sight/logos/housecall-pro.png", w: 454, h: 64, scale: 0.9 },
  monday: { name: "Monday", src: "/sight/logos/monday.png", w: 406, h: 64 },
  sheets: { name: "Google Sheets", src: "/sight/logos/sheets.png", w: 373, h: 64 },
  salesforce: { name: "Salesforce", src: "/sight/logos/salesforce.png", w: 92, h: 64, scale: 1.4 },
  hubspot: { name: "HubSpot", src: "/sight/logos/hubspot.png", w: 226, h: 64 },
  gcal: { name: "Google Calendar", src: "/sight/logos/google-calendar.png", w: 162, h: 64, scale: 1.25 },
  mailchimp: { name: "Mailchimp", src: "/sight/logos/mailchimp.png", w: 236, h: 64, scale: 1.2 },
  semrush: { name: "Semrush", src: "/sight/logos/semrush.png", w: 480, h: 64, scale: 0.9 },
  ahrefs: { name: "Ahrefs", src: "/sight/logos/ahrefs.png", w: 226, h: 64 },
  shopify: { name: "Shopify", src: "/sight/logos/shopify.png", w: 224, h: 64 },
} satisfies Record<string, LogoMark>;

