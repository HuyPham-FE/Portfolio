import { JSDOM } from "jsdom";
import { test, after } from "node:test";
import assert from "node:assert/strict";
const dom = new JSDOM("<!doctype html><body></body>", {
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const { gsap } = await import("gsap");
const { createServiceStackTimeline, stackTiming } =
  await import("../src/lib/motion/service-stack.ts");
const geometry = (viewport) => ({
  height: viewport - 156,
  gap: viewport * 0.28,
  tail: viewport * 0.3,
  top: 92,
  edge: 20,
  count: 3,
  viewport,
});
function fixture() {
  document.body.innerHTML = `<section>${Array.from({ length: 3 }, (_, i) => `<div data-service-layer><article data-service-card><h3>Service ${i}</h3><div data-service-mockup></div><div data-service-ribbon></div><span data-service-logo>Logo</span><svg><path data-service-line pathLength="100"/></svg><div data-service-shade style="opacity:0"></div></article></div>`).join("")}</section>`;
  return document.querySelector("section");
}
test("all layers settle with a readable final hold before leaving the viewport", () => {
  for (const viewport of [760, 800, 900, 1080, 1440]) {
    const g = geometry(viewport),
      timing = stackTiming(g);
    assert.ok(timing.settled[1] > viewport * 0.8);
    assert.ok(timing.settled[2] < timing.end);
    assert.ok(timing.end - timing.settled[2] > viewport * 0.29);
    assert.ok(g.top + 2 * g.edge + g.height <= viewport);
    assert.equal(timing.settled[2], 2 * (g.height + g.gap - g.edge));
  }
});
test("stack depth progresses one overlap at a time and unwinds on reverse scrolling", () => {
  const root = fixture(),
    g = geometry(900),
    timing = stackTiming(g);
  const cards = root.querySelectorAll("[data-service-card]");
  const timeline = createServiceStackTimeline(root, g);
  timeline.time(1);
  assert.equal(Number(gsap.getProperty(cards[0], "scaleX")), 1);
  assert.equal(Number(gsap.getProperty(cards[1], "scaleX")), 1);
  timeline.time(timing.settled[1]);
  assert.equal(Number(gsap.getProperty(cards[0], "scaleX")), 0.98);
  assert.equal(Number(gsap.getProperty(cards[1], "scaleX")), 1);
  timeline.time(timing.settled[2]);
  assert.equal(Number(gsap.getProperty(cards[0], "scaleX")), 0.96);
  assert.equal(Number(gsap.getProperty(cards[1], "scaleX")), 0.98);
  assert.equal(Number(gsap.getProperty(cards[2], "scaleX")), 1);
  for (const path of root.querySelectorAll("[data-service-line]"))
    assert.equal(Number(gsap.getProperty(path, "strokeDashoffset")), 0);
  timeline.time(0);
  assert.equal(Number(gsap.getProperty(cards[0], "scaleX")), 1);
  assert.equal(Number(gsap.getProperty(cards[1], "scaleX")), 1);
  timeline.kill();
});
test("animation cleanup restores readable cards and removes all layer translations", () => {
  const root = fixture();
  let timeline;
  const context = gsap.context(() => {
    timeline = createServiceStackTimeline(root, geometry(900));
  }, root);
  timeline.progress(0.7);
  context.revert();
  for (const layer of root.querySelectorAll("[data-service-layer]"))
    assert.equal(layer.style.transform, "");
  for (const card of root.querySelectorAll("[data-service-card]")) {
    assert.equal(card.style.transform, "");
    assert.equal(
      card.querySelector("[data-service-mockup]").style.transform,
      "",
    );
    assert.equal(card.querySelector("[data-service-shade]").style.opacity, "0");
  }
});

test("third card travels fully to the top edge, holds there and reverses like the second", () => {
  const root = fixture(),
    g = geometry(900),
    timing = stackTiming(g);
  const layers = root.querySelectorAll("[data-service-layer]");
  const timeline = createServiceStackTimeline(root, g);
  const y = (i) => Number(gsap.getProperty(layers[i], "y"));
  timeline.time(0);
  assert.ok(y(1) + g.top >= g.viewport);
  assert.ok(y(2) + g.top >= g.viewport);
  timeline.time(timing.settled[1]);
  assert.equal(y(1), g.edge);
  assert.ok(y(2) + g.top >= g.viewport, "third does not enter prematurely");
  timeline.time(timing.settled[2] - timing.travel / 2);
  assert.ok(y(2) > 2 * g.edge && y(2) < g.viewport - g.top);
  timeline.time(timing.settled[2]);
  assert.equal(y(2), 2 * g.edge);
  assert.ok(
    g.top + y(2) + g.height <= g.viewport,
    "entire last card fits before release",
  );
  timeline.time(timing.end);
  assert.equal(y(2), 2 * g.edge);
  const trackHeight = timing.stageHeight + timing.end;
  assert.equal(
    trackHeight - timing.end,
    timing.stageHeight,
    "track ends exactly at the visible stage bottom, without a blank tail",
  );
  timeline.time(timing.settled[1]);
  assert.ok(y(2) + g.top >= g.viewport);
  assert.equal(y(1), g.edge);
  timeline.kill();
});
after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
