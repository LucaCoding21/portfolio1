/**
 * Homepage "Success Stories" list. Each project has a storyboarded reel in
 * /public/success (1620x1080, 60fps, 12-13s): held hero, slow pans across the
 * sections worth seeing, a second page, dissolves between. The first entry's
 * copy is still the reference's placeholder.
 */
export interface SuccessStory {
  title: string;
  description: string;
  resultValue: string;
  resultLabel: string;
  image: string;
  video: string;
  href: string;
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    title: "Innovative Aluminum",
    description:
      "Brand refresh and website for a practice with a decade of crafting high-end homes for Australian families.",
    resultValue: "21%",
    resultLabel: "Increase in conversions with projects starting from $2M+",
    image: "/success/innovative-aluminum.webp",
    video: "/success/innovative-aluminum.mp4",
    href: "/work",
  },
  {
    title: "Transforming Landscapes",
    description:
      "A research initiative on First Nations-led real estate development in BC.",
    // PLACEHOLDER: no outcome figure on file for this one yet.
    resultValue: "2026",
    resultLabel: "Report launched with the Real Estate Institute of BC and Greater Vancouver REALTORS",
    image: "/success/transforming-landscapes.webp",
    video: "/success/transforming-landscapes.mp4",
    href: "/work",
  },
  {
    title: "ACE",
    description:
      "Portfolio for a Vancouver concert and wedding photographer, built to feel like the work.",
    resultValue: "3x",
    resultLabel: "Monthly bookings, now fully booked three months out",
    image: "/success/ace.webp",
    video: "/success/ace.mp4",
    href: "/work",
  },
  {
    title: "Caddie Companion",
    description:
      "Direct-to-golfer store for a six-in-one multi-tool, from exploded view to checkout.",
    // PLACEHOLDER: no outcome figure on file for this one yet.
    resultValue: "6-in-1",
    resultLabel: "Every tool a golfer carries, sold from one page",
    image: "/success/caddie-companion.webp",
    video: "/success/caddie-companion.mp4",
    href: "/work",
  },
];
