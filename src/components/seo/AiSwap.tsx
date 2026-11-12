/**
 * The small white tile after "AI" in the /seo headline (Nov 9 2026): the
 * ChatGPT, Gemini and Claude marks take turns, one every 2.1s, sliding up
 * through the tile. Pure CSS (keyframes in SeoPage.module.css), so the page
 * stays a server component; with reduced motion it holds on ChatGPT. The
 * marks are the brands' own, from the LobeHub icon set. Decorative only: the
 * headline already says "AI" to screen readers.
 */

import { CLAUDE_D, OPENAI_D } from "./marks";
import s from "./SeoPage.module.css";

export default function AiSwap() {
  return (
    <span className={s.aiTile} aria-hidden>
      <span className={s.aiLayer}>
        <svg viewBox="0 0 24 24" className={s.aiMark}>
          <path fill="#111113" fillRule="evenodd" d={OPENAI_D} />
        </svg>
      </span>
      <span className={s.aiLayer}>
        <svg viewBox="0 0 24 24" className={s.aiMark}>
          <defs>
            <linearGradient id="seoGemGreen" gradientUnits="userSpaceOnUse" x1="7" x2="11" y1="15.5" y2="12">
              <stop stopColor="#08B962" />
              <stop offset="1" stopColor="#08B962" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="seoGemRed" gradientUnits="userSpaceOnUse" x1="8" x2="11.5" y1="5.5" y2="11">
              <stop stopColor="#F94543" />
              <stop offset="1" stopColor="#F94543" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="seoGemYellow" gradientUnits="userSpaceOnUse" x1="3.5" x2="17.5" y1="13.5" y2="12">
              <stop stopColor="#FABC12" />
              <stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
            </linearGradient>
            <path
              id="seoGem"
              d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
            />
          </defs>
          <use href="#seoGem" fill="#3186FF" />
          <use href="#seoGem" fill="url(#seoGemGreen)" />
          <use href="#seoGem" fill="url(#seoGemRed)" />
          <use href="#seoGem" fill="url(#seoGemYellow)" />
        </svg>
      </span>
      <span className={s.aiLayer}>
        <svg viewBox="0 0 24 24" className={s.aiMark}>
          <path
            fill="#D97757"
            d={CLAUDE_D}
          />
        </svg>
      </span>
    </span>
  );
}
