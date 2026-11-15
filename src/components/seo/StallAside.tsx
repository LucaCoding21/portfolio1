/**
 * The line to the right of "The problem" heading, leading into the three
 * cards. William picked it from five drafts on Nov 13 2026 (a byline, a proof
 * line, a map drawing and a review were the others).
 */
import s from "./SeoPage.module.css";

export default function StallAside() {
  return (
    <div className={s.stallAside} data-stall="aside">
      <p className={s.asideLead}>Three things we hear from almost every owner we talk to.</p>
    </div>
  );
}
