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
  _viewportHeight: number
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