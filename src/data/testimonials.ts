/**
 * Homepage testimonials: the three client videos. The written quotes below
 * are no longer shown in that section (a video took their card) but are
 * kept as the reference copy. Every quote is the client's own words, the same
 * text used elsewhere on the site (projects.ts, clientWall.ts); keep them in
 * step.
 */

export interface VideoTestimonial {
  name: string;
  role: string;
  video: string;
  poster: string;
  /** object-position for the footage inside the 9:16 frame. */
  position: string;
}

export interface TextTestimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  stat?: { value: string; label: string };
}

export const TESTIMONIAL_VIDEOS: VideoTestimonial[] = [
  {
    name: "Ellen and Vien",
    role: "Founder and Co-founder, Afterparty",
    video: "/testimonials/afterparty-vien-ellen.mp4",
    poster: "/testimonials/afterparty-vien-ellen-poster.jpg",
    position: "center 40%",
  },
  {
    name: "Paula Wilson",
    role: "Founder, Flow State Therapy",
    video: "/testimonials/flowstate-paula.mp4",
    poster: "/testimonials/flowstate-paula-poster.jpg",
    position: "center 35%",
  },
  {
    name: "Taylor Paige",
    role: "Founder, WrapCity",
    video: "/testimonials/wrapcity-taylor.mp4",
    poster: "/testimonials/wrapcity-taylor-poster.jpg",
    position: "center 30%",
  },
];

export const TESTIMONIAL_QUOTES: TextTestimonial[] = [
  {
    name: "Taylor Paige",
    role: "Founder, WrapCity",
    avatar: "/wrapcity-headshot-v3.webp",
    stat: { value: "+34%", label: "booking inquiries" },
    quote:
      "Just wanted to let you know I landed a $7,000 job this morning because of the website. I didn't even advertise it! Also my Google Ads are working way better since the new site. Didn't expect that.",
  },
  {
    name: "Christopher Hamade",
    role: "Executive Director, Real Estate Institute of BC",
    quote: "Nice work, William! I love this. It feels fresh and interesting and keeps me scrolling.",
  },
  {
    name: "Gabrial Winkler",
    role: "Founder, Northwest Railing",
    avatar: "/testimonials/gabrial-winkler-poster.jpg",
    stat: { value: "+39%", label: "inquiries in 3 months" },
    quote:
      "I'm getting about a third more inquiries since the new site went up.",
  },
  {
    name: "Ace Suasola",
    role: "Owner, ACE",
    avatar: "/ACE/ace-headshot-v5.webp",
    stat: { value: "3x", label: "monthly bookings" },
    quote: "Bro you guys actually got the vibe, that was the hard part.",
  },
  {
    name: "Israel Njagih",
    role: "Owner, Njagih Studios",
    avatar: "/Njagih/njagih-headshot-v2.webp",
    quote:
      "I sent them my photos and answered one call. Nine days later the site was live. I did almost nothing.",
  },
  {
    name: "Nancy Tran",
    role: "Realtor, Grand Central Realty",
    avatar: "/nancy-headshot.webp",
    stat: { value: "3 weeks", label: "for the site to pay for itself" },
    quote:
      "After 5 years in real estate, this is the first website I'm actually proud to share with clients.",
  },
];
