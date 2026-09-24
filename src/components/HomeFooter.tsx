"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/projects";
import { scrollToTop } from "@/lib/scrollToHash";

// The prompt sent to each assistant. Written as a neutral visitor question with no
// claims seeded in, so the answer comes from the site itself and reads as unscripted.
const AI_PROMPT =
  "Take a look at cloverfield.studio and tell me what Cloverfield Studio does, who they work with, " +
  "and how their approach turns a website into more customers.";

const AI_SERVICES = [
  {
    name: "ChatGPT",
    color: "#10A37F",
    href: (q: string) => `https://chatgpt.com/?q=${q}`,
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  {
    name: "Claude",
    color: "#D97757",
    href: (q: string) => `https://claude.ai/new?q=${q}`,
    path: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    name: "Perplexity",
    color: "#20B8CD",
    href: (q: string) => `https://www.perplexity.ai/search?q=${q}`,
    path: "M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z",
  },
  {
    name: "Google AI",
    color: "url(#gemini-fill)",
    href: (q: string) => `https://www.google.com/search?udm=50&q=${q}`,
    path: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
];

export default function HomeFooter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  /* The wordmark, like the nav logo: on the homepage it scrolls back up to
     the hero, elsewhere it's a plain link home. Modified clicks (new tab)
     are left alone. */
  const onWordmarkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.hash) history.pushState(null, "", "/");
    scrollToTop();
  };

  // Only play the reel while the footer is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "100px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const q = encodeURIComponent(AI_PROMPT);

  return (
    // The clip keeps the pinned footer hidden until the last section
    // scrolls up off it, so the page lifts away to reveal the reel. The
    // footer is 60svh tall on phones, 80svh from md, plus the corner tuck:
    // the negative margin slides it under the section's rounded corners.
    // It sticks to the viewport's bottom edge rather than a computed top, so
    // it stays flush when iOS Safari hides its toolbars and the viewport
    // grows past 100svh. The track above it (twice the footer's height)
    // gives the sticky room to ride up from.
    <div
      className="relative -mt-[28px] h-[calc(60svh+28px)] md:-mt-[48px] md:h-[calc(80svh+48px)]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="absolute inset-x-0 bottom-0 flex h-[200%] flex-col justify-end">
        <footer className="sticky bottom-0 h-1/2 w-full shrink-0 overflow-hidden bg-[#1a1613] text-white">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/footer/footer-rain-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src="/footer/footer-rain-mobile.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source src="/footer/footer-rain.mp4" type="video/mp4" />
          </video>

          {/* Shade for legibility behind the wordmark */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative flex h-full flex-col justify-between px-6 pt-[52px] pb-4 md:px-10 md:pt-[80px] md:pb-6 font-[family-name:var(--font-outfit)]">
            <div className="flex items-start justify-between gap-6 text-sm md:text-[15px]">
              <div className="flex flex-col items-start gap-1.5">
                <p className="font-medium text-white md:font-normal">Get an AI summary of Cloverfield</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {AI_SERVICES.map((s) => (
                    <a
                      key={s.name}
                      href={s.href(q)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ask ${s.name} about Cloverfield Studio`}
                      title={s.name}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white transition-transform duration-300 hover:scale-110"
                    >
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                        {s.name === "Google AI" && (
                          <defs>
                            <linearGradient id="gemini-fill" x1="0" y1="1" x2="1" y2="0">
                              <stop offset="0" stopColor="#1C7DFF" />
                              <stop offset="0.5" stopColor="#8C6CF5" />
                              <stop offset="1" stopColor="#F07BA8" />
                            </linearGradient>
                          </defs>
                        )}
                        <path d={s.path} fill={s.color} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              <nav className="flex flex-col items-end gap-1 md:flex-row md:flex-wrap md:justify-end md:gap-x-5">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-semibold text-white transition-opacity duration-300 hover:opacity-60 md:font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <Link
                href="/"
                aria-label="Cloverfield home"
                onClick={onWordmarkClick}
                className="block select-none whitespace-nowrap text-[calc((100vw_-_48px)/4.54)] md:text-[calc((100vw_-_80px)/4.54)] font-extrabold leading-[0.8] tracking-[-0.045em] text-white transition-opacity duration-300 hover:opacity-80"
              >
                cloverfield
              </Link>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/20 pt-4 text-sm text-white/60 md:mt-6">
                <p>Surrey, BC</p>
                <p>© {new Date().getFullYear()} Cloverfield Studio</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
