# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio site's visual design across all 8 sections using a dark/light alternating layout with dual green+violet accents, editorial typography, and minimalist modern aesthetics — without touching any GSAP, ScrollSmoother, Three.js, or physics interactions.

**Architecture:** Pure CSS and minimal JSX changes. New design tokens are added to `src/index.css` and cascade down. Each section CSS file is updated independently. Three TSX files require structural additions (labels, watermarks, progress bar). All GSAP-targeted class names are preserved exactly.

**Tech Stack:** React + TypeScript + Vite, plain CSS (no Tailwind), GSAP ScrollTrigger, Three.js

---

## GSAP-Protected Selectors (never rename or remove)

| Selector | Used by |
|---|---|
| `.landing-section` | tl1 trigger |
| `.landing-container` | tl1 animated |
| `.character-model` | tl1, tl3 animated |
| `.character-rim` | tl2 animated |
| `.about-section` | tl2 trigger + animated |
| `.about-me` | tl2 animated |
| `.whatIDO` | tl3 trigger + animated |
| `.what-box-in` | tl2, tl3 animated |
| `.career-section` | careerTimeline trigger + animated |
| `.career-timeline` | careerTimeline animated (maxHeight, opacity) |
| `.career-info-box` | careerTimeline animated (opacity stagger) |
| `.career-dot` | careerTimeline animated (animationIterationCount) |

---

## File Map

| File | Change |
|---|---|
| `src/index.css` | Add design tokens; update body; add `.section-label`, `.section-watermark` base; update `.techstack` styles |
| `src/components/styles/Navbar.css` | Add backdrop blur; add `.nav-on-light` override class |
| `src/components/Navbar.tsx` | Add 3 ScrollTrigger.create() for light-section detection |
| `src/components/styles/Landing.css` | Dark bg; update typography; dark gradient fades; label style |
| `src/components/Landing.tsx` | Replace "Hi there, I'm" h2 with label span; add hr; remove h3 |
| `src/components/styles/About.css` | Light bg; label/watermark/heading/rule/stats styles |
| `src/components/About.tsx` | Add watermark, label, heading, hr, stats pills |
| `src/components/styles/WhatIDo.css` | Dark bg; CSS border on cards; card hover; recolor typography/tags |
| `src/components/WhatIDo.tsx` | Remove SVG elements from `.what-border1` and `.what-border2` divs; add label+watermark |
| `src/components/styles/Career.css` | Light bg; restyle timeline to thin violet rail; update typography |
| `src/components/Career.tsx` | Add label and watermark |
| `src/components/styles/Work.css` | Dark bg; text-only arrows; replace dots with progress bar; recolor |
| `src/components/Work.tsx` | Replace arrow icons with text; replace dots with progress bar div; add label+watermark; remove react-icons import |
| `src/components/TechStack.tsx` | Add label, descriptor line, watermark; update N8AO color |
| `src/components/styles/Contact.css` | Dark bg; recolor links, labels, heading |
| `src/components/Contact.tsx` | Add label and watermark |

---

## Task 1: Global Design Tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the `:root` block and update body**

Replace the existing `:root` and `body` blocks in `src/index.css` with:

```css
:root {
  font-family: "Space Grotesk", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  line-height: 1.5;
  scroll-behavior: smooth;
  color-scheme: dark light;

  /* Accent colours */
  --accentColor: #3DDC84;
  --accentColorSecondary: #673AB7;

  /* New design tokens */
  --bg-dark:      #0D0D0D;
  --bg-light:     #F7F7F5;
  --text-dark:    #0D0D0D;
  --text-light:   #F0EFE9;
  --muted-dark:   #A0A0A0;
  --muted-light:  #5F6368;
  --border-dark:  rgba(255, 255, 255, 0.08);
  --border-light: rgba(0, 0, 0, 0.10);

  /* Legacy aliases — many existing selectors reference these */
  --backgroundColor: var(--bg-dark);
  --textColor:       var(--text-light);
  --mutedTextColor:  var(--muted-dark);
  --borderColor:     var(--border-dark);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --vh: 100vh;
  --vh: 100svh;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Bricolage Grotesque", sans-serif;
}

::selection {
  background: var(--accentColor);
  color: var(--text-dark);
}

a {
  color: inherit;
  text-decoration: inherit;
}

a:hover {
  color: var(--accentColor);
}

main {
  opacity: 1;
  transition: 0.3s;
}

.main-active {
  opacity: 0;
  animation: fadeIn 1s 1;
  animation-fill-mode: forwards;
}

@keyframes fadeIn {
  100% { opacity: 1; }
}

body {
  margin: 0;
  height: auto;
  background-color: var(--bg-dark);
  color: var(--text-light);
  flex-grow: 1;
  --cWidth: calc(100% - 30px);
  --cMaxWidth: 1920px;
  max-width: 100vw;
  overflow: hidden;
}

.main-body {
  max-width: 100vw;
  overflow-x: hidden;
}

.container-main {
  width: 100%;
  margin: auto;
  position: relative;
}

.container1 {
  width: var(--cWidth);
  height: var(--vh);
  margin: auto;
  position: relative;
}

.split-line { overflow: hidden; }

.split-h2 {
  overflow: hidden;
  display: flex;
  white-space: nowrap;
  flex-wrap: nowrap;
}
```

- [ ] **Step 2: Add shared utility classes and update `.techstack` block**

Append these to `src/index.css` (replacing the existing `.techstack` block):

```css
/* ── Shared Section Utilities ── */
.section-label {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--accentColor);
  margin-bottom: 16px;
}

.section-label-muted {
  color: var(--muted-light);
}

.section-watermark {
  position: absolute;
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  top: 50px;
  left: 0;
  z-index: 0;
  color: white;
  opacity: 0.05;
}

.section-watermark-violet {
  color: var(--accentColorSecondary);
  opacity: 0.1;
}

/* ── TechStack ── */
.techstack {
  width: 100%;
  position: relative;
  overflow: clip;
  height: var(--vh);
  margin: auto;
  margin-top: 50px;
  margin-bottom: -100px;
  background-color: var(--bg-light);
  color: var(--text-dark);
}

.techstack h2 {
  font-size: 72px;
  text-align: center;
  position: absolute;
  width: 100%;
  top: 120px;
  left: 0;
  font-weight: 700;
  color: var(--text-dark);
  z-index: 2;
}

.techstack .section-label {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--muted-light);
  z-index: 2;
}

.tech-descriptor {
  position: absolute;
  top: 210px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Space Grotesk", sans-serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--muted-light);
  z-index: 2;
  margin: 0;
}

.techstack-watermark {
  top: 40px;
}

@media screen and (min-width: 768px) {
  body { --cWidth: 94%; }
}

@media screen and (max-width: 900px) {
  .techstack h2 { font-size: 40px; }
  .tech-descriptor { top: 170px; }
}
```

- [ ] **Step 3: Verify build has no TypeScript errors**

```bash
npm run build
```

Expected: no errors. CSS changes only, no TS affected.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: add dark/light design tokens and shared section utilities"
```

---

## Task 2: Navbar — Blur + Color-Swap

**Files:**
- Modify: `src/components/styles/Navbar.css`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Replace Navbar.css**

Replace the full contents of `src/components/styles/Navbar.css`:

```css
.header {
  display: flex;
  max-width: var(--cMaxWidth);
  width: var(--cWidth);
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: -100px;
  box-sizing: border-box;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 9999;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background 0.3s;
}

/* Default: dark section — no tinted bg needed, blur is enough */
.header ul {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  column-gap: 40px;
  row-gap: 8px;
  align-items: end;
}

.header ul li {
  margin-left: 0;
  letter-spacing: 2px;
  color: var(--text-light);
  font-weight: 600;
  cursor: pointer;
  font-family: "Space Grotesk", sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  transition: color 0.2s;
}

.navbar-connect {
  position: absolute;
  display: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  letter-spacing: 1px;
  font-weight: 500;
  color: var(--text-light);
  transition: color 0.3s;
}

.navbar-title {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: var(--text-light);
  font-family: "Bricolage Grotesque", sans-serif;
  transition: color 0.3s;
}

/* Light section override */
.header.nav-on-light .navbar-title,
.header.nav-on-light ul li,
.header.nav-on-light .navbar-connect {
  color: var(--text-dark);
}

@media only screen and (min-width: 500px) {
  .header { padding: 20px 0; }

  .header ul {
    flex-direction: row;
    align-items: center;
    font-size: 13px;
  }

  .header ul li {
    padding: 8px 20px;
    border-radius: 100px;
    transition: background 0.2s, color 0.2s;
  }

  .header ul li:hover {
    background-color: var(--accentColor);
    color: var(--bg-dark) !important;
  }

  .navbar-title { font-size: 16px; }
}

@media only screen and (min-width: 900px) {
  .navbar-connect { display: block; }
}

@media only screen and (min-width: 1200px) {
  .header { padding: 35px 0; }
  .header ul { column-gap: 80px; font-size: 13px; }
  .navbar-connect { font-size: 16px; }
  .navbar-title { font-size: 18px; }
}
```

- [ ] **Step 2: Add light-section ScrollTrigger detection to Navbar.tsx**

In `src/components/Navbar.tsx`, add three `ScrollTrigger.create()` calls inside the `useEffect`, after the `smoother` initialization block. Insert before the `window.addEventListener("resize", ...)` line:

```typescript
const lightSections = ['#about', '.career-section', '.techstack'];
lightSections.forEach((selector) => {
  ScrollTrigger.create({
    trigger: selector,
    start: 'top 80px',
    end: 'bottom 80px',
    onEnter: () =>
      document.querySelector('.header')?.classList.add('nav-on-light'),
    onLeave: () =>
      document.querySelector('.header')?.classList.remove('nav-on-light'),
    onEnterBack: () =>
      document.querySelector('.header')?.classList.add('nav-on-light'),
    onLeaveBack: () =>
      document.querySelector('.header')?.classList.remove('nav-on-light'),
  });
});
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

- Navbar text should be light (white) on Landing
- Scrolling into About: navbar text turns dark
- Scrolling into WhatIDo: back to light
- Scrolling into Career: dark again
- Blur frosted glass effect visible on both light and dark sections

- [ ] **Step 4: Commit**

```bash
git add src/components/styles/Navbar.css src/components/Navbar.tsx
git commit -m "style: redesign navbar with blur and light/dark color-swap"
```

---

## Task 3: Landing Section

**Files:**
- Modify: `src/components/styles/Landing.css`
- Modify: `src/components/Landing.tsx`

- [ ] **Step 1: Update Landing.tsx — replace intro h2 with label, remove role h3, add rule**

Replace the full JSX in `src/components/Landing.tsx`:

```tsx
import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <span className="landing-label">[ Android Developer ]</span>
            <h1 className="landing-name">
              MISBAH
              <br />
              <span>UL HAQUE</span>
            </h1>
            <hr className="landing-rule" />
          </div>
          <div className="landing-info">
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Building</div>
              <div className="landing-h2-2">Modern</div>
              <div className="landing-h2-3">Mobile</div>
              <div className="landing-h2-4">TV</div>
            </h2>
            <h2 className="landing-info-bottom">
              <div className="landing-h2-info">Android</div>
              <div className="landing-h2-info-1">Apps</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
```

- [ ] **Step 2: Replace Landing.css**

Replace the full contents of `src/components/styles/Landing.css`:

```css
.landing-section {
  width: 100%;
  max-width: var(--cMaxWidth);
  margin: auto;
  position: relative;
  height: var(--vh);
  background-color: var(--bg-dark);
}

.landing-container {
  width: var(--cWidth);
  margin: auto;
  height: 100%;
  position: relative;
  max-width: var(--cMaxWidth);
}

/* Ambient glow blobs */
.landing-circle1 {
  top: 0%;
  left: 0%;
  z-index: 15;
  position: fixed;
  width: 300px;
  height: 300px;
  background-color: var(--accentColor);
  box-shadow: inset -50px 40px 50px rgba(61, 220, 132, 0.4);
  filter: blur(60px);
  border-radius: 50%;
  animation: loadingCircle 5s linear infinite;
  opacity: 0.4;
}

.nav-fade {
  position: fixed;
  top: 0;
  width: 100%;
  height: 130px;
  background-image: linear-gradient(0deg, transparent, var(--bg-dark) 70%);
  pointer-events: none;
  z-index: 12;
  opacity: 0;
  left: 0;
}

@keyframes loadingCircle {
  0%   { transform: translate(-95%, -75%) rotateZ(0deg); }
  100% { transform: translate(-95%, -75%) rotateZ(360deg); }
}

.landing-circle2 {
  top: 50%;
  right: 0%;
  transform: translate(calc(100% - 2px), -50%);
  z-index: 9;
  position: fixed;
  display: none;
  width: 300px;
  height: 300px;
  background-color: var(--accentColorSecondary);
  box-shadow: inset -50px 40px 50px rgba(103, 58, 183, 0.4);
  filter: blur(50px);
  border-radius: 50%;
  animation: loadingCircle2 5s linear infinite;
  opacity: 0.3;
}

@keyframes loadingCircle2 {
  100% { transform: translate(calc(100% - 2px), -50%) rotate(360deg); }
}

.landing-video,
.landing-image {
  position: absolute;
  bottom: 0;
  height: 95%;
  left: 50%;
  transform: translateX(-50%);
}

.landing-image img {
  height: 100%;
  z-index: 2;
  position: relative;
}

.character-rim {
  position: absolute;
  width: 400px;
  height: 400px;
  z-index: 1;
  background-color: var(--accentColor);
  box-shadow: inset 66px 35px 85px 0px rgba(61, 220, 132, 0.45);
  filter: blur(50px);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%) scale(1.4);
  opacity: 0;
}

.character-model {
  height: 80%;
  height: 80vh;
  position: absolute;
  max-width: 1920px;
  max-height: 1080px;
  transform: translateX(-50%);
  width: 100%;
  left: 50%;
  z-index: 0;
  bottom: 50px;
  pointer-events: inherit;
}

.character-model::after {
  content: "";
  width: 100vw;
  height: 250px;
  background-image: linear-gradient(to bottom, transparent, var(--bg-dark) 70%);
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  position: absolute;
}

.character-model::before {
  content: "";
  width: 100vw;
  height: 700px;
  background-color: var(--bg-dark);
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  position: absolute;
}

.character-loaded .character-rim {
  animation: backlight 3s forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.character-model canvas {
  position: relative;
  pointer-events: none;
  z-index: 2;
}

.character-hover {
  position: absolute;
  width: 280px;
  height: 280px;
  top: 50%;
  left: 50%;
  z-index: 3;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

/* Left block — name */
.landing-intro {
  position: absolute;
  z-index: 9;
  top: 12%;
  left: 0;
}

.landing-label {
  display: block;
  color: var(--accentColor);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  font-family: "Space Grotesk", sans-serif;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.landing-intro h1 {
  margin: 0;
  letter-spacing: 2px;
  font-size: 40px;
  line-height: 0.9;
  font-weight: 700;
  font-family: "Bricolage Grotesque", sans-serif;
  color: var(--text-light);
}

.landing-rule {
  border: none;
  border-top: 1px solid var(--accentColor);
  width: 60px;
  margin: 16px 0 0 0;
}

/* Right block — cycling text */
.landing-info {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  bottom: 40px;
  top: inherit;
  z-index: 9;
}

.landing-info h2 {
  margin: 0;
  margin-top: -20px;
  margin-left: 20px;
  font-family: "Bricolage Grotesque", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-light);
}

.landing-h2-info-1 {
  position: absolute;
  top: 0;
  left: 0;
}

h2.landing-info-h2 {
  color: var(--accentColor);
  font-size: 42px;
  width: 120%;
  margin: 0;
  font-family: "Bricolage Grotesque", sans-serif;
  font-weight: 800;
  position: relative;
  margin-left: -5px;
}

.landing-h2-2,
.landing-h2-3,
.landing-h2-4 {
  position: absolute;
  top: 0;
  left: 0;
}

.landing-info-h2::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 120%;
  z-index: 3;
  background-image: linear-gradient(0deg, var(--bg-dark) 40%, transparent 110%);
  top: 0;
  left: 0;
}

/* ── Responsive ── */
@media screen and (min-width: 500px) {
  .landing-circle2 { display: block; }
  .character-model { z-index: 0; }

  .landing-label { font-size: 11px; }

  .landing-intro h1 {
    font-size: 30px;
    line-height: 0.9;
  }

  .landing-info h2 {
    font-size: 35px;
    line-height: 40px;
  }

  h2.landing-info-h2 { font-size: 38px; }
}

@media screen and (min-width: 768px) {
  .character-model { height: 80vh; }

  .landing-intro h1 {
    font-size: 40px;
    line-height: 0.9;
  }

  .landing-info h2 {
    font-size: 45px;
    line-height: 42px;
  }

  h2.landing-info-h2 { font-size: 55px; }
}

@media screen and (min-width: 1025px) {
  .character-model {
    height: 100vh;
    bottom: 0;
    z-index: 11;
    position: fixed;
  }

  .character-model::after,
  .character-model::before { display: none; }

  .landing-intro {
    top: 50%;
    left: auto;
    right: 66%;
    transform: translate(0%, -50%);
  }

  .landing-info {
    bottom: auto;
    top: 51%;
    z-index: inherit;
    text-align: left;
    transform: translate(0%, -50%);
    right: auto;
    left: 66%;
  }
}

@media screen and (min-width: 1200px) {
  .landing-intro {
    top: 50%;
    left: auto;
    right: 70%;
    transform: translate(0%, -50%);
  }

  .landing-info {
    bottom: auto;
    top: 51%;
    z-index: inherit;
    text-align: left;
    transform: translate(0%, -50%);
    right: auto;
    left: 70%;
  }
}

@media screen and (min-width: 1600px) {
  .landing-intro h1 {
    font-size: 72px;
    line-height: 0.9;
  }

  .landing-info h2 {
    font-size: 65px;
    line-height: 62px;
  }

  h2.landing-info-h2 { font-size: 80px; }
}
```

- [ ] **Step 3: Verify landing visually**

```bash
npm run dev
```

Check:
- Landing is dark (`#0D0D0D` background)
- `[ Android Developer ]` label in green above name
- Name in light text, tight line-height
- Thin green rule below name
- Cycling text (Building/Modern/Mobile/TV) in green
- Green and violet glow blobs visible
- Bottom gradient fades to dark

- [ ] **Step 4: Commit**

```bash
git add src/components/Landing.tsx src/components/styles/Landing.css
git commit -m "style: redesign landing — dark bg, label, editorial typography"
```

---

## Task 4: About Section

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/styles/About.css`

- [ ] **Step 1: Update About.tsx — add watermark, label, heading, rule, stats**

Replace the full contents of `src/components/About.tsx`:

```tsx
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-watermark section-watermark section-watermark-violet">01</div>
      <div className="about-me">
        <span className="section-label section-label-muted">[ About Me ]</span>
        <h2 className="about-heading">About</h2>
        <hr className="about-rule" />
        <p className="para">
          I'm a dedicated Android Developer specializing in building
          high-performance, user-centric mobile applications. With expertise in
          Kotlin, Jetpack Compose, and Material Design, I focus on crafting
          seamless experiences that push the boundaries of the Android platform.
          I'm passionate about architecting scalable solutions and ensuring
          smooth performance, delivering robust software that users truly enjoy.
        </p>
        <div className="about-stats">
          <span className="stat-pill">4+ Years</span>
          <span className="stat-pill">3 Roles</span>
        </div>
      </div>
    </div>
  );
};

export default About;
```

- [ ] **Step 2: Replace About.css**

Replace the full contents of `src/components/styles/About.css`:

```css
.about-section {
  display: flex;
  align-items: center;
  justify-content: left;
  place-items: center;
  position: relative; /* needed for absolute watermark */
  opacity: 1;
  height: auto;
  width: var(--cWidth);
  margin: auto;
  background-color: var(--bg-light);
  color: var(--text-dark);
}

.about-me {
  padding: 50px 0;
  padding-bottom: 0;
  width: 500px;
  max-width: calc(100% - 15px);
  position: relative;
  z-index: 1;
}

.about-heading {
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
  margin: 0 0 24px 0;
}

.about-rule {
  border: none;
  border-top: 1px solid var(--border-light);
  margin: 0 0 24px 0;
}

.about-me p {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.3px;
  font-family: "Space Grotesk", sans-serif;
  color: var(--text-dark);
  max-width: 55ch;
  margin: 0 0 24px 0;
}

.about-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 50px;
}

.stat-pill {
  display: inline-block;
  background-color: var(--bg-dark);
  color: var(--text-light);
  font-family: "Space Grotesk", sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  padding: 6px 18px;
  border-radius: 100px;
  text-transform: uppercase;
}

@media only screen and (min-width: 600px) {
  .about-section { justify-content: center; }
}

@media only screen and (min-width: 768px) {
  .about-me {
    width: 500px;
    max-width: calc(100% - 70px);
    transform: translateY(0%);
  }
  .about-section { opacity: 1; }
}

@media only screen and (min-width: 1025px) {
  .about-section {
    width: var(--cWidth);
    justify-content: right;
    max-width: 1920px;
    height: var(--vh);
    padding: 0;
    opacity: 1;
  }

  .about-me {
    padding: 0;
    width: 42%;
  }

  .about-me p {
    font-size: 1.1vw;
    line-height: 1.75;
  }
}

@media only screen and (min-width: 1950px) {
  .about-me p {
    font-size: 1.2rem;
    line-height: 1.75;
  }
}
```

- [ ] **Step 3: Verify About section visually**

```bash
npm run dev
```

Check:
- About has light (`#F7F7F5`) background
- Faint violet watermark `01` top-left
- `[ ABOUT ME ]` muted label
- Large `About` heading in dark text
- Thin rule, readable paragraph, dark-pill stats
- GSAP slide-in animation on `.about-me` still works on desktop

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx src/components/styles/About.css
git commit -m "style: redesign about section — light bg, watermark, stats pills"
```

---

## Task 5: WhatIDo Section

**Files:**
- Modify: `src/components/WhatIDo.tsx`
- Modify: `src/components/styles/WhatIDo.css`

- [ ] **Step 1: Update WhatIDo.tsx — remove SVG borders, add label and watermark**

Replace the full contents of `src/components/WhatIDo.tsx`:

```tsx
import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-watermark section-watermark">02</div>
      <div className="what-box">
        <span className="section-label what-section-label">[ What I Do ]</span>
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 0)}>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>ANDROID APP DEVELOPMENT</h3>
              <h4>Building robust apps with Kotlin</h4>
              <p>
                Specializing in creating high-performance Android applications
                for Mobile and TV platforms, focusing on scalability and user
                experience.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Kotlin</div>
                <div className="what-tags">Coroutines</div>
                <div className="what-tags">Dagger Hilt</div>
                <div className="what-tags">Android SDK</div>
                <div className="what-tags">Gradle</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 1)}>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>MODERN UI/UX</h3>
              <h4>Crafting beautiful interfaces with Jetpack Compose</h4>
              <p>
                Expertise in building declarative UIs with Jetpack Compose,
                Material Design 3, and custom animations for immersive digital
                experiences.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Jetpack Compose</div>
                <div className="what-tags">Material 3</div>
                <div className="what-tags">Animations</div>
                <div className="what-tags">Responsive Design</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 2)}>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>PERFORMANCE OPTIMIZATION</h3>
              <h4>Ensuring smooth performance and low memory footprint</h4>
              <p>
                Optimizing app startup, reducing memory usage, and improving
                frame rates to deliver a lightning-fast experience for millions
                of users.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Profiling</div>
                <div className="what-tags">LeakCanary</div>
                <div className="what-tags">Benchmarking</div>
                <div className="what-tags">R8/ProGuard</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div className="what-content what-noTouch" ref={(el) => setRef(el, 3)}>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>ARCHITECTURE</h3>
              <h4>Scalable solutions with MVVM/MVI</h4>
              <p>
                Architecting robust systems using modern patterns like MVVM and
                MVI, ensuring code maintainability and testability.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">MVVM</div>
                <div className="what-tags">MVI</div>
                <div className="what-tags">Clean Architecture</div>
                <div className="what-tags">Flow</div>
                <div className="what-tags">Room</div>
                <div className="what-tags">Retrofit</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);
    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
```

- [ ] **Step 2: Replace WhatIDo.css**

Replace the full contents of `src/components/styles/WhatIDo.css`:

```css
.whatIDO {
  display: flex;
  align-items: center;
  justify-content: center;
  place-items: center;
  position: relative;
  opacity: 1;
  height: 100vh;
  width: var(--cWidth);
  max-width: 1920px;
  margin: auto;
  z-index: 9;
}

.what-watermark {
  left: 0;
  top: 60px;
}

.what-section-label {
  margin-bottom: 24px;
}

.what-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 9;
}

.what-box h2 {
  font-size: calc(4vw + 25px);
  line-height: calc(4vw + 20px);
  font-weight: 600;
  margin-right: 10%;
  margin-bottom: 100px;
  color: var(--text-light);
}

.hat-h2 { font-style: italic; }

.do-h2 { color: var(--accentColor); }

.what-box-in {
  flex-direction: column;
  height: 600px;
  margin-left: 200px;
  position: relative;
  display: none;
}

/* Cards */
.what-content {
  width: 450px;
  height: 25%;
  min-height: 25%;
  transition: min-height 0.5s, padding 0.5s, border-color 0.3s, background 0.3s;
  position: relative;
  padding: 20px 50px;
  box-sizing: border-box;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  animation: whatBorderReveal 1.2s 1 forwards;
  animation-delay: 0.5s;
}

@keyframes whatBorderReveal {
  to { border-color: var(--border-dark); }
}

.what-noTouch:hover,
.what-content-active {
  min-height: 65%;
  padding: 30px 50px;
  border-color: var(--accentColor) !important;
  background: rgba(61, 220, 132, 0.05);
}

.what-noTouch:hover .what-content-in,
.what-content-active .what-content-in {
  overflow: visible;
}

.what-noTouch:hover ~ .what-content,
.what-box-in:hover .what-noTouch:not(:hover),
.what-content.what-sibling {
  min-height: 10%;
  padding: 5px 50px;
}

.what-content h3 {
  font-size: 13px;
  letter-spacing: 3px;
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
  color: var(--accentColor);
  text-transform: uppercase;
  font-weight: 500;
}

.what-content p,
.what-content h4,
.what-content-in h5,
.what-content-flex,
.what-arrow {
  opacity: 0;
  transition: 0.3s;
  pointer-events: none;
}

.what-noTouch:hover p,
.what-content-active p,
.what-noTouch:hover h4,
.what-content-active h4,
.what-noTouch:hover h5,
.what-content-active h5,
.what-noTouch:hover .what-content-flex,
.what-content-active .what-content-flex,
.what-noTouch:hover .what-arrow,
.what-content-active .what-arrow {
  opacity: 1;
  pointer-events: auto;
}

.what-content p {
  font-size: 14px;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: var(--muted-dark);
}

.what-content h4 {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin: 0;
  font-size: 18px;
  opacity: 1;
  color: var(--text-light);
  font-family: "Bricolage Grotesque", sans-serif;
}

.what-content-in {
  opacity: 0;
  animation: whatFlicker 0.5s 1 forwards;
  animation-delay: 1s;
  height: 100%;
  overflow: hidden;
}

@keyframes whatFlicker {
  0%, 25%, 35%, 60% { opacity: 0; }
  30%, 50%, 40%, 100% { opacity: 1; }
}

/* Corner brackets */
.what-content::before,
.what-corner::before,
.what-content::after,
.what-corner::after {
  content: "";
  width: 10px;
  height: 10px;
  position: absolute;
  border: 3px solid var(--accentColor);
  opacity: 0;
  animation: whatCorners 0.2s 1 forwards;
  animation-delay: 0.5s;
}

@keyframes whatCorners {
  100% { opacity: 0.6; }
}

.what-content::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.what-corner::before {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.what-content::after {
  bottom: -2px;
  left: -2px;
  border-top: none;
  border-right: none;
}

.what-corner::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* Arrow */
.what-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 25px;
  height: 25px;
  border: 1px solid var(--accentColor);
}

.what-arrow::before {
  content: "";
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  border-left: 1px solid var(--accentColor);
  border-bottom: 1px solid var(--accentColor);
  transition: 0.5s;
  width: 10px;
  height: 10px;
}

.what-noTouch:hover .what-arrow::before,
.what-content-active .what-arrow::before {
  transform: translate(-50%, -20%) rotate(-225deg);
}

/* Tags */
.what-content-flex {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.what-tags {
  font-size: 11px;
  font-weight: 400;
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--border-dark);
  border-radius: 100px;
  color: var(--text-light);
}

.what-content-in h5 {
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 2px;
  font-family: "Space Grotesk", sans-serif;
  margin-bottom: 5px;
  text-transform: uppercase;
  color: var(--muted-dark);
}

/* ── Responsive ── */
@media only screen and (max-width: 1600px) {
  .what-box h2 { margin-right: 18%; }
}

@media only screen and (max-width: 1400px) {
  .what-box h2 { margin-right: 20%; }
  .what-box-in { height: 400px; }
  .what-content h3 { font-size: 12px; }
  .what-content { padding: 15px 30px; width: 400px; }
  .what-content p { font-size: 13px; }
  .what-noTouch:hover,
  .what-content-active { padding: 15px 30px; }
  .what-noTouch:hover ~ .what-content,
  .what-box-in:hover .what-noTouch:not(:hover),
  .what-content.what-sibling { padding: 5px 30px; }
  .what-tags { font-size: 11px; }
  .what-box-in { margin-left: 50px; }
  .what-content { width: 380px; }
}

@media only screen and (max-width: 1024px) {
  .whatIDO { height: auto; padding: 50px 0; }
  .what-box-in { height: 500px; margin-left: -50px; }
  .what-content { padding: 20px 50px; width: 500px; }
  .what-content p { font-size: 14px; }
  .what-noTouch:hover,
  .what-content-active { min-height: 55%; padding: 30px 50px; }
  .what-noTouch:hover ~ .what-content,
  .what-box-in:hover .what-noTouch:not(:hover),
  .what-content.what-sibling { min-height: 15%; padding: 5px 50px; }
}

@media only screen and (max-width: 900px) {
  .whatIDO { flex-direction: column; }
  .what-box h2 { margin: 50px 0; font-size: 55px; line-height: 53px; }
  .what-box:first-child { justify-content: left; }
  .what-box:last-child { height: 500px; }
  .what-box { width: 500px; max-width: calc(100% - 50px); margin: auto; }
  .what-content { width: 100%; }
  .what-box-in { margin-left: 0; height: 450px; }
  .what-content { padding: 15px 30px; }
  .what-content p { font-size: 11px; }
  .what-noTouch:hover, .what-content-active { padding: 10px 30px; }
  .what-tags { font-size: 11px; }
  .what-noTouch:hover ~ .what-content,
  .what-box-in:hover .what-noTouch:not(:hover),
  .what-content.what-sibling { padding: 2px 30px; }
  .what-content h3 { font-size: 12px; }
}

@media only screen and (max-width: 550px) {
  .whatIDO { place-items: inherit; align-items: start; justify-content: left; }
  .what-box { max-width: calc(100% - 25px); margin: 0; }
}

@media only screen and (min-width: 1950px) {
  .what-box h2 { font-size: 7rem; line-height: 6.8rem; }
}
```

- [ ] **Step 3: Verify WhatIDo visually**

```bash
npm run dev
```

Check:
- Section is dark (inherits from body)
- `[ WHAT I DO ]` green label above heading
- Cards have subtle dark border; hover turns green with green border
- Card h3 is small green uppercase
- Card h4 is large light text (Bricolage)
- Tags are dark-pill style
- Arrow is green
- Expand/hover interaction still works on desktop
- Touch expand still works on mobile

- [ ] **Step 4: Commit**

```bash
git add src/components/WhatIDo.tsx src/components/styles/WhatIDo.css
git commit -m "style: redesign whatido — dark cards, css borders, green accents"
```

---

## Task 6: Career Section

**Files:**
- Modify: `src/components/Career.tsx`
- Modify: `src/components/styles/Career.css`

- [ ] **Step 1: Update Career.tsx — add label and watermark**

Replace the full contents of `src/components/Career.tsx`:

```tsx
import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <div className="career-watermark section-watermark section-watermark-violet">03</div>
        <span className="section-label section-label-muted">[ Experience ]</span>
        <h2>
          My career <span>&amp;</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE II — Android</h4>
                <h5>Star India Pvt Ltd — Disney + Hotstar</h5>
              </div>
              <h3>2025–Present</h3>
            </div>
            <p>
              Leading end-to-end development of high-traffic feature screens,
              optimising rendering and data flow to reduce load times by 45%.
              Integrated Engage SDK across Mobile and TV platforms, and
              architected modular systems using Hilt, Paging 3, and Retrofit.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE II — Android</h4>
                <h5>Viacom Media Pvt Ltd — JioCinema</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Optimised app startup by 60% using Content Provider and Android
              Startup Library. Built Contextual Continue Watching and enhanced
              UpNext playback, contributing to a 25% increase in user
              engagement. Led production stability for IPL 2024 and Olympics.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE I — Android</h4>
                <h5>Viacom Media Pvt Ltd — JioCinema</h5>
              </div>
              <h3>2022–24</h3>
            </div>
            <p>
              Led the refactoring and redesign of the Player Skin for Android TV,
              achieving a 40% reduction in rendering time. Developed Login with
              QR Code and supported high-concurrency events like FIFA World Cup
              2022 and IPL 2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
```

- [ ] **Step 2: Replace Career.css**

Replace the full contents of `src/components/styles/Career.css`:

```css
.career-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  place-items: center;
  justify-content: center;
  position: relative;
  opacity: 1;
  height: auto;
  margin: auto;
  margin-bottom: 250px;
  padding: 120px 0;
  background-color: var(--bg-light);
  color: var(--text-dark);
}

.career-container {
  position: relative;
  width: 100%;
}

.career-watermark {
  top: 60px;
}

.career-section .section-label {
  margin-bottom: 24px;
  display: block;
}

.career-section h2 {
  font-size: 70px;
  line-height: 70px;
  font-weight: 700;
  text-align: center;
  color: var(--text-dark);
  margin-top: 16px;
  margin-bottom: 90px;
  font-family: "Bricolage Grotesque", sans-serif;
}

.career-section h2 > span {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 400;
}

.career-info {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.career-info-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--border-light);
}

.career-info-box:last-child {
  border-bottom: none;
}

.career-info-box p {
  width: 40%;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  line-height: 1.75;
  color: var(--text-dark);
}

.career-info-in {
  display: flex;
  width: 40%;
  justify-content: space-between;
  gap: 50px;
}

/* Year label */
.career-info h3 {
  font-size: 13px;
  margin: 0;
  font-weight: 500;
  letter-spacing: 2px;
  font-family: "Space Grotesk", sans-serif;
  color: var(--accentColorSecondary);
  text-transform: uppercase;
  line-height: 1.4;
}

/* Role */
.career-info h4 {
  font-size: 13px;
  line-height: 1.4;
  letter-spacing: 2px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  color: var(--muted-light);
  font-family: "Space Grotesk", sans-serif;
}

/* Company */
.career-info h5 {
  font-weight: 400;
  letter-spacing: 0.5px;
  font-size: 20px;
  font-family: "Bricolage Grotesque", sans-serif;
  margin: 8px 0 0 0;
  color: var(--text-dark);
}

/* GSAP-animated rail — keep class names, update visual only */
.career-timeline {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background-color: var(--accentColorSecondary);
  opacity: 0.3;
  max-height: 0%;
}

.career-dot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  background-color: var(--accentColorSecondary);
  width: 8px;
  height: 8px;
  border-radius: 50px;
  box-shadow: 0 0 10px 0 rgba(103, 58, 183, 0.5);
  animation: timeline 0.8s linear infinite forwards;
}

@keyframes timeline {
  0%, 100% { box-shadow: 0 0 10px 0 rgba(103, 58, 183, 0.5); }
  50%       { box-shadow: 0 0 20px 5px rgba(103, 58, 183, 0.3); }
}

/* ── Responsive ── */
@media only screen and (max-width: 1400px) {
  .career-section h2 { font-size: 50px; line-height: 50px; }
  .career-info h4 { font-size: 12px; width: 180px; }
  .career-info h5 { font-size: 17px; }
  .career-info h3 { font-size: 12px; }
  .career-info-box p { font-size: 14px; }
  .career-info-in { width: 45%; gap: 20px; }
  .career-info-box p { width: 45%; }
}

@media only screen and (max-width: 1025px) {
  .career-section {
    padding: 70px 0;
    padding-top: 220px;
    margin-top: -200px;
    margin-bottom: 0;
  }
}

@media only screen and (max-width: 900px) {
  .career-info-box { flex-direction: column; gap: 10px; margin-bottom: 40px; padding-bottom: 40px; }
  .career-info-in,
  .career-info-box p { width: 100%; padding-left: 10%; box-sizing: border-box; }
  .career-timeline { left: 0%; }
  .career-container { width: calc(100% - 25px); }
}

@media only screen and (max-width: 600px) {
  .career-info { margin: 0; }
  .career-section h2 { width: 100%; font-size: 45px; line-height: 45px; margin-top: 0; }
  .career-info-in { gap: 0; }
  .career-info h3 { font-size: 12px; }
  .career-info-in,
  .career-info-box p { padding-left: 5%; }
  .career-section { padding-top: 90px; margin-top: -70px; align-items: start; place-items: inherit; justify-content: left; }
}
```

- [ ] **Step 3: Verify Career section visually**

```bash
npm run dev
```

Check:
- Career has light (`#F7F7F5`) background
- `03` violet watermark
- `[ EXPERIENCE ]` muted label
- GSAP rail animation still grows on scroll (violet thin line)
- Violet dot still pulses
- Entries fade in via GSAP stagger
- Role labels are small muted uppercase; company names are larger dark text
- Year is violet uppercase
- Horizontal rule separates entries

- [ ] **Step 4: Commit**

```bash
git add src/components/Career.tsx src/components/styles/Career.css
git commit -m "style: redesign career section — light bg, violet rail, editorial type"
```

---

## Task 7: Work Section

**Files:**
- Modify: `src/components/Work.tsx`
- Modify: `src/components/styles/Work.css`

- [ ] **Step 1: Update Work.tsx — text arrows, progress bar, label, watermark**

Replace the full contents of `src/components/Work.tsx`:

```tsx
import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";

const projects = [
  {
    title: "Tetris Game",
    category: "Mobile Game",
    tools: "MVVM, Kotlin Compose, LiveData, Coroutines",
    image: "/images/placeholder.webp",
    link: "#",
  },
  {
    title: "SplitTrip App",
    category: "Travel & Utility",
    tools: "Kotlin, Jetpack Compose, Placeholder Tools",
    image: "/images/placeholder.webp",
    link: "#",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-watermark section-watermark">04</div>
        <span className="section-label">[ Selected Work ]</span>
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            ← PREV
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            NEXT →
          </button>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">{project.category}</p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools &amp; Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-progress">
            <div
              className="carousel-progress-fill"
              style={{
                width: `${((currentIndex + 1) / projects.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
```

- [ ] **Step 2: Replace Work.css**

Replace the full contents of `src/components/styles/Work.css`:

```css
.work-section {
  position: relative;
  z-index: 1;
  background-color: var(--bg-dark);
  color: var(--text-light);
  padding: 80px 0;
}

.work-section h2 {
  font-size: 72px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 50px;
  color: var(--text-light);
  position: relative;
  z-index: 1;
}

.work-section h2 > span {
  color: var(--accentColor);
}

.work-watermark {
  top: 60px;
}

.work-container {
  margin: auto;
  position: relative;
}

/* ── Carousel ── */
.carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-track-container {
  overflow: hidden;
  width: 100%;
  border-top: 1px solid var(--border-dark);
  border-bottom: 1px solid var(--border-dark);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 50px 0;
}

.carousel-content {
  display: flex;
  align-items: center;
  gap: 60px;
  width: 100%;
}

.carousel-info {
  flex: 1;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.carousel-number h3 {
  font-size: 100px;
  line-height: 1;
  margin: 0;
  font-weight: 700;
  color: var(--accentColor);
  opacity: 0.2;
}

.carousel-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.carousel-details h4 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  color: var(--text-light);
  font-family: "Bricolage Grotesque", sans-serif;
}

.carousel-category {
  font-weight: 400;
  color: var(--muted-dark);
  margin: 0;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: "Space Grotesk", sans-serif;
}

.carousel-tools {
  margin-top: 16px;
}

.carousel-tools .tools-label {
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--muted-dark);
  font-family: "Space Grotesk", sans-serif;
}

.carousel-tools p {
  font-weight: 400;
  color: var(--muted-dark);
  margin: 6px 0 0;
  font-size: 14px;
}

.carousel-image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ── Navigation Arrows — text only ── */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  border: none;
  color: var(--muted-dark);
  font-family: "Space Grotesk", sans-serif;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
  padding: 8px 0;
}

.carousel-arrow:hover {
  color: var(--accentColor);
}

.carousel-arrow-left { left: -80px; }
.carousel-arrow-right { right: -80px; }

/* ── Progress Bar ── */
.carousel-progress {
  width: 100%;
  height: 1px;
  background-color: var(--border-dark);
  margin-top: 35px;
  position: relative;
  overflow: hidden;
}

.carousel-progress-fill {
  height: 100%;
  background-color: var(--accentColor);
  transition: width 0.5s ease;
}

/* ── Work Image ── */
.work-image {
  display: flex;
  width: 100%;
  justify-content: center;
}

.work-image-in { position: relative; }

.work-link {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: var(--accentColor);
  color: var(--bg-dark);
  width: 50px;
  border-radius: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
  opacity: 0;
}

.work-image a:hover { color: inherit; }

.work-image a:hover .work-link { opacity: 1; }

.work-image video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  object-fit: cover;
}

.work-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  border: 1px solid var(--border-dark);
}

/* ── Responsive ── */
@media only screen and (max-width: 1600px) {
  .carousel-arrow-left { left: -65px; }
  .carousel-arrow-right { right: -65px; }
}

@media only screen and (max-width: 1400px) {
  .work-section h2 { font-size: 50px; }
  .carousel-details h4 { font-size: 26px; }
  .carousel-number h3 { font-size: 70px; }
  .carousel-content { gap: 40px; }
  .carousel-arrow-left { left: 10px; }
  .carousel-arrow-right { right: 10px; }
}

@media only screen and (max-width: 1025px) {
  .carousel-content { flex-direction: column; gap: 30px; }
  .carousel-info { width: 100%; }
  .carousel-image-wrapper { width: 100%; }
  .carousel-arrow-left { left: 10px; }
  .carousel-arrow-right { right: 10px; }
}

@media only screen and (max-width: 900px) {
  .work-section { padding: 50px 0; }
  .work-section h2 { font-size: 40px; margin-bottom: 30px; }
  .carousel-number h3 { font-size: 55px; }
  .carousel-details h4 { font-size: 22px; }
  .carousel-content { gap: 20px; }
  .carousel-slide { padding: 30px 0; }
  .work-image img { max-height: 250px; }
}
```

- [ ] **Step 3: Verify Work section visually**

```bash
npm run dev
```

Check:
- Dark background
- Large green `04` watermark, green `[ SELECTED WORK ]` label
- `My Work` title in light text, `Work` in green
- Arrow buttons show `← PREV` / `NEXT →` text, no circles
- Clicking arrows advances slides
- Progress bar (thin green line) slides between positions
- Project number is large green at 20% opacity
- Project title is large Bricolage light text
- Category is small muted uppercase

- [ ] **Step 4: Commit**

```bash
git add src/components/Work.tsx src/components/styles/Work.css
git commit -m "style: redesign work — text arrows, progress bar, dark editorial layout"
```

---

## Task 8: TechStack Section

**Files:**
- Modify: `src/components/TechStack.tsx`

(The CSS for `.techstack` was updated in Task 1's `src/index.css`.)

- [ ] **Step 1: Update TechStack.tsx — add label, descriptor, watermark, fix AO color**

Replace the full contents of `src/components/TechStack.tsx`:

```tsx
import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/kotlin.webp",
  "/images/android.webp",
  "/images/compose.webp",
  "/images/firebase.webp",
  "/images/gradle.webp",
  "/images/studio.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );
    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          color: "#eeeeee",
          emissive: "#cccccc",
          emissiveMap: texture,
          emissiveIntensity: 0.1,
          metalness: 0.2,
          roughness: 0.8,
        })
    );
  }, [textures]);

  return (
    <div className="techstack">
      <div className="techstack-watermark section-watermark section-watermark-violet">05</div>
      <span className="section-label section-label-muted">[ Tech Stack ]</span>
      <h2>My Android Techstack</h2>
      <p className="tech-descriptor">[ drag to interact ]</p>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="#eeeeee"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[Math.floor(Math.random() * materials.length)]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#1a0a2e" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
```

- [ ] **Step 2: Verify TechStack visually**

```bash
npm run dev
```

Check:
- Section has light (`#F7F7F5`) background
- `[ TECH STACK ]` muted label at top center
- `My Android Techstack` heading in dark text
- `[ drag to interact ]` descriptor below heading
- `05` violet watermark
- Physics balls still work — dragging cursor pushes them
- Canvas is transparent (shows light bg)

- [ ] **Step 3: Commit**

```bash
git add src/components/TechStack.tsx
git commit -m "style: redesign techstack — light bg, label, descriptor, updated ao color"
```

---

## Task 9: Contact Section

**Files:**
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/styles/Contact.css`

- [ ] **Step 1: Update Contact.tsx — add label, watermark, update link markup**

Replace the full contents of `src/components/Contact.tsx`:

```tsx
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-watermark section-watermark">06</div>
        <span className="section-label">[ Get In Touch ]</span>
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://linkedin.com/in/misbahulhaque"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-connect-link"
              >
                <span className="contact-arrow">→</span> LinkedIn — misbahulhaque
              </a>
            </p>
            <p>
              <a
                href="mailto:misbahul8@gmail.com"
                data-cursor="disable"
                className="contact-connect-link"
              >
                <span className="contact-arrow">→</span> Email — misbahul8@gmail.com
              </a>
            </p>
            <p>
              <span data-cursor="disable" className="contact-connect-link">
                <span className="contact-arrow">→</span> Phone — +91-8376069521
              </span>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Misbah542"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/misbahulhaque"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              YouTube <MdArrowOutward />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Misbah ul Haque</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
```

- [ ] **Step 2: Replace Contact.css**

Replace the full contents of `src/components/styles/Contact.css`:

```css
.contact-section {
  margin: auto;
  padding-bottom: 100px;
  margin-top: 100px;
  position: relative;
  z-index: 2;
  background-color: var(--bg-dark);
  color: var(--text-light);
  border-top: 1px solid var(--border-dark);
}

.contact-container {
  position: relative;
}

.contact-watermark {
  top: -20px;
}

.contact-section .section-label {
  margin-bottom: 24px;
  display: block;
}

.contact-section h3 {
  font-size: 72px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 60px 0;
  font-family: "Bricolage Grotesque", sans-serif;
  color: var(--text-light);
}

.contact-flex {
  display: flex;
  justify-content: space-between;
}

.contact-flex h4 {
  font-weight: 500;
  margin: 0 0 16px 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted-dark);
}

.contact-box {
  display: flex;
  flex-direction: column;
}

/* Connect column links */
.contact-connect-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 18px;
  color: var(--text-light);
  transition: color 0.2s;
  cursor: pointer;
}

.contact-connect-link:hover {
  color: var(--accentColor);
}

.contact-arrow {
  color: var(--accentColor);
  font-family: "Space Grotesk", sans-serif;
}

.contact-flex p {
  margin-top: 8px;
  margin-bottom: 16px;
}

/* Social column links */
a.contact-social {
  font-size: 22px;
  font-family: "Bricolage Grotesque", sans-serif;
  border-bottom: 1px solid var(--border-dark);
  padding: 8px 0;
  transition: color 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-light);
}

a.contact-social svg {
  color: var(--accentColor);
  font-size: 16px;
}

a.contact-social:hover {
  color: var(--accentColor);
  border-bottom-color: var(--accentColor);
}

/* Credit column */
.contact-box h2 {
  font-weight: 600;
  font-size: 26px;
  margin: 0;
  font-family: "Bricolage Grotesque", sans-serif;
  color: var(--text-light);
  line-height: 1.3;
}

.contact-box h2 > span {
  color: var(--accentColor);
}

.contact-box h5 {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  display: flex;
  gap: 6px;
  align-items: center;
  color: var(--muted-dark);
  font-family: "Space Grotesk", sans-serif;
  margin-top: 16px;
}

/* ── Responsive ── */
@media only screen and (max-width: 1600px) {
  .contact-section h3 { font-size: 55px; }
  .contact-box h2 { font-size: 22px; }
  a.contact-social { font-size: 20px; }
  .contact-connect-link { font-size: 16px; }
}

@media only screen and (max-width: 1300px) {
  .contact-section h3 { font-size: 44px; }
  .contact-box h2 { font-size: 18px; }
  a.contact-social { font-size: 18px; }
  .contact-flex p { margin-top: 0; }
}

@media only screen and (max-width: 900px) {
  .contact-flex { flex-direction: column; gap: 40px; }
  .contact-flex p { margin-bottom: 0; }
  .contact-flex h4 { margin-top: 20px; }
  .contact-section { margin-top: 50px; padding-bottom: 50px; }
  .contact-container { width: calc(100% - 25px); }
  .contact-section h3 { font-size: 40px; }
}
```

- [ ] **Step 3: Verify Contact section visually**

```bash
npm run dev
```

Check:
- Dark background, top border line
- `06` watermark, `[ GET IN TOUCH ]` green label
- `CONTACT` heading in light text at 72px
- Connect links have green `→` prefix, light text, hover to green
- Social links have green icon, light text, bottom border, hover to green
- Credit text: "Designed and Developed by **Misbah ul Haque**" — name in green
- Copyright in muted small text

- [ ] **Step 4: Run full build check**

```bash
npm run build
```

Expected: no TypeScript errors, no import errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/styles/Contact.css
git commit -m "style: redesign contact section — dark bg, green accents, editorial layout"
```

---

## Final Verification Checklist

After all tasks are complete, do one full scroll-through:

- [ ] Dark → Light → Dark alternation flows correctly through all 8 sections
- [ ] Navbar color swaps dark/light at correct section boundaries
- [ ] Character head-tracking follows mouse on desktop
- [ ] Scroll animations play correctly (character moves, about slides in, WhatIDo cards reveal, career rail grows)
- [ ] WhatIDo hover expand works on desktop; click expand works on mobile
- [ ] TechStack physics balls respond to cursor drag
- [ ] Work carousel advances with ← PREV / NEXT → and progress bar updates
- [ ] All links are clickable (LinkedIn, GitHub, Email)
- [ ] No horizontal scroll on mobile
- [ ] `npm run build` passes with zero errors
