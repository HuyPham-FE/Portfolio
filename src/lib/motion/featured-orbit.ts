/**
 * Helix choreography shared by the controller and its regression tests.
 * World units, y up, camera on the z axis looking at the origin.
 * A train of curved cards slides down a two-turn spiral as the page scrolls.
 */
const TAU = Math.PI * 2;
export const HELIX = {
  radius: 12,
  yStart: -16,
  rise: 28 / (2 * TAU), // per radian: two turns climb 28 units
  turns: 2,
  sagAt: TAU, // a soft sag halfway down the spiral
  sag: 2.5,
  lean: 0.6, // tips each card's height axis towards vertical
} as const;
export const CARD = { length: 5.8, height: 5.8 / 1.4, spacing: 6.2, lead: 2.4 };
export const CAMERA = { distance: 22, fov: 52 } as const;
export const SLICES = 10; // vertical strips per card; enough to read as a smooth curve
export const SCROLL_SCREENS = 4.7; // sticky scroll distance, in viewport heights
export const ARC_PER_RADIAN = Math.hypot(HELIX.radius, HELIX.rise);
export const HELIX_LENGTH = HELIX.turns * TAU * ARC_PER_RADIAN;

type V3 = [number, number, number];
const unit = (v: V3): V3 => {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Point, unit tangent and card "up" axis at arc length `s` from the bottom of the helix. */
export function helixFrame(s: number) {
  const theta = s / ARC_PER_RADIAN;
  const { radius: r, yStart, rise, sagAt, sag, lean } = HELIX;
  const q = (theta - sagAt) / 2;
  const dip = sag * Math.exp(-q * q);
  const cos = Math.cos(theta),
    sin = Math.sin(theta);
  const outward: V3 = [cos, 0, sin];
  const point: V3 = [r * cos, yStart + theta * rise - dip, r * sin];
  const tangent = unit([-r * sin, rise + q * dip, r * cos]);
  const side = unit(cross(tangent, outward));
  return {
    point,
    tangent,
    up: unit([side[0], side[1] + lean, side[2]]),
    outward,
  };
}

/** Arc position of a card's centre, or null while it is off the helix. Card 0 leads from the top. */
export function cardCenter(index: number, count: number, progress: number) {
  const train = (count - 1) * CARD.spacing + CARD.length;
  const head = clamp01(progress) * (HELIX_LENGTH + train) - train;
  const travelled = head + CARD.spacing * (count - 1 - index);
  if (progress >= 1 || travelled <= 0 || travelled >= HELIX_LENGTH) return null;
  return HELIX_LENGTH - travelled + CARD.lead;
}

/**
 * CSS matrix3d (px, y down, origin at the stage centre) for every slice of a card.
 * `outside` is true when the camera sees the outer face; the image then runs against the
 * arc so it reads left-to-right from either side of the spiral.
 */
export function cardSlices(center: number, px: number) {
  const mid = helixFrame(center);
  const toCamera: V3 = [
    -mid.point[0],
    -mid.point[1],
    CAMERA.distance - mid.point[2],
  ];
  const outside =
    mid.outward[0] * toCamera[0] + mid.outward[2] * toCamera[2] > 0;
  const step = CARD.length / SLICES;
  const matrices = Array.from({ length: SLICES }, (_, k) => {
    const { point, tangent, up } = helixFrame(
      center - CARD.length / 2 + (k + 0.5) * step,
    );
    const along: V3 = outside
      ? [-tangent[0], -tangent[1], -tangent[2]]
      : tangent;
    const x: V3 = [along[0], -along[1], along[2]];
    const y: V3 = [-up[0], up[1], -up[2]];
    const z = cross(x, y);
    return `matrix3d(${x},0,${y},0,${z},0,${point[0] * px},${-point[1] * px},${point[2] * px},1)`;
  });
  return { outside, matrices };
}

/**
 * SVG path (px from the stage centre) along one edge of the ribbon between two arc
 * positions: the faint guide lines that trace the spiral around the cards.
 */
export function ribbonEdge(from: number, to: number, side: 1 | -1, px: number) {
  const start = Math.max(0, from),
    end = Math.min(HELIX_LENGTH, to);
  const points: string[] = [];
  for (let s = start; s <= end + 1e-9; s += 0.5) {
    const { point, up } = helixFrame(Math.min(s, end));
    const offset = side * CARD.height * 0.68; // just outside the card edge
    const [x, y, z] = point.map((v, i) => v + up[i] * offset);
    const scale = (CAMERA.distance / (CAMERA.distance - z)) * px;
    points.push(`${(x * scale).toFixed(1)},${(-y * scale).toFixed(1)}`);
  }
  return points.length > 1 ? `M${points.join("L")}` : "";
}

/** Pixels per world unit, so the CSS camera matches a 52° lens at distance 22. */
export const pixelsPerUnit = (stageHeight: number) =>
  stageHeight /
  (2 * CAMERA.distance * Math.tan((CAMERA.fov * Math.PI) / 360));
