"use client";

/**
 * /work gallery, cloned 1:1 from revelatio.studio/work with the palette
 * inverted (white ground, black type). Grid view + list view with a sticky
 * preview follower, tag filter, load-in reveal and the "Open project" cursor
 * label. Motion values (eases, durations, staggers, offsets) are the
 * reference's own, read from its scripts and IX2 data.
 *
 * PLACEHOLDER: headline copy and the `services` column come from
 * src/data/workGallery.ts and are marked there.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import {
  WORK_FILTERS,
  WORK_HEADLINE,
  WORK_ITEMS,
  type WorkGalleryItem,
} from "@/data/workGallery";
import s from "./WorkGallery.module.css";

gsap.registerPlugin(CustomEase, ScrambleTextPlugin);

type View = "grid" | "list";

// Webflow's "ease" preset, cubic-bezier(0.25, 0.1, 0.25, 1).
const WF_EASE = CustomEase.create("wfEase", "M0,0 C0.25,0.1 0.25,1 1,1");

// projects-filter.js
const OUT_DURATION_MS = 340;
const IN_DURATION_MS = 520;
const STAGGER_MS = 80;
const TRANSITION_GAP_MS = 70;

// preview-follower.js
const FOLLOWER_OFFSET = 100;
const FOLLOWER_DURATION = 0.5;
const FOLLOWER_EASE = "power2.inOut";

// scramble-cursor.js
const SCRAMBLE_CHARS = "XYZxy#&@0$€£";

const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ");

function GridIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11.8373 5.33398H7.97111C6.51413 5.33398 5.33301 6.5151 5.33301 7.97209V11.8383C5.33301 13.2953 6.51413 14.4764 7.97111 14.4764H11.8373C13.2943 14.4764 14.4754 13.2953 14.4754 11.8383V7.97209C14.4754 6.5151 13.2943 5.33398 11.8373 5.33398Z" fill="currentColor" />
      <path d="M11.8373 17.5273H7.97111C6.51413 17.5273 5.33301 18.7085 5.33301 20.1655V24.0316C5.33301 25.4886 6.51413 26.6697 7.97111 26.6697H11.8373C13.2943 26.6697 14.4754 25.4886 14.4754 24.0316V20.1655C14.4754 18.7085 13.2943 17.5273 11.8373 17.5273Z" fill="currentColor" />
      <path d="M24.0307 5.33398H20.1645C18.7075 5.33398 17.5264 6.5151 17.5264 7.97209V11.8383C17.5264 13.2953 18.7075 14.4764 20.1645 14.4764H24.0307C25.4876 14.4764 26.6688 13.2953 26.6688 11.8383V7.97209C26.6688 6.5151 25.4876 5.33398 24.0307 5.33398Z" fill="currentColor" />
      <path d="M24.0307 17.5273H20.1645C18.7075 17.5273 17.5264 18.7085 17.5264 20.1655V24.0316C17.5264 25.4886 18.7075 26.6697 20.1645 26.6697H24.0307C25.4876 26.6697 26.6688 25.4886 26.6688 24.0316V20.1655C26.6688 18.7085 25.4876 17.5273 24.0307 17.5273Z" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5.33301" y="5.33398" width="21.3333" height="9.33333" rx="1.33333" fill="currentColor" />
      <rect x="5.33301" y="17.334" width="21.3333" height="9.33333" rx="1.33333" fill="currentColor" />
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

function animateListFilter(list: HTMLElement, shouldShow: (el: HTMLElement) => boolean) {
  const items = Array.from(list.querySelectorAll<HTMLElement>("[data-filter-item]"));
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
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const gridPaneRef = useRef<HTMLDivElement>(null);
  const listPaneRef = useRef<HTMLDivElement>(null);
  const gridListRef = useRef<HTMLDivElement>(null);
  const listListRef = useRef<HTMLDivElement>(null);
  const followerWrapRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const followerInnerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);

  const [view, setView] = useState<View>("grid");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filterRef = useRef<string | null>(null);

  /* load-in: scramble-text.js initScrambleOnLoadIn */
  useEffect(() => {
    const targets = [headlineRef.current, projectRef.current].filter(Boolean) as HTMLElement[];
    targets.forEach((el, i) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: "0.75em" },
        { autoAlpha: 1, y: "0em", duration: 0.9, delay: 0.2 + i * 0.18, ease: "power3.out", overwrite: true }
      );
    });
  }, []);

  /* React sets `muted` as a property only; cloned <video>s need the attribute to autoplay. */
  useEffect(() => {
    sectionRef.current?.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.setAttribute("muted", "");
      v.play().catch(() => {});
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
  }, [activeFilter]);

  /* tab switch: Webflow tabs, out 100ms / in 300ms, ease */
  const switchView = (next: View) => {
    if (next === view) return;
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
        gsap.fromTo(inPane, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: WF_EASE });
      },
    });
  };

  /* card hover: IX2 a-4 / a-5 on .case-img */
  const onCardEnter = (e: React.MouseEvent<HTMLElement>) => {
    const media = e.currentTarget.querySelector<HTMLElement>("[data-case-img]");
    if (!media) return;
    gsap.killTweensOf(media);
    gsap.to(media, { scale: 1.1, duration: 0.8, ease: "circ.out" });
  };
  const onCardLeave = (e: React.MouseEvent<HTMLElement>) => {
    const media = e.currentTarget.querySelector<HTMLElement>("[data-case-img]");
    if (!media) return;
    gsap.killTweensOf(media);
    gsap.to(media, { scale: 1, duration: 0.5, ease: WF_EASE });
  };

  /* cursor label: scramble-cursor.js */
  useEffect(() => {
    const cursor = cursorRef.current;
    const text = cursorTextRef.current;
    if (!cursor || !text) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let started = false;
    let active = false;
    let activeItem: Element | null = null;
    const scale = { value: 0.02 };
    let tween: gsap.core.Tween | null = null;

    const pose = () => {
      cursor.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%) scale(${scale.value})`;
    };
    const animate = (on: boolean) => {
      tween?.kill();
      tween = gsap.to(scale, {
        value: on ? 1 : 0.02,
        duration: on ? 0.32 : 0.2,
        ease: on ? "power3.out" : "power2.out",
        onUpdate: pose,
      });
    };
    const update = () => {
      const hover = document.elementFromPoint(mouseX, mouseY)?.closest("[data-cursor-hover]") ?? null;
      const isHover = !!hover;
      if (isHover !== active) {
        active = isHover;
        animate(active);
        document.documentElement.classList.toggle("cursor-label-active", active);
      }
      if (hover !== activeItem) {
        const label = hover?.getAttribute("data-cursor-text") || "";
        gsap.to(text, {
          duration: 0.6,
          overwrite: "auto",
          scrambleText: { text: label, chars: SCRAMBLE_CHARS, speed: 1.2 },
        });
        activeItem = hover;
      }
    };
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        started = true;
        cursor.style.opacity = "1";
      }
      pose();
      requestAnimationFrame(update);
    };
    const onScroll = () => {
      if (started) requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("cursor-label-active");
      tween?.kill();
    };
  }, []);

  /* preview follower: preview-follower.js */
  useEffect(() => {
    const wrap = followerWrapRef.current;
    const follower = followerRef.current;
    const inner = followerInnerRef.current;
    const component = wrap?.querySelector<HTMLElement>("[data-preview-component]");
    if (!wrap || !follower || !inner || !component) return;
    const items = Array.from(wrap.querySelectorAll<HTMLElement>("[data-follower-item]"));
    if (!items.length) return;

    let prevIndex = 0;
    let activeIndex = 0;

    const playClone = (clone: Element) => {
      clone.querySelectorAll("video").forEach((v) => {
        v.muted = true;
        v.setAttribute("muted", "");
        v.play().catch(() => {});
      });
    };

    const setVisual = (index: number, animate = true) => {
      if (index === activeIndex && inner.querySelector("[data-follower-visual]")) return;
      const visual = items[index]?.querySelector<HTMLElement>("[data-follower-visual]");
      if (!visual) return;
      const forward = index >= prevIndex;

      inner.querySelectorAll<HTMLElement>("[data-follower-visual]").forEach((el) => {
        gsap.killTweensOf(el);
        if (!animate) {
          el.remove();
          return;
        }
        gsap.to(el, {
          yPercent: forward ? -FOLLOWER_OFFSET : FOLLOWER_OFFSET,
          duration: FOLLOWER_DURATION,
          ease: FOLLOWER_EASE,
          overwrite: "auto",
          onComplete: () => el.remove(),
        });
      });

      const clone = visual.cloneNode(true) as HTMLElement;
      inner.appendChild(clone);
      playClone(clone);
      if (animate) {
        gsap.fromTo(
          clone,
          { yPercent: forward ? FOLLOWER_OFFSET : -FOLLOWER_OFFSET },
          { yPercent: 0, duration: FOLLOWER_DURATION, ease: FOLLOWER_EASE, overwrite: "auto" }
        );
      } else {
        gsap.set(clone, { yPercent: 0 });
      }
      prevIndex = index;
      activeIndex = index;
    };

    setVisual(0, false);

    const mobileMq = window.matchMedia("(max-width: 991px)");
    const enters = items.map((item, index) => {
      const fn = () => {
        if (mobileMq.matches) return;
        setVisual(index, true);
      };
      item.addEventListener("mouseenter", fn);
      return fn;
    });

    /* mobile: follower tracks the item nearest the viewport centre */
    let lastActive = -1;
    let shownVisual = -1;
    let posRaf = 0;
    let curTop: number | null = null;
    let curLeft: number | null = null;
    let tgtTop = 0;
    let tgtLeft = 0;
    let imgTimer = 0;

    const setActiveItem = (index: number) => {
      items.forEach((it, i) => {
        it.classList.toggle(s.isActive, i === index);
        it.classList.toggle(s.isInactive, i !== index);
      });
    };
    const clearActiveItem = () => {
      items.forEach((it) => it.classList.remove(s.isActive, s.isInactive));
    };
    const computeTarget = (index: number) => {
      const item = items[index];
      if (!item) return;
      const compRect = component.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const fw = follower.getBoundingClientRect().width;
      tgtTop = itemRect.bottom - compRect.top;
      tgtLeft = (compRect.width - fw) * 0.5;
    };
    const posLoop = () => {
      posRaf = 0;
      if (curTop === null || curLeft === null) {
        curTop = tgtTop;
        curLeft = tgtLeft;
      }
      curTop += (tgtTop - curTop) * 0.16;
      curLeft += (tgtLeft - curLeft) * 0.16;
      follower.style.top = curTop + "px";
      follower.style.left = curLeft + "px";
      if (Math.abs(tgtTop - curTop) > 0.4 || Math.abs(tgtLeft - curLeft) > 0.4) {
        posRaf = requestAnimationFrame(posLoop);
      } else {
        curTop = tgtTop;
        curLeft = tgtLeft;
        follower.style.top = curTop + "px";
        follower.style.left = curLeft + "px";
      }
    };
    const requestPos = (instant: boolean) => {
      if (instant) {
        if (posRaf) cancelAnimationFrame(posRaf);
        posRaf = 0;
        curTop = tgtTop;
        curLeft = tgtLeft;
        follower.style.top = curTop + "px";
        follower.style.left = curLeft + "px";
        return;
      }
      if (!posRaf) posRaf = requestAnimationFrame(posLoop);
    };
    const scheduleVisual = (index: number, instant: boolean) => {
      if (index === shownVisual) return;
      if (instant) {
        if (imgTimer) window.clearTimeout(imgTimer);
        imgTimer = 0;
        setVisual(index, false);
        shownVisual = index;
        return;
      }
      if (imgTimer) window.clearTimeout(imgTimer);
      imgTimer = window.setTimeout(() => {
        imgTimer = 0;
        setVisual(index, true);
        shownVisual = index;
      }, 110);
    };
    const nearestIndexToCenter = () => {
      const vc = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        if (!r.height) return;
        const d = Math.abs(r.top + r.height * 0.5 - vc);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };
    const activeByScroll = (instant: boolean) => {
      const best = nearestIndexToCenter();
      computeTarget(best);
      requestPos(instant);
      if (instant || best !== lastActive) {
        setActiveItem(best);
        scheduleVisual(best, instant);
        lastActive = best;
      }
    };
    const resetToDesktop = () => {
      if (imgTimer) window.clearTimeout(imgTimer);
      imgTimer = 0;
      if (posRaf) cancelAnimationFrame(posRaf);
      posRaf = 0;
      clearActiveItem();
      lastActive = -1;
      shownVisual = -1;
      curTop = null;
      curLeft = null;
      gsap.set(follower, { clearProps: "top,left" });
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (!mobileMq.matches) {
        if (lastActive !== -1) resetToDesktop();
        return;
      }
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        activeByScroll(false);
      });
    };
    const onResize = () => {
      if (mobileMq.matches) activeByScroll(true);
      else resetToDesktop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    if (mobileMq.matches) activeByScroll(true);

    return () => {
      items.forEach((it, i) => it.removeEventListener("mouseenter", enters[i]));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (posRaf) cancelAnimationFrame(posRaf);
      if (imgTimer) window.clearTimeout(imgTimer);
    };
  }, []);

  const toggleFilter = (tag: string) => {
    // The reference has no "all" chip; clicking the active chip again clears it.
    setActiveFilter((cur) => (cur === tag ? null : tag));
  };

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.paddingGlobal}>
        <div className={s.container}>
          <div className={s.component}>
            <div className={s.header}>
              <div className={s.headlineWrap}>
                <h1 ref={headlineRef} className={`${s.headline} ${s.loadIn}`}>
                  {WORK_HEADLINE}
                </h1>
              </div>
            </div>

            <div ref={projectRef} className={`${s.projectComponent} ${s.loadIn}`}>
              <div className={s.filterWrapper}>
                <div className={s.filterList} role="list">
                  {WORK_FILTERS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      role="listitem"
                      className={`${s.filterItem} ${activeFilter === tag ? s.isActive : ""}`}
                      onClick={() => toggleFilter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.tabs}>
                <div className={s.tabsMenu}>
                  <button
                    type="button"
                    aria-label="Grid view"
                    className={`${s.tabLink} ${view === "grid" ? s.isCurrent : ""}`}
                    onClick={() => switchView("grid")}
                  >
                    <GridIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    className={`${s.tabLink} ${view === "list" ? s.isCurrent : ""}`}
                    onClick={() => switchView("list")}
                  >
                    <ListIcon />
                  </button>
                </div>

                <div className={s.tabsContent}>
                  {/* ---------- grid ---------- */}
                  <div ref={gridPaneRef} className={`${s.tabPane} ${view === "grid" ? s.isActive : ""}`}>
                    <div ref={gridListRef} className={s.grid} role="list">
                      {WORK_ITEMS.map((p) => (
                        <GridCard key={p.id} item={p} onEnter={onCardEnter} onLeave={onCardLeave} />
                      ))}
                    </div>
                  </div>

                  {/* ---------- list ---------- */}
                  <div ref={listPaneRef} className={`${s.tabPane} ${view === "list" ? s.isActive : ""}`}>
                    <div ref={followerWrapRef} className={s.previewContainer}>
                      <div className={s.previewComponent} data-preview-component="">
                        <div ref={followerRef} className={s.follower}>
                          <div ref={followerInnerRef} className={s.followerInner} />
                        </div>
                        <div className={s.collection}>
                          <div ref={listListRef} className={s.list} role="list">
                            {WORK_ITEMS.map((p) => (
                              <ListRow key={p.id} item={p} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={cursorRef} className={s.cursor} aria-hidden="true">
        <span ref={cursorTextRef} className={s.cursorLabel}>
          Open project
        </span>
      </div>
    </section>
  );
}

function GridCard({
  item,
  onEnter,
  onLeave,
}: {
  item: WorkGalleryItem;
  onEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onLeave: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const external = item.href.startsWith("http");
  return (
    <div
      role="listitem"
      className={s.card}
      data-filter-item=""
      data-tags={item.tags.join("|")}
      data-cursor-hover=""
      data-cursor-text="Open project"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={s.cardImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.poster} alt="" className={s.cardPoster} loading="lazy" />
        <div className={s.caseImg} data-case-img="">
          <video autoPlay muted loop playsInline preload="metadata" poster={item.poster}>
            <source src={item.video} />
          </video>
        </div>
      </div>
      <div className={s.cardContent}>
        <div className={s.cardRow}>
          <div className={s.cardTitle}>{item.name}</div>
          <div className={s.tagList} role="list">
            {item.tags.map((t) => (
              <div key={t} role="listitem" className={s.tag}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className={s.cardDesc}>
          <div className={s.cardDescText}>{item.description}</div>
        </div>
      </div>
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

function ListRow({ item }: { item: WorkGalleryItem }) {
  const external = item.href.startsWith("http");
  return (
    <div
      role="listitem"
      className={s.item}
      data-filter-item=""
      data-follower-item=""
      data-tags={item.tags.join("|")}
      data-cursor-hover=""
      data-cursor-text="Open project"
    >
      <div className={s.itemInner}>
        <div className={s.itemRow}>
          <div className={`${s.col} ${s.colLarge}`}>
            <h2 className={s.itemHeading}>{item.name}</h2>
          </div>
          <div className={`${s.col} ${s.colSmall} ${s.hideMobile}`}>
            <p className={s.itemText}>{item.tags[0]}</p>
          </div>
          <div className={`${s.col} ${s.colSmall} ${s.colRight}`}>
            <div className={s.serviceList} role="list">
              {item.services.map((sv) => (
                <div key={sv} role="listitem" className={s.service}>
                  {sv}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={s.visual} data-follower-visual="">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.poster} alt="" className={s.visualImg} loading="lazy" />
          <video className={s.visualVideo} autoPlay muted loop playsInline preload="metadata" poster={item.poster}>
            <source src={item.video} />
          </video>
        </div>
        <a
          href={item.href}
          className={s.itemLink}
          aria-label={item.name}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        />
      </div>
    </div>
  );
}
