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
let observed = 0;
globalThis.ResizeObserver = class {
  observe() {
    observed++;
  }
  disconnect() {
    observed--;
  }
};
globalThis.IntersectionObserver = class {
  observe() {
    observed++;
  }
  disconnect() {
    observed--;
  }
};
const { gsap } = await import("gsap");
const { ScrollTrigger } = await import("gsap/ScrollTrigger");
const { createFeaturedController } =
  await import("../src/lib/motion/featured-controller.ts");

function fixture() {
  window.scrollTo(0, 0);
  document.body.innerHTML = `<div class="page-enter" style="animation:page-in .6s ease-out both"><section><div class="stage" data-orbit-stage><h2 data-orbit-title>Featured</h2><div data-orbit-outline>Projects</div><div data-orbit-plane>${Array.from({ length: 8 }, () => '<article class="card" data-orbit-card><div data-orbit-loop><a href="/projects/test/">Project</a></div></article>').join("")}</div><span data-orbit-hint></span><span data-orbit-meter></span></div></section></div>`;
  const root = document.querySelector("section");
  const stage = root.querySelector("[data-orbit-stage]");
  Object.defineProperties(stage, {
    clientWidth: { value: 1440 },
    clientHeight: { value: 900 },
  });
  return root;
}

test("real GSAP controller drives one pin, reverses actual DOM transforms and fully cleans up", () => {
  const root = fixture();
  for (let mount = 0; mount < 2; mount++) {
    const dispose = createFeaturedController(root, 4);
    const trigger = ScrollTrigger.getById("featured-orbit");
    assert.ok(trigger);
    assert.equal(
      ScrollTrigger.getAll().filter((item) => item.vars.id === "featured-orbit")
        .length,
      1,
    );
    assert.equal(root.querySelectorAll(".pin-spacer").length, 1);
    const card = root.querySelector("[data-orbit-card]");
    const animation = trigger.animation;
    assert.ok(animation.labels.orbitDescent < animation.labels.galleryReveal);
    animation.progress(0.4);
    const orbit = card.style.transform;
    assert.match(orbit, /translate3d\(/);
    assert.doesNotMatch(orbit, /NaN|undefined/);
    animation.progress(0.9);
    assert.equal(root.dataset.gallery, "true");
    assert.match(
      card.style.transform,
      /rotateY\(0deg\) rotateZ\(0deg\) scale\(1\)/,
    );
    assert.notEqual(card.style.transform, orbit);
    animation.progress(0.4);
    assert.equal(card.style.transform, orbit);
    assert.equal(root.dataset.gallery, "false");
    dispose();
    assert.equal(ScrollTrigger.getById("featured-orbit"), undefined);
    assert.equal(root.querySelectorAll(".pin-spacer").length, 0);
    assert.equal(root.dataset.enhanced, undefined);
    assert.equal(observed, 0);
    assert.equal(card.getAttribute("style"), null);
    assert.equal(
      root.querySelector("[data-orbit-title]").getAttribute("style"),
      null,
    );
  }
});

test("scrolling pins the scene outside the animated route ancestor, preserves its styles/state, and restores its DOM on exit", () => {
  const root = fixture();
  const stage = root.querySelector("[data-orbit-stage]");
  const card = stage.querySelector("[data-orbit-card]");
  const dispose = createFeaturedController(root, 4);
  const trigger = ScrollTrigger.getById("featured-orbit");
  ScrollTrigger.refresh();
  trigger.scroll(trigger.start + (trigger.end - trigger.start) * 0.45);
  ScrollTrigger.update(true);
  trigger.getTween()?.progress(1);
  assert.equal(trigger.isActive, true);
  assert.equal(
    stage.parentElement,
    document.body,
    "fixed scene escapes page-enter containing block",
  );
  assert.equal(stage.closest(".page-enter"), null);
  assert.equal(stage.dataset.enhanced, "true");
  assert.ok(
    card.matches('.stage[data-enhanced="true"] .card'),
    "CSS must not depend on the old section ancestor",
  );
  assert.equal(stage.style.position, "fixed");
  assert.equal(
    getComputedStyle(card).position,
    "absolute",
    "real stylesheet survives reparenting",
  );
  assert.ok(Number(card.style.opacity) > 0.9);
  assert.match(card.style.transform, /translate3d/);
  trigger.scroll(trigger.start + (trigger.end - trigger.start) * 0.92);
  ScrollTrigger.update(true);
  trigger.getTween()?.progress(1);
  assert.equal(stage.dataset.gallery, "true");
  trigger.scroll(trigger.end + 20);
  ScrollTrigger.update(true);
  assert.ok(root.contains(stage), "scene returns to its spacer after release");
  trigger.scroll(trigger.start + (trigger.end - trigger.start) * 0.5);
  ScrollTrigger.update(true);
  assert.equal(stage.parentElement, document.body);
  dispose();
  assert.equal(stage.parentElement, root);
  assert.equal(stage.dataset.enhanced, undefined);
  assert.equal(document.body.querySelectorAll(".pin-spacer").length, 0);
  assert.equal(observed, 0);
});

test("a late-mounted Featured pin is measured before Marketing and Process downstream", () => {
  const root = fixture();
  const downstream = document.createElement("section");
  root.after(downstream);
  // jsdom has no layout engine: model normal flow by including the real spacer
  // padding that ScrollTrigger writes/reverts during refresh.
  downstream.getBoundingClientRect = () => {
    const spacing = parseFloat(
      root.querySelector(".pin-spacer")?.style.paddingBottom || "0",
    );
    const top = 1600 + spacing - window.pageYOffset;
    return {
      top,
      bottom: top + 900,
      left: 0,
      right: 1440,
      width: 1440,
      height: 900,
      x: 0,
      y: top,
      toJSON() {},
    };
  };
  const chart = { draw: 0 },
    process = { reveal: 0 };
  const context = gsap.context(() => {
    gsap.to(chart, {
      draw: 1,
      ease: "none",
      scrollTrigger: {
        id: "test-marketing",
        trigger: downstream,
        start: "top 65%",
        end: "center center",
        scrub: true,
      },
    });
    gsap.to(process, {
      reveal: 1,
      ease: "none",
      scrollTrigger: {
        id: "test-process",
        trigger: downstream,
        start: "top 85%",
        end: "top 35%",
        scrub: true,
      },
    });
  });
  const dispose = createFeaturedController(root, 4);
  try {
    ScrollTrigger.refresh();
    const pin = ScrollTrigger.getById("featured-orbit");
    const marketing = ScrollTrigger.getById("test-marketing");
    const steps = ScrollTrigger.getById("test-process");
    const expectedTop = 1600 + (pin.end - pin.start);
    assert.ok(
      Math.abs(marketing.start - (expectedTop - window.innerHeight * 0.65)) < 2,
      `Marketing start ${marketing.start} must include pin spacing ${pin.end - pin.start}`,
    );
    assert.ok(
      Math.abs(steps.start - (expectedTop - window.innerHeight * 0.85)) < 2,
      "Process start includes upstream spacing",
    );
    for (const progress of [0, 0.5, 1, 0.5, 0]) {
      marketing.scroll(
        marketing.start + (marketing.end - marketing.start) * progress,
      );
      ScrollTrigger.update(true);
      assert.ok(Math.abs(chart.draw - progress) < 0.01);
    }
    for (const progress of [0, 0.5, 1, 0.5, 0]) {
      steps.scroll(steps.start + (steps.end - steps.start) * progress);
      ScrollTrigger.update(true);
      assert.ok(Math.abs(process.reveal - progress) < 0.01);
    }
    marketing.scroll(pin.end * 0.5);
    ScrollTrigger.update(true);
    assert.equal(
      chart.draw,
      0,
      "Marketing has not played while Featured is pinned",
    );
    assert.equal(
      process.reveal,
      0,
      "Process has not played while Featured is pinned",
    );
  } finally {
    dispose();
    context.revert();
  }
});

after(() => {
  ScrollTrigger.killAll();
  ScrollTrigger.disable();
  gsap.ticker.sleep();
  dom.window.close();
});
