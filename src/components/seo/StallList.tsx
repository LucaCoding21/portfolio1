/**
 * "The problem" on /seo as ruled rows of plain text, the title on the left and
 * its line on the right (Nov 25 2026, William's pick of four ways to stop
 * "The problem" and "Our solution" reading as one long grid of cards: only the
 * solution has cards now). Tablets and desktops only: phones keep the cards
 * with their animated scenes (StallCards), with a shorter line, by request.
 * The copy matches StallCards', so change both.
 */

import s from "./SeoPage.module.css";

const PROBLEMS = [
  {
    title: "A competitor shows up first",
    body: "You search for your own service in your city, and someone else comes up before you. Some of them aren’t even as good as you.",
  },
  {
    title: "Some months are slow",
    body: "Most of your work comes from word of mouth, so some months are busy and some are slow.",
  },
  {
    // Nov 23 2026, William's words (picked from three tries)
    title: "Your website isn’t bringing in leads",
    body: "You keep checking for new inquiries from your website, and most days there aren’t any.",
  },
];

export default function StallList() {
  return (
    <ul className={s.stallList} data-stall="list">
      {PROBLEMS.map((p) => (
        <li key={p.title} className={s.stallRow}>
          <h3 className={s.stallRowTitle}>{p.title}</h3>
          <p className={s.stallRowText}>{p.body}</p>
        </li>
      ))}
    </ul>
  );
}
