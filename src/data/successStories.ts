/**
 * Homepage "Success Stories" list. Each project has a storyboarded reel in
 * /public/success (1620x1080, 60fps, 12-13s): held hero, slow pans across the
 * sections worth seeing, a second page, dissolves between.
 */
/** A named partner shown inline in a description with its mark as a small round avatar. */
export interface StoryPartner {
  name: string;
  mark: string;
}

export interface SuccessStory {
  title: string;
  /** Plain text, or text interleaved with partners rendered as name + mark. */
  description: string | Array<string | StoryPartner>;
  resultValue: string;
  resultLabel: string;
  image: string;
  video: string;
  href: string;
  /** The live site the cover and reel open in a new tab. */
  site: string;
  /** Internal case study; adds a "View case study" button under the result. */
  caseStudy?: string;
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    title: "Innovative Aluminum",
    description:
      "Website rebuild for a Canadian aluminum railing manufacturer with 70+ dealers.",
    resultValue: "$5M+",
    resultLabel: "Dealer lifetime value signed in 90 days",
    image: "/success/innovative-aluminum.webp",
    video: "/success/innovative-aluminum.mp4",
    href: "/work",
    site: "https://www.innovativealuminum.com/",
    caseStudy: "/case-studies/innovative-aluminum",
  },
  {
    title: "Transforming Landscapes",
    description: [
      "Research site on First Nations-led development, for ",
      { name: "Real Estate Institute of BC", mark: "/success/reibc-mark.webp" },
      " and ",
      { name: "Greater Vancouver REALTORS", mark: "/success/gvr-mark.webp" },
      ".",
    ],
    resultValue: "12 studies",
    resultLabel: "With First Nations leaders across BC, on one platform",
    // Seawall photo for the card's cover; the reel keeps its own poster.
    image: "/success/transforming-landscapes-cover.webp",
    video: "/success/transforming-landscapes.mp4",
    href: "/work",
    site: "https://www.transforminglandscapes.ca/",
  },
  {
    title: "ACE",
    description:
      "Portfolio for a Vancouver concert and wedding photographer, built to feel like the work.",
    resultValue: "3x",
    resultLabel: "Monthly bookings, now fully booked three months out",
    // Concert photo for the card's cover; the reel keeps its own poster.
    image: "/success/ace-cover.jpg",
    video: "/success/ace.mp4",
    href: "/work",
    site: "https://acesuasola.com/",
  },
  {
    title: "Caddie Companion",
    description:
      "Headless Shopify store rebuild for a golf multi-tool that replaces six things in the bag.",
    resultValue: "+21%",
    resultLabel: "More visitors turned into buyers",
    // Product photo for the card's cover; the reel keeps its own poster.
    image: "/success/caddie-companion-cover.jpg",
    video: "/success/caddie-companion.mp4",
    href: "/work",
    site: "https://www.caddiecompanion.com/",
    caseStudy: "/case-studies/caddie-companion",
  },
];
