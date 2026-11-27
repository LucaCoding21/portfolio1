import Image from "next/image";
import Link from "next/link";
import s from "@/components/report/SeoReport.module.css";

// A report link that's cut off, mistyped, switched off or replaced.

export default function ReportNotFound() {
  return (
    <div className={s.page}>
      <div className={s.missing}>
        <Image className={s.missingLogo} src="/cloverfield-logo.png" alt="Cloverfield Studio" width={4162} height={662} sizes="160px" />
        <h1 className={s.missingTitle}>We can&rsquo;t find this report</h1>
        <p className={s.missingText}>
          The link might be cut off or out of date. Check the message we sent, or text us and we&rsquo;ll send it again.
        </p>
        <Link className={s.missingLink} href="/">
          Visit cloverfield.studio
        </Link>
      </div>
    </div>
  );
}
