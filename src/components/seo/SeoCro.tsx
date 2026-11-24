"use client";

/**
 * "02 / Get chosen" on /seo (Nov 24 2026, from William's low-fi): the second
 * of the three pillars (SeoPillars), the CRO work, between "What we take care
 * of for you" (01 / Get found) and the proof. Two drafts with a dev-only
 * picker (?cro=1|2, hidden on cloverfield.studio): 1 the tabs, a product
 * tour of the tools over a real site we built (cro/CroTabs), and 2 one
 * visitor's story, pinned while you scroll (cro/CroStory). Both use
 * Northwest Railing's home page and the same example data, and say so.
 * Once William picks, delete the other draft and the picker.
 */
import { useEffect, useState } from "react";
import CroStory from "./cro/CroStory";
import CroTabs from "./cro/CroTabs";
import s from "./SeoCro.module.css";

const DRAFTS = [
  { n: 1, name: "Tabs" },
  { n: 2, name: "Story" },
];

export default function SeoCro() {
  const [draft, setDraft] = useState(2);
  const [picker, setPicker] = useState(false);

  // read after mount, so the server's HTML and the first render agree
  useEffect(() => {
    const q = Number(new URLSearchParams(window.location.search).get("cro"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once, after hydration
    if (q === 1 || q === 2) setDraft(q);
    setPicker(!window.location.hostname.endsWith("cloverfield.studio"));
  }, []);

  const choose = (n: number) => {
    setDraft(n);
    const url = new URL(window.location.href);
    url.searchParams.set("cro", String(n));
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <section id="get-chosen" className={s.cro} data-section="cro">
      <div className={s.inner}>
        <div className={s.head}>
          <p className={s.eyebrow}>02 / Get chosen</p>
          <h2 className={s.title}>Your website gets better every month.</h2>
          <p className={s.lede}>
            We study how people use your website and improve what stops them from getting in touch.
          </p>
        </div>

        {draft === 1 ? (
          <CroTabs />
        ) : (
          <>
            <CroStory />
            <p className={s.note}>Example data, shown on a website we built.</p>
          </>
        )}
      </div>

      {picker ? (
        <div className={s.picker} role="group" aria-label="Get chosen draft">
          <span className={s.pickerLabel}>CRO</span>
          {DRAFTS.map((d) => (
            <button
              key={d.n}
              type="button"
              title={d.name}
              className={s.pickerBtn}
              data-on={draft === d.n || undefined}
              onClick={() => choose(d.n)}
            >
              {d.n}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
