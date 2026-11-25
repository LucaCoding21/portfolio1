/**
 * The CRO section on /seo (Nov 24 2026, from William's low-fi): the second
 * of the three pillars (SeoPillars), between the SEO section (SeoGet) and the
 * proof. The cards are in cro/CroCards.
 *
 * The copy (Nov 24 2026): here the owner thinks "my website barely brings in
 * anything, and who's going to look after it?", and wants to hand it off.
 * William: it's constant monitoring, not one fix a month, and we bring what
 * we've seen work. Cut to one sentence the same day ("a bit too long"). It
 * replaced "Your website gets better every month." / "We
 * study how people use your website and improve what stops them from getting
 * in touch."
 */
import CroCards from "./cro/CroCards";
import s from "./SeoCro.module.css";

export default function SeoCro() {
  return (
    <section id="get-chosen" className={s.cro} data-section="cro">
      <div className={s.inner}>
        <CroCards
          title="We look after your website for you."
          lede="We watch how people use it and keep making changes, based on what's worked on the sites we've built."
        />
      </div>
    </section>
  );
}
