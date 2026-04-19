# Spec: TechStack 3D Animation, Keyboard Removal & About Fix

## Problem Statement

Three changes needed on the portfolio:

1. **About "01" watermark is mispositioned/overlapping** — CSS positioning issue
2. **Keyboard animation is no longer wanted** — remove all Spline keyboard files, code, and assets
3. **TechStack needs a Three.js scroll-driven animation** — tech icons scattered while scrolling, spiral-converge into a grid at the techstack section

---

## 1. Fix About "01" Watermark

**Root cause**: The `.about-watermark` is `position: absolute` inside `.about-section` which is `position: relative`, but the watermark's `left: 180px` from the generic `.section-watermark` rule pushes it out of intended alignment on certain viewport widths. On desktop the override sets `right: 25%` but the generic `left: 180px` still applies, causing conflict.

**Fix**:
- In `About.css` desktop media query, add `left: auto` to `.about-watermark` so `right: 25%` takes precedence
- Ensure the watermark sits behind content with proper z-index layering (it already has `z-index: 0` and `.about-me` has `z-index: 1` — just verify)

**Files changed**: `src/components/styles/About.css`

---

## 2. Remove Keyboard Animation

### Files to DELETE
- `src/components/AnimatedKeyboard.tsx`
- `src/components/animated-keyboard-config.ts`
- `src/components/hooks/use-sounds.ts`
- `public/models/skills-keyboard.spline`
- `public/assets/keycap-sounds/` (entire directory)

### Files to EDIT
- **`src/components/MainContainer.tsx`**: Remove `AnimatedKeyboard` import and `<AnimatedKeyboard />` usage
- **`src/components/utils/GsapScroll.ts`**: Remove any keyboard-related scroll triggers (currently none directly reference the keyboard — the keyboard sets up its own triggers internally, so this file needs no changes)
- **`src/data/constants.ts`**: The `SKILLS` record, `SkillNames` enum, `Skill` type, `Experience` type, and `EXPERIENCE` array are all dead code (Career.tsx hardcodes its own data). Remove them all. Keep only `themeDisclaimers`.

### Dependencies to consider removing
- `@splinetool/react-spline` and `@splinetool/runtime` — only used by `AnimatedKeyboard.tsx`
- The Three.js packages (`three`, `@react-three/fiber`, `@react-three/drei`, etc.) are KEPT — they'll be used by the new TechStack animation

---

## 3. TechStack Three.js Scroll Animation

### Overview
Replace the empty `<TechStack />` component with a full-viewport Three.js canvas that renders tech skill icons as 3D sprites/planes. The icons are **scattered and slowly drifting** during earlier sections, then **spiral inward and settle into a grid** when the user scrolls to the techstack section.

### Tech Stack (the skills to display)

**Android Core:**
Kotlin, Jetpack Compose, Android SDK, Material Design, Room, Retrofit, Coroutines, Dagger/Hilt, Gradle

**Common/DevOps:**
Git, Docker, Linux, Firebase, CI/CD, Figma, GitHub Actions, AWS, PostgreSQL, MongoDB

~19 icons total. Each loaded as a texture from CDN (devicons or similar SVG URLs).

### Data Model

New file: `src/data/techSkills.ts`

```ts
export type TechSkill = {
  name: string;
  icon: string; // URL to SVG/PNG icon
  color: string; // accent color for glow/tint
};

export const TECH_SKILLS: TechSkill[] = [
  { name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", color: "#7F52FF" },
  { name: "Jetpack Compose", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg", color: "#4285F4" },
  // ... etc
];
```

### Architecture

The canvas is a **top-level fixed element** in `MainContainer` (replacing where `<AnimatedKeyboard />` was), NOT nested inside `TechStack.tsx`. This allows icons to be visible across all sections during scrolling.

```
MainContainer.tsx
├── <TechStackCanvas /> (fixed, full-viewport, z-index: 0) ← NEW, replaces AnimatedKeyboard
├── <Cursor />
├── <Navbar />
├── ...sections...
│   └── <TechStack /> (section wrapper — just title + placeholder, no canvas)
└── <Contact />

TechStackCanvas.tsx (new)
├── <Canvas> from @react-three/fiber (transparent bg, orthographic camera)
├── <FloatingIcons /> — renders all icon sprites
└── Uses GSAP ScrollTrigger on "#techstack" to interpolate positions
```

### SVG → Texture Strategy

Three.js `TextureLoader` doesn't reliably render SVGs. Instead:
- Load each SVG icon URL as an `Image` element
- Draw onto an offscreen `<canvas>` (e.g., 128×128)
- Create `THREE.CanvasTexture` from the canvas
- Cache textures to avoid re-rasterization
- This happens in a custom `useSvgTextures()` hook

### Scroll Behavior

**Phase 1 — Pre-techstack (scroll progress 0% → ~80%)**:
- Icons are scattered in 3D space across the viewport
- Each icon has a subtle drift animation (slow sinusoidal movement on x/y/z)
- Icons are semi-transparent (opacity ~0.15–0.3) so they don't distract from section content
- They exist in a fixed-position canvas behind the page content (like the current keyboard)

**Phase 2 — Approaching techstack (scroll progress ~80% → 95%)**:
- Icons begin spiraling inward toward the center of the techstack section
- Opacity increases from 0.3 → 1.0
- Scale increases slightly
- Spiral motion: each icon follows a parametric spiral path converging to its final grid position

**Phase 3 — At techstack (scroll progress 95% → 100%)**:
- Icons settle into a responsive grid layout
- Grid: ~4-5 columns on desktop, 3 columns on mobile
- Each icon is evenly spaced, fully opaque, slight hover float animation
- The section title "My Android Techstack" is visible above the grid

### Scroll Integration

Use GSAP ScrollTrigger (consistent with the rest of the site):

```ts
ScrollTrigger.create({
  trigger: "#techstack",
  start: "top bottom",    // start transition when techstack enters viewport
  end: "top 20%",         // fully settled when techstack near top
  scrub: true,
  onUpdate: (self) => {
    // self.progress (0→1) drives the scatter→spiral→grid interpolation
    updateIconPositions(self.progress);
  }
});
```

The icon positions are interpolated:
- `progress 0–0.3`: scattered positions (with drift)
- `progress 0.3–0.8`: spiral path toward grid
- `progress 0.8–1.0`: ease into final grid positions

### Three.js Implementation Details

**Canvas setup:**
- Fixed position, full viewport, behind content (`z-index: 0`)
- Transparent background (`alpha: true`)
- Orthographic camera (2D-ish feel, icons always face camera)
- `<AdaptiveDpr />` and `<AdaptiveEvents />` from drei for performance

**Icon rendering:**
- Each icon is a `<Sprite>` with a texture loaded via `useTexture` from drei
- Sprites auto-face camera, no need for billboarding logic
- Each sprite has: position (animated), opacity (animated), scale (animated)

**Grid calculation:**
- Responsive: calculate columns based on viewport width
- Grid positions computed in world-space coordinates
- Center the grid in the techstack section's viewport area

**Performance:**
- Use `useFrame` sparingly — most animation driven by GSAP (only runs on scroll)
- Idle drift uses GSAP tweens, not per-frame computation
- `<Suspense>` for texture loading with fallback

### Responsive Behavior

| Viewport | Columns | Icon size | Drift range |
|----------|---------|-----------|-------------|
| Desktop (>1024px) | 5 | 1.0 | Full viewport |
| Tablet (768–1024px) | 4 | 0.85 | Reduced |
| Mobile (<768px) | 3 | 0.7 | Viewport width only |

### Files Created
- `src/data/techSkills.ts` — skill data
- `src/components/TechStackCanvas.tsx` — Three.js canvas component (top-level fixed)

### Files Modified
- `src/components/TechStack.tsx` — keep as section wrapper (title only, no canvas)
- `src/components/MainContainer.tsx` — replace `<AnimatedKeyboard />` with `<TechStackCanvas />`, remove desktop-only gate for TechStack
- `src/index.css` — adjust `.techstack` styles if needed

---

## Execution Order

1. Fix About "01" watermark (standalone CSS fix)
2. Remove keyboard animation files and code
3. Create techSkills data
4. Build TechStackCanvas component
5. Wire into TechStack and MainContainer
6. Test scroll behavior and responsiveness
