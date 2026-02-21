"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const ALL_LABEL = "ALL";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);

  // Derive unique categories from project tags
  const categories = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return [ALL_LABEL, ...Array.from(tagSet)];
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === ALL_LABEL) return projects;
    return projects.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter]);

  // Split into two columns
  const leftProjects = filtered.filter((_, i) => i % 2 === 0);
  const rightProjects = filtered.filter((_, i) => i % 2 === 1);

  // Parallax: right column scrolls faster (desktop only)
  useEffect(() => {
    if (!rightColRef.current || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.to(rightColRef.current, {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    });

    return () => mm.revert();
  }, [filtered]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="pt-20 md:pt-28 pb-16 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2.2rem,7vw,5rem)] uppercase tracking-tight max-w-[1400px] mx-auto mb-6 md:mb-16">
        What We've Built
      </h2>

      {/* Aggregate stats bar */}
      <div className="max-w-[1400px] mx-auto mb-14 md:mb-20 grid grid-cols-3 border-t border-b border-black/10 py-8 md:py-10">
        {[
          { stat: "12+", label: "Sites launched" },
          { stat: "< 7 days", label: "Avg. time to launch" },
          { stat: "0", label: "Templates used. Ever." },
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

      {/* Mobile filter pills — horizontal scroll */}
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

      <div className="max-w-[1400px] mx-auto flex gap-8 md:gap-12">
        {/* Left sidebar — category filters (desktop) */}
        <div className="hidden md:block w-[200px] shrink-0 sticky top-[50vh] -translate-y-1/2 self-start mt-40">
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
        </div>

        {/* Project columns */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Left column */}
          <div ref={leftColRef} className="flex-1 flex flex-col gap-8 md:gap-10">
            {leftProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Right column — offset down + parallax (desktop only) */}
          <div
            ref={rightColRef}
            className="flex-1 flex flex-col gap-8 md:gap-10 md:mt-64"
          >
            {rightProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const content = (
    <>
      <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black/[0.03]">
        {/* Mobile: show hoverImage directly if available, Desktop: show cover with hover swap */}
        <Image
          src={project.hoverImage || project.image}
          alt={`${project.name} - ${project.description} | Web design project by Cloverfield Studio Vancouver BC`}
          fill
          className="object-cover md:hidden"
        />
        <Image
          src={project.image}
          alt={`${project.name} - ${project.description} | Web design project by Cloverfield Studio Vancouver BC`}
          fill
          className={`object-cover transition-all duration-700 ease-out hidden md:block ${
            project.hoverImage
              ? "group-hover:opacity-0"
              : "group-hover:scale-[1.03]"
          }`}
        />
        {project.hoverImage && (
          <Image
            src={project.hoverImage}
            alt={`${project.name} website preview - ${project.tags.join(", ")} project by Cloverfield Studio`}
            fill
            className="object-cover transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] hidden md:block"
          />
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
        {project.kpis && project.kpis.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {project.kpis.map((kpi) => (
              <span
                key={kpi}
                className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"
              >
                {kpi}
              </span>
            ))}
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
