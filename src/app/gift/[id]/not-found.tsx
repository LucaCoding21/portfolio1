import Link from "next/link";
import GiftHeader from "@/components/gift/GiftHeader";
import s from "@/components/gift/gift.module.css";

// A gift link that doesn't lead anywhere (cut off, mistyped or deleted),
// 1:1 from the designer's "Wrong link" screen.

export default function GiftNotFound() {
  return (
    <div className={s.page}>
      <main className={s.main}>
        <GiftHeader />
        <div className={s.missing}>
          <span className={s.missingIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <h1 className={`${s.title} ${s.missingTitle}`}>We can&rsquo;t find this gift</h1>
          <p className={s.body}>
            The link might be cut off or mistyped. Check the message you got, or get in touch and we&rsquo;ll sort it out.
          </p>
          <Link className={`${s.button} ${s.expiredCta}`} href="/#contact">
            Get in touch
          </Link>
          <Link className={`${s.siteLink} ${s.siteLinkSm} ${s.centerLink}`} href="/">
            Visit cloverfield.studio
          </Link>
        </div>
      </main>
    </div>
  );
}
