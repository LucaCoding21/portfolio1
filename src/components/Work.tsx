import Image from "next/image";
import { projects } from "@/data/projects";

export default function Work() {
  return (
    <section id="work" className="py-28 px-6 md:px-10 border-t border-white/[0.06]">
      <h2 className="section-heading text-center mb-16">Selected Work</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.03]">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-5">
              <h3 className="font-[family-name:var(--font-playfair)] text-[22px] tracking-tight">
                {project.name}
              </h3>
              <p className="mt-1.5 text-sm text-white/50 leading-relaxed">
                {project.description}
              </p>
              <p className="mt-2 text-[11px] text-white/30 uppercase tracking-widest">
                {project.tags.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
