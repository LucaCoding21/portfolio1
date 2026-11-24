"use client";

/**
 * The motion kit behind the problem cards' small scenes (Nov 15 2026), ported
 * from x.ai/bot's feature cards ("Everything you'd want in a teammate") so
 * the timing matches theirs:
 *
 * - a scene is a list of [ms, change] steps, each one a state the scene
 *   draws, played on timers and looped (a 300ms fade between runs);
 * - a cursor glides between `data-target` elements on a slight arc: 260ms
 *   plus 0.9ms per pixel (300 to 650ms), ease-in-out cubic, bowing sideways
 *   by 8% of the distance (24px at most); a press scales it to 0.9 for 80ms.
 *
 * Their engine (x.ai's FeatureStepCard and stage cursor) reads the same; the
 * looks live in StallScenes.module.css.
 */
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import k from "./StallScenes.module.css";

export type Script<S> = { armed: S; steps: { atMs: number; value: S }[]; lengthMs: number; final: S };

/** Builds a script from changes: each step is the state so far plus its change. `finalMs` picks the frame shown still (reduced motion). */
export function script<S extends object>(
  armed: S,
  raw: [number, Partial<S>][],
  lengthMs: number,
  finalMs = Infinity,
): Script<S> {
  const steps: { atMs: number; value: S }[] = [];
  for (const [atMs, change] of raw) {
    const prev = steps.length ? steps[steps.length - 1].value : armed;
    steps.push({ atMs, value: { ...prev, ...change } });
  }
  let final = armed;
  for (const st of steps) if (st.atMs <= finalMs) final = st.value;
  return { armed, steps, lengthMs, final };
}

/** One change per tick: [at, at + gap, ...] setting `key` to 1, 2, ... n (x.ai types and ticks this way). */
export function ticks<S>(at: number, n: number, gap: number, key: keyof S): [number, Partial<S>][] {
  return Array.from({ length: n }, (_, i) => [at + gap * i, { [key]: i + 1 } as Partial<S>]);
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(reducedQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/**
 * Plays a script while `playing`, looping it; when playing stops, it waits
 * for the card's slide-out (0.7s) before going back to the start, so the
 * reset is never seen. With reduced motion it shows the still frame.
 */
export function useScript<S>(sc: Script<S>, playing: boolean, still: boolean, lead = 0) {
  const [state, setState] = useState(sc.armed);
  const [run, setRun] = useState(0);
  const [dim, setDim] = useState(false);

  useEffect(() => {
    if (still) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (!playing) {
      at(700, () => {
        setState(sc.armed);
        setDim(false);
      });
    } else {
      at(0, () => {
        setState(sc.armed);
        setDim(false);
      });
      // the first run waits `lead` ms (the card's slide-in on desktop)
      const wait = run === 0 ? lead : 0;
      for (const st of sc.steps) at(wait + st.atMs, () => setState(st.value));
      at(wait + sc.lengthMs, () => setDim(true));
      at(wait + sc.lengthMs + 300, () => setRun((r) => r + 1));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [sc, playing, still, run, lead]);

  return { s: still ? sc.final : state, dim: still ? false : dim };
}

/**
 * Where the cursor should be: a point on the `data-target` element named
 * `at` (or `home` when null), `data-ax`/`data-ay` across it (0.72 and 0.6 by
 * default), measured against the scene and again when it resizes.
 */
export function useTargetPoint(root: RefObject<HTMLElement | null>, at: string | null, tick: unknown) {
  // null until measured, so the cursor starts in place instead of gliding in from the corner
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const t = el.querySelector<HTMLElement>(`[data-target="${at ?? "home"}"]`);
      if (!t) return;
      const r = el.getBoundingClientRect();
      const b = t.getBoundingClientRect();
      const ax = Number(t.dataset.ax ?? 0.72);
      const ay = Number(t.dataset.ay ?? 0.6);
      // in the scene's own pixels, should anything above it be scaled
      const z = r.width / el.offsetWidth || 1;
      setP({ x: (b.left - r.left + b.width * ax) / z, y: (b.top - r.top + b.height * ay) / z });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [root, at, tick]);
  return p;
}

/** x.ai's pointer: black with a white edge, its tip at (7.5, 5.25) of the 24px glyph. */
function Pointer() {
  return (
    <svg height="24" width="24" viewBox="0 0 32 32" fill="none" aria-hidden>
      <g transform="translate(10 7)">
        <path
          d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
          fill="#fff"
        />
        <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000" />
      </g>
    </svg>
  );
}

export function StageCursor({
  at,
  pressed,
  hidden,
  still,
  name = "You",
  touch,
}: {
  at: { x: number; y: number } | null;
  pressed?: boolean;
  hidden?: boolean;
  still?: boolean;
  name?: string;
  /** a fingertip (a soft grey dot, no label) for scenes on a phone */
  touch?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const flag = useRef<HTMLSpanElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const measured = at != null;
  const x = at?.x ?? 0;
  const y = at?.y ?? 0;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !measured) return;
    const put = (p: { x: number; y: number }) => {
      last.current = p;
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    };
    const a = last.current;
    const dist = a ? Math.hypot(x - a.x, y - a.y) : 0;
    if (!a || still || hidden || dist < 0.5) return put({ x, y });
    const dur = Math.min(Math.max(260 + 0.9 * dist, 300), 650);
    const bow = Math.min(0.08 * dist, 24);
    const nx = -(y - a.y) / dist;
    const ny = (x - a.x) / dist;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const r = Math.min((now - t0) / dur, 1);
      const e = r < 0.5 ? 4 * r * r * r : 1 - (-2 * r + 2) ** 3 / 2;
      const off = Math.sin(Math.PI * e) * bow;
      put({ x: a.x + (x - a.x) * e + nx * off, y: a.y + (y - a.y) * e + ny * off });
      if (r < 1) raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [x, y, still, hidden, measured]);

  // the label goes to the pointer's left, or above it, where it would run
  // off the scene (the narrow slots on laptops, the short band on phones)
  useLayoutEffect(() => {
    const el = ref.current;
    const f = flag.current;
    const box = el?.parentElement;
    if (!el || !box || !measured) return;
    const fw = f?.offsetWidth ?? 0;
    const fh = f?.offsetHeight ?? 0;
    el.toggleAttribute("data-flip", x + 11 + fw > box.clientWidth - 4);
    el.toggleAttribute("data-flip-y", y + 16 + fh > box.clientHeight - 4);
  }, [x, y, name, measured]);

  return (
    <div
      ref={ref}
      className={k.cursor}
      data-pressed={pressed || undefined}
      data-hidden={hidden || !measured || undefined}
      aria-hidden
    >
      <div className={k.cursorPress}>
        <div className={k.cursorGlyph} data-touch={touch || undefined}>
          {touch ? <span className={k.touchDot} /> : <Pointer />}
        </div>
      </div>
      {/* a new label pops in when it changes ("You", then a question) */}
      {name && !touch ? (
        <span key={name} ref={flag} className={k.cursorFlag}>
          {name}
        </span>
      ) : null}
    </div>
  );
}

/** A grey placeholder line, as x.ai draws everything that isn't the point. */
export function Skel({ w, h = 5, strong }: { w: number | string; h?: number; strong?: boolean }) {
  return <span className={k.skel} data-strong={strong || undefined} style={{ width: w, height: h }} />;
}

/** A number that rolls up when it changes (x.ai's feature-digit-in). */
export function Digits({ value }: { value: string | number }) {
  return (
    <span className={k.digits}>
      <span key={value} className={k.digitIn}>
        {value}
      </span>
    </span>
  );
}

/** Words that swap in place: the old fades, the new rises 3px (x.ai's feature-text-swap). */
export function Swap({ items, index, className }: { items: string[]; index: number; className?: string }) {
  return (
    <span className={`${k.textSwap} ${className ?? ""}`}>
      {items.map((t, i) => (
        <span key={t} data-hidden={i !== index || undefined}>
          {t}
        </span>
      ))}
    </span>
  );
}
