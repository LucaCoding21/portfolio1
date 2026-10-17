"use client";

/**
 * The friend's gift page (/gift/<id>). It opens on a sealed envelope with
 * their name on it. A tap breaks the seal, swings the flap open and draws the
 * card up out of the envelope; the envelope drops away, the card settles at
 * the top and a sheen crosses it, then the message and the claim button
 * arrive below. With reduced motion the tap goes straight to the card. Once
 * out, the card itself turns over on a tap (GiftCard).
 *
 * The envelope is William's sage green envelope photos cut into the layers
 * of a real one (public/gift/env-green-*.webp, all in one frame): the back,
 * the card, the pocket in front of it, and the flap, a two-sided 3D piece
 * whose outside is the closed photo and whose inside is the open one. It
 * darkens as it turns edge-on, the way paper does.
 *
 * Every screen after the envelope is 1:1 from the designer's "Cloverfield
 * Gift Screen" redesign (October 2026): opened, the claim form (its own
 * screen, with the gift in a row at the top), claimed (with "Fix it" for
 * an hour), back after claiming (text William), signed (pass it on) and
 * expired. The design's printed card back was left out on purpose.
 *
 * The first tap on the envelope is recorded (opened_at, for Command Center)
 * unless it comes from William's devices or the phone that sent the gift.
 *
 * Gifts already claimed, signed or expired skip the envelope. `preview` starts
 * the page partway through, for the dev screens board (/gift-screens).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import GiftCard, { type CardStatus } from "@/components/gift/GiftCard";
import GiftHeader from "@/components/gift/GiftHeader";
import ClaimForm from "@/components/gift/ClaimForm";
import { WILLIAM_PHONE, senderKey, type ClaimFields } from "@/lib/giftShared";
import { track } from "@/lib/track";
import s from "./gift.module.css";

export type GiftState = "sealed" | "claimed" | "signed" | "expired";

type Phase = "sealed" | "opening" | "open";

type Claim = "idle" | "form" | "fix" | "done";

export type GiftPreview = {
  open?: boolean;
  flipped?: boolean;
  claim?: Claim;
  claimErrors?: boolean;
  /** what they gave when claiming, for the claimed screen */
  details?: ClaimFields;
};

const at = (i: number) => ({ "--i": i }) as React.CSSProperties;

const ENV_SIZES = "(max-width: 480px) 100vw, 440px";

// The envelope shows once its back, pocket and flap photos are in, so a cold
// load never flashes the card (its type is HTML and paints first) or half an
// envelope. A slow photo can't hold it back for longer than this.
const ENV_LAYERS = 3;
const ENV_WAIT_MS = 3000;

const possessive = (name: string) => (/s$/i.test(name) ? `${name}’` : `${name}’s`);

const daysLeftLine = (n: number) =>
  n <= 0 ? "Last day to claim" : n === 1 ? "1 day left to claim" : `${n} days left to claim`;

/** Where the page starts: on the envelope, unless the gift is past that. */
function phase0(state: GiftState, preview?: GiftPreview): Phase {
  return state === "sealed" && !preview?.open ? "sealed" : "open";
}

/** Not William's (?internal=1, see layout.tsx) and not the phone that sent it. */
function isFriendsDevice(giftId: string) {
  try {
    return localStorage.getItem("cf_internal") !== "1" && !localStorage.getItem(senderKey(giftId));
  } catch {
    return true;
  }
}

export default function GiftReveal({
  id,
  state,
  friendName,
  client,
  claimByCard,
  claimByLong,
  daysLeft,
  notified = false,
  preview,
}: {
  id: string;
  state: GiftState;
  friendName: string;
  client: { firstName: string; business: string; siteUrl: string };
  /** "Oct 31, 2026" */
  claimByCard: string;
  /** "October 31" */
  claimByLong: string;
  /** whole days left to claim; 0 on the last day */
  daysLeft: number;
  /** The client has an email, so they hear when it's claimed. */
  notified?: boolean;
  preview?: GiftPreview;
}) {
  const [phase, setPhase] = useState<Phase>(phase0(state, preview));
  const [sheen, setSheen] = useState(false);
  const [envReady, setEnvReady] = useState(phase0(state, preview) === "open");
  const envLoaded = useRef(0);
  const [claim, setClaim] = useState<Claim>(preview?.claim ?? "idle");
  const [details, setDetails] = useState<ClaimFields | null>(preview?.details ?? null);
  const [passing, setPassing] = useState(false);
  const [passError, setPassError] = useState<string>();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLSpanElement>(null);
  const pocketRef = useRef<HTMLSpanElement>(null);
  const flapRef = useRef<HTMLSpanElement>(null);
  const flapOutRef = useRef<HTMLSpanElement>(null);
  const flapInRef = useRef<HTMLSpanElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // Opening removes the button that had focus; the heading takes it over.
  const focusTitle = useRef(false);

  useEffect(() => () => void tlRef.current?.kill(), []);

  useEffect(() => {
    if (envReady) return;
    const t = setTimeout(() => setEnvReady(true), ENV_WAIT_MS);
    return () => clearTimeout(t);
  }, [envReady]);

  // Counted on error too: a missing photo shouldn't keep the envelope hidden.
  function envLayerIn() {
    envLoaded.current += 1;
    if (envLoaded.current >= ENV_LAYERS) setEnvReady(true);
  }

  // The timeline ends exactly where the open layout puts the card, so the
  // inline styles can go before the browser paints the swap.
  useLayoutEffect(() => {
    if (phase === "open" && stageRef.current) gsap.set([stageRef.current, cardRef.current], { clearProps: "all" });
  }, [phase]);

  useEffect(() => {
    if (phase !== "open" || !focusTitle.current) return;
    focusTitle.current = false;
    titleRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Each claim step is a new screen: start it at the top. The form focuses
  // its own first field; the claimed screen focuses its heading.
  const previewing = !!preview;
  useEffect(() => {
    if (previewing || claim === "idle") return;
    window.scrollTo({ top: 0 });
    if (claim === "done") doneRef.current?.focus({ preventScroll: true });
  }, [claim, previewing]);

  function open() {
    if (phase !== "sealed") return;
    focusTitle.current = true;
    if (!preview && isFriendsDevice(id)) {
      fetch(`/api/gifts/${id}/open`, { method: "POST", keepalive: true }).catch(() => {});
      track("gift_opened");
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("open");
      return;
    }
    setPhase("opening");

    const stage = stageRef.current!;
    const card = cardRef.current!;
    const envelope = [backRef.current, pocketRef.current, flapRef.current, sealRef.current];
    const w = stage.offsetWidth;

    tlRef.current = gsap
      .timeline({ onComplete: () => setPhase("open") })
      .to(hintRef.current, { opacity: 0, duration: 0.25 }, 0)
      // the seal lifts away
      .to(sealRef.current, { opacity: 0, scale: 0.82, duration: 0.3, ease: "power2.in" }, 0)
      // the flap swings up on its hinge: the outside darkens as it turns
      // edge-on, then the inside comes round and catches the light; once past
      // upright it tucks behind the card
      .to(flapRef.current, { rotateX: 180, duration: 0.7, ease: "power2.inOut" }, 0.15)
      .to(flapOutRef.current, { filter: "brightness(0.72)", duration: 0.35, ease: "power1.in" }, 0.15)
      .to(flapInRef.current, { filter: "brightness(1)", duration: 0.35, ease: "power1.out" }, 0.5)
      .set(flapRef.current, { zIndex: 1 }, 0.5)
      // the card rises while the envelope drops away beneath it; it clears the
      // pocket (whose wings reach the top corners) as both moves finish
      .to(card, { y: -0.36 * w, duration: 0.65, ease: "power3.out" }, 0.7)
      .to(envelope, { y: 0.34 * w, duration: 0.65, ease: "power2.in" }, 0.7)
      .to(envelope, { opacity: 0, duration: 0.45, ease: "power1.out" }, 1.1)
      .set(card, { zIndex: 6 }, 1.35)
      // the card settles at full size where the open layout keeps it
      .to(card, { y: 0, scale: 1, duration: 0.7, ease: "power3.inOut" }, 1.25)
      .to(stage, { height: w / 1.4, marginTop: 28, duration: 0.7, ease: "power3.inOut" }, 1.25)
      .call(() => setSheen(true), [], 1.65);
  }

  function startClaim(next: "form" | "fix") {
    if (next === "form") track("gift_claim_start");
    setSheen(false);
    setClaim(next);
  }

  async function passOn() {
    if (passing) return;
    setPassing(true);
    setPassError(undefined);
    track("gift_pass_on");
    if (preview) {
      window.location.href = "/gift-screens/send";
      return;
    }
    try {
      const res = await fetch(`/api/gifts/${id}/pass-on`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setPassError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setPassError("Couldn't reach us. Check your connection and try again.");
    }
    setPassing(false);
  }

  const sealed = phase !== "open";
  const envFade = envReady ? s.envIn : s.envWaiting;
  const from = `${client.firstName}, ${client.business}`;
  const claimed = state === "claimed" || claim === "done";
  const cardStatus: CardStatus =
    state === "expired" ? "expired" : state === "signed" ? "redeemed" : claimed ? "claimed" : "open";
  const claiming = state === "sealed" && (claim === "form" || claim === "fix");

  const siteLink = (className: string, style?: React.CSSProperties) =>
    client.siteUrl && (
      <a
        className={className}
        style={style}
        href={client.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("gift_site_click")}
      >
        See the website we built for {client.firstName}
        <ExternalIcon />
      </a>
    );

  if (claiming) {
    return (
      <div className={s.page}>
        <main className={s.main}>
          <GiftHeader />

          <div className={s.claimSummary}>
            <span className={s.claimChip} aria-hidden="true">
              $500
            </span>
            <span className={s.claimSummaryText}>
              <span className={s.claimSummaryTitle}>$500 off a new website</span>
              <span className={s.claimSummaryFrom}>From {from}</span>
            </span>
          </div>

          <h1 className={`${s.title} ${s.claimTitle}`}>
            Claim your $500
          </h1>
          <p className={`${s.body} ${s.claimBody}`}>
            William from Cloverfield will reach out within a day.
          </p>

          <ClaimForm
            giftId={id}
            initial={details ?? { name: friendName, business: "", phone: "", email: "" }}
            fix={claim === "fix"}
            onDone={(values) => {
              if (claim === "form") track("gift_claimed");
              setDetails(values);
              setClaim("done");
            }}
            preview={preview && { errors: preview.claimErrors }}
          />
          <p className={s.underCta}>Claim by {claimByCard}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <main className={s.main}>
        <GiftHeader />

        <div
          ref={stageRef}
          className={`${s.stage} ${sealed ? envFade : s.stageOpen}`}
        >
          {sealed && (
            <span ref={backRef} className={s.envBack}>
              <Image
                src="/gift/env-green-back.webp"
                alt=""
                fill
                sizes={ENV_SIZES}
                className={s.envArt}
                priority
                onLoad={envLayerIn}
                onError={envLayerIn}
              />
            </span>
          )}
          <div ref={cardRef} className={s.cardSlot}>
            <GiftCard
              friendName={friendName}
              from={from}
              claimBy={claimByCard}
              sheen={sheen}
              status={cardStatus}
              priority
              startFlipped={preview?.flipped}
            />
          </div>
          {sealed && (
            <>
              <span ref={pocketRef} className={s.envPocket}>
                <Image
                  src="/gift/env-green-pocket.webp"
                  alt=""
                  fill
                  sizes={ENV_SIZES}
                  className={s.envArt}
                  priority
                  onLoad={envLayerIn}
                  onError={envLayerIn}
                />
                <span className={s.envFrom}>
                  From {client.firstName}
                  <br />
                  {client.business}
                </span>
              </span>
              <span ref={flapRef} className={s.envFlap}>
                <span ref={flapOutRef} className={s.flapOut}>
                  <Image
                    src="/gift/env-green-flap-out.webp"
                    alt=""
                    fill
                    sizes={ENV_SIZES}
                    className={s.envArt}
                    priority
                    onLoad={envLayerIn}
                    onError={envLayerIn}
                  />
                  <span className={s.envName}>For {friendName}</span>
                </span>
                <span ref={flapInRef} className={s.flapIn}>
                  <Image src="/gift/env-green-flap-in.webp" alt="" fill sizes={ENV_SIZES} className={s.envArt} loading="eager" />
                </span>
              </span>
              <span ref={sealRef} className={s.seal}>
                <WaxSeal />
              </span>
              <button
                type="button"
                className={s.openHit}
                onClick={open}
                disabled={phase === "opening"}
                aria-label={`Open your gift from ${client.firstName} at ${client.business}`}
              />
            </>
          )}
        </div>

        {sealed && (
          <p ref={hintRef} className={`${s.tapHint} ${envFade}`}>
            <span className={s.touch}>Tap</span>
            <span className={s.mouse}>Click</span> to open
          </p>
        )}

        {phase === "open" && state === "sealed" && claim === "idle" && (
          <>
            <p className={`${s.flipHint} ${s.rise}`}>
              <span className={s.touch}>Tap</span>
              <span className={s.mouse}>Click</span> the card to flip it
            </p>
            <h1 ref={titleRef} tabIndex={-1} className={`${s.title} ${s.openTitle} ${s.rise}`}>
              {friendName}, {client.firstName} sent you $500 off a new website
            </h1>
            {siteLink(`${s.siteLink} ${s.openSite} ${s.rise}`, at(1))}
            <button
              type="button"
              className={`${s.button} ${s.openCta} ${s.rise}`}
              style={at(2)}
              onClick={() => startClaim("form")}
            >
              Claim your gift
            </button>
            <p className={`${s.underCta} ${s.rise}`} style={at(3)}>
              {daysLeftLine(daysLeft)}
            </p>
          </>
        )}

        {phase === "open" && state === "sealed" && claim === "done" && (
          <>
            <h1 ref={doneRef} tabIndex={-1} className={`${s.title} ${s.lateTitle} ${s.rise}`}>
              You&rsquo;re all set, {friendName}
            </h1>
            <p className={`${s.body} ${s.lateBody} ${s.rise}`} style={at(1)}>
              William will reach out
              {details?.phone && (
                <>
                  {" "}
                  at <strong>{details.phone}</strong>
                </>
              )}
              . Your $500 off doesn&rsquo;t expire.
            </p>
            <button type="button" className={`${s.quietLink} ${s.rise}`} style={at(2)} onClick={() => startClaim("fix")}>
              Wrong number? Fix it
            </button>
            <div className={`${s.after} ${s.rise}`} style={at(3)}>
              {notified && (
                <p className={s.afterRow}>
                  <span className={s.afterTick} aria-hidden="true">
                    <CheckIcon />
                  </span>
                  We let {client.firstName} know you claimed it.
                </p>
              )}
              {siteLink(`${s.siteLink} ${s.siteLinkSm}`)}
            </div>
          </>
        )}

        {phase === "open" && state === "claimed" && (
          <>
            <h1 className={`${s.title} ${s.lateTitle} ${s.rise}`}>Welcome back, {friendName}</h1>
            <p className={`${s.body} ${s.lateBody} ${s.rise}`} style={at(1)}>
              Your $500 off from {client.firstName} is saved, and it doesn&rsquo;t expire.
            </p>
            <div className={`${s.panel} ${s.panelTight} ${s.rise}`} style={at(2)}>
              <div className={s.panelText}>
                <h2 className={s.panelTitle}>Haven&rsquo;t heard from us yet?</h2>
                <p className={s.panelBody}>William usually replies within a day. Nudge him anytime.</p>
              </div>
              <a
                className={s.alt}
                href={`sms:${WILLIAM_PHONE}?&body=${encodeURIComponent(
                  `Hi William, it's ${friendName}. I claimed the gift from ${client.firstName}.`,
                )}`}
                onClick={() => track("gift_text_william")}
              >
                <MessageIcon />
                Text William
              </a>
            </div>
          </>
        )}

        {phase === "open" && state === "signed" && (
          <>
            <h1 className={`${s.title} ${s.lateTitle} ${s.rise}`}>Welcome aboard, {friendName}</h1>
            <p className={`${s.body} ${s.lateBody} ${s.rise}`} style={at(1)}>
              {possessive(client.firstName)} $500 came off the price of your new website.
            </p>
            <div className={`${s.panel} ${s.rise}`} style={at(2)}>
              <div className={s.passOn}>
                <span className={s.passOnMark} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="20" height="20" fill="#58b12c">
                    <circle cx="6" cy="6" r="4.7" />
                    <circle cx="14" cy="6" r="4.7" />
                    <circle cx="6" cy="14" r="4.7" />
                    <circle cx="14" cy="14" r="4.7" />
                  </svg>
                </span>
                <div className={s.panelText}>
                  <h2 className={s.panelTitle}>Pass it on</h2>
                  <p className={s.panelBody}>
                    Know someone who needs a website? Send them $500 off, and you&rsquo;ll get $500 toward your hosting,
                    SEO or upgrades.
                  </p>
                </div>
              </div>
              <button type="button" className={`${s.button} ${s.panelCta}`} onClick={passOn} disabled={passing}>
                {passing ? "One moment..." : "Send a gift"}
              </button>
              {passError && (
                <p className={s.error} role="alert">
                  {passError}
                </p>
              )}
            </div>
          </>
        )}

        {phase === "open" && state === "expired" && (
          <>
            <h1 className={`${s.title} ${s.lateTitle} ${s.rise}`}>Sorry {friendName}, this gift has expired</h1>
            <p className={`${s.body} ${s.lateBody} ${s.rise}`} style={at(1)}>
              It was good until {claimByLong}. You can still talk to us about a new site, or ask {client.firstName} to
              send you a new gift.
            </p>
            <Link className={`${s.button} ${s.expiredCta} ${s.rise}`} style={at(2)} href="/#contact">
              Get in touch anyway
            </Link>
            {siteLink(`${s.siteLink} ${s.siteLinkSm} ${s.centerLink} ${s.rise}`, at(3))}
          </>
        )}
      </main>
    </div>
  );
}

// The design's icons: 24 x 24, stroked in the text colour.

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a8 8 0 0 1-11.8 7.05L4 20l1.1-4.4A8 8 0 1 1 21 12z" />
    </svg>
  );
}

// A wax blob with a soft scalloped rim: 18 points on two radii, joined with
// curves through their midpoints. Fixed numbers, so server and client agree.
const SEAL_RIM = (() => {
  const n = 18;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = i % 2 ? 29.2 : 31;
    return [32 + r * Math.cos(a), 32 + r * Math.sin(a)];
  });
  const f = (v: number) => v.toFixed(2);
  const mid = (i: number) => {
    const [p, q] = [pts[i % n], pts[(i + 1) % n]];
    return `${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`;
  };
  let d = `M${mid(0)}`;
  for (let i = 1; i <= n; i++) d += `Q${f(pts[i % n][0])} ${f(pts[i % n][1])} ${mid(i)}`;
  return `${d}Z`;
})();

/** The seal, pressed with the Cloverfield mark: the C and its four-leaf clover. */
function WaxSeal() {
  const mark = (
    <>
      <path d="M40.92 23.97A12 12 0 1 0 40.92 40.03" fill="none" strokeWidth="5.4" />
      <circle cx="33" cy="29.7" r="2.55" stroke="none" />
      <circle cx="37.6" cy="29.7" r="2.55" stroke="none" />
      <circle cx="33" cy="34.3" r="2.55" stroke="none" />
      <circle cx="37.6" cy="34.3" r="2.55" stroke="none" />
    </>
  );
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="gift-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#4b4d53" />
          <stop offset="0.55" stopColor="#26272b" />
          <stop offset="1" stopColor="#151619" />
        </radialGradient>
      </defs>
      <path d={SEAL_RIM} fill="url(#gift-wax)" />
      <circle cx="32" cy="32" r="22.5" fill="none" stroke="rgb(0 0 0 / 0.35)" strokeWidth="1.6" />
      <circle cx="32" cy="32.8" r="22.5" fill="none" stroke="rgb(255 255 255 / 0.1)" />
      {/* pressed in: a dark edge below, the raised face above */}
      <g transform="translate(0 0.8)" fill="rgb(0 0 0 / 0.4)" stroke="rgb(0 0 0 / 0.4)">
        {mark}
      </g>
      <g fill="rgb(255 255 255 / 0.2)" stroke="rgb(255 255 255 / 0.2)">
        {mark}
      </g>
    </svg>
  );
}
