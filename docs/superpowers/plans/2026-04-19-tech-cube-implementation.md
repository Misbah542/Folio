# TechCube Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a 3D TechCube component with a glass material and an internal logo.

**Architecture:** A single React component using R3F hooks (`useFrame`, `useTexture`) and Drei components (`MeshTransmissionMaterial`).

**Tech Stack:** React, Three.js, @react-three/fiber, @react-three/drei.

---

### Task 1: Create TechCube component structure

**Files:**
- Create: `src/components/TechCube.tsx`

- [ ] **Step 1: Write the TechCube component with basic mesh**

```tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TechCubeProps {
  url: string;
}

const TechCube: React.FC<TechCubeProps> = ({ url }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Glass Cuboid */}
      <mesh>
        <boxGeometry args={[1, 1, 0.5]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
        />
      </mesh>

      {/* Internal Logo */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default TechCube;
```

- [ ] **Step 2: Verify the component compiles**

Run: `npm run lint` (or just check for errors if lint is too slow)

- [ ] **Step 3: Commit**

```bash
git add src/components/TechCube.tsx
git commit -m "feat: add TechCube component with glass material"
```
