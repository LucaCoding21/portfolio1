/**
 * Client marks for the homepage logo strip. Same art the Sight page's Trust
 * section uses; heights are tuned for a single low strip on paper.
 */
export interface ClientLogo {
  name: string;
  src: string;
  /** Relative height in px, before the trust bar scales and caps it. */
  height: number;
  /** White or very pale art that needs flattening to ink to read on paper. */
  dark?: boolean;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Innovative Aluminum Systems", src: "/ias-newgold.svg", height: 40 },
  { name: "Real Estate Institute of BC", src: "/transforming/reibc-logo.png", height: 34 },
  { name: "Greater Vancouver REALTORS", src: "/transforming/gvr-logo.png", height: 40 },
  { name: "Ondek", src: "/sight/clients/ondek.png", height: 40 },
  { name: "Transforming Landscapes", src: "/transforming-landscapes.svg", height: 40 },
  { name: "Northwest Railing", src: "/sight/clients/northwest-railing.png", height: 56 },
  // White art: flattened to ink so it shows on paper.
  { name: "Venues Quarterly", src: "/sight/clients/venues-quarterly.png", height: 31, dark: true },
  { name: "Caddie Companion", src: "/sight/clients/caddie-companion.png", height: 34 },
  { name: "WrapCity", src: "/sight/clients/wrapcity.png", height: 34 },
  { name: "League1v1", src: "/sight/clients/league1v1.webp", height: 45 },
  { name: "Real Estate 360", src: "/sight/clients/real-estate-360-v2.webp", height: 40 },
  // Pale gold art: greys out to nothing, so it is flattened to ink as well.
  { name: "Venue Series", src: "/sight/clients/venue-series-2.png", height: 45, dark: true },
];
