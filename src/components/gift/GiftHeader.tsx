/**
 * The top of both gift pages: the studio's logo (public/cloverfield-logo.png,
 * 4162 x 662), small and centred, so a friend opening a texted link sees
 * whose page it is before the envelope.
 */

import Image from "next/image";
import Link from "next/link";
import s from "./gift.module.css";

export default function GiftHeader() {
  return (
    <header className={s.header}>
      <Link href="/" className={s.logo}>
        <Image src="/cloverfield-logo.png" alt="Cloverfield Studio" width={4162} height={662} sizes="120px" priority />
      </Link>
    </header>
  );
}
