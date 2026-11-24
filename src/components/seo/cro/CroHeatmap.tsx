"use client";

/**
 * "Heatmaps": a month of clicks on the home page of a site we built, drawn
 * the way heatmap tools draw them (each click a soft spot, the spots added
 * up and coloured blue to red), filling in over a couple of seconds. Scroll
 * depth was shown after it until William found it hard to read (Nov 24
 * 2026). The big photo at the top gets clicked a lot but isn't a link,
 * which is the finding. Example data.
 */
import { useEffect, useRef } from "react";
import s from "../SeoCro.module.css";
import { box, Browser, Takeaway, useClock, type PanelProps } from "./CroKit";

const LEN = 9000;
/** the part of the page the heat covers, in the capture's pixels */
const AREA_H = 2000;
const SCALE = 0.5;
const PAGE_W_HEAT = 1440 * SCALE;
/** each click's soft spot, in canvas pixels (half the capture's) */
const RADIUS = 22;
/** the map fills in over this many steps */
const STEPS = 9;

// [x, y, spread x, spread y, clicks]: where people clicked, in the capture's pixels
const SPOTS: [number, number, number, number, number][] = [
  [1300, 99, 42, 12, 110], // Get a Free Quote, in the header
  [126, 808, 48, 14, 70], // Get a Quote, in the hero
  [1095, 29, 40, 8, 38], // the phone number, top bar
  [1146, 99, 28, 9, 26], // the phone number, header
  [584, 99, 20, 8, 24], // Products
  [710, 99, 16, 8, 9], // About
  [932, 99, 18, 8, 12], // Contact
  [494, 99, 14, 8, 6], // Home
  [315, 808, 40, 12, 6], // Explore systems
  [1040, 430, 150, 120, 52], // the hero photo (not a link)
  [380, 590, 180, 40, 8], // the headline
  [192, 1720, 70, 90, 12], // Aluminum
  [545, 1720, 70, 90, 18], // Glass
  [896, 1720, 70, 90, 16], // Cable
  [1248, 1720, 70, 90, 9], // Custom
  [1000, 1140, 260, 120, 8], // the trust points
];

const MOST: { label: string; pct: number; note?: string }[] = [
  { label: "Get a Free Quote (header)", pct: 24 },
  { label: "Get a Quote (hero)", pct: 15 },
  { label: "Big photo at the top", pct: 11, note: "Not a link" },
  { label: "Phone number", pct: 9 },
  { label: "Products menu", pct: 5 },
];

/** mulberry32: the same clicks every time */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function points() {
  const rand = rng(7);
  const gauss = () => {
    const u = Math.max(rand(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const out: [number, number][] = [];
  for (const [x, y, sx, sy, n] of SPOTS) {
    for (let i = 0; i < n; i++) out.push([x + gauss() * sx * 0.55, y + gauss() * sy * 0.55]);
  }
  // shuffled, so the map fills in everywhere at once
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** blue to red, see-through at the cold end */
function palette() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 1;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, "rgba(0, 60, 255, 0)");
  grad.addColorStop(0.12, "rgba(0, 90, 255, 0.45)");
  grad.addColorStop(0.32, "rgba(0, 210, 255, 0.62)");
  grad.addColorStop(0.52, "rgba(40, 235, 90, 0.72)");
  grad.addColorStop(0.72, "rgba(255, 230, 0, 0.84)");
  grad.addColorStop(1, "rgba(255, 40, 10, 0.92)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 1);
  return g.getImageData(0, 0, 256, 1).data;
}

export function Heat({ level, steps }: { level: number; steps: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const kit = useRef<{ pts: [number, number][]; pal: Uint8ClampedArray; stamp: HTMLCanvasElement } | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (!kit.current) {
      const stamp = document.createElement("canvas");
      const r = RADIUS;
      stamp.width = stamp.height = r * 2;
      const g = stamp.getContext("2d")!;
      const grad = g.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, r * 2, r * 2);
      kit.current = { pts: points(), pal: palette(), stamp };
    }
    const { pts, pal, stamp } = kit.current;
    const w = PAGE_W_HEAT;
    const h = AREA_H * SCALE;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const n = Math.round((pts.length * level) / steps);
    ctx.globalAlpha = 0.13;
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i];
      ctx.drawImage(stamp, x * SCALE - RADIUS, y * SCALE - RADIUS);
    }
    ctx.globalAlpha = 1;
    if (!n) return;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (!a) continue;
      const k = Math.min(255, Math.round(a * 1.15)) * 4;
      d[i] = pal[k];
      d[i + 1] = pal[k + 1];
      d[i + 2] = pal[k + 2];
      d[i + 3] = pal[k + 3];
    }
    ctx.putImageData(img, 0, 0);
  }, [level, steps]);

  return <canvas ref={ref} className={s.heat} width={PAGE_W_HEAT} height={AREA_H * SCALE} style={box(0, 0, 1440, AREA_H)} />;
}

export default function CroHeatmap({ playing, still }: PanelProps) {
  const { t, run, dim } = useClock(LEN, playing, still);
  const level = still ? STEPS : Math.min(STEPS, Math.floor(t / 240) + 1);

  return (
    <>
      <div className={s.main} data-dim={dim || undefined}>
        <Browser
          pageClassName={s.pageHeat}
          tools={<span className={s.toolChip}>Clicks · July</span>}
          page={<Heat key={run} level={level} steps={STEPS} />}
        />
      </div>

      <aside className={s.side}>
        <div className={s.sideHead}>
          <div>
            <p className={s.sideTitle}>Home page</p>
            <p className={s.sideMeta}>July · 1,180 visitors · 2,046 clicks</p>
          </div>
        </div>

        <ul className={s.ranks} data-heat>
          <li className={s.ranksHead}>Most clicked</li>
          {MOST.map((m) => (
            <li key={m.label}>
              <span className={s.rankLabel}>
                {m.label}
                {m.note ? <span className={s.deadTag}>{m.note}</span> : null}
              </span>
              <span className={s.rankBar}>
                <i style={{ width: `${(m.pct / 24) * 100}%` }} />
              </span>
              <span className={s.rankPct}>{m.pct}%</span>
            </li>
          ))}
        </ul>

        <Takeaway
          saw="Lots of people clicked the big photo at the top, but it isn't a link."
          changed="The photo now opens the project gallery."
        />
      </aside>
    </>
  );
}
