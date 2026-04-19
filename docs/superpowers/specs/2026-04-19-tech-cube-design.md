# TechCube Component Design Spec

## Overview
Create a reusable 3D component `TechCube` that displays a technology logo inside a glass cuboid. This component will be used in the `TechStack` section to provide a modern, interactive feel.

## Requirements
1. **R3F Integration**: Must use `@react-three/fiber` and `@react-three/drei`.
2. **Glass Material**: Use `MeshTransmissionMaterial` for the outer shell.
3. **Internal Logo**: A plane inside the cube displaying a texture from a `url` prop.
4. **Animation**: Floating/oscillating rotation using `useFrame`.
5. **Dimensions**: Cuboid size of `1 x 1 x 0.5`.

## Architecture

### Component: `TechCube`
- **Props**:
    - `url`: `string` (URL to the logo image)
- **Structure**:
    - `<group>` (ref for animation)
        - `<mesh>` (Outer Cuboid)
            - `BoxGeometry([1, 1, 0.5])`
            - `MeshTransmissionMaterial`
        - `<mesh>` (Inner Logo)
            - `PlaneGeometry([0.7, 0.7])`
            - `MeshBasicMaterial` (with texture from `url`)

### Material Parameters (`MeshTransmissionMaterial`)
- `backside`: `true`
- `samples`: `4`
- `thickness`: `0.2`
- `roughness`: `0.1`
- `transmission`: `1`
- `ior`: `1.2`
- `chromaticAberration`: `0.02`
- `anisotropy`: `0.1`

### Animation Logic
Inside `useFrame`:
```typescript
groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
```

## Implementation Plan
1. Create `src/components/TechCube.tsx`.
2. Import necessary hooks and components from `three`, `@react-three/fiber`, and `@react-three/drei`.
3. Define the `TechCube` component.
4. Use `useTexture` to load the logo.
5. Implement the mesh and material setup.
6. Add the `useFrame` animation logic.
7. Export the component.

## Verification Plan
1. Check for linting errors.
2. Verify the component structure matches the spec.
