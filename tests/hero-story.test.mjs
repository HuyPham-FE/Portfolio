import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><body></body>", {
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Node = dom.window.Node;
const styles = document.createElement("style");
styles.textContent = await readFile(
  new URL("../src/components/hero-story.module.css", import.meta.url),
  "utf8",
);
document.head.append(styles);
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(
  dom.window,
);
window.scrollTo = (_x, y) => {
  window.pageYOffset = y;
  document.documentElement.scrollTop = y;
};
window.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
});
const { gsap } = await import("gsap");
const { ScrollTrigger } = await import("gsap/ScrollTrigger");
const { cameraStops, createHeroEntrance, createHeroScroll, HERO_SCROLL } =
  await import("../src/lib/motion/hero-story.ts");

const W = 1440,
  H = 900;
function fixture() {
  window.scrollTo(0, 0);
  document.body.innerHTML = `<section class="section"><div class="stage" data-hero-stage>
    <div data-hero-atmosphere><span data-hero-enter="backdrop"></span></div>
    <span data-type-row><span data-hero-enter="type">A</span></span><span data-type-row><span data-hero-enter="type">B</span></span><span data-type-row><span>C</span></span>
    <div data-hero-world>
      <div data-hero-frame="intro">
        <div data-hero-copy><h1>${[1, 2, 3].map((i) => `<span><span data-hero-enter="line">L${i}</span></span>`).join("")}</h1><p data-hero-enter="support"></p><div data-hero-enter="support"></div></div>
        <div data-hero-mockup data-depth="1"><div data-hero-enter="mockup"><span data-layout-grid></span></div></div>
        ${[1.3, 0.8].map((d) => `<div data-hero-panel data-depth="${d}"><div data-hero-enter="panel"></div></div>`).join("")}
      </div>
      <article><h2><span data-design-line>Design</span></h2><p data-design-support></p><p data-design-support></p></article>
      <article data-hero-frame="development"><div data-depth="1"></div></article>
      <article data-hero-frame="marketing"><div data-hero-exit-text></div><div data-depth="1" data-hero-exit></div><div data-depth="1.4" data-hero-exit></div></article>
    </div>
    <span data-hero-carry></span>
  </div></section>`;
  const root = document.querySelector("section");
  const stage = root.querySelector("[data-hero-stage]");
  Object.defineProperties(stage, {
    clientWidth: { value: W },
    clientHeight: { value: H },
  });
  root.querySelectorAll("[data-hero-frame]").forEach((frame, i) =>
    Object.defineProperties(frame, {
      offsetLeft: { value: i * W },
      offsetWidth: { value: W },
    }),
  );
  return root;
}

test("camera stops are chapter edges clamped to the measured travel", () => {
  assert.deepEqual(cameraStops([0, 1440, 2880], 4320, 1440), [0, 1440, 2880]);
  assert.deepEqual(cameraStops([0, 1400, 2900], 4200, 1440), [0, 1400, 2760]);
  assert.deepEqual(cameraStops([0, 500], 800, 1440), [0, 0], "no travel");
});

test("entrance hides every staggered target before it plays, then reverts clean", () => {
  const root = fixture();
  const entrance = createHeroEntrance(root);
  const lines = [...root.querySelectorAll('[data-hero-enter="line"]')];
  const panels = [...root.querySelectorAll('[data-hero-enter="panel"]')];
  assert.ok(lines.every((line) => gsap.getProperty(line, "yPercent") === 115));
  assert.ok(panels.every((panel) => gsap.getProperty(panel, "opacity") === 0));
  assert.ok(entrance.duration() >= 1.2 && entrance.duration() <= 1.8);
  entrance.progress(1);
  assert.ok(lines.every((line) => gsap.getProperty(line, "yPercent") === 0));
  entrance.revert();
  assert.ok(
    [...root.querySelectorAll("[data-hero-enter]")].every(
      (node) => !node.getAttribute("style"),
    ),
  );
});

test("one scrubbed trigger drives parallax, measured horizontal travel and exit; it reverses", () => {
  const root = fixture();
  const world = root.querySelector("[data-hero-world]");
  const copy = root.querySelector("[data-hero-copy]");
  for (let mount = 0; mount < 2; mount++) {
    const dispose = createHeroScroll(root, HERO_SCROLL.desktop);
    const trigger = ScrollTrigger.getById("hero-story");
    assert.ok(trigger);
    assert.equal(ScrollTrigger.getAll().length, 1, "no duplicate triggers");
    assert.equal(root.querySelectorAll(".pin-spacer").length, 0, "no pin");
    assert.equal(root.dataset.enhanced, "true");
    const { parallax, story, hold } = HERO_SCROLL.desktop;
    const total = parallax + story + hold + 1;
    assert.equal(
      root.style.getPropertyValue("--hero-scroll"),
      String(total - 1),
    );
    const master = trigger.animation;
    assert.ok(Math.abs(master.duration() - total) < 1e-6);
    const at = (time) => master.progress(time / total);
    at(0);
    assert.equal(gsap.getProperty(world, "x"), 0);
    const hidden = root.querySelectorAll("[data-design-support]");
    assert.ok([...hidden].every((n) => gsap.getProperty(n, "opacity") === 0));
    at(parallax);
    assert.equal(gsap.getProperty(copy, "opacity"), 0, "headline has left");
    at(parallax + story / 2);
    assert.equal(gsap.getProperty(world, "x"), -W, "development chapter");
    at(parallax + story);
    assert.equal(gsap.getProperty(world, "x"), -2 * W, "marketing chapter");
    at(total);
    assert.ok(
      [...root.querySelectorAll("[data-hero-exit]")].every(
        (n) => gsap.getProperty(n, "opacity") === 0,
      ),
    );
    at(parallax + story / 2);
    assert.equal(gsap.getProperty(world, "x"), -W, "reverse is deterministic");
    at(0);
    assert.equal(gsap.getProperty(copy, "opacity"), 1);
    dispose();
    assert.equal(ScrollTrigger.getById("hero-story"), undefined);
    assert.equal(root.dataset.enhanced, undefined);
    assert.equal(root.style.getPropertyValue("--hero-scroll"), "");
    assert.ok(!world.getAttribute("style"), "transforms cleaned up");
  }
});

test("enhanced stage is CSS-sticky, never a GSAP pin", () => {
  const root = fixture();
  const stage = root.querySelector("[data-hero-stage]");
  const dispose = createHeroScroll(root, HERO_SCROLL.tablet);
  try {
    assert.equal(getComputedStyle(stage).position, "sticky");
  } finally {
    dispose();
  }
  assert.notEqual(getComputedStyle(stage).position, "sticky");
});

after(() => {
  ScrollTrigger.killAll();
  ScrollTrigger.disable();
  gsap.ticker.sleep();
  dom.window.close();
});
