"use client";

import { gsap, useSightGsap } from "./motion";

/**
 * Default scroll reveal: fade + 24px rise, 0.7s power3.out, once.
 * Pass `selector` to stagger matching children instead of the wrapper.
 * With prefers-reduced-motion the rise is dropped and only the fade runs.
 */
export default function Reveal({
  children,
  className = "",
  selector,
  delay = 0,
  stagger = 0.08,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  delay?: number;
  stagger?: number;
  as?: "div" | "section" | "li" | "footer";
  id?: string;
}) {
  const scope = useSightGsap((root, reduced) => {
    const targets: Element | Element[] = selector
      ? gsap.utils.toArray<Element>(selector, root)
      : root;
    gsap.from(targets, {
      opacity: 0,
      y: reduced ? 0 : 24,
      duration: 0.7,
      ease: "power3.out",
      delay,
      stagger,
      scrollTrigger: {
        trigger: root,
        start: "top 82%",
        once: true,
      },
    });
  });

  return (
    // @ts-expect-error — ref type narrows per tag; all render HTMLElements
    <Tag ref={scope} id={id} className={className}>
      {children}
    </Tag>
  );
}
