"use client";

/**
 * The interstitial between the work and the process: the question the
 * visitor is now asking, before Our Approach answers it.
 *
 * Laid out like a technical sheet on the same paper as the sections above,
 * in their DM Sans. The question sits top-left as a justified block; the
 * four phases index top-right with a live Surrey clock under them; the
 * studio's coordinates bottom-left; a one-paragraph "how" bottom-right in
 * small tracked caps that hands off to Our Approach.
 *
 * In the middle, the answer as an object: a website drawn as wireframe
 * line-work, exploded into five floating layers (frame, nav, hero, cards,
 * copy and footer) and turning slowly in 3D. The section pins for one extra
 * viewport and, as you scroll, the layers close up and the whole thing
 * settles flat into a finished screen while the fills come in. The cursor
 * tilts it. A green marker hops layer to layer as they land.
 *
 * This section is also the curtain over Our Approach, which starts one
 * viewport early behind it: it is a full viewport tall, above it in the
 * stack, and its rounded bottom edge does the revealing.
 *
 * PLACEHOLDER: the paragraph and headline are first-pass copy.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import s from "./HowDoWeDoIt.module.css";

gsap.registerPlugin(ScrollTrigger);

const PHASES = ["Research", "Kickoff", "Design", "Build"];

/** Surrey City Hall, roughly. */
const LAT = "49.1913° N";
const LON = "122.8490° W";
const TZ = "America/Vancouver";

/** Exploded stack: resting spacing between layers and the resting tilt. */
const LAYER_GAP = 64;
const TILT = { x: 50, z: -18 };

/* The sheet is 600 x 400 units. One line colour at one weight, so the five
   layers read as a single drawing. */
const W = 600;
const H = 400;
const LINE = "rgb(26 22 19 / 0.5)";
const FILL = "#1a1613";

function Frame() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.sheet} aria-hidden>
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="10" fill="none" stroke={LINE} />
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2={H} stroke={LINE} strokeOpacity="0.4" />
      ))}
      {[100, 200, 300].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={LINE} strokeOpacity="0.4" />
      ))}
    </svg>
  );
}

function Nav() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.sheet} aria-hidden>
      <rect x="24" y="18" width="18" height="18" rx="4" fill="none" stroke={LINE} />
      {[300, 350, 400].map((x) => (
        <rect key={x} x={x} y="24" width="32" height="6" rx="3" fill="none" stroke={LINE} />
      ))}
      <rect x="500" y="18" width="76" height="18" rx="9" fill="none" stroke={LINE} />
      <g data-fill style={{ opacity: 0 }}>
        <rect x="24" y="18" width="18" height="18" rx="4" fill={FILL} />
        <rect x="500" y="18" width="76" height="18" rx="9" fill={FILL} />
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.sheet} aria-hidden>
      <rect x="24" y="72" width="230" height="16" rx="3" fill="none" stroke={LINE} />
      <rect x="24" y="96" width="180" height="16" rx="3" fill="none" stroke={LINE} />
      <rect x="24" y="128" width="200" height="6" rx="3" fill="none" stroke={LINE} />
      <rect x="24" y="140" width="150" height="6" rx="3" fill="none" stroke={LINE} />
      <rect x="24" y="164" width="88" height="22" rx="11" fill="none" stroke={LINE} />
      <rect x="312" y="64" width="264" height="128" rx="10" fill="none" stroke={LINE} />
      <line x1="312" y1="64" x2="576" y2="192" stroke={LINE} strokeOpacity="0.5" />
      <line x1="576" y1="64" x2="312" y2="192" stroke={LINE} strokeOpacity="0.5" />
      <g data-fill style={{ opacity: 0 }}>
        <rect x="24" y="72" width="230" height="16" rx="3" fill={FILL} />
        <rect x="24" y="96" width="180" height="16" rx="3" fill={FILL} />
        <rect x="24" y="164" width="88" height="22" rx="11" fill={FILL} />
        <rect x="312" y="64" width="264" height="128" rx="10" fill={FILL} />
      </g>
    </svg>
  );
}

function Cards() {
  const xs = [24, 216, 408];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.sheet} aria-hidden>
      {xs.map((x) => (
        <g key={x}>
          <rect x={x} y="216" width="168" height="96" rx="8" fill="none" stroke={LINE} />
          <rect x={x + 12} y="228" width="144" height="44" rx="6" fill="none" stroke={LINE} />
          <rect x={x + 12} y="282" width="80" height="6" rx="3" fill="none" stroke={LINE} />
          <rect x={x + 12} y="294" width="112" height="6" rx="3" fill="none" stroke={LINE} />
        </g>
      ))}
      <g data-fill style={{ opacity: 0 }}>
        {xs.map((x) => (
          <g key={x}>
            <rect x={x} y="216" width="168" height="96" rx="8" fill="#fff" />
            <rect x={x + 12} y="228" width="144" height="44" rx="6" fill={FILL} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Foot() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.sheet} aria-hidden>
      {[24, 312].map((x) => (
        <g key={x}>
          <rect x={x} y="336" width="120" height="8" rx="3" fill="none" stroke={LINE} />
          <rect x={x} y="352" width="264" height="5" rx="2.5" fill="none" stroke={LINE} />
          <rect x={x} y="362" width="220" height="5" rx="2.5" fill="none" stroke={LINE} />
        </g>
      ))}
      <line x1="24" y1="382" x2="576" y2="382" stroke={LINE} />
      <g data-fill style={{ opacity: 0 }}>
        {[24, 312].map((x) => (
          <rect key={x} x={x} y="336" width="120" height="8" rx="3" fill={FILL} />
        ))}
      </g>
    </svg>
  );
}

const LAYERS = [Frame, Nav, Hero, Cards, Foot];

/** Where the marker sits on each layer, in sheet units. */
const MARKS = [
  { x: 20, y: 20 },
  { x: 560, y: 20 },
  { x: 304, y: 56 },
  { x: 400, y: 208 },
  { x: 568, y: 374 },
];

function useSurreyClock() {
  const [now, setNow] = useState({ time: "", zone: "" });
  useEffect(() => {
    const part = (opts: Intl.DateTimeFormatOptions, d: Date) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ, ...opts })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value ?? "";
    const tick = () => {
      const d = new Date();
      const time = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
      const zone = part({ timeZoneName: "short" }, d) || "PT";
      const offset = part({ timeZoneName: "shortOffset" }, d).replace("GMT", "UTC");
      setNow({ time, zone: offset ? `${zone} (${offset})` : zone });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function HowDoWeDoIt() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const clock = useSurreyClock();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const stack = stackRef.current;
    if (!section || !stage || !tilt || !stack) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layers = Array.from(stack.querySelectorAll<HTMLElement>("[data-layer]"));
    const fills = Array.from(stack.querySelectorAll<SVGGElement>("[data-fill]"));
    const marker = stack.querySelector<HTMLElement>("[data-marker]");

    const setMarker = (i: number) => {
      if (!marker) return;
      const m = MARKS[i];
      marker.style.left = `${(m.x / W) * 100}%`;
      marker.style.top = `${(m.y / H) * 100}%`;
      const z = layers[i] ? Number(gsap.getProperty(layers[i], "z")) : 0;
      gsap.set(marker, { z: z + 2 });
    };

    if (reduced) {
      // The finished screen, no motion.
      gsap.set(stack, { rotateX: 0, rotateZ: 0 });
      gsap.set(layers, { z: 0 });
      gsap.set(fills, { opacity: 1 });
      setMarker(MARKS.length - 1);
      return;
    }

    /* ---- cursor tilt on the wrapper outside the scrubbed stack ---- */
    const rx = gsap.quickTo(tilt, "rotateX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(tilt, "rotateY", { duration: 0.8, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    const ctx = gsap.context(() => {
      /* Scroll transition in: the sheet arrives as a plate inset from the
         edges with the hero's zoomed corners and opens out to full bleed by
         the time it pins, keeping only the curtain's bottom corners. */
      const wide = () => window.innerWidth >= 1280;
      gsap.fromTo(
        section,
        { clipPath: () => (wide() ? "inset(6vh 32px 6vh 32px round 64px 64px 64px 64px)" : "inset(4vh 16px 4vh 16px round 24px 24px 24px 24px)") },
        {
          clipPath: () => (wide() ? "inset(0vh 0px 0vh 0px round 0px 0px 48px 48px)" : "inset(0vh 0px 0vh 0px round 0px 0px 24px 24px)"),
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      /* resting state: exploded, tilted, slowly turning, each layer bobbing
         on its own phase so the stack reads as floating */
      gsap.set(stack, { rotateX: TILT.x, rotateZ: TILT.z });
      layers.forEach((l, i) => gsap.set(l, { z: i * LAYER_GAP }));
      setMarker(0);
      const idle = gsap.to(stack, {
        rotateZ: TILT.z + 10,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      const bob = layers.map((l, i) =>
        gsap.to(l, {
          y: i % 2 ? 7 : -7,
          duration: 2.4 + i * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: -i * 0.6,
        })
      );

      /* entry: headline lines rise, furniture fades, the object floats up */
      const entry = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
      entry.from(section.querySelectorAll("[data-word]"), {
        yPercent: 110,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.08,
      });
      entry.from(
        section.querySelectorAll("[data-fade]"),
        { opacity: 0, y: 10, duration: 1, ease: "expo.out", stagger: 0.06 },
        0.2
      );
      entry.from(stage, { y: 60, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.1);

      /* pin for one viewport and assemble the page on the way through */
      const assemble = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onEnter: () => {
            idle.pause();
            bob.forEach((b) => b.pause());
            gsap.to(layers, { y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          },
          onLeaveBack: () => {
            idle.play();
            bob.forEach((b) => b.play());
          },
        },
      });
      // top layer first, so the page stacks down onto the frame
      layers.forEach((l, i) => {
        assemble.to(
          l,
          {
            z: 0,
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: () => setMarker(i),
            onReverseComplete: () => setMarker(Math.max(0, i - 1)),
          },
          0.1 + (layers.length - 1 - i) * 0.06
        );
      });
      assemble.to(stack, { rotateX: 0, rotateZ: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);
      assemble.to(fills, { opacity: 1, duration: 0.25, stagger: 0.03 }, 0.72);
    }, section);

    return () => {
      ctx.revert();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.wrap} aria-label="How do we do it">
      <h2 className={s.question}>
        {["How do we", "actually", "do it?"].map((line) => (
          <span key={line} className={s.line}>
            <span className={s.word} data-word>
              {line}
            </span>
          </span>
        ))}
      </h2>

      <ul className={s.index} data-fade>
        {PHASES.map((p, i) => (
          <li key={p} className={s.indexItem}>
            <span className={s.square} aria-hidden />
            {p}
            <span className={s.indexNum}>[{i + 1}]</span>
          </li>
        ))}
      </ul>

      <dl className={`${s.meta} ${s.clock}`} data-fade>
        <div>
          <dt>Local time:</dt>
          <dd>{clock.time || "00:00:00"}</dd>
        </div>
        <div>
          <dt>Time zone:</dt>
          <dd>{clock.zone || "PT"}</dd>
        </div>
      </dl>

      <div className={s.stageBox}>
        <div ref={stageRef} className={s.stage}>
          <span className={`${s.corner} ${s.cornerTr}`} aria-hidden />
          <span className={`${s.corner} ${s.cornerBl}`} aria-hidden />
          <div ref={tiltRef} className={s.tilt}>
            <div ref={stackRef} className={s.stack}>
              {LAYERS.map((Layer, i) => (
                <div key={i} className={s.layer} data-layer>
                  <Layer />
                </div>
              ))}
              <span className={s.marker} data-marker aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <dl className={`${s.meta} ${s.coords}`} data-fade>
        <div>
          <dt>Lat:</dt>
          <dd>{LAT}</dd>
        </div>
        <div>
          <dt>Lon:</dt>
          <dd>{LON}</dd>
        </div>
      </dl>

      <p className={s.how} data-fade>
        Every site starts as a drawing. We study how your customers buy, lock
        the plan on one call, design each section to earn the next scroll, then
        build it by hand and ship inside a week. No templates. No handoffs.
      </p>
    </section>
  );
}
