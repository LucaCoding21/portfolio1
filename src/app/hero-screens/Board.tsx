"use client";

import { useEffect, useState } from "react";
import type { Group, Screen } from "./screens";
import s from "./board.module.css";

const PHONE = { w: 390, h: 844 };
const DESKTOP = { w: 1440, h: 900 };
const SIZES = [
  { label: "S", scale: 0.6 },
  { label: "M", scale: 0.8 },
  { label: "L", scale: 1 },
];
const SCALE_KEY = "hero-screens-scale";

export default function Board({ groups }: { groups: Group[] }) {
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(SCALE_KEY));
      if (SIZES.some((z) => z.scale === saved)) setScale(saved);
    } catch {}
  }, []);

  function pick(next: number) {
    setScale(next);
    try {
      localStorage.setItem(SCALE_KEY, String(next));
    } catch {}
  }

  let n = 0;
  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Hero screens</h1>
          <p className={s.lede}>
            Every state of the homepage hero&apos;s free site review, live from the code. Each frame is the real hero
            started at that step, and you can click through it: nothing is emailed or tracked. Where the design PDF has
            the same screen, it sits beside the frame. Refresh after a change.
          </p>
        </div>
        <div className={s.sizes} role="group" aria-label="Frame size">
          {SIZES.map((z) => (
            <button
              key={z.label}
              type="button"
              className={s.size}
              aria-pressed={scale === z.scale}
              onClick={() => pick(z.scale)}
            >
              {z.label}
            </button>
          ))}
        </div>
      </header>

      {groups.map((group) => (
        <section key={group.title} className={s.group}>
          <div className={s.groupHead}>
            <h2 className={s.groupTitle}>{group.title}</h2>
            <p className={s.groupNote}>{group.note}</p>
          </div>
          <div className={s.grid}>
            {group.screens.map((screen) => (
              <Frame key={screen.key} n={++n} screen={screen} scale={scale} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Frame({ n, screen, scale }: { n: number; screen: Screen; scale: number }) {
  const [version, setVersion] = useState(0);
  const desktop = screen.size === "desktop";
  const size = desktop ? DESKTOP : PHONE;
  // laptop windows smaller than the phones, so a frame and its design fit a row
  const k = desktop ? scale * 0.5 : scale;
  const src = `/hero-screens/${screen.key}`;
  const box = { width: size.w * k, height: size.h * k };

  return (
    <figure className={s.frame}>
      <div className={s.pair}>
        <div className={s.side}>
          <div className={`${s.viewport} ${desktop ? s.desktop : ""}`} style={box}>
            <div className={s.inner} style={{ width: size.w, height: size.h, transform: `scale(${k})` }}>
              <iframe key={version} src={src} title={screen.title} className={s.iframe} loading="lazy" />
            </div>
          </div>
          {screen.design && <span className={s.tag}>Built</span>}
        </div>
        {screen.design && (
          <div className={s.side}>
            <div className={`${s.viewport} ${desktop ? s.desktop : ""}`} style={box}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size reference shot */}
              <img src={screen.design.src} alt={`${screen.title}, from the design`} className={s.design} />
            </div>
            <span className={s.tag}>Design (PDF)</span>
          </div>
        )}
      </div>
      <figcaption className={s.caption}>
        <span className={s.num}>{n}</span>
        <span className={s.captionText}>
          <span className={s.captionTitle}>{screen.title}</span>
          <span className={s.captionNote}>{screen.note}</span>
          <span className={s.captionActions}>
            <button type="button" className={s.action} onClick={() => setVersion((v) => v + 1)}>
              Reset
            </button>
            <a className={s.action} href={src} target="_blank" rel="noreferrer">
              Open
            </a>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
