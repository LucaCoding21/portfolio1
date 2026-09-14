"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** The section's ground and rule colours, matched to the reference. */
const PAPER = "#F8F2E8";
const CITRON = "#8b8d73";
const CHARCOAL = "#272727";

/** PLACEHOLDER copy. Four lines we'd actually say, each opening to one more. */
const ITEMS = [
  {
    q: "“no templates. ever.”",
    a: "every page is drawn from scratch for the business it belongs to, around how its customers actually decide.",
  },
  {
    q: "“live in a week, not a quarter.”",
    a: "designed, built, cut over and launched in under seven days, with us on call the whole of launch day.",
  },
  {
    q: "“judged by what it brings in.”",
    a: "calls, quote requests and bookings are the scoreboard. a site that only looks good is decoration.",
  },
  {
    q: "“you talk to the people doing the work.”",
    a: "a designer and a developer, and no account manager in between. the same two answer the phone after launch.",
  },
];

const PLUS = "M14.6667 17.3333H6.66669V14.6667H14.6667V6.66667H17.3334V14.6667H25.3334V17.3333H17.3334V25.3333H14.6667V17.3333Z";
const MINUS = "M14.6667 17.3333H6.66669V14.6667H14.6667H17.3334H25.3334V17.3333H17.3334H14.6667Z";

/**
 * Philosophy, built like the reference's FAQ block: a tag, a light headline
 * that rises in character by character, then numbered lines that slide in
 * with their rules drawing underneath, each opening to one sentence.
 */
export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      // Headline: split to lines and chars, each char rises from below its
      // line's clip. Plays once when the section is 200px into the viewport.
      gsap.set(heading, { opacity: 0, visibility: "hidden" });
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.set(heading, { opacity: 1, visibility: "visible" });
        const split = new SplitText(heading, { type: "lines,chars" });
        split.lines.forEach((l) => ((l as HTMLElement).style.overflow = "hidden"));
        gsap.set(split.chars, { display: "inline-block" });
        gsap.fromTo(
          split.chars,
          { yPercent: 120 },
          { yPercent: 0, duration: 1, stagger: 0.02, ease: "expo.out" }
        );
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom-=200px",
        end: "bottom top+=200px",
        onEnter: play,
        onEnterBack: play,
      });

      // Items: buttons slide in from the right with a stagger, then each
      // rule draws left to right, staggered a beat later.
      const buttons = section.querySelectorAll<HTMLElement>("[data-item-button]");
      const items = section.querySelectorAll<HTMLElement>("[data-item]");
      gsap.set(buttons, { opacity: 0, x: 24 });
      let shown = false;
      const show = () => {
        if (shown) return;
        shown = true;
        gsap.to(buttons, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" });
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { "--after-scale": 0 },
            { "--after-scale": 1, duration: 1.8, delay: 1.2 + 0.15 * i, ease: "power2.out" }
          );
        });
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom-=400px",
        end: "bottom top+=400px",
        onEnter: show,
        onEnterBack: show,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Answer height tween, matching the reference: 0.4s out to open, in-out to close.
  const toggle = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const answers = section.querySelectorAll<HTMLElement>("[data-answer]");
    const close = (el: HTMLElement) => {
      const h = el.offsetHeight;
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { height: h, marginTop: 8 },
        { height: 0, marginTop: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => { el.style.display = "none"; } }
      );
    };
    const openEl = (el: HTMLElement) => {
      el.style.display = "block";
      el.style.height = "auto";
      el.style.marginTop = "";
      const h = el.offsetHeight;
      el.style.height = "0";
      el.style.marginTop = "0";
      gsap.killTweensOf(el);
      gsap.to(el, { height: h, marginTop: 8, duration: 0.4, ease: "power2.out" });
    };
    answers.forEach((el, j) => {
      if (j === i) {
        if (open === i) close(el);
        else openEl(el);
      } else if (open === j) {
        close(el);
      }
    });
    setOpen(open === i ? null : i);
  };

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full border-t py-10 lg:py-24"
      style={{ backgroundColor: PAPER, borderColor: CITRON, color: CHARCOAL }}
    >
      <div className="relative mx-auto grid w-full max-w-[1680px] grid-cols-4 gap-x-2 px-4 md:grid-cols-8 md:px-8 lg:grid-cols-12 lg:px-14">
        <header className="col-span-full">
          <p className="font-[family-name:var(--font-outfit)] text-[12px] font-bold uppercase leading-[1.4] tracking-[0.08em] md:text-[16px]">
            Philosophy
          </p>
        </header>

        <div className="col-span-full mt-4 lg:col-span-9">
          <h2
            ref={headingRef}
            className="font-[family-name:var(--font-outfit)] text-[24px] font-light leading-[1.2] md:text-[56px]"
          >
            we build websites around how a business actually wins work.
          </h2>
        </div>

        <ul className="col-span-full mt-10 md:mt-[76px] lg:col-start-4 lg:col-span-9 lg:mt-28">
          {ITEMS.map((item, i) => (
            <li
              key={item.q}
              data-item
              className="relative mb-4 w-full md:mb-6 [--after-scale:0] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:bottom-0 [&:not(:last-child)]:after:left-0 [&:not(:last-child)]:after:h-px [&:not(:last-child)]:after:w-full [&:not(:last-child)]:after:origin-left [&:not(:last-child)]:after:scale-x-[var(--after-scale)] [&:not(:last-child)]:after:bg-[#8b8d73] [&:not(:last-child)]:after:content-['']"
            >
              <button
                type="button"
                data-item-button
                aria-expanded={open === i}
                onClick={() => toggle(i)}
                className="relative w-full border-0 bg-transparent p-0 pb-4 text-left md:pb-8"
                style={{ color: CHARCOAL }}
              >
                <header className="relative flex w-full items-start justify-center gap-x-3 md:items-center md:gap-x-6">
                  <p
                    className="relative mt-2 font-[family-name:var(--font-outfit)] text-[16px] leading-[1.3] md:mt-1 md:text-[18px] md:leading-[1.4]"
                    style={{ color: CITRON }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-outfit)] text-[22px] font-semibold leading-[1.3] md:text-[28px]">
                      {item.q}
                    </p>
                  </div>
                  <div className="pointer-events-none relative flex h-8 w-8 items-center justify-center">
                    <svg viewBox="0 0 32 32" fill="none" className={`absolute w-7 ${open === i ? "hidden" : "block"}`}>
                      <path d={PLUS} fill={CHARCOAL} />
                    </svg>
                    <svg viewBox="0 0 32 32" fill="none" className={`absolute w-7 ${open === i ? "block" : "hidden"}`}>
                      <path d={MINUS} fill={CHARCOAL} />
                    </svg>
                  </div>
                </header>
                <div
                  data-answer
                  className="ml-[31px] overflow-hidden md:ml-[46px] md:w-[calc(100%-144px)]"
                  style={{ display: "none", height: 0, marginTop: 0 }}
                >
                  <p className="font-[family-name:var(--font-outfit)] text-[22px] font-light leading-[1.3] md:text-[28px]">
                    {item.a}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
