"use client";

import { gsap, useSightGsap } from "./motion";
import Cinematic, { Words } from "./Cinematic";

/**
 * Security: a full-width band after the How-it-works stack, open top
 * and bottom so it reads as page, not as a fifth card. The promise is in
 * the headline, the proof is a row of five marks the eye sweeps across,
 * each with one short caption. Each mark is a bitmap on a 15×15 grid,
 * drawn in chunky cells: the leaf is the only colour on the block, so
 * Canada is read first. The pixels spray up out of one point and lock
 * into the marks as the row scrolls up, then a slow diagonal glint is passed
 * down the row one mark at a time, so the row feels live without ever
 * all moving at once.
 */

type Item = { glyph: string[]; color?: string; title: string; caption: string };

const CANADA_RED = "#d3312e";

/* one string per row, X for a lit cell */
const LEAF = [
  ".......X.......",
  "......XXX......",
  "......XXX......",
  "..X...XXX...X..",
  "..XX..XXX..XX..",
  "..XXX.XXX.XXX..",
  "..XXXXXXXXXXX..",
  ".XXXXXXXXXXXXX.",
  "XXXXXXXXXXXXXXX",
  "..XXXXXXXXXXX..",
  "....XXXXXXX....",
  "......XXX......",
  ".......X.......",
  ".......X.......",
  ".......X.......",
];
const LOCK = [
  "...............",
  ".....XXXXX.....",
  "....XX...XX....",
  "....X.....X....",
  "....X.....X....",
  "....X.....X....",
  "..XXXXXXXXXXX..",
  "..XXXXXXXXXXX..",
  "..XXXXXXXXXXX..",
  "..XXXXX.XXXXX..",
  "..XXXX...XXXX..",
  "..XXXXX.XXXXX..",
  "..XXXXX.XXXXX..",
  "..XXXXXXXXXXX..",
  "..XXXXXXXXXXX..",
];
const SHIELD = [
  "XXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXX",
  "XXXXXX...XXXXXX",
  "XXXXX.....XXXXX",
  "XXXXX.....XXXXX",
  "XXXXXX...XXXXXX",
  ".XXXXXX.XXXXXX.",
  ".XXXXXX.XXXXXX.",
  "..XXXXXXXXXXX..",
  "..XXXXXXXXXXX..",
  "...XXXXXXXXX...",
  "....XXXXXXX....",
  ".....XXXXX.....",
  ".......X.......",
];
const BADGE = [
  ".....XXXXX.....",
  "...XXXXXXXXX...",
  "..XXXXXXXXXXX..",
  ".XXXXXXXXXXXXX.",
  ".XXXXXXXXXXX...",
  "XXXXXXXXXXX..XX",
  "XXXXXXXXXX..XXX",
  "XXX..XXXX..XXXX",
  "XXXX..XX..XXXXX",
  ".XXXX....XXXXX.",
  ".XXXXX..XXXXXX.",
  "..XXXXXXXXXXX..",
  "...XXXXXXXXX...",
  ".....XXXXX.....",
  "...............",
];
const MEDAL = [
  "...............",
  "...............",
  "...............",
  ".....XXXXX.....",
  "...XXX...XXX...",
  "..XX...X...XX..",
  "..X...XXX...X..",
  ".XX.XXXXXXX.XX.",
  ".XX..XXXXX..XX.",
  "..X..XXXXX..X..",
  "..XX.X...X.XX..",
  "...XXX...XXX...",
  ".....XXXXX.....",
  "....XX...XX....",
  "....XX...XX....",
];

/**
 * The mark: rounded cells on a 30×30 grid, doubled from a 15×15 bitmap,
 * only the lit ones drawn, so the shape sits on the page itself. The
 * cells are grouped in 2×2 blocks so the scatter and the glint have
 * ~130 things per mark to move, not ~500, and the row scrolls smooth.
 */
/**
 * Doubles a bitmap with EPX: each cell becomes four, and where two
 * neighbours agree on a diagonal the corner between them fills in, so
 * the stair-steps smooth out instead of just getting bigger. 15 → 30.
 */
function upscale(rows: string[]): boolean[][] {
  const n = rows.length;
  const at = (r: number, c: number) =>
    r >= 0 && c >= 0 && r < n && c < n && rows[r][c] === "X";
  const out: boolean[][] = Array.from({ length: n * 2 }, () =>
    Array(n * 2).fill(false),
  );
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const P = at(r, c);
      const A = at(r - 1, c);
      const B = at(r, c + 1);
      const C = at(r, c - 1);
      const D = at(r + 1, c);
      let tl = P,
        tr = P,
        bl = P,
        br = P;
      if (C === A && C !== D && A !== B) tl = A;
      if (A === B && A !== C && B !== D) tr = B;
      if (D === C && D !== B && C !== A) bl = C;
      if (B === D && B !== A && D !== C) br = D;
      out[r * 2][c * 2] = tl;
      out[r * 2][c * 2 + 1] = tr;
      out[r * 2 + 1][c * 2] = bl;
      out[r * 2 + 1][c * 2 + 1] = br;
    }
  }
  return out;
}

function Glyph({
  rows,
  color = "var(--ink)",
}: {
  rows: string[];
  color?: string;
}) {
  const grid = upscale(rows);
  const n = grid.length;
  const cell = 1;
  const gap = 0.3;
  const step = cell + gap;
  const size = n * step - gap;

  /* the lit cells in 2×2 blocks, so the scatter and the glint move ~130
     small groups per mark instead of ~500 cells. A block carries its
     diagonal index for the glint. */
  const blocks: {
    key: string;
    diag: number;
    cells: [number, number][];
  }[] = [];
  for (let br = 0; br < n; br += 2) {
    for (let bc = 0; bc < n; bc += 2) {
      const cells: [number, number][] = [];
      for (let r = br; r < br + 2; r++)
        for (let c = bc; c < bc + 2; c++) if (grid[r]?.[c]) cells.push([r, c]);
      if (cells.length)
        blocks.push({
          key: `${br}-${bc}`,
          diag: br / 2 + bc / 2,
          cells,
        });
    }
  }

  return (
    <svg
      data-glyph
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[148px] max-sm:w-[56px] max-sm:shrink-0"
      aria-hidden="true"
      fill={color}
    >
      {blocks.map((b) => (
        <g key={b.key} data-block data-diag={b.diag}>
          {b.cells.map(([r, c]) => (
            <rect
              key={`${r}-${c}`}
              x={c * step}
              y={r * step}
              width={cell}
              height={cell}
              rx={0.18}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

const ITEMS: Item[] = [
  {
    glyph: LEAF,
    color: CANADA_RED,
    title: "Stored in Canada",
    caption: "On Canadian servers, under Canadian law.",
  },
  {
    glyph: LOCK,
    title: "Encrypted",
    caption: "In transit and at rest, like your bank.",
  },
  {
    glyph: SHIELD,
    title: "PIPEDA",
    caption: "Handled under Canada's privacy law.",
  },
  {
    glyph: BADGE,
    title: "SOC 2 Type II",
    caption: "Hosted on audited infrastructure.",
  },
  {
    glyph: MEDAL,
    title: "ISO 27001",
    caption: "Hosted on certified infrastructure.",
  },
];

export default function Security() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-item]", root);
    const glyphs = gsap.utils.toArray<SVGSVGElement>("[data-glyph]", root);
    const row = root.querySelector("[data-row]");

    gsap.from(items, {
      opacity: 0,
      y: reduced ? 0 : 20,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: { trigger: row, start: "top 85%" },
    });
    if (reduced) return;

    const perGlyph = glyphs.map((glyph) =>
      gsap.utils.toArray<SVGGElement>("[data-block]", glyph),
    );

    /* scatter: every pixel starts at one point, a little way below the
       mark, spun and faded, and as the row scrolls up the page they spray
       out of it and lock into place to form the mark, one mark a beat
       after the last. Tied to the scrollbar, so the reader builds the
       seals by scrolling, and can scrub them back into the point. */
    perGlyph.forEach((blocks, i) => {
      const glyph = glyphs[i];
      const size = glyph.viewBox.baseVal.width;
      const origin = { x: size / 2, y: size + 26 };
      const centre = (el: SVGGElement) => {
        const b = el.getBBox();
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      };
      gsap.from(blocks, {
        x: (_, el: SVGGElement) =>
          origin.x - centre(el).x + gsap.utils.random(-2, 2),
        y: (_, el: SVGGElement) =>
          origin.y - centre(el).y + gsap.utils.random(-2, 2),
        rotation: () => gsap.utils.random(-270, 270),
        scale: 0.35,
        transformOrigin: "center",
        opacity: 0,
        ease: "power2.out",
        stagger: { each: 0.006, from: "random" },
        scrollTrigger: {
          trigger: row,
          start: `top+=${i * 16} 100%`,
          end: `top+=${i * 16} 52%`,
          scrub: 0.8,
        },
      });
    });

    /* glint: one slow diagonal wave, passed down the row a mark at a time,
       with a breath between marks and a longer rest before it comes round
       again, so only one mark is ever moving */
    const glint = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      delay: 1.2,
      scrollTrigger: { trigger: row, start: "top 60%" },
    });
    perGlyph.forEach((blocks, i) => {
      const at = i * 3.6;
      blocks.forEach((g) => {
        const d = at + Number(g.dataset.diag) * 0.065;
        glint
          .to(g, { opacity: 0.15, duration: 0.5, ease: "power1.inOut" }, d)
          .to(g, { opacity: 1, duration: 1.1, ease: "power2.out" }, d + 0.5);
      });
    });

    /* twinkle: now and then a single cell somewhere in the row blinks out
       and back, so the marks read as something running, not a print.
       Every sixth cell is enough to pick from. */
    const some = gsap.utils
      .toArray<SVGRectElement>("[data-block] rect", root)
      .filter((_, k) => k % 6 === 0);
    gsap.to(some, {
      opacity: 0.2,
      duration: 0.35,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
      delay: 2,
      stagger: { each: 0.5, from: "random", repeat: -1, repeatDelay: 2 },
      scrollTrigger: { trigger: row, start: "top 60%" },
    });
  });

  return (
    <section
      ref={scope}
      id="security"
      className="mt-10 scroll-mt-24 bg-white py-16 md:mt-16 md:py-24"
    >
      <div className="mx-auto w-[95%] max-w-[1280px]">
        {/* the promise */}
        <Cinematic className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <Words
            className="max-w-[22ch] font-semibold leading-[1.06] tracking-[-0.025em] text-[var(--ink)]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.1rem)" }}
          >
            Your numbers stay in Canada, and stay yours.
          </Words>
          <p
            data-blur
            className="max-w-[30rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)] lg:justify-self-end"
          >
            Sight keeps your books on Canadian servers, encrypted the whole way,
            and never mixes them with another business or uses them to train
            anything.
          </p>
        </Cinematic>

        {/* the proof. Phones run it as a list: a small glyph beside each
            title and caption, a hairline between rows. From sm it is the
            grid of big glyphs. */}
        <div
          data-row
          className="mt-10 grid grid-cols-1 border-t border-[var(--line)] sm:mt-12 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 sm:pt-12 md:mt-14 md:pt-16 lg:grid-cols-5 lg:gap-x-8"
        >
          {ITEMS.map((item) => (
            <div
              key={item.title}
              data-item
              className="flex items-center gap-5 border-b border-[var(--line)] py-5 max-sm:last:border-b-0 sm:flex-col sm:items-center sm:gap-0 sm:border-b-0 sm:py-0 sm:text-center"
            >
              <Glyph rows={item.glyph} color={item.color} />
              <div className="min-w-0">
                <p className="text-[1rem] font-medium leading-snug text-[var(--ink)] sm:mt-7">
                  {item.title}
                </p>
                <p className="mt-1 max-w-[14rem] text-[0.86rem] leading-[1.5] text-[var(--ink-soft)] sm:mt-1.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
