# Landing Page Handoff — Command Center demo profiles (Pacific Fasteners + Summit Ridge)

This doc is for the Claude Code instance building the **marketing landing page**. Your job: sell this software with UI/UX snippets and animations that are **pixel-for-pixel 1:1** with the real product. Everything below is pulled directly from the live codebase, not from memory. When in doubt, the source of truth is:

- `app/globals.css` — all design tokens (CSS variables)
- `tailwind.config.ts` — shadows, radii, keyframes, animations
- `components/ui/*` — Card, Button, Input, Dialog primitives
- `components/demo/*` and `components/summit/*` — the demo dashboards, pills, charts, ask box
- `components/app-shell.tsx` — the frosted sidebar + floating content panel chrome
- `lib/demo/config.ts` and `lib/summit/config.ts` — the two demo company identities

Do NOT invent a new visual language for the landing page snippets. The snippets ARE the product. A prospect who books a demo after seeing the landing page should feel zero visual gap when the real app opens.

---

## 1. What this software is

**Command Center** is an owner-facing operations copilot for small businesses. One screen that pulls the whole business together — CRM, orders/jobs, accounting, schedule, inventory/memberships — cross-checks it continuously, and surfaces what actually needs the owner's attention. On top sits an AI Ask box that answers plain-English questions about the business using the exact same data every page uses.

There are **two demo company profiles** (this is what the landing page markets — not the internal agency tooling):

### Profile 1: Pacific Fasteners Ltd (`lib/demo/`)

- **Who**: a building-hardware distributor. Sells fasteners/hardware to dealers across BC, Alberta & Washington. Two warehouses (Surrey BC, Calgary AB).
- **Brand mark**: initials `PF`, logo background `#0e7490` (teal/cyan-700).
- **Modules (sidebar nav)**: Dashboard, Ask, Alerts, Notes · Dealers, Pipeline, Contacts (CRM) · Orders, Inventory (Operations) · QuickBooks (Finance) · Monday report, Integrations (Company).
- **Signature stories**: dealers going quiet (ordering cadence dropping vs. their own history), overdue AR past 45 days, orders at risk of shipping late.

### Profile 2: Summit Ridge Heating & Air (`lib/summit/`)

- **Who**: a 21-year-old HVAC company in the Lower Mainland BC (Vancouver, Burnaby, Coquitlam, Surrey, Langley, Maple Ridge, North Van). Owner is also the lead installer. Runs a membership program called **Comfort Club**.
- **Brand mark**: initials `SR`, logo background `#c2410c` (ember orange, orange-700).
- **Modules (sidebar nav)**: Dashboard, Ask, Alerts, Notes · Customers · Jobs, Schedule, Memberships (Operations) · Money · Marketing, Scoreboard (Growth) · Monday report, Connections (Company).
- **Signature stories**: Comfort Club members lapsing or not booking their tune-up, money sitting in unsold estimates, callbacks trending up by tech.

Both dashboards share the same skeleton (deliberately): copilot Ask box up top, four KPI tiles, a "Needs attention" alert card, one revenue chart, a live activity feed. The one-config reskin (`config.ts`) is itself a selling point: the product molds to any company.

---

## 2. Why this software is good — the pitch you're writing copy for

**Information is the product.** The core argument, in plain words:

An owner _can_ check one number in a spreadsheet. What they can't do is check twenty numbers across five systems every morning, join them, compare them to history, and notice the one that moved. That's what this does.

The concrete claims (all true of the demo, use these in copy):

1. **One source of truth, everywhere.** Every number on the dashboard, on every module page, in every alert, in the Monday report, and in every AI answer comes from the **same query layer** (`lib/demo/queries.ts` / `lib/summit/queries.ts`). Click any KPI and the module page it opens shows the same number. The AI cites the same number. Nothing ever disagrees with itself. In the demo this is literally enforced in code — the dashboard, the modules, and the AI call the same functions. "Clicking through always reconciles" is a comment in the source.

2. **Cross-checks a human can't sustain.** These are joins across systems, not single cells:
   - "Quiet dealers" = current ordering cadence vs. _that dealer's own_ historical cadence, priced out as annual revenue at risk ("$310k/yr at risk").
   - "Overdue AR" = the accounting system's aging joined with CRM contact info, so the alert is actionable (who to call), not just a number.
   - "Callbacks up" = warranty re-visits joined to jobs and techs, so the answer is _why_, not just _that_.
   - "Members lapsing" = membership status joined with the schedule (paid Comfort Club members who never booked the tune-up they already paid for).
   - "Unsold estimates" = quote pipeline aged and totaled — money sitting on the table.

   A spreadsheet holds the data. It doesn't _watch_ it.

3. **It comes to you.** Alerts feed and a **Monday report** (a weekly owner email/page) mean the owner doesn't have to remember to look. Severity is triaged (red/amber/blue/green dots) so five things need attention, not five hundred rows.

4. **Ask anything, in plain English.** The Ask box ("Ask anything about the business…") answers questions like a sharp operations manager would — with real numbers, from the same data — and every dashboard suggests full-sentence starter questions so there's no blank-page problem.

5. **Live-synced, visibly.** The "Connected · synced 4 min ago · 1,284 records" badge with a gently pinging green dot is deliberate UI: it tells the owner the numbers are current without them asking.

6. **Calm by design.** The home screen is "deliberately calm" (a design comment in the source): the four numbers an owner checks first, what needs attention, one revenue picture, one feed. Depth lives one click away or one question away. This is the anti-dashboard-clutter pitch.

Tone for copy: confident, concrete, no hype-speak. Talk like the product talks (see §7 voice rules).

---

## 3. Design tokens — copy these exactly

The app is a **light theme only** ("Arc-style frosted dashboard"): a soft grey frosted canvas, with the main content on a clean **white card floating above the grey** with a gap all around. Hairline borders, soft shadows, blue primary, Inter. Whitespace is a feature. **Never use a dark theme for product snippets.**

### Colors (CSS custom properties, HSL — from `app/globals.css`)

| Token                     | HSL             | ≈ Hex     | Use                                                                        |
| ------------------------- | --------------- | --------- | -------------------------------------------------------------------------- |
| `--background`            | `220 16% 96.3%` | `#f4f5f7` | The frost/canvas layer behind everything                                   |
| `--foreground`            | `220 18% 16%`   | `#212630` | Primary text                                                               |
| `--card`                  | `0 0% 100%`     | `#ffffff` | All cards/panels                                                           |
| `--glass`                 | `220 16% 95%`   | `#f1f2f5` | Frosted chrome (used translucent, e.g. `bg-glass/70` + `backdrop-blur-xl`) |
| `--primary`               | `221 83% 53%`   | `#2563eb` | Blue primary (Tailwind blue-600) — buttons, links, the Sparkles AI accent  |
| `--secondary` / `--muted` | `220 14% 94%`   | `#eeeff2` | Grey wells, muted chips                                                    |
| `--accent`                | `220 15% 92%`   | `#e8eaee` | Hover fills                                                                |
| `--muted-foreground`      | `220 9% 46%`    | `#6b7280` | Secondary text                                                             |
| `--border`                | `220 13% 85%`   | `#d4d7de` | Hairline borders (often used as `border-border/70`)                        |
| `--destructive`           | `0 72% 51%`     | `#dc2626` | Destructive actions                                                        |
| `--ring`                  | `221 83% 53%`   | `#2563eb` | Focus rings                                                                |

### Status palette (dots, pills, severity)

| Token             | HSL           | ≈ Hex     |
| ----------------- | ------------- | --------- |
| `--status-grey`   | `220 9% 46%`  | `#6b7280` |
| `--status-blue`   | `221 83% 53%` | `#2563eb` |
| `--status-green`  | `142 72% 35%` | `#199a48` |
| `--status-amber`  | `32 95% 40%`  | `#c76c05` |
| `--status-red`    | `0 72% 46%`   | `#ca2121` |
| `--status-purple` | `262 68% 52%` | `#9b31d8` |

Status colors are always used as: `border-status-X/30 bg-status-X/10 text-status-X` for pills, `bg-status-X` for the little 2px dots. Never full-saturation fills.

### Radius, shadows, type

- `--radius: 0.85rem` (13.6px). Tailwind mapping: `rounded-lg` = 0.85rem, `rounded-md` = radius − 4px, `rounded-sm` = radius − 6px. The Ask box and the floating content panel use `rounded-2xl`. Pills/chips/avatars are `rounded-full`.
- Shadows (soft, neutral, layered — from `tailwind.config.ts`):
  - `shadow-card`: `0 1px 2px 0 rgb(20 24 33 / 0.06)` — every resting card
  - `shadow-panel`: `0 1px 2px 0 rgb(20 24 33 / 0.04), 0 8px 20px -14px rgb(20 24 33 / 0.12)` — the big floating white content panel
  - `shadow-pop`: `0 4px 16px -4px rgb(20 24 33 / 0.14), 0 2px 4px -2px rgb(20 24 33 / 0.08)` — hover-lift state, tooltips, popovers
  - `shadow-glass`: `0 1px 2px 0 rgb(20 24 33 / 0.05), 0 16px 40px -18px rgb(20 24 33 / 0.22)` — large overlays
- Font: **Inter** with `font-feature-settings: 'cv11', 'ss01'` (the alternate single-story a/open digits look — keep this, it's part of the identity). Fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`. `-webkit-font-smoothing: antialiased`.
- Numbers always get `tabular-nums`.
- Icons: **lucide** only, almost always `strokeWidth={1.75}` (submit arrows use 2). Common sizes: `h-3.5 w-3.5` inline with labels, `h-4 w-4` in headers/buttons.
- Text scale is compact: page titles `text-base`/`text-lg font-semibold tracking-tight`, body `text-sm`, secondary `text-xs`, micro-labels `text-[10px]`/`text-[11px]`, KPI values `text-2xl font-semibold leading-tight tracking-tight tabular-nums`.
- Selection color: `hsl(var(--primary) / 0.18)`. Scrollbars: thin (10px), pill-shaped thumb `hsl(220 10% 76%)`.

---

## 4. Component recipes — exact Tailwind class strings

These are lifted verbatim from the product. Reproduce them exactly in landing-page snippets.

### The card (every panel)

```
rounded-lg border border-border/70 bg-card text-card-foreground shadow-card
```

### The Ask box (THE hero element — the product's signature)

A white `rounded-2xl` input with a faint blue halo, a blue Sparkles icon at left, a circular blue submit button at bottom-right:

```html
<form
  class="relative rounded-2xl border border-primary/20 bg-card
  shadow-[0_1px_2px_0_rgb(20_24_33/0.05),0_0_15px_-2px_hsl(var(--primary)/0.13)]
  transition-colors focus-within:border-primary/40"
>
  <Sparkles
    class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
    strokeWidth="{1.75}"
  />
  <input
    placeholder="Ask anything about the business…"
    class="w-full rounded-2xl bg-transparent py-3.5 pl-11 pr-12 text-sm outline-none placeholder:text-muted-foreground"
  />
  <button
    class="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary text-white ..."
  >
    <ArrowUp />
  </button>
</form>
```

Below it, **suggestion chips** — full example sentences (never fragments):

```
inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5
text-xs text-muted-foreground shadow-card transition-colors hover:border-primary/40 hover:text-foreground
```

each with a `<Sparkles class="h-3 w-3 text-primary/70" strokeWidth={1.75} />` prefix.

Real suggestion copy (use these verbatim):

- Pacific: "Which dealers are going quiet?" · "Who owes us money past 45 days?" · "Which orders are at risk of shipping late this week?"
- Summit: "Which members are lapsing or have not booked their tune-up?" · "How much money is sitting in unsold estimates?" · "Why are callbacks up?"

### KPI tile (the four-numbers row)

Grid: `grid grid-cols-2 gap-3.5 lg:grid-cols-4`. Each tile is a Card that lifts on hover:

```
h-full p-4 transition-all duration-150 hover:-translate-y-px hover:shadow-pop
```

- Hero variant (Revenue MTD): add `border-primary/30 bg-primary/[0.04]`, icon `text-primary`.
- Warning tones: `border-status-red/30` (value also `text-status-red`) or `border-status-amber/40`.
- Structure: label row (`flex items-center gap-1.5 text-xs font-medium text-muted-foreground` + 3.5×3.5 icon) → value (`mt-2 truncate text-2xl font-semibold leading-tight tracking-tight tabular-nums`) → context line (`mt-1.5 text-[11px] text-muted-foreground`) with an optional delta pill: `inline-flex items-center gap-0.5 rounded-full px-1 py-px font-medium tabular-nums` in `bg-status-green/10 text-status-green` (up, ArrowUpRight) or `bg-status-red/10 text-status-red` (down, ArrowDownRight).

Real KPI content — Pacific: Revenue MTD (hero, "vs last year" delta) · Open orders ("38 orders in the pipe") · Overdue AR, red ("12 invoices past due") · Quiet dealers, amber ("$310k/yr at risk"). Summit: Revenue MTD (hero) · Booked this week, % ("of tech hours, Mon to Sat") · unsold estimates · membership number.

### Section header (top of every card)

```
flex items-center justify-between gap-3 border-b border-border px-4 py-3
```

Left: 4×4 lucide icon (`text-muted-foreground`, or `text-status-amber` for "Needs attention") + `text-sm font-semibold` title + optional count pill `rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground`. Right: a quiet link `text-xs font-medium text-muted-foreground hover:text-foreground` with a `ChevronRight h-3.5 w-3.5`.

### Alert row (the "Needs attention" feed)

```
flex items-start gap-3 rounded-lg border border-border/70 bg-card px-3 py-2.5 shadow-card
transition-all duration-150 hover:-translate-y-px hover:shadow-pop
```

Anatomy: severity dot (`mt-1.5 h-2 w-2 rounded-full bg-status-{red|amber|blue|green}`) → title (`text-sm font-medium truncate`) + detail line (`mt-0.5 text-xs text-muted-foreground truncate`) → category chip (`rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground`) → `ChevronRight h-4 w-4 text-muted-foreground`.

### Status pill (Healthy / Slipping / At risk / Dormant / New)

```
inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium
```

with a `h-1.5 w-1.5 rounded-full` dot. Tones: healthy=green, slipping=amber, at_risk=red, new=blue (all `border-X/30 bg-X/10 text-X`), dormant=`border-border bg-secondary text-muted-foreground` with grey dot.

### "Connected" live-sync badge (great animation snippet)

```
inline-flex items-center gap-2 rounded-full border border-status-green/30 bg-status-green/[0.07]
px-2.5 py-1 text-xs font-medium text-foreground
```

containing a pinging dot:

```html
<span class="relative flex h-2 w-2">
  <span
    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-green/60 [animation-duration:2.4s]"
  ></span>
  <span
    class="relative inline-flex h-2 w-2 rounded-full bg-status-green"
  ></span>
</span>
Connected
<span class="font-normal text-muted-foreground"
  >synced 4 min ago · 1,284 records</span
>
```

### Buttons

Base (note the physical press): `rounded-md text-sm font-medium duration-150 active:scale-[0.97]` + `focus-visible:ring-2 focus-visible:ring-ring`. Variants: default `bg-primary text-primary-foreground shadow-card hover:bg-primary/90`; outline `border border-border bg-card shadow-card hover:bg-accent`; ghost `hover:bg-accent`. Sizes: default `h-9 px-4`, sm `h-8 px-3 text-xs`, icon `h-9 w-9`.

### Staff/avatar chip

`inline-flex items-center justify-center rounded-full font-semibold text-white`, `h-6 w-6 text-[10px]` (md) or `h-5 w-5 text-[9px]` (sm), solid background color per person. Company logo marks are the same idea: round chip, two initials, brand color background (`#0e7490` PF, `#c2410c` SR).

### Page header pattern

```
h1: text-lg font-semibold tracking-tight        → "Good morning"
sub: mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground
     → <CalendarDays 3.5/> Thursday, July 10 · <RefreshCw 3/> 4 sources synced 6 min ago
```

Module pages use `text-base font-semibold` + `text-xs text-muted-foreground` description.

### Layout chrome (if you show a full-app frame)

- Canvas: `#f4f5f7` everywhere.
- The content lives on a floating white panel: `rounded-2xl border border-border/70 bg-card shadow-panel`, inset from the viewport edges (`bottom-3 right-3 top-3`), sitting right of the sidebar.
- Sidebar: sits ON the frost (no card), `px-3 py-4 backdrop-blur-xl`, grouped nav with tiny group labels, round brand mark + name at top. Width animates `300ms cubic-bezier(0.32, 0.72, 0, 1)`.
- Content column: `mx-auto max-w-5xl space-y-5`, entering with `animate-fade-in`.

---

## 5. Motion language — exact timings

All motion is quick, soft, and physical. Nothing bounces except toasts. Nothing moves more than a few px.

| Animation     | Spec                                                                                                | Where                                     |
| ------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `fade-in`     | opacity 0→1, **120ms ease-out**                                                                     | page/content entry                        |
| `slide-up`    | opacity 0→1 + translateY(6px)→0, **140ms ease-out**                                                 | list items, popover content               |
| `overlay-in`  | opacity, **200ms ease-out**                                                                         | dialog scrim                              |
| `content-in`  | fade + scale 0.98→1, **220ms cubic-bezier(0.32, 0.72, 0, 1)**                                       | dialog panel                              |
| `toast-pop`   | rise 18px w/ overshoot (−5px, 1.015 scale) then settle, **380ms cubic-bezier(0.34, 1.56, 0.64, 1)** | toasts                                    |
| `toast-timer` | scaleX 1→0, **10s linear**                                                                          | toast countdown bar                       |
| hover-lift    | `transition-all duration-150 hover:-translate-y-px hover:shadow-pop`                                | KPI tiles, alert rows, any clickable card |
| button press  | `active:scale-[0.97]`, 150ms                                                                        | every button                              |
| sidebar       | width/left, **300ms cubic-bezier(0.32, 0.72, 0, 1)**                                                | collapse/expand                           |
| ping dot      | `animate-ping` at **2.4s** duration, `bg-status-green/60`                                           | Connected badge                           |

Two signature shimmer effects (both in `globals.css`, great for an "AI thinking" landing animation):

- **`.shimmer-text`** — AI thinking state. Muted grey text (`hsl(220 9% 64%)`) with a darker band (`hsl(222 20% 28%)`) sweeping through the letters via background-clip:text, `2.2s linear infinite`, background-size 200%. "The motion lives inside the letters, nothing jumps."
- **`.shimmer-surface`** — skeleton loading. A `white/0.55` gradient band sweeps left→right across a `bg-secondary` block, `1.6s ease-in-out infinite`.

Rule of thumb: entrances 120–220ms ease-out, hovers 150ms, one springy exception (toast), infinite loops only for "alive" states (sync dot, AI thinking, skeletons).

---

## 6. Charts — hand-rolled SVG, specific look

No chart library. Everything is lightweight inline SVG (`components/demo/charts.tsx`) with this exact styling:

- Grid lines: hairline `#e7e9ee` (one step off the white card). Axis text: `#6b7280`, tiny.
- Marks are thin; **bars have 4px rounded data-ends**; the in-progress month renders "soft" (reduced opacity).
- Validated CVD-safe categorical palette, in this order: blue `#2a78d6`, aqua `#1baf7a`, yellow `#eda100`, green `#008300`, violet `#4a3aa7`, red `#e34948` (+orange `#eb6834`). Revenue charts default to the blue.
- Money formatting: `$1.2M` / `$310k` / `$840` (`fmtMoneyCompact`).
- Tooltips: `rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-pop`, flips near the right edge.
- Also used: `BarRowList` — horizontal labeled bars for "top dealers/top jobs" style rankings.

If the landing page animates a chart, animate bars growing in with the same restraint (short, ease-out, no bouncing).

---

## 7. Voice & copy rules (owner-mandated, non-negotiable)

- **Simple English.** Write like you'd talk to a busy owner: "Who owes us money past 45 days?" not "Accounts receivable aging analysis."
- **NO em dashes in UI copy.** Use periods, commas, or `·` middots (the app uses `·` as its separator everywhere).
- **Full sentences for example prompts/chips.** Never keyword fragments.
- **No information hidden in tooltips.** If it matters, it's visible.
- Numbers are concrete and specific: "12 invoices past due", "$310k/yr at risk", "synced 4 min ago · 1,284 records". Specificity is the aesthetic.
- Feature names as the product uses them: **Ask**, **Alerts**, **Monday report**, **Needs attention**, **Comfort Club** (Summit's membership program), **Connected**.

---

## 8. Suggested landing-page snippet inventory

Highest-impact real-UI moments to recreate (all specced above):

1. **The Ask box** with suggestion chips, ideally typing a question and shimmer-text "thinking" then an answer with real numbers. This is the hero.
2. **The four KPI tiles** (hero blue + one red + one amber) with hover-lift.
3. **"Needs attention" card** — SectionHeader (amber AlertTriangle, count pill "5") + 3–4 alert rows with severity dots. Great as a staggered `slide-up` entrance.
4. **The Connected badge** with the pinging dot — the "always in sync" proof point.
5. **Health pills** morphing Healthy → Slipping → At risk next to a dealer/customer row — visualizes "it watches so you don't have to".
6. **Monday report** teaser — the `Mail` icon outline button ("Monday report ›") or a small email-style card.
7. **The one-config reskin**: PF teal mark flipping to SR orange mark with the sidebar nav relabeling (Dealers/Orders/Inventory ↔ Customers/Jobs/Memberships) — sells "molds to your business".
8. A **shimmer-surface skeleton** resolving into a loaded card, for polish.

For any full-app frame: grey `#f4f5f7` canvas, blurred sidebar on the left, white `rounded-2xl shadow-panel` content panel floating inset, `max-w-5xl` content with `space-y-5`.

---

## 9. Hard don'ts

- No dark mode, no gradients-as-decoration, no glassmorphism beyond the sidebar/chrome blur described.
- No raw Tailwind grays (`gray-100`, `slate-200`…) — only the token colors above.
- No other icon set, no filled icons. Lucide, strokeWidth 1.75.
- No heavy shadows, no borders darker than `--border`, no full-saturation status fills.
- No bouncy/springy motion except the toast pop. No parallax circus.
- No em dashes in any UI-style copy. No fake vague numbers ("$1M+!") — the product's credibility is specific, reconciling numbers.
- Don't market the internal agency profile (Cloverfield tooling, tasks/projects/transcripts). The landing page is about the owner-copilot product as embodied by the two demo profiles.
