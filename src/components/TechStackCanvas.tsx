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
  let s = ((seed + 1) * 2654435761) % 2147483647;
  if (s <= 0) s += 2147483646;
  for (let b = 0; b < 3; b++) s = (s * 16807) % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Per-icon motion parameters for organic, unique movement
interface IconMotion {
  freqX: number; freqY: number; freqZ: number;
  phaseX: number; phaseY: number; phaseZ: number;
  rotSpeedX: number; rotSpeedY: number; rotSpeedZ: number;
  bounceFreq: number; bouncePhase: number;
  scrollPhaseX: number; scrollPhaseY: number;
}

function computeMotionParams(count: number): IconMotion[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = seededRandom(i + 200);
    return {
      freqX: 0.3 + rng() * 0.5,
      freqY: 0.25 + rng() * 0.4,
      freqZ: 0.15 + rng() * 0.3,
      phaseX: rng() * Math.PI * 2,
      phaseY: rng() * Math.PI * 2,
      phaseZ: rng() * Math.PI * 2,
      rotSpeedX: 0.3 + rng() * 0.6,
      rotSpeedY: 0.4 + rng() * 0.7,
      rotSpeedZ: 0.2 + rng() * 0.4,
      bounceFreq: 0.8 + rng() * 1.2,
      bouncePhase: rng() * Math.PI * 2,
      scrollPhaseX: rng() * Math.PI * 2,
      scrollPhaseY: rng() * Math.PI * 2,
    };
  });
}

function computeScattered3D(
  count: number,
  vw: number,
  vh: number
): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = seededRandom(i);
    return new THREE.Vector3(
      (rng() - 0.5) * vw * 1.4,
      (rng() - 0.5) * vh * 1.4,
      (rng() - 0.5) * 10 // z-depth for parallax
    );
  });
}

function computeGridPositions(
  count: number,
  vw: number
): THREE.Vector3[] {
  const cols = vw > 15 ? 5 : vw > 10 ? 4 : 3;
  const spacing = vw > 15 ? 2.2 : vw > 10 ? 1.8 : 1.4;
  const rows = Math.ceil(count / cols);
  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return new THREE.Vector3(col * spacing - offsetX, -row * spacing + offsetY, 0);
  });
}

// ── FloatingIcons (3D meshes) ────────────────────────────

const iconUrls = TECH_SKILLS.map((s) => s.icon);

function FloatingIcons({
  progressRef,
  exitRef,
}: {
  progressRef: React.MutableRefObject<number>;
  exitRef: React.MutableRefObject<number>;
}) {
  const textures = useSvgTextures(iconUrls);
  const { viewport } = useThree();
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const motions = useMemo(() => computeMotionParams(TECH_SKILLS.length), []);

  const scattered = useMemo(
    () => computeScattered3D(TECH_SKILLS.length, viewport.width, viewport.height),
    [viewport.width, viewport.height]
  );

  const grid = useMemo(
    () => computeGridPositions(TECH_SKILLS.length, viewport.width),
    [viewport.width]
  );

  const gridYOffset = -viewport.height * 0.12;
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const exit = exitRef.current;
    const t = clock.getElapsedTime();
    const total = TECH_SKILLS.length;
    const exitEased = easeInOutCubic(exit);

    const baseScale = viewport.width > 15 ? 0.9 : viewport.width > 10 ? 0.75 : 0.6;

    for (let i = 0; i < total; i++) {
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      const m = motions[i];

      // Per-icon staggered assembly (icons snap one by one)
      const staggerOffset = (i / total) * 0.25;
      const iconRaw = Math.max(0, Math.min(1, (p - 0.35 - staggerOffset) / 0.35));
      const iconT = easeOutBack(iconRaw); // overshoot for snappy feel

      const alive = 1 - iconT; // how much "floating" remains

      // ── Floating motion (fades as icon assembles) ──
      const floatX = Math.sin(t * m.freqX + m.phaseX) * 1.5 * alive;
      const floatY = Math.cos(t * m.freqY + m.phaseY) * 1.0 * alive;
      const floatZ = Math.sin(t * m.freqZ + m.phaseZ) * 0.6 * alive;
      const bounce = Math.abs(Math.sin(t * m.bounceFreq + m.bouncePhase)) * 0.4 * alive;

      // ── Scroll-driven drift (icons move as you scroll) ──
      const scrollX = Math.sin(p * Math.PI * 3 + m.scrollPhaseX) * 2.0 * alive;
      const scrollY = Math.cos(p * Math.PI * 2.5 + m.scrollPhaseY) * 1.5 * alive;

      // Scattered position with all motion layers
      const sx = scattered[i].x + floatX + scrollX;
      const sy = scattered[i].y + floatY + bounce + scrollY;
      const sz = scattered[i].z + floatZ;

      // Grid target (below heading)
      const gx = grid[i].x;
      const gy = grid[i].y + gridYOffset;

      // Interpolate scattered → grid
      tempVec.set(
        THREE.MathUtils.lerp(sx, gx, iconT),
        THREE.MathUtils.lerp(sy, gy, iconT),
        THREE.MathUtils.lerp(sz, 0, iconT)
      );

      // Exit animation
      tempVec.y -= exitEased * (viewport.height * 0.8 + i * 0.15);

      mesh.position.copy(tempVec);

      // ── 3D rotation (tumble while floating, flatten on assemble) ──
      mesh.rotation.x = Math.sin(t * m.rotSpeedX + m.phaseX + p * 1.5) * 0.7 * alive;
      mesh.rotation.y = Math.cos(t * m.rotSpeedY + m.phaseY + p * 1.0) * 0.9 * alive;
      mesh.rotation.z = Math.sin(t * m.rotSpeedZ * 0.7 + m.phaseZ + p * 2) * 0.4 * alive;

      // Opacity: ghostly while floating → solid when assembled
      const enterOpacity = THREE.MathUtils.lerp(0.18, 1.0, iconT);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = enterOpacity * (1 - exitEased);

      // Scale: smaller while floating, full size when assembled
      const s = THREE.MathUtils.lerp(0.65 * baseScale, baseScale, iconT);
      mesh.scale.set(s, s, s);
    }
  });

  return (
    <>
      {TECH_SKILLS.map((skill, i) =>
        textures[i] ? (
          <mesh
            key={skill.name}
            ref={(el) => { meshesRef.current[i] = el; }}
            position={[scattered[i].x, scattered[i].y, scattered[i].z]}
          >
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial
              map={textures[i]}
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ) : null
      )}
    </>
  );
}

// ── TechStackCanvas ──────────────────────────────────────

const TechStackCanvas = () => {
  const progressRef = useRef(0);
  const exitRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    let enterTrigger: ScrollTrigger | null = null;
    let exitTrigger: ScrollTrigger | null = null;

    const timer = setTimeout(() => {
      enterTrigger = ScrollTrigger.create({
        trigger: "#techstack",
        start: "top bottom",
        end: "top 20%",
        scrub: true,
        onUpdate: (self) => { progressRef.current = self.progress; },
      });

      exitTrigger = ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top 50%",
        scrub: true,
        onUpdate: (self) => { exitRef.current = self.progress; },
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      enterTrigger?.kill();
      exitTrigger?.kill();
    };
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
          camera={{ fov: 60, position: [0, 0, 20] }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <FloatingIcons progressRef={progressRef} exitRef={exitRef} />
          <AdaptiveDpr pixelated />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TechStackCanvas;