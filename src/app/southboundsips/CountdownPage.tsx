"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const LAUNCH_DATE = new Date("2026-03-01T00:00:00");

function calculateTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/southboundsips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');
        @keyframes sbs-fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sbs-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(0, -18px) scale(1.03); }
        }
        @keyframes sbs-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }
        .sbs-s1 { animation: sbs-fadeUp 1s ease-out 0.05s both; }
        .sbs-s2 { animation: sbs-fadeUp 1s ease-out 0.2s both; }
        .sbs-s3 { animation: sbs-fadeUp 1s ease-out 0.35s both; }
        .sbs-s4 { animation: sbs-fadeUp 1s ease-out 0.5s both; }
        .sbs-s5 { animation: sbs-fadeUp 1s ease-out 0.65s both; }
        .sbs-input::placeholder { color: rgba(47,78,126,0.3); }
        .sbs-input:focus {
          border-color: rgba(47,78,126,0.3) !important;
          box-shadow: 0 0 0 3px rgba(47,78,126,0.08);
        }
        .sbs-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(47,78,126,0.2);
        }
        .sbs-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      <div
        className="relative h-screen flex flex-col items-center justify-center pt-16 sm:pt-20 px-6 overflow-hidden"
        style={{ background: "#c9e5d6" }}
      >
        {/* ── Ambient orbs ── */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: "clamp(400px, 55vw, 700px)",
            height: "clamp(400px, 55vw, 700px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(47,78,126,0.06) 0%, transparent 60%)",
            top: "-14%",
            right: "-12%",
            animation: "sbs-float 11s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: "clamp(350px, 48vw, 600px)",
            height: "clamp(350px, 48vw, 600px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(222,127,52,0.08) 0%, transparent 55%)",
            bottom: "-10%",
            left: "-12%",
            animation: "sbs-float 13s ease-in-out infinite 3s",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(47,78,126,0.05) 0%, transparent 70%)",
            bottom: "20%",
            right: "15%",
            animation: "sbs-glow 9s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(222,127,52,0.05) 0%, transparent 70%)",
            top: "18%",
            left: "20%",
            animation: "sbs-glow 8s ease-in-out infinite 2s",
          }}
        />

        {/* ── Top Design ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] z-10">
          <Image
            src="/southbound/top-design.png"
            alt=""
            width={1500}
            height={750}
            className="w-[90vw] sm:w-[55vw] md:w-[50vw] lg:w-[45vw] h-auto max-w-none"
            priority
          />
        </div>
        {/* ── Top Design Left ── */}
        <div className="absolute top-0 left-[15%] -translate-x-1/2 -translate-y-[45%] z-9">
          <Image
            src="/southbound/top-design.png"
            alt=""
            width={800}
            height={400}
            className="w-[70vw] sm:w-[55vw] md:w-[50vw] lg:w-[45vw] h-auto"
            priority
          />
        </div>
        {/* ── Top Design Right ── */}
        <div className="absolute top-0 right-[15%] translate-x-1/2 -translate-y-[45%] z-9">
          <Image
            src="/southbound/top-design.png"
            alt=""
            width={800}
            height={400}
            className="w-[70vw] sm:w-[55vw] md:w-[50vw] lg:w-[45vw] h-auto"
            priority
          />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Logo */}
          <div className="sbs-s1 mb-3">
            <Image
              src="/southboundsips/logo.png"
              alt="South Bound Sips — Artisan Sodas & Traveling Bar"
              width={200}
              height={200}
              className="w-[150px] sm:w-[180px] h-auto"
              style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.08))" }}
              priority
            />
          </div>

          {/* Headline */}
          <h1
            className="sbs-s2 text-center"
            style={{
              fontFamily: "'Ephesis', cursive",
              fontSize: "clamp(2rem, 4vw, 2.2rem)",
              color: "#de7f34",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "none",
              marginBottom: "clamp(14px, 2.5vh, 24px)",
            }}
          >
            New Website Launching
          </h1>

          {/* ── Countdown ── */}
          <div
            className="sbs-s3 flex items-baseline justify-center gap-2 sm:gap-4"
            style={{ marginBottom: "clamp(6px, 1vh, 12px)" }}
          >
            {units.map(({ value }, i) => (
              <div key={i} className="flex items-baseline">
                <span
                  style={{
                    fontFamily: "Futura, 'Futura PT', 'Century Gothic', sans-serif",
                    fontSize: "clamp(3.2rem, 8vw, 4.5rem)",
                    color: "#2f4e7e",
                    fontWeight: 200,
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                  }}
                >
                  {mounted ? pad(value) : "--"}
                </span>
                {i < units.length - 1 && (
                  <span
                    className="mx-1 sm:mx-2"
                    style={{
                      fontFamily: "Futura, 'Futura PT', 'Century Gothic', sans-serif",
                      fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
                      color: "rgba(47,78,126,0.2)",
                      fontWeight: 200,
                      lineHeight: 1,
                    }}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div
            className="sbs-s3 flex justify-center gap-[clamp(28px,10vw,72px)]"
            style={{ marginBottom: "clamp(20px, 3.5vh, 36px)" }}
          >
            {units.map(({ label }) => (
              <span
                key={label}
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(47,78,126,0.7)",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div
            className="sbs-s4 flex items-center gap-3"
            style={{ marginBottom: "clamp(32px, 5vh, 50px)" }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(222,127,52,0.35))",
              }}
            />
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(222,127,52,0.35)",
              }}
            />
            <div
              style={{
                width: 40,
                height: 1,
                background:
                  "linear-gradient(270deg, transparent, rgba(222,127,52,0.35))",
              }}
            />
          </div>

          {/* Form */}
          {!submitted ? (
            <div className="sbs-s4 w-full max-w-[320px] text-center mx-auto">
              <p
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                  color: "rgba(47,78,126,0.55)",
                  fontStyle: "normal",
                  lineHeight: 1.5,
                  marginBottom: "clamp(12px, 2vh, 18px)",
                }}
              >
                Have a question or want to book? Drop your email below or
                email{" "}
                <a
                  href="mailto:events@southboundsips.com"
                  style={{ color: "#D4A574", textDecoration: "underline" }}
                >
                  events@southboundsips.com
                </a>
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="sbs-input w-full px-5 py-3 rounded-xl outline-none transition-all"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    background: "rgba(47,78,126,0.06)",
                    border: "1px solid rgba(47,78,126,0.15)",
                    color: "#2f4e7e",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    letterSpacing: "0.03em",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="sbs-btn w-full py-3 rounded-xl transition-all disabled:opacity-50"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    background: "#2f4e7e",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.68rem",
                    border: "none",
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>
          ) : (
            <div className="sbs-s4 text-center">
              <p
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                  color: "#de7f34",
                  fontStyle: "italic",
                  marginBottom: 6,
                }}
              >
                Thank you for reaching out!
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(47,78,126,0.5)",
                  letterSpacing: "0.02em",
                }}
              >
                We&rsquo;ll get back to you shortly.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="sbs-s5 absolute bottom-4"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.48rem",
            color: "rgba(201,229,214,0.18)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          South Bound Sips &mdash; Artisan Sodas &amp; Traveling Bar
        </p>
      </div>
    </>
  );
}

