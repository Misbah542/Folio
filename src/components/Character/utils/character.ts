import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import buildAndroidBot from "./androidBot";

/**
 * The avatar is generated in code rather than downloaded — see `androidBot.ts`.
 * `loadCharacter` keeps the GLTF-shaped return value so the scene, the mixer
 * and the scroll timelines are unaware of where the model came from.
 */
const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const { scene: character, animations } = buildAndroidBot();

        character.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.frustumCulled = true;
        });

        // Pre-warm the shaders synchronously. compileAsync polls the renderer
        // after the fact, which throws if the renderer was disposed in between
        // (React re-mounts this scene in development).
        renderer.compile(character, camera, scene);

        const gltf = { scene: character, animations } as unknown as GLTF;
        resolve(gltf);

        setCharTimeline(character, camera);
        setAllTimeline();
      } catch (err) {
        console.error("Error building the character:", err);
        reject(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
