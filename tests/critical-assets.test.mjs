import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { watchCriticalAssets } from "../src/lib/motion/critical-assets.ts";
const tick = () => new Promise((resolve) => setImmediate(resolve));
function fixture() {
  const dom = new JSDOM(
    '<div id="site"><img data-critical src="hero.jpg"><img src="below-fold.jpg"></div>',
  );
  const root = dom.window.document.querySelector("#site");
  const img = root.querySelector("[data-critical]");
  Object.defineProperty(img, "complete", { value: false, configurable: true });
  Object.defineProperty(img, "naturalWidth", {
    value: 1800,
    configurable: true,
  });
  return { dom, root, img };
}
test("100% is gated by decoded hero pixels AND fonts; noncritical images do not block", async () => {
  const { dom, root, img } = fixture();
  let decoded, fontLoaded;
  img.decode = () => new Promise((resolve) => (decoded = resolve));
  const fontsReady = new Promise((resolve) => (fontLoaded = resolve));
  let outcome;
  const values = [];
  const cancel = watchCriticalAssets(root, {
    fontsReady,
    onProgress: (v) => values.push(v),
    onSettled: (r) => (outcome = r),
  });
  img.dispatchEvent(new dom.window.Event("load"));
  await tick();
  assert.equal(outcome, undefined);
  assert.ok(!values.includes(1));
  decoded();
  await tick();
  assert.deepEqual(values, [0.5]);
  assert.equal(outcome, undefined);
  fontLoaded();
  await tick();
  assert.equal(outcome.success, true);
  assert.equal(values.at(-1), 1);
  assert.equal(outcome.total, 2);
  cancel();
  dom.window.close();
});
test("asset error never reports complete progress", async () => {
  const { dom, root, img } = fixture();
  Object.defineProperty(img, "naturalWidth", { value: 0 });
  let outcome;
  const values = [];
  const cancel = watchCriticalAssets(root, {
    fontsReady: Promise.resolve(),
    onProgress: (v) => values.push(v),
    onSettled: (r) => (outcome = r),
  });
  img.dispatchEvent(new dom.window.Event("error"));
  await tick();
  assert.equal(outcome.success, false);
  assert.equal(outcome.timedOut, false);
  assert.ok(values.every((v) => v < 1));
  cancel();
  dom.window.close();
});
test("a hung decode releases at deadline, with actual progress preserved", async () => {
  const { dom, root, img } = fixture();
  img.decode = () => new Promise(() => {});
  const values = [];
  const outcome = new Promise((resolve) =>
    watchCriticalAssets(root, {
      fontsReady: Promise.resolve(),
      timeoutMs: 15,
      onProgress: (v) => values.push(v),
      onSettled: resolve,
    }),
  );
  img.dispatchEvent(new dom.window.Event("load"));
  const result = await outcome;
  assert.equal(result.success, false);
  assert.equal(result.timedOut, true);
  assert.equal(result.ready, 1);
  assert.ok(values.every((v) => v < 1));
  dom.window.close();
});
test("cancelled/Strict Mode pass cannot complete or mutate the replacement pass", async () => {
  const { dom, root, img } = fixture();
  let decoded;
  img.decode = () => new Promise((resolve) => (decoded = resolve));
  let events = 0;
  const cancel = watchCriticalAssets(root, {
    fontsReady: Promise.resolve(),
    onProgress: () => events++,
    onSettled: () => events++,
  });
  img.dispatchEvent(new dom.window.Event("load"));
  cancel();
  cancel();
  decoded();
  await tick();
  assert.equal(events, 0);
  dom.window.close();
});
