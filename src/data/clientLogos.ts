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
  { name: "Real Estate Institute of BC", src: "/transforming/reibc-logo.webp", height: 34 },
  { name: "Greater Vancouver REALTORS", src: "/transforming/gvr-logo.webp", height: 40 },
  { name: "Ondek", src: "/sight/clients/ondek.webp", height: 40 },
  { name: "Transforming Landscapes", src: "/transforming-landscapes.svg", height: 40 },
  { name: "Northwest Railing", src: "/sight/clients/northwest-railing.webp", height: 56 },
  // White art: flattened to ink so it shows on paper.
  { name: "Venues Quarterly", src: "/sight/clients/venues-quarterly.webp", height: 31, dark: true },
  { name: "Caddie Companion", src: "/sight/clients/caddie-companion.webp", height: 34 },
  { name: "WrapCity", src: "/sight/clients/wrapcity.webp", height: 34 },
  { name: "Real Estate 360", src: "/sight/clients/real-estate-360-v2.webp", height: 40 },
  // Pale gold art: greys out to nothing, so it is flattened to ink as well.
  { name: "Venue Series", src: "/sight/clients/venue-series-2.webp", height: 45, dark: true },
  // The site's own nav mark (Space Grotesk "ACE" in a hairline box), captured
  // white on transparent from acesuasola.com and flattened to ink here.
  { name: "Ace Suasola", src: "/sight/clients/ace.webp", height: 40, dark: true },
  // Text wordmark from njagihstudios.com (Source Sans 3 bold, uppercase),
  // rendered white on transparent and flattened to ink here.
  { name: "Njagih Studios", src: "/sight/clients/njagih-studios.webp", height: 18, dark: true },
  // The dog drawing with the Fraunces wordmark set under it, composited white
  // on transparent at the site's proportions and flattened to ink here.
  { name: "Shoobydoo", src: "/sight/clients/shoobydoo.webp", height: 48, dark: true },
  // Black hedgehog mark with the wordmark under it; already ink on transparent.
  { name: "Afterparty", src: "/sight/clients/afterparty.webp", height: 48 },
  { name: "Bloomkey", src: "/sight/clients/bloomkey.webp", height: 40 },
  { name: "Southbound Sips", src: "/sight/clients/southbound-sips.webp", height: 48 },
  { name: "Dreamhouse Printing", src: "/sight/clients/dreamhouse-printing.webp", height: 38 },
];

/** Each logo file's intrinsic size, so an <img> can carry width/height and
 *  hold its shape before the file arrives (no reflow when it loads). Update
 *  it when a logo file changes. */
export const LOGO_SIZES: Record<string, [number, number]> = {
  "/ias-newgold.svg": [473, 160],
  "/sight/clients/ace.webp": [310, 200],
  "/sight/clients/afterparty.webp": [176, 200],
  "/sight/clients/bloomkey.webp": [200, 200],
  "/sight/clients/caddie-companion.webp": [305, 103],
  "/sight/clients/dreamhouse-printing.webp": [664, 200],
  "/sight/clients/njagih-studios.webp": [1242, 192],
  "/sight/clients/northwest-railing.webp": [210, 200],
  "/sight/clients/ondek.webp": [426, 200],
  "/sight/clients/real-estate-360-v2.webp": [500, 500],
  "/sight/clients/shoobydoo.webp": [369, 200],
  "/sight/clients/southbound-sips.webp": [205, 200],
  "/sight/clients/venue-series-2.webp": [354, 200],
  "/sight/clients/venues-quarterly.webp": [573, 200],
  "/sight/clients/wrapcity.webp": [640, 197],
  "/transforming-landscapes.svg": [732, 236],
  "/transforming/gvr-logo.webp": [381, 200],
  "/transforming/reibc-logo.webp": [500, 180],
};
