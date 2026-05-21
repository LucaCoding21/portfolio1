"use client";

import { Fragment, useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const ALL_LABEL = "ALL";

interface WorkProps {
  projectList?: Project[];
  showFilters?: boolean;
}

export default function Work({ projectList, showFilters = true }: WorkProps) {
  const displayProjects = projectList || projects;
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Derive unique categories from project tags
  const categories = useMemo(() => {
    const tagSet = new Set<string>();
    displayProjects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return [ALL_LABEL, ...Array.from(tagSet)];
  }, [displayProjects]);

  const filtered = useMemo(() => {
    if (activeFilter === ALL_LABEL) return displayProjects;
    return displayProjects.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter, displayProjects]);

  // Split into two columns — respect explicit column overrides, alternate the rest
  const alternating = filtered.filter((p) => !p.column);
  const leftProjects = [
    ...alternating.filter((_, i) => i % 2 === 0),
    ...filtered.filter((p) => p.column === "left"),
  ];
  const rightProjects = [
    ...alternating.filter((_, i) => i % 2 === 1),
    ...filtered.filter((p) => p.column === "right"),
  ];

  // Parallax: right column scrolls faster (desktop only) — homepage only.
  // On /work the right column is too tall and the effect creates a visible
  // imbalance at the bottom (left col alone while right scrolled away).
  useEffect(() => {
    if (showFilters) return;
    if (!rightColRef.current || !leftColRef.current || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const rightCol = rightColRef.current!;
      const leftCol = leftColRef.current!;
      const section = sectionRef.current!;
      const PARALLAX = -35;

      // The parallax translates the right column up (CSS transform),
      // but the DOM still reserves the original height — creating a gap.
      // Pull the next section up to meet the visual bottom, capped so we
      // never pull above the left column's bottom (which would bleed into Contact).
      const parallaxPx = rightCol.offsetHeight * Math.abs(PARALLAX) / 100;
      const sectionH = section.offsetHeight;
      const progress = sectionH / (sectionH + window.innerHeight);
      const desired = parallaxPx * progress - 240;
      const rightDomBottom = rightCol.offsetTop + rightCol.offsetHeight;
      const leftDomBottom = leftCol.offsetTop + leftCol.offsetHeight;
      const maxPullUp = Math.max(0, rightDomBottom - leftDomBottom - 40);
      const pullUp = Math.max(0, Math.min(desired, maxPullUp));
      section.style.marginBottom = `-${Math.round(pullUp)}px`;

      gsap.to(rightCol, {
        yPercent: PARALLAX,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    });

    return () => {
      mm.revert();
      if (sectionRef.current) sectionRef.current.style.marginBottom = "";
    };
  }, [filtered, showFilters]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="pt-10 md:pt-14 px-6 md:px-10"
    >
      <div className="max-w-[1400px] mx-auto mb-6 md:mb-16 text-center">
        <div className="inline-flex items-center gap-2.5 mb-4 md:mb-6">
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-[family-name:var(--font-geist-sans)] text-black/70 font-semibold">
            Case Studies
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2.2rem,7vw,5rem)] uppercase tracking-tight">
          Work That Speaks
          <br />
          for Itself
        </h2>
      </div>

      {/* Aggregate stats bar */}
      <div className="max-w-[1400px] mx-auto mb-14 md:mb-20 grid grid-cols-2 border-t border-b border-black/10 py-10 md:py-14">
        {[
          { stat: "+35%", label: "Avg. conversion lift" },
          { stat: "15+", label: "Websites shipped" },
        ].map(({ stat, label }) => (
          <div key={label} className="flex flex-col gap-1 px-4 md:px-8 border-r border-black/10 last:border-r-0 first:pl-0">
            <p className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.4rem,3.5vw,2.8rem)] tracking-tight leading-none">
              {stat}
            </p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-black/45 mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Featured case study card */}
      <div className="max-w-[1400px] mx-auto mb-14 md:mb-20">
        <Link
          href="/case-studies/innovative-aluminum"
          className="group relative block overflow-hidden rounded-2xl md:rounded-3xl bg-black aspect-[4/3] md:aspect-[21/9] cursor-read"
        >
            {/* Looping video background */}
            <video
              src="/homepage-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Gradient overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/85" />

            {/* Client logo · top-right corner */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 lg:top-14 lg:right-14 z-10">
              <Image
                src="/ias-newgold.svg"
                alt="Innovative Aluminum Systems"
                width={473}
                height={160}
                className="h-7 md:h-9 lg:h-11 w-auto"
                priority
              />
            </div>

            {/* Content */}
            <div className="relative h-full p-6 md:p-10 lg:p-14 flex flex-col">
              {/* Top: eyebrow + title */}
              <div className="flex-1">
                <div className="mb-5 md:mb-8">
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-white font-bold font-[family-name:var(--font-geist-sans)]">
                    Featured Case Study
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-outfit)] font-bold text-white text-[clamp(1.6rem,4vw,3.8rem)] tracking-tight leading-[1.05] max-w-[22ch]">
                  How Innovative Aluminum got a new customer through AI search.
                </h3>
              </div>

              {/* Bottom: body + arrow */}
              <div className="flex items-end justify-between gap-6 md:gap-10">
                <p className="text-white/80 text-xs md:text-sm lg:text-base max-w-[42ch] leading-relaxed font-[family-name:var(--font-geist-sans)]">
                  From a slow, generic manufacturer site to a premium digital presence built to be found. Their first two customers arrived organically, seven days after launch.
                </p>

                <div className="shrink-0 flex items-center justify-center">
                  <svg
                    className="h-6 md:h-10 lg:h-14 w-auto text-white transition-transform duration-500 ease-out group-hover:translate-x-3"
                    viewBox="0 0 50 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 7 H44" />
                    <path d="M36 1 L44 7 L36 13" />
                  </svg>
                </div>
              </div>
            </div>
        </Link>
      </div>

      {/* Mobile filter pills — horizontal scroll */}
      {showFilters && (
        <div className="md:hidden max-w-[1400px] mx-auto mb-8 -mx-6 px-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`
                  px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] whitespace-nowrap
                  font-[family-name:var(--font-geist-sans)] transition-all duration-200 border
                  ${
                    activeFilter === cat
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black/50 border-black/15 active:bg-black/5"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto flex gap-8 md:gap-12">
        {/* Left sidebar — category filters (desktop) */}
        {showFilters && <div className="hidden md:block w-[200px] shrink-0 sticky top-[50vh] -translate-y-1/2 self-start mt-40">
          <ul className="flex flex-col gap-3">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveFilter(cat)}
                  className={`
                    flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]
                    font-[family-name:var(--font-geist-sans)] transition-colors duration-200
                    ${
                      activeFilter === cat
                        ? "text-black font-semibold"
                        : "text-black/35 hover:text-black/60"
                    }
                  `}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      activeFilter === cat ? "bg-black" : "bg-black/20"
                    }`}
                  />
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>}

        {/* Project columns */}
        {showFilters ? (
          // /work: CSS multi-column auto-balances both columns
          <div className="flex-1 md:columns-2 md:gap-16">
            {filtered.map((project) => (
              <div key={project.id} className="mb-8 md:mb-10 break-inside-avoid">
                <ProjectCard project={project} isMobile={isMobile} />
              </div>
            ))}
          </div>
        ) : (
          // Homepage: staggered flex columns + parallax
          <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16 overflow-hidden">
            <div ref={leftColRef} className="flex-1 flex flex-col gap-8 md:gap-10">
              {leftProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isMobile={isMobile} />
              ))}
            </div>
            <div
              ref={rightColRef}
              className="flex-1 flex flex-col gap-8 md:gap-10 md:mt-40"
            >
              {rightProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isMobile={isMobile} />
              ))}
            </div>
          </div>
        )}
      </div>

    </section>
  );
}

export function ViewAllWork() {
  return (
    <div className="relative z-10 flex justify-center py-20 md:py-28 px-6">
      <Link
        href="/work"
        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white text-sm uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-black/80 transition-all duration-300 cursor-view"
      >
        View All Work
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>
  );
}

function ProjectCard({ project, isMobile }: { project: (typeof projects)[number]; isMobile: boolean }) {
  const content = (
    <>
      <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black/[0.03]">
        {isMobile ? (
          <Image
            src={project.hoverImage || project.image}
            alt={`${project.name} — ${project.description} | Custom web design by Cloverfield Studio Surrey BC`}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
            style={project.hoverImage && project.hoverImagePosition ? { objectPosition: project.hoverImagePosition } : undefined}
          />
        ) : (
          <>
            <Image
              src={project.image}
              alt={`${project.name} — ${project.description} | Custom web design by Cloverfield Studio Surrey BC`}
              fill
              loading="lazy"
              sizes="50vw"
              className={`object-cover transition-all duration-700 ease-out ${
                project.hoverImage
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-[1.03]"
              }`}
              style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
            />
            {project.hoverImage && (
              <Image
                src={project.hoverImage}
                alt={`${project.name} website preview — ${project.tags.join(", ")} project by Cloverfield Studio`}
                fill
                loading="lazy"
                sizes="50vw"
                className="object-cover transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
                style={project.hoverImagePosition ? { objectPosition: project.hoverImagePosition } : undefined}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-4 border-t border-black/25 pt-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-[family-name:var(--font-outfit)] font-normal text-[clamp(1.1rem,2vw,1.5rem)] tracking-tight">
            {project.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 whitespace-nowrap shrink-0">
            {project.tags.join("  ·  ")}
          </p>
        </div>
        {project.partnerLogos && project.partnerLogos.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-black/40 font-medium">
              Built for
            </p>
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {project.partnerLogos.map((logo, i) => (
                <Fragment key={logo.src}>
                  {i > 0 && (
                    <span className="text-base text-black/35 font-light">+</span>
                  )}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={logo.className ?? "h-7 md:h-9 w-auto object-contain"}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        )}
        {project.kpis && project.kpis.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1 md:gap-2">
            {project.kpis.map((kpi) => (
              <span
                key={kpi}
                className="text-[9px] md:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap"
              >
                {kpi}
              </span>
            ))}
          </div>
        )}
        {project.quote && project.quote.texts.length > 0 && (
          <div className="mt-4 flex gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-black/5 mt-0.5">
              <Image
                src={project.quote.avatar}
                alt={project.quote.author}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1.5">
                {project.quote.texts.map((text, i) => (
                  <div
                    key={i}
                    className={`bg-black/[0.05] px-4 py-2.5 ${i === 0 ? "rounded-2xl rounded-tl-md" : "rounded-2xl"}`}
                  >
                    <p className="text-[13.5px] text-black/75 leading-snug">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-black/45 mt-1.5 ml-2">
                <span className="font-medium text-black/60">{project.quote.author}</span> · {project.quote.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block cursor-view"
      >
        {content}
      </a>
    );
  }

  return <div className="group cursor-view">{content}</div>;
}
