import { test } from "node:test";
import assert from "node:assert/strict";
import {
  orbitGeometry,
  orbitPose,
  loopPosition,
  canAutoplay,
  ORBIT_PHASES,
} from "../src/lib/motion/featured-orbit.ts";

test("all projects finish their full horizontal transformation before the pin releases", () => {
  for (const count of [2, 3, 4, 7, 12, 30]) {
    for (const [width, height] of [
      [768, 800],
      [1440, 900],
      [1920, 1080],
    ]) {
      const geometry = orbitGeometry(width, height, count);
      for (let i = 0; i < count; i++) {
        const settled = orbitPose(i, ORBIT_PHASES.galleryReveal, geometry);
        assert.ok(Math.abs(settled.y - height * 0.08) < 0.00001);
        assert.equal(settled.z, 0);
        assert.equal(settled.rotationY, 0);
        assert.equal(settled.rotationZ, 0);
        assert.equal(settled.scale, 1);
        assert.equal(settled.opacity, 1);
        assert.deepEqual(settled, orbitPose(i, 1, geometry));
        if (i > 0)
          assert.ok(
            Math.abs(
              settled.x - orbitPose(i - 1, 1, geometry).x - geometry.stride,
            ) < 0.001,
          );
      }
    }
  }
  assert.ok(1 - ORBIT_PHASES.galleryReveal >= 0.14);
});

test("orbit travel has depth and is deterministic in both scrolling directions", () => {
  const g = orbitGeometry(1440, 900, 4);
  const positions = [0.15, 0.3, 0.4, 0.52, 0.65, 0.77, 0.86].map((p) =>
    orbitPose(0, p, g),
  );
  assert.ok(Math.abs(positions[1].x - positions[3].x) > 200);
  assert.ok(Math.abs(positions[1].z - positions[3].z) > 50);
  assert.ok(positions[0].y < positions.at(-1).y);
  const backward = [0.86, 0.77, 0.65, 0.52, 0.4, 0.3, 0.15].map((p) =>
    orbitPose(0, p, g),
  );
  assert.deepEqual(backward.reverse(), positions);
});

test("phase boundaries have no positional, scale or rotation discontinuities", () => {
  const g = orbitGeometry(1440, 900, 4);
  for (const boundary of [0.12, 0.25, 0.28, 0.52, 0.57, 0.7, 0.73, 0.86]) {
    for (let i = 0; i < 8; i++) {
      const before = orbitPose(i, boundary - 0.000001, g);
      const after = orbitPose(i, boundary + 0.000001, g);
      for (const key of [
        "x",
        "y",
        "z",
        "rotationY",
        "rotationZ",
        "scale",
        "opacity",
      ])
        assert.ok(
          Math.abs(before[key] - after[key]) < 0.35,
          `${boundary}, card ${i}, ${key}`,
        );
    }
  }
});

test("loop resets are outside both viewport edges, even on a short ultrawide display", () => {
  for (const [width, height] of [
    [768, 800],
    [1440, 900],
    [2560, 720],
    [3840, 900],
  ]) {
    for (const count of [2, 3, 4, 7, 12]) {
      const g = orbitGeometry(width, height, count);
      const slots = count * Math.ceil(8 / count);
      const low = -width / 2 - g.cardWidth * 0.65;
      const period = slots * g.stride;
      assert.ok(
        low + g.cardWidth * 0.52 < -width / 2,
        "left recycle is invisible",
      );
      assert.ok(
        low + period - g.cardWidth * 0.52 > width / 2,
        "right recycle is invisible",
      );
      const base = -width * 0.2;
      assert.ok(
        Math.abs(
          loopPosition(base, -123, g, slots) -
            loopPosition(base, -123 - period, g, slots),
        ) < 0.00001,
      );
      // Adjacent positions keep their spacing at arbitrary loop offsets.
      for (const offset of [0, -300, -4300, 1200]) {
        const positions = Array.from({ length: slots }, (_, i) =>
          loopPosition(base + i * g.stride, offset, g, slots),
        ).sort((a, b) => a - b);
        positions
          .slice(1)
          .forEach((x, i) =>
            assert.ok(Math.abs(x - positions[i] - g.stride) < 0.001),
          );
      }
    }
  }
});

test("autoplay is exclusive to the settled, visible, unoccupied gallery", () => {
  assert.equal(canAutoplay(0.85, true, false, false, false, false), false);
  assert.equal(canAutoplay(0.86, true, false, false, false, false), true);
  for (let reason = 0; reason < 5; reason++) {
    const args = [true, false, false, false, false];
    args[reason] = !args[reason];
    assert.equal(canAutoplay(1, ...args), false);
  }
});
