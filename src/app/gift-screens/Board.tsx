"use client";

import { useEffect, useState } from "react";
import type { Group, Screen } from "./screens";
import s from "./board.module.css";

const PHONE = { w: 390, h: 844 };
const DESKTOP = { w: 1280, h: 800 };
const SIZES = [
  { label: "S", scale: 0.6 },
  { label: "M", scale: 0.8 },
  { label: "L", scale: 1 },
];
const SCALE_KEY = "gift-screens-scale";

type Text = { from: string; story: string; note: string; title: string };

export default function Board({ groups, text }: { groups: Group[]; text: Text }) {
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
          <h1 className={s.title}>Gift screens</h1>
          <p className={s.lede}>
            Every screen of the referral gift, live from the code with sample data: {text.story}. Nothing here is saved
            or sent. Refresh after a change.
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
              <Frame key={screen.key} n={++n} screen={screen} scale={scale} text={text} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Frame({ n, screen, scale, text }: { n: number; screen: Screen; scale: number; text: Text }) {
  const [version, setVersion] = useState(0);
  const desktop = screen.kind === "url" && screen.size === "desktop";
  const size = desktop ? DESKTOP : PHONE;
  // laptop windows a bit smaller than the phones, so two fit in a row
  const k = desktop ? scale * 0.7 : scale;
  const src = screen.kind === "url" ? screen.src : screen.kind === "og" ? null : `/gift-screens/${screen.key}`;

  return (
    <figure className={s.frame}>
      <div className={`${s.viewport} ${desktop ? s.desktop : ""}`} style={{ width: size.w * k, height: size.h * k }}>
        <div className={s.inner} style={{ width: size.w, height: size.h, transform: `scale(${k})` }}>
          {src ? (
            <iframe key={version} src={src} title={screen.title} className={s.iframe} />
          ) : (
            <Messages text={text} />
          )}
        </div>
      </div>
      <figcaption className={s.caption}>
        <span className={s.num}>{n}</span>
        <span className={s.captionText}>
          <span className={s.captionTitle}>{screen.title}</span>
          <span className={s.captionNote}>{screen.note}</span>
          {src && (
            <span className={s.captionActions}>
              <button type="button" className={s.action} onClick={() => setVersion((v) => v + 1)}>
                Reload
              </button>
              <a className={s.action} href={src} target="_blank" rel="noreferrer">
                Open
              </a>
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/** Dave's text as Mike gets it: the note, then the link with its preview. */
function Messages({ text }: { text: Text }) {
  return (
    <div className={s.messages}>
      <div className={s.thread}>
        <p className={s.contact}>{text.from}</p>
        <p className={s.when}>Today 4:12 PM</p>
        <div className={s.bubble}>{text.note}</div>
        <a className={s.linkBubble} href="/gift-screens/og" target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG, shown as the phone would */}
          <img src="/gift-screens/og" alt="" width={1200} height={630} className={s.linkImage} />
          <span className={s.linkMeta}>
            <span className={s.linkTitle}>{text.title}</span>
            <span className={s.linkHost}>cloverfield.studio</span>
          </span>
        </a>
      </div>
    </div>
  );
}
