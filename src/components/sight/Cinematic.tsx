"use client";

import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { gsap, useSightGsap } from "./motion";

/**
 * The scroll entrance for headings and their copy, used on every section
 * of the page so they all arrive the same way. Wrap the copy in
 * <Cinematic>, set the heading with <Words> and mark the rest:
 *
 *   data-word   a word of a heading: rises out of a clipped slot, one
 *               after another (Words does this for you)
 *   data-blur   a paragraph: sharpens out of a blur as it settles
 *   data-slide  a small thing (button, eyebrow, footnote): a short lift
 *
 * One timeline per wrapper, fired once when it reaches the trigger
 * point. With prefers-reduced-motion the whole block simply fades in.
 */

export default function Cinematic({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  start = "top 80%",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header";
  delay?: number;
  start?: string;
}) {
  const scope = useSightGsap((root, reduced) => {
    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
    const blurs = gsap.utils.toArray<HTMLElement>("[data-blur]", root);
    const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
    const trigger = { trigger: root, start };

    if (reduced) {
      gsap.from(root, { opacity: 0, duration: 0.7, delay, scrollTrigger: trigger });
      return;
    }

    const tl = gsap.timeline({ delay, scrollTrigger: trigger });
    if (words.length) {
      tl.from(
        words,
        { yPercent: 115, duration: 0.95, ease: "power4.out", stagger: 0.05 },
        0
      );
    }
    if (blurs.length) {
      tl.from(
        blurs,
        {
          y: 16,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
        },
        words.length ? 0.35 : 0
      );
    }
    if (slides.length) {
      tl.from(
        slides,
        { y: 12, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
        words.length ? 0.6 : 0.25
      );
    }
  });

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A heading whose words each sit in their own clipped slot, so Cinematic
 * can raise them one by one. Plain text is split on spaces; an element
 * (a coloured span, a <br />) is kept whole. The slot has a little room
 * below the baseline so descenders aren't clipped.
 */
export function Words({
  children,
  as: Tag = "h2",
  className = "",
  style,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  return (
    <Tag id={id} className={className} style={style}>
      {split(children)}
    </Tag>
  );
}

function Slot({ children }: { children: ReactNode }) {
  return (
    <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span data-word className="inline-block">
        {children}
      </span>
    </span>
  );
}

function split(node: ReactNode): ReactNode {
  return Children.map(node, (child, i) => {
    if (typeof child === "string") {
      const parts = child.split(/(\s+)/);
      return (
        <Fragment key={i}>
          {parts.map((part, j) =>
            part.trim() === "" ? part : <Slot key={j}>{part}</Slot>
          )}
        </Fragment>
      );
    }
    if (typeof child === "number") return <Slot key={i}>{child}</Slot>;
    if (isValidElement(child)) {
      if (child.type === "br") return child;
      return <Slot key={i}>{child}</Slot>;
    }
    return child;
  });
}
