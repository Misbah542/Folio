import * as THREE from "three";

/**
 * Procedural Android-bot avatar.
 *
 * The bot replaces the previously shipped (encrypted) humanoid GLB while
 * keeping the exact rig contract the rest of the scene relies on, so every
 * movement spec carries over unchanged:
 *
 *   spine005  neck joint      — pitched by the scroll timeline
 *   spine006  head joint      — driven by the pointer (handleHeadRotation)
 *   Plane004  monitor group   — faded / raised by the scroll timeline
 *   screenlight               — emissive plane that drives the point light
 *   footL / footR             — ankle joints
 *
 * Clips are authored with the same names the mixer looks for: introAnimation,
 * typing, Blink, browup and key1…key6. No two clips touch the same property,
 * so they layer without the mixer averaging them against each other.
 */

export interface BotBuild {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

// ── palette ─────────────────────────────────────────────────────────────

const GREEN = 0x3ddc84;
const GREEN_DEEP = 0x1f9e63;
const SHELL_DARK = 0x12171c;
const GLOW = 0xb8fbe2;

// ── rig layout (world units; the camera frames y ≈ 10.2 → 16 on landing) ──

const HIP_Y = 5.4;
const SHOULDER_Y = 10.4;
const SHOULDER_X = 1.78;
const NECK_Y = 11.4;
const HEAD_JOINT_Y = 12.15;
const HEAD_R = 1.6;
const DESK_Y = 7.5;

/** Where the monitor lives, and how far it is turned in towards the bot. */
const MONITOR = { x: 4.2, y: 10.15, z: 2.2, yaw: -1.62 };

/** Rest pitch the pointer rig parks the head at — cancelled by `headFix`. */
export const HEAD_REST_PITCH = Math.PI / 12;

// ── small helpers ───────────────────────────────────────────────────────

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Builds a NumberKeyframeTrack from sparse keys, sampling an easing curve in
 * between so the mixer's linear interpolation still reads as eased motion.
 */
function easedTrack(
  path: string,
  keys: [time: number, value: number][],
  ease: (t: number) => number = easeInOutSine,
  samples = 10
): THREE.NumberKeyframeTrack {
  const times: number[] = [];
  const values: number[] = [];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    for (let s = 0; s < samples; s++) {
      const k = s / samples;
      times.push(t0 + (t1 - t0) * k);
      values.push(v0 + (v1 - v0) * ease(k));
    }
  }
  const [lastTime, lastValue] = keys[keys.length - 1];
  times.push(lastTime);
  values.push(lastValue);
  return new THREE.NumberKeyframeTrack(path, times, values);
}

/** A looping sine wiggle — the backbone of the idle / typing motion. */
function wiggleTrack(
  path: string,
  base: number,
  amplitude: number,
  duration: number,
  cycles = 1,
  phase = 0,
  steps = 24
): THREE.NumberKeyframeTrack {
  const times: number[] = [];
  const values: number[] = [];
  for (let i = 0; i <= steps; i++) {
    times.push((i / steps) * duration);
    values.push(
      base + Math.sin((i / steps) * cycles * Math.PI * 2 + phase) * amplitude
    );
  }
  return new THREE.NumberKeyframeTrack(path, times, values);
}

/**
 * A joint node: positioned, but never pre-rotated. Keeping every joint at the
 * identity rotation is what lets the clips animate `rotation[x]` directly —
 * an animated value is then an offset from the rest pose instead of a
 * replacement for a baked-in orientation.
 */
function node(name: string, offset: THREE.Vector3, parent: THREE.Object3D) {
  const group = new THREE.Group();
  group.name = name;
  group.position.copy(offset);
  parent.add(group);
  return group;
}

/**
 * Capsule spanning `from` → `to`, expressed relative to `from`. The limb's
 * shape lives on the mesh so the joint above it can stay unrotated.
 */
function limbBetween(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  material: THREE.Material
) {
  const dir = to.clone().sub(from);
  const length = dir.length();
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.02), 6, 18),
    material
  );
  mesh.position.copy(dir).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
  return mesh;
}

/**
 * Monitor parts are position-animated from (0, -10, 2) by the scroll timeline,
 * so their placement is baked into the geometry and the mesh transform stays
 * at the identity.
 */
function placed(
  geometry: THREE.BufferGeometry,
  x: number,
  y: number,
  z: number,
  yaw = 0
) {
  if (yaw) geometry.rotateY(yaw);
  geometry.translate(x, y, z);
  return geometry;
}

/**
 * Paints the monitor content: an editor-shaped mock, drawn once into a canvas.
 * Cheap, dependency-free, and it stops the screen reading as a white slab.
 */
function makeScreenTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 600;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0b1116";
  ctx.fillRect(0, 0, w, h);

  // Title bar
  ctx.fillStyle = "#141c22";
  ctx.fillRect(0, 0, w, 46);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(30 + i * 26, 23, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#3f4c55";
  ctx.fillRect(150, 16, 210, 14);

  // Gutter + file rail
  ctx.fillStyle = "#0e151a";
  ctx.fillRect(0, 46, 190, h - 46);
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i === 2 ? "#3ddc84" : "#2a353d";
    ctx.fillRect(24, 86 + i * 34, i === 2 ? 120 : 60 + ((i * 37) % 80), 10);
  }

  // Code lines
  const palette = ["#3ddc84", "#57c7ff", "#ffc46b", "#5f6d76", "#8c9891"];
  let y = 84;
  for (let i = 0; i < 13; i++) {
    const indent = 220 + ((i % 4) * 34);
    let x = indent;
    const tokens = 2 + ((i * 7) % 4);
    for (let t = 0; t < tokens; t++) {
      const len = 52 + ((i * 31 + t * 53) % 150);
      ctx.fillStyle = palette[(i + t) % palette.length];
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, y, len, 11);
      x += len + 18;
      if (x > w - 90) break;
    }
    y += 34;
  }
  ctx.globalAlpha = 1;

  // Status strip
  ctx.fillStyle = "#12321f";
  ctx.fillRect(0, h - 30, w, 30);
  ctx.fillStyle = "#3ddc84";
  ctx.fillRect(24, h - 21, 108, 12);
  ctx.fillRect(160, h - 21, 64, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// ── model ───────────────────────────────────────────────────────────────

export function buildAndroidBot(): BotBuild {
  const root = new THREE.Group();
  root.name = "AndroidBot";

  // ── materials ─────────────────────────────────────────────────────────

  const shell = new THREE.MeshPhysicalMaterial({
    color: GREEN,
    roughness: 0.34,
    metalness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
  });
  const shellDeep = new THREE.MeshPhysicalMaterial({
    color: GREEN_DEEP,
    roughness: 0.42,
    metalness: 0.12,
    clearcoat: 0.4,
  });
  const chassis = new THREE.MeshStandardMaterial({
    color: SHELL_DARK,
    roughness: 0.42,
    metalness: 0.72,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: 0x0a0d10,
    roughness: 0.85,
    metalness: 0.05,
  });
  const lit = (color: number, intensity: number) =>
    new THREE.MeshStandardMaterial({
      color: 0x0b0f12,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.25,
      metalness: 0,
    });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: GLOW,
    emissiveIntensity: 2.6,
    roughness: 0.15,
  });

  // Everything the intro clip lifts into frame hangs off this group.
  const botRig = new THREE.Group();
  botRig.name = "botRig";
  root.add(botRig);

  // ── hips + legs (seated) ──────────────────────────────────────────────

  const hips = new THREE.Group();
  hips.name = "hips";
  hips.position.y = HIP_Y;
  botRig.add(hips);

  const pelvis = new THREE.Mesh(
    new THREE.CapsuleGeometry(1.3, 0.55, 6, 20),
    shellDeep
  );
  pelvis.rotation.z = Math.PI / 2;
  pelvis.scale.set(1, 1, 0.82);
  hips.add(pelvis);

  (["L", "R"] as const).forEach((side) => {
    const s = side === "L" ? -1 : 1;
    const hipPos = V(s * 0.88, HIP_Y + 0.1, 0.15);
    const kneePos = V(s * 0.98, HIP_Y - 0.35, 2.7);
    const anklePos = V(s * 0.98, 1.35, 3.05);

    // Thighs run forward (the bot is seated), shins drop to the floor.
    const thigh = node(`thigh${side}`, hipPos.clone().sub(V(0, HIP_Y, 0)), hips);
    thigh.add(limbBetween(hipPos, kneePos, 0.6, shell));

    const shin = node(`shin${side}`, kneePos.clone().sub(hipPos), thigh);
    shin.add(limbBetween(kneePos, anklePos, 0.48, shell));

    const foot = node(`foot${side}`, anklePos.clone().sub(kneePos), shin);
    const ankle = node(`ankle${side}`, V(0, 0, 0), foot);
    const sole = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.55, 5, 16), rubber);
    sole.rotation.x = Math.PI / 2;
    sole.position.set(0, -0.12, 0.36);
    ankle.add(sole);
  });

  // ── torso ─────────────────────────────────────────────────────────────

  const spine = new THREE.Group();
  spine.name = "spine";
  spine.position.y = HIP_Y;
  botRig.add(spine);

  // Lathe profile: flat base, straight flanks, domed shoulders — the mascot
  // silhouette as a single smooth surface.
  const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(1.62, 0)];
  profile.push(new THREE.Vector2(1.8, 0.28), new THREE.Vector2(1.8, 4.35));
  for (let i = 1; i <= 14; i++) {
    const a = (i / 14) * (Math.PI / 2);
    profile.push(new THREE.Vector2(1.8 * Math.cos(a), 4.35 + 1.75 * Math.sin(a)));
  }
  const torso = new THREE.Mesh(new THREE.LatheGeometry(profile, 56), shell);
  torso.scale.z = 0.86;
  spine.add(torso);

  const seam = new THREE.Mesh(new THREE.TorusGeometry(1.56, 0.05, 8, 64), chassis);
  seam.rotation.x = Math.PI / 2;
  seam.position.y = 2.2;
  seam.scale.set(1.02, 0.87, 1);
  spine.add(seam);

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 0.16, 32),
    shellDeep
  );
  plate.rotation.x = Math.PI / 2;
  plate.position.set(0, 3.45, 1.4);
  spine.add(plate);

  const chestLed = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.09, 12, 32),
    lit(GREEN, 2.4)
  );
  chestLed.name = "chestLed";
  chestLed.position.set(0, 3.45, 1.5);
  spine.add(chestLed);

  // ── arms ──────────────────────────────────────────────────────────────

  (["L", "R"] as const).forEach((side) => {
    const s = side === "L" ? -1 : 1;
    const shoulderPos = V(s * SHOULDER_X, SHOULDER_Y, 0.1);
    const elbowPos = V(s * 2.15, 8.55, 0.95);
    const handPos = V(s * 1.3, 7.98, 3.2);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 18), shellDeep);
    cap.position.copy(shoulderPos).sub(V(0, HIP_Y, 0));
    spine.add(cap);

    const upper = node(`upper_arm${side}`, shoulderPos, botRig);
    upper.add(limbBetween(shoulderPos, elbowPos, 0.45, shell));

    const fore = node(`forearm${side}`, elbowPos.clone().sub(shoulderPos), upper);
    fore.add(limbBetween(elbowPos, handPos, 0.4, shell));

    const hand = node(`hand${side}`, handPos.clone().sub(elbowPos), fore);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), shellDeep);
    palm.scale.set(1, 0.76, 1.05);
    hand.add(palm);

    const fingers = node(`fingers${side}`, V(0, -0.12, 0.18), hand);
    for (let f = 0; f < 3; f++) {
      const nub = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.1, 0.24, 4, 10),
        shellDeep
      );
      nub.position.set((f - 1) * 0.22, -0.08, 0.16);
      nub.rotation.x = 0.55;
      fingers.add(nub);
    }
  });

  // ── neck + head ───────────────────────────────────────────────────────

  const neck = new THREE.Group();
  neck.name = "spine005";
  neck.position.y = NECK_Y;
  botRig.add(neck);

  const neckMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.52, 0.95, 24),
    chassis
  );
  neckMesh.position.y = 0.42;
  neck.add(neckMesh);

  const head = new THREE.Group();
  head.name = "spine006";
  head.position.y = HEAD_JOINT_Y - NECK_Y;
  neck.add(head);

  // handleHeadRotation parks rotation.x at −HEAD_REST_PITCH when the pointer is
  // centred, so the rig cancels it here and the bot looks level at rest.
  const headFix = new THREE.Group();
  headFix.name = "headFix";
  headFix.rotation.x = HEAD_REST_PITCH;
  head.add(headFix);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(HEAD_R, 56, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    shell
  );
  dome.scale.z = 0.94;
  headFix.add(dome);

  const jaw = new THREE.Mesh(
    new THREE.CylinderGeometry(HEAD_R, HEAD_R * 0.94, 0.24, 56),
    shell
  );
  jaw.position.y = -0.11;
  jaw.scale.z = 0.94;
  headFix.add(jaw);

  // Dark faceplate patch across the front of the dome.
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(
      HEAD_R * 1.005,
      48,
      28,
      Math.PI / 2 - 0.72,
      1.44,
      0.62,
      0.66
    ),
    chassis
  );
  visor.scale.z = 0.945;
  headFix.add(visor);

  (["L", "R"] as const).forEach((side) => {
    const s = side === "L" ? -1 : 1;

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 18), eyeMat);
    eye.name = `eye${side}`;
    eye.position.set(s * 0.52, 0.6, 1.3);
    eye.scale.set(1.05, 1, 0.62);
    headFix.add(eye);

    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.08), lit(GREEN, 2.2));
    brow.name = `eyebrow_${side}`;
    brow.position.set(s * 0.54, 1.0, 1.1);
    brow.rotation.set(0.5, 0, s * -0.14);
    headFix.add(brow);

    // Antennae — the mascot's signature, and the bot's mood indicator.
    const antenna = new THREE.Group();
    antenna.name = `antenna${side}`;
    antenna.position.set(s * 0.76, 1.24, 0);
    antenna.rotation.z = s * 0.62;
    const stalk = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.72, 4, 12), shell);
    stalk.position.y = 0.46;
    antenna.add(stalk);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), lit(GLOW, 3));
    tip.position.y = 0.92;
    antenna.add(tip);
    headFix.add(antenna);
  });

  // ── desk ──────────────────────────────────────────────────────────────

  const desk = new THREE.Group();
  desk.name = "deskRig";
  botRig.add(desk);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 0.26, 4.6),
    new THREE.MeshStandardMaterial({ color: 0x0f1418, roughness: 0.78, metalness: 0.06 })
  );
  deskTop.position.set(0, DESK_Y, 2.3);
  desk.add(deskTop);

  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.05, 0.08), lit(GREEN, 1.6));
  deskEdge.position.set(0, DESK_Y - 0.16, 4.53);
  desk.add(deskEdge);

  [-4.1, 4.1].forEach((x) => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, DESK_Y - 0.15, 0.24),
      chassis
    );
    leg.position.set(x, (DESK_Y - 0.15) / 2, 4.1);
    desk.add(leg);
  });

  // Chair — without it the seated pose reads as floating in the wide shot.
  const chair = new THREE.Group();
  chair.name = "chairRig";
  botRig.add(chair);

  const seat = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 0.34, 28),
    rubber
  );
  seat.position.set(0, 4.6, -0.15);
  seat.scale.z = 0.94;
  chair.add(seat);

  const backRest = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 3.9, 0.3),
    rubber
  );
  backRest.position.set(0, 7.2, -1.75);
  backRest.rotation.x = -0.12;
  chair.add(backRest);

  const chairPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 4.1, 16),
    chassis
  );
  chairPost.position.set(0, 2.4, -0.15);
  chair.add(chairPost);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 1.7), chassis);
    strut.position.set(Math.sin(a) * 0.8, 0.4, -0.15 + Math.cos(a) * 0.8);
    strut.rotation.y = a;
    chair.add(strut);
  }

  const keyboard = new THREE.Group();
  keyboard.position.set(0, DESK_Y + 0.13, 3.4);
  keyboard.rotation.x = -0.05;
  desk.add(keyboard);

  keyboard.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.14, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x0d1114, roughness: 0.5, metalness: 0.6 })
    )
  );

  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x1d242b,
    roughness: 0.6,
    metalness: 0.25,
  });
  const keyMatLit = lit(GREEN, 1.4);

  // Six named keycaps — key1…key6 each carry their own press clip.
  let keyIndex = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.09, 0.28),
        (row + col) % 5 === 0 ? keyMatLit : keyMat
      );
      cap.position.set((col - 3.5) * 0.37, 0.1, (row - 1) * 0.35);
      if (keyIndex < 6 && col % 3 === 1) cap.name = `key${++keyIndex}`;
      keyboard.add(cap);
    }
  }

  const mug = new THREE.Group();
  mug.position.set(-2.9, DESK_Y + 0.13, 3.6);
  const mugBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.26, 0.62, 24, 1, true),
    shellDeep
  );
  mugBody.position.y = 0.31;
  const mugHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.045, 8, 20, Math.PI),
    shellDeep
  );
  mugHandle.position.set(0.31, 0.34, 0);
  mugHandle.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  mug.add(mugBody, mugHandle);
  desk.add(mug);

  // A phone on a stand — a nod to what the bot actually ships.
  const phone = new THREE.Group();
  phone.position.set(2.55, DESK_Y + 0.13, 3.8);
  phone.rotation.set(-0.3, -0.36, 0);
  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.74, 1.5, 0.08), chassis);
  phoneBody.position.y = 0.76;
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 1.34), lit(GREEN, 1.9));
  phoneScreen.position.set(0, 0.76, 0.05);
  phone.add(phoneBody, phoneScreen);
  desk.add(phone);

  // ── monitor (Plane004) + screen light ─────────────────────────────────

  // Direct children of the root — that is where the scroll timeline looks.
  const monitor = new THREE.Group();
  monitor.name = "Plane004";
  root.add(monitor);

  const { x: mx, y: my, z: mz, yaw } = MONITOR;

  const bezel = new THREE.Mesh(
    placed(new THREE.BoxGeometry(4.4, 2.9, 0.22), mx, my, mz, yaw),
    new THREE.MeshStandardMaterial({
      name: "Material.017",
      color: 0x0c1013,
      roughness: 0.4,
      metalness: 0.7,
    })
  );
  monitor.add(bezel);

  const screenTexture = makeScreenTexture();
  const screen = new THREE.Mesh(
    placed(new THREE.PlaneGeometry(4.02, 2.52), mx, my, mz, yaw).translate(
      Math.sin(yaw) * 0.13,
      0,
      Math.cos(yaw) * 0.13
    ),
    new THREE.MeshStandardMaterial({
      name: "Material.018",
      color: 0xffffff,
      map: screenTexture,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.85,
      roughness: 0.35,
      side: THREE.DoubleSide,
    })
  );
  monitor.add(screen);

  const stand = new THREE.Mesh(
    placed(new THREE.CylinderGeometry(0.16, 0.16, 2.3, 16), mx, my - 1.4, mz),
    new THREE.MeshStandardMaterial({
      name: "Material.019",
      color: 0x0c1013,
      roughness: 0.4,
      metalness: 0.7,
    })
  );
  monitor.add(stand);

  // Emissive card tucked behind the bezel: it bleeds a halo around the
  // monitor's edges, and the point light tracks its opacity so the bot looks
  // lit by the screen once the timeline switches it on. Kept behind the panel
  // so it never washes out the screen content.
  const screenLight = new THREE.Mesh(
    placed(new THREE.PlaneGeometry(4.9, 3.3), mx, my, mz, yaw).translate(
      Math.sin(yaw) * -0.24,
      0,
      Math.cos(yaw) * -0.24
    ),
    new THREE.MeshStandardMaterial({
      color: 0x0a0f12,
      emissive: GLOW,
      emissiveIntensity: 0,
      roughness: 1,
      side: THREE.DoubleSide,
    })
  );
  screenLight.name = "screenlight";
  root.add(screenLight);

  return { scene: root, animations: buildClips() };
}

// ── animation clips ─────────────────────────────────────────────────────

function buildClips(): THREE.AnimationClip[] {
  const clips: THREE.AnimationClip[] = [];
  const sides = ["L", "R"] as const;

  // Boot-up: the bot drops into the chair, powers its optics and lifts its
  // head. Frame 0 doubles as the pre-load pose.
  const intro = 2.6;
  const scaleKeys: [number, number][] = [
    [0, 0.82],
    [1.4, 1],
    [intro, 1],
  ];
  clips.push(
    new THREE.AnimationClip("introAnimation", intro, [
      easedTrack(
        "botRig.position[y]",
        [
          [0, -3.4],
          [1.5, 0],
          [intro, 0],
        ],
        easeOutCubic,
        18
      ),
      ...(["x", "y", "z"] as const).map((axis) =>
        easedTrack(`botRig.scale[${axis}]`, scaleKeys, easeOutBack, 18)
      ),
      easedTrack(
        "headFix.rotation[x]",
        [
          [0, HEAD_REST_PITCH + 0.44],
          [1.15, HEAD_REST_PITCH - 0.07],
          [1.9, HEAD_REST_PITCH],
          [intro, HEAD_REST_PITCH],
        ],
        easeOutCubic,
        14
      ),
      // Optics power on. Blink owns scale[y], so the boot-up uses x/z only.
      ...sides.flatMap((side, i) => {
        const at = 0.95 + i * 0.1;
        return (
          [
            ["x", 1.05],
            ["z", 0.62],
          ] as const
        ).map(([axis, end]) =>
          easedTrack(
            `eye${side}.scale[${axis}]`,
            [
              [0, 0.02],
              [at, 0.02],
              [at + 0.3, end * 1.2],
              [at + 0.5, end],
              [intro, end],
            ],
            easeOutCubic,
            8
          )
        );
      }),
    ])
  );

  // Idle blink — a double blink so it never feels metronomic.
  clips.push(
    new THREE.AnimationClip(
      "Blink",
      4.2,
      sides.map((side) =>
        easedTrack(
          `eye${side}.scale[y]`,
          [
            [0, 1],
            [0.11, 0.06],
            [0.22, 1],
            [2.5, 1],
            [2.61, 0.06],
            [2.72, 1],
            [4.2, 1],
          ],
          easeInOutSine,
          4
        )
      )
    )
  );

  // Brow raise + antenna perk, played while the pointer is over the face.
  clips.push(
    new THREE.AnimationClip(
      "browup",
      0.5,
      sides.flatMap((side) => {
        const s = side === "L" ? -1 : 1;
        return [
          easedTrack(
            `eyebrow_${side}.position[y]`,
            [
              [0, 1.0],
              [0.5, 1.2],
            ],
            easeOutBack,
            10
          ),
          easedTrack(
            `eyebrow_${side}.rotation[z]`,
            [
              [0, s * -0.14],
              [0.5, s * -0.36],
            ],
            easeOutCubic,
            8
          ),
          easedTrack(
            `antenna${side}.rotation[z]`,
            [
              [0, s * 0.62],
              [0.5, s * 0.28],
            ],
            easeOutBack,
            10
          ),
        ];
      })
    )
  );

  // Typing loop — arms, fingers, a restless leg and the chest LED pulse.
  const typeDur = 0.72;
  clips.push(
    new THREE.AnimationClip("typing", typeDur, [
      ...sides.flatMap((side, i) => {
        const phase = i * Math.PI * 0.6;
        return [
          wiggleTrack(`upper_arm${side}.rotation[x]`, 0, 0.028, typeDur, 2, phase),
          wiggleTrack(`forearm${side}.rotation[x]`, 0, 0.075, typeDur, 2, phase),
          wiggleTrack(`forearm${side}.rotation[z]`, 0, 0.035, typeDur, 1, phase + 0.8),
          wiggleTrack(`hand${side}.rotation[x]`, 0, 0.16, typeDur, 4, phase),
          wiggleTrack(
            `fingers${side}.rotation[x]`,
            0,
            0.3,
            typeDur,
            4,
            phase + Math.PI / 2
          ),
          wiggleTrack(`thigh${side}.rotation[x]`, 0, 0.012, typeDur, 1, phase),
          wiggleTrack(`shin${side}.rotation[x]`, 0, 0.02, typeDur, 1, phase),
          wiggleTrack(`ankle${side}.rotation[x]`, 0, 0.06, typeDur, i ? 1 : 2, phase),
        ];
      }),
      wiggleTrack("chestLed.scale[x]", 1, 0.09, typeDur, 1, 0),
      wiggleTrack("chestLed.scale[y]", 1, 0.09, typeDur, 1, 0),
    ])
  );

  // Keycap presses — six independent loops at slightly different tempos.
  for (let i = 1; i <= 6; i++) {
    const dur = 0.42 + (i % 3) * 0.11;
    clips.push(
      new THREE.AnimationClip(`key${i}`, dur, [
        easedTrack(
          `key${i}.position[y]`,
          [
            [0, 0.1],
            [dur * 0.25, 0.036],
            [dur * 0.5, 0.1],
            [dur, 0.1],
          ],
          easeInOutSine,
          4
        ),
      ])
    );
  }

  return clips;
}

export default buildAndroidBot;
