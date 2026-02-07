export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Njagih Studios",
    description:
      "Crafting visual stories for artists and creatives through bold photography.",
    tags: ["Photography", "Brand Identity", "Creative Direction"],
    image: "/njagih studios.png",
  },
  {
    id: 2,
    name: "ACE",
    description: "Reimagining digital experiences for tomorrow.",
    tags: ["Strategy", "Product Design", "Engineering"],
    image: "/ace.png",
  },
  {
    id: 3,
    name: "Clover Studio",
    description: "Building intelligent interfaces that inspire.",
    tags: ["AI Integration", "Product Design", "Brand"],
    image: "/Clover Studio.png",
  },
  {
    id: 4,
    name: "Sophie",
    description: "Designing seamless fintech solutions.",
    tags: ["Fintech", "Product Design", "Development"],
    image: "/Sophie.png",
  },
];

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
