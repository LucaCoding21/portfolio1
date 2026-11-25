/**
 * The "Tracking and reporting" pillar card (SeoPillars), Nov 24 2026.
 * William wants it about tracking, owners always knowing what we did and
 * what it brought in, not the 3× guarantee (the hero and the solution box
 * say that). His pick of five concepts: a small copy of the monthly report
 * (his low-fi) rising from the foot of the old card's black, the long logo at
 * its top, two stat tiles and the start of "What we did this month", fading
 * out at the card's edge, the words at the top left as on the other two
 * cards. Still, and marked as an example. The low-fi's
 * monthly video is left out until William confirms we record one. Turned
 * down: four stat tiles, a live task list, an inquiries chart, the report on
 * a phone, and the old 3× bars.
 */
import Image from "next/image";
import f from "./ResultsCard.module.css";

type Props = { title: string; text: string; href: string; cta: string };

const DONE = [
  "Made the mobile quote request easier",
  "Updated your Google Business Profile",
  "Improved two service pages",
  "Published a new project case study",
];

const Up = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

function Tile({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className={f.tile}>
      <span className={f.tLabel}>{label}</span>
      <b className={f.tValue}>{value}</b>
      <span className={f.tDelta}>
        <Up />
        {delta}
      </span>
    </div>
  );
}

export default function ResultsCard({ title, text, href, cta }: Props) {
  return (
    <div className={f.card}>
      <h3 className={f.title}>{title}</h3>
      <p className={f.text}>{text}</p>
      <a className={f.pill} href={href}>
        {cta}
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>

      <div className={f.sheet} aria-hidden>
        <div className={f.rTop}>
          <Image className={f.rLogo} src="/cloverfield-logo.png" alt="" width={4162} height={662} sizes="120px" />
          <span className={f.rChip}>Example</span>
          <b className={f.rName}>Monthly report</b>
          <span className={f.rMonth}>November</span>
        </div>
        <div className={f.tiles}>
          <Tile label="Website inquiries" value="24" delta="33% vs last month" />
          <Tile label="Phone clicks" value="38" delta="18% vs last month" />
        </div>
        <p className={f.listHead}>What we did this month</p>
        <ul className={f.checks}>
          {DONE.map((d) => (
            <li key={d}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
