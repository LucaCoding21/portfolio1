"use client";

import { gsap, ScrollTrigger, useSightGsap } from "./motion";

/**
 * The founders' note, for the "we build it, live in 45 days or you don't
 * pay" card. Not a product screen: a sheet of paper taped to the photo with
 * two plain sentences typed on it and both names signed underneath. The
 * headline already carries the deadline, so the note reads like something
 * a person would actually write, not a second pitch.
 * The sheet settles into place as the card scrolls in, then the two
 * signatures write themselves, one after the other. Plays once; a
 * signature written on a loop stops looking like a signature. With
 * prefers-reduced-motion the note is simply there, signed.
 */

const SIGNERS = [
  { name: "William", role: "Founder" },
  { name: "Irish", role: "Co-founder" },
];

export default function FoundersNote() {
  const scope = useSightGsap((root, reduced) => {
    const sheet = root.querySelector<HTMLElement>("[data-sheet]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root);
    const sigs = gsap.utils.toArray<HTMLElement>("[data-sig]", root);
    const roles = gsap.utils.toArray<HTMLElement>("[data-role]", root);

    if (reduced) return;

    // First frame: sheet a touch low and over-tilted, nothing written yet.
    gsap.set(sheet, { autoAlpha: 0, y: 24, rotate: -4 });
    gsap.set(lines, { autoAlpha: 0, y: 6 });
    gsap.set(sigs, { clipPath: "inset(-20% 100% -20% 0)" });
    gsap.set(roles, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });

    // the sheet lands and settles to its resting tilt
    tl.to(sheet, { autoAlpha: 1, y: 0, rotate: -1.5, duration: 0.8, ease: "power3.out" }, 0);

    // the typed lines come up one after another
    lines.forEach((line, i) => {
      tl.to(line, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.35 + i * 0.16);
    });

    // each signature is revealed left to right, the way a pen would
    // travel, and its role fades in once the name is down
    let at = 0.35 + lines.length * 0.16 + 0.35;
    sigs.forEach((sig, i) => {
      tl.to(sig, { clipPath: "inset(-20% 0% -20% 0)", duration: 0.85, ease: "power1.inOut" }, at);
      tl.to(roles[i], { autoAlpha: 1, duration: 0.3 }, at + 0.7);
      at += 1.05;
    });

    ScrollTrigger.create({
      trigger: root,
      start: "top 78%",
      once: true,
      onEnter: () => tl.play(),
    });
  });

  return (
    <div ref={scope} className="w-full max-w-[380px]">
      {/* The sheet: paper + lifted-corner shadows + the tape that holds it
          to the photo. GSAP moves this wrapper, so everything travels
          together. */}
      <div
        data-sheet
        className="relative"
        style={{ rotate: "-1.5deg", isolation: "isolate" }}
      >
        <span className="fnote-lift fnote-lift-l" aria-hidden="true" />
        <span className="fnote-lift fnote-lift-r" aria-hidden="true" />
        <span className="fnote-tape" aria-hidden="true" />

        <div className="fnote-paper px-8 pb-7 pt-9 md:px-10 md:pb-8 md:pt-10">
          <p
            data-line
            className="relative z-[1] text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "#9a9384" }}
          >
            A note from the founders
          </p>

          <div className="relative z-[1] mt-5 space-y-3 text-[15.5px] leading-[1.55] md:text-[16px]">
            <p data-line>
              Thanks for reading this far. If Sight ever isn&apos;t earning its keep,
              tell us and we&apos;ll fix it ourselves.
            </p>
          </div>

          <div className="relative z-[1] mt-7 flex items-end gap-8">
            {SIGNERS.map((s) => (
              <div key={s.name} className="min-w-0">
                <p
                  data-sig
                  className="fnote-ink whitespace-nowrap text-[30px] leading-none md:text-[32px]"
                  style={{
                    fontFamily: "var(--font-hand), 'Segoe Script', 'Bradley Hand', cursive",
                    rotate: "-2deg",
                  }}
                >
                  {s.name}
                </p>
                <p data-role className="mt-2 text-[11px]" style={{ color: "#9a9384" }}>
                  {s.role}, Cloverfield
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
