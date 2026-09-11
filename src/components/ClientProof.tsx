"use client";

import Link from "next/link";
import { projects } from "@/data/projects";

/** The section's ground, shared with the two sections above. */
const PAPER = "#F8F2E8";

/**
 * Quotes are read straight off the projects that carry them, so there is one
 * source of truth — edit a `quote` in `projects.ts` and it changes here too.
 */
/** Four, not five: an odd count leaves an orphan hanging in the two-up grid. */
const PROOF_ORDER = [8, 6, 1, 3];

const quotes = PROOF_ORDER.map((id) => {
  const project = projects.find((p) => p.id === id);
  return project?.quote ? { id, ...project.quote } : null;
}).filter((q): q is NonNullable<typeof q> => q !== null);

export default function ClientProof() {
  return (
    <section
      id="client-proof"
      className="px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-48"
      style={{ backgroundColor: PAPER }}
    >
      {/* Quiet label, same treatment as the sections above. */}
      <h2 className="font-[family-name:var(--font-outfit)] text-sm font-medium leading-none tracking-[0.035em] text-[#6A665E] md:text-lg">
        Client Proof
      </h2>

      <p className="mt-6 max-w-[50ch] font-[family-name:var(--font-outfit)] text-[clamp(1.125rem,2.1vw,1.875rem)] font-normal leading-[1.35] tracking-tight text-[#111113] md:mt-8">
        One build followed all the way through, and what the rest of them said
        once the site was live.
      </p>

      {/* The case study leads: a plain rectangle of video on the ground, with
          the copy set beneath it rather than laid over it — the dark overlay
          card in the Work grid below belongs to a different look. */}
      <Link
        href="/case-studies/innovative-aluminum"
        className="group mt-20 block md:mt-32"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111113] md:aspect-[21/9]">
          <video
            src="/innovative-aluminum-hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>

        {/* Mono micro-caption under the frame, the way the reference labels its
            images. */}
        <p className="mt-6 font-[family-name:var(--font-sometype)] text-xs uppercase tracking-[0.14em] text-[#6A665E] md:text-[13px]">
          Innovative Aluminum Systems
          <span aria-hidden className="mx-2 text-[#111113]/25">
            /
          </span>
          Case study
        </p>

        <h3 className="mt-8 max-w-[24ch] font-[family-name:var(--font-outfit)] text-[clamp(1.75rem,4vw,3.25rem)] font-normal leading-[1.1] tracking-tight text-[#111113] md:mt-10">
          How Innovative Aluminum got a new customer through AI search
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="ml-[0.16em] inline-block h-[0.44em] w-[0.44em] align-middle transition-all duration-500 ease-out md:-translate-x-[0.18em] md:translate-y-[0.18em] md:opacity-0 md:group-hover:translate-x-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:transition-none"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </h3>

        <p className="mt-6 max-w-[50ch] font-[family-name:var(--font-outfit)] text-[clamp(1.1rem,1.7vw,1.5rem)] font-normal leading-relaxed tracking-tight text-[#6A665E] md:mt-8">
          A slow, generic manufacturer site rebuilt as a presence designed to be
          found. Their first two customers arrived organically, seven days after
          launch.
        </p>
      </Link>

      {/* The section's second half gets its own rule and its own name, so it
          is clear you have moved from the case study to the quotes rather than
          being left to work it out. */}
      <h3 className="mt-28 border-t border-[#111113]/12 pt-8 font-[family-name:var(--font-sometype)] text-xs uppercase tracking-[0.14em] text-[#6A665E] md:mt-44 md:pt-10 md:text-[13px]">
        In their own words
      </h3>

      {/* Quotes run two-up and at reading size, so they read as a wall of
          voices rather than as more display statements. */}
      <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-14 md:mt-16 md:grid-cols-2 md:gap-y-20">
        {quotes.map((quote) => (
          <figure key={quote.id} className="max-w-[46ch]">
            {/* No quotation marks and no card: several of these are two
                separate messages, kept as separate lines rather than run
                together, because that is how they arrived. */}
            <blockquote className="font-[family-name:var(--font-outfit)] text-[clamp(1.1rem,1.7vw,1.5rem)] font-normal leading-relaxed tracking-tight text-[#111113]">
              {quote.texts.map((text) => (
                <p key={text} className="mt-4 first:mt-0">
                  {text}
                </p>
              ))}
            </blockquote>

            <figcaption className="mt-6 font-[family-name:var(--font-sometype)] text-xs uppercase leading-relaxed tracking-[0.14em] text-[#6A665E]">
              {quote.author}
              <span aria-hidden className="mx-2 text-[#111113]/25">
                /
              </span>
              {quote.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
