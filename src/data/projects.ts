export interface Project {
  id: number;
  name: string;
  description: string;
  result?: string;
  kpis?: string[];
  /**
   * The same claims as `kpis`, split into the headline figure and what it
   * measures, so they can be set as scannable stat tiles rather than a line of
   * prose. Nothing new is asserted here — if you change a `kpis` entry, change
   * its `metrics` twin directly below it.
   */
  metrics?: { value: string; label: string }[];
  tags: string[];
  image: string;
  imagePosition?: string;
  hoverImage?: string;
  hoverImagePosition?: string;
  url?: string;
  /** /work grid: show `description` in the quote slot (only when there is no quote). */
  showDescription?: boolean;
  column?: "left" | "right";
  quote?: {
    texts: string[];
    author: string;
    role: string;
    avatar?: string;
  };
  partnerLogos?: {
    name: string;
    src: string;
    className?: string;
  }[];
}

export const projects: Project[] = [
  // Order here is the order on /work (owner's call, September 2026). Covers
  // for the projects added in September are each site's share image until
  // real photos land.
  {
    id: 8,
    name: "WrapCity",
    description: "Vinyl car wrap shop built to turn heads online and in the streets.",
    kpis: ["+34% booking inquiries", "~$40k pipeline in 3 months"],
    metrics: [
      { value: "+34%", label: "Booking inquiries" },
      { value: "~$40k", label: "Pipeline in 3 months" },
    ],
    tags: ["Trades & Manufacturing"],
    image: "/wrapcity-cover.webp",
    hoverImage: "/wrapcity-mockup.webp",
    url: "https://wrapcity.co/",
    quote: {
      texts: [
        "Just wanted to let you know I landed a $7,000 job this morning because of the website. I didn't even advertise it!",
        "Also my Google Ads are working way better since the new site. Didn't expect that.",
      ],
      author: "Taylor Paige",
      role: "Founder, WrapCity",
      avatar: "/wrapcity-headshot-v3.webp",
    },
  },
  {
    id: 14,
    name: "Northwest Railing",
    description: "Custom glass, aluminum and cable railings installed across Washington State.",
    kpis: ["+33% inquiries in 3 months"],
    metrics: [{ value: "+33%", label: "Inquiries in 3 months" }],
    tags: ["Trades & Manufacturing"],
    image: "/northwest-railing/northwest-railing-cover.jpg",
    url: "https://www.northwestrailing.com/",
    quote: {
      texts: [
        "Inquiries were up 33% in the first three months. It paid for itself faster than anything else I've spent on.",
      ],
      author: "Gabrial Winkler",
      role: "Founder, Northwest Railing",
    },
  },
  {
    id: 12,
    name: "Innovative Aluminum",
    description: "Website rebuild for a Canadian aluminum railing manufacturer with 70+ dealers.",
    kpis: ["Dealers signed in 90 days worth an estimated $5M+ over their lifetime", "60 inquiries in the first 3 months, up from about 7 a year"],
    metrics: [
      { value: "$5M+", label: "Estimated lifetime value of the dealers signed in 90 days" },
      { value: "60", label: "Inquiries in the first 3 months, up from about 7 a year" },
    ],
    tags: ["Trades & Manufacturing"],
    image: "/success/innovative-aluminum.webp",
    url: "https://www.innovativealuminum.com/",
  },
  {
    id: 9,
    name: "Transforming Landscapes",
    description: "A research initiative on First Nations-led real estate development in BC.",
    kpis: ["12 studies with First Nations leaders"],
    metrics: [{ value: "12 studies", label: "With First Nations leaders" }],
    tags: ["Real Estate"],
    image: "/transforming/transforming-cover.jpg",
    hoverImage: "/transforming/transforming.png",
    url: "https://www.transforminglandscapes.ca/",
    quote: {
      texts: [
        "NICE WORK, WILLIAM!",
        "I love this. It feels fresh and interesting and keeps me scrolling.",
      ],
      author: "Christopher Hamade",
      role: "Executive Director, Real Estate Institute of BC",
    },
    partnerLogos: [
      { name: "Real Estate Institute of BC", src: "/transforming/reibc-logo.png" },
      {
        name: "Greater Vancouver REALTORS",
        src: "/transforming/gvr-logo.png",
        className: "h-9 md:h-11 w-auto object-contain",
      },
    ],
  },
  {
    id: 11,
    name: "Afterparty",
    description: "Event production company designing unforgettable nights.",
    kpis: ["5,000 sessions in 1 month", "30 newsletter signups in 1 day", "100/100 PageSpeed score"],
    tags: ["Events & Hospitality", "Ecommerce & Shopify"],
    image: "/afterparty/afterparty-cover.jpg",
    hoverImage: "/afterparty/afterparty.png",
    url: "https://www.afterparty.space/",
    // Verbatim from the owners' video testimonial. Ellen's line, for another
    // placement: "I feel like they really over-delivered, and I feel like they
    // just truly care about the end result."
    quote: {
      texts: ["It was one of the smoothest processes I've ever had for any project."],
      author: "Vien",
      role: "Co-founder, Afterparty",
      avatar: "/afterparty/vien-headshot.jpg",
    },
  },
  {
    id: 13,
    name: "Caddie Companion",
    description: "Headless Shopify store rebuild for a golf multi-tool that replaces six things in the bag.",
    kpis: ["+21% more visitors turned into buyers", "PageSpeed score from about 30 to 99"],
    metrics: [
      { value: "+21%", label: "More visitors turned into buyers" },
    ],
    tags: ["Ecommerce & Shopify"],
    image: "/success/caddie-companion-cover.jpg",
    url: "https://www.caddiecompanion.com/",
  },
  {
    id: 1,
    name: "ACE",
    description:
      "Portfolio for a Vancouver concert and wedding photographer, built to feel like the work.",
    kpis: ["Tripled monthly bookings", "Fully booked 3 months out"],
    metrics: [
      { value: "Tripled", label: "Monthly bookings" },
      { value: "Fully booked", label: "3 months out" },
    ],
    tags: ["Photography"],
    image: "/ACE/ace-cover.jpg",
    hoverImage: "/ACE/ace.webp",
    url: "https://acesuasola.com/",
    quote: {
      texts: ["Bro you guys actually got the vibe, that was the hard part"],
      author: "Ace Suasola",
      role: "Owner, ACE",
      avatar: "/ACE/ace-headshot-v5.webp",
    },
  },
  {
    id: 18,
    name: "Real Estate 360",
    description: "Site for REIBC's conference, with speakers including BCREA's CEO and Chief Economist.",
    showDescription: true,
    kpis: ["15+ BC industry speakers"],
    metrics: [{ value: "15+", label: "BC industry speakers" }],
    tags: ["Real Estate", "Events & Hospitality"],
    image: "/re360/re360-cover.jpg",
    url: "https://www.re360.ca/",
  },
  {
    id: 16,
    name: "Southbound Sips",
    description: "Mobile bar and bartending service for weddings and events across Georgia.",
    kpis: ["Site paid for itself in 4 days"],
    tags: ["Events & Hospitality"],
    image: "/southboundsips/southboundsips-cover.jpg",
    url: "https://www.southboundsips.com/",
  },
  {
    id: 19,
    name: "Flow State Therapy",
    description: "Virtual counselling practice serving clients across British Columbia.",
    kpis: ["100/100 accessibility score", "94 PageSpeed performance score"],
    metrics: [
      { value: "100/100", label: "Accessibility score" },
      { value: "94", label: "PageSpeed performance score" },
    ],
    tags: ["Clinics & Therapy"],
    image: "/flowstate/flowstate-cover.jpg",
    url: "https://www.flowstate-therapy.com/",
    // Verbatim from Paula's video testimonial. Also usable: "I have no regrets
    // and I love what we came up with."
    quote: {
      texts: ["They made things so easy for me and the creative process was super fun."],
      author: "Paula Wilson",
      role: "Founder, Flow State Therapy",
      avatar: "/flowstate/paula-headshot.jpg",
    },
  },
  {
    id: 6,
    name: "Nancy Tran",
    description: "Real estate agent helping families find their perfect home in Vancouver.",
    kpis: ["Site paid for itself in 3 weeks", "8 qualified buyer leads in 1 month"],
    tags: ["Real Estate"],
    image: "/sophia/sophia-cover2.jpg",
    hoverImage: "/nancy-mockup.webp",
    url: "https://nancytranrealtor.com/",
    quote: {
      texts: ["After 5 years in real estate, this is the first website I'm actually proud to share with clients."],
      author: "Nancy Tran",
      role: "Realtor, Grand Central Realty",
      avatar: "/nancy-headshot.webp",
    },
  },
  {
    id: 10,
    name: "Bloomkey",
    description: "Career counselling and employment coaching practice in Surrey, BC.",
    kpis: ["Built and launched in 9 days"],
    tags: ["Clinics & Therapy"],
    image: "/bloomkey/bloomkey-cover.jpeg",
    imagePosition: "58% center",
    hoverImage: "/bloomkey/bloomkey.png",
    hoverImagePosition: "center 75%",
    url: "https://www.bloomkey.ca/",
    quote: {
      texts: ["What they quoted is what we paid. No surprise add-ons at the end."],
      author: "Mishele",
      role: "Founder, Bloomkey",
    },
  },
  {
    id: 4,
    name: "Njagih Studios",
    description:
      "Crafting visual stories for artists and creatives through bold photography.",
    kpis: ["Built and launched in 9 days", "+21% inquiries in 3 months"],
    tags: ["Photography"],
    image: "/Njagih/njagih-cover.jpg",
    hoverImage: "/Njagih/njagih studios.webp",
    url: "https://njagihstudios.com/",
    quote: {
      texts: ["I sent them my photos and answered one call. Nine days later the site was live. I did almost nothing."],
      author: "Israel Njagih",
      role: "Owner, Njagih Studios",
      avatar: "/Njagih/njagih-headshot-v2.webp",
    },
  },
  {
    id: 15,
    name: "Shoobydoo",
    description: "Concert and live music photography from festivals and club shows in Vancouver.",
    kpis: ["Newly launched"],
    metrics: [{ value: "Newly launched", label: "" }],
    tags: ["Photography"],
    image: "/shoobydoo/shoobydoo-cover.jpg",
    url: "https://www.shoobydoo.ca/",
  },
  {
    id: 17,
    name: "Dreamhouse Printing",
    description: "Vancouver screen printing and embroidery shop with instant online quotes.",
    kpis: ["Newly launched"],
    metrics: [{ value: "Newly launched", label: "" }],
    tags: ["Ecommerce & Shopify"],
    image: "/dreamhouse/dreamhouse-cover.jpg",
    url: "https://www.dreamhouseprinting.com/",
  },
];

export const HOMEPAGE_PROJECT_IDS = [9, 1, 4, 8];
export const homepageProjects = projects.filter((p) =>
  HOMEPAGE_PROJECT_IDS.includes(p.id)
);

/**
 * The studio's headline figures, shown in the About section (TeamIntro) and
 * listed in /llms.txt. `value` counts up from zero on scroll, with thousands
 * separators; `prefix` and `suffix` are printed around it.
 */
export const STUDIO_STATS = [
  { value: 3000, prefix: "", suffix: "+", label: "Customer inquiries generated" },
  { value: 35, prefix: "+", suffix: "%", label: "Conversion lift" },
  { value: 30, prefix: "", suffix: "+", label: "Websites launched" },
  { value: 40, prefix: "+", suffix: "%", label: "More inquiries" },
];

/** Booking page. Every booking CTA opens it in a new tab. */
export const CAL_URL = "https://cal.com/cloverfield/30min";
/**
 * The free website review ("See what we'd fix"). The site's URL is passed as
 * ?website=…, which Cal prefills into the booking question with identifier
 * `website`.
 */
export const REVIEW_CAL_URL = "https://cal.com/cloverfield/website-review";

export const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/#how-we-do-it" },
  { label: "About", href: "/#about" },
  { label: "Sight", href: "/sight" },
];
