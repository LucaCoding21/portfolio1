/**
 * The trades the page can speak to, and the questions each one asks.
 * Plain data, no client directive, so server components can
 * read it too. The store that picks the current trade is in trades.ts.
 *
 * One trade is "current" for the whole page. The questions wall rotates
 * through them on its own and lets the reader pin one; the Ask card in
 * how-it-works and the final CTA read the same choice, so one click at
 * the top makes the rest of the page read like it was written for that
 * owner.
 *
 * The last entry is a catch-all for anyone whose trade isn't on the row:
 * the questions every business has, and a subline that says so.
 *
 * Every question passes the same test as before: an owner asked it this
 * week, the answer lives in two systems, and it sounds answerable in five
 * seconds. `before` is what getting the answer used to take. The Ask
 * card's three answers each cross at least two tools, and together they
 * cover money leaking out, what a job really made, and money about to
 * walk away.
 */

export type Q = { q: string; before: string };
export type Answered = { q: string; a: string };

export type Trade = {
  id: string;
  /** Chip label. */
  label: string;
  /** With its article, for "What a roofer asks". */
  noun: string;
  /** Three marquee rows of five. Money, then customers, then jobs. */
  rows: Q[][];
  /** Three answered questions for the Ask card. Slot order is fixed:
   *  amber (leaking), blue (what a job made), green (walking away). */
  ask: Answered[];
  /** Five questions that type themselves into the final CTA. */
  cta: string[];
  /** The safety net for trades not on the row. Skipped by auto-rotation. */
  catchAll?: boolean;
  /** Replaces the wall's subline while this trade is showing. */
  tagline?: string;
};

export const TRADES: Trade[] = [
  {
    id: "hvac",
    label: "HVAC",
    noun: "an HVAC company",
    rows: [
      [
        { q: "Who owes us money past 30 days?", before: "bookkeeper, Thursday" },
        { q: "Which jobs finished but never got invoiced?", before: "ServiceTitan against QuickBooks, by hand" },
        { q: "What did the Westwood install actually make us?", before: "quote, hours, parts receipts, a spreadsheet" },
        { q: "What did overtime cost us during the heat wave?", before: "payroll export, a calculator" },
        { q: "Which supplier raised prices the most this year?", before: "last year's invoices, one by one" },
      ],
      [
        { q: "Who's due for a spring tune-up and hasn't booked?", before: "the calendar, one by one" },
        { q: "Which maintenance plans expire before summer?", before: "a spreadsheet you meant to update" },
        { q: "Which repair quotes over $2,000 never got a follow-up?", before: "scroll the sent folder" },
        { q: "When did we last service the Hendersons' furnace?", before: "the filing cabinet" },
        { q: "Which customers declined a replacement and never came back?", before: "dig through old work orders" },
      ],
      [
        { q: "Whose installs keep coming back as callbacks?", before: "a hunch about Mike" },
        { q: "How booked are we for the first week of July?", before: "ask the dispatcher" },
        { q: "Which jobs ran over on labour this month?", before: "you find out at invoice" },
        { q: "Which tech sells the most maintenance plans?", before: "nobody tracked it" },
        { q: "What's our average ticket on a no-cool call?", before: "nobody knew" },
      ],
    ],
    ask: [
      { q: "Who's due for a tune-up and hasn't booked?", a: "38 customers, most from last spring. About $7,600 in service." },
      { q: "What did the Westwood install actually make us?", a: "$3,900 on a $14,200 quote, and labour ran 11 hours over." },
      { q: "Whose installs keep coming back?", a: "Three callbacks on Mike's jobs since May, none on Dan's." },
    ],
    cta: [
      "Who's due for a spring tune-up and hasn't booked?",
      "Which jobs finished but never got invoiced?",
      "What did the Westwood install actually make us?",
      "Which maintenance plans expire before summer?",
      "Whose installs keep coming back as callbacks?",
    ],
  },
  {
    id: "roofing",
    label: "Roofing",
    noun: "a roofer",
    rows: [
      [
        { q: "Who owes us money past 30 days?", before: "bookkeeper, Thursday" },
        { q: "Which jobs are done but the final invoice never went out?", before: "Jobber against QuickBooks, by hand" },
        { q: "What did the Maple Street re-roof actually make us?", before: "quote, hours, dump fees, a spreadsheet" },
        { q: "How much did material overages cost us this quarter?", before: "supplier invoices against quotes, by hand" },
        { q: "Are we still paying last year's price per square?", before: "every supplier invoice since January" },
      ],
      [
        { q: "Which quotes from the storm week still aren't signed?", before: "scroll the sent folder" },
        { q: "Which estimates over $15,000 have gone quiet?", before: "nobody had time" },
        { q: "Which repair customers are probably due for a replacement?", before: "you notice when they call" },
        { q: "Which insurance jobs are waiting on an adjuster?", before: "a sticky note on the monitor" },
        { q: "Who referred us the most jobs this year?", before: "nobody tracked it" },
      ],
      [
        { q: "Which crew finishes on budget most often?", before: "nobody tracked it" },
        { q: "How many squares did we install last month against what we quoted?", before: "job sheets, a calculator" },
        { q: "Which jobs are waiting on a permit?", before: "the city portal, one by one" },
        { q: "How many days of work are booked before the rain?", before: "ask the foreman" },
        { q: "Which jobs came back for a leak within a year?", before: "dig through old work orders" },
      ],
    ],
    ask: [
      { q: "Which quotes from the storm week still aren't signed?", a: "Nine, worth $148,000. Four haven't been touched in two weeks." },
      { q: "What did the Maple Street re-roof actually make us?", a: "$6,200 on a $31,000 quote, after $2,400 in material overages." },
      { q: "Which crew finishes on budget most often?", a: "Carlos's crew, 11 of 12 jobs. Jay's crew ran over on 5 of 12." },
    ],
    cta: [
      "Which quotes from the storm week still aren't signed?",
      "Which jobs are done but the final invoice never went out?",
      "What did the Maple Street re-roof actually make us?",
      "Which crew finishes on budget most often?",
      "Which jobs are waiting on a permit?",
    ],
  },
  {
    id: "contractor",
    label: "Contractor",
    noun: "a contractor",
    rows: [
      [
        { q: "Which progress invoices are past due?", before: "bookkeeper, Thursday" },
        { q: "Which change orders were done but never billed?", before: "the site super's memory" },
        { q: "What did the Birchwood renovation actually make us?", before: "quote, hours, sub invoices, a spreadsheet" },
        { q: "Which subs have we paid more than we billed for?", before: "nobody ever checked" },
        { q: "How much holdback are we still owed?", before: "a spreadsheet from 2023" },
      ],
      [
        { q: "Which estimates over $50,000 have gone quiet?", before: "scroll the sent folder" },
        { q: "Which past clients might be due for a second project?", before: "you notice when they call" },
        { q: "Who referred us the most work this year?", before: "nobody tracked it" },
        { q: "Which quotes have sat with the client more than two weeks?", before: "the CRM, if someone updated it" },
        { q: "Which clients paid late on every draw?", before: "dig through old invoices" },
      ],
      [
        { q: "Which jobs are over budget right now?", before: "you find out at the final invoice" },
        { q: "Which sub is late most often?", before: "a hunch about the drywaller" },
        { q: "Which jobs are waiting on a permit or inspection?", before: "the city portal, one by one" },
        { q: "How many weeks of work are booked?", before: "ask the project manager" },
        { q: "Which jobs came back for warranty work?", before: "dig through old emails" },
      ],
    ],
    ask: [
      { q: "Which change orders were done but never billed?", a: "Seven across three jobs, $23,400 between them." },
      { q: "What did the Birchwood renovation actually make us?", a: "$14,000 on a $212,000 contract, after $18,000 in unbilled changes." },
      { q: "Which estimates over $50,000 have gone quiet?", a: "Five, worth $410,000. Two haven't been touched in three weeks." },
    ],
    cta: [
      "Which change orders were done but never billed?",
      "Which progress invoices are past due?",
      "What did the Birchwood renovation actually make us?",
      "Which estimates over $50,000 have gone quiet?",
      "Which jobs are over budget right now?",
    ],
  },
  {
    id: "landscaping",
    label: "Landscaping",
    noun: "a landscaper",
    rows: [
      [
        { q: "Which maintenance accounts are behind on their monthly?", before: "bookkeeper, Thursday" },
        { q: "Which installs are finished but never got invoiced?", before: "Jobber against QuickBooks, by hand" },
        { q: "What did the Cedar Lane install actually make us?", before: "quote, hours, plant receipts, a spreadsheet" },
        { q: "What did fuel cost us per crew last month?", before: "gas receipts in the truck" },
        { q: "How much did we spend at the nursery over what we quoted?", before: "supplier invoices against quotes, by hand" },
      ],
      [
        { q: "Which mowing contracts haven't renewed for spring?", before: "a spreadsheet you meant to update" },
        { q: "Which install quotes over $10,000 have gone quiet?", before: "scroll the sent folder" },
        { q: "Which customers had a lawn last year but not this year?", before: "you notice in May" },
        { q: "Who's due for fall cleanup and hasn't booked?", before: "the calendar, one by one" },
        { q: "Which commercial accounts are up for renewal before winter?", before: "nobody had time" },
      ],
      [
        { q: "Which crew finishes its route on time most often?", before: "nobody tracked it" },
        { q: "How many days of installs are booked before the frost?", before: "ask the foreman" },
        { q: "Which jobs ran over on labour this month?", before: "you find out at invoice" },
        { q: "Which properties keep coming back with complaints?", before: "a hunch about the north route" },
        { q: "How many hours did we lose to rain last week?", before: "timesheets, a calculator" },
      ],
    ],
    ask: [
      { q: "Which mowing contracts haven't renewed for spring?", a: "41 of last year's 190. About $96,000 in contracts." },
      { q: "What did the Cedar Lane install actually make us?", a: "$2,800 on a $19,500 quote, and the nursery bill ran $3,100 over." },
      { q: "Which crew finishes its route on time most often?", a: "Sam's crew, 9 weeks of 10. The north route ran late 6 of 10." },
    ],
    cta: [
      "Which mowing contracts haven't renewed for spring?",
      "Which installs are finished but never got invoiced?",
      "What did the Cedar Lane install actually make us?",
      "Who's due for fall cleanup and hasn't booked?",
      "Which crew finishes its route on time most often?",
    ],
  },
  {
    id: "cleaning",
    label: "Cleaning",
    noun: "a cleaning company",
    rows: [
      [
        { q: "Which contracts are behind on their monthly invoice?", before: "bookkeeper, Thursday" },
        { q: "Which one-time jobs got done but never invoiced?", before: "the schedule against QuickBooks, by hand" },
        { q: "What did the Guildford office contract actually make us last month?", before: "hours, supplies, a spreadsheet" },
        { q: "What did supplies cost us per site in August?", before: "receipts in the van" },
        { q: "Which sites are we losing money on?", before: "nobody ever checked" },
      ],
      [
        { q: "Which contracts are up for renewal before year end?", before: "a spreadsheet you meant to update" },
        { q: "Which clients cut hours this year?", before: "you notice on the invoice" },
        { q: "Which quotes over $2,000 a month never got a follow-up?", before: "scroll the sent folder" },
        { q: "Which move-out cleans came from the same property manager?", before: "nobody tracked it" },
        { q: "Which clients complained twice in the last 90 days?", before: "the inbox, if you search" },
      ],
      [
        { q: "Which crew finishes its sites on time most often?", before: "nobody tracked it" },
        { q: "Which sites keep getting missed items on the checklist?", before: "a hunch about the night crew" },
        { q: "How many hours did we bill against hours paid last week?", before: "timesheets against invoices, a Saturday" },
        { q: "Which cleaners are near overtime this week?", before: "the schedule, a calculator" },
        { q: "How many sites are booked for the long weekend?", before: "ask the supervisor" },
      ],
    ],
    ask: [
      { q: "Which contracts are up for renewal before year end?", a: "14, worth $186,000 a year. Three haven't been quoted yet." },
      { q: "What did the Guildford office contract actually make us?", a: "$640 on $4,200 billed. Hours ran 22% over the bid." },
      { q: "Which sites keep getting missed items?", a: "Two on the night route, both with the same crew since June." },
    ],
    cta: [
      "Which contracts are up for renewal before year end?",
      "Which one-time jobs got done but never invoiced?",
      "Which sites are we losing money on?",
      "Which clients cut hours this year?",
      "Which crew finishes its sites on time most often?",
    ],
  },
  {
    id: "trucking",
    label: "Trucking",
    noun: "a trucking company",
    rows: [
      [
        { q: "Which brokers are past 45 days on more than one load?", before: "an aging export, a Saturday" },
        { q: "What did each truck cost us per mile last month?", before: "fuel cards, repair bills, a spreadsheet" },
        { q: "Which loads did we haul below cost?", before: "nobody ever checked" },
        { q: "What did we spend on repairs per truck this year?", before: "the shop's invoices, one by one" },
        { q: "How much are we owed on loads delivered but not invoiced?", before: "the dispatch board against QuickBooks" },
      ],
      [
        { q: "Which customers shipped less this quarter than last?", before: "the dispatcher's memory" },
        { q: "Which brokers pay slowest?", before: "dig through old remittances" },
        { q: "Which lanes make us the most per mile?", before: "nobody tracked it" },
        { q: "Which customers haven't given us a load in 60 days?", before: "you notice when the phone stops" },
        { q: "Who's our biggest customer by margin, not revenue?", before: "quarterly, if someone builds the report" },
      ],
      [
        { q: "Which driver's loads come back with damage claims?", before: "a hunch" },
        { q: "How many empty miles did we run last week?", before: "logs, a calculator" },
        { q: "Which trucks are due for service before the next haul?", before: "the sticker on the windshield" },
        { q: "Which loads are trending late this week?", before: "call each driver" },
        { q: "Which drivers are near their hours for the week?", before: "the ELD, one by one" },
      ],
    ],
    ask: [
      { q: "Which brokers are past 45 days on more than one load?", a: "Six brokers, $71,000 between them. One is 90 days on four loads." },
      { q: "What did each truck cost us per mile last month?", a: "$1.92 on average. Unit 7 ran $2.41 after the transmission." },
      { q: "Which customers shipped less this quarter than last?", a: "Nine, down 31 loads. Fraser Valley Produce is half of that." },
    ],
    cta: [
      "Which brokers are past 45 days on more than one load?",
      "What did each truck cost us per mile last month?",
      "Which customers shipped less this quarter than last?",
      "How many empty miles did we run last week?",
      "Which trucks are due for service before the next haul?",
    ],
  },
  {
    id: "autorepair",
    label: "Auto repair",
    noun: "an auto repair shop",
    rows: [
      [
        { q: "Which fleet accounts are past 30 days?", before: "bookkeeper, Thursday" },
        { q: "Which repair orders closed but never got invoiced?", before: "the shop system against QuickBooks, by hand" },
        { q: "What was our parts margin last month?", before: "nobody ever checked" },
        { q: "What did comebacks cost us this quarter?", before: "dig through old work orders" },
        { q: "Which jobs do we quote wrong the most?", before: "estimate against actual, by hand" },
      ],
      [
        { q: "Which customers declined a repair and never came back?", before: "dig through old work orders" },
        { q: "Who's overdue for an oil change?", before: "the sticker on the windshield" },
        { q: "Which customers came once and never rebooked?", before: "nobody had time" },
        { q: "Which fleet quotes never got a follow-up?", before: "scroll the sent folder" },
        { q: "Which customers are due for tires before winter?", before: "the calendar, one by one" },
      ],
      [
        { q: "Which tech's jobs keep coming back?", before: "a hunch about the new guy" },
        { q: "How many bay hours are booked for next week?", before: "ask the service advisor" },
        { q: "Which jobs are waiting on parts?", before: "walk the shop and ask" },
        { q: "What did we bill against hours paid this week?", before: "timesheets against invoices, a Saturday" },
        { q: "Which day of the week do we lose money?", before: "nobody knew" },
      ],
    ],
    ask: [
      { q: "Which customers declined a repair and never came back?", a: "58 since January, about $41,000 in declined work." },
      { q: "What was our parts margin last month?", a: "31%, down from 38%. Two suppliers raised prices in May." },
      { q: "Which tech's jobs keep coming back?", a: "Four comebacks on Raj's jobs since April, one on everyone else's." },
    ],
    cta: [
      "Which customers declined a repair and never came back?",
      "Which repair orders closed but never got invoiced?",
      "What was our parts margin last month?",
      "Who's overdue for an oil change?",
      "Which tech's jobs keep coming back?",
    ],
  },
  {
    id: "distributor",
    label: "Distributor",
    noun: "a distributor",
    rows: [
      [
        { q: "Which accounts are past 60 days on more than one invoice?", before: "an aging export, a Saturday" },
        { q: "How much cash is sitting in slow stock?", before: "a count, an afternoon" },
        { q: "Which SKUs are we selling below margin?", before: "nobody ever checked" },
        { q: "Which supplier raised prices the most this year?", before: "last year's invoices, one by one" },
        { q: "What did rush freight cost us last month?", before: "carrier invoices, a calculator" },
      ],
      [
        { q: "Which accounts ordered less this quarter than last?", before: "the sales rep's memory" },
        { q: "Which customers bought twice and then stopped?", before: "nobody had time" },
        { q: "Are we still charging Coast Building Supply the old price?", before: "every invoice since January" },
        { q: "Which accounts haven't ordered in 90 days?", before: "a spreadsheet you meant to update" },
        { q: "Which rep's accounts are growing fastest?", before: "quarterly, if someone builds the report" },
      ],
      [
        { q: "Which SKUs are about to run out with open orders against them?", before: "walk the warehouse and ask" },
        { q: "What's due to ship by Friday?", before: "three open tabs" },
        { q: "Which orders are trending late this week?", before: "walk the floor and ask" },
        { q: "Which products sat more than 120 days?", before: "an inventory export, a Saturday" },
        { q: "Which supplier ships late most often?", before: "nobody tracked it" },
      ],
    ],
    ask: [
      { q: "Which accounts ordered less this quarter than last?", a: "23 accounts, down $86,000 combined. Coast Building Supply is the biggest drop." },
      { q: "Which SKUs are about to run out with orders against them?", a: "Six. Two ship Friday and there's no purchase order in yet." },
      { q: "Which accounts haven't ordered in 90 days?", a: "31 of them, worth $210,000 last year." },
    ],
    cta: [
      "Which accounts ordered less this quarter than last?",
      "Which accounts are past 60 days on more than one invoice?",
      "Which SKUs are about to run out with open orders against them?",
      "How much cash is sitting in slow stock?",
      "Which accounts haven't ordered in 90 days?",
    ],
  },
  {
    id: "other",
    label: "Something else",
    noun: "every business",
    catchAll: true,
    tagline: "Every business has these. Tell us yours on the call.",
    rows: [
      [
        { q: "Who owes me money right now?", before: "bookkeeper, Thursday" },
        { q: "Which jobs finished but never got invoiced?", before: "two exports and a Saturday" },
        { q: "Did we get paid for everything in June?", before: "invoices against the bank, by hand" },
        { q: "What did overtime cost us last month?", before: "payroll export, a calculator" },
        { q: "Is payroll covered for the 15th?", before: "bank app, gut feeling" },
      ],
      [
        { q: "Which customers went quiet this year?", before: "you notice in March" },
        { q: "Which quotes never got a follow-up?", before: "scroll the sent folder" },
        { q: "Which customers bought twice and then stopped?", before: "nobody had time" },
        { q: "Are we still charging anyone the old price?", before: "every invoice since January" },
        { q: "Which customers are we losing money on?", before: "nobody ever checked" },
      ],
      [
        { q: "Which day of the week do we lose money?", before: "nobody knew" },
        { q: "Are we overstaffed on Tuesday nights?", before: "schedule against sales, by hand" },
        { q: "What did no-shows cost us last month?", before: "front desk, a guess" },
        { q: "Which supplier raised prices the most this year?", before: "last year's invoices, one by one" },
        { q: "Which products are about to run out?", before: "you find out when it's gone" },
      ],
    ],
    ask: [
      { q: "Which jobs finished but never got invoiced?", a: "Four from last week, $11,200 between them." },
      { q: "What did the Oakridge job actually make us?", a: "$4,100 on an $18,500 quote, and labour ran 30 hours over." },
      { q: "Which customers went quiet this year?", a: "14 who booked every spring haven't yet, worth $31,000 last year." },
    ],
    cta: [
      "Who owes me money right now?",
      "Which jobs finished but never got invoiced?",
      "Which customers went quiet this year?",
      "Which quotes never got a follow-up?",
      "Which day of the week do we lose money?",
    ],
  },
];
