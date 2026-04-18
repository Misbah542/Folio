---
title: Dark Portfolio Redesign — "Void Stage"
date: 2026-04-18
status: approved
---

# Dark Portfolio Redesign — "Void Stage"

## Overview

Redesign of Misbah ul Haque's 3D portfolio site. The aesthetic direction is **cinematic dark-ambient**: a near-black canvas where each section is a lit stage, the 3D character is the cinematic spine of the scroll journey, and Android green + Gradle teal appear exclusively as light sources and accents — never as flat background fills.

Scope: CSS/design system, layout, typography, and GSAP scroll animations. The Three.js character, GLTF pipeline, physics TechStack, and React component structure are unchanged.

---

## 1. Design System

### Color Palette

```css
--bg:           #080C12   /* near-black base canvas */
--surface:      #0F1520   /* cards, elevated surfaces */
--border:       #1C2535   /* subtle dividers */
--text:         #E8EDF5   /* primary text */
--muted:        #6B7A94   /* secondary/label text */
--accent:       #3DDC84   /* Android green — primary accent */
--accentGlow:   rgba(61, 220, 132, 0.25)  /* green ambient glow */
--teal:         #00C9A7   /* Gradle teal — secondary accent */
--mesh1:        #0D2A1F   /* dark green ambient zone color */
--mesh2:        #091A2E   /* dark teal ambient zone color */
```

**Glow language rule:** `--accent` and `--teal` never appear as solid fills on large surfaces. They exist as `box-shadow`, `filter: blur` halos, gradient mesh blobs, stroke accents, and rim lighting — atmospheric rather than decorative.

### Typography

| Role | Font | Weight |
|------|------|--------|
| Section headings, hero display | Syne | 700–800 |
| Body, labels, metadata, accents | DM Mono | 400–500 |

Both loaded from Google Fonts. No third family. Existing `Bricolage Grotesque` and `Space Grotesk` imports removed.

- Section headings: Syne 800, uppercase, fluid `clamp(2.5rem, 6vw, 7rem)`
- Hero name (landing): Syne 800, fluid `clamp(3rem, 8vw, 9rem)`
- Body paragraphs: DM Mono 400, `1rem / 1.7`
- Section labels (e.g. "ABOUT ME"): DM Mono 500, uppercase, `0.75rem`, letter-spacing `0.15em`, `--teal` color

### Global Texture

A single full-page noise/dot overlay `div` added to `App.tsx` (sibling of `LoadingProvider`), `position: fixed`, `z-index: 0`, `pointer-events: none`, `opacity: 0.03` — gives the dark canvas tactile depth without overriding the ambient glow system. Implemented as a CSS `background-image: radial-gradient(circle, #ffffff 1px, transparent 1px)` dot pattern at `background-size: 28px 28px`.

### Ambient Background System

Two large CSS `radial-gradient` blob `div`s added inside `Navbar.tsx` (where the current `.landing-circle1` and `.landing-circle2` divs live) — those two divs are replaced. New blobs: `position: fixed`, `pointer-events: none`, `z-index: 0`, `border-radius: 50%`, `filter: blur(80px)`:

- **Green blob** (`.ambient-blob-green`): top-left offset, `600px × 600px`, `background: --mesh1` radial gradient, `opacity: 0.6`, slow pulse `@keyframes` (opacity 0.4→0.8 over 6s ease-in-out infinite)
- **Teal blob** (`.ambient-blob-teal`): bottom-right offset, `500px × 500px`, `background: --mesh2` radial gradient, `opacity: 0.4`, offset pulse timing (delay 3s)

GSAP tweens target `.ambient-blob-green` and `.ambient-blob-teal` by class. These are always present but their opacity is modulated per section to simulate the page breathing.

---

## 2. Per-Section Layout

### Navbar

- Background: transparent with a `--bg`-to-transparent gradient fade (nav-fade flips direction)
- Logo "MH": Syne 700, `--accent` color
- Nav links: DM Mono, hover underline animates width 0→100% in `--accent`
- Border removed; backdrop blur added: `backdrop-filter: blur(8px)`

### Landing

- Character stays center-stage, fixed on desktop
- `character-rim` becomes a wider Android green bloom: `width: 600px`, `height: 200px`, stronger `--accentGlow` `box-shadow`, opacity animates in on load (already handled by `animationUtils`)
- **Bottom-left**: `landing-intro` (name block) — Syne 800, large scale, slides up on entrance
- **Bottom-right**: `landing-info` (role/tagline) — DM Mono, slides up with staggered char animation
- Ambient green blob visible top-left; teal blob partially visible bottom-right
- `body` background: `#080C12` (set immediately, not animated in from white)

### About

- `about-me p` (the statement paragraph): Syne 700 — this is display text, not body copy
- Section label `h3`: DM Mono 500, uppercase, `--teal`
- A dark green mesh glow (`--mesh1` radial gradient, `~800px` wide) fades in behind the text block as the section enters via GSAP ScrollTrigger
- No card/box treatment — text floats on the dark canvas

### What I Do

- `.what-box-in` cards:
  - Background: `--surface`
  - Border: `1px solid --border`
  - Left accent: `3px solid --accent` (left border)
  - Card title: Syne 700
  - Description: DM Mono 400
- Card entrance: translate `y: 40px → 0` + `opacity: 0 → 1`, stagger `0.12s` per card, triggered by ScrollTrigger

### Career

- Section heading: Syne 800
- Timeline dot: pulsing green orb — `box-shadow: 0 0 0 0 --accentGlow` keyframe expanding ring animation, stops when card is "reached"
- Career cards:
  - Background: `--surface`
  - Date (`h3`): Syne 700, `--accent` color
  - Role (`h4`): Syne 600, `--text`
  - Company (`h5`): DM Mono 500, `--muted`
  - Description: DM Mono 400, `--text`
  - Border-left: `2px solid --border`, transitions to `2px solid --accent` when card scrolls into view
- Cards stagger in (translate up + fade) as timeline line draws past each one

### Work

- Carousel wrapper: `--surface` background, `1px solid --border` border
- Project number (`0X`): Syne 800, `font-size: 20vw`, `opacity: 0.06`, positioned absolutely as watermark behind slide content
- Arrow buttons: `--surface` background, `--border` outline, hover: `box-shadow: 0 0 12px --accentGlow`, icon color `--accent`
- Dot indicators: `--border` default, `--accent` active
- Project title: Syne 700
- Category + tools: DM Mono 400, `--muted`

### TechStack

- Sphere material tint: shift emissive color from `#cccccc` to `#3DDC84` tinted (subtle, not neon)
- `N8AO` color: `#061A0F` (dark green ambient occlusion)
- Section heading: Syne 800, same SplitText char entrance

### Contact

- Large Syne 800 heading
- Email displayed in DM Mono with a green underline that animates `width: 0 → 100%` on scroll entrance
- Minimal layout — no card box, just text on the dark canvas

---

## 3. Scroll Animation Architecture

The existing GSAP ScrollSmoother + ScrollTrigger infrastructure is preserved. Changes are additive.

### Ambient breathing (new)

A GSAP `ScrollTrigger` on each major section modulates the opacity of the two fixed ambient blobs:
- Landing: both blobs at base opacity
- About: green blob intensifies (`opacity: 0.8`), teal dims
- WhatIDo: teal blob intensifies, green dims
- Career/Work: both dim to near-zero for a "deeper dark" feel
- TechStack/Contact: teal blob subtly brightens

This is achieved via a single ScrollTrigger per section tweening CSS custom properties or directly tweening the blob elements.

### Landing → About (`tl1` — keep existing, add)

Keep: character rotation, camera z-pull, `.character-model` translateX, `.landing-container` fade+translate, `.about-me` translateY.

Add:
- Green ambient blob `opacity` tween: `0.6 → 0.9` as character moves left
- `body` background subtle shift toward `--mesh1` (imperceptible but warms the darkness)

### About → WhatIDo (`tl2` — keep existing, add)

Keep: camera zoom-out, character rotation/neck, monitor reveal, screenlight fade-in, `.character-rim` exit.

Add:
- Behind `.about-section`, a `--mesh1` radial gradient div transitions to `--mesh2` (teal zone begins)
- Monitor screen flicker: 3–4 rapid `opacity` pulses (0.3→1→0.5→1) before the final settled opacity, driven by a short GSAP timeline before `delay: 3.2`

### WhatIDo (new ScrollTrigger)

```
trigger: ".whatIDO"
start: "top 70%"
```
- Section label DM Mono staggered char reveal (SplitText)
- Cards stagger in with `y: 40 → 0`, `opacity: 0 → 1`, `stagger: 0.12`

### Career (extend existing `setAllTimeline`)

Keep: timeline `maxHeight` draw, career-info-box opacity stagger.

Add:
- Timeline dot pulse stops when `maxHeight` reaches each card's position (approximated by stagger timing)
- Card `border-left` color tween: `--border → --accent` as each card fades in

### Contact (new ScrollTrigger)

```
trigger: ".contact-section"
start: "top 60%"
```
- Heading SplitText char reveal
- Email underline `scaleX: 0 → 1` from left (transform-origin: left)

---

## 4. Implementation Scope

### In scope
- `src/index.css`: CSS variable replacement, font imports, global texture overlay, ambient blob styles, body background
- `src/components/styles/*.css`: all section CSS files updated for new palette, typography, glow effects
- `src/components/utils/GsapScroll.ts`: ambient blob tweens added to existing timelines; new ScrollTriggers for WhatIDo, Contact
- `src/components/utils/initialFX.ts`: font references updated (Syne/DM Mono replace old families in SplitText selectors)
- `src/components/TechStack.tsx`: sphere material tint + N8AO color update
- `public/index.html` or `index.html`: Google Fonts import for Syne + DM Mono

### Out of scope
- Three.js character, GLTF pipeline, decrypt.ts, animationUtils.ts — unchanged
- React component structure — unchanged
- Section content (text, projects, career entries) — unchanged
- ScrollSmoother configuration — unchanged
