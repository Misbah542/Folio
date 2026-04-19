# Copilot Instructions

## Commands

- **Dev server:** `npm run dev` (Vite, hot-reload, `--host` enabled)
- **Build:** `npm run build` (runs `tsc -b` then `vite build`, output in `dist/`)
- **Lint:** `npm run lint` (ESLint with flat config, TS + React hooks + React Refresh rules)
- **No test runner is configured.**

## Architecture

This is a **3D portfolio site** built with React 18 + TypeScript + Vite. It is a single-page app with no router — sections scroll vertically and are animated into view.

### Two rendering layers

1. **Three.js character scene** (`src/components/Character/`) — a raw Three.js renderer (not R3F) that loads an encrypted `.enc` 3D model via `GLTFLoader` + Draco decoder (`public/draco/`). The model is decrypted at runtime (`Character/utils/decrypt.ts`). This scene renders the animated character in the landing/about sections and tracks mouse/touch for head rotation.
2. **R3F particle background** (`src/components/TechSwarm.tsx`) — a `@react-three/fiber` Canvas with floating particles that animate on scroll via GSAP ScrollTrigger. This is a separate, fixed-position layer behind the HTML content.

These two 3D systems are independent — the character uses vanilla Three.js with its own render loop, while TechSwarm uses R3F.

### Scroll animation system

GSAP with ScrollSmoother and ScrollTrigger drives all scroll-based animations. Key files:

- `src/components/utils/GsapScroll.ts` — defines scroll-linked timelines that move the character, camera, and HTML sections. Contains desktop vs. mobile branches (`window.innerWidth > 1024`).
- `src/components/utils/splitText.ts` — initializes GSAP SplitText for text reveal animations.
- `src/components/utils/initialFX.ts` — entry animations triggered after the loading screen.
- `src/lib/gsap/` — bundled GSAP premium plugins (ScrollSmoother, SplitText) as plain JS files.

### Section components

`MainContainer.tsx` composes all sections in order: `Landing` → `About` → `WhatIDo` → `Career` → `Work` → `TechStack` → `Contact`. Each section has a co-located CSS file in `src/components/styles/`.

### Loading flow

`LoadingProvider` (React Context) manages a global loading state. The character loader reports progress, and `Loading.tsx` displays it. After load completes, lights and intro animations are triggered with a 2.5s delay.

### Data layer

All portfolio content (skills, experience, theme disclaimers) lives in `src/data/constants.ts` as typed constants. Skills use a `SkillNames` enum that is referenced across components.

## Conventions

- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss` plugin) for utility classes, plus per-component CSS files in `src/components/styles/` for complex/animated layouts. Use the `cn()` helper from `src/lib/utils.ts` (clsx + tailwind-merge) when combining conditional classes.
- **Design tokens:** CSS custom properties defined in `src/index.css` — accent colors (`--accentColor`, `--accentColorSecondary`), background/text/border tokens with dark/light variants.
- **Fonts:** "Space Grotesk" for body, "Bricolage Grotesque" for headings — loaded via Google Fonts in `index.html`.
- **Responsive breakpoint:** 1024px is the primary desktop/mobile breakpoint, checked both via `window.innerWidth` in components and CSS media queries.
- **Lazy loading:** Heavy components (`CharacterModel`, `TechStack`) use `React.lazy()` with `Suspense`.
- **3D model path:** Encrypted model at `public/models/character.enc`, Draco decoder at `public/draco/`. Spline scenes at `public/models/*.spline`.
- **No routing.** All navigation is scroll-based via section IDs and GSAP.
