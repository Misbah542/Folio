# Tech Constellation Swarm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-performance 3D background featuring a swarm of glowing particles and floating glass cubes with tech logos, animating based on scroll progress from Career to Tech Stack.

**Architecture:** Implement `TechSwarm.tsx` using R3F and GSAP. `TechCube.tsx` will handle individual glass material rendering. `MainContainer` will be updated to host the scene as a fixed background.

**Tech Stack:** React, Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Framer Motion (for small UI bits if needed).

---

### Task 1: Clean Up Previous Implementation

- [ ] **Step 1: Delete Spline-related files**

```bash
rm src/components/AnimatedKeyboard.tsx src/components/keyboard-config.ts
```

- [ ] **Step 2: Remove references from MainContainer.tsx**

```tsx
// Remove imports of AnimatedKeyboard
// Remove <AnimatedKeyboard /> component from JSX
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MainContainer.tsx
git commit -m "chore: clean up Spline keyboard implementation"
```

### Task 2: Create TechCube Component

**Files:**
- Create: `src/components/TechCube.tsx`

- [ ] **Step 1: Implement TechCube component with glass material and logo texture**

```tsx
import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'

export default function TechCube({ url, position, rotation, ...props }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useLoader(THREE.TextureLoader, url)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(time / 2) * 0.2 + rotation[0]
    meshRef.current.rotation.y = Math.cos(time / 2) * 0.2 + rotation[1]
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} {...props}>
      <boxGeometry args={[1.5, 1.5, 0.4]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.2}
        chromaticAberration={0.02}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.1}
        temporalDistortion={0.1}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#ffffff"
        color="#c9ffeb"
      />
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.5} />
      </mesh>
    </mesh>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TechCube.tsx
git commit -m "feat: add TechCube component with glass material"
```

### Task 3: Create TechSwarm Scene

**Files:**
- Create: `src/components/TechSwarm.tsx`

- [ ] **Step 1: Implement TechSwarm with GSAP ScrollTrigger logic**

```tsx
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TechCube from './TechCube'

gsap.registerPlugin(ScrollTrigger)

const LOGOS = [
  "/images/kotlin.webp",
  "/images/android.webp",
  "/images/compose.webp",
  "/images/firebase.webp",
  "/images/gradle.webp",
  "/images/studio.webp",
]

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const [positions] = useMemo(() => {
    const pos = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return [pos]
  }, [])

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#3DDC84" size={0.05} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  )
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null!)
  
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#career",
        start: "top bottom",
        endTrigger: "#techstack",
        end: "bottom bottom",
        scrub: 1,
      }
    })

    // Animation: Move cubes from scattered to grid
    tl.fromTo(groupRef.current.position, { z: -20, y: 10 }, { z: 0, y: 0, duration: 1 })
    tl.fromTo(groupRef.current.rotation, { y: Math.PI }, { y: 0, duration: 1 }, 0)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <group ref={groupRef}>
      <ParticleField />
      {LOGOS.map((url, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <TechCube 
            url={url} 
            position={[(i % 3 - 1) * 3, Math.floor(i / 3) * -3 + 1.5, 0]} 
            rotation={[0, 0, 0]}
          />
        </Float>
      ))}
    </group>
  )
}

export default function TechSwarm() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
        <color attach="background" args={['#0D0D0D']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <SceneContent />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TechSwarm.tsx
git commit -m "feat: implement TechSwarm scene with scroll-triggered animations"
```

### Task 4: Integration and Optimization

- [ ] **Step 1: Add TechSwarm to MainContainer.tsx**

```tsx
import TechSwarm from "./TechSwarm";
// ...
return (
  <div className="container-main relative">
    <TechSwarm />
    <Cursor />
    {/* ... rest of the content */}
  </div>
)
```

- [ ] **Step 2: Ensure section transparency in CSS**

```css
/* Check src/components/styles/Career.css, Work.css, index.css */
/* Ensure background-color is transparent where needed */
```

- [ ] **Step 3: Test build and performance**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MainContainer.tsx
git commit -m "feat: integrate TechSwarm background globally"
```
