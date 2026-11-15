/**
 * Five centred drafts of "The solution" on /seo (SeoOffer's first part),
 * Nov 15 2026, for William to pick from on the dev board
 * (/seo-solution-board). Same copy and type as the live block; no motion
 * here (the live block's GSAP would carry over to whichever is picked).
 *
 *   1 Grey box     what's live now: heading, then the signed grey box under it
 *   2 Rules        no box: the promise larger between two hairlines, signed
 *   3 One panel    label, heading, a short rule, the promise and the
 *                  signature all inside one wide grey panel
 *   4 Letter       William and Irish's faces first, then the label and
 *                  heading, the promise as a quiet paragraph, signed
 *   5 Three parts  heading, then the promise in three ruled columns
 *                  (pick, top 3, or free), signed under them
 */
import Image from "next/image";
import p from "../SeoPage.module.css";
import d from "./SolutionDrafts.module.css";

const TITLE = "We help your business get to the top when people near you look you up.";
const QUOTE =
  "We’ll pick 5 searches with you. Within 6 months you’ll be in the top 3 on Google for at least 3 of them. If you’re not, we keep working for free until you are.";

function Quotes({ className }: { className?: string }) {
  return (
    <span className={`${d.quotes} ${className ?? ""}`} aria-hidden>
      <svg viewBox="4 6 16 12" fill="currentColor">
        <path d="M10 6.5C6.6 7.4 4.5 10.2 4.5 13.8v3.7h5.6v-5.6H7.4c.1-2 1.3-3.4 3.2-4l-.6-1.4Zm9 0c-3.4.9-5.5 3.7-5.5 7.3v3.7h5.6v-5.6h-2.7c.1-2 1.3-3.4 3.2-4l-.6-1.4Z" />
      </svg>
    </span>
  );
}

function Faces({ big }: { big?: boolean }) {
  const n = big ? 64 : 44;
  return (
    <span className={`${d.faces} ${big ? d.facesBig : ""}`}>
      <Image src="/free-homepage-design/team/william-face.webp" alt="" width={n} height={n} />
      <Image src="/free-homepage-design/team/irish-photo.webp" alt="" width={n} height={n} />
    </span>
  );
}

function Sign({ faces = true }: { faces?: boolean }) {
  return (
    <p className={d.sign}>
      {faces && <Faces />}
      <span>
        <strong>William and Irish</strong>
        <br />
        Founders, Cloverfield Studio, Surrey, BC
      </span>
    </p>
  );
}

function Head() {
  return (
    <>
      <p className={d.label}>The solution</p>
      <h2 className={d.title}>{TITLE}</h2>
    </>
  );
}

function GreyBox() {
  return (
    <div className={d.inner}>
      <Head />
      <figure className={d.box}>
        <Quotes className={d.quotesOnEdge} />
        <blockquote className={d.quote}>{QUOTE}</blockquote>
        <Sign />
      </figure>
    </div>
  );
}

function Rules() {
  return (
    <div className={d.inner}>
      <Head />
      <figure className={d.ruled}>
        <blockquote className={`${d.quote} ${d.quoteBig}`}>&ldquo;{QUOTE}&rdquo;</blockquote>
        <Sign />
      </figure>
    </div>
  );
}

function OnePanel() {
  return (
    <div className={d.inner}>
      <div className={d.panel}>
        <Head />
        <span className={d.shortRule} aria-hidden />
        <blockquote className={d.quote}>&ldquo;{QUOTE}&rdquo;</blockquote>
        <Sign />
      </div>
    </div>
  );
}

function Letter() {
  return (
    <div className={d.inner}>
      <Faces big />
      <Head />
      <blockquote className={d.letter}>{QUOTE}</blockquote>
      <p className={d.letterSign}>William and Irish, founders of Cloverfield Studio</p>
    </div>
  );
}

const PARTS = [
  { k: "Week 1", h: "We pick 5 searches with you", t: "The ones that bring you work. They go into your agreement." },
  { k: "By month 6", h: "Top 3 for at least 3 of them", t: "On the Google map or in the regular results. Ads don’t count." },
  { k: "If we miss", h: "We keep working for free", t: "You stop paying, and the same work goes on until you’re there." },
];

function ThreeParts() {
  return (
    <div className={d.inner}>
      <Head />
      <ol className={d.parts}>
        {PARTS.map((x) => (
          <li key={x.h} className={d.part}>
            <p className={d.partKey}>{x.k}</p>
            <p className={d.partHead}>{x.h}</p>
            <p className={d.partText}>{x.t}</p>
          </li>
        ))}
      </ol>
      <Sign />
    </div>
  );
}

const DRAFTS = [
  { name: "Grey box", note: "What’s live now: the signed grey box under the heading.", C: GreyBox },
  { name: "Rules", note: "No box: the promise larger between two hairlines, signed under it.", C: Rules },
  { name: "One panel", note: "Everything inside one wide grey panel, with a short rule between heading and promise.", C: OnePanel },
  { name: "Letter", note: "Your faces first, then the heading, the promise as a quiet paragraph and a written sign-off.", C: Letter },
  { name: "Three parts", note: "The promise split into three ruled columns, signed under them. New copy in the columns.", C: ThreeParts },
] as const;

export default function SolutionDrafts() {
  return (
    <div className={`${p.page} ${d.board}`}>
      <nav className={d.jump} aria-label="Drafts">
        {DRAFTS.map((x, i) => (
          <a key={x.name} href={`#draft-${i + 1}`}>
            {i + 1} {x.name}
          </a>
        ))}
      </nav>
      {DRAFTS.map(({ name, note, C }, i) => (
        <div key={name} id={`draft-${i + 1}`} className={d.draft}>
          <div className={d.tagBar}>
            <span className={d.num}>{i + 1}</span>
            <strong>{name}</strong>
            <span>{note}</span>
          </div>
          <section className={d.sec}>
            <C />
          </section>
        </div>
      ))}
    </div>
  );
}
