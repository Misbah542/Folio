import { useEffect, useState } from "react";
import * as THREE from "three";

const TEXTURE_SIZE = 128;
const cache = new Map<string, THREE.CanvasTexture>();

function rasterizeSvg(url: string): Promise<THREE.CanvasTexture> {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = TEXTURE_SIZE;
      canvas.height = TEXTURE_SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      cache.set(url, texture);
      resolve(texture);
    };
    img.onerror = () => reject(new Error(`Failed to load SVG: ${url}`));
    img.src = url;
  });
}

export function useSvgTextures(
  urls: string[]
): (THREE.CanvasTexture | null)[] {
  const [textures, setTextures] = useState<(THREE.CanvasTexture | null)[]>(
    () => urls.map(() => null)
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      urls.map((url) => rasterizeSvg(url).catch(() => null))
    ).then((results) => {
      if (!cancelled) setTextures(results);
    });

    return () => {
      cancelled = true;
    };
  }, [urls.length]);

  return textures;
}
