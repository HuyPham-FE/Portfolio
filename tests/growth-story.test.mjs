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
const { createGrowthTimeline } =
  await import("../src/lib/motion/growth-story.ts");
function fixture() {
  document.body.innerHTML =
    "<section><div data-build><div data-build-browser></div><div data-build-code></div><div data-build-tech></div></div><div data-grow-item></div><div data-grow-item></div><svg><path data-growth-connection></path><circle data-growth-signal></circle><path data-story-chart></path></svg></section>";
  return document.querySelector("section");
}
test("scroll story builds the website before revealing marketing, and can rewind", () => {
  const section = fixture();
  const t = createGrowthTimeline(section).pause();
  t.seek(0.6, false);
  assert.equal(section.dataset.storyStage, "0");
  assert.ok(
    Number(
      gsap.getProperty(
        section.querySelector("[data-build-browser]"),
        "opacity",
      ),
    ) > 0.5,
  );
  assert.equal(
    Number(
      gsap.getProperty(section.querySelector("[data-grow-item]"), "opacity"),
    ),
    0,
  );
  t.seek(1.5, false);
  assert.equal(section.dataset.storyStage, "1");
  assert.ok(
    Number(
      gsap.getProperty(
        section.querySelector("[data-growth-connection]"),
        "strokeDashoffset",
      ),
    ) < 1,
  );
  t.progress(1);
  assert.equal(section.dataset.storyStage, "2");
  assert.equal(
    Number(
      gsap.getProperty(section.querySelector("[data-grow-item]"), "opacity"),
    ),
    1,
  );
  assert.equal(
    Number(
      gsap.getProperty(
        section.querySelector("[data-story-chart]"),
        "strokeDashoffset",
      ),
    ),
    0,
  );
  t.seek(0.4, false);
  assert.equal(section.dataset.storyStage, "0");
  assert.equal(
    Number(
      gsap.getProperty(section.querySelector("[data-grow-item]"), "opacity"),
    ),
    0,
  );
  t.kill();
});
test("owning context reverts all animated styles when leaving the route", () => {
  const section = fixture();
  const browser = section.querySelector("[data-build-browser]");
  browser.style.transform = "rotate(-5deg)";
  let timeline;
  const ctx = gsap.context(() => {
    timeline = createGrowthTimeline(section).pause();
  }, section);
  timeline.progress(0.7);
  ctx.revert();
  assert.equal(browser.style.transform, "rotate(-5deg)");
  assert.equal(browser.style.opacity, "");
  assert.equal(
    section.querySelector("[data-story-chart]").style.strokeDasharray,
    "",
  );
});
after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
