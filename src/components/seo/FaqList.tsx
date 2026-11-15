"use client";

/**
 * The questions on /seo (Nov 15 2026): one open at a time, each answer
 * sliding open and shut (grid rows 0fr to 1fr) while the plus turns to a
 * cross. Buttons with aria-expanded, so the site tracker still reports
 * panel_open. Answers can hold JSX (the faces in "What do I have to do?").
 */
import { useId, useState } from "react";
import s from "./SeoPage.module.css";

export default function FaqList({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return (
    <div className={s.faqList}>
      {items.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} className={s.faqItem} data-open={on || undefined}>
            <h3 className={s.faqH}>
              <button
                type="button"
                className={s.faqQ}
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(on ? null : i)}
              >
                {f.q}
                <svg className={s.plus} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div id={`${id}-${i}`} className={s.faqPanel} role="region" aria-label={f.q} inert={!on}>
              <div className={s.faqPanelIn}>
                <p className={`${s.faqA} ${typeof f.a === "string" ? "" : s.faqAWithFaces}`}>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
