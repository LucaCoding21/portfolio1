"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AboutProps {
  ready: boolean;
}

export default function About({ ready }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ready && sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
      );
    }
  }, [ready]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 px-6 md:px-10 border-t border-white/[0.06] opacity-0"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="section-heading">About Me</h2>
        <p className="text-lg leading-relaxed text-white/65 font-light">
          I&apos;m a designer and developer passionate about crafting thoughtful
          digital experiences. I focus on clean design, smooth interactions, and
          solving real problems for real people.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-white/65 font-light">
          With experience across product design, brand identity, and full-stack
          development, I help ambitious brands bring their vision to life — from
          concept to launch.
        </p>
      </div>
    </section>
  );
}
