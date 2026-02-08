export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image: string;
  hoverImage?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Njagih Studios",
    description:
      "Crafting visual stories for artists and creatives through bold photography.",
    tags: ["Photography"],
    image: "/Njagih/njagih-cover.jpg",
    hoverImage: "/Njagih/njagih studios.png",
    url: "https://njagihstudios.com/",
  },
  {
    id: 2,
    name: "Sophia Chen Realtor",
    description: "Designing seamless fintech solutions.",
    tags: ["Realtors"],
    image: "/sophia/sophia-cover2.jpg",
    hoverImage: "/sophia/sophia-cover.png",
    url: "https://realtor-mock.vercel.app/",
  },
  {
    id: 3,
    name: "Clover Studio",
    description: "Building intelligent interfaces that inspire.",
    tags: ["Realtors"],
    image: "/clover/clover-cover.jpg",
    hoverImage: "/clover/cloverspace.png",
    url: "https://cloverspace.studio/",
  },
  {
    id: 4,
    name: "ACE",
    description: "Reimagining digital experiences for tomorrow.",
    tags: ["Software"],
    image: "/ACE/ace-cover.jpg",
    hoverImage: "/ACE/ace.png",
    url: "https://acesuasola.com/",
  },
  {
    id: 5,
    name: "iClaire Portfolio",
    description: "A personal portfolio showcasing creative work.",
    tags: ["Creative Agency"],
    image: "/iclaire/iclaire-cover.jpg",
    hoverImage: "/iclaire/iclaire-portfolio.jpg",
    url: "https://iclaire.space/",
  },
  {
    id: 6,
    name: "Rivera",
    description: "Modern real estate solutions for property professionals.",
    tags: ["Realtors"],
    image: "/sophia/sophia-cover1.jpg",
    hoverImage: "/rivera.png",
    url: "https://realtor-mock2.vercel.app/",
  },
];

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
