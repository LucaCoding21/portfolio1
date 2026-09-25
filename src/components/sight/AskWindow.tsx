"use client";

import Image from "next/image";
import { AppPanel, Icon, P, Spark, T } from "./SightUI";
import { gsap, useSightGsap } from "./motion";
import { M, type LogoMark } from "./logos";

/**
 * The Ask screen of Sight, for the "ask it anything, or let it tell you"
 * card. Both halves of the daily experience in one feed. A question
 * types itself into the composer, goes up, Sight looks across the tools
 * for a moment, and the answer lands as one sentence with the numbers
 * in it and the tools it came from underneath. Then, with nobody
 * typing, a notice arrives on its own. Three questions, two notices,
 * in turn. Plays only while on screen; with prefers-reduced-motion it
 * shows the first question answered.
 */

type Ask = { kind: "ask"; q: string; a: string; from: LogoMark[] };
type Notice = { kind: "notice"; tone: "amber" | "green"; title: string; detail: string };
type Scene = Ask | Notice;

const SCENES: Scene[] = [
  {
    kind: "ask",
    q: "Which jobs finished but never got invoiced?",
    a: "Four from last week, $11,200 between them.",
    from: [M.jobber, M.quickbooks],
  },
  {
    kind: "notice",
    tone: "amber",
    title: "The Hendersons’ $9,800 quote, no follow-up",
    detail: "Sent 12 days ago, nobody’s called yet.",
  },
  {
    kind: "ask",
    q: "What did the Oakridge job actually make us?",
    a: "$4,100 on an $18,500 quote, and labour ran 30 hours over.",
    from: [M.jobber, M.quickbooks, M.gcal],
  },
  {
    kind: "notice",
    tone: "green",
    title: "Best week since March: $42,300",
    detail: "Up 18% on the same week last year.",
  },
  {
    kind: "ask",
    q: "Which customers went quiet this year?",
    a: "14 who booked every spring haven’t yet, worth $31,000 last year.",
    from: [M.jobber, M.quickbooks],
  },
];

/* timing (s) */
const CHAR = 0.035; // per typed character
const THINK = 1.15; // looking across the tools
const HOLD_ASK = 3.4;
const HOLD_NOTICE = 3.2;

const FEED_H = 176;

const MARK_H = 12;
const markH = (m: LogoMark) => MARK_H * (m.scale ?? 1);
const markW = (m: LogoMark) => (markH(m) * m.w) / m.h;

function Mark({ mark }: { mark: LogoMark }) {
  return (
    <Image
      src={mark.src}
      alt={mark.name}
      width={Math.round(markW(mark))}
      height={Math.round(markH(mark))}
      style={{ height: markH(mark), width: "auto", opacity: 0.85 }}
      loading="eager"
      draggable={false}
    />
  );
}

function SceneView({ scene, index }: { scene: Scene; index: number }) {
  if (scene.kind === "ask") {
    return (
      <div data-scene={index} className="absolute inset-0">
        <p data-q className="text-[14px] font-semibold leading-snug" style={{ color: T.INK }}>
          {scene.q}
        </p>
        {/* the thinking line and the answer share one spot */}
        <div className="relative mt-3">
          <p data-think className="absolute inset-x-0 top-0 text-[12px] font-medium">
            <span className="sight-thinking">Looking across {scene.from.length} tools</span>
          </p>
          <div data-a>
            <p className="text-[13px] leading-relaxed" style={{ color: T.INK }}>
              {scene.a}
            </p>
            <p className="mt-3 flex items-center gap-3 text-[11px]" style={{ color: T.FAINT }}>
              From
              {scene.from.map((m) => (
                <Mark key={m.name} mark={m} />
              ))}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hex = scene.tone === "amber" ? T.AMBER : T.GREEN;
  return (
    <div data-scene={index} className="absolute inset-0">
      <div data-notice>
        {/* a small bell and the word, in the tone: a notice, not a status */}
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-medium"
          style={{ color: hex }}
        >
          <Icon d={P.bell} className="h-3.5 w-3.5" strokeWidth={2} />
          Noticed
        </span>
        <p className="mt-3 text-[14px] font-semibold leading-snug" style={{ color: T.INK }}>
          {scene.title}
        </p>
        <p className="mt-1.5 text-[12px]" style={{ color: T.MUTED }}>
          {scene.detail}
        </p>
      </div>
    </div>
  );
}

export default function AskWindow() {
  const scope = useSightGsap((root, reduced) => {
    const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]", root);
    const typed = root.querySelector<HTMLElement>("[data-typed]");
    const placeholder = root.querySelector<HTMLElement>("[data-placeholder]");
    const send = root.querySelector<HTMLElement>("[data-send]");
    const busy = root.querySelector<HTMLElement>("[data-busy]");
    const idle = root.querySelector<HTMLElement>("[data-idle]");

    // An ask scene has no notice and a notice scene has no question, so
    // `all` is only the pieces this scene actually has.
    const parts = (scene: HTMLElement) => {
      const q = scene.querySelector<HTMLElement>("[data-q]");
      const think = scene.querySelector<HTMLElement>("[data-think]");
      const a = scene.querySelector<HTMLElement>("[data-a]");
      const notice = scene.querySelector<HTMLElement>("[data-notice]");
      const all = [q, think, a, notice].filter((el): el is HTMLElement => el !== null);
      return { q, think, a, notice, all };
    };

    const setTyped = (text: string) => {
      if (typed) typed.textContent = text;
    };

    // First frame, applied immediately: empty feed, empty composer.
    scenes.forEach((scene) => {
      const p = parts(scene);
      gsap.set(scene, { autoAlpha: 0 });
      gsap.set(p.all, { autoAlpha: 0 });
    });
    setTyped("");
    gsap.set(placeholder, { autoAlpha: 1 });
    gsap.set(busy, { autoAlpha: 0 });
    gsap.set(idle, { autoAlpha: 1 });

    if (reduced) {
      // First question, answered, nothing moving.
      const p = parts(scenes[0]);
      gsap.set(scenes[0], { autoAlpha: 1 });
      gsap.set([p.q, p.a], { autoAlpha: 1 });
      return;
    }

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        toggleActions: "play pause resume pause",
      },
    });

    // set() renders at build time by default, which would stomp the first
    // frame above; these only apply when the playhead reaches them.
    const later = (target: gsap.TweenTarget, vars: gsap.TweenVars, at: number) =>
      tl.set(target, { ...vars, immediateRender: false }, at);

    scenes.forEach((scene, i) => {
      const sc = SCENES[i];
      const p = parts(scene);
      const at = tl.duration();

      later(scene, { autoAlpha: 0 }, at);
      later(p.all, { autoAlpha: 0 }, at);

      if (sc.kind === "ask") {
        // the question types itself into the composer
        const proxy = { n: 0 };
        tl.add(() => {
          proxy.n = 0;
          setTyped("");
        }, at);
        tl.to(placeholder, { autoAlpha: 0, duration: 0.15 }, at + 0.3);
        tl.to(
          proxy,
          {
            n: sc.q.length,
            duration: sc.q.length * CHAR,
            ease: "none",
            onUpdate: () => setTyped(sc.q.slice(0, Math.round(proxy.n))),
          },
          at + 0.3
        );

        // send: the button dips, the composer clears, the question goes up
        const sent = at + 0.3 + sc.q.length * CHAR + 0.35;
        tl.to(send, { scale: 0.86, duration: 0.12, ease: "power2.in" }, sent)
          .to(send, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, sent + 0.12)
          .add(() => setTyped(""), sent + 0.12)
          .to(placeholder, { autoAlpha: 1, duration: 0.25 }, sent + 0.4);
        later(scene, { autoAlpha: 1 }, sent + 0.1);
        later(p.q, { y: 10 }, sent + 0.1);
        tl.to(p.q, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, sent + 0.12);

        // looking, then the answer lands
        tl.to(p.think, { autoAlpha: 1, duration: 0.2 }, sent + 0.35)
          .to(busy, { autoAlpha: 1, duration: 0.2 }, sent + 0.35)
          .to(idle, { autoAlpha: 0, duration: 0.2 }, sent + 0.35);
        const answered = sent + 0.35 + THINK;
        later(p.a, { y: 8 }, at);
        tl.to(p.think, { autoAlpha: 0, duration: 0.15 }, answered)
          .to(busy, { autoAlpha: 0, duration: 0.2 }, answered)
          .to(idle, { autoAlpha: 1, duration: 0.2 }, answered + 0.1)
          .to(p.a, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, answered + 0.1);

        // hold, then clear
        const clear = answered + HOLD_ASK;
        tl.to(scene, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, clear);
      } else {
        // nobody typed: the notice drops in on its own after a beat
        later(scene, { autoAlpha: 1 }, at + 0.5);
        later(p.notice, { y: -12, scale: 0.98 }, at);
        tl.to(p.notice, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, at + 0.5);
        tl.to(scene, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, at + 0.5 + HOLD_NOTICE);
      }
    });
  });

  return (
    <div ref={scope} className="w-full max-w-[400px]">
      <AppPanel pad={false}>
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3"
          style={{ borderColor: `${T.LINE}b3` }}
        >
          <span className="flex items-center gap-2">
            <span style={{ color: T.BLUE }}>
              <Spark className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold" style={{ color: T.INK }}>
              Ask Sight
            </span>
          </span>
          {/* the two header states share one cell */}
          <span className="grid justify-items-end text-[11px] font-medium">
            <span data-busy className="col-start-1 row-start-1">
              <span className="sight-thinking">Working</span>
            </span>
            <span
              data-idle
              className="col-start-1 row-start-1 rounded-[5px] px-2.5 py-1 leading-none"
              style={{ backgroundColor: `${T.GREEN}1f`, color: T.GREEN_INK }}
            >
              Up to date
            </span>
          </span>
        </div>

        {/* the feed: one thing at a time */}
        <div className="relative mx-4 my-4" style={{ height: FEED_H }}>
          {SCENES.map((scene, i) => (
            <SceneView key={i} scene={scene} index={i} />
          ))}
        </div>

        {/* the composer */}
        <div className="px-3 pb-3">
          <div
            className="flex items-center gap-2 rounded-xl border py-2 pl-3.5 pr-2"
            style={{ borderColor: `${T.LINE}b3`, backgroundColor: T.SURFACE2 }}
          >
            <span className="relative min-w-0 flex-1 text-[13px]">
              <span data-placeholder className="absolute inset-y-0 left-0 flex items-center" style={{ color: T.FAINT }}>
                Ask anything
              </span>
              <span data-typed className="block min-h-[20px] truncate leading-5" style={{ color: T.INK }} />
            </span>
            <span
              data-send
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: T.BLUE }}
            >
              <Icon d={P.arrowUp} className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </AppPanel>
    </div>
  );
}
