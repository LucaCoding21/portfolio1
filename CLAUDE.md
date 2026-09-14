# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio/agency website for **Cloverfield Studio** — a web design agency in Surrey BC. Live at `cloverfield.studio`.

## Commands

- `npm run dev` — start dev server (Next.js, localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config with next/core-web-vitals + next/typescript)

No test framework is configured.

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/postcss` plugin, no `tailwind.config` — theme is in `globals.css` using `@theme inline`)
- **GSAP** for scroll-driven and timeline animations
- **Framer Motion** for component transitions
- **Cal.com embed** (`@calcom/embed-react`) for booking
- **Resend** for email (contact API route is currently disabled — booking via Cal.com)
- Google Tag Manager + Google Analytics for tracking

## Architecture

**Routing:** Two pages — homepage (`/`) and work page (`/work`). Both are client components (`"use client"`).

**Homepage flow:** `LoadingScreen` (video preloader with GSAP animation) → on complete, `page.tsx` unlocks scroll, waits for layout reflow via double-rAF, then sets `ready` flag that triggers entry animations in `Hero` and `About`.

**Data:** Project data lives in `src/data/projects.ts`. `homepageProjects` is a filtered subset (by `HOMEPAGE_PROJECT_IDS`). The `/work` page shows all projects. Navigation items (`NAV_ITEMS`) are also exported from this file.

**Fonts:** Five Google Fonts loaded via `next/font` in `layout.tsx`, exposed as CSS variables: `--font-geist-sans`, `--font-outfit` (the main face), `--font-script` (Caveat), `--font-sometype` (Sometype Mono, legacy labels only), `--font-reenie` (Reenie Beanie, handwriting). Utility classes like `.glitch-text` and `.sight-nav-link` live in `globals.css`.

**Custom cursor:** `CustomCursor` component renders a custom cursor; native cursor is hidden via `cursor: none !important` in CSS (restored on touch devices).

**Path alias:** `@/*` maps to `./src/*`.

## Cloning a reference section 1:1 (playbook)

The user often asks to copy a section from another site "pixel for pixel", including motion, then restyle it to Cloverfield in a second pass. Do it from the source, not from screenshots.

1. **Open the reference in Chrome** (Claude in Chrome MCP). Find the section by its text, walk up to the `<section>`, and dump a tree of tags, classes, data attributes and text. Stash big strings in `window.__x` and page through them in slices under ~950 chars; the JS tool truncates output and blocks anything containing URLs or `=` (use `:` and `;` separators).
2. **Pull the source locally** with `curl` into the scratchpad: the stylesheet, the page HTML, and the JS bundle. Extract CSS rules by class-name regex, including `@media` blocks. For the animation code, grep the bundle for the component name or data attribute. Webpack sites lazy-load components: read the chunk name and hash map from the runtime and curl the chunk.
3. **Read computed styles** with `getComputedStyle` for every element that matters: font sizes, weights, line heights, tracking, paddings, gaps, colours, transforms, transitions. Note the viewport width. If the site uses `vw` or fluid `clamp()`, reproduce the formula rather than the px it resolved to.
4. **Derive motion numerically.** Read GSAP timelines from the chunk: trigger, start/end, scrub, eases, durations, staggers. For scrubbed transforms, sample `transform` at several `scrollY` values to confirm the range. CSS hover transitions come from computed `transition` plus the `:hover` rules.
5. **Capture interaction states** by hovering or clicking, then screenshot and zoom. The MCP tab runs hidden, so rAF, GSAP and CSS transitions stall: raise the window first with `osascript` (activate Chrome and select the tab by URL). `resize_window` does not change `innerWidth`; test breakpoints by injecting same-origin `<iframe>`s at 390 and 760 and screenshotting the region. Sites that block framing can only be checked from their CSS.
6. **Rebuild** as a client component with a CSS module (fluid tokens as `clamp()`) or Tailwind, GSAP with the same eases (`CustomEase` for cubic-beziers), and the same trigger points. Licensed fonts get the closest Google font, loaded via `next/font`, and say so. Keep the reference copy verbatim on the first pass; assets come from `public/`.
7. **Verify against numbers**, not just looks: compare section padding, container widths, element rects and font sizes between the reference tab and localhost at the same viewport. Then restyle to Cloverfield only when asked.

## Homepage state (September 2026)

Order in `HomeClient.tsx`: `Hero` → `LogoStrip` (Rulebase-style trust bar) → `GridNumbers` (Tresmares-style sticky stats, `id="about"`) → `SuccessStories` (Monolog-style hover-reel list, `id="work"`) → `WhyCloverfield` (portrait, hand labels, Lunchline-style plus boxes with bio panels) → `Philosophy` (Lunchline FAQ clone) → `Blackboard` (Lunchline formula board, `id="approach"`) → `Contact` → `Footer`. The old Work grid still renders on `/work`. Copy in the new sections is placeholder and marked as such at the top of each file. Fonts: Outfit for nearly everything, Reenie Beanie for handwriting, Geist for the tracked eyebrow. No Sometype Mono in new homepage work, no em dashes in copy, no tan or lime as brand colours.
