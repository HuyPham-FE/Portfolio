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
const sceneStyles = document.createElement("style");
sceneStyles.textContent = await readFile(
  new URL("../src/components/featured-orbit.module.css", import.meta.url),
  "utf8",
);
document.head.append(sceneStyles);
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
const { createFeaturedController } =
  await import("../src/lib/motion/featured-controller.ts");

const slices = '<span data-slice class="slice"></span>'.repeat(10);
function fixture() {
  window.scrollTo(0, 0);
  document.body.innerHTML = `<section class="section"><div class="roll" data-orbit-roll><div class="stage" data-orbit-stage><h2>Featured</h2><div class="helix" data-orbit-helix><svg><path data-ribbon-edge/><path data-ribbon-edge/></svg><div class="helixOrigin">${Array.from({ length: 8 }, (_, i) => `<a class="helixCard" data-helix-card href="/projects/p${i % 4}/">${slices}</a>`).join("")}</div></div></div></div><div data-orbit-plane>${Array.from({ length: 4 }, (_, i) => `<article data-orbit-card><a href="/projects/p${i}/">Project</a></article>`).join("")}</div></section>`;
  const root = document.querySelector("section");
  Object.defineProperties(root.querySelector("[data-orbit-stage]"), {
    clientWidth: { value: 1920 },
    clientHeight: { value: 930 },
  });
  return root;
}

test("scroll progress slides curved cards down the helix and fully cleans up", () => {
  const root = fixture();
  const cards = [...root.querySelectorAll("[data-helix-card]")];
  const edges = [...root.querySelectorAll("[data-ribbon-edge]")];
  for (let mount = 0; mount < 2; mount++) {
    const dispose = createFeaturedController(root, 4);
    const trigger = ScrollTrigger.getById("featured-orbit");
    assert.ok(trigger);
    assert.equal(root.querySelectorAll(".pin-spacer").length, 0, "no pin");
    assert.equal(root.dataset.enhanced, "true");
    const animation = trigger.animation;
    animation.progress(0);
    assert.ok(cards.every((card) => card.style.visibility === "hidden"));
    assert.ok(edges.every((edge) => !edge.getAttribute("d")));
    animation.progress(0.4);
    const shown = cards.filter((card) => card.style.visibility !== "hidden");
    assert.ok(shown.length > 2, "a train of cards is on the helix");
    const slice = shown[0].querySelector("[data-slice]");
    assert.match(slice.style.transform, /^matrix3d\(/);
    assert.doesNotMatch(slice.style.transform, /NaN|undefined/);
    assert.match(slice.style.getPropertyValue("--part"), /^\d$/);
    assert.ok(edges.every((edge) => edge.getAttribute("d").startsWith("M")));
    const before = slice.style.transform;
    animation.progress(0.45);
    assert.notEqual(slice.style.transform, before, "cards move with scroll");
    animation.progress(0.4);
    assert.equal(slice.style.transform, before, "reverse is deterministic");
    animation.progress(1);
    assert.ok(cards.every((card) => card.style.visibility === "hidden"));
    dispose();
    assert.equal(ScrollTrigger.getById("featured-orbit"), undefined);
    assert.equal(root.dataset.enhanced, undefined);
    assert.ok(
      [...root.querySelectorAll("[data-helix-card], [data-slice]")].every(
        (node) => !node.style.transform && !node.style.visibility,
      ),
    );
    assert.ok(edges.every((edge) => !edge.hasAttribute("d")));
  }
});

test("the enhanced stage is CSS-sticky inside its own wrapper and the row auto-scrolls", () => {
  const root = fixture();
  const stage = root.querySelector("[data-orbit-stage]");
  const dispose = createFeaturedController(root, 4);
  try {
    assert.equal(getComputedStyle(stage).position, "sticky");
    assert.equal(stage.parentElement, root.querySelector("[data-orbit-roll]"));
  } finally {
    dispose();
  }
  assert.notEqual(getComputedStyle(stage).position, "sticky");
  assert.match(
    sceneStyles.textContent,
    /\.section\[data-enhanced="true"\] \.track \{[^}]*animation: orbit-row/,
  );
});

test("arrow keys move focus between the original projects in the row", () => {
  const root = fixture();
  const dispose = createFeaturedController(root, 4);
  try {
    const links = [...root.querySelectorAll("[data-orbit-card] a")];
    links[0].focus();
    links[0].dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );
    assert.equal(document.activeElement, links[3]);
    links[3].dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Home", bubbles: true }),
    );
    assert.equal(document.activeElement, links[0]);
  } finally {
    dispose();
  }
});

after(() => {
  ScrollTrigger.killAll();
  ScrollTrigger.disable();
  gsap.ticker.sleep();
  dom.window.close();
});
