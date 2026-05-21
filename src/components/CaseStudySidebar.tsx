"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SubSection {
  id: string;
  label: string;
}

interface Section {
  id: string;
  label: string;
  children?: SubSection[];
}

interface Props {
  sections: Section[];
}

export default function CaseStudySidebar({ sections }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  // Track active section across parents AND children
  useEffect(() => {
    const flat: { id: string }[] = sections.flatMap((s) => [
      { id: s.id },
      ...(s.children ?? []),
    ]);
    const elements = flat
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const pickActive = () => {
      const line = window.innerHeight * 0.33;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) {
          current = el.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, [sections]);

  // Stagger blur-in on first reveal — main items only
  useEffect(() => {
    const nav = navRef.current;
    const trigger = nav?.parentElement;
    if (!nav || !trigger) return;

    const inners = nav.querySelectorAll<HTMLElement>(".legend-line-inner");
    if (!inners.length) return;

    let st: ScrollTrigger | undefined;
    let tl: gsap.core.Timeline | undefined;

    const id = requestAnimationFrame(() => {
      gsap.set(inners, { yPercent: 110, opacity: 0, filter: "blur(14px)" });
      tl = gsap.timeline({ paused: true });
      tl.to(inners, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
      });
      st = ScrollTrigger.create({
        trigger,
        start: "top 75%",
        toggleActions: "play none none reverse",
        animation: tl,
      });
    });

    return () => {
      cancelAnimationFrame(id);
      st?.kill();
      tl?.kill();
    };
  }, []);

  const isParentActive = (s: Section) =>
    active === s.id || !!s.children?.some((c) => c.id === active);

  return (
    <nav ref={navRef} className="sticky top-32 hidden md:block">
      <ul className="flex flex-col gap-4 text-base lg:text-lg font-[family-name:var(--font-geist-sans)]">
        {sections.map((s) => {
          const expanded = isParentActive(s);
          return (
            <li key={s.id}>
              <div className="overflow-hidden leading-[1.2]">
                <a
                  href={`#${s.id}`}
                  className={`legend-line-inner block transition-colors will-change-[transform,opacity,filter] ${
                    isParentActive(s)
                      ? "text-black font-semibold"
                      : "text-black/35 hover:text-black/70"
                  }`}
                >
                  {s.label}
                </a>
              </div>

              {s.children && (() => {
                const childCount = s.children.length;
                const itemFade = 380;
                const itemStagger = 90;
                const containerDuration = 420;
                const lastIdx = childCount - 1;
                const containerDelay = expanded
                  ? 0
                  : lastIdx * itemStagger + itemFade - 60;
                return (
                  <div
                    aria-hidden={!expanded}
                    style={{
                      maxHeight: expanded
                        ? `${childCount * 48 + 24}px`
                        : "0px",
                      transition: `max-height ${containerDuration}ms cubic-bezier(0.22,1,0.36,1) ${containerDelay}ms`,
                    }}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col gap-2 text-[13px] lg:text-sm pt-3 pl-5">
                      {s.children.map((c, i) => {
                        const delay = expanded
                          ? 140 + i * itemStagger
                          : (lastIdx - i) * itemStagger;
                        return (
                          <li key={c.id}>
                            <a
                              href={`#${c.id}`}
                              style={{
                                opacity: expanded ? 1 : 0,
                                filter: expanded
                                  ? "blur(0px)"
                                  : "blur(6px)",
                                transform: expanded
                                  ? "translateY(0)"
                                  : "translateY(-4px)",
                                transition: `opacity ${itemFade}ms ease-out ${delay}ms, filter ${itemFade}ms ease-out ${delay}ms, transform ${itemFade}ms ease-out ${delay}ms, color 200ms ease`,
                              }}
                              className={`block ${
                                active === c.id
                                  ? "text-black font-semibold"
                                  : "text-black/40 hover:text-black/70"
                              }`}
                            >
                              {c.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
