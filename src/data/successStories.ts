/**
 * Homepage "Success Stories" list. Copy and figures are lifted verbatim from
 * the reference section; the image and reel are the two sample assets that
 * every entry shares for now. Swap `image` / `video` per project when the real
 * assets land.
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

const SAMPLE_IMAGE = "/success/oh-architecture.avif";
const SAMPLE_VIDEO = "/success/oh-architecture.webm";

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
    title: "Supersolid",
    description:
      "Website for a 100% creative-owned Sydney agency built to merge commercial value with cultural impact.",
    resultValue: "58%",
    resultLabel: "Increase in average session duration",
    image: SAMPLE_IMAGE,
    video: SAMPLE_VIDEO,
    href: "/work",
  },
  {
    title: "Mammoth Murals",
    description:
      "Brand strategy, identity and website for an established mural agency with a decade of large-scale public art behind it.",
    resultValue: "$100K+",
    resultLabel: "In new work within 30 days of launch",
    image: SAMPLE_IMAGE,
    video: SAMPLE_VIDEO,
    href: "/work",
  },
  {
    title: "HISS (University of Sydney)",
    description:
      "Brand identity and website for a University of Sydney initiative challenging the norms of queer education on a global stage.",
    resultValue: "15+",
    resultLabel: "Global universities united on a single platform",
    image: SAMPLE_IMAGE,
    video: SAMPLE_VIDEO,
    href: "/work",
  },
];
