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
  // Hash seed to avoid correlation between low sequential seeds
  let s = ((seed + 1) * 2654435761) % 2147483647;
  if (s <= 0) s += 2147483646;
  // Burn-in: skip first few values for better distribution
  for (let b = 0; b < 3; b++) {
    s = (s * 16807) % 2147483647;
  }
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
  viewportWidth: number
): THREE.Vector3[] {
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

// Scattered positions relative to viewport so they fill the screen
function computeScatteredPositions(
  count: number,
  vw: number,
  vh: number
): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = seededRandom(i);
    return new THREE.Vector3(
      (rng() - 0.5) * vw * 0.85,
      (rng() - 0.5) * vh * 0.85,
      0
    );
  });
}

// ── FloatingIcons ────────────────────────────────────────

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
  const spritesRef = useRef<(THREE.Sprite | null)[]>([]);

  const scattered = useMemo(
    () => computeScatteredPositions(TECH_SKILLS.length, viewport.width, viewport.height),
    [viewport.width, viewport.height]
  );

  const grid = useMemo(
    () => computeGridPositions(TECH_SKILLS.length, viewport.width),
    [viewport.width]
  );

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // Offset grid down so it assembles below the techstack heading
  const gridYOffset = -viewport.height * 0.15;

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const exit = exitRef.current;
    const t = clock.getElapsedTime();
    const total = TECH_SKILLS.length;

    // Responsive scale
    const baseScale = viewport.width > 15 ? 1.0 : viewport.width > 10 ? 0.85 : 0.7;
    // Responsive drift
    const driftScale = viewport.width > 15 ? 1.0 : viewport.width > 10 ? 0.6 : 0.3;

    // Exit: fade out when entering contact
    const exitEased = easeInOutCubic(exit);

    for (let i = 0; i < total; i++) {
      const sprite = spritesRef.current[i];
      if (!sprite) continue;

      // Stagger: each icon starts assembling at a different threshold
      const staggerOffset = (i / total) * 0.3; // spread across 0.3 of progress
      const iconAssembleRaw = Math.max(0, Math.min(1, (p - 0.3 - staggerOffset) / 0.4));
      const iconT = easeInOutCubic(iconAssembleRaw);

      // Grid target shifted below heading
      const gx = grid[i].x;
      const gy = grid[i].y + gridYOffset;

      // Scroll-based movement: icons shift position as you scroll
      const scrollDriftX = Math.sin(p * Math.PI * 2 + i * 1.3) * (1 - iconT) * 1.5;
      const scrollDriftY = Math.cos(p * Math.PI * 1.5 + i * 0.9) * (1 - iconT) * 1.0;

      // Base interpolation: scattered → grid with per-icon stagger
      tempVec.set(
        THREE.MathUtils.lerp(scattered[i].x + scrollDriftX, gx, iconT),
        THREE.MathUtils.lerp(scattered[i].y + scrollDriftY, gy, iconT),
        0
      );

      // Gentle spiral only during assembly
      if (iconAssembleRaw > 0 && iconAssembleRaw < 1) {
        const spiralStrength = Math.sin(iconAssembleRaw * Math.PI) * 1.5;
        const spiralAngle =
          iconAssembleRaw * Math.PI * 2 + (i / total) * Math.PI * 2;
        tempVec.x += Math.cos(spiralAngle) * spiralStrength;
        tempVec.y += Math.sin(spiralAngle) * spiralStrength;
      }

      // Time-based drift: fades as icons assemble
      const drift = (1 - iconT) * 0.3 * driftScale;
      tempVec.x += Math.sin(t * 0.5 + i * 1.7) * drift;
      tempVec.y += Math.cos(t * 0.3 + i * 2.3) * drift;

      // Exit: push icons down and apart
      tempVec.y -= exitEased * (viewport.height * 0.6 + i * 0.3);
      tempVec.x += exitEased * ((i % 2 === 0 ? 1 : -1) * i * 0.2);

      sprite.position.copy(tempVec);

      // Opacity: 0.15 while scattered, ramps to 1.0 as icon assembles
      const enterOpacity = THREE.MathUtils.lerp(0.15, 1.0, iconT);
      const mat = sprite.material as THREE.SpriteMaterial;
      mat.opacity = enterOpacity * (1 - exitEased);

      // Scale
      const s = THREE.MathUtils.lerp(0.6 * baseScale, baseScale, iconT);
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
  const exitRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let enterTrigger: ScrollTrigger | null = null;
    let exitTrigger: ScrollTrigger | null = null;

    // Delay to ensure ScrollSmoother is initialized (created in Navbar)
    const timer = setTimeout(() => {
      // Assemble: scatter → grid as techstack approaches
      enterTrigger = ScrollTrigger.create({
        trigger: "#techstack",
        start: "top bottom",
        end: "top 20%",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // Exit: fade out when scrolling into contact
      exitTrigger = ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top 50%",
        scrub: true,
        onUpdate: (self) => {
          exitRef.current = self.progress;
        },
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
          orthographic
          camera={{ zoom: 50, position: [0, 0, 100] }}
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