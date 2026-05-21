export interface Project {
  id: number;
  name: string;
  description: string;
  result?: string;
  kpis?: string[];
  tags: string[];
  image: string;
  imagePosition?: string;
  hoverImage?: string;
  hoverImagePosition?: string;
  url?: string;
  column?: "left" | "right";
  quote?: {
    texts: string[];
    author: string;
    role: string;
    avatar: string;
  };
  partnerLogos?: {
    name: string;
    src: string;
    className?: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 9,
    name: "Transforming Landscapes",
    description: "A research initiative on First Nations-led real estate development in BC.",
    tags: ["Realtors"],
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
      avatar: "/chris-hamade.jpg",
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
    id: 10,
    name: "Bloomkey",
    description: "Floral studio crafting bespoke arrangements for weddings and events.",
    kpis: ["Newly launched"],
    tags: ["Local Business"],
    image: "/bloomkey/bloomkey-cover.jpeg",
    imagePosition: "58% center",
    hoverImage: "/bloomkey/bloomkey.png",
    hoverImagePosition: "center 75%",
    url: "https://www.bloomkey.ca/",
  },
  {
    id: 11,
    name: "Afterparty",
    description: "Event production company designing unforgettable nights.",
    kpis: ["5,000 sessions · month one", "30 newsletter signups · day one", "100/100 PageSpeed score"],
    tags: ["Ecommerce"],
    image: "/afterparty/afterparty-cover.jpg",
    hoverImage: "/afterparty/afterparty.png",
    url: "https://www.afterparty.space/",
  },
  {
    id: 1,
    name: "ACE",
    description: "Reimagining digital experiences for tomorrow.",
    kpis: ["Tripled monthly bookings", "Fully booked 3 months out"],
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
    id: 8,
    name: "WrapCity",
    description: "Vinyl car wrap shop built to turn heads online and in the streets.",
    kpis: ["+34% booking inquiries", "~$15k pipeline from launch month"],
    tags: ["Local Business"],
    image: "/wrapcity-cover.webp",
    hoverImage: "/wrapcity-mockup.webp",
    url: "https://wrapcity.co/",
    quote: {
      texts: [
        "Just wanted to let you know I landed a $7000 job this morning because of the website. I didn't even advertise it!",
        "Also my Google Ads are working way better since the new site. Didn't expect that.",
      ],
      author: "Taylor Paige",
      role: "Founder, WrapCity",
      avatar: "/wrapcity-headshot-v3.webp",
    },
  },
  {
    id: 4,
    name: "Njagih Studios",
    description:
      "Crafting visual stories for artists and creatives through bold photography.",
    kpis: ["Built and launched in 7 days", "+21% inquiries · first 3 months"],
    tags: ["Photography"],
    image: "/Njagih/njagih-cover.jpg",
    hoverImage: "/Njagih/njagih studios.webp",
    url: "https://njagihstudios.com/",
    quote: {
      texts: ["Best designers I've worked with, no exaggeration"],
      author: "Israel Njagih",
      role: "Owner, Njagih Studios",
      avatar: "/Njagih/njagih-headshot-v2.webp",
    },
  },
  {
    id: 6,
    name: "Nancy Tran",
    description: "Real estate agent helping families find their perfect home in Vancouver.",
    kpis: ["Site paid for itself in 3 weeks", "8 qualified buyer leads · month one"],
    tags: ["Realtors"],
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
    id: 7,
    name: "Clover Studio",
    description: "Building intelligent interfaces that inspire.",
    kpis: ["Newly launched"],
    tags: ["Creative Agency"],
    image: "/clover/clover-cover.jpg",
    hoverImage: "/clover/cloverspace.webp",
    url: "https://cloverspace.studio/",
    quote: {
      texts: ["They actually get design. Best agency I've worked with."],
      author: "Alex",
      role: "Founder, Clover Studio",
      avatar: "/ACE/ace-headshot-v5.webp",
    },
  },
  {
    id: 3,
    name: "League1v1",
    description: "Vancouver's competitive basketball league — built for players, sponsors, and the game.",
    kpis: ["Built in 5 days", "$8k in sponsorship revenue"],
    tags: ["Sports & Events"],
    image: "/league1v1-cover.webp",
    hoverImage: "/league1v1.webp",
    url: "https://league1v1.com/",
    quote: {
      texts: ["Dude I honestly didn't think we needed a website, im glad you guys proved me wrong"],
      author: "Jacob Abraham",
      role: "Co-founder, League1v1",
      avatar: "/league1v1-headshot.webp",
    },
  },
];

export const HOMEPAGE_PROJECT_IDS = [9, 1, 3, 4, 8];
export const homepageProjects = projects.filter((p) =>
  HOMEPAGE_PROJECT_IDS.includes(p.id)
);

export const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
