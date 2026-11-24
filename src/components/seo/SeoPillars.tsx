"use client";

/**
 * "Our approach" on /seo (Nov 24 2026, William's low-fi): a short intro to
 * the three pillars between the solution band and "01 / Get found" (SeoGet).
 * The low-fi asked for a compact, typography-led section; William then sent
 * two references, so it's three drafts with a picker (?pillars=1|2|3, the
 * pill at the bottom left, hidden on cloverfield.studio):
 *   1 Stacked: the Terrava "Built for Green Infrastructure" layout (heading
 *     with an inline picture, a line and two small pictures on the left,
 *     three stacked cards with a picture each on the right, the middle one
 *     dark)
 *   2 Featured: the Euphoria layout (centred heading, three pills that pick
 *     the featured card, three cards with the featured one black)
 *   3 Type: the low-fi as written (the heading, three ruled columns)
 * Once William picks, delete the other drafts and the picker.
 *
 * Pictures are real material only: Google results for a client, a client's
 * home page (with heat drawn over its buttons) and a drawn chart. The
 * "Learn more" links go to #get-found (SeoGet), #get-chosen (SeoCro) and
 * #results (the proof).
 */
import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./SeoPillars.module.css";

type Key = "seo" | "cro" | "roi";

type Pillar = {
  key: Key;
  num: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  /** the featured card's footer in draft 2: a real line from the page */
  proof: string;
  icon: React.ReactNode;
};

const PILLARS: Pillar[] = [
  {
    key: "seo",
    num: "01 / SEO",
    tag: "SEO",
    title: "Get found.",
    text: "Show up when customers search for you.",
    href: "#get-found",
    // Northwest Railing, from the proof rows
    proof: "#1 on Google for “railing installation yakima”",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    key: "cro",
    num: "02 / CRO",
    tag: "CRO",
    title: "Get chosen.",
    text: "Turn more visitors into customers.",
    href: "#get-chosen",
    // the hero's trust line
    proof: "3,000+ inquiries from sites we’ve built",
    icon: (
      <>
        <path d="M14 4.1 12 6" />
        <path d="m5.1 8-2.9-.8" />
        <path d="m6 12-1.9 2" />
        <path d="M7.2 2.2 8 5.1" />
        <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
      </>
    ),
  },
  {
    key: "roi",
    num: "03 / ROI",
    tag: "ROI",
    title: "Get results.",
    text: "See what your investment brings back.",
    href: "#results",
    // the hero's promise, shortened
    proof: "3× your SEO investment back, or we work for free",
    icon: (
      <>
        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
        <path d="M16 7h6v6" />
      </>
    ),
  },
];

const DRAFTS = [
  { n: 1, name: "Stacked" },
  { n: 2, name: "Featured" },
  { n: 3, name: "Type" },
] as const;

type DraftN = (typeof DRAFTS)[number]["n"];

function Icon({ children, size = 16 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ARROW_DOWN_RIGHT = <path d="m7 7 10 10M17 8v9H8" />;
const ARROW_RIGHT = <path d="M5 12h14M13 6l6 6-6 6" />;

/* ---------- the card pictures (draft 1) ---------- */

/** Google's map results for one of our clients */
function SeoThumb() {
  return (
    <Image
      src="/seo/proof/google-vehicle-wraps-langley.webp"
      alt=""
      width={1344}
      height={896}
      sizes="180px"
      loading="lazy"
      className={s.thumbCover}
      style={{ objectPosition: "22% 30%" }}
    />
  );
}

/** a client's home page with click heat over its buttons */
function CroThumb() {
  return (
    <>
      <Image
        src="/seo/cro/nwr-page.webp"
        alt=""
        width={1280}
        height={2898}
        sizes="440px"
        loading="lazy"
        className={s.thumbPage}
      />
      <span className={s.heat} style={{ left: "14%", top: "72%", width: "46%" }} />
      <span className={s.heat} style={{ left: "35%", top: "72%", width: "30%", opacity: 0.75 }} />
      <span className={s.heat} style={{ left: "30%", top: "48%", width: "26%", opacity: 0.5 }} />
    </>
  );
}

/** a drawn chart going up */
function RoiThumb() {
  return (
    <svg className={s.chart} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="pillar-roi-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f8a4c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#1f8a4c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 54, 78, 102].map((y) => (
        <line key={y} x1="10" x2="110" y1={y} y2={y} stroke="rgb(0 0 0 / 0.07)" strokeWidth="1" />
      ))}
      <path
        d="M10 94 L24 90 L38 92 L52 80 L66 74 L80 62 L94 48 L108 32 L108 102 L10 102 Z"
        fill="url(#pillar-roi-fill)"
      />
      <path
        d="M10 94 L24 90 L38 92 L52 80 L66 74 L80 62 L94 48 L108 32"
        fill="none"
        stroke="#1f8a4c"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="108" cy="32" r="4.2" fill="#1f8a4c" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

const THUMBS: Record<Key, () => React.ReactNode> = { seo: SeoThumb, cro: CroThumb, roi: RoiThumb };

/* ---------- 1: Stacked ---------- */

function Stacked() {
  return (
    <div className={s.stacked}>
      <div className={s.stLeft}>
        <div>
          <p className={s.stPill}>Our approach</p>
          <h2 className={s.stTitle}>
            Getting found{" "}
            <span className={s.chip} aria-hidden>
              <Image
                src="/seo/proof/google-railing-installation-yakima.webp"
                alt=""
                width={1568}
                height={395}
                sizes="160px"
                loading="lazy"
              />
            </span>{" "}
            is only half the job.
          </h2>
        </div>
        <p className={s.stText}>
          Showing up on Google is the first step. Then your website has to get people to call you. We work on both, and
          show you what it brings back.
        </p>
        <div className={s.stPics} aria-hidden>
          <span className={s.stPic}>
            <Image src="/seo/offer-planing.webp" alt="" width={1400} height={936} sizes="120px" loading="lazy" />
          </span>
          <span className={s.stPic}>
            <Image
              src="/success/cards/northwest-railing.webp"
              alt=""
              width={640}
              height={400}
              sizes="120px"
              loading="lazy"
              style={{ objectPosition: "68% 50%" }}
            />
          </span>
        </div>
      </div>

      <ul className={s.stCards}>
        {PILLARS.map((p) => {
          const Thumb = THUMBS[p.key];
          return (
            <li key={p.key} className={s.stCard} data-dark={p.key === "cro" || undefined}>
              <div className={s.stBody}>
                <p className={s.stNum}>{p.num}</p>
                <h3 className={s.stCardTitle}>{p.title}</h3>
                <p className={s.stCardText}>{p.text}</p>
                <a className={s.stMore} href={p.href}>
                  Learn more
                  <span className={s.stMoreChip}>
                    <Icon size={13}>{ARROW_DOWN_RIGHT}</Icon>
                  </span>
                </a>
              </div>
              <div className={s.thumb} data-kind={p.key} aria-hidden>
                <Thumb />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- 2: Featured ---------- */

function Featured() {
  const [on, setOn] = useState<Key>("cro");
  return (
    <div className={s.featured}>
      <p className={s.ftPill}>
        <span className={s.ftPillDot} aria-hidden />
        Our approach
      </p>
      <h2 className={s.ftTitle}>
        Getting found is only <span className={s.ftGrey}>half</span> the job.
      </h2>

      <div className={s.ftTabs} role="group" aria-label="Pick a part">
        {PILLARS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={s.ftTab}
            data-on={on === p.key || undefined}
            aria-pressed={on === p.key}
            onClick={() => setOn(p.key)}
          >
            <span className={s.ftTabIcon} aria-hidden>
              <Icon size={11}>{p.icon}</Icon>
            </span>
            {p.tag}
          </button>
        ))}
      </div>

      <ul className={s.ftCards}>
        {PILLARS.map((p) => {
          const lit = on === p.key;
          return (
            <li key={p.key} className={s.ftCard} data-on={lit || undefined} onClick={() => setOn(p.key)}>
              <div className={s.ftInner}>
                <span className={s.ftIcon} aria-hidden>
                  <Icon size={15}>{p.icon}</Icon>
                </span>
                <p className={s.ftNum}>{p.num}</p>
                <h3 className={s.ftCardTitle}>{p.title}</h3>
                <p className={s.ftCardText}>{p.text}</p>
                {!lit && (
                  <a className={s.ftMore} href={p.href}>
                    Learn more <Icon size={14}>{ARROW_RIGHT}</Icon>
                  </a>
                )}
              </div>
              {lit && (
                <div className={s.ftFoot}>
                  <span className={s.ftProof}>
                    <span className={s.ftProofIcon} aria-hidden>
                      <Icon size={10}>{p.icon}</Icon>
                    </span>
                    {p.proof}
                  </span>
                  <a className={s.ftMore} href={p.href}>
                    Learn more <Icon size={14}>{ARROW_RIGHT}</Icon>
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- 3: Type ---------- */

function Type() {
  return (
    <div className={s.type}>
      <p className={s.tyLabel}>Our approach</p>
      <h2 className={s.tyTitle}>Getting found is only half the job.</h2>
      <ul className={s.tyCols}>
        {PILLARS.map((p) => (
          <li key={p.key}>
            <a className={s.tyCol} href={p.href}>
              <span className={s.tyNum}>
                {p.num}
                <span className={s.tyArrow} aria-hidden>
                  <Icon size={16}>{ARROW_DOWN_RIGHT}</Icon>
                </span>
              </span>
              <span className={s.tyColTitle}>{p.title}</span>
              <span className={s.tyColText}>{p.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the section and the picker ---------- */

function readDraft(): DraftN {
  const n = Number(new URLSearchParams(window.location.search).get("pillars"));
  return n === 2 || n === 3 ? n : 1;
}

export default function SeoPillars() {
  const [draft, setDraft] = useState<DraftN>(1);
  const [picker, setPicker] = useState(false);

  // read the URL after mount, so the server and first client render agree
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(readDraft());
    setPicker(!window.location.hostname.endsWith("cloverfield.studio"));
  }, []);

  const pick = (n: DraftN) => {
    setDraft(n);
    const url = new URL(window.location.href);
    url.searchParams.set("pillars", String(n));
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <section className={s.section} data-section="approach" aria-label="Our approach">
      <div className={s.inner}>
        {draft === 1 && <Stacked />}
        {draft === 2 && <Featured />}
        {draft === 3 && <Type />}
      </div>

      {picker && (
        <div className={s.picker} role="group" aria-label="Pillars draft">
          <span className={s.pickerLabel}>Pillars</span>
          {DRAFTS.map((d) => (
            <button
              key={d.n}
              type="button"
              title={d.name}
              className={s.pickerBtn}
              data-on={draft === d.n || undefined}
              aria-pressed={draft === d.n}
              onClick={() => pick(d.n)}
            >
              {d.n}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
