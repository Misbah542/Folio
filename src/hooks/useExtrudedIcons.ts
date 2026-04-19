import { useEffect, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";

export interface ExtrudedIcon {
  geometries: { geometry: THREE.BufferGeometry; color: string }[];
  size: number; // uniform scale factor (max extent of the bounding box)
}

const cache = new Map<string, ExtrudedIcon>();

async function loadExtruded(
  url: string,
  fallbackColor: string
): Promise<ExtrudedIcon> {
  const cached = cache.get(url);
  if (cached) return cached;

  const res = await fetch(url);
  const text = await res.text();

  const loader = new SVGLoader();
  const data = loader.parse(text);

  const geoms: { geometry: THREE.BufferGeometry; color: string }[] = [];

  for (const path of data.paths) {
    const fillColor =
      (path.userData?.style?.fill as string | undefined) || fallbackColor;
    if (fillColor === "none") continue;

    const shapes = SVGLoader.createShapes(path);
    for (const shape of shapes) {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 24,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1.5,
        bevelSegments: 2,
        curveSegments: 8,
      });
      // SVG y-axis is flipped vs three.js; bake the flip into the geometry
      geometry.scale(1, -1, 1);
      geoms.push({ geometry, color: fillColor });
    }
  }

  // center on origin and normalize to size 1
  const box = new THREE.Box3();
  const tmpBox = new THREE.Box3();
  for (const { geometry } of geoms) {
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      tmpBox.copy(geometry.boundingBox);
      box.union(tmpBox);
    }
  }
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  for (const { geometry } of geoms) {
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
  }

  const result: ExtrudedIcon = { geometries: geoms, size: 1 };
  cache.set(url, result);
  return result;
}

export function useExtrudedIcons(
  items: { url: string; color: string }[]
): (ExtrudedIcon | null)[] {
  const [icons, setIcons] = useState<(ExtrudedIcon | null)[]>(() =>
    items.map(() => null)
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      items.map((it) =>
        loadExtruded(it.url, it.color).catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setIcons(results);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return icons;
}
