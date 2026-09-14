import Image from "next/image";
import { CLIENT_LOGOS, type ClientLogo } from "@/data/clientLogos";
import styles from "./LogoStrip.module.css";

/**
 * Logo heights come from the data, tuned so wide wordmarks and square marks
 * read at the same visual weight, then capped to fit the 68px pill.
 */
const MAX_LOGO_HEIGHT = 40;
const logoHeight = (h: number) => Math.min(Math.round(h * 0.85), MAX_LOGO_HEIGHT);

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
            className={`${styles.logo} ${dark ? styles.onLight : ""}`}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Trust bar straight under the hero: a label on the left and the client marks
 * looping slowly in a clipped window on the right. Two identical rows make the
 * loop seamless; the keyframe travels exactly one row.
 */
export default function LogoStrip() {
  return (
    <section className={styles.wrap} aria-label="Clients">
      <p className={styles.label}>
        The businesses we built for,
        <br />
        the numbers below are theirs.
      </p>
      <div className={styles.marquee}>
        <div className={styles.track}>
          <Row logos={CLIENT_LOGOS} />
          <Row logos={CLIENT_LOGOS} hidden />
        </div>
      </div>
    </section>
  );
}
