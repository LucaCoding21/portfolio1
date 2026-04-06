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

**Fonts:** Five Google Fonts loaded via `next/font` in `layout.tsx`, exposed as CSS variables: `--font-geist-sans`, `--font-cormorant`, `--font-playfair`, `--font-logo` (Instrument Serif), `--font-outfit`. Typography classes (`.logo`, `.headline`, `.section-heading`) are in `globals.css`.

**Custom cursor:** `CustomCursor` component renders a custom cursor; native cursor is hidden via `cursor: none !important` in CSS (restored on touch devices).

**Path alias:** `@/*` maps to `./src/*`.
