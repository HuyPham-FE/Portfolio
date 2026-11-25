/** Geometry shared by the scroll director and its regression tests. No content here. */
export const ORBIT_PHASES = {
  typographyReveal: 0,
  orbitEntrance: 0.12,
  orbitRotation: 0.28,
  orbitDescent: 0.52,
  horizontalTransformation: 0.7,
  galleryReveal: 0.86,
} as const;

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function blend(value: number, start: number, end: number) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}
export function orbitGeometry(width: number, height: number, count: number) {
  const cardWidth = Math.min(650, width * 0.48, height * 0.87);
  return {
    width,
    height,
    count,
    cardWidth,
    stride: cardWidth + Math.min(40, width * 0.025),
    radiusX: width * (width < 1100 ? 0.36 : 0.38),
    radiusY: Math.min(height * 0.23, 210),
  };
}
export type OrbitGeometry = ReturnType<typeof orbitGeometry>;

/** Recycling happens entirely outside the viewport, including the card's width. */
export function loopPosition(
  base: number,
  offset: number,
  g: OrbitGeometry,
  slots: number,
) {
  const low = -g.width / 2 - g.cardWidth * 0.65;
  const period = g.stride * slots;
  return low + ((((base + offset - low) % period) + period) % period);
}

export function orbitPose(index: number, progress: number, g: OrbitGeometry) {
  const p = clamp01(progress);
  const enter = blend(p, 0.12 + ((index % g.count) / g.count) * 0.06, 0.28);
  const turn = blend(p, 0.25, 0.57);
  const descend = blend(p, 0.52, 0.73);
  const flatten = blend(p, 0.7, 0.86);
  const angle =
    ((index % g.count) / g.count) * Math.PI * 2 -
    Math.PI / 2 +
    turn * Math.PI * 1.35;
  const depth = (Math.sin(angle) + 1) / 2;
  const centered = (index % g.count) - (g.count - 1) / 2;
  const spread = centered * g.stride * 0.83;
  const curveY = g.height * 0.1 - Math.min(Math.abs(centered), 3) ** 2 * 24;
  const horizontalX = index * g.stride - g.width * 0.2;
  return {
    x: mix(
      mix(Math.cos(angle) * g.radiusX, spread, descend),
      horizontalX,
      flatten,
    ),
    y: mix(
      mix(
        Math.sin(angle) * g.radiusY - (1 - enter) * g.height * 0.85,
        curveY,
        descend,
      ),
      g.height * 0.08,
      flatten,
    ),
    z: mix(
      mix((depth - 0.5) * 280, 30 - Math.abs(centered) * 35, descend),
      0,
      flatten,
    ),
    rotationY: mix(
      mix(Math.cos(angle) * -32, centered * -8, descend),
      0,
      flatten,
    ),
    rotationZ: mix(
      mix(Math.cos(angle) * 12, centered * 3, descend),
      0,
      flatten,
    ),
    scale: mix(mix(0.52 + depth * 0.2, 0.88, descend), 1, flatten),
    opacity: index >= g.count ? flatten : enter,
    flatten,
    horizontalX,
  };
}

export function canAutoplay(
  progress: number,
  visible: boolean,
  hovered: boolean,
  focused: boolean,
  dragging: boolean,
  hidden: boolean,
) {
  return (
    progress >= ORBIT_PHASES.galleryReveal &&
    visible &&
    !hovered &&
    !focused &&
    !dragging &&
    !hidden
  );
}
