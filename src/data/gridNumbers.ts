/**
 * Homepage stats grid. Intro plus two columns of outcome figures. The
 * columns render side by side; the second one
 * parallaxes against the first on desktop.
 */
export interface GridNumber {
  value: string;
  label: string;
}

/**
 * SAMPLE copy. The intro is a first pass at who we are; the figures are real
 * outcomes pulled from `projects.ts` and the Work page, framed as what a new
 * site did for the business rather than as facts about the studio.
 */
export const GRID_NUMBERS_INTRO =
  "We design and build custom websites for established businesses in Surrey, BC, shaped around how their customers buy and live in under a week.";

export const GRID_NUMBERS_LINK = { label: "See the work", href: "/work" };

export const GRID_NUMBERS_COLUMNS: GridNumber[][] = [
  [
    { value: "+35%", label: "Average conversion lift" },
    { value: "3x", label: "Monthly bookings" },
    { value: "+34%", label: "Booking inquiries" },
  ],
  [
    { value: "5.000", label: "Sessions in month one" },
    { value: "100", label: "PageSpeed score" },
    { value: "7 days", label: "Kickoff to launch" },
  ],
];
