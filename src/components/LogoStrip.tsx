import Image from "next/image";
import { CLIENT_LOGOS, type ClientLogo } from "@/data/clientLogos";
import styles from "./LogoStrip.module.css";

/**
 * Logo heights come from the data, tuned so wide wordmarks and square marks
 * read at the same visual weight, then capped so nothing towers over the row.
 */
const MAX_LOGO_HEIGHT = 52;
const logoHeight = (h: number) => Math.min(h, MAX_LOGO_HEIGHT);

function Row({ logos, hidden }: { logos: ClientLogo[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={styles.row}>
      {logos.map(({ name, src, height, dark }) => (
        <li key={name} className={styles.item}>
          <Image
            src={src}
            alt={hidden ? "" : name}
            width={logoHeight(height) * 3}
            height={logoHeight(height)}
            style={{ height: logoHeight(height) }}
            /* The loop carries marks in from off screen; lazy loading would pop them in late. */
            loading="eager"
            className={`${styles.logo} ${dark ? styles.onLight : ""}`}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Full-bleed logo marquee straight under the hero: a small eyebrow, then the
 * client marks looping edge to edge. Two identical rows make the loop
 * seamless; the keyframe travels exactly one row. Hovering pauses it.
 */
export default function LogoStrip() {
  return (
    <section className={styles.wrap} aria-label="Businesses we have worked with">
      <p className={styles.label}>Businesses we have worked with</p>
      <div className={styles.marquee}>
        <div className={styles.track}>
          <Row logos={CLIENT_LOGOS} />
          <Row logos={CLIENT_LOGOS} hidden />
        </div>
      </div>
    </section>
  );
}
