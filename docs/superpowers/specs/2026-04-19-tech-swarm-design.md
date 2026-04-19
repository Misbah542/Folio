# 3D Tech Constellation Swarm Design

## Context
The goal is to implement a custom, high-performance 3D background motion using Three.js (React Three Fiber) and GSAP. This replaces the previous Spline keyboard and physics ball implementations.

The animation, "Tech Constellation Swarm", will:
1.  Feature a field of glowing particles and 3D glass cubes containing tech logos.
2.  Be fixed as a background (`z-index: 0`).
3.  Transition through states based on scroll position:
    *   **Entrance (Career):** Swarm drifts into view.
    *   **Movement (Work):** Swarm forms a vortex pattern.
    *   **Focus (Tech Stack):** Swarm settles into an interactive grid/constellation.

## Architecture

**1. `TechSwarm.tsx` Component:**
- Root 3D scene using `@react-three/fiber`.
- `Points` buffer geometry for the background swarm.
- `Instances` or individual `TechCube` components for the 3D icons.
- GSAP `ScrollTrigger` to control scene parameters (camera position, vortex intensity, cube transforms).

**2. Layout Integration (`MainContainer.tsx`):**
- Mounted at the root of `MainContainer` to act as a fixed background.
- Sections like `#career`, `#work`, and `#techstack` will be transparent to allow the 3D scene to show through.

**3. Visual Style:**
- **Materials:** Physical glass materials with transmission and thickness for cubes.
- **Post-processing:** Bloom and noise for a premium, tech-focused aesthetic.
- **Logos:** High-resolution textures loaded from existing project images.

## Data Flow & Animation States
- **Dormant (Landing/About):** Swarm is scattered, mostly out of view.
- **Transition (Career):** Cubes enter from screen edges, particles begin a slow vortex.
- **Active (Work):** Higher velocity vortex, cubes frame the project carousel.
- **Static (Tech Stack):** Cubes align in a centered grid, interaction (rotation on hover) is enabled.

## Components to Update/Create
- **Delete**: `src/components/AnimatedKeyboard.tsx`, `src/components/keyboard-config.ts`
- **Modify**: `src/components/MainContainer.tsx` (Replace keyboard with `TechSwarm`)
- **Create**: `src/components/TechSwarm.tsx` (Main 3D logic)
- **Create**: `src/components/TechCube.tsx` (3D Glass Cube component)

## Performance
- Use `BufferGeometry` for particles to ensure 60fps on most devices.
- Texture compression and lazy loading for logo images.
- GSAP `overwrite: true` to prevent animation conflicts.