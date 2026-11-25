"use client";

/**
 * The "Conversion rate optimization" pillar card (SeoPillars; "Get chosen."
 * until William asked for the plain names), Nov 24 2026. William's pick of
 * the second round: the CRO section's own funnel widget (cro/CroCards), still,
 * on that section's warm grey. Its words sit at the top left, and "Learn more" is an
 * outlined pill, so the card doesn't copy "Get found." (words at the foot,
 * a round green arrow). Turned down before it: phone notifications, a field
 * of dots, a cut-down form, and a full photo.
 */
import { Funnel } from "../cro/CroCards";
import f from "./ChosenCard.module.css";

type Props = { title: string; text: string; href: string };

export default function ChosenCard({ title, text, href }: Props) {
  return (
    <div className={f.card}>
      <h3 className={f.title}>{title}</h3>
      <p className={f.text}>{text}</p>
      <a className={f.more} href={href}>
        Learn more
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
      <div className={f.pic} aria-hidden>
        <Funnel />
      </div>
    </div>
  );
}
