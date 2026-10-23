import type { Metadata } from "next";
import HomeFooter from "@/components/HomeFooter";
import s from "./privacy.module.css";

/**
 * The privacy policy (Oct 23 2026), linked from the footer on every page.
 * It describes what the site actually does, so update it when that changes:
 * a new form, a new service that handles leads, or the Meta Pixel (not on
 * the site yet; add it under "What we learn when you browse" and "Who helps
 * us handle it" when it goes in). Replays are kept 30 days, the retention
 * set in PostHog.
 */

export const metadata: Metadata = {
  title: "Privacy Policy | Cloverfield Studio, Surrey, BC",
  description:
    "What Cloverfield Studio Inc., a web design studio in Surrey, BC, collects when you visit cloverfield.studio or send a form, why, who helps handle it, and how to reach us about it.",
  alternates: {
    canonical: "https://cloverfield.studio/privacy",
  },
};

const EMAIL = "william@cloverfield.studio";

export default function PrivacyPage() {
  return (
    <div className={s.page}>
      {/* Like /work: the page lifts off the pinned footer underneath. */}
      <main className={s.main}>
        <article className={s.article} data-section="privacy">
          <h1 className={s.title}>Privacy policy</h1>
          <p className={s.updated}>Last updated October 23, 2026</p>

          <p className={s.lede}>
            Cloverfield Studio Inc. is a web design studio in Surrey, BC. This page explains what we collect when
            you visit cloverfield.studio or send us a form, why we collect it, who helps us handle it, and how to
            reach us about it. We follow British Columbia&apos;s Personal Information Protection Act and, where it
            applies, Canada&apos;s Personal Information Protection and Electronic Documents Act.
          </p>

          <h2>What you tell us</h2>
          <p>When you fill in one of our forms, we receive what you type into it.</p>
          <ul>
            <li>
              <strong>Free homepage sample:</strong> whether you have a website and its address, what kind of
              business you run, what you&apos;d like your site to bring you more of, your name, email and phone
              number, and any note you add.
            </li>
            <li>
              <strong>Free website review:</strong> your website, name, email and phone number.
            </li>
            <li>
              <strong>Referral gifts:</strong> if one of our clients sends you a gift, we keep their name and
              business, the first name they wrote for you and the note they added. When you claim it, we keep
              your name, business and phone number, and your email if you give it.
            </li>
            <li>
              <strong>Booking a call:</strong> our booking calendar is run by Cal.com, which receives the name,
              email and any other details you enter.
            </li>
          </ul>
          <p>
            We use these details to reply to you, to design your sample and walk you through it, and to work with
            you if you become a client. Sending a form means you&apos;re happy for us to call, text or email you
            about it. We don&apos;t sell or rent your personal information.
          </p>

          <h2>What we learn when you browse</h2>
          <p>
            Like most websites, we use analytics tools to see how people use ours, so we can tell which pages help
            and fix the ones that don&apos;t. They record the pages you visit, what you click or tap, how far you
            scroll, text you copy, the videos you watch with the sound on, how you arrived (from a search or an
            ad, for example), your browser and device, and your IP address, which is used to estimate your city
            or region.
          </p>
          <p>
            We also record sessions: a replay of how each page moved as you used it, with your clicks and
            scrolling. Anything typed into a form field is hidden in these recordings, and recordings are deleted
            automatically after 30 days.
          </p>
          <p>
            When you send a form, we link the email, name and business details you gave us to your visits, so we
            can see which pages you looked at before getting in touch. Your phone number is never sent to our
            analytics tools.
          </p>

          <h2>Cookies and similar technology</h2>
          <p>
            Google Analytics and PostHog store small files (cookies and local storage) in your browser so they
            can recognise a returning visitor. The site also keeps a few settings of its own in your browser, for
            example to remember that a gift was sent from this device. You can block or delete cookies in your
            browser&apos;s settings, and you can turn off Google Analytics on every site with{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google&apos;s opt-out add-on
            </a>
            .
          </p>

          <h2>Who helps us handle it</h2>
          <p>We use a few services to run the site and our business:</p>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the website.
            </li>
            <li>
              <strong>Google</strong> measures visits (Google Analytics), holds our email (Google Workspace) and
              stores referral gift records (Firebase).
            </li>
            <li>
              <strong>PostHog</strong> runs our analytics and session recordings.
            </li>
            <li>
              <strong>Resend</strong> delivers the emails our forms send us.
            </li>
            <li>
              <strong>ntfy</strong> sends an alert to William&apos;s phone with your name, phone number and email
              when you send a form.
            </li>
            <li>
              <strong>Cal.com</strong> runs our booking calendar.
            </li>
          </ul>
          <p>
            These services are based in the United States or elsewhere outside Canada, so your information may be
            stored and processed there and can be subject to those countries&apos; laws, including lawful requests
            from their authorities. Google explains{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              how it uses information from sites that use its services
            </a>
            .
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep what you send us for as long as we&apos;re talking or working together, and afterward for our
            business records. Session recordings are deleted after 30 days, and other analytics data is deleted on
            the schedule set in each tool. If you ask us to delete your details, we will, unless we need to keep
            something for tax or legal reasons.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete
            it and stop using it, including your analytics history. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{" "}
            and we&apos;ll reply within 30 days. If you&apos;re not happy with how we&apos;ve handled your request,
            you can contact the{" "}
            <a href="https://www.oipc.bc.ca/" target="_blank" rel="noopener noreferrer">
              Office of the Information and Privacy Commissioner for British Columbia
            </a>
            .
          </p>

          <h2>Keeping it safe</h2>
          <p>
            Everything you send travels over an encrypted connection, and only our team and the services above
            can see it. No system is perfectly secure, but if a breach puts your information at real risk,
            we&apos;ll tell you.
          </p>

          <h2>Children</h2>
          <p>This site is for business owners, and we don&apos;t knowingly collect information from children.</p>

          <h2>Changes to this policy</h2>
          <p>If we change how we handle your information, we&apos;ll update this page and the date at the top.</p>

          <h2>Contact</h2>
          <p>
            William Nguyen is responsible for privacy at Cloverfield Studio Inc. Questions, requests and concerns
            go to him at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
          <address className={s.address}>
            Cloverfield Studio Inc.
            <br />
            Surrey, BC, Canada
          </address>
        </article>
      </main>
      <HomeFooter />
    </div>
  );
}
