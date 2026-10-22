"use client";

/**
 * The free home page design page (/free-homepage-design), rebuilt from the
 * Page A handoff (Oct 2026). It stands on its own: no site nav, just the
 * logo and "Book a free call" (see ChromeGate). Top to bottom:
 *
 *   hero          the first screen, filling the window (Option A handoff,
 *                 Oct 21 2026): the promise and the trust line on the left,
 *                 the quiz card (Quiz, id="quiz") on the right, and along the
 *                 bottom the work strip (WorkStrip), eleven home pages
 *                 we've designed drifting sideways
 *   how it works  title and the research clip on the left, four steps on
 *                 the right
 *   reviews       three Google reviews as Google shows them, scattered and
 *                 marked in yellow (Reviews)
 *   what you get  dark band ("What will my sample look like?"): a statement,
 *                 then the note, a link back to the quiz and seven site
 *                 clips with their results in a sideways row (SiteClips)
 *   owners        title top left, the three client videos bottom right
 *                 (OwnerVideos)
 *   questions     dark band: the title on the left, an accordion on the
 *                 right
 *   final CTA     the homepage's closing reel plate (VideoCta), its button
 *                 scrolling back to the quiz
 *   footer        the homepage's (HomeFooter)
 *
 * The copy started as the handoff's and was rewritten section by section
 * with William on Oct 22 2026 (each section opens on the visitor's own
 * question; see CLAUDE.md).
 *
 * Motion, as on the homepage (Testimonials, VideoCta): the hero rises in on
 * load; every other section, once 70% up the screen, rises its copy
 * ([data-rise], 28px), then its cards ([data-card], 48px, one after
 * another), and eases its photo plates ([data-plate]) up from 96%. The
 * starting states live in the CSS, so the server's HTML arrives already
 * hidden: no blink of the page at rest on a direct visit before the script
 * takes over. The hero's rise is a CSS animation from first paint; the
 * reveals wait for their scroll trigger. Reduced motion, or no scripts:
 * everything is simply there.
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import ArrowCta from "@/components/ArrowCta";
import { track } from "@/lib/track";
import { CAL_URL } from "@/data/projects";
import HomeFooter from "@/components/HomeFooter";
import VideoCta from "@/components/VideoCta";
import OwnerVideos from "./OwnerVideos";
import Quiz from "./Quiz";
import Reviews from "./Reviews";
import SiteClips from "./SiteClips";
import WorkStrip from "./WorkStrip";
import s from "./FreeDesign.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Trust line faces: WrapCity, Innovative Aluminum, Flow State, ACE. */
const FACES = [
  "/wrapcity-headshot-v3.webp",
  "/testimonials/mike-victory.webp",
  "/flowstate/paula-headshot.jpg",
  "/ACE/ace-headshot-v5.webp",
];

/** How does it work? Copy rewritten Oct 22 2026; the button up to the quiz
    follows the last step. `short` is each step's one line on phones. */
const STEPS: { title: string; body: string; short: string }[] = [
  {
    title: "You answer a few questions",
    body: "Tell us what your business does, what you want more of and how to reach you, in the quiz at the top of this page.",
    short: "It takes a minute or two, in the quiz at the top of this page.",
  },
  {
    title: "We do the homework",
    body: "We study your competitors and what’s working in your market right now. It’s the same research behind the 3,000+ inquiries our sites have brought in.",
    short: "We study your competitors and what’s working in your market.",
  },
  {
    title: "We design your home page",
    body: "It’s made for your business, built around what you want more of, and ready within 3 days.",
    short: "It’s built around what you want more of, and ready within 3 days.",
  },
  {
    title: "You decide what’s next",
    body: "If you like it, we can build the whole site for you, which usually takes 2 to 3 weeks. If not, no hard feelings, and we won’t keep chasing you.",
    short: "If you like it, we build the site. If not, we won’t keep chasing you.",
  },
];

/** A name in an answer with its owner's photo, a small circle, after it. */
function Person({ name, photo }: { name: string; photo: string }) {
  return (
    <span className={s.faqPerson}>
      {name}
      <Image src={photo} alt="" width={48} height={48} className={s.faqFace} />
    </span>
  );
}

/** The questions an owner still has near the end of the page (rewritten
    Oct 22 2026). No price on the page: it comes up once they like the
    sample. */
const FAQS: { q: string; a: React.ReactNode; link?: { href: string; label: string } }[] = [
  {
    q: "Who are you guys?",
    a: (
      <>
        We&rsquo;re <Person name="William" photo="/free-homepage-design/team/william-face.webp" /> and{" "}
        <Person name="Irish" photo="/free-homepage-design/team/irish-photo.webp" />, the two people behind Cloverfield
        Studio in Vancouver. Irish designs every page and William builds it, and the sites we&rsquo;ve made
        have brought our clients 3,000+ inquiries.
      </>
    ),
    // The homepage from the top, so its loading animation plays (a link to a
    // section skips it). A new tab, so this page and its quiz stay open.
    link: { href: "/", label: "Visit our home page" },
  },
  {
    q: "Is it really free? What’s the catch?",
    a: "Yes, it’s free. We’d rather show you what we can do than pitch you. If you like the sample, we can talk about building it. If not, there’s nothing to pay.",
  },
  {
    q: "Will you keep calling me afterwards?",
    a: "No. We’ll check in once after you’ve had a look. If you want to talk about building it, just reply. If not, that’s the end of it.",
  },
  {
    q: "What do I need to give you?",
    a: "Just your answers to the quiz at the top. If you have colours you like, a site you love or photos of your work, add them in the note, but you don’t need to.",
  },
  {
    q: "How long does it take?",
    a: "Your sample is ready within 3 days.",
  },
  {
    q: "I already have a website. Is this still for me?",
    a: "Yes, and it’s often the most useful kind of sample. We look at what your current site does well and what might be holding it back, then design what your home page could be, so you can see the two side by side.",
  },
  {
    q: "What happens if I like it?",
    a: "We’ll have a quick call about what you liked in the sample, what’s working for businesses like yours, and what the full website would need to bring you more customers. After that we’ll send you a price, and the website usually takes 2 to 3 weeks from there.",
  },
];

/** The research clip in How does it work: nothing loads until it is on
    screen (it sits well below the first screen), then it plays while
    visible. Its poster shows until then. */
function ResearchClip() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src="/approach-research.mp4"
      poster="/approach-research-poster.jpg"
      muted
      loop
      playsInline
      preload="none"
      aria-label="Our research mind map for a client's new home page"
      className={s.howPhoto}
      data-plate
    />
  );
}

function BookCall({ children }: { children: React.ReactNode }) {
  return (
    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={s.callLink}>
      {children}
    </a>
  );
}

export default function FreeDesign() {
  const pageRef = useRef<HTMLDivElement>(null);

  /* How far down people get: each [data-section] reports once, as its top
     passes 60% of the way up the screen (design_section_view). */
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const name = (e.target as HTMLElement).dataset.section;
          if (!e.isIntersecting || !name || seen.has(name)) return;
          seen.add(name);
          io.unobserve(e.target);
          track("design_section_view", { section: name });
        }),
      { rootMargin: "0px 0px -40% 0px" }
    );
    pageRef.current?.querySelectorAll("[data-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Section reveals; see the note at the top. The CSS already holds them
     hidden, so these run from those same values to rest. Set up before
     paint, for browsers whose CSS can't hide them first. */
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        const at = () => ({ trigger: section, start: "top 70%", once: true });
        const rise = section.querySelectorAll("[data-rise]");
        const cards = section.querySelectorAll("[data-card]");
        if (rise.length) {
          gsap.fromTo(
            rise,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: at() },
          );
        }
        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power3.out",
              stagger: 0.12,
              delay: 0.15,
              scrollTrigger: at(),
            },
          );
        }
        section.querySelectorAll("[data-plate]").forEach((plate) => {
          gsap.fromTo(
            plate,
            { scale: 0.96, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: plate, start: "top 85%", once: true },
            },
          );
        });
      });
    }, page);
    return () => ctx.revert();
  }, []);


  return (
    <div ref={pageRef} className={s.page}>
      <header className={`${s.container} ${s.header}`}>
        <Link href="/" aria-label="Cloverfield Studio home" className={s.brand}>
          <Image src="/cloverfield-logo.png" alt="" width={4162} height={662} sizes="140px" priority />
        </Link>
        <BookCall>
          <span className={s.callLead}>Prefer to talk?</span> <span className={s.callText}>Book a free call</span>
        </BookCall>
      </header>

      <main>
        {/* The first screen, filling the window under the header: the hero,
            the promise on the left and the quiz on the right, with the work
            strip along the bottom (on laptops and up, cut in half by the
            window's edge). */}
        <div className={s.screen}>
          <section className={`${s.container} ${s.hero}`}>
            <div className={s.heroCopy}>
              <h1 className={s.h1} data-hero="1">
                Get your free
                <br />
                homepage sample
              </h1>
              <p className={s.lede} data-hero="2">
                Answer a few questions and we&rsquo;ll study your competitors, then design your new home page for free.
              </p>
              <div className={s.proof} data-hero="3">
                <span className={s.faces} aria-hidden>
                  {FACES.map((src) => (
                    <Image key={src} src={src} alt="" width={72} height={72} className={s.face} />
                  ))}
                </span>
                <p className={s.proofText}>
                  <strong>3,000+ inquiries</strong> generated for local businesses by sites we&rsquo;ve built
                </p>
              </div>
            </div>
            <div className={s.heroQuiz} data-hero="4">
              <Quiz />
            </div>
          </section>

          <WorkStrip />
        </div>

        {/* How it works: title and photo on the left, four rows on the right. */}
        <section className={`${s.container} ${s.how}`} data-reveal data-section="how">
          <div className={s.howCopy}>
            <div className={s.howIntro}>
              <h2 className={s.h2} data-rise>
                How does it work?
              </h2>
              <p className={s.howSub} data-rise>
                Your part takes a minute or two, and we take it from there.
              </p>
            </div>
            {/* The research clip from the homepage's Approach section. */}
            <ResearchClip />
          </div>
          <div className={s.howSteps}>
            <ol className={s.steps}>
              {STEPS.map((step, i) => (
                <li key={step.title} className={s.stepRow} data-card>
                  <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={s.stepText}>
                    <h3 className={s.stepTitle}>{step.title}</h3>
                    {/* The full line on laptops and up, one short one on phones. */}
                    <p className={s.stepBody}>
                      <span className={s.stepLong}>{step.body}</span>
                      <span className={s.stepShort}>{step.short}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {/* After the last step, where the reader has the whole picture. */}
            <div data-card>
              <ArrowCta href="#quiz">Get your free homepage sample</ArrowCta>
            </div>
          </div>
        </section>

        {/* Three Google reviews, scattered, no title. */}
        <Reviews container={s.container} />

        {/* What will my sample look like? Dark band. */}
        <section className={s.dark} data-section="sample">
          <div className={`${s.container} ${s.darkInner}`} data-reveal>
            <SiteClips>
              <div className={s.darkTop}>
                <h2 className={`${s.h2} ${s.darkTitle}`} data-rise>
                  What will my sample look like?
                </h2>
                {/* The full line on laptops and up, a short one on phones. */}
                <p className={s.statement} data-rise>
                  <span className={s.stepLong}>
                    You will get a home page for your business, from the top of the page down to the contact form,
                    designed to the same standard as the sites below.
                  </span>
                  <span className={s.stepShort}>
                    You will get a home page for your business, made to the same standard as these sites.
                  </span>
                </p>
              </div>
            </SiteClips>
          </div>
        </section>

        {/* What's it like working with us? The owner videos. */}
        <OwnerVideos container={s.container} />

        {/* Questions, answered: a dark band, the title on the left and the
            answers in an accordion on the right. */}
        <section className={s.faqBand} data-section="faq">
          <div className={`${s.container} ${s.faq}`} data-reveal>
            <div className={s.faqHead}>
              <h2 className={s.faqTitle} data-rise>
                Still have questions?
              </h2>
              <p className={s.faqSub} data-rise>
                Here are the ones we hear most. Or <BookCall>book a free call</BookCall> and ask us anything.
              </p>
            </div>
            <div className={s.faqList}>
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className={s.faqItem}
                  data-card
                  onToggle={(e) => {
                    if (e.currentTarget.open) track("design_faq_open", { question: f.q });
                  }}
                >
                  <summary className={s.faqQ}>
                    {f.q}
                    <svg className={s.plus} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className={s.faqA}>
                    {f.a}
                    {f.link && (
                      <>
                        {" "}
                        <a href={f.link.href} target="_blank" rel="noopener" className={s.faqLink}>
                          {f.link.label}
                        </a>
                      </>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA: the homepage's closing reel, pointed at the quiz. */}
        <div data-section="closing">
          <VideoCta
            onDark
            source="free-design"
            line="Ready to see what your home page could be?"
            sub="Answer a few questions in a minute or two, and your free sample is ready within 3 days."
            subShort="Your free sample is ready within 3 days."
            href="#quiz"
            label="Get your free homepage sample"
          />
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
