"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import GlitchText from "@/components/GlitchText";
import { selectedWorks, type Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SelectedWorkProps {
  ready: boolean;
}

/** The panel and the copy halves. Pure white, as briefed. */
const GROUND = "#FFFFFF";
const INK = "#111113";

/**
 * Timeline units per project. A sweep is the panel crossing the viewport;
 * a hold is the pause with the project fully revealed, so it can be read.
 */
const SWEEP = 1;
const HOLD = 0.8;
/**
 * Dead zone before the first sweep, in the same units. It absorbs the few
 * pixels of drift that land after the pin engages — so holding the page for
 * the intro never has to snap it back — and gives a beat after release
 * before anything moves.
 */
const LEAD = 0.25;
/** Dead zone after the last sweep, so it lands before the stage unpins. */
const TAIL = 0.15;

/**
 * Viewport heights of scroll each project owns while the stage is pinned.
 * Higher means a slower sweep for the same wheel movement.
 */
const SCROLL_PER_PROJECT = 2;
/** The same, per timeline unit — what the lead and the padding are paid in. */
const SCROLL_PER_UNIT = SCROLL_PER_PROJECT / (SWEEP + HOLD);

/**
 * Seconds the animation takes to catch up with the scroll position. Higher
 * smooths out the jumps of a mouse wheel; too high and it feels laggy.
 */
const SCRUB_SMOOTHING = 1.2;

/**
 * The photo starts a touch zoomed and settles to 1 as the panel uncovers it,
 * so the reveal feels like a reveal rather than a shutter opening on a still.
 */
const PHOTO_ZOOM = 1.12;

/**
 * The line the section opens on, decoded word by word. Lowercase and short:
 * the reveal is a typewriter, and it needs a sentence's worth of words to
 * read as one. `INTRO_BREAK_AFTER` is the word index the line breaks after.
 */
const INTRO = "selected works, a few of the sites we've built, one at a time";
const INTRO_BREAK_AFTER = 6;

/** Which half the photo occupies. Even projects left, odd right, so the
 * panel sweeps back and forth instead of always leaving the same way. */
const photoSide = (i: number): "left" | "right" =>
  i % 2 === 0 ? "left" : "right";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Holds the page where it is until the returned function is called.
 *
 * Done by turning the document's overflow off, not by cancelling wheel
 * events: Chrome makes the rest of a scroll sequence non-cancelable once its
 * first event went through, so a gesture already under way (or trackpad
 * momentum) sails straight through `preventDefault`. Overflow stops it dead.
 * The scrollbar's width is padded back in so the layout doesn't shift where
 * scrollbars take up room; nothing forces the position, and the timeline's
 * `LEAD` covers whatever drift lands before the hold takes.
 */
function holdScroll() {
  const root = document.documentElement;
  const gutter = window.innerWidth - root.clientWidth;
  const prev = {
    overflow: root.style.overflow,
    paddingRight: root.style.paddingRight,
  };

  root.style.overflow = "hidden";
  if (gutter > 0) root.style.paddingRight = `${gutter}px`;

  return () => {
    root.style.overflow = prev.overflow;
    root.style.paddingRight = prev.paddingRight;
  };
}

/**
 * Splits a figure like "+34%", "~$40k" or "5 days" into the number and the
 * characters either side of it, so only the digits are tweened and the rest
 * stays put. Returns null when there is no number to count ("Tripled").
 */
function parseFigure(value: string) {
  const m = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const decimals = (digits.split(".")[1] ?? "").length;
  return {
    prefix,
    suffix,
    target: parseFloat(digits.replace(/,/g, "")),
    decimals,
    grouped: digits.includes(","),
  };
}

/** Writes a count-up frame back in the figure's own format. */
function formatFigure(n: number, f: NonNullable<ReturnType<typeof parseFigure>>) {
  const fixed = n.toFixed(f.decimals);
  const num = f.grouped
    ? Number(fixed).toLocaleString("en-US", {
        minimumFractionDigits: f.decimals,
        maximumFractionDigits: f.decimals,
      })
    : fixed;
  return `${f.prefix}${num}${f.suffix}`;
}

/**
 * Adds a count-up for every figure inside `scope` to `tl` at `at`. Each is a
 * tween on a plain object that writes the text every frame, so on a scrubbed
 * timeline the number follows the scroll in both directions.
 */
function addCountUps(
  tl: gsap.core.Timeline,
  scope: HTMLElement,
  at: number,
  duration: number
) {
  scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const figure = parseFigure(el.dataset.count ?? "");
    if (!figure) return;
    const counter = { n: 0 };
    el.textContent = formatFigure(0, figure);
    tl.to(
      counter,
      {
        n: figure.target,
        duration,
        ease: "power1.out",
        onUpdate: () => {
          el.textContent = formatFigure(counter.n, figure);
        },
      },
      at
    );
  });
}

/**
 * The words for one project: index and category at the top, name and
 * one-liner in the middle, figures and the link at the bottom. Layout is the
 * caller's — on the stage the three groups are spread down the height of the
 * white half, on mobile they simply stack.
 */
function ProjectCopy({
  project,
  index,
  total,
  className = "",
  dataCopy = false,
}: {
  project: Project;
  index: number;
  total: number;
  className?: string;
  /** Lets the stage find the block; the mobile flow doesn't need one. */
  dataCopy?: boolean;
}) {
  return (
    <div className={className} data-copy={dataCopy ? "" : undefined}>
      <div className="flex items-baseline justify-between gap-6 font-[family-name:var(--font-sometype)] text-xs uppercase tracking-[0.14em] md:text-[13px]">
        <span className="text-[#111113]/55">
          {pad2(index + 1)} / {pad2(total)}
        </span>
        {/* The link sits where a category label would, small and off to the
            corner, with the arrow pointing out of the page to the site. */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[#111113]/55 transition-colors duration-300 hover:text-[#111113]"
          >
            Visit
            {/* Drawn, not typed: the mono face's own ↗ is far heavier than
                the letters beside it. A hairline stroke matches them. */}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[1.1em] w-[1.1em] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              <path d="M4 12 12 4M5.5 4H12v6.5" />
            </svg>
          </a>
        )}
      </div>

      <div>
        <h3 className="font-[family-name:var(--font-outfit)] text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-tight text-[#111113]">
          {project.name}
        </h3>
        <p
          data-desc
          className="mt-6 max-w-[34ch] font-[family-name:var(--font-outfit)] text-[clamp(1.05rem,1.4vw,1.375rem)] leading-[1.35] tracking-tight text-[#111113]/70"
        >
          {project.description}
        </p>
      </div>

      {/* Results as plain mono lines, like the labels — the figure inside
          each line still counts up; the words around it stay put. */}
      {project.kpis && (
        <ul className="space-y-2 font-[family-name:var(--font-sometype)] text-xs uppercase tracking-[0.14em] text-[#111113]/70 md:text-[13px]">
          {project.kpis.map((k) => (
            <li key={k} data-count={parseFigure(k) ? k : undefined}>
              {k}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Pinned, scroll-scrubbed showcase. One project at a time.
 *
 * The stage is a viewport-high box with three layers: the photos underneath
 * (each in its own half, clipped), a full-width white panel over them, and
 * the copy on top of the panel. The section arrives as a plain white block;
 * once it pins, scrolling drives one timeline:
 *
 *   project 0: panel slides right → photo on the left, words on the right
 *   project 1: panel slides left  → photo on the right, words on the left
 *   project 2: right again, and so on.
 *
 * Between two rests the panel passes through fully covering the viewport, so
 * the photo for the next project two steps along can be swapped in underneath
 * without ever being seen to change. Adjacent projects sit in opposite halves
 * and never conflict. Words fade out at the start of a sweep (their half is
 * still under the panel then) and fade in near its end (their half is covered
 * again by then), so type is only ever drawn on white.
 *
 * Below `md` there is no room for halves; the same copy stacks under each
 * photo in a plain flow.
 */
export default function SelectedWork({ ready }: SelectedWorkProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const items = selectedWorks;

  // The intro line plays the moment the stage pins, and the page is held
  // there until it has finished, so the words are never scrolled past
  // mid-decode. Tracked in a ref (the pin's callbacks would otherwise see a
  // stale value) with one piece of state to start the reveal.
  const introRef = useRef<"idle" | "playing" | "done">("idle");
  const releaseRef = useRef<(() => void) | null>(null);
  const [playIntro, setPlayIntro] = useState(false);

  const onIntroComplete = useCallback(() => {
    releaseRef.current?.();
    releaseRef.current = null;
    introRef.current = "done";
  }, []);

  // Gated on `ready`: while the loader is up the body is `position: fixed`,
  // and a pin measured against that document is measured against nothing.
  useEffect(() => {
    const stage = stageRef.current;
    const mobile = mobileRef.current;
    if (!ready || !stage || !mobile) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const panel = panelRef.current!;
      const title = titleRef.current!;
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", stage);
      const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", stage);
      const copies = gsap.utils.toArray<HTMLElement>("[data-copy]", stage);
      const n = frames.length;
      if (!n) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(photos, { scale: PHOTO_ZOOM });
      gsap.set(copies, { autoAlpha: 0, y: 32 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${(LEAD + n * (SWEEP + HOLD) - HOLD + TAIL) * SCROLL_PER_UNIT * window.innerHeight}`,
          pin: true,
          anticipatePin: 1,
          // Motion is scroll-driven either way; with reduced motion it just
          // tracks the wheel exactly instead of easing after it.
          scrub: reduced ? true : SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
          // First pin on the page and created after the triggers below it, so
          // it has to be measured first or those land off by the pin's length.
          refreshPriority: 1,
          onUpdate: () => spendTitle(),
          onEnter: (self) => {
            if (introRef.current !== "idle") return;
            // Arriving already deep in the section (a hash link, a reload
            // scrolled down) isn't an entrance — skip the hold.
            if (reduced || self.progress > 0.15) {
              introRef.current = "done";
              return;
            }
            introRef.current = "playing";
            // `anticipatePin` can engage the pin a frame early on a fast
            // scroll, with the stage still short of the top. Bring it the
            // rest of the way before holding — forward only, never back, and
            // instant: the page has `scroll-behavior: smooth`, and freezing
            // overflow under a smooth scroll still in flight stutters.
            if (window.scrollY < self.start) {
              window.scrollTo({ top: self.start, behavior: "instant" });
            }
            releaseRef.current = holdScroll();
            setPlayIntro(true);
          },
        },
      });

      // The intro shows once. Its fade-out is scrubbed like everything else,
      // but as soon as it has fully left, the tween is pulled from the
      // timeline and the intro pinned hidden — so scrolling back up brings
      // the white panel back, not the words.
      let titleOut: gsap.core.Tween | undefined;
      let titleSpent = false;
      const spendTitle = () => {
        if (titleSpent || !titleOut) return;
        if (tl.time() < LEAD + SWEEP * 0.35) return;
        titleSpent = true;
        titleOut.kill();
        gsap.set(title, { autoAlpha: 0 });
      };

      items.forEach((_, i) => {
        const at = LEAD + i * (SWEEP + HOLD);

        // Two steps back shares this photo's half. It's under the panel right
        // now, so swap while nothing can be seen. `immediateRender: false`
        // matters: a set in a scrubbed timeline otherwise fires on build.
        if (i >= 2) {
          tl.set(frames[i - 2], { autoAlpha: 0, immediateRender: false }, at);
          tl.set(frames[i], { autoAlpha: 1, immediateRender: false }, at);
        }

        tl.to(
          panel,
          {
            xPercent: photoSide(i) === "left" ? 50 : -50,
            duration: SWEEP,
            ease: "power2.inOut",
          },
          at
        );
        tl.to(photos[i], { scale: 1, duration: SWEEP }, at);

        // Whatever was on the white half — the intro on the first sweep, the
        // previous project's words after — leaves while the panel still
        // covers it.
        const out = gsap.to(i === 0 ? title : copies[i - 1], {
          autoAlpha: 0,
          y: -24,
          duration: SWEEP * 0.35,
          ease: "power2.in",
        });
        // Re-parented on the spot, before it can tick on the global timeline.
        tl.add(out, at);
        if (i === 0) titleOut = out;
        // And this project's words arrive once its half is white again.
        tl.to(
          copies[i],
          { autoAlpha: 1, y: 0, duration: SWEEP * 0.4, ease: "power2.out" },
          at + SWEEP * 0.6
        );
        addCountUps(tl, copies[i], at + SWEEP * 0.6, SWEEP * 0.4 + HOLD * 0.5);
      });

      // Only a short tail after the last sweep. The last project gets its
      // reading time anyway — it stays on screen while the stage scrolls
      // away — and a full hold here is dead scroll on the way back up, where
      // it reads as the stage being stuck on the last card.
      tl.to({}, { duration: TAIL }, LEAD + (n - 1) * (SWEEP + HOLD) + SWEEP);

      // Each description rises in line by line as its block arrives, the
      // same masked-lines treatment as the studio copy — on the scrub here,
      // so it follows the scroll like everything else on the stage.
      // `autoSplit` re-splits when the width changes or a font lands late;
      // the tween returned from `onSplit` is what it reverts before doing so.
      const splits = copies.map((copy, i) => {
        const desc = copy.querySelector<HTMLElement>("[data-desc]");
        const at = LEAD + i * (SWEEP + HOLD) + SWEEP * 0.6;
        return SplitText.create(desc, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(self.lines, { yPercent: 110 });
            return tl.to(
              self.lines,
              {
                yPercent: 0,
                duration: SWEEP * 0.4,
                ease: "power3.out",
                stagger: 0.06,
              },
              at
            );
          },
        });
      });

      // The pin adds spacing the triggers below were measured without.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(raf);
        splits.forEach((split) => split.revert());
        // Never leave the page held if this is torn down mid-intro.
        releaseRef.current?.();
        releaseRef.current = null;
      };
    });

    // Mobile has no scrub to ride, so each card counts once as it scrolls in.
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", mobile);
      const splits = cards.map((card) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        });
        addCountUps(tl, card, 0, 1.4);

        return SplitText.create(card.querySelector<HTMLElement>("[data-desc]"), {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: { trigger: card, start: "top 80%", once: true },
            }),
        });
      });
      return () => splits.forEach((split) => split.revert());
    });

    return () => mm.revert();
  }, [ready, items]);

  return (
    <section
      id="selected-work"
      className="relative"
      style={{ backgroundColor: GROUND, color: INK }}
    >
      {/* Desktop stage. The section (not the stage) carries the white, so the
          pin spacer ScrollTrigger inserts paints white rather than the
          charcoal of the block this sits in. */}
      <div
        ref={stageRef}
        className="relative hidden h-screen w-full overflow-hidden md:block"
      >
        {/* Photos, one per half, clipped so the zoomed one can't reach across
            into its neighbour's half. Only the first two are visible to begin
            with; the rest are swapped in under the panel as it passes. */}
        {items.map((project, i) => (
          <div
            key={project.id}
            data-frame
            className={`absolute inset-y-0 w-1/2 overflow-hidden ${
              photoSide(i) === "left" ? "left-0" : "right-0"
            } ${i >= 2 ? "invisible opacity-0" : ""}`}
          >
            <div data-photo className="absolute inset-0">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="50vw"
                className="object-cover"
                style={{ objectPosition: project.imagePosition ?? "center" }}
              />
            </div>
          </div>
        ))}

        {/* The white. Full width, slid by half its width one way or the other. */}
        <div
          ref={panelRef}
          className="absolute inset-0 z-10 will-change-transform"
          style={{ backgroundColor: GROUND }}
        />

        {/* What the block says before anything is revealed. */}
        <div
          ref={titleRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-10 text-center"
        >
          <h2 className="glitch-text text-[#111113]">
            <GlitchText
              text={INTRO}
              breakAfter={INTRO_BREAK_AFTER}
              active={ready}
              play={playIntro}
              onComplete={onIntroComplete}
            />
          </h2>
        </div>

        {/* Words, one block per project, on the half the photo isn't. Spread
            top to bottom so the half reads as a page rather than a caption. */}
        {items.map((project, i) => (
          <ProjectCopy
            key={project.id}
            project={project}
            index={i}
            total={items.length}
            dataCopy
            className={`absolute inset-y-0 z-20 flex w-1/2 flex-col justify-between px-10 pb-14 pt-28 opacity-0 lg:px-16 xl:px-24 ${
              photoSide(i) === "left" ? "right-0" : "left-0"
            }`}
          />
        ))}
      </div>

      {/* Mobile: no halves to slide, so the same copy stacks under each photo. */}
      <div ref={mobileRef} className="px-6 pb-24 pt-20 md:hidden">
        <h2 className="glitch-text !text-left text-[#111113]">
          <GlitchText text={INTRO} active={ready} />
        </h2>
        <div className="mt-14 space-y-20">
          {items.map((project, i) => (
            <article key={project.id} data-card>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: project.imagePosition ?? "center" }}
                />
              </div>
              <ProjectCopy
                project={project}
                index={i}
                total={items.length}
                className="mt-8 flex flex-col gap-8"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
