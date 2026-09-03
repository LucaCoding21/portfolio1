export interface ClientLogo {
  name: string;
  src: string;
  /** Tailwind height classes; widths are always auto so aspect is preserved. */
  className: string;
  /**
   * Run the source art through `brightness-0 invert` to flatten it to white.
   * Only works on art with a real alpha channel, and only on single-tone art —
   * a two-tone mark fuses into one solid block. Marks that need more than that
   * have a pre-made white cut checked in instead (see `src` comments).
   */
  invert?: boolean;
}

/**
 * White-on-dark client marks. Not currently rendered anywhere — kept here so
 * they can be dropped into a section without redoing the white treatment.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "Innovative Aluminum Systems",
    // White cut of /ias-newgold.svg: the gold frame and white inner panel are
    // dropped so the wordmark stays legible instead of flattening to a block.
    src: "/ias-white.svg",
    className: "h-7 md:h-12",
  },
  {
    name: "Real Estate Institute of British Columbia",
    src: "/transforming/reibc-logo.png",
    className: "h-7 md:h-12",
    invert: true,
  },
  {
    name: "Greater Vancouver REALTORS",
    // White cut of /transforming/gvr-logo.png: the mark is two-tone, so a flat
    // invert fuses the deep-green square and the lime figure. This version
    // whitens the green and knocks the lime shape out so the icon still reads.
    src: "/gvr-white.png",
    className: "h-10 md:h-[4.5rem]",
  },
  {
    name: "Transforming Landscapes",
    src: "/transforming-landscapes.svg",
    className: "h-9 md:h-16",
    invert: true,
  },
];
