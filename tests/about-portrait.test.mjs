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
const { createAboutEntrance, portraitPointer } =
  await import("../src/lib/motion/about-portrait.ts");
function fixture() {
  document.body.innerHTML = `<section>
    <h2><span data-about-line>One</span><span data-about-line>Two</span><span data-about-line>Three</span></h2>
    <p data-about-body>Introduction</p><a data-about-link href="#process">Process</a>
    <div data-about-atmosphere></div><div data-about-tilt><div data-about-frame><div data-about-photo><img style="transform:scale(1.48)"></div></div></div>
    <div data-about-card-parallax><div data-about-card>Role</div></div><span data-about-note>Note</span><p data-about-signature>Name</p>
  </section>`;
  return document.querySelector("section");
}
test("portrait reveal overlaps the heading and restores all readable content", () => {
  const root = fixture();
  const timeline = createAboutEntrance(root);
  assert.ok(timeline.duration() < 2.1);
  timeline.time(0.7);
  const heading = Number(
    gsap.getProperty(root.querySelector("[data-about-line]"), "yPercent"),
  );
  const photo = Number(
    gsap.getProperty(root.querySelector("[data-about-photo]"), "scaleX"),
  );
  assert.ok(heading > 0 && heading < 110);
  assert.ok(photo > 1 && photo < 1.08);
  timeline.progress(1);
  assert.equal(
    Number(
      gsap.getProperty(root.querySelector("[data-about-line]"), "yPercent"),
    ),
    0,
  );
  assert.equal(
    Number(
      gsap.getProperty(root.querySelector("[data-about-photo]"), "scaleX"),
    ),
    1,
  );
  for (const name of [
    "body",
    "link",
    "card",
    "note",
    "signature",
    "atmosphere",
  ])
    assert.equal(
      Number(
        gsap.getProperty(root.querySelector(`[data-about-${name}]`), "opacity"),
      ),
      1,
    );
  assert.equal(root.querySelector("img").style.transform, "scale(1.48)");
  timeline.kill();
});
test("mobile text timeline does not consume the portrait reveal; reverting restores static visibility", () => {
  const root = fixture();
  let text, portrait;
  const context = gsap.context(() => {
    text = createAboutEntrance(root, "text");
  }, root);
  text.progress(1);
  assert.equal(
    root.querySelector("[data-about-frame]").getAttribute("style"),
    null,
  );
  context.add(() => {
    portrait = createAboutEntrance(root, "portrait");
  });
  portrait.progress(0.4);
  context.revert();
  for (const node of root.querySelectorAll(
    "[data-about-line], [data-about-photo], [data-about-card], [data-about-note]",
  )) {
    assert.equal(node.style.transform, "");
    assert.equal(node.style.opacity, "");
  }
  assert.equal(root.querySelector("[data-about-frame]").style.clipPath, "");
  assert.equal(root.querySelector("img").style.transform, "scale(1.48)");
});
test("portrait pointer tilt remains restrained even outside the element bounds", () => {
  for (const [x, y] of [
    [0, 0],
    [-1, 1],
    [1, -1],
    [9, -8],
  ]) {
    const pointer = portraitPointer(x, y);
    assert.ok(Math.abs(pointer.rotationY) <= 2.3);
    assert.ok(Math.abs(pointer.rotationX) <= 2);
    assert.ok(Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1);
  }
});
after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
