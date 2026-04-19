export type Section = "career" | "work" | "techstack";

export const STATES = {
  career: {
    desktop: {
      scale: { x: 0.35, y: 0.35, z: 0.35 },
      position: { x: 0, y: -100, z: 0 },
      rotation: { x: 0, y: Math.PI / 12, z: 0 },
    },
    mobile: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
  },
  work: {
    desktop: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: Math.PI / 12, y: -Math.PI / 4, z: 0 },
    },
    mobile: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: Math.PI / 6, y: -Math.PI / 6, z: 0 },
    },
  },
  techstack: {
    desktop: {
      scale: { x: 0.45, y: 0.45, z: 0.45 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: -40, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
};

export const getKeyboardState = ({
  section,
  isMobile,
}: {
  section: Section;
  isMobile: boolean;
}) => {
  const baseTransform = STATES[section][isMobile ? "mobile" : "desktop"];

  const getScaleOffset = () => {
    const width = window.innerWidth;
    const DESKTOP_REF_WIDTH = 1280;
    const MOBILE_REF_WIDTH = 390;

    const targetScale = isMobile
      ? width / MOBILE_REF_WIDTH
      : width / DESKTOP_REF_WIDTH;

    const minScale = 0.5;
    const maxScale = isMobile ? 0.6 : 1.15;

    return Math.min(Math.max(targetScale, minScale), maxScale);
  };

  const scaleOffset = getScaleOffset();

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
  };
};
