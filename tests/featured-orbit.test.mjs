import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ARC_PER_RADIAN,
  CARD,
  cardCenter,
  cardSlices,
  HELIX_LENGTH,
  helixFrame,
  pixelsPerUnit,
  ribbonEdge,
  SLICES,
} from "../src/lib/motion/featured-orbit.ts";

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
const xAxis = (matrix) =>
  /matrix3d\(([^)]*)\)/.exec(matrix)[1].split(",").map(Number);

test("the helix is a two-turn spiral from the top right down to the bottom right", () => {
  const top = helixFrame(HELIX_LENGTH).point;
  const bottom = helixFrame(0).point;
  // The mid-spiral sag leaves ~1e-4 at the very ends.
  assert.ok(close(top[0], 12) && close(top[1], 12, 1e-3) && close(top[2], 0, 1e-9));
  assert.ok(close(bottom[0], 12) && close(bottom[1], -16, 1e-3));
  let previous = Infinity;
  for (let s = HELIX_LENGTH; s >= 0; s -= 0.25) {
    const { point, tangent, up } = helixFrame(s);
    assert.ok(point[1] < previous, "always descends, even through the sag");
    previous = point[1];
    assert.ok(close(Math.hypot(...tangent), 1) && close(Math.hypot(...up), 1));
    assert.ok(up[1] > 0.3, "card height axis leans upright");
  }
  // The front of each turn swings out towards the camera.
  assert.ok(close(helixFrame(2.5 * Math.PI * ARC_PER_RADIAN).point[2], 12));
});

test("cards enter at the top one after another, keep their spacing and all leave by the end", () => {
  const count = 8;
  for (const p of [0, 1])
    for (let i = 0; i < count; i++)
      assert.equal(cardCenter(i, count, p), null);
  const first = [];
  for (let p = 0; p < 1; p += 0.002) {
    const centers = Array.from({ length: count }, (_, i) =>
      cardCenter(i, count, p),
    );
    const shown = centers.flatMap((c, i) => (c === null ? [] : [i]));
    if (shown.length && !first.length) first.push(...shown);
    for (let k = 1; k < shown.length; k++)
      if (shown[k] === shown[k - 1] + 1)
        assert.ok(
          close(centers[shown[k]] - centers[shown[k - 1]], CARD.spacing),
        );
  }
  assert.deepEqual(first, [0], "card 0 leads");
  assert.ok(cardCenter(0, count, 0.05) > HELIX_LENGTH * 0.8, "enters at the top");
  assert.ok(
    cardCenter(0, count, 0.2) < cardCenter(0, count, 0.1),
    "slides down as the page scrolls",
  );
});

test("every slice reads left-to-right from the camera on both sides of the spiral", () => {
  const px = pixelsPerUnit(930);
  for (const [turns, outside] of [
    [0.25, true],
    [0.75, false],
    [1.25, true],
    [1.75, false],
  ]) {
    const result = cardSlices(turns * 2 * Math.PI * ARC_PER_RADIAN, px);
    assert.equal(result.outside, outside);
    assert.equal(result.matrices.length, SLICES);
    for (const matrix of result.matrices) {
      const m = xAxis(matrix);
      assert.equal(m.length, 16);
      assert.ok(m.every(Number.isFinite));
      assert.ok(m[0] > 0, "image x axis points screen-right");
    }
  }
});

test("the CSS camera matches a 52° lens and guide lines stay on the helix", () => {
  const px = pixelsPerUnit(930);
  assert.ok(close(22 * Math.tan((26 * Math.PI) / 180) * px, 465));
  const d = ribbonEdge(40, 70, 1, px);
  assert.match(d, /^M[-\d.]+,[-\d.]+(L[-\d.]+,[-\d.]+)+$/);
  assert.equal(ribbonEdge(-20, -2, 1, px), "", "nothing off the helix");
  assert.notEqual(ribbonEdge(40, 70, 1, px), ribbonEdge(40, 70, -1, px));
});
