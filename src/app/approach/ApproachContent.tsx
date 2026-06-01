"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FAQ from "./FAQ";

gsap.registerPlugin(ScrollTrigger);

type Phase = {
  num: string;
  name: string;
  summary: string;
  body: string;
  proof?: {
    quote: string;
    kpi: string;
    author: string;
    role: string;
    avatar: string;
    url: string;
  };
};

const PHASES: Phase[] = [
  {
    num: "01",
    name: "Research",
    summary: "We study your market before we design anything.",
    body: "We do the competitor research ourselves: who's actually winning customers in your industry, what's working on their sites, and what's supporting or hurting yours. The design starts from what we find, not a guess.",
  },
  {
    num: "02",
    name: "Kickoff",
    summary: "One call to lock how it looks and what it has to do.",
    body: "We bring what we found in the research, you bring your brand, voice, and goals, and in one call we lock the direction. From there the site has one job we both agreed on, and it has to look like something you're proud to send people to.",
    proof: {
      quote: "I landed a $7000 job this morning because of the website. I didn't even advertise it.",
      kpi: "~$40k pipeline in 3 months",
      author: "Taylor Paige",
      role: "Founder, WrapCity",
      avatar: "/wrapcity-headshot-v3.webp",
      url: "https://wrapcity.co/",
    },
  },
  {
    num: "03",
    name: "Design",
    summary: "Every section earns the next scroll.",
    body: "Our lead designer comes from UI/UX, and she pressure-tests every decision: where it sits, how it moves, and what the page actually gains from it. Most local and established businesses get template work. We bring them the kind of design that usually only big companies get.",
    proof: {
      quote: "Best designers I've worked with, no exaggeration.",
      kpi: "+21% inquiries in 3 months",
      author: "Israel Njagih",
      role: "Owner, Njagih Studios",
      avatar: "/Njagih/njagih-headshot-v2.webp",
      url: "https://njagihstudios.com/",
    },
  },
  {
    num: "04",
    name: "Build & launch",
    summary: "Built in Next.js and GSAP. A 95+ speed score on nearly every site, never below 90.",
    body: "We handle all the technical SEO, so you show up when someone searches your name or your niche locally. And the switch, the part most owners worry about, is painless: no downtime, nothing breaks for your customers, and we handle the whole cutover while you do nothing. We're on call all of launch day if anything needs a fix.",
    proof: {
      quote: "After 5 years in real estate, this is the first website I'm actually proud to share with clients.",
      kpi: "Paid for itself in 3 weeks",
      author: "Nancy Tran",
      role: "Realtor, Grand Central Realty",
      avatar: "/nancy-headshot.webp",
      url: "https://nancytranrealtor.com/",
    },
  },
  {
    num: "05",
    name: "Post-launch support",
    summary: "Once you're live, the whole site is on us.",
    body: "We don't disappear after launch. We watch the site in the background, no reminders to manage on your end, and we only reach out when there's an update actually worth making. If it's ever not pulling its weight, we audit it together and figure out the fix.",
  },
];

// Claude reference styled to match the case study (colored + icon).
function ClaudeMention() {
  return (
    <a
      href="https://claude.ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Claude by Anthropic"
      className="inline-flex items-center gap-1.5 text-[#cc785c] font-medium align-[-0.05em] whitespace-nowrap"
    >
      <img
        src="/claude123.svg"
        alt=""
        aria-hidden="true"
        className="h-[0.95em] w-[0.95em]"
      />
      Claude
    </a>
  );
}

// ---------- Page ----------

export default function ApproachContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const processIntroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Hero mount sequence
      gsap.from(".hero-title", {
        opacity: 0,
        y: 32,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.08,
      });
      gsap.from(".hero-lede", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.22,
      });
      gsap.from(".hero-scroll", {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.5,
      });

      // Hand-drawn underline draws itself in, matching the homepage hero
      const underline = root.querySelector<SVGPathElement>(".hero-underline");
      if (underline) {
        const length = underline.getTotalLength();
        gsap.set(underline, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(underline, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.5,
        });
      }

      // Continuous gentle bob on the scroll cue
      gsap.to(".hero-scroll svg", {
        y: 4,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });

      // Hero blurs + fades as the next section scrolls over it
      gsap.to(".hero-sticky", {
        filter: "blur(18px)",
        opacity: 0.35,
        scale: 0.96,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".hero-sticky",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Section eyebrows + headlines + ledes — generic .reveal
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
      reveals.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Process intro — each line rises from below its mask
      const intro = processIntroRef.current;
      if (intro) {
        const lines = intro.querySelectorAll(".process-line");
        gsap.from(lines, {
          yPercent: 100,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: intro, start: "top 85%", once: true },
        });
      }

      // Phases — each row gets its own distinct entrance
      const phaseRows = gsap.utils.toArray<HTMLElement>(".phase-row");
      phaseRows.forEach((row, i) => {
        const num = row.querySelector(".phase-num");
        const name = row.querySelector(".phase-name");
        const summary = row.querySelector(".phase-summary");
        const body = row.querySelector(".phase-body");
        const text = [name, summary, body];

        // Number + text animate in once and stay put.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });

        // Only the SVG diagram loops: play, hold 3s, replay.
        const makeVisualLoop = (breathe = 3) =>
          gsap.timeline({
            repeat: -1,
            repeatDelay: breathe,
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              toggleActions: "play pause resume pause",
            },
          });

        switch (i) {
          case 0: {
            // Audit — measured slide from the left, text rises in sequence,
            // then the wireframe assembles + audit marks draw in
            tl.from(num, {
              opacity: 0,
              x: -60,
              duration: 1.0,
              ease: "power3.out",
            }).from(
              text,
              {
                opacity: 0,
                y: 28,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.14,
              },
              "-=0.65",
            );

            const visual = row.querySelector(".phase-visual");
            if (visual) {
              const frameParts = visual.querySelectorAll(".audit-frame > *");
              const blocks = visual.querySelectorAll(".audit-block");
              const marks =
                visual.querySelectorAll<SVGPathElement>(".audit-mark");
              const note = visual.querySelector(".audit-note");
              const vtl = makeVisualLoop(8);

              vtl.from(
                frameParts,
                {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.out",
                  stagger: 0.04,
                },
              ).from(
                blocks,
                {
                  opacity: 0,
                  y: 6,
                  duration: 0.4,
                  ease: "power3.out",
                  stagger: 0.04,
                },
                "-=0.5",
              );

              marks.forEach((mark) => {
                const length = mark.getTotalLength();
                gsap.set(mark, {
                  strokeDasharray: length,
                  strokeDashoffset: length,
                });
              });

              vtl.to(
                marks,
                {
                  strokeDashoffset: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  stagger: 0.18,
                },
                "-=0.2",
              );

              if (note) {
                vtl.from(
                  note,
                  {
                    opacity: 0,
                    y: 4,
                    duration: 0.5,
                    ease: "power2.out",
                  },
                  "-=0.3",
                );
              }
            }
            break;
          }

          case 1: {
            // Kickoff — number drops from above, text drifts up-and-in,
            // then the moodboard assembles + checklist fills in
            tl.from(num, {
              opacity: 0,
              y: -90,
              duration: 1.0,
              ease: "power4.out",
            }).from(
              text,
              {
                opacity: 0,
                y: 30,
                x: -22,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.14,
              },
              "-=0.6",
            );

            const visual = row.querySelector(".phase-visual");
            if (visual) {
              const frameParts = visual.querySelectorAll(".kickoff-frame > *");
              const refs = visual.querySelectorAll(".kickoff-ref");
              const checkRows =
                visual.querySelectorAll(".kickoff-checklist > .kickoff-row");
              const marks =
                visual.querySelectorAll<SVGPathElement>(".kickoff-mark");
              const vtl = makeVisualLoop(10);

              vtl.from(
                frameParts,
                {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.out",
                  stagger: 0.04,
                },
              );

              // Reference cards pop in with a slight scale (rotation preserved by outer <g>)
              vtl.from(
                refs,
                {
                  opacity: 0,
                  scale: 0.85,
                  y: 12,
                  transformOrigin: "center center",
                  duration: 0.55,
                  ease: "back.out(1.5)",
                  stagger: 0.12,
                },
                "-=0.5",
              );

              // Kickoff call bubble pops in like a sticker being pinned on
              const call = visual.querySelector(".kickoff-call");
              if (call) {
                vtl.from(
                  call,
                  {
                    opacity: 0,
                    scale: 0.55,
                    y: -10,
                    transformOrigin: "left bottom",
                    duration: 0.6,
                    ease: "back.out(1.8)",
                  },
                  "-=0.2",
                );
              }

              vtl.from(
                checkRows,
                {
                  opacity: 0,
                  x: -10,
                  duration: 0.4,
                  ease: "power3.out",
                  stagger: 0.07,
                },
                "-=0.3",
              );

              marks.forEach((mark) => {
                const length = mark.getTotalLength();
                gsap.set(mark, {
                  strokeDasharray: length,
                  strokeDashoffset: length,
                });
              });
              vtl.to(
                marks,
                {
                  strokeDashoffset: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.18,
                },
                "-=0.2",
              );
            }
            break;
          }

          case 2: {
            // Design — number scales in with a slight tilt, text follows softly
            tl.from(num, {
              opacity: 0,
              scale: 0.55,
              rotate: -6,
              transformOrigin: "left center",
              duration: 1.1,
              ease: "back.out(1.5)",
            })
              .from(
                name,
                {
                  opacity: 0,
                  y: 24,
                  duration: 0.7,
                  ease: "power3.out",
                },
                "-=0.7",
              )
              .from(
                [summary, body],
                {
                  opacity: 0,
                  y: 20,
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.2,
                },
                "-=0.45",
              );

            const visual = row.querySelector(".phase-visual");
            if (visual) {
              const frameParts = visual.querySelectorAll(".design-frame > *");
              const layoutBlocks = visual.querySelectorAll(".design-layout > *");
              const ghost = visual.querySelector(".design-ghost");
              const card = visual.querySelector(".design-card");
              const handles = visual.querySelectorAll(".design-handles > *");
              const cursor = visual.querySelector<SVGGElement>(".design-cursor");

              // Card starts at the ghost (left) position. Cursor approaches it,
              // grabs, drags it to its final (right) position, then handles snap in.
              const startX = -140; // card offset from final position
              const startY = 20;

              // Cursor base translate in the SVG is (208, 158). We want the
              // cursor TIP to land inside the card at both grab and drop.
              // Card final bounds: x 170-256, y 140-186 → aim for ~(225, 165)
              //   offset = (17, 7)
              // Card start bounds: shift by (startX, startY) = (-140, 20)
              //   → aim for ~(85, 185), offset = (-123, 27)
              const grabX = -123;
              const grabY = 27;
              const dropX = 17;
              const dropY = 7;

              const vtl = makeVisualLoop();

              // Reset to the pre-drag state at the top of every loop so the
              // grab-and-drag replays cleanly.
              vtl.set(card, { x: startX, y: startY, scale: 1 })
                .set(handles, { opacity: 0, scale: 0.6, transformOrigin: "center center" })
                .set(ghost, { opacity: 0 })
                .set(cursor, { x: grabX - 50, y: grabY - 40, opacity: 0 });

              vtl
                .from(
                  frameParts,
                  { opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 },
                )
                .from(
                  layoutBlocks,
                  { opacity: 0, y: 6, duration: 0.4, ease: "power3.out", stagger: 0.05 },
                  "-=0.5",
                )
                .to(ghost, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.2")
                // Cursor approaches and lands on the card
                .to(
                  cursor,
                  { x: grabX, y: grabY, opacity: 1, duration: 0.5, ease: "power2.out" },
                  "-=0.2",
                )
                // Brief "grab" pinch — completes before the drag starts so it
                // doesn't fight the drag's scale tween
                .to(card, {
                  scale: 0.97,
                  transformOrigin: "center center",
                  duration: 0.12,
                  ease: "power2.out",
                })
                .to(card, {
                  scale: 1,
                  duration: 0.18,
                  ease: "power2.inOut",
                })
                // Cursor + card drag together. Same duration + same easing on
                // both tweens, started in parallel, keeps the cursor tip locked
                // to the same point on the card the whole way across.
                .to(cursor, { x: dropX, y: dropY, duration: 1.0, ease: "power2.inOut" })
                .to(card, { x: 0, y: 0, duration: 1.0, ease: "power2.inOut" }, "<")
                // Selection handles snap in
                .to(
                  handles,
                  { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.04 },
                  "-=0.05",
                );
            }
            break;
          }

          case 3: {
            // Build & launch — number reveals upward through a clip mask, text slides from the right
            tl.from(num, {
              opacity: 0,
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.out",
            }).from(
              text,
              {
                opacity: 0,
                x: 40,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.12,
              },
              "-=0.7",
            );

            const visual = row.querySelector(".phase-visual");
            if (visual) {
              const frameParts = visual.querySelectorAll(".build-frame > *");
              const codeLines = visual.querySelectorAll(".build-code > *");
              const gaugeTrack = visual.querySelector(".build-gauge-track");
              const gauge = visual.querySelector<SVGCircleElement>(".build-gauge");
              const gaugeLabel = visual.querySelector(".build-gauge-label");
              const score = visual.querySelector<HTMLElement>(".build-score");
              const badge = visual.querySelector(".build-badge");
              const vtl = makeVisualLoop(10);

              vtl.from(
                frameParts,
                { opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 },
              ).from(
                codeLines,
                { opacity: 0, x: -10, duration: 0.35, ease: "power2.out", stagger: 0.09 },
                "-=0.55",
              );

              if (gauge) {
                const length = 2 * Math.PI * 38; // r=38
                gsap.set(gauge, {
                  strokeDasharray: length,
                  strokeDashoffset: length,
                });
                vtl.from(
                  [gaugeTrack, gaugeLabel],
                  { opacity: 0, duration: 0.4, ease: "power2.out", stagger: 0.06 },
                  "-=0.5",
                ).to(
                  gauge,
                  { strokeDashoffset: length * 0.03, duration: 1.2, ease: "power2.out" },
                  "-=0.3",
                );
              }

              if (score) {
                const counter = { v: 0 };
                vtl.to(
                  counter,
                  {
                    v: 100,
                    duration: 1.2,
                    ease: "power2.out",
                    onUpdate: () => {
                      score.textContent = String(Math.round(counter.v));
                    },
                  },
                  "<",
                );
              }

              if (badge) {
                vtl.from(
                  badge,
                  {
                    opacity: 0,
                    scale: 0.6,
                    y: -6,
                    transformOrigin: "center center",
                    duration: 0.5,
                    ease: "back.out(1.8)",
                  },
                  "-=0.3",
                );
              }
            }
            break;
          }

          case 4:
          default: {
            // Retainer — number resolves out of a blur, text settles slowly
            tl.from(num, {
              opacity: 0,
              filter: "blur(22px)",
              scale: 1.08,
              duration: 1.3,
              ease: "power2.out",
            }).from(
              text,
              {
                opacity: 0,
                y: 26,
                duration: 1.0,
                ease: "power2.out",
                stagger: 0.22,
              },
              "-=0.85",
            );

            const visual = row.querySelector(".phase-visual");
            if (visual) {
              const frameParts = visual.querySelectorAll(".retainer-frame > *");
              const grid = visual.querySelectorAll(".retainer-grid > *");
              const line = visual.querySelector<SVGPathElement>(".retainer-line");
              const fill = visual.querySelector(".retainer-fill");
              const dots = visual.querySelectorAll(".retainer-dots > *");
              const callout = visual.querySelector(".retainer-callout");
              const arrows = visual.querySelectorAll<SVGPathElement>(".retainer-arrow");
              const vtl = makeVisualLoop();

              vtl.from(
                frameParts,
                { opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 },
              ).from(
                grid,
                { opacity: 0, duration: 0.3, ease: "power2.out", stagger: 0.05 },
                "-=0.6",
              );

              if (line) {
                const length = line.getTotalLength();
                gsap.set(line, {
                  strokeDasharray: length,
                  strokeDashoffset: length,
                });
                vtl.to(
                  line,
                  { strokeDashoffset: 0, duration: 1.3, ease: "power2.out" },
                  "-=0.3",
                );
              }

              if (fill) {
                vtl.from(
                  fill,
                  { opacity: 0, duration: 0.7, ease: "power2.out" },
                  "-=0.7",
                );
              }

              vtl.from(
                dots,
                {
                  opacity: 0,
                  scale: 0.4,
                  transformOrigin: "center center",
                  duration: 0.35,
                  ease: "back.out(2)",
                  stagger: 0.1,
                },
                "-=0.9",
              );

              if (arrows.length) {
                arrows.forEach((arrow) => {
                  const length = arrow.getTotalLength();
                  gsap.set(arrow, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                  });
                });
                vtl.to(
                  arrows,
                  {
                    strokeDashoffset: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.08,
                  },
                  "-=0.2",
                );
              }

              if (callout) {
                vtl.from(
                  callout,
                  {
                    opacity: 0,
                    scale: 0.55,
                    y: -8,
                    transformOrigin: "left bottom",
                    duration: 0.55,
                    ease: "back.out(1.8)",
                  },
                  "-=0.25",
                );
              }
            }
            break;
          }
        }
      });

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-white text-black">
      {/* ============ HERO ============ */}
      <section className="hero-sticky sticky top-0 z-0 h-screen flex flex-col items-center justify-center px-6 md:px-10 pt-32 md:pt-40 pb-20 overflow-hidden text-white isolate">
        {/* Background video */}
        <video
          poster="/approach-hero.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/approach-hero-v2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/8" />
        <div className="relative z-10 max-w-[1280px] mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="hero-title font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,8vw,5.5rem)] tracking-tight leading-[0.9] max-w-[16ch] text-white">
            How do we{" "}
            <span className="relative inline-block">
              do it?
              <svg
                className="absolute -bottom-[0.1em] left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "0.18em", overflow: "visible" }}
              >
                <path
                  className="hero-underline"
                  d="M2 8 C40 2, 80 2, 100 6 S160 12, 198 4"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p
            className="hero-lede mt-4 md:mt-6 text-base md:text-lg text-white font-semibold tracking-wide font-[family-name:var(--font-geist-sans)] max-w-[52ch]"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.8)" }}
          >
            The exact steps we take, from the first competitor audit to the
            months after launch.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
          aria-label="Scroll to content"
          className="hero-scroll relative z-10 mt-12 md:mt-16 group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 text-white/75 hover:text-white hover:border-white transition-colors duration-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-y-[2px]"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="6 13 12 19 18 13" />
          </svg>
        </button>
      </section>

      {/* ============ PHASES — editorial ============ */}
      <section
        id="phases"
        className="relative z-10 bg-white px-6 md:px-10 pt-24 md:pt-40 pb-12 md:pb-24"
      >
        <div className="max-w-[1600px] mx-auto">
          <div ref={processIntroRef} className="mb-20 md:mb-28">
            <span className="block overflow-hidden mb-5">
              <span className="process-line block text-[11px] md:text-xs uppercase tracking-[0.26em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)]">
                The process
              </span>
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.4rem)] tracking-tight leading-[1.05] max-w-[32ch]">
              <span className="block overflow-hidden pb-[0.12em]">
                <span className="process-line block">
                  This is how we do it, so you know
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <span className="process-line block">
                  <span className="italic font-[family-name:var(--font-cormorant)] font-medium">
                    exactly
                  </span>{" "}
                  what you&apos;re paying for.
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col">
            {PHASES.map((phase, i) => (
              <article
                key={phase.num}
                className="phase-row grid grid-cols-12 gap-6 md:gap-10 py-16 md:py-24 border-t border-black/10"
              >
                <div className="col-span-12 md:col-span-3">
                  <p className="phase-num font-[family-name:var(--font-outfit)] font-bold text-[clamp(5rem,12vw,9rem)] text-black/[0.08] leading-none tracking-tight select-none">
                    {phase.num}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="phase-name font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-[1.1] mb-6">
                    {phase.name}
                  </h3>
                  <p className="phase-summary text-lg md:text-xl text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] mb-5 max-w-[48ch]">
                    {phase.summary}
                  </p>
                  <p className="phase-body text-base text-black/55 leading-relaxed font-[family-name:var(--font-geist-sans)] max-w-[60ch]">
                    {phase.body}
                  </p>
                  {phase.proof && (
                    <figure className="reveal mt-8 max-w-[46ch]">
                      <div className="flex gap-3">
                        <img
                          src={phase.proof.avatar}
                          alt={phase.proof.author}
                          className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5 bg-black/5"
                        />
                        <div className="min-w-0 flex-1">
                          <blockquote className="bg-black/[0.05] px-4 py-2.5 rounded-2xl rounded-tl-md">
                            <p className="text-[13.5px] text-black/75 leading-snug font-[family-name:var(--font-geist-sans)]">
                              {phase.proof.quote}
                            </p>
                          </blockquote>
                          <figcaption className="mt-1.5 ml-2 text-[11px] leading-snug text-black/45 font-[family-name:var(--font-geist-sans)]">
                            <span className="font-medium text-black/60">
                              {phase.proof.author}
                            </span>{" "}
                            · {phase.proof.role}
                          </figcaption>
                        </div>
                      </div>

                      {/* The outcome — kept in the homepage's neutral palette,
                          but weighted so it reads clearly. */}
                      <div className="mt-4 ml-14">
                        <p className="flex items-center gap-2 text-[15px] font-[family-name:var(--font-outfit)] font-bold text-black tracking-tight">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-black/45 shrink-0"
                            aria-hidden="true"
                          >
                            <polyline points="3 17 9 11 13 15 21 7" />
                            <polyline points="15 7 21 7 21 13" />
                          </svg>
                          {phase.proof.kpi}
                        </p>
                        <a
                          href={phase.proof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-view group mt-4 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium text-white hover:bg-black/80 transition-colors"
                        >
                          View their site
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          >
                            &rarr;
                          </span>
                        </a>
                      </div>
                    </figure>
                  )}
                </div>
                {i === 0 && (
                  <div className="phase-visual col-span-12 md:col-span-5 flex items-start justify-center md:-mt-4">
                    <div className="w-full max-w-[520px]">
                      <svg
                        viewBox="0 0 320 260"
                        className="w-full h-auto"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Browser frame */}
                        <g className="audit-frame">
                          <rect
                            x="16"
                            y="22"
                            width="288"
                            height="206"
                            rx="8"
                            stroke="black"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <line
                            x1="16"
                            y1="44"
                            x2="304"
                            y2="44"
                            stroke="black"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                          />
                          <circle cx="28" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="38" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="48" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                        </g>

                        {/* Site content blocks */}
                        <g fill="black" fillOpacity="0.07">
                          <rect className="audit-block" x="30" y="58" width="60" height="6" rx="2" />
                          <rect className="audit-block" x="264" y="56" width="26" height="10" rx="2" />
                          <rect className="audit-block" x="30" y="84" width="186" height="14" rx="3" />
                          <rect className="audit-block" x="30" y="104" width="140" height="14" rx="3" />
                          <rect className="audit-block" x="30" y="128" width="200" height="5" rx="1" />
                          <rect className="audit-block" x="30" y="138" width="160" height="5" rx="1" />
                          <rect className="audit-block" x="30" y="156" width="62" height="16" rx="3" />
                          <rect className="audit-block" x="30" y="190" width="118" height="6" rx="1" />
                          <rect className="audit-block" x="30" y="202" width="96" height="6" rx="1" />
                        </g>

                        {/* Lime loop around weak CTA */}
                        <path
                          className="audit-mark"
                          d="M 24 170 C 22 148, 96 144, 100 162 C 102 180, 26 186, 24 170 Z"
                          stroke="#CDFF50"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />

                        {/* Lime underline beneath hero headline */}
                        <path
                          className="audit-mark"
                          d="M 30 122 Q 90 126 210 122"
                          stroke="#CDFF50"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Arrow pointing at CTA */}
                        <path
                          className="audit-mark"
                          d="M 200 174 Q 160 190 115 170"
                          stroke="black"
                          strokeOpacity="0.55"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                        <path
                          className="audit-mark"
                          d="M 121 164 L 113 169 L 121 174"
                          stroke="black"
                          strokeOpacity="0.55"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Italic margin note */}
                        <text
                          className="audit-note"
                          x="202"
                          y="180"
                          fill="black"
                          fillOpacity="0.6"
                          fontStyle="italic"
                          fontSize="13"
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          weak CTA?
                        </text>
                      </svg>
                    </div>
                  </div>
                )}
                {i === 1 && (
                  <div className="phase-visual col-span-12 md:col-span-5 flex items-start justify-center md:-mt-4">
                    <div className="w-full max-w-[520px]">
                      <svg
                        viewBox="0 -22 320 282"
                        className="w-full h-auto"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Board frame + corner pins */}
                        <g className="kickoff-frame">
                          <rect
                            x="16"
                            y="22"
                            width="288"
                            height="206"
                            rx="8"
                            stroke="black"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <circle cx="28" cy="34" r="2.5" fill="black" fillOpacity="0.18" />
                          <circle cx="292" cy="34" r="2.5" fill="black" fillOpacity="0.18" />
                          <circle cx="28" cy="216" r="2.5" fill="black" fillOpacity="0.18" />
                          <circle cx="292" cy="216" r="2.5" fill="black" fillOpacity="0.18" />
                        </g>

                        {/* Reference cards — moodboard */}
                        <g transform="rotate(-2.5 75 80)">
                          <g className="kickoff-ref">
                            <rect
                              x="30"
                              y="46"
                              width="86"
                              height="68"
                              rx="3"
                              fill="black"
                              fillOpacity="0.06"
                              stroke="black"
                              strokeOpacity="0.12"
                              strokeWidth="0.8"
                            />
                            <rect x="40" y="56" width="48" height="3" rx="1" fill="black" fillOpacity="0.18" />
                            <rect x="40" y="64" width="36" height="3" rx="1" fill="black" fillOpacity="0.14" />
                          </g>
                        </g>
                        <g transform="rotate(1.8 162 80)">
                          <g className="kickoff-ref">
                            <rect
                              x="122"
                              y="46"
                              width="80"
                              height="68"
                              rx="3"
                              fill="black"
                              fillOpacity="0.16"
                              stroke="black"
                              strokeOpacity="0.12"
                              strokeWidth="0.8"
                            />
                          </g>
                        </g>
                        <g transform="rotate(-1.2 250 80)">
                          <g className="kickoff-ref">
                            <rect
                              x="210"
                              y="46"
                              width="80"
                              height="68"
                              rx="3"
                              fill="#CDFF50"
                              fillOpacity="0.55"
                              stroke="black"
                              strokeOpacity="0.15"
                              strokeWidth="0.8"
                            />
                          </g>
                        </g>

                        {/* Divider */}
                        <line
                          x1="30"
                          y1="128"
                          x2="290"
                          y2="128"
                          stroke="black"
                          strokeOpacity="0.1"
                          strokeWidth="0.8"
                        />

                        {/* Alignment checklist — lime row at top */}
                        <g className="kickoff-checklist">
                          <g className="kickoff-row">
                            <circle cx="40" cy="148" r="3.8" fill="#CDFF50" stroke="#CDFF50" strokeWidth="1" />
                            <rect x="52" y="145" width="180" height="6" rx="2" fill="black" fillOpacity="0.13" />
                          </g>
                          <g className="kickoff-row">
                            <circle cx="40" cy="170" r="3.8" stroke="black" strokeOpacity="0.3" strokeWidth="1" fill="white" />
                            <rect x="52" y="167" width="148" height="6" rx="2" fill="black" fillOpacity="0.09" />
                          </g>
                          <g className="kickoff-row">
                            <circle cx="40" cy="192" r="3.8" stroke="black" strokeOpacity="0.3" strokeWidth="1" fill="white" />
                            <rect x="52" y="189" width="206" height="6" rx="2" fill="black" fillOpacity="0.09" />
                          </g>
                          <g className="kickoff-row">
                            <circle cx="40" cy="214" r="3.8" stroke="black" strokeOpacity="0.3" strokeWidth="1" fill="white" />
                            <rect x="52" y="211" width="170" height="6" rx="2" fill="black" fillOpacity="0.09" />
                          </g>
                        </g>

                        {/* Hand-drawn checkmark inside the (top) lime row */}
                        <path
                          className="kickoff-mark"
                          d="M 35.5 148 L 39 151.5 L 45 144.5"
                          stroke="black"
                          strokeOpacity="0.75"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Kickoff call — speech bubble sticker pinned above the board */}
                        <g transform="translate(196 -4) rotate(-6 47 14)">
                          <g className="kickoff-call">
                            <path
                              d="M 4 4 Q 4 0 8 0 L 90 0 Q 94 0 94 4 L 94 20 Q 94 24 90 24 L 30 24 L 22 30 L 26 24 L 8 24 Q 4 24 4 20 Z"
                              fill="#CDFF50"
                              fillOpacity="0.6"
                              stroke="black"
                              strokeOpacity="0.2"
                              strokeWidth="0.8"
                            />
                            <text
                              x="20"
                              y="17"
                              fontSize="11"
                              fill="black"
                              fillOpacity="0.8"
                              fontStyle="italic"
                              style={{ fontFamily: "var(--font-cormorant), serif" }}
                            >
                              kickoff call
                            </text>
                          </g>
                        </g>

                      </svg>
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="phase-visual col-span-12 md:col-span-5 flex items-start justify-center md:-mt-4">
                    <div className="w-full max-w-[520px]">
                      <svg
                        viewBox="0 0 320 260"
                        className="w-full h-auto"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Figma-style canvas frame */}
                        <g className="design-frame">
                          <rect
                            x="16"
                            y="22"
                            width="288"
                            height="206"
                            rx="8"
                            stroke="black"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <line
                            x1="16"
                            y1="44"
                            x2="304"
                            y2="44"
                            stroke="black"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                          />
                          <circle cx="28" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="38" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="48" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <rect x="260" y="32" width="32" height="10" rx="2" fill="black" fillOpacity="0.08" />
                        </g>

                        {/* Static background layout blocks */}
                        <g className="design-layout" fill="black" fillOpacity="0.07">
                          <rect x="30" y="58" width="120" height="6" rx="2" />
                          <rect x="30" y="72" width="80" height="4" rx="1" />
                          <rect x="170" y="58" width="120" height="50" rx="3" />
                          <rect x="30" y="92" width="120" height="50" rx="3" />
                        </g>

                        {/* Drop target outline (ghost) — where the card lands */}
                        <rect
                          className="design-ghost"
                          x="170"
                          y="140"
                          width="86"
                          height="46"
                          rx="4"
                          stroke="black"
                          strokeOpacity="0.3"
                          strokeWidth="1"
                          strokeDasharray="4 3"
                          fill="none"
                        />

                        {/* Draggable card */}
                        <g className="design-card">
                          <rect
                            x="170"
                            y="140"
                            width="86"
                            height="46"
                            rx="4"
                            fill="#CDFF50"
                            fillOpacity="0.55"
                            stroke="black"
                            strokeOpacity="0.2"
                            strokeWidth="0.8"
                          />
                          <rect x="180" y="150" width="44" height="4" rx="1" fill="black" fillOpacity="0.4" />
                          <rect x="180" y="159" width="62" height="3" rx="1" fill="black" fillOpacity="0.2" />
                          <rect x="180" y="167" width="50" height="3" rx="1" fill="black" fillOpacity="0.2" />
                          <rect x="180" y="175" width="36" height="3" rx="1" fill="black" fillOpacity="0.2" />

                          {/* Selection handles */}
                          <g className="design-handles">
                            <rect x="167" y="137" width="6" height="6" rx="1" fill="white" stroke="#1AA3FF" strokeWidth="1" />
                            <rect x="253" y="137" width="6" height="6" rx="1" fill="white" stroke="#1AA3FF" strokeWidth="1" />
                            <rect x="167" y="183" width="6" height="6" rx="1" fill="white" stroke="#1AA3FF" strokeWidth="1" />
                            <rect x="253" y="183" width="6" height="6" rx="1" fill="white" stroke="#1AA3FF" strokeWidth="1" />
                          </g>
                        </g>

                        {/* Cursor */}
                        <g className="design-cursor">
                          <path
                            d="M 0 0 L 0 14 L 4 11 L 7 17 L 9 16 L 6 10 L 11 10 Z"
                            fill="black"
                            stroke="white"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                            transform="translate(208 158)"
                          />
                        </g>

                      </svg>
                    </div>
                  </div>
                )}
                {i === 3 && (
                  <div className="phase-visual col-span-12 md:col-span-5 flex items-start justify-center md:-mt-4">
                    <div className="w-full max-w-[520px]">
                      <svg
                        viewBox="0 0 320 260"
                        className="w-full h-auto"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Terminal frame */}
                        <g className="build-frame">
                          <rect
                            x="16"
                            y="22"
                            width="288"
                            height="206"
                            rx="8"
                            stroke="black"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <line
                            x1="16"
                            y1="44"
                            x2="304"
                            y2="44"
                            stroke="black"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                          />
                          <circle cx="28" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="38" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <circle cx="48" cy="33" r="2.5" fill="black" fillOpacity="0.2" />
                          <text
                            x="160"
                            y="37"
                            textAnchor="middle"
                            fontSize="8"
                            fill="black"
                            fillOpacity="0.4"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                          >
                            build.log
                          </text>
                        </g>

                        {/* Code / build log lines */}
                        <g
                          className="build-code"
                          fontSize="9"
                          style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
                        >
                          <text x="28" y="66" fill="black" fillOpacity="0.7">
                            $ npm run build
                          </text>
                          <text x="28" y="82" fill="black" fillOpacity="0.5">
                            ▲ next build
                          </text>
                          <text x="28" y="98" fill="black" fillOpacity="0.5">
                            ✓ Compiled successfully
                          </text>
                          <text x="28" y="114" fill="black" fillOpacity="0.5">
                            ✓ Static pages generated
                          </text>
                          <text x="28" y="130" fill="black" fillOpacity="0.5">
                            ✓ SEO 100
                          </text>
                          <text x="28" y="146" fill="black" fillOpacity="0.85" fontWeight="600">
                            ✓ Lighthouse ready
                          </text>
                        </g>

                        {/* Lighthouse-style gauge */}
                        <g transform="translate(230 105)">
                          <circle
                            className="build-gauge-track"
                            r="38"
                            stroke="black"
                            strokeOpacity="0.08"
                            strokeWidth="5"
                            fill="none"
                          />
                          <circle
                            className="build-gauge"
                            r="38"
                            stroke="#CDFF50"
                            strokeWidth="5"
                            fill="none"
                            strokeLinecap="round"
                            transform="rotate(-90)"
                          />
                          <text
                            className="build-score"
                            x="0"
                            y="4"
                            textAnchor="middle"
                            fontSize="22"
                            fontWeight="700"
                            fill="black"
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            100
                          </text>
                          <text
                            className="build-gauge-label"
                            x="0"
                            y="16"
                            textAnchor="middle"
                            fontSize="5"
                            fill="black"
                            fillOpacity="0.5"
                            letterSpacing="0.8"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                          >
                            PERFORMANCE
                          </text>
                        </g>

                        {/* "Ready to ship" badge */}
                        <g className="build-badge" transform="translate(181 192)">
                          <rect
                            x="0"
                            y="0"
                            width="98"
                            height="22"
                            rx="11"
                            fill="black"
                            fillOpacity="0.85"
                          />
                          <text
                            x="49"
                            y="14"
                            textAnchor="middle"
                            fontSize="9"
                            fill="white"
                            letterSpacing="0.5"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                          >
                            ready to ship
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>
                )}
                {i === 4 && (
                  <div className="phase-visual col-span-12 md:col-span-5 flex items-start justify-center md:-mt-4">
                    <div className="w-full max-w-[520px]">
                      <svg
                        viewBox="0 0 320 260"
                        className="w-full h-auto"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Dashboard frame */}
                        <g className="retainer-frame">
                          <rect
                            x="16"
                            y="22"
                            width="288"
                            height="206"
                            rx="8"
                            stroke="black"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <line
                            x1="16"
                            y1="44"
                            x2="304"
                            y2="44"
                            stroke="black"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                          />
                          <text
                            x="28"
                            y="38"
                            fontSize="8"
                            fill="black"
                            fillOpacity="0.55"
                            letterSpacing="1"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                          >
                            CONVERSIONS · LAST 90 DAYS
                          </text>
                        </g>

                        {/* Grid lines */}
                        <g className="retainer-grid" stroke="black" strokeOpacity="0.06" strokeWidth="0.8">
                          <line x1="30" y1="80" x2="290" y2="80" />
                          <line x1="30" y1="120" x2="290" y2="120" />
                          <line x1="30" y1="160" x2="290" y2="160" />
                          <line x1="30" y1="200" x2="290" y2="200" />
                        </g>

                        {/* Area fill under the line */}
                        <path
                          className="retainer-fill"
                          d="M 30 200 L 70 188 L 110 172 L 150 152 L 190 128 L 230 104 L 270 80 L 270 200 L 30 200 Z"
                          fill="#CDFF50"
                          fillOpacity="0.18"
                        />

                        {/* Chart line */}
                        <path
                          className="retainer-line"
                          d="M 30 200 L 70 188 L 110 172 L 150 152 L 190 128 L 230 104 L 270 80"
                          stroke="black"
                          strokeOpacity="0.85"
                          strokeWidth="1.6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data points */}
                        <g className="retainer-dots">
                          <circle cx="30" cy="200" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle cx="70" cy="188" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle cx="110" cy="172" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle cx="150" cy="152" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle cx="190" cy="128" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle cx="230" cy="104" r="2.8" fill="black" fillOpacity="0.55" />
                          <circle
                            cx="270"
                            cy="80"
                            r="4.5"
                            fill="#CDFF50"
                            stroke="black"
                            strokeOpacity="0.7"
                            strokeWidth="1.2"
                          />
                        </g>

                        {/* Arrow from callout to peak point */}
                        <path
                          className="retainer-arrow"
                          d="M 232 68 Q 252 62 267 77"
                          stroke="black"
                          strokeOpacity="0.9"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          className="retainer-arrow"
                          d="M 265 69 L 267 77 L 259 75"
                          stroke="black"
                          strokeOpacity="0.9"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />

                        {/* Lime callout pill */}
                        <g className="retainer-callout" transform="translate(128 50) rotate(-3 52 14)">
                          <rect
                            x="0"
                            y="0"
                            width="104"
                            height="28"
                            rx="14"
                            fill="#CDFF50"
                            fillOpacity="0.75"
                            stroke="black"
                            strokeOpacity="0.2"
                            strokeWidth="0.8"
                          />
                          <text
                            x="52"
                            y="19"
                            textAnchor="middle"
                            fontSize="14"
                            fill="black"
                            fillOpacity="0.9"
                            fontStyle="italic"
                            style={{ fontFamily: "var(--font-cormorant), serif" }}
                          >
                            +38% growth
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI SEARCH ============ */}
      <section className="relative z-10 bg-white px-6 md:px-10 py-20 md:py-32 border-t border-black/[0.06]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5">
            <p className="reveal text-[11px] md:text-xs uppercase tracking-[0.26em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
              AI search
            </p>
            <h2 className="reveal font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.4rem)] tracking-tight leading-[1.05] max-w-[20ch]">
              We build sites that <ClaudeMention /> recommends by name.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="reveal text-lg md:text-xl text-black/70 leading-relaxed font-[family-name:var(--font-geist-sans)] mb-6 max-w-[50ch]">
              More buyers now start in <ClaudeMention /> and ChatGPT than Google.
              They only recommend sites they can actually read, so we build every
              page to be read, understood, and recommended.
            </p>
            <p className="reveal text-base text-black/55 leading-relaxed font-[family-name:var(--font-geist-sans)] mb-8 max-w-[50ch]">
              We rebuilt Innovative Aluminum this way. Two weeks after launch,{" "}
              <ClaudeMention /> was recommending them by name.
            </p>
            <Link
              href="/case-studies/innovative-aluminum"
              className="reveal cursor-view inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium text-black hover:text-[#cc785c] transition-colors"
            >
              Read the case study &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="relative z-10 bg-white px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-[60ch] mb-12 md:mb-16">
            <p className="reveal text-[11px] md:text-xs uppercase tracking-[0.26em] text-black/45 font-medium font-[family-name:var(--font-geist-sans)] mb-5">
              FAQ
            </p>
            <h2 className="reveal font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,4.5vw,3.4rem)] tracking-tight leading-[1.05] mb-6">
              The questions we hear most.
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative z-10 bg-white px-6 md:px-10 pb-32 md:pb-48 pt-12 md:pt-20 border-t border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-8">
              <h2 className="reveal font-[family-name:var(--font-outfit)] font-black uppercase text-[clamp(3rem,8vw,7rem)] tracking-tight leading-[0.95] max-w-[24ch]">
                Let&apos;s build something worth sharing.
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/#contact"
                className="cursor-book reveal inline-flex items-center px-8 py-4 md:px-10 md:py-5 rounded-full bg-black text-white text-sm md:text-base uppercase tracking-[0.18em] font-[family-name:var(--font-outfit)] font-medium hover:bg-[#CDFF50] hover:text-black transition-all duration-300"
              >
                Book a call
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-24 pt-8 border-t border-black/10 flex items-center justify-between text-xs text-black/40 font-[family-name:var(--font-geist-sans)] tracking-wide">
            <span>Cloverfield Studio · 2026</span>
            <Link
              href="/work"
              className="hover:text-black transition-colors cursor-view"
            >
              See the work →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
