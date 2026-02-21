export interface Project {
  id: number;
  name: string;
  description: string;
  result?: string;
  kpis?: string[];
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
    kpis: ["+43% booking inquiries"],
    tags: ["Photography"],
    image: "/Njagih/njagih-cover.jpg",
    hoverImage: "/Njagih/njagih studios.webp",
    url: "https://njagihstudios.com/",
  },
  {
    id: 3,
    name: "Clover Studio",
    description: "Building intelligent interfaces that inspire.",
    kpis: ["Newly launched"],
    tags: ["Creative Agency"],
    image: "/clover/clover-cover.jpg",
    hoverImage: "/clover/cloverspace.webp",
    url: "https://cloverspace.studio/",
  },
  {
    id: 4,
    name: "ACE",
    description: "Reimagining digital experiences for tomorrow.",
    kpis: ["200% increase in bookings", "Fully booked 3 months out"],
    tags: ["Photography"],
    image: "/ACE/ace-cover.jpg",
    hoverImage: "/ACE/ace.webp",
    url: "https://acesuasola.com/",
  },
  {
    id: 6,
    name: "Rivera",
    description: "Modern real estate solutions for property professionals.",
    kpis: ["4 qualified buyer inquiries", "+130% listing engagement"],
    tags: ["Realtors"],
    image: "/sophia/sophia-cover1.jpg",
    hoverImage: "/rivera.webp",
    url: "https://realtor-mock2.vercel.app/",
  },
  {
    id: 7,
    name: "League1v1",
    description: "Vancouver's competitive basketball league — built for players, sponsors, and the game.",
    kpis: ["Newly launched", "$5k in sponsorship revenue"],
    tags: ["Sports & Events"],
    image: "/ACE/ace-cover.jpg",
    hoverImage: "/ACE/ace.webp",
  },
  {
    id: 8,
    name: "WrapCity",
    description: "Vinyl car wrap shop built to turn heads online and in the streets.",
    kpis: ["Newly launched"],
    tags: ["Local Business"],
    image: "/clover/clover-cover.jpg",
    hoverImage: "/clover/cloverspace.webp",
  },
  {
    id: 9,
    name: "Nancy Tran",
    description: "Real estate agent helping families find their perfect home in Vancouver.",
    kpis: ["8 qualified leads · first month", "$2M in listing exposure"],
    tags: ["Realtors"],
    image: "/sophia/sophia-cover2.jpg",
    hoverImage: "/sophia/sophia-cover.webp",
  },
];

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
