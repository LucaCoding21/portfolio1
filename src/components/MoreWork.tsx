"use client";

/**
 * The bridge from the four featured works to the full list, above How Do We
 * Do It. It opens with the outline arrow button to the work page. Two
 * rows of site reels run through the middle in opposite directions, every
 * reel from /work split between them, and they take their speed from the
 * scroll: coast at rest, rush when you scroll, reverse when you scroll back.
 * Then breathing room and the close: a line about the free home page design
 * and its button.
 *
 * The rows don't duplicate their cards to loop: each card is moved on its
 * own and wraps from one end of the row to the other (as ClientWall does),
 * so there is one video per reel. Posters load as the section nears; a reel
 * downloads only once it first comes on screen and plays only while visible.
 *
 * The line under the title is the free sample page's opening line, word
 * for word, and the closing line answers the reels (both Oct 22 2026).
 *
 * Reduced motion: the rows sit still and show their posters.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { WORK_ITEMS } from "@/data/workGallery";
import ArrowCta from "@/components/ArrowCta";
import { FREE_DESIGN_URL } from "@/data/freeDesign";
import s from "./MoreWork.module.css";

gsap.registerPlugin(ScrollTrigger);

/* Every reel on /work, in its order, dealt alternately into the two rows so
   each gets a share of the lead projects. */
const REELS = WORK_ITEMS.filter((item): item is (typeof WORK_ITEMS)[number] & { video: string } => !!item.video);
const ROWS = [REELS.filter((_, i) => i % 2 === 0), REELS.filter((_, i) => i % 2 === 1)];

/* At rest a row moves one card width every this many seconds, and the most a
   fast scroll can multiply that. */
const SECONDS_PER_CARD = 16;
const MAX_TIMESCALE = 1.5;

function Row({ reels, reverse }: { reels: typeof REELS; reverse?: boolean }) {
  return (
    <div className={s.row} data-row data-reverse={reverse || undefined}>
      <div className={s.track}>
        {reels.map((item) => (
          <div key={item.id} className={s.cell} data-cell>
            <video
              data-reel
              data-poster={item.poster}
              src={item.video}
              muted
              loop
              playsInline
              preload="none"
              aria-label={`${item.name} website`}
              className={s.video}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MoreWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("[data-reel]"));

    /* Rows: each card sits at i * W in the flow and is shifted so it lands
       at its wrapped place, (i * W + offset) kept within [-W, total - W). */
    const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-row]")).map((row) => {
      const cells = Array.from(row.querySelectorAll<HTMLElement>("[data-cell]"));
      const r = {
        dir: row.dataset.reverse === "true" ? 1 : -1,
        offset: 0,
        W: 0,
        wrap: (v: number) => v,
        measure() {
          r.W = cells.length > 1 ? cells[1].offsetLeft - cells[0].offsetLeft : cells[0]?.offsetWidth ?? 0;
          r.wrap = gsap.utils.wrap(-r.W, r.W * (cells.length - 1));
        },
        render() {
          cells.forEach((cell, i) => {
            const x = r.wrap(i * r.W + r.offset) - i * r.W;
            cell.style.transform = `translate3d(${x}px, 0, 0)`;
          });
        },
      };
      return r;
    });
    const measure = () => rows.forEach((r) => (r.measure(), r.render()));
    measure();
    window.addEventListener("resize", measure);

    /* Posters once the section is about a screen away. */
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        videos.forEach((v) => (v.poster = v.dataset.poster ?? ""));
        near.disconnect();
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(section);

    if (reduce) {
      return () => {
        window.removeEventListener("resize", measure);
        near.disconnect();
      };
    }

    /* Each reel plays while it is on screen, or about to slide on. */
    const visible = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }),
      { rootMargin: "0px 15%" }
    );
    videos.forEach((v) => visible.observe(v));

    /* The drift runs on the ticker while the section is near the screen. */
    const speed = { ts: 1 };
    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      rows.forEach((r) => {
        r.offset += (r.dir * speed.ts * dt * r.W) / SECONDS_PER_CARD;
        r.render();
      });
    };
    let running = false;
    const onScreen = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) gsap.ticker.add(tick);
      if (!e.isIntersecting && running) gsap.ticker.remove(tick);
      running = e.isIntersecting;
    });
    onScreen.observe(section);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // px/s of scroll, mapped to a speed multiplier; sign follows direction.
          const v = self.getVelocity();
          const scale = gsap.utils.clamp(-MAX_TIMESCALE, MAX_TIMESCALE, 1 + v / 1800);
          const target = v < 0 ? Math.min(-1, scale) : Math.max(1, scale);
          gsap.to(speed, { ts: target, duration: 0.2, overwrite: true });
          // Then ease back to a forward coast.
          gsap.to(speed, { ts: 1, duration: 1.4, ease: "power2.out", delay: 0.2 });
        },
      });
    }, section);

    return () => {
      window.removeEventListener("resize", measure);
      near.disconnect();
      visible.disconnect();
      onScreen.disconnect();
      gsap.ticker.remove(tick);
      gsap.killTweensOf(speed);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.wrap} aria-label="More of our work">
      <div className={s.head}>
        <ArrowCta href="/work" outline>
          See all projects
        </ArrowCta>
      </div>

      <div className={s.titleBlock}>
        <h2 className={s.title}>
          Get your free
          <br />
          homepage sample
        </h2>
        <p className={s.sub}>
          Answer a few questions and we&rsquo;ll study your competitors, then
          design your new home page for free.
        </p>
      </div>

      <div className={s.rows}>
        <Row reels={ROWS[0]} />
        <Row reels={ROWS[1]} reverse />
      </div>

      <div className={s.foot} data-track="more-work">
        <p className={`${s.sub} ${s.footCopy}`}>
          Like what you see? We&rsquo;ll make one for your business, ready
          within 3 days.
        </p>
        <ArrowCta href={FREE_DESIGN_URL}>Free homepage sample</ArrowCta>
      </div>
    </section>
  );
}
