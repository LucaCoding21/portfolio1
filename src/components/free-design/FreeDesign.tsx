"use client";

/**
 * The free home page design page (/free-homepage-design), rebuilt from the
 * Page A handoff (Oct 2026). It stands on its own: no site nav, just the
 * logo and "Book a free call" (see ChromeGate). Top to bottom:
 *
 *   hero          the promise and the trust line on the left, the quiz card
 *                 (Quiz, id="quiz") on the right
 *   logos         nine client logos in grey, scrolling sideways
 *   how it works  title and the research clip on the left, four steps on
 *                 the right
 *   what you get  dark band: a statement, three site clips, a note and a
 *                 link back to the quiz
 *   owners        title top left, the three client videos bottom right
 *                 (OwnerVideos)
 *   questions     dark band: the title on the left, an accordion on the
 *                 right
 *   final CTA     the homepage's closing reel plate (VideoCta), its button
 *                 scrolling back to the quiz
 *   footer        the homepage's (HomeFooter)
 *
 * The copy is the handoff's, word for word, except the last question, which
 * says "Surrey, BC" (see CLAUDE.md).
 *
 * Motion, as on the homepage (Testimonials, VideoCta): the hero rises in on
 * load; every other section, once 70% up the screen, rises its copy
 * ([data-rise], 28px), then its cards ([data-card], 48px, one after
 * another), and eases its photo plates ([data-plate]) up from 96%. Reduced
 * motion: everything is simply there.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { CAL_URL } from "@/data/projects";
import HomeFooter from "@/components/HomeFooter";
import VideoCta from "@/components/VideoCta";
import OwnerVideos from "./OwnerVideos";
import Quiz from "./Quiz";
import s from "./FreeDesign.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Trust line faces: WrapCity, Innovative Aluminum, Flow State, ACE. */
const FACES = [
  "/wrapcity-headshot-v3.webp",
  "/testimonials/mike-victory.webp",
  "/flowstate/paula-headshot.jpg",
  "/ACE/ace-headshot-v5.webp",
];

/** Monochrome client logos, drawn at these heights (the files are 96px tall). */
const LOGOS = [
  { file: "wrapcity", alt: "WrapCity", w: 312, h: 30 },
  { file: "caddie-companion", alt: "Caddie Companion", w: 284, h: 30 },
  { file: "northwest-railing", alt: "Northwest Railing", w: 94, h: 44 },
  { file: "gvr", alt: "Greater Vancouver REALTORS", w: 279, h: 32 },
  { file: "dreamhouse-printing", alt: "Dreamhouse Printing", w: 319, h: 30 },
  { file: "reibc", alt: "Real Estate Institute of BC", w: 266, h: 32 },
  { file: "afterparty", alt: "Afterparty", w: 84, h: 44 },
  { file: "ondek", alt: "Ondek", w: 204, h: 34 },
  { file: "venues-quarterly", alt: "Venues Quarterly", w: 289, h: 30 },
];

const STEPS = [
  { title: "Answer three quick questions", body: "Takes a minute or two, right here on this page." },
  { title: "We research your business", body: "Your industry, your competitors and what makes customers choose you." },
  { title: "We design your home page", body: "Made for your business, not pulled from a template." },
  {
    title: "You decide what’s next",
    body: "Love it and we build it, usually live in 2–3 weeks. If not, no hard feelings.",
  },
];

/** Site clips in the dark band. `start` skips a black opening and loops from there. */
const CLIPS = [
  {
    name: "Northwest Railing",
    video: "/success/northwest-railing.mp4",
    poster: "/free-homepage-design/clips/northwest-railing.jpg",
    label: "Northwest Railing website, scrolling through the home page",
  },
  {
    name: "WrapCity",
    video: "/success/wrapcity.mp4",
    poster: "/free-homepage-design/clips/wrapcity.jpg",
    label: "WrapCity website, showing the before and after gallery",
  },
  {
    name: "ACE",
    video: "/success/ace-work.mp4",
    poster: "/free-homepage-design/clips/ace.jpg",
    label: "ACE photography website, scrolling through the portfolio",
    start: 2.5,
  },
];

const FAQS = [
  {
    q: "Is it actually free?",
    a: "Yes. There’s no cost and no obligation to hire us. You get a custom home page design for your business either way.",
  },
  {
    q: "What do I need to give you?",
    a: "Just the three answers above. Colours you like, a site you love or photos of your work all help, but they’re optional.",
  },
  {
    q: "What happens after I get my design?",
    a: "If you love it, we can build it into a full website. Once a design is approved, sites are usually live in about 2–3 weeks. If not, you’re under no obligation.",
  },
  {
    q: "Do you only work with Surrey, BC businesses?",
    a: "We’re based in Surrey, BC and work with businesses across the Lower Mainland.",
  },
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookCall({ children }: { children: React.ReactNode }) {
  return (
    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={s.callLink}>
      {children}
    </a>
  );
}

/** A site clip: muted, looping, and only playing while on screen. */
function Clip({ clip }: { clip: (typeof CLIPS)[number] }) {
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

  const fromStart = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (clip.start) e.currentTarget.currentTime = clip.start;
  };

  return (
    <figure className={s.clip} data-card>
      <video
        ref={ref}
        src={clip.video}
        poster={clip.poster}
        muted
        playsInline
        loop={!clip.start}
        preload="none"
        aria-label={clip.label}
        className={s.clipVideo}
        onLoadedMetadata={fromStart}
        onEnded={(e) => {
          fromStart(e);
          e.currentTarget.play().catch(() => {});
        }}
      />
      <figcaption className={s.clipName}>{clip.name}</figcaption>
    </figure>
  );
}

export default function FreeDesign() {
  const pageRef = useRef<HTMLDivElement>(null);

  /* Entry motion; see the note at the top. */
  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.1 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        const at = () => ({ trigger: section, start: "top 70%", once: true });
        const rise = section.querySelectorAll("[data-rise]");
        const cards = section.querySelectorAll("[data-card]");
        if (rise.length) {
          gsap.from(rise, { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: at() });
        }
        if (cards.length) {
          gsap.from(cards, {
            y: 48,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.15,
            scrollTrigger: at(),
          });
        }
        section.querySelectorAll("[data-plate]").forEach((plate) => {
          gsap.from(plate, {
            scale: 0.96,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: plate, start: "top 85%", once: true },
          });
        });
      });
    }, page);
    return () => ctx.revert();
  }, []);


  return (
    <div ref={pageRef} className={s.page}>
      <header className={`${s.container} ${s.header}`}>
        <Link href="/" aria-label="Cloverfield Studio home" className={s.brand}>
          <Image src="/brand-mark.png" alt="" width={30} height={30} priority />
          <span>cloverfield</span>
        </Link>
        <BookCall>
          <span className={s.callLead}>Prefer to talk?</span> <span className={s.callText}>Book a free call</span>
        </BookCall>
      </header>

      <main>
        {/* Hero: the promise on the left, the quiz on the right. */}
        <section className={`${s.container} ${s.hero}`}>
          <div className={s.heroCopy}>
            <h1 className={s.h1} data-hero>
              Get your free
              <br />
              home page design
            </h1>
            <p className={s.lede} data-hero>
              Answer three quick questions and we&rsquo;ll design a custom home page for your business. Free, no
              obligation.
            </p>
            <div className={s.proof} data-hero>
              <span className={s.faces} aria-hidden>
                {FACES.map((src) => (
                  <Image key={src} src={src} alt="" width={72} height={72} className={s.face} />
                ))}
              </span>
              <p className={s.proofText}>
                <strong>3,000+ inquiries</strong> generated for local
                <br />
                businesses by sites we&rsquo;ve built
              </p>
            </div>
          </div>
          <div className={s.heroQuiz} data-hero>
            <Quiz />
          </div>
        </section>

        {/* Logo strip. */}
        <section className={`${s.container} ${s.logos}`} aria-label="Clients" data-reveal>
          <p className={s.logosLabel} data-rise>Trusted by businesses across BC</p>
          {/* Two copies side by side; the track slides one copy's width and
              starts over, so the row never ends. The copy is hidden from
              screen readers. */}
          <div className={s.marquee} data-rise>
            <div className={s.track}>
              {[0, 1].map((copy) => (
                <div key={copy} className={s.logoRow} aria-hidden={copy === 1 || undefined}>
                  {LOGOS.map((l) => (
                    <Image
                      key={l.file}
                      src={`/free-homepage-design/logos/${l.file}.png`}
                      alt={copy === 0 ? l.alt : ""}
                      width={Math.round((l.w / 96) * l.h)}
                      height={l.h}
                      style={{ "--h": `${l.h}px` } as React.CSSProperties}
                      className={s.logo}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works: title and photo on the left, four rows on the right. */}
        <section className={`${s.container} ${s.how}`} data-reveal>
          <div className={s.howCopy}>
            <div className={s.howIntro}>
              <p className={s.eyebrow} data-rise>
                How it works
              </p>
              <h2 className={s.h2} data-rise>
                From three questions to a new home page.
              </h2>
              <p className={s.howSub} data-rise>Three quick questions from you. A custom home page from us.</p>
            </div>
            {/* The research clip from the homepage's Approach section. */}
            <video
              src="/approach-research.mp4"
              poster="/approach-research-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Our research mind map for a client's new home page"
              className={s.howPhoto}
              data-plate
            />
          </div>
          <ol className={s.steps}>
            {STEPS.map((step, i) => (
              <li key={step.title} className={s.stepRow} data-card>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <div className={s.stepText}>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* What you'll get: dark band. */}
        <section className={s.dark}>
          <div className={`${s.container} ${s.darkInner}`} data-reveal>
            <div className={s.darkTop}>
              <h2 className={s.darkEyebrow} data-rise>What you&rsquo;ll get</h2>
              <p className={s.statement} data-rise>
                A home page made for your business, designed around what your customers look for and built to turn
                visitors into calls and quotes.
              </p>
            </div>
            <div className={s.darkBottom}>
              <div className={s.clips}>
                {CLIPS.map((clip) => (
                  <Clip key={clip.name} clip={clip} />
                ))}
              </div>
              <div className={s.darkNote} data-card>
                <p className={s.darkNoteTitle}>Sites we&rsquo;ve designed</p>
                <p className={s.darkNoteBody}>Yours gets the same care, built around your customers.</p>
                <a href="#quiz" className={s.darkCta}>
                  <span>Get my free design</span>
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Hear it from the owners. */}
        <OwnerVideos container={s.container} />

        {/* Questions, answered: a dark band, the title on the left and the
            answers in an accordion on the right. */}
        <section className={s.faqBand}>
          <div className={`${s.container} ${s.faq}`} data-reveal>
            <div className={s.faqHead}>
              <p className={s.darkEyebrow} data-rise>
                FAQ
              </p>
              <h2 className={s.faqTitle} data-rise>
                Questions, answered
              </h2>
              <p className={s.faqSub} data-rise>
                Still unsure? <BookCall>Book a free call</BookCall> and ask us anything.
              </p>
            </div>
            <div className={s.faqList}>
              {FAQS.map((f) => (
                <details key={f.q} className={s.faqItem} data-card>
                  <summary className={s.faqQ}>
                    {f.q}
                    <svg className={s.plus} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className={s.faqA}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA: the homepage's closing reel, pointed at the quiz. */}
        <VideoCta
          onDark
          source="free-design"
          line="Your new home page is three questions away."
          sub="Free, no obligation, made for your business."
          href="#quiz"
          label="Get my free design"
        />
      </main>

      <HomeFooter />
    </div>
  );
}
