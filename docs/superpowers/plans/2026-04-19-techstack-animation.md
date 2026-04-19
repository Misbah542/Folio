# TechStack 3D Animation, Keyboard Removal & About Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the About "01" watermark, remove the Spline keyboard animation entirely, and build a Three.js scroll-driven tech-icon animation that scatters icons while scrolling and spirals them into a grid at the TechStack section.

**Architecture:** A fixed full-viewport `@react-three/fiber` Canvas (replacing the deleted Spline keyboard) renders ~19 tech-skill sprites. GSAP ScrollTrigger drives a progress value (0→1) keyed to the `#techstack` section. `useFrame` interpolates each icon between random scattered positions and a responsive grid, with a spiral offset that peaks mid-transition.

**Tech Stack:** React 18, Three.js 0.168, @react-three/fiber 8, @react-three/drei 9, GSAP 3 (ScrollTrigger), TypeScript, Vite

---

## File Structure

**Files to CREATE:**
| File | Responsibility |
|---|---|
| `src/data/techSkills.ts` | `TechSkill` type + `TECH_SKILLS` array (name, icon URL, color) |
| `src/hooks/useSvgTextures.ts` | Loads SVG URLs → rasterizes to canvas → returns `THREE.CanvasTexture[]` |
| `src/components/TechStackCanvas.tsx` | Fixed full-viewport R3F Canvas + `FloatingIcons` inner component + GSAP ScrollTrigger |

**Files to MODIFY:**
| File | Change |
|---|---|
| `src/components/styles/About.css` | Fix watermark positioning across all breakpoints |
| `src/components/MainContainer.tsx` | Remove `AnimatedKeyboard` import/usage, add `TechStackCanvas`, remove desktop-only gate on `TechStack` |
| `src/data/constants.ts` | Remove dead `SkillNames`, `Skill`, `SKILLS`, `Experience`, `EXPERIENCE` — keep only `themeDisclaimers` |
| `src/index.css` | Add `min-height` to `.techstack` so grid has room |

**Files to DELETE:**
| File | Reason |
|---|---|
| `src/components/AnimatedKeyboard.tsx` | Replaced by TechStackCanvas |
| `src/components/animated-keyboard-config.ts` | Config for deleted keyboard |
| `src/components/hooks/use-sounds.ts` | Keycap sounds for deleted keyboard |
| `public/models/skills-keyboard.spline` | Spline model for deleted keyboard |
| `public/assets/keycap-sounds/` | Sound files for deleted keyboard |

**Dependencies to REMOVE:**
| Package | Reason |
|---|---|
| `@splinetool/react-spline` | Only used by AnimatedKeyboard |
| `@splinetool/runtime` | Only used by AnimatedKeyboard |

---

### Task 1: Fix About "01" Watermark

**Files:**
- Modify: `src/components/styles/About.css`

The `.section-watermark` base rule sets `left: 180px`. The desktop (≥1025px) override in About.css already has `left: auto; right: 25%`. But on mobile/tablet (< 1025px), the generic `left: 180px` pushes the watermark off-center and overlapping content. Fix by adding a responsive `.about-watermark` rule for smaller screens.

- [ ] **Step 1: Add mobile/tablet watermark positioning**

In `src/components/styles/About.css`, add a base `.about-watermark` rule and a tablet override BEFORE the existing `min-width: 1025px` query:

```css
/* Add after .stat-pill block (line 62), before the first @media query */
.about-watermark {
  left: 15px;
  right: auto;
}

@media only screen and (min-width: 600px) {
  .about-watermark {
    left: auto;
    right: 10%;
  }
}
```

The existing `@media (min-width: 1025px) .about-watermark { left: auto; right: 25%; }` already handles desktop — no change needed there.

Full `About.css` after edit (relevant section only):

```css
.stat-pill {
  /* ... existing ... */
}

.about-watermark {
  left: 15px;
  right: auto;
}

@media only screen and (min-width: 600px) {
  .about-section { justify-content: center; }
  .about-watermark {
    left: auto;
    right: 10%;
  }
}

@media only screen and (min-width: 768px) {
  /* ... existing ... */
}

@media only screen and (min-width: 1025px) {
  /* ... existing, .about-watermark { left: auto; right: 25%; } ... */
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/styles/About.css
git commit -m "fix: correct About section 01 watermark positioning on mobile/tablet

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Remove Keyboard Animation

**Files:**
- Delete: `src/components/AnimatedKeyboard.tsx`
- Delete: `src/components/animated-keyboard-config.ts`
- Delete: `src/components/hooks/use-sounds.ts`
- Delete: `public/models/skills-keyboard.spline`
- Delete: `public/assets/keycap-sounds/` (directory)
- Modify: `src/components/MainContainer.tsx`
- Modify: `src/data/constants.ts`

- [ ] **Step 1: Delete keyboard files and assets**

```bash
rm src/components/AnimatedKeyboard.tsx
rm src/components/animated-keyboard-config.ts
rm src/components/hooks/use-sounds.ts
rm public/models/skills-keyboard.spline
rm -rf public/assets/keycap-sounds/
```

- [ ] **Step 2: Remove AnimatedKeyboard from MainContainer**

Edit `src/components/MainContainer.tsx`. Remove the import line and the `<AnimatedKeyboard />` JSX:

Remove line 12:
```ts
import AnimatedKeyboard from "./AnimatedKeyboard";
```

Remove line 35 (inside the return JSX):
```tsx
<AnimatedKeyboard />
```

The file should now look like:

```tsx
import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main relative">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
```

- [ ] **Step 3: Remove dead code from constants.ts**

Replace `src/data/constants.ts` so it only contains `themeDisclaimers`. The `SkillNames` enum, `Skill` type, `SKILLS` record, `Experience` type, and `EXPERIENCE` array are dead code (Career.tsx hardcodes its own data, keyboard is deleted).

New `src/data/constants.ts`:

```ts
export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};
```

- [ ] **Step 4: Uninstall @splinetool dependencies**

```bash
npm uninstall @splinetool/react-spline @splinetool/runtime
```

- [ ] **Step 5: Verify build**

```bash
npx tsc --noEmit
```

Expected: no type errors. If there are errors about missing `SkillNames` imports, search for any remaining references and clean them up.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove Spline keyboard animation and dead SKILLS code

Delete AnimatedKeyboard, keyboard config, keycap sounds, and Spline model.
Remove SkillNames/SKILLS/Experience constants (dead code).
Uninstall @splinetool/react-spline and @splinetool/runtime.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Create Tech Skills Data

**Files:**
- Create: `src/data/techSkills.ts`

- [ ] **Step 1: Create the tech skills data file**

Create `src/data/techSkills.ts`:

```ts
export type TechSkill = {
  name: string;
  icon: string;
  color: string;
};

export const TECH_SKILLS: TechSkill[] = [
  // Android Core
  { name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", color: "#7F52FF" },
  { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", color: "#3DDC84" },
  { name: "Jetpack Compose", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg", color: "#4285F4" },
  { name: "Gradle", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-original.svg", color: "#02303A" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", color: "#FFCA28" },
  { name: "Material UI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg", color: "#0081CB" },

  // Common / DevOps
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178C6" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#F7DF1E" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#FFFFFF" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ED" },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", color: "#FCC624" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#4169E1" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#47A248" },
  { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", color: "#FF9900" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", color: "#F24E1E" },
  { name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", color: "#E10098" },
  { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg", color: "#2088FF" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/techSkills.ts
git commit -m "feat: add tech skills data for TechStack animation

19 skills: Android core (Kotlin, Compose, Gradle, etc.) + common dev/devops tools.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Create useSvgTextures Hook

**Files:**
- Create: `src/hooks/useSvgTextures.ts`

Three.js `TextureLoader` doesn't reliably rasterize SVGs. This hook loads each SVG URL as an `Image`, draws it onto an offscreen `<canvas>`, and wraps the result in a `THREE.CanvasTexture`. A module-level cache avoids redundant rasterization.

- [ ] **Step 1: Create the hook**

Create `src/hooks/useSvgTextures.ts`:

```ts
import { useEffect, useState } from "react";
import * as THREE from "three";

const TEXTURE_SIZE = 128;
const cache = new Map<string, THREE.CanvasTexture>();

function rasterizeSvg(url: string): Promise<THREE.CanvasTexture> {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = TEXTURE_SIZE;
      canvas.height = TEXTURE_SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      cache.set(url, texture);
      resolve(texture);
    };
    img.onerror = () => reject(new Error(`Failed to load SVG: ${url}`));
    img.src = url;
  });
}

export function useSvgTextures(
  urls: string[]
): (THREE.CanvasTexture | null)[] {
  const [textures, setTextures] = useState<(THREE.CanvasTexture | null)[]>(
    () => urls.map(() => null)
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      urls.map((url) => rasterizeSvg(url).catch(() => null))
    ).then((results) => {
      if (!cancelled) setTextures(results);
    });

    return () => {
      cancelled = true;
    };
  }, [urls.length]);

  return textures;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSvgTextures.ts
git commit -m "feat: add useSvgTextures hook for SVG → Three.js texture rasterization

Loads SVGs via Image elements, rasterizes to 128×128 canvas,
returns CanvasTexture array. Module-level cache prevents re-rasterization.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Create TechStackCanvas Component

**Files:**
- Create: `src/components/TechStackCanvas.tsx`

This is the main Three.js component. It renders a fixed full-viewport R3F Canvas with an orthographic camera. Inside, `FloatingIcons` renders each tech skill as a `<sprite>` with an SVG texture. A GSAP ScrollTrigger on `#techstack` drives a `progressRef` from 0→1. `useFrame` reads the progress + clock time and interpolates each icon's position (scattered → spiral → grid), opacity (0.15 → 1.0), and scale (0.6 → 1.0).

- [ ] **Step 1: Create the component file**

Create `src/components/TechStackCanvas.tsx`:

```tsx
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TECH_SKILLS } from "../data/techSkills";
import { useSvgTextures } from "../hooks/useSvgTextures";

gsap.registerPlugin(ScrollTrigger);

// ── Helpers ──────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed + 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeGridPositions(
  count: number,
  viewportWidth: number,
  viewportHeight: number
): THREE.Vector3[] {
  // World-unit breakpoints at zoom 50: 15u ≈ 750px (tablet), 10u ≈ 500px (mobile)
  const cols = viewportWidth > 15 ? 5 : viewportWidth > 10 ? 4 : 3;
  const spacing = viewportWidth > 15 ? 2.5 : viewportWidth > 10 ? 2.0 : 1.5;
  const rows = Math.ceil(count / cols);
  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return new THREE.Vector3(
      col * spacing - offsetX,
      -row * spacing + offsetY,
      0
    );
  });
}

function computeScatteredPositions(count: number): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = seededRandom(i);
    return new THREE.Vector3(
      (rng() - 0.5) * 20,
      (rng() - 0.5) * 12,
      (rng() - 0.5) * 2
    );
  });
}

// ── FloatingIcons ────────────────────────────────────────

const iconUrls = TECH_SKILLS.map((s) => s.icon);

function FloatingIcons({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const textures = useSvgTextures(iconUrls);
  const { viewport } = useThree();
  const spritesRef = useRef<(THREE.Sprite | null)[]>([]);

  const scattered = useMemo(
    () => computeScatteredPositions(TECH_SKILLS.length),
    []
  );

  const grid = useMemo(
    () =>
      computeGridPositions(
        TECH_SKILLS.length,
        viewport.width,
        viewport.height
      ),
    [viewport.width, viewport.height]
  );

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progressRef.current ?? 0;
    const t = clock.getElapsedTime();
    const baseT = easeInOutCubic(p);
    const total = TECH_SKILLS.length;

    // Responsive scale: 1.0 desktop, 0.85 tablet, 0.7 mobile
    const baseScale =
      viewport.width > 15 ? 1.0 : viewport.width > 10 ? 0.85 : 0.7;

    // Responsive drift: full on desktop, reduced on smaller screens
    const driftScale =
      viewport.width > 15 ? 1.0 : viewport.width > 10 ? 0.6 : 0.3;

    for (let i = 0; i < total; i++) {
      const sprite = spritesRef.current[i];
      if (!sprite) continue;

      // Base interpolation: scattered → grid
      tempVec.lerpVectors(scattered[i], grid[i], baseT);

      // Spiral offset: bell-curve strength, peaks mid-transition
      const spiralStrength = Math.sin(p * Math.PI) * 3;
      const spiralAngle =
        p * Math.PI * 3 + (i / total) * Math.PI * 2;
      tempVec.x += Math.cos(spiralAngle) * spiralStrength;
      tempVec.y += Math.sin(spiralAngle) * spiralStrength;

      // Drift: fades out as progress increases, scaled by viewport
      const drift = (1 - p) * 0.4 * driftScale;
      tempVec.x += Math.sin(t * 0.5 + i * 1.7) * drift;
      tempVec.y += Math.cos(t * 0.3 + i * 2.3) * drift;

      sprite.position.copy(tempVec);

      // Opacity
      const mat = sprite.material as THREE.SpriteMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.15, 1.0, p);

      // Scale: responsive base size
      const s = THREE.MathUtils.lerp(0.6 * baseScale, baseScale, p);
      sprite.scale.set(s, s, s);
    }
  });

  return (
    <>
      {TECH_SKILLS.map((skill, i) =>
        textures[i] ? (
          <sprite
            key={skill.name}
            ref={(el) => {
              spritesRef.current[i] = el;
            }}
            position={[scattered[i].x, scattered[i].y, scattered[i].z]}
          >
            <spriteMaterial
              map={textures[i]}
              transparent
              opacity={0.15}
              depthWrite={false}
            />
          </sprite>
        ) : null
      )}
    </>
  );
}

// ── TechStackCanvas ──────────────────────────────────────

const TechStackCanvas = () => {
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Small delay to ensure DOM is ready after hydration
    const timer = setTimeout(() => {
      const trigger = ScrollTrigger.create({
        trigger: "#techstack",
        start: "top bottom",
        end: "top 20%",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      return () => trigger.kill();
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          orthographic
          camera={{ zoom: 50, position: [0, 0, 100] }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <FloatingIcons progressRef={progressRef} />
          <AdaptiveDpr pixelated />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TechStackCanvas;
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/TechStackCanvas.tsx
git commit -m "feat: add Three.js TechStackCanvas with scroll-driven icon animation

Fixed full-viewport R3F canvas with orthographic camera. 19 tech-skill
sprites scatter/drift pre-scroll, spiral inward, and settle into a
responsive grid when scrolling to the TechStack section. GSAP ScrollTrigger
drives the transition. Adaptive DPR for performance.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Wire TechStackCanvas into MainContainer and Show TechStack on All Viewports

**Files:**
- Modify: `src/components/MainContainer.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add TechStackCanvas to MainContainer and remove desktop-only TechStack gate**

Edit `src/components/MainContainer.tsx` to:
1. Import `TechStackCanvas`
2. Render `<TechStackCanvas />` where `<AnimatedKeyboard />` used to be
3. Remove the `{isDesktopView && (...)}` wrapper around `<TechStack />` so it renders on all viewports

Final file:

```tsx
import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import TechStackCanvas from "./TechStackCanvas";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main relative">
      <TechStackCanvas />
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <Suspense fallback={<div>Loading....</div>}>
              <TechStack />
            </Suspense>
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
```

- [ ] **Step 2: Add min-height to techstack section**

In `src/index.css`, add `min-height: 80vh` to the `.techstack` rule so the section is tall enough for the 3D grid to display:

Find this block:
```css
.techstack {
  width: 100%;
  position: relative;
  overflow: clip;
  padding: 120px 0;
  opacity: 0;
  background-color: transparent;
  color: var(--text-light);
}
```

Replace with:
```css
.techstack {
  width: 100%;
  min-height: 80vh;
  position: relative;
  overflow: clip;
  padding: 120px 0;
  opacity: 0;
  background-color: transparent;
  color: var(--text-light);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MainContainer.tsx src/index.css
git commit -m "feat: wire TechStackCanvas into MainContainer, show TechStack on all viewports

Replace deleted AnimatedKeyboard with TechStackCanvas in MainContainer.
Remove desktop-only gate so TechStack renders on mobile/tablet too.
Add min-height to .techstack section for grid display room.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Build Verification

**Files:** none (verification only)

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Full build**

```bash
npm run build
```

Expected: `tsc -b && vite build` completes successfully with no errors.

- [ ] **Step 3: Verify no stale references**

```bash
grep -r "AnimatedKeyboard\|use-sounds\|animated-keyboard-config\|SkillNames\|splinetool" src/ --include="*.ts" --include="*.tsx" -l
```

Expected: no files listed (all references cleaned up).

- [ ] **Step 4: Verify deleted files are gone**

```bash
ls src/components/AnimatedKeyboard.tsx src/components/animated-keyboard-config.ts src/components/hooks/use-sounds.ts public/models/skills-keyboard.spline public/assets/keycap-sounds/ 2>&1
```

Expected: all "No such file or directory".
