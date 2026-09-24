"use client";

/**
 * /work gallery, laid out as a works overview: the eyebrow and headline
 * across the top, then a narrow left column with a vertical filter list
 * (the industries as plain text, the chosen one in ink), and beside it a
 * wide two-column grid of covers
 * with one caption line each: the name and the headline result at the
 * far end, then the line the owner said with their photo and name. The grid/list switch sits as two small words at the top of the
 * right column. In list view the left column stacks above so the rows run
 * the full width.
 *
 * The list is an index: one line per project with its number, the name and
 * industry, then a column with the result as one plain line over a short
 * line about the project, and an arrow that opens the live site.
 * Clicking the line opens the row: the picture enlarges into place under
 * that short line, and the owner's line unfolds under the name. One row is
 * open at a time.
 *
 * Reels play on their own, looping, whenever the card is on screen, and
 * pause off screen. Projects without a reel crossfade to their mockup on
 * hover (fine pointer only).
 *
 * Filter motion (out/in/stagger) comes from revelatio.studio/work. Surfaces are the homepage's: paper ground, ink
 * type, Outfit titles, DM Sans body, Geist for the tracked eyebrow.
 *
 * Phones show the grid five cards at a time: the rest wait behind a
 * "View more" button that lets in five more per tap. A filter starts the
 * count over.
 *
 * PLACEHOLDER: headline copy comes from src/data/workGallery.ts.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import {
  WORK_FILTERS,
  WORK_HEADLINE_LINES,
  WORK_HEADLINE_LINES_SHORT,
  WORK_ITEMS,
  type WorkGalleryItem,
} from "@/data/workGallery";
import s from "./WorkGallery.module.css";

gsap.registerPlugin(CustomEase);

type View = "grid" | "list";

// Webflow's "ease" preset, cubic-bezier(0.25, 0.1, 0.25, 1).
const WF_EASE = CustomEase.create("wfEase", "M0,0 C0.25,0.1 0.25,1 1,1");

// projects-filter.js
const OUT_DURATION_MS = 340;
const IN_DURATION_MS = 520;
const STAGGER_MS = 80;
const TRANSITION_GAP_MS = 70;

// list rows: the body unfolds and the picture enlarges into place
const OPEN_DURATION = 0.6;
const CLOSE_DURATION = 0.4;
const ACCORDION_EASE = "power3.inOut";
const PICTURE_DURATION = 0.9;

// hover reel: the fade-up on enter is slower than the drain on leave
const REEL_IN = 0.7;
const REEL_OUT = 0.35;

const EYEBROW = "Selected work";

// phones: cards shown per step of "View more"
const PHONE_PAGE = 5;

const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ");

function GridIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.8373 5.33398H7.97111C6.51413 5.33398 5.33301 6.5151 5.33301 7.97209V11.8383C5.33301 13.2953 6.51413 14.4764 7.97111 14.4764H11.8373C13.2943 14.4764 14.4754 13.2953 14.4754 11.8383V7.97209C14.4754 6.5151 13.2943 5.33398 11.8373 5.33398Z"
        fill="currentColor"
      />
      <path
        d="M11.8373 17.5273H7.97111C6.51413 17.5273 5.33301 18.7085 5.33301 20.1655V24.0316C5.33301 25.4886 6.51413 26.6697 7.97111 26.6697H11.8373C13.2943 26.6697 14.4754 25.4886 14.4754 24.0316V20.1655C14.4754 18.7085 13.2943 17.5273 11.8373 17.5273Z"
        fill="currentColor"
      />
      <path
        d="M24.0307 5.33398H20.1645C18.7075 5.33398 17.5264 6.5151 17.5264 7.97209V11.8383C17.5264 13.2953 18.7075 14.4764 20.1645 14.4764H24.0307C25.4876 14.4764 26.6688 13.2953 26.6688 11.8383V7.97209C26.6688 6.5151 25.4876 5.33398 24.0307 5.33398Z"
        fill="currentColor"
      />
      <path
        d="M24.0307 17.5273H20.1645C18.7075 17.5273 17.5264 18.7085 17.5264 20.1655V24.0316C17.5264 25.4886 18.7075 26.6697 20.1645 26.6697H24.0307C25.4876 26.6697 26.6688 25.4886 26.6688 24.0316V20.1655C26.6688 18.7085 25.4876 17.5273 24.0307 17.5273Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5.33301"
        y="5.33398"
        width="21.3333"
        height="9.33333"
        rx="1.33333"
        fill="currentColor"
      />
      <rect
        x="5.33301"
        y="17.334"
        width="21.3333"
        height="9.33333"
        rx="1.33333"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* filter animation, ported from projects-filter.js                    */
/* ------------------------------------------------------------------ */

function prepare(el: HTMLElement, mode: "in" | "out") {
  el.style.transition =
    mode === "out"
      ? `opacity ${OUT_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${OUT_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : `opacity ${IN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${IN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  el.style.willChange = "opacity, transform";
}

const filterTimers = new WeakMap<HTMLElement, number>();

function animateListFilter(
  list: HTMLElement,
  shouldShow: (el: HTMLElement) => boolean,
) {
  const items = Array.from(
    list.querySelectorAll<HTMLElement>("[data-filter-item]"),
  );
  if (!items.length) return;
  const visibleNow = items.filter((it) => it.style.display !== "none");

  items.forEach((it) => prepare(it, "out"));
  visibleNow.forEach((it, i) => {
    it.style.transitionDelay = `${i * STAGGER_MS}ms`;
    it.style.opacity = "0";
    it.style.transform = "translateY(6px) scale(0.992)";
  });

  const prev = filterTimers.get(list);
  if (prev) window.clearTimeout(prev);

  const t = window.setTimeout(() => {
    items.forEach((it) => {
      it.style.display = shouldShow(it) ? "" : "none";
    });
    items.forEach((it) => prepare(it, "in"));
    let vi = 0;
    items.forEach((it) => {
      if (it.style.display !== "none") {
        it.style.transitionDelay = `${vi * STAGGER_MS}ms`;
        it.style.opacity = "0";
        it.style.transform = "translateY(10px) scale(0.988)";
        vi += 1;
      } else {
        it.style.transitionDelay = "0ms";
      }
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        items.forEach((it) => {
          if (it.style.display !== "none") {
            it.style.opacity = "1";
            it.style.transform = "translateY(0) scale(1)";
          }
        });
      });
    });
    const totalIn = IN_DURATION_MS + Math.max(0, vi - 1) * STAGGER_MS + 80;
    window.setTimeout(() => {
      items.forEach((it) => {
        it.style.transition = "";
        it.style.transitionDelay = "";
        it.style.transform = "";
        it.style.willChange = "";
        if (it.style.display !== "none") it.style.opacity = "";
      });
    }, totalIn);
  }, OUT_DURATION_MS + TRANSITION_GAP_MS);
  filterTimers.set(list, t);
}

/* ------------------------------------------------------------------ */

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const gridPaneRef = useRef<HTMLDivElement>(null);
  const listPaneRef = useRef<HTMLDivElement>(null);
  const gridListRef = useRef<HTMLDivElement>(null);
  const listListRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>("grid");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filterRef = useRef<string | null>(null);
  // -1 is none: the list starts closed and opens only on a click.
  const [openId, setOpenId] = useState<number>(-1);

  /* Phones cap the grid at `shown` cards of the current filter. The cap
     follows the filter only once its cards have swapped (see the filter
     effect), so nothing pops in while the old set fades out. Capped cards
     carry data-over; the stylesheet hides them under 768px only. */
  const [shown, setShown] = useState(PHONE_PAGE);
  const [capFilter, setCapFilter] = useState<string | null>(null);
  const capTag = capFilter ? norm(capFilter) : "";
  const matching = WORK_ITEMS.filter((p) => !capTag || p.tags.map(norm).includes(capTag));
  const rank = new Map(matching.map((p, i) => [p.id, i]));
  const prevShown = useRef(shown);

  /* the cards "View more" just let in rise into place */
  useLayoutEffect(() => {
    const from = prevShown.current;
    prevShown.current = shown;
    const grid = gridListRef.current;
    if (!grid || shown <= from) return;
    const fresh = Array.from(grid.querySelectorAll<HTMLElement>("[data-rank]")).filter((el) => {
      const r = Number(el.dataset.rank);
      return r >= from && r < shown;
    });
    gsap.fromTo(
      fresh,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "opacity,visibility,transform" },
    );
  }, [shown]);

  /* load-in: header, then the columns */
  useEffect(() => {
    const targets = [
      headerRef.current,
      asideRef.current,
      projectRef.current,
    ].filter(Boolean) as HTMLElement[];
    targets.forEach((el, i) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: "0.75em" },
        {
          autoAlpha: 1,
          y: "0em",
          duration: 0.9,
          delay: 0.2 + i * 0.18,
          ease: "power3.out",
          overwrite: true,
        },
      );
    });
  }, []);

  /* filter */
  useEffect(() => {
    if (filterRef.current === activeFilter) return;
    filterRef.current = activeFilter;
    const selected = activeFilter ? norm(activeFilter) : "";
    const shouldShow = (el: HTMLElement) => {
      if (!selected) return true;
      const tags = (el.getAttribute("data-tags") || "").split("|").map(norm);
      return tags.includes(selected);
    };
    [gridListRef.current, listListRef.current].forEach((list) => {
      if (list) animateListFilter(list, shouldShow);
    });
    // the phone cap switches with the cards, not before
    const t = window.setTimeout(() => {
      setCapFilter(activeFilter);
      setShown(PHONE_PAGE);
    }, OUT_DURATION_MS + TRANSITION_GAP_MS);
    return () => window.clearTimeout(t);
  }, [activeFilter]);

  /* tab switch: Webflow tabs, out 100ms / in 300ms, ease */
  const switchView = (next: View) => {
    if (next === view) return;
    // The list has no filter, so it always shows every project, all closed.
    if (next === "list") {
      if (activeFilter !== null) chooseFilter(null);
      setOpenId(-1);
    }
    const outPane = view === "grid" ? gridPaneRef.current : listPaneRef.current;
    const inPane = next === "grid" ? gridPaneRef.current : listPaneRef.current;
    if (!outPane || !inPane) return;
    gsap.to(outPane, {
      opacity: 0,
      duration: 0.1,
      ease: WF_EASE,
      onComplete: () => {
        setView(next);
        gsap.set(outPane, { clearProps: "opacity" });
        gsap.fromTo(
          inPane,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: WF_EASE },
        );
      },
    });
  };

  const chooseFilter = (tag: string | null) => setActiveFilter(tag);

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.paddingGlobal}>
        <div className={s.container}>
          <header ref={headerRef} className={`${s.header} ${s.loadIn}`}>
            <p className={s.eyebrow}>{EYEBROW}</p>
            <h1 className={s.headline}>
              {/* The full line, and a shorter one that swaps in on phones. */}
              <span className={s.headlineFull}>
                {WORK_HEADLINE_LINES.map((line, i) => (
                  <span key={line} className={s.headlineLine}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
              <span className={s.headlineShort}>
                {WORK_HEADLINE_LINES_SHORT.map((line, i) => (
                  <span key={line} className={s.headlineLine}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
            </h1>
          </header>

          <div className={`${s.component} ${view === "list" ? s.isList : ""}`}>
            {/* ---------- left column: the filter ---------- */}
            <aside ref={asideRef} className={`${s.aside} ${s.loadIn}`}>
              <nav className={s.filters} aria-label="Filter by industry">
                <ul className={s.filterList}>
                  {[null, ...WORK_FILTERS].map((tag) => {
                    const active = activeFilter === tag;
                    return (
                      <li key={tag ?? "all"}>
                        <button
                          type="button"
                          aria-pressed={active}
                          className={`${s.filterItem} ${active ? s.isActive : ""}`}
                          onClick={() => chooseFilter(tag)}
                        >
                          <span className={s.filterName}>{tag ?? "All"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* ---------- right column ---------- */}
            <div
              ref={projectRef}
              className={`${s.projectComponent} ${s.loadIn}`}
            >
              <div className={s.viewMenu} role="group" aria-label="View">
                <button
                  type="button"
                  aria-pressed={view === "grid"}
                  className={`${s.viewLink} ${view === "grid" ? s.isCurrent : ""}`}
                  onClick={() => switchView("grid")}
                >
                  <GridIcon />
                  Grid
                </button>
                <button
                  type="button"
                  aria-pressed={view === "list"}
                  className={`${s.viewLink} ${view === "list" ? s.isCurrent : ""}`}
                  onClick={() => switchView("list")}
                >
                  <ListIcon />
                  List
                </button>
              </div>

              <div className={s.tabsContent}>
                {/* ---------- grid ---------- */}
                <div
                  ref={gridPaneRef}
                  className={`${s.tabPane} ${view === "grid" ? s.isActive : ""}`}
                >
                  <div ref={gridListRef} className={s.grid} role="list">
                    {WORK_ITEMS.map((p) => (
                      <GridCard key={p.id} item={p} rank={rank.get(p.id)} over={(rank.get(p.id) ?? 0) >= shown} />
                    ))}
                  </div>
                  {matching.length > shown && (
                    <button type="button" className={s.viewMore} onClick={() => setShown((n) => n + PHONE_PAGE)}>
                      View more
                    </button>
                  )}
                </div>

                {/* ---------- list ---------- */}
                <div
                  ref={listPaneRef}
                  className={`${s.tabPane} ${view === "list" ? s.isActive : ""}`}
                >
                  <div ref={listListRef} className={s.list} role="list">
                    {WORK_ITEMS.map((p, i) => (
                      <ListRow
                        key={p.id}
                        item={p}
                        index={i + 1}
                        open={openId === p.id}
                        onToggle={() =>
                          setOpenId((cur) => (cur === p.id ? -1 : p.id))
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The headline result as one plain line: the figure in ink, the label muted. */
function Result({
  result,
  className,
}: {
  result: NonNullable<WorkGalleryItem["result"]>;
  className?: string;
}) {
  const value = <span className={s.resultValue}>{result.value}</span>;
  const label = result.label ? (
    <span className={s.resultLabel}>{result.label}</span>
  ) : null;
  return (
    <span className={`${s.result} ${className ?? ""}`}>
      {result.labelFirst ? (
        <>
          {label} {value}
        </>
      ) : (
        <>
          {value} {label}
        </>
      )}
    </span>
  );
}

/** Who said it, then the one line they said. A lettered circle stands in for a missing photo. */
function Said({
  quote,
  className,
}: {
  quote: NonNullable<WorkGalleryItem["quote"]>;
  className?: string;
}) {
  // The fullest line, so a two-part message reads as its point, not its greeting.
  const line = quote.texts.reduce((a, b) => (b.length > a.length ? b : a), "");
  if (!line) return null;
  return (
    <figure className={`${s.said} ${className ?? ""}`}>
      <figcaption className={s.saidBy}>
        {quote.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={quote.avatar}
            alt=""
            className={s.saidAvatar}
            loading="lazy"
          />
        ) : (
          <span className={s.saidAvatarBlank} aria-hidden>
            {quote.author.charAt(0)}
          </span>
        )}
        <span>
          <span className={s.saidName}>{quote.author}</span>, {quote.role}
        </span>
      </figcaption>
      <blockquote className={s.saidLine}>
        <p>&ldquo;{line}&rdquo;</p>
      </blockquote>
    </figure>
  );
}

function GridCard({ item, rank, over }: { item: WorkGalleryItem; rank?: number; over: boolean }) {
  const external = item.href.startsWith("http");
  const mediaRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLVideoElement>(null);
  const altRef = useRef<HTMLImageElement>(null);

  /* Reels play on their own, looping, whenever the card is on screen (and
     pause off screen so a page of them stays light). Hover is only for
     cards without a reel: the cover pushes in and swaps to the mockup. */
  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? reel.play().catch(() => {}) : reel.pause()),
      { threshold: 0.1 },
    );
    io.observe(reel);
    return () => io.disconnect();
  }, []);

  const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onEnter = () => {
    const media = mediaRef.current;
    const alt = altRef.current;
    if (!media || !alt || !finePointer()) return;
    gsap.killTweensOf([media, alt]);
    gsap.to(media, { scale: 1.04, duration: 0.9, ease: "circ.out" });
    gsap.to(alt, { opacity: 1, duration: REEL_IN, ease: "power2.out" });
  };
  const onLeave = () => {
    const media = mediaRef.current;
    const alt = altRef.current;
    if (!media || !alt || !finePointer()) return;
    gsap.killTweensOf([media, alt]);
    gsap.to(media, { scale: 1, duration: 0.55, ease: WF_EASE });
    gsap.to(alt, { opacity: 0, duration: REEL_OUT, ease: "power2.inOut" });
  };

  return (
    <div
      role="listitem"
      className={s.card}
      data-filter-item=""
      data-tags={item.tags.join("|")}
      data-rank={rank}
      data-over={over || undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={s.cardImage}>
        <div ref={mediaRef} className={s.caseImg} data-case-img="">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.poster}
            alt=""
            className={s.cardPoster}
            loading="lazy"
            style={
              item.posterPosition
                ? { objectPosition: item.posterPosition }
                : undefined
            }
          />
          {item.video ? (
            <video
              ref={reelRef}
              className={s.reel}
              style={{ opacity: 1 }}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            >
              <source src={item.video} />
            </video>
          ) : item.hoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={altRef}
              src={item.hoverImage}
              alt=""
              className={s.reel}
              loading="lazy"
              style={
                item.hoverImagePosition
                  ? { objectPosition: item.hoverImagePosition }
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>

      {/* Name and result on one line. Phones dissolve the row and
          reorder the card: the name above the cover, the result
          and the comment under it (see the stylesheet). */}
      <div className={s.captionRow}>
        <div className={s.captionHead}>
          <h2 className={s.captionName}>{item.name}</h2>
        </div>
        {item.result && (
          <div className={s.caption}>
            <Result result={item.result} className={s.captionResult} />
            {item.caseStudy && (
              <a href={item.caseStudy} className={s.caseStudyLink}>
                <span className={s.caseStudyText}>View case study</span>
                <ArrowOut />
              </a>
            )}
          </div>
        )}
      </div>
      {item.quote ? (
        <Said quote={item.quote} className={s.cardSaid} />
      ) : item.showDescription ? (
        // Opted in (showDescription): the project's one line in the quote's
        // slot and type, with no byline and no quote marks, since nobody said it.
        <div className={`${s.said} ${s.cardSaid}`}>
          <div className={s.saidLine}>
            <p>{item.description}</p>
          </div>
        </div>
      ) : (
        // Nothing to say: hold a one-line quote's height anyway, so a row of
        // two quoteless cards keeps the same air below it as the others.
        <div className={s.saidSpacer} aria-hidden />
      )}

      <a
        href={item.href}
        className={s.cardLink}
        aria-label={item.name}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      />
    </div>
  );
}

function ArrowOut() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="none">
      <path
        d="M4 12 12 4M5.5 4H12v6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: WorkGalleryItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const external = item.href.startsWith("http");
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLAnchorElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const reelRef = useRef<HTMLVideoElement>(null);
  const altRef = useRef<HTMLImageElement>(null);
  const first = useRef(true);

  /* Open: the picture unfolds under the short line, enlarging into position
     (the frame grows from a touch smaller while the cover settles from a
     tighter crop), and the owner's line unfolds under the name. Close: the
     reverse. First render sets the state without motion. */
  useEffect(() => {
    const text = textRef.current;
    const media = mediaRef.current;
    const picture = pictureRef.current;
    const poster = posterRef.current;
    if (!media || !picture || !poster) return;
    const folds = [media, text].filter(Boolean) as HTMLElement[];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const instant = first.current || reduce;
    first.current = false;
    gsap.killTweensOf([...folds, picture, poster]);
    const unfold = (el: HTMLElement) => {
      gsap.set(el, { display: "block" });
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: OPEN_DURATION,
          ease: ACCORDION_EASE,
          onComplete: () => {
            gsap.set(el, { height: "auto" });
          },
        },
      );
    };
    const fold = (el: HTMLElement) => {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: CLOSE_DURATION,
        ease: ACCORDION_EASE,
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    };

    if (open) {
      if (instant) {
        gsap.set(folds, { display: "block", height: "auto", opacity: 1 });
        gsap.set([picture, poster], { clearProps: "transform,opacity" });
        return;
      }
      folds.forEach((el) => unfold(el));
      gsap.fromTo(
        picture,
        { scale: 0.86, opacity: 0, transformOrigin: "50% 0%" },
        {
          scale: 1,
          opacity: 1,
          duration: PICTURE_DURATION,
          ease: "power3.out",
          delay: 0.08,
        },
      );
      gsap.fromTo(
        poster,
        { scale: 1.18, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: PICTURE_DURATION + 0.3,
          ease: "power3.out",
          delay: 0.08,
        },
      );
    } else {
      const reel = reelRef.current;
      if (reel) {
        reel.pause();
        reel.currentTime = 0;
        gsap.set(reel, { opacity: 0 });
      }
      if (instant) {
        gsap.set(folds, { display: "none", height: 0, opacity: 0 });
        return;
      }
      folds.forEach(fold);
    }
  }, [open]);

  /* The reel runs only while the picture is hovered, as in the grid. */
  const wake = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const reel = reelRef.current;
    const alt = altRef.current;
    if (reel) {
      gsap.killTweensOf(reel);
      reel.currentTime = 0;
      reel.play().catch(() => {});
      gsap.to(reel, { opacity: 1, duration: REEL_IN, ease: "power2.out" });
    } else if (alt) {
      gsap.killTweensOf(alt);
      gsap.to(alt, { opacity: 1, duration: REEL_IN, ease: "power2.out" });
    }
  };
  const rest = () => {
    const reel = reelRef.current;
    const alt = altRef.current;
    if (reel) {
      gsap.killTweensOf(reel);
      gsap.to(reel, {
        opacity: 0,
        duration: REEL_OUT,
        ease: "power2.inOut",
        onComplete: () => {
          reel.pause();
          reel.currentTime = 0;
        },
      });
    } else if (alt) {
      gsap.killTweensOf(alt);
      gsap.to(alt, { opacity: 0, duration: REEL_OUT, ease: "power2.inOut" });
    }
  };

  const linkProps = {
    href: item.href,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
  };
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      role="listitem"
      className={`${s.item} ${open ? s.isOpen : ""}`}
      data-filter-item=""
      data-tags={item.tags.join("|")}
    >
      {/* The whole row is the toggle; the arrow and the picture are links. */}
      <div
        className={s.row}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`work-row-${item.id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <span className={s.num}>{String(index).padStart(2, "0")}</span>

        <div className={s.nameCol}>
          <h2 className={s.rowHeading}>
            <span className={s.rowName}>{item.name}</span>
            <span className={s.rowTag}>{item.tags.join(", ")}</span>
          </h2>
          {item.quote && (
            <div ref={textRef} className={s.rowText}>
              <div className={s.rowTextInner}>
                <Said quote={item.quote} />
              </div>
            </div>
          )}
        </div>

        <div className={s.descCol}>
          {item.result && <Result result={item.result} className={s.rowStat} />}
          <p className={s.rowLine}>{item.description}</p>
          <div ref={mediaRef} id={`work-row-${item.id}`} className={s.rowMedia}>
            <a
              ref={pictureRef}
              {...linkProps}
              className={s.rowPicture}
              aria-label={`Open ${item.name}`}
              onClick={stop}
              onMouseEnter={wake}
              onMouseLeave={rest}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={posterRef}
                src={item.poster}
                alt=""
                className={s.pictureImg}
                loading="lazy"
                style={
                  item.posterPosition
                    ? { objectPosition: item.posterPosition }
                    : undefined
                }
              />
              {item.video ? (
                <video
                  ref={reelRef}
                  className={s.reel}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                >
                  <source src={item.video} />
                </video>
              ) : item.hoverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={altRef}
                  src={item.hoverImage}
                  alt=""
                  className={s.reel}
                  loading="lazy"
                  style={
                    item.hoverImagePosition
                      ? { objectPosition: item.hoverImagePosition }
                      : undefined
                  }
                />
              ) : null}
            </a>
          </div>
        </div>

        <a
          {...linkProps}
          className={s.rowArrow}
          aria-label={`Open ${item.name}`}
          onClick={stop}
        >
          <ArrowOut />
        </a>
      </div>
    </div>
  );
}
