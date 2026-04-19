# Unified Dark Theme & Work Section Fix Design Spec

**Date:** 2026-04-19  
**Goal:** Convert the entire portfolio to a unified dark theme, remove visual boundaries (the "box") from the header, fix the swipe interaction in the Work section, and revert the Career timeline to its original state (while keeping it dark).

---

## 1. Global Visual Standard (Unified Dark Theme)

All sections will now use the dark theme tokens to create a seamless, non-alternating experience.

- **Background:** All sections (`Landing`, `About`, `WhatIDo`, `Career`, `Work`, `TechStack`, `Contact`) will use `var(--bg-dark)` (#0D0D0D).
- **Text:** All body text will use `var(--text-light)` (#F0EFE9).
- **Watermarks:** All section watermarks (`01`-`06`) will use `color: var(--text-light)` at `opacity: 0.05`.
- **Labels:** All section labels (`[ SECTION ]`) will use `var(--accentColor)` (green).

---

## 2. Header & Navbar "Box" Removal

The header will be made completely transparent to avoid the "separate box" look.

- **Background:** Set `background: transparent !important` in `Navbar.css`.
- **Backdrop:** Remove `backdrop-filter` and `-webkit-backdrop-filter` to prevent the blurred "box" effect.
- **Text Color:** Force all navbar text (title, links, connect) to `var(--text-light)` regardless of scroll position.
- **Logic:** Remove the `ScrollTrigger` color-swap logic in `Navbar.tsx` and the `nav-on-light` class.

---

## 3. Work Section "Swipe Left" Fix

Enable native touch-based swiping for the project carousel.

- **Interaction:** Implement `onTouchStart` and `onTouchEnd` handlers on the carousel container in `Work.tsx`.
- **Threshold:** A horizontal movement greater than 50px will trigger the slide change.
- **Direction:** 
  - Swipe Left -> `goToNext()`
  - Swipe Right -> `goToPrev()`
- **Visuals:** Ensure project images are properly contained within their slides and do not overlap.

---

## 4. Career Section Revert

Revert the Career section to its functional state from commit `6bfc504` but update its colors for the unified dark theme.

- **Markup:** Restore the original timeline rail and dot structure.
- **CSS:** 
  - Revert to the old timeline rail style (vertical line with pulsing dot).
  - Use `var(--bg-dark)` for section background.
  - Use `var(--text-light)` for headings and body text.
  - Use `var(--accentColor)` or `var(--accentColorSecondary)` for the timeline rail and highlights.

---

## Files Affected

| File | Change |
|---|---|
| `src/components/styles/Navbar.css` | Transparent bg, remove blur, remove nav-on-light colors |
| `src/components/Navbar.tsx` | Remove ScrollTrigger color-swap logic |
| `src/components/styles/About.css` | Change to dark bg/light text |
| `src/components/About.tsx` | Update watermark/label classes |
| `src/components/styles/Career.css` | Revert to old styles, but use dark theme colors |
| `src/components/Career.tsx` | Revert to old markup, update classes |
| `src/components/Work.tsx` | Add touch swipe handlers |
| `src/index.css` | Standardize techstack bg to dark |
| `src/components/TechStack.tsx` | Update watermark color |
