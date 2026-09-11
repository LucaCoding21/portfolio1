"use client";

import { gsap, useSightGsap } from "./motion";

/**
 * Security: a full-width band after the How-it-works stack, ruled top
 * and bottom so it reads as page, not as a fifth card. The promise is in the headline, the proof is a row of
 * five seals the eye sweeps across, each with one short caption. The
 * maple leaf is the only colour on the block, so Canada is read first.
 * The seals are drawn here, in one thin line: the audited standards
 * belong to the hosting, which the captions say.
 */

type Item = { seal: React.ReactNode; title: string; caption: string };

const CANADA_RED = "#d3312e";

/**
 * The seal, drawn in a 200-unit box: a dotted outer ring, a white disc
 * with a soft shadow, and the mark inside. Big enough that the mark is
 * the label, like a coin.
 */
function Seal({ children }: { children: React.ReactNode }) {
  return (
    <svg
      data-seal
      viewBox="0 0 200 200"
      className="w-full max-w-[200px]"
      style={{ filter: "drop-shadow(0 12px 24px rgba(32,33,36,0.10))" }}
      fill="none"
      stroke="var(--ink)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" stroke="var(--ink-faint)" strokeWidth="1.25" strokeDasharray="2 6.2" strokeOpacity="0.9" />
      <circle cx="100" cy="100" r="84" fill="#fff" stroke="var(--line)" strokeWidth="1" />
      {children}
    </svg>
  );
}

function SealText({ lines, size, y = 100 }: { lines: string[]; size: number; y?: number }) {
  const lineH = size * 1.15;
  const y0 = y - ((lines.length - 1) * lineH) / 2;
  return (
    <g stroke="none" fill="var(--ink)" fontFamily="inherit" fontWeight="500" fontSize={size} letterSpacing="0.04em" textAnchor="middle">
      {lines.map((l, i) => (
        <text key={l} x="100" y={y0 + i * lineH} dominantBaseline="central">
          {l}
        </text>
      ))}
    </g>
  );
}

/* marks drawn in a 24-unit box, scaled up into the seal */
const LEAF =
  "M12 2.2 13.5 5.6 15.7 4.7 15.1 8.8 18.6 7.1 17.6 10.1 21.6 11.1 19 13.6 20.2 15.7 13.1 14.7 13.1 21.8 10.9 21.8 10.9 14.7 3.8 15.7 5 13.6 2.4 11.1 6.4 10.1 5.4 7.1 8.9 8.8 8.3 4.7 10.5 5.6Z";
const SHIELD = "M12 2.5 22 6.2v7.3c0 6.4-4.3 11.2-10 13-5.7-1.8-10-6.6-10-13V6.2L12 2.5Z";

const ITEMS: Item[] = [
  {
    seal: (
      <Seal>
        <g transform="translate(60 60) scale(3.3)">
          <path d={LEAF} fill={CANADA_RED} stroke="none" />
        </g>
      </Seal>
    ),
    title: "Stored in Canada",
    caption: "On Canadian servers, under Canadian law.",
  },
  {
    seal: (
      <Seal>
        <g transform="translate(66 66) scale(2.85)" strokeWidth={1.5 / 2.85}>
          <rect x="2.5" y="10.5" width="19" height="14.5" rx="3" />
          <path d="M6.5 10.5V7.5a5.5 5.5 0 0 1 11 0v3" />
          <circle cx="12" cy="17.75" r="1.5" fill="var(--ink)" stroke="none" />
        </g>
      </Seal>
    ),
    title: "Encrypted",
    caption: "In transit and at rest, like your bank.",
  },
  {
    seal: (
      <Seal>
        <g transform="translate(54 44) scale(3.85)" strokeWidth={1.5 / 3.85}>
          <path d={SHIELD} />
        </g>
        <SealText lines={["PIPEDA"]} size={17} y={100} />
      </Seal>
    ),
    title: "PIPEDA",
    caption: "Handled under Canada's privacy law.",
  },
  {
    seal: (
      <Seal>
        <SealText lines={["SOC 2"]} size={30} />
      </Seal>
    ),
    title: "SOC 2 Type II",
    caption: "Hosted on audited infrastructure.",
  },
  {
    seal: (
      <Seal>
        <SealText lines={["ISO", "27001"]} size={24} />
      </Seal>
    ),
    title: "ISO 27001",
    caption: "Hosted on certified infrastructure.",
  },
];

export default function Security() {
  const scope = useSightGsap<HTMLElement>((root, reduced) => {
    const head = gsap.utils.toArray<HTMLElement>("[data-head]", root);
    const items = gsap.utils.toArray<HTMLElement>("[data-item]", root);
    const seals = gsap.utils.toArray<HTMLElement>("[data-seal]", root);
    const row = root.querySelector("[data-row]");

    gsap.from(head, {
      opacity: 0,
      y: reduced ? 0 : 24,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });
    gsap.from(items, {
      opacity: 0,
      y: reduced ? 0 : 20,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: { trigger: row, start: "top 85%", once: true },
    });
    if (!reduced) {
      gsap.from(seals, {
        scale: 0.8,
        transformOrigin: "center",
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.07,
        delay: 0.12,
        scrollTrigger: { trigger: row, start: "top 85%", once: true },
      });
    }
  });

  return (
    <section
      ref={scope}
      id="security"
      className="mt-10 scroll-mt-24 border-y border-[var(--line)] bg-white py-16 md:mt-16 md:py-24"
    >
      <div className="mx-auto w-[95%] max-w-[1280px]">
        {/* the promise */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <h2
            data-head
            className="max-w-[22ch] font-medium leading-[1.06] tracking-[-0.025em] text-[var(--ink)]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.1rem)" }}
          >
            Your numbers stay in Canada, and stay yours.
          </h2>
          <p
            data-head
            className="max-w-[30rem] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)] lg:justify-self-end"
          >
            Sight keeps your books on Canadian servers, encrypted the whole
            way, and never mixes them with another business or uses them to
            train anything.
          </p>
        </div>

        {/* the proof */}
        <div
          data-row
          className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 border-t border-[var(--line)] pt-12 sm:grid-cols-3 md:mt-14 md:pt-16 lg:grid-cols-5 lg:gap-x-8"
        >
          {ITEMS.map((item) => (
            <div key={item.title} data-item className="flex flex-col items-center text-center">
              {item.seal}
              <p className="mt-6 text-[1rem] font-medium leading-snug text-[var(--ink)]">
                {item.title}
              </p>
              <p className="mt-1.5 max-w-[14rem] text-[0.86rem] leading-[1.5] text-[var(--ink-soft)]">
                {item.caption}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
