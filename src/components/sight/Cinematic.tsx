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
 *
 * `atLoad` is for the block on the first screen: the same entrance runs as
 * CSS (sight.css, .cine-load) from the first paint, instead of waiting a
 * second or so on a phone for the page's scripts to load and hydrate.
 */

export default function Cinematic({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  start = "top 80%",
  atLoad = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header";
  delay?: number;
  start?: string;
  atLoad?: boolean;
}) {
  const scope = useSightGsap((root, reduced) => {
    if (atLoad) return;
    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
    const blurs = gsap.utils.toArray<HTMLElement>("[data-blur]", root);
    const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
    const trigger = { trigger: root, start };
    const onFirstScreen = root.getBoundingClientRect().top < window.innerHeight;

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
          // On the first screen, 1% rather than 0: invisible under a 10px
          // blur, but Chrome skips fully transparent text when timing the
          // largest paint, so the hero's paragraph would only count once its
          // reveal plays. Further down it stays 0 (see onFirstScreen).
          opacity: onFirstScreen ? 0.01 : 0,
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
    <Tag ref={scope} className={atLoad ? `cine-load ${className}` : className}>
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

/* --i numbers the words so the CSS entrance (.cine-load) can stagger them. */
function Slot({ children, n }: { children: ReactNode; n: number }) {
  return (
    <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span data-word className="inline-block" style={{ "--i": n } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

function split(node: ReactNode, count = { n: 0 }): ReactNode {
  return Children.map(node, (child, i) => {
    if (typeof child === "string") {
      const parts = child.split(/(\s+)/);
      return (
        <Fragment key={i}>
          {parts.map((part, j) =>
            part.trim() === "" ? part : (
              <Slot key={j} n={count.n++}>
                {part}
              </Slot>
            )
          )}
        </Fragment>
      );
    }
    if (typeof child === "number") return <Slot key={i} n={count.n++}>{child}</Slot>;
    if (isValidElement(child)) {
      if (child.type === "br") return child;
      return <Slot key={i} n={count.n++}>{child}</Slot>;
    }
    return child;
  });
}
