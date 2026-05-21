import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "./FAQ";

export const metadata: Metadata = {
  title: "Approach | Cloverfield Studio",
  description:
    "How Cloverfield Studio builds websites. Five competitor audits before we open Figma. Lighthouse 95+ as a floor. Every section defended against a conversion goal.",
  alternates: {
    canonical: "https://cloverfield.studio/approach",
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
      {children}
    </p>
  );
}

const HEADLINE_CLASS =
  "font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6 max-w-[26ch]";

const BODY_CLASS =
  "text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[62ch]";

const LOREM_SHORT = "Lorem ipsum dolor sit amet.";
const LOREM_HEADLINE = "Lorem ipsum dolor sit amet, consectetur.";
const LOREM_BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const PHASES = [
  { num: "01", name: "Lorem ipsum" },
  { num: "02", name: "Dolor sit amet" },
  { num: "03", name: "Consectetur" },
  { num: "04", name: "Adipiscing elit" },
  { num: "05", name: "Sed do eiusmod" },
];

const LOREM_BULLETS = [
  { lead: "Lorem ipsum dolor.", text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { lead: "Consectetur adipiscing.", text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
  { lead: "Nisi ut aliquip.", text: "Ex ea commodo consequat duis aute irure dolor in reprehenderit." },
  { lead: "Voluptate velit esse.", text: "Cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat." },
];

const STACK_ITEMS = [
  { name: "Lorem", note: "Ipsum dolor sit amet consectetur." },
  { name: "Ipsum", note: "Adipiscing elit sed do eiusmod." },
  { name: "Dolor", note: "Tempor incididunt ut labore et dolore." },
  { name: "Amet", note: "Magna aliqua ut enim ad minim veniam." },
  { name: "Consectetur", note: "Quis nostrud exercitation ullamco laboris." },
  { name: "Adipiscing", note: "Nisi ut aliquip ex ea commodo consequat." },
  { name: "Eiusmod", note: "Duis aute irure dolor in reprehenderit." },
  { name: "Tempor", note: "Voluptate velit esse cillum dolore eu fugiat." },
];

function TrafficCone({ delay = "0s" }: { delay?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      className="w-5 h-6 md:w-6 md:h-7 shrink-0"
      style={{
        animation: "cone-wobble 1.4s ease-in-out infinite",
        animationDelay: delay,
        transformOrigin: "50% 90%",
      }}
      aria-hidden="true"
    >
      {/* Base */}
      <rect x="1" y="23" width="22" height="3.5" rx="0.8" fill="white" />
      {/* Cone body */}
      <path
        d="M 12 3 L 20 23 L 4 23 Z"
        fill="#CDFF50"
        stroke="black"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* Stripe 1 */}
      <path d="M 8.2 12 L 15.8 12 L 16.4 14 L 7.6 14 Z" fill="black" />
      {/* Stripe 2 */}
      <path d="M 6.4 18 L 17.6 18 L 18.2 20 L 5.8 20 Z" fill="black" />
    </svg>
  );
}

function WIPBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative z-30 mt-20 md:mt-[110px] bg-black text-white border-y-2 border-dashed border-[#CDFF50]/30"
    >
      <style>{`
        @keyframes cone-wobble {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-3px) rotate(-6deg); }
          50%      { transform: translateY(-5px) rotate(0deg); }
          75%      { transform: translateY(-3px) rotate(6deg); }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-3 md:py-3.5 flex items-end justify-center gap-3 md:gap-4 flex-wrap">
        <span className="flex items-end gap-1.5 md:gap-2 mb-[2px]">
          <TrafficCone delay="0s" />
          <TrafficCone delay="0.15s" />
          <TrafficCone delay="0.3s" />
        </span>

        <p
          className="text-[10px] md:text-xs uppercase tracking-[0.26em] font-medium font-[family-name:var(--font-geist-sans)] pb-1"
          style={{ color: "#CDFF50" }}
        >
          Work in progress
        </p>

        <span className="flex items-end gap-1.5 md:gap-2 mb-[2px]">
          <TrafficCone delay="0.45s" />
          <TrafficCone delay="0.6s" />
        </span>
      </div>
    </div>
  );
}

export default function ApproachPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header solid />
      <WIPBanner />

      {/* Breadcrumb */}
      <section className="pt-10 md:pt-14 pb-10 md:pb-14 px-6 md:px-10">
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1100px] mx-auto text-[13px] font-[family-name:var(--font-geist-sans)] text-black/50"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-black/30">/</li>
            <li aria-current="page" className="text-black/85">Lorem</li>
          </ol>
        </nav>
      </section>

      {/* Title block */}
      <section className="px-6 md:px-10 mb-16 md:mb-24">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-10 md:gap-x-16 gap-y-6 md:gap-y-8">
          <h1 className="md:col-span-8 order-1 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05]">
            Lorem Ipsum
          </h1>
          <h2 className="md:col-span-4 order-3 md:order-2 font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.6rem,3.8vw,2.8rem)] tracking-tight leading-[1.05] mt-6 md:mt-0">
            Dolor
          </h2>

          <div className="md:col-span-8 order-2 md:order-3">
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch] mb-4">
              {LOREM_BODY}
            </p>
            <p className="text-base md:text-lg text-black/65 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[58ch]">
              {LOREM_BODY}
            </p>
          </div>

          <div className="order-4 md:col-span-4">
            <ul className="text-base md:text-lg text-black/80 space-y-1.5 font-[family-name:var(--font-geist-sans)]">
              <li>Lorem ipsum</li>
              <li>Dolor sit amet</li>
              <li>Consectetur</li>
              <li>Adipiscing elit</li>
            </ul>
            <p className="text-base md:text-lg text-black/80 mt-6 font-[family-name:var(--font-geist-sans)]">2026</p>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="px-6 md:px-10 mb-24 md:mb-32">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-black/15 pt-8 md:pt-10">
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              Lorem
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Ipsum dolor sit amet consectetur
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              Ipsum
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Adipiscing elit sed do eiusmod tempor
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-3">
              Dolor
            </p>
            <p className="text-sm text-black/55 font-[family-name:var(--font-geist-sans)]">
              Incididunt ut labore et dolore magna
            </p>
          </div>
        </div>
      </section>

      {/* Content body */}
      <div className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-24 md:gap-36">
          {/* Intro */}
          <section id="intro" className="scroll-mt-32">
            <Eyebrow>Lorem ipsum</Eyebrow>
            <h2 className={HEADLINE_CLASS}>{LOREM_HEADLINE}</h2>
            <p className={BODY_CLASS}>{LOREM_BODY}</p>
          </section>

          {/* Process */}
          <section id="process" className="scroll-mt-32 flex flex-col gap-20 md:gap-28">
            <div>
              <Eyebrow>Lorem ipsum dolor</Eyebrow>
              <h2 className={HEADLINE_CLASS}>{LOREM_HEADLINE}</h2>
              <p className={BODY_CLASS}>{LOREM_BODY}</p>
            </div>

            {PHASES.map((phase) => (
              <div key={phase.num} id={`process-${phase.num}`} className="scroll-mt-32">
                <Eyebrow>Lorem · {phase.num}</Eyebrow>
                <h3 className={HEADLINE_CLASS}>{phase.name}</h3>
                <p className={`${BODY_CLASS} mb-10`}>{LOREM_BODY}</p>
                <div className="flex flex-col gap-5 md:gap-6 max-w-[62ch]">
                  {LOREM_BULLETS.map(({ lead, text }) => (
                    <p
                      key={`${phase.num}-${lead}`}
                      className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)]"
                    >
                      <span className="font-semibold text-black">{lead}</span>{" "}
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Refusals */}
          <section id="not" className="scroll-mt-32">
            <Eyebrow>Lorem ipsum</Eyebrow>
            <h2 className={HEADLINE_CLASS}>{LOREM_HEADLINE}</h2>
            <p className={`${BODY_CLASS} mb-10`}>{LOREM_BODY}</p>
            <div className="flex flex-col gap-5 md:gap-6 max-w-[62ch]">
              {LOREM_BULLETS.map(({ lead, text }, i) => (
                <p
                  key={`refusal-${i}`}
                  className="text-base md:text-lg text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)]"
                >
                  <span className="font-semibold text-black">{lead}</span>{" "}
                  {text}
                </p>
              ))}
            </div>
          </section>

          {/* Stack */}
          <section id="stack" className="scroll-mt-32">
            <Eyebrow>Lorem ipsum</Eyebrow>
            <h2 className={HEADLINE_CLASS}>{LOREM_HEADLINE}</h2>
            <p className={`${BODY_CLASS} mb-10`}>{LOREM_BODY}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-5 md:gap-y-6 max-w-[62ch]">
              {STACK_ITEMS.map(({ name, note }) => (
                <div key={name} className="flex gap-3 md:gap-4">
                  <span className="font-[family-name:var(--font-outfit)] font-semibold text-base md:text-lg shrink-0 min-w-[5.5rem]">
                    {name}
                  </span>
                  <span className="text-sm md:text-base text-black/60 font-[family-name:var(--font-geist-sans)]">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-32">
            <Eyebrow>Lorem</Eyebrow>
            <h2 className={HEADLINE_CLASS}>{LOREM_HEADLINE}</h2>
            <p className={`${BODY_CLASS} mb-10`}>{LOREM_BODY}</p>
            <FAQ />
          </section>
        </div>
      </div>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-32 md:pb-48 pt-12 md:pt-16 border-t border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-8">
              <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
                Lorem
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.6rem)] tracking-tight leading-[1.05] max-w-[22ch]">
                {LOREM_HEADLINE}
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/#contact"
                className="cursor-book inline-flex items-center px-8 py-4 md:px-10 md:py-5 rounded-full bg-black text-white text-sm md:text-base uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-black/80 transition-all duration-300"
              >
                {LOREM_SHORT.slice(0, 12)}
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-24 pt-8 border-t border-black/10 flex items-center justify-between text-xs text-black/40 font-[family-name:var(--font-geist-sans)] tracking-wide">
            <span>Cloverfield Studio · 2026</span>
            <Link
              href="/work"
              className="hover:text-black transition-colors cursor-view"
            >
              Lorem ipsum →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
