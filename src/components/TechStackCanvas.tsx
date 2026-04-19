import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TECH_SKILLS } from "../data/techSkills";
import { useExtrudedIcons, ExtrudedIcon } from "../hooks/useExtrudedIcons";

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D glass tech-stack background:
 *  - Each icon is a rounded-box glass cube (MeshPhysicalMaterial transmission)
 *    with the tech logo sitting on the front face
 *  - Custom velocity physics: continuous motion, wall bounces, icon-icon
 *    elastic collisions, cursor & scroll impulses
 *  - On #techstack scroll they assemble into a big grid under the heading
 *  - On #contact they drop out of view
 */

// ── helpers ─────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const ICON_SIZE = 1.35;
const ICON_RADIUS = ICON_SIZE * 0.55;
const MAX_SPEED = 29.4;
const WALL_RESTITUTION = 0.8;    // bouncy walls (30% softer)
const ICON_RESTITUTION = 0.88;   // icon-icon collisions (30% softer)
const SCATTER_OPACITY = 0.1;       // icons invisible while scattered

interface IconState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  angVel: THREE.Vector3;
}

function initStates(count: number, vw: number, vh: number): IconState[] {
  const rng = mulberry32(0xbeef);
  return Array.from({ length: count }, () => ({
    pos: new THREE.Vector3(
      (rng() - 0.5) * vw * 1.25,
      (rng() - 0.5) * vh * 1.25,
      -3 - rng() * 10
    ),
    vel: new THREE.Vector3(
      (rng() - 0.5) * 12.6,
      (rng() - 0.5) * 12.6,
      (rng() - 0.5) * 4.2
    ),
    rot: new THREE.Euler(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI),
    angVel: new THREE.Vector3(
      (rng() - 0.5) * 3.85,
      (rng() - 0.5) * 4.2,
      (rng() - 0.5) * 2.24
    ),
  }));
}

function computeGrid(count: number, vw: number): THREE.Vector3[] {
  const cols = vw > 16 ? 6 : vw > 12 ? 5 : vw > 9 ? 4 : 3;
  const spacing = vw > 16 ? 2.5 : vw > 12 ? 2.2 : vw > 9 ? 2.0 : 1.7;
  const offX = ((cols - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Anchor the top row at y = 0; grid extends downward from there.
    return new THREE.Vector3(col * spacing - offX, -row * spacing, 0);
  });
}

// ── 3D extruded icon ────────────────────────────────────────────────────

function Icon3D({
  meshRef,
  icon,
  fallbackColor,
  initialPos,
}: {
  meshRef: (g: THREE.Group | null) => void;
  icon: ExtrudedIcon;
  fallbackColor: string;
  initialPos: [number, number, number];
}) {
  return (
    <group ref={meshRef} position={initialPos}>
      <group scale={[ICON_SIZE, ICON_SIZE, ICON_SIZE * 0.5]}>
        {icon.geometries.map((g, idx) => {
          const color = g.color === "none" ? fallbackColor : g.color;
          return (
            <mesh key={idx} geometry={g.geometry}>
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.35}
                metalness={0}
                roughness={0.5}
                transparent
                opacity={SCATTER_OPACITY}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ── Field (physics + assembly) ──────────────────────────────────────────

const iconItems = TECH_SKILLS.map((s) => ({ url: s.icon, color: s.color }));

function IconField({
  progressRef,
  exitRef,
  velocityRef,
}: {
  progressRef: React.MutableRefObject<number>;
  exitRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
}) {
  const icons = useExtrudedIcons(iconItems);
  const { viewport, size } = useThree();
  const count = TECH_SKILLS.length;

  // Wait until viewport is measured before building state so icons don't
  // spawn clustered at origin and fall outward.
  const ready = viewport.width > 1 && viewport.height > 1;

  const groupsRef = useRef<(THREE.Group | null)[]>([]);
  const states = useMemo(
    () => (ready ? initStates(count, viewport.width, viewport.height) : []),
    [count, viewport.width, viewport.height, ready]
  );
  const grid = useMemo(
    () => (ready ? computeGrid(count, viewport.width) : []),
    [count, viewport.width, ready]
  );
  // Track the heading's on-screen position so the assembled grid
  // stays anchored just below it regardless of how far we've scrolled.
  const headingBottomRef = useRef<number>(0);
  useEffect(() => {
    const update = () => {
      const h = document.querySelector<HTMLElement>("#techstack h2");
      if (!h) return;
      const r = h.getBoundingClientRect();
      headingBottomRef.current = r.bottom;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const iv = setInterval(update, 100);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearInterval(iv);
    };
  }, []);

  // bounds (ambient playground)
  const bounds = useMemo(
    () => ({
      x: viewport.width * 0.65,
      y: viewport.height * 0.65,
      zMin: -14,
      zMax: 2,
    }),
    [viewport.width, viewport.height]
  );

  // Cursor — creates a soft push impulse on nearby icons
  const cursorNDC = useRef({ x: 0, y: 0 });
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    quickX.current = gsap.quickTo(cursorNDC.current, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(cursorNDC.current, "y", {
      duration: 0.35,
      ease: "power3.out",
    });
    const onMove = (e: MouseEvent | TouchEvent) => {
      const p = "touches" in e ? e.touches[0] : (e as MouseEvent);
      if (!p) return;
      quickX.current?.((p.clientX / size.width) * 2 - 1);
      quickY.current?.(-((p.clientY / size.height) * 2 - 1));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, [size.width, size.height]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const velSmooth = useRef(0);

  useFrame((_, dtRaw) => {
    if (!ready || states.length === 0) return;
    const dt = Math.min(dtRaw, 0.033); // clamp to avoid tunneling on stalls
    const p = progressRef.current;
    const exit = exitRef.current;
    const exitEased = easeInOutCubic(exit);

    // smoothed scroll velocity
    velSmooth.current += (velocityRef.current - velSmooth.current) * 0.12;
    const scrollVel = THREE.MathUtils.clamp(velSmooth.current / 1800, -1.3, 1.3);

    const cursorWorldX = cursorNDC.current.x * viewport.width * 0.5;
    const cursorWorldY = cursorNDC.current.y * viewport.height * 0.5;

    // assemble blend per icon (ambient vs grid) — staggered one-by-one
    const assembles: number[] = new Array(count);
    const perIcon = 0.55; // each icon takes 55% of the scroll window
    for (let i = 0; i < count; i++) {
      // stagger start: icon 0 starts at 0, last icon starts at (1 - perIcon)
      const start = (i / (count - 1 || 1)) * (1 - perIcon);
      const raw = THREE.MathUtils.clamp((p - start) / perIcon, 0, 1);
      assembles[i] = easeOutCubic(raw);
    }

    // ── 1. integrate velocity physics where ambient dominates ──
    for (let i = 0; i < count; i++) {
      const s = states[i];
      const ambient = 1 - assembles[i];
      if (ambient <= 0.001) continue;

      // scroll impulse — pushes icons with scroll direction
      s.vel.y -= scrollVel * 14 * dt * ambient;
      s.vel.x += scrollVel * 4 * dt * (i % 2 === 0 ? 1 : -1) * ambient;

      // cursor repulsion within a radius (feels like a soft shove)
      const dx = s.pos.x - cursorWorldX;
      const dy = s.pos.y - cursorWorldY;
      const distSq = dx * dx + dy * dy;
      const radius = 4.5;
      if (distSq < radius * radius && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / radius) * 22 * ambient;
        s.vel.x += (dx / dist) * force * dt;
        s.vel.y += (dy / dist) * force * dt;
      }

      // very gentle centering so icons don't slowly crawl off forever
      s.vel.x += -s.pos.x * 0.04 * dt * ambient;
      s.vel.y += -s.pos.y * 0.04 * dt * ambient;
      s.vel.z += -(s.pos.z + 6) * 0.04 * dt * ambient;

      // minimal damping — keep them zooming around
      s.vel.multiplyScalar(1 - 0.03 * dt);

      // speed cap
      const speed = s.vel.length();
      if (speed > MAX_SPEED) s.vel.multiplyScalar(MAX_SPEED / speed);

      // integrate
      s.pos.addScaledVector(s.vel, dt);

      // wall bounces — elastic
      if (s.pos.x > bounds.x) {
        s.pos.x = bounds.x;
        s.vel.x = -Math.abs(s.vel.x) * WALL_RESTITUTION;
      } else if (s.pos.x < -bounds.x) {
        s.pos.x = -bounds.x;
        s.vel.x = Math.abs(s.vel.x) * WALL_RESTITUTION;
      }
      if (s.pos.y > bounds.y) {
        s.pos.y = bounds.y;
        s.vel.y = -Math.abs(s.vel.y) * WALL_RESTITUTION;
      } else if (s.pos.y < -bounds.y) {
        s.pos.y = -bounds.y;
        s.vel.y = Math.abs(s.vel.y) * WALL_RESTITUTION;
      }
      if (s.pos.z > bounds.zMax) {
        s.pos.z = bounds.zMax;
        s.vel.z = -Math.abs(s.vel.z) * WALL_RESTITUTION;
      } else if (s.pos.z < bounds.zMin) {
        s.pos.z = bounds.zMin;
        s.vel.z = Math.abs(s.vel.z) * WALL_RESTITUTION;
      }

      // angular
      s.rot.x += s.angVel.x * dt;
      s.rot.y += s.angVel.y * dt;
      s.rot.z += s.angVel.z * dt;
    }

    // ── 2. pairwise elastic collisions (O(n²) is fine at n≈19) ──
    const minDist = ICON_RADIUS * 2;
    const minDistSq = minDist * minDist;
    for (let i = 0; i < count; i++) {
      const a = states[i];
      if (1 - assembles[i] <= 0.05) continue;
      for (let j = i + 1; j < count; j++) {
        const b = states[j];
        if (1 - assembles[j] <= 0.05) continue;
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const dz = b.pos.z - a.pos.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= minDistSq || d2 < 0.0001) continue;

        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const nz = dz / d;

        // separate
        const overlap = (minDist - d) * 0.5;
        a.pos.x -= nx * overlap;
        a.pos.y -= ny * overlap;
        a.pos.z -= nz * overlap;
        b.pos.x += nx * overlap;
        b.pos.y += ny * overlap;
        b.pos.z += nz * overlap;

        // elastic exchange along the normal (equal mass)
        const va = a.vel.x * nx + a.vel.y * ny + a.vel.z * nz;
        const vb = b.vel.x * nx + b.vel.y * ny + b.vel.z * nz;
        const impulse = (vb - va) * ICON_RESTITUTION;
        a.vel.x += impulse * nx;
        a.vel.y += impulse * ny;
        a.vel.z += impulse * nz;
        b.vel.x -= impulse * nx;
        b.vel.y -= impulse * ny;
        b.vel.z -= impulse * nz;

        // kick angular velocity on hit for a more tactile feel
        a.angVel.x += (Math.random() - 0.5) * 1.2;
        a.angVel.y += (Math.random() - 0.5) * 1.2;
        b.angVel.x += (Math.random() - 0.5) * 1.2;
        b.angVel.y += (Math.random() - 0.5) * 1.2;
      }
    }

    // ── 3. apply transforms (blend physics ↔ grid) ──
    for (let i = 0; i < count; i++) {
      const g = groupsRef.current[i];
      if (!g) continue;
      const s = states[i];
      const assem = assembles[i];

      const gx = grid[i].x;
      // Anchor the grid just under the #techstack heading. Convert the
      // heading's current screen y to world coords so the grid tracks it
      // while the page scrolls.
      const headingBottomPx = headingBottomRef.current || size.height * 0.3;
      const gridYOffset =
        ((size.height / 2 - headingBottomPx - 40) * viewport.height) /
        size.height;
      const gy = grid[i].y + gridYOffset;

      // subtle breathing bob on assembled icons so they don't freeze
      const t = performance.now() * 0.001;
      const bobY = Math.sin(t * 1.3 + i * 0.4) * 0.06 * assem;
      const bobX = Math.cos(t * 0.9 + i * 0.37) * 0.04 * assem;

      tmp.set(
        THREE.MathUtils.lerp(s.pos.x, gx + bobX, assem),
        THREE.MathUtils.lerp(s.pos.y, gy + bobY, assem),
        THREE.MathUtils.lerp(s.pos.z, 0, assem)
      );
      // exit: drop down
      tmp.y -= exitEased * (viewport.height * 0.9 + i * 0.15);
      g.position.copy(tmp);

      // rotation: physics tumble → settled (facing camera) as assem → 1
      g.rotation.x = THREE.MathUtils.lerp(s.rot.x, 0, assem);
      g.rotation.y = THREE.MathUtils.lerp(s.rot.y, 0, assem);
      g.rotation.z = THREE.MathUtils.lerp(s.rot.z, 0, assem);

      // opacity handled by material alpha on the glass — fade on exit
      const scale = THREE.MathUtils.lerp(0.9, 1.15, assem) * (1 - exitEased);
      g.scale.setScalar(Math.max(0.001, scale));

      // Fade icons in as they assemble: scattered invisible, assembled full.
      const matOpacity =
        THREE.MathUtils.lerp(SCATTER_OPACITY, 1, assem) * (1 - exitEased);
      g.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material | undefined;
        if (mat && "opacity" in mat) {
          (mat as THREE.Material & { opacity: number }).opacity = matOpacity;
        }
      });
    }
  });

  return (
    <>
      {TECH_SKILLS.map((skill, i) => {
        const s = states[i];
        return icons[i] && ready && s ? (
          <Icon3D
            key={skill.name}
            icon={icons[i] as ExtrudedIcon}
            fallbackColor={skill.color}
            initialPos={[s.pos.x, s.pos.y, s.pos.z]}
            meshRef={(g) => {
              groupsRef.current[i] = g;
            }}
          />
        ) : null;
      })}
    </>
  );
}

// ── Canvas wrapper ──────────────────────────────────────────────────────

const TechStackCanvas = () => {
  const progressRef = useRef(0);
  const exitRef = useRef(0);
  const velocityRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let enterTrigger: ScrollTrigger | null = null;
    let exitTrigger: ScrollTrigger | null = null;
    let pageTrigger: ScrollTrigger | null = null;

    const timer = setTimeout(() => {
      enterTrigger = ScrollTrigger.create({
        trigger: "#techstack",
        start: "top 85%",
        end: "top 10%",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      exitTrigger = ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top 50%",
        scrub: true,
        onUpdate: (self) => {
          exitRef.current = self.progress;
        },
      });

      pageTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          velocityRef.current = self.getVelocity();
        },
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      enterTrigger?.kill();
      exitTrigger?.kill();
      pageTrigger?.kill();
    };
  }, [mounted]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ fov: 55, position: [0, 0, 18] }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          {/* Bright lighting so the icon brand colours read correctly */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 8, 6]} intensity={1.6} />
          <directionalLight position={[-6, -3, 4]} intensity={0.9} color="#ffffff" />
          <pointLight position={[0, 0, 10]} intensity={1.2} />

          <IconField
            progressRef={progressRef}
            exitRef={exitRef}
            velocityRef={velocityRef}
          />

          <AdaptiveDpr pixelated />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default TechStackCanvas;
