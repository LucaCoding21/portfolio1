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

  // Parallax: right column scrolls faster
  useEffect(() => {
    if (!rightColRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, [filtered]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="pt-28 pb-40 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <div className="max-w-[1400px] mx-auto flex gap-8 md:gap-12">
        {/* Left sidebar — category filters */}
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
        <div className="flex-1 flex gap-8 md:gap-16">
          {/* Left column */}
          <div ref={leftColRef} className="flex-1 flex flex-col gap-10">
            {leftProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Right column — offset down + parallax */}
          <div
            ref={rightColRef}
            className="flex-1 flex flex-col gap-10 mt-40 md:mt-64"
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
  return (
    <div className="group">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-black/[0.03]">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 border-t border-black/[0.08] pt-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 flex items-center gap-1.5">
          <span className="inline-block">&#9654;</span>
          {project.tags.join("  ·  ")}
        </p>
        <h3
          className="mt-1.5 font-[family-name:var(--font-cormorant)] text-[clamp(1.1rem,2vw,1.5rem)] tracking-tight italic"
        >
          {project.name}
        </h3>
      </div>
    </div>
  );
}
