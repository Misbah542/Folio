# Portfolio Redesign — Design Spec

**Date:** 2026-04-19  
**Scope:** End-to-end visual redesign of the personal portfolio site. All GSAP scroll animations, ScrollSmoother, Three.js character (head tracking, scroll-driven movement), and 3D physics TechStack are preserved. Only CSS/visual properties change.

---

## Design Direction

- **Style:** Minimalist modern, spacious + structured grid, editorial hierarchy
- **Mode:** Mixed dark/light — alternating section backgrounds create visual rhythm
- **Accents:** Dual accent — green (`#3DDC84`) for interactive/highlight, violet (`#673AB7`) for structural/watermark
- **Fonts:** Keep current — Space Grotesk (body/labels) + Bricolage Grotesque (headings/display)

---

## Global Design Tokens

```css
--bg-dark:       #0D0D0D
--bg-light:      #F7F7F5
--text-dark:     #0D0D0D
--text-light:    #F0EFE9
--accent-green:  #3DDC84
--accent-violet: #673AB7
--muted-dark:    #A0A0A0
--muted-light:   #5F6368
--border-dark:   rgba(255,255,255,0.08)
--border-light:  rgba(0,0,0,0.10)
```

**Section background sequence (top → bottom):**
Landing → About → WhatIDo → Career → Work → TechStack → Contact  
Dark → Light → Dark → Light → Dark → Light → Dark

**Section number watermarks:** Each section has a large `01`–`06` numeral in Bricolage Grotesque at 120px, low opacity, positioned top-left. Dark sections use white at 5% opacity; light sections use `--accent-violet` at 10% opacity.

**Section label pattern:** Every section opens with a small uppercase label in brackets — e.g. `[ ABOUT ME ]` — Space Grotesk, 11px, letter-spacing 4px.

---

## Interaction Constraints (Do Not Touch)

- `ScrollSmoother` initialization and `smoother` export in `Navbar.tsx`
- `setCharTimeline()` and `setAllTimeline()` in `GsapScroll.ts`
- `handleHeadRotation()` bone targeting in `Scene.tsx`
- `WhatIDo` expand/click interaction logic (`handleClick`, `what-content-active` classes)
- `TechStack` physics — `Pointer`, `SphereGeo`, `Physics`, `Canvas` — entirely untouched
- `Cursor.tsx` and `Cursor.css` — entirely untouched
- `Loading.tsx` and `Loading.css` — entirely untouched
- `ScrollTrigger` class names used as animation targets — preserve all existing class names

---

## Section Designs

### Navbar

- Fixed, full-width, transparent background with `backdrop-filter: blur(12px)`
- Semi-transparent overlay adapts to dark/light section via scroll-toggled CSS class
- Logo `MH` — Bricolage Grotesque, bold — `--text-light` on dark sections, `--text-dark` on light
- Nav links — Space Grotesk, 13px, uppercase, letter-spacing 3px, right-aligned
- Hover: keep existing slide animation, accent color `--accent-green`
- No border or shadow — blur only

---

### Landing (Dark — `#0D0D0D`)

**Ambient glow circles:** Keep both; increase opacity slightly — green top-left `0.4`, violet right `0.3`.

**Left block (name):**
- Remove "Hi there, I'm" h2
- Add label: `[ ANDROID DEVELOPER ]` — Space Grotesk, 11px, letter-spacing 4px, `--accent-green`, uppercase
- `MISBAH / UL HAQUE` — Bricolage Grotesque, bold, 72px desktop / 40px mobile, `--text-light`, line-height 0.9
- Thin 1px `--accent-green` horizontal rule below name, 60px wide

**Right block (role):**
- Cycling text animation (BUILDING / MODERN / MOBILE / TV) — keep logic, recolor to `--accent-green`, Bricolage Grotesque, 80px+ desktop
- "Android Apps" label below — `--muted-dark`
- Remove "Android Developer" h3 (consolidated into left label)

**Bottom fade:** `transparent → #0D0D0D`  
**Character rim glow:** Keep animation, `#3DDC84` bloom color

---

### About (Light — `#F7F7F5`)

**Top edge:** Gradient `#0D0D0D → #F7F7F5` for smooth character transition.

**Layout:** Two-column grid, 40% / 60% split on desktop.

**Left column:**
- Watermark `01` — Bricolage Grotesque, 120px, `--accent-violet` at 15% opacity
- Label: `[ ABOUT ME ]` — Space Grotesk, 11px, `--muted-light`, uppercase
- Heading: `About` — Bricolage Grotesque, 72px, `--text-dark`

**Right column:**
- Paragraph — Space Grotesk, 18px, `--text-dark`, line-height 1.75, max 65ch
- Thin 1px `--border-light` rule above paragraph
- Two stat pills below: `4+ Years` and `3 Roles` — `#0D0D0D` bg, `--text-light`, 12px Space Grotesk, rounded

---

### WhatIDo (Dark — `#0D0D0D`)

**Header:**
- Label: `[ WHAT I DO ]` — `--accent-green`
- Watermark `02` — white at 5% opacity
- Heading: `What I Do` — Bricolage Grotesque, 72px, `--text-light`

**Cards (4):**
- Border: `1px solid var(--border-dark)` — replaces dashed SVG borders
- Background: `rgba(255,255,255,0.03)`
- Hover: border → `1px solid var(--accent-green)`, bg → `rgba(61,220,132,0.05)` — no layout shift
- `h3` — Space Grotesk, 13px, letter-spacing 3px, `--accent-green`, uppercase
- `h4` — Bricolage Grotesque, 22px, `--text-light`
- `p` — Space Grotesk, 15px, `--muted-dark`, line-height 1.7
- Tags — `rgba(255,255,255,0.07)` bg, `--text-light`, 11px pill style
- Arrow indicator — recolor `--accent-green`
- Grid: 2×2 desktop, 1-col mobile
- Touch expand/click logic: untouched

---

### Career (Light — `#F7F7F5`)

**Header:**
- Label: `[ EXPERIENCE ]` — `--muted-light`
- Watermark `03` — `--accent-violet` at 10% opacity
- Heading: `My Career & Experience` — Bricolage Grotesque, 72px, `--text-dark`

**Timeline:**
- Left rail: 1px solid `--border-light` vertical line, full section height
- Entry dot: 8px filled circle, `--accent-violet`, on the rail
- Year label — Bricolage Grotesque, 13px, `--accent-violet`, uppercase, left of entry
- Role `h4` — Space Grotesk, 13px, letter-spacing 2px, `--muted-light`, uppercase
- Company `h5` — Bricolage Grotesque, 22px, `--text-dark`, normal weight
- Body `p` — Space Grotesk, 16px, `--text-dark`, line-height 1.75
- Entry separator: 1px `--border-light` horizontal rule

---

### Work (Dark — `#0D0D0D`)

**Header:**
- Label: `[ SELECTED WORK ]` — `--accent-green`
- Watermark `04` — white at 5% opacity
- Heading: `My Work` — Bricolage Grotesque, 72px, `--text-light`

**Carousel slide:**
- Background numeral `01`/`02` — Bricolage Grotesque, 100px, `--accent-green` at 20% opacity
- Title `h4` — Bricolage Grotesque, 36px, `--text-light`
- Category — Space Grotesk, 12px, letter-spacing 3px, `--muted-dark`, uppercase
- Tool tags — same dark pill style as WhatIDo
- Image: `1px solid var(--border-dark)` border, no shadow

**Navigation:**
- Replace icon arrows with text: `← PREV` / `NEXT →` — Space Grotesk, 12px, `--muted-dark`, hover `--accent-green`, no bg/border
- Dot indicators → thin 1px horizontal progress bar with green fill sliding between positions

---

### TechStack (Light — `#F7F7F5`)

**Header:**
- Label: `[ TECH STACK ]` — `--muted-light`
- Watermark `05` — `--accent-violet` at 10% opacity
- Heading: `My Android Techstack` — Bricolage Grotesque, 72px, `--text-dark`

**Descriptor:** `[ drag to interact ]` — Space Grotesk, 11px, `--muted-light`, centered below heading.

**Physics canvas:** Entirely untouched. AO color update: `#0f002c → #1a0a2e` (warmer violet, blends better on light bg). Canvas transparent — section bg shows through.

---

### Contact (Dark — `#0D0D0D`)

**Top border:** 1px solid `var(--border-dark)`.

**Header:**
- Label: `[ GET IN TOUCH ]` — `--accent-green`
- Watermark `06` — white at 5% opacity
- Heading: `Contact` — Bricolage Grotesque, 72px, `--text-light`

**Layout:** 3-column grid desktop, stacked mobile.

**Connect column:**
- Label `h4` "Connect" — Space Grotesk, 11px, letter-spacing 3px, `--muted-dark`, uppercase
- Links — Bricolage Grotesque, 20px, `--text-light`, prefixed with `→` in `--accent-green`
- Hover: slide to `--accent-green`

**Social column:**
- Label same style as Connect
- Links with `MdArrowOutward` — icon `--accent-green`, text `--text-light`
- Hover: underline slides in from left, `--accent-green`

**Credit column:**
- `h2` — Bricolage Grotesque, 28px, `--text-light`; name `span` in `--accent-green`
- Copyright — Space Grotesk, 12px, `--muted-dark`

---

## Implementation Notes

1. Update CSS custom properties in `src/index.css` — add new tokens, keep existing where still used
2. Update `src/components/styles/*.css` files per section — do not rename any class that GSAP targets
3. The character `#0D0D0D` dark background must match exactly so the dark landing section blends with the character renderer background color (update `Scene.tsx` renderer `setClearColor` if needed)
4. Navbar color-swap on scroll: add a `ScrollTrigger` that toggles a `.nav-dark` / `.nav-light` class on `.header` at each section boundary — CSS handles the color swap, no JS color values
5. Progress bar in Work section: replace dot `<button>` elements with a single `<div>` progress track + fill — keep the same `currentIndex` state logic

---

## Files Affected

| File | Change Type |
|------|-------------|
| `src/index.css` | Token updates, global typography |
| `src/components/styles/Navbar.css` | Blur, color-swap classes |
| `src/components/styles/Landing.css` | Dark bg, typography, glow opacity |
| `src/components/styles/About.css` | Light bg, two-column grid, stats pills |
| `src/components/styles/WhatIDo.css` | Dark bg, solid borders, card styles |
| `src/components/styles/Career.css` | Light bg, timeline rail redesign |
| `src/components/styles/Work.css` | Dark bg, progress bar, text arrows |
| `src/index.css` (techstack) | Light bg, descriptor label |
| `src/components/styles/Contact.css` | Dark bg, link styles |
| `src/components/Navbar.tsx` | ScrollTrigger for nav color-swap class |
| `src/components/Work.tsx` | Progress bar markup replacing dots |
| `src/components/Character/Scene.tsx` | `setClearColor(#0D0D0D)` if needed |
