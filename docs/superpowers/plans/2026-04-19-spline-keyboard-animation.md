# Spline Keyboard Animation Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the R3F particle background (TechSwarm) with the Spline keyboard animation from the 3d-portfolio-main reference repo, making it animate from section 03 (Career) through section 05 (TechStack).

**Architecture:** A fixed-position Spline canvas renders the `skills-keyboard.spline` model as a background layer. GSAP ScrollTrigger drives per-section transforms (scale, position, rotation) so the keyboard enters at Career, stays visible through Work, and is fully interactive at TechStack (the skills section). The keyboard is hidden for sections before Career and after TechStack. Sound effects play on keycap hover/press. The existing character 3D scene is untouched.

**Tech Stack:** Spline (`@splinetool/react-spline`, `@splinetool/runtime`), GSAP ScrollTrigger, React 18, TypeScript

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/AnimatedKeyboard.tsx` | Main Spline keyboard component — loads scene, manages scroll animations, keycap interactions, section-based state |
| Create | `src/components/animated-keyboard-config.ts` | Per-section keyboard transform states (scale/position/rotation) for desktop and mobile |
| Create | `src/components/hooks/use-sounds.ts` | Keycap press/release sound effects via Web Audio API |
| Modify | `src/components/MainContainer.tsx` | Replace `TechSwarm` import with `AnimatedKeyboard` |
| Delete | `src/components/TechSwarm.tsx` | No longer needed — replaced by keyboard |
| Copy   | `public/assets/keycap-sounds/press.mp3` | Keycap press sound asset |
| Copy   | `public/assets/keycap-sounds/release.mp3` | Keycap release sound asset |

**Existing section IDs** (used by ScrollTrigger):
- `#career` — section 03
- `#work` — section 04
- `#techstack` — section 05
- `#contact` — section 06 (keyboard hides before this)

---

### Task 1: Copy sound assets

**Files:**
- Copy: `public/assets/keycap-sounds/press.mp3`
- Copy: `public/assets/keycap-sounds/release.mp3`

- [ ] **Step 1: Create directories and copy sound files**

```bash
mkdir -p public/assets/keycap-sounds
cp /Users/misbah.haque/Downloads/3d-portfolio-main/public/assets/keycap-sounds/press.mp3 public/assets/keycap-sounds/press.mp3
cp /Users/misbah.haque/Downloads/3d-portfolio-main/public/assets/keycap-sounds/release.mp3 public/assets/keycap-sounds/release.mp3
```

- [ ] **Step 2: Verify files exist**

```bash
ls -la public/assets/keycap-sounds/
```

Expected: Both `press.mp3` and `release.mp3` present.

- [ ] **Step 3: Commit**

```bash
git add public/assets/keycap-sounds/
git commit -m "feat: add keycap sound assets for keyboard animation"
```

---

### Task 2: Create `use-sounds.ts` hook

**Files:**
- Create: `src/components/hooks/use-sounds.ts`

- [ ] **Step 1: Create the sound hook**

```ts
import { useCallback, useEffect, useRef } from "react";

export const useSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pressBufferRef = useRef<AudioBuffer | null>(null);
  const releaseBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const [pressResponse, releaseResponse] = await Promise.all([
          fetch("/assets/keycap-sounds/press.mp3"),
          fetch("/assets/keycap-sounds/release.mp3"),
        ]);

        const [pressBuffer, releaseBuffer] = await Promise.all([
          pressResponse.arrayBuffer().then((buf) => ctx.decodeAudioData(buf)),
          releaseResponse.arrayBuffer().then((buf) => ctx.decodeAudioData(buf)),
        ]);

        pressBufferRef.current = pressBuffer;
        releaseBufferRef.current = releaseBuffer;
      } catch (error) {
        console.error("Failed to load keycap sounds", error);
      }
    };

    loadSound();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const getContext = useCallback(() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  const playSoundBuffer = useCallback(
    (buffer: AudioBuffer | null) => {
      try {
        const ctx = getContext();
        if (!ctx || !buffer) return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.detune.value = Math.random() * 200 - 100;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.4;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (err) {
        console.error(err);
      }
    },
    [getContext]
  );

  const playPressSound = useCallback(() => {
    playSoundBuffer(pressBufferRef.current);
  }, [playSoundBuffer]);

  const playReleaseSound = useCallback(() => {
    playSoundBuffer(releaseBufferRef.current);
  }, [playSoundBuffer]);

  return { playPressSound, playReleaseSound };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: No errors from `use-sounds.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/components/hooks/use-sounds.ts
git commit -m "feat: add use-sounds hook for keycap audio feedback"
```

---

### Task 3: Create `animated-keyboard-config.ts`

**Files:**
- Create: `src/components/animated-keyboard-config.ts`

The keyboard should be hidden (scale 0) before Career and after TechStack. Section states map to the user's request: start at 03 (Career), end at 05 (TechStack).

- [ ] **Step 1: Create the config file**

```ts
export type KeyboardSection = "hidden" | "career" | "work" | "techstack";

type TransformState = {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
};

type SectionStates = Record<
  KeyboardSection,
  { desktop: TransformState; mobile: TransformState }
>;

export const KEYBOARD_STATES: SectionStates = {
  hidden: {
    desktop: {
      scale: { x: 0.01, y: 0.01, z: 0.01 },
      position: { x: 0, y: -300, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.01, y: 0.01, z: 0.01 },
      position: { x: 0, y: -300, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  career: {
    desktop: {
      scale: { x: 0.20, y: 0.20, z: 0.20 },
      position: { x: 225, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -200, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  work: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: 150, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
  },
  techstack: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 12,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
};

export const getKeyboardState = ({
  section,
  isMobile,
}: {
  section: KeyboardSection;
  isMobile: boolean;
}) => {
  const baseTransform = KEYBOARD_STATES[section][isMobile ? "mobile" : "desktop"];

  const getScaleOffset = () => {
    const width = window.innerWidth;
    const DESKTOP_REF_WIDTH = 1280;
    const MOBILE_REF_WIDTH = 390;

    const targetScale = isMobile
      ? width / MOBILE_REF_WIDTH
      : width / DESKTOP_REF_WIDTH;

    const minScale = isMobile ? 0.5 : 0.5;
    const maxScale = isMobile ? 0.6 : 1.15;

    return Math.min(Math.max(targetScale, minScale), maxScale);
  };

  const scaleOffset = getScaleOffset();

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
  };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/animated-keyboard-config.ts
git commit -m "feat: add keyboard animation config for sections 03-05"
```

---

### Task 4: Create `AnimatedKeyboard.tsx`

**Files:**
- Create: `src/components/AnimatedKeyboard.tsx`

This is the main component, adapted from the reference repo's `animated-background.tsx`. Key changes from reference:
- Uses `useLoading` instead of `usePreloader`
- No theme switching (dark-only)
- No router integration
- Section triggers: `#career` → `#work` → `#techstack`
- Keyboard hidden before Career and after TechStack
- Keycap interaction only active during TechStack section

- [ ] **Step 1: Create the component**

```tsx
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skill, SkillNames, SKILLS } from "../data/constants";
import { sleep } from "../lib/utils";
import { useMediaQuery } from "../hooks/use-media-query";
import { useLoading } from "../context/LoadingProvider";
import {
  KeyboardSection,
  getKeyboardState,
} from "./animated-keyboard-config";
import { useSounds } from "./hooks/use-sounds";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

const AnimatedKeyboard = () => {
  const { isLoading, setIsLoading } = useLoading();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<KeyboardSection>("hidden");

  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>(
    null
  );

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || activeSection !== "techstack") return;
    if (selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        if (selectedSkillRef.current) playReleaseSound();
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });

    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });

    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  // --- Animation Setup Helpers ---

  const createSectionTimeline = (
    triggerId: string,
    targetSection: KeyboardSection,
    prevSection: KeyboardSection,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    // Start hidden
    const hiddenState = getKeyboardState({ section: "hidden", isMobile });
    gsap.set(kbd.scale, hiddenState.scale);
    gsap.set(kbd.position, hiddenState.position);

    // Career: keyboard enters
    createSectionTimeline("#career", "career", "hidden", "top 70%");
    // Work: keyboard transforms
    createSectionTimeline("#work", "work", "career", "top 70%");
    // TechStack: keyboard is front-and-center, interactive
    createSectionTimeline("#techstack", "techstack", "work", "top 50%");

    // Hide keyboard when scrolling past TechStack into Contact
    gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top 70%",
        end: "top 30%",
        scrub: true,
        onEnter: () => {
          setActiveSection("hidden");
          const state = getKeyboardState({ section: "hidden", isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection("techstack");
          const state = getKeyboardState({ section: "techstack", isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => {}, stop: () => {} };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  };

  const revealKeyboard = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter(
        (obj) => obj.name === "keycap-mobile"
      );
      mobileKeyCaps.forEach((keycap) => {
        keycap.visible = true;
      });
    } else {
      const desktopKeyCaps = allObjects.filter(
        (obj) => obj.name === "keycap-desktop"
      );
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile]);

  // Handle keyboard text visibility (dark-only, no theme toggle)
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (
      !textDesktopDark ||
      !textDesktopLight ||
      !textMobileDark ||
      !textMobileLight
    )
      return;

    const hideAll = () => {
      textDesktopDark.visible = false;
      textDesktopLight.visible = false;
      textMobileDark.visible = false;
      textMobileLight.visible = false;
    };

    if (activeSection !== "techstack") {
      hideAll();
    } else {
      hideAll();
      if (isMobile) {
        textMobileLight.visible = true;
      } else {
        textDesktopLight.visible = true;
      }
    }
  }, [splineApp, isMobile, activeSection]);

  // Update Spline variables when skill is selected
  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Rotation animation for career section, keycap teardown animations
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true,
      });
    }

    const manageAnimations = async () => {
      if (activeSection !== "techstack") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      if (activeSection === "career") {
        rotateKeyboard?.restart();
      } else {
        rotateKeyboard?.pause();
      }

      keycapAnimationsRef.current?.stop();
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Reveal keyboard when Spline is loaded and site loading is done
  useEffect(() => {
    if (!splineApp || isLoading || keyboardRevealed) return;
    revealKeyboard();
  }, [splineApp, isLoading]);

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      <Suspense fallback={null}>
        <Spline
          className="w-full h-full"
          ref={splineContainer}
          style={{ pointerEvents: activeSection === "techstack" ? "auto" : "none" }}
          onLoad={(app: Application) => {
            setSplineApp(app);
          }}
          scene="/models/skills-keyboard.spline"
        />
      </Suspense>
    </div>
  );
};

export default AnimatedKeyboard;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedKeyboard.tsx
git commit -m "feat: add AnimatedKeyboard component with scroll-driven transforms"
```

---

### Task 5: Replace TechSwarm with AnimatedKeyboard in MainContainer

**Files:**
- Modify: `src/components/MainContainer.tsx` (lines 12, 35)
- Delete: `src/components/TechSwarm.tsx`

- [ ] **Step 1: Update MainContainer imports and usage**

In `src/components/MainContainer.tsx`, replace the `TechSwarm` import and usage:

Replace:
```tsx
import TechSwarm from "./TechSwarm";
```
With:
```tsx
import AnimatedKeyboard from "./AnimatedKeyboard";
```

Replace:
```tsx
      <TechSwarm />
```
With:
```tsx
      <AnimatedKeyboard />
```

- [ ] **Step 2: Delete TechSwarm.tsx**

```bash
rm src/components/TechSwarm.tsx
```

- [ ] **Step 3: Verify the build succeeds**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: replace TechSwarm particle background with Spline keyboard animation

The keyboard enters at section 03 (Career), transforms through
04 (Work), becomes interactive at 05 (TechStack), and hides
before 06 (Contact)."
```

---

### Task 6: Verify dev server runs and keyboard loads

- [ ] **Step 1: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Verify:
1. Page loads without console errors
2. Character 3D scene still works in landing/about
3. Scrolling to Career (03) — keyboard appears and enters with animation
4. Scrolling to Work (04) — keyboard transforms (flips)
5. Scrolling to TechStack (05) — keyboard is centered, hovering keycaps shows skill info, press sounds work
6. Scrolling to Contact (06) — keyboard hides
7. Scrolling back up reverses all transitions

- [ ] **Step 2: Check mobile responsiveness**

Open browser dev tools, toggle to mobile viewport. Verify keyboard uses mobile transforms (different scale/position).

- [ ] **Step 3: Final commit if any adjustments needed**

```bash
git add -A
git commit -m "fix: adjust keyboard animation values after testing"
```
