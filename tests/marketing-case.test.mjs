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
const { createCaseEntrance } = await import(
  "../src/lib/motion/marketing-case.ts"
);
const metric = (value, text) =>
  `<div data-case-metric><dt>Label</dt><dd><span data-case-value="${value}">${text}</span></dd></div>`;
function fixture() {
  document.body.innerHTML = `<section>
    <div data-case-intro><p data-case-label>CASE STUDY</p><span data-case-line>AloHouse</span>
    <span data-case-rule></span><h2><span data-case-line>One</span><span data-case-line>Two</span></h2>
    <p data-case-fade>Body</p><div data-case-fade>Logos</div></div>
    <dl data-case-grid>${metric(125382488, "125.382.488")}${metric(2.27, "2,27")}${metric(6196, "6.196")}</dl>
    <p data-case-note>Source</p>
  </section>`;
  return document.querySelector("section");
}
const texts = (root) =>
  [...root.querySelectorAll("[data-case-value]")].map((el) => el.textContent);

test("counters run from zero to the exact Vietnamese-formatted values within two seconds", () => {
  const root = fixture();
  const { timeline } = createCaseEntrance(root);
  assert.deepEqual(texts(root), ["0", "0,00", "0"], "start at zero, decimals kept");
  assert.ok(timeline.duration() <= 2.6);
  timeline.time(1);
  const mid = Number(texts(root)[0].replaceAll(".", ""));
  assert.ok(mid > 0 && mid < 125382488, "eases towards the target");
  assert.match(texts(root)[1], /^\d,\d\d$/, "decimal comma stays fixed width");
  timeline.progress(1);
  assert.deepEqual(texts(root), ["125.382.488", "2,27", "6.196"]);
  for (const el of root.querySelectorAll(
    "[data-case-label], [data-case-fade], [data-case-metric] > *, [data-case-note]",
  ))
    assert.equal(Number(gsap.getProperty(el, "opacity")), 1);
  assert.equal(
    root.querySelector("[data-case-metric]").style.getPropertyValue("--draw"),
    "1",
    "dividers fully drawn",
  );
  timeline.kill();
});

test("stacked parts split intro and metrics; revert restores exact static values", () => {
  const root = fixture();
  let intro, metrics;
  const context = gsap.context(() => {
    intro = createCaseEntrance(root, "intro");
    metrics = createCaseEntrance(root, "metrics");
  }, root);
  intro.timeline.progress(1);
  assert.deepEqual(texts(root), ["0", "0,00", "0"], "intro never runs the counters");
  metrics.timeline.progress(0.3);
  context.revert();
  metrics.restore();
  assert.deepEqual(texts(root), ["125.382.488", "2,27", "6.196"]);
  for (const el of root.querySelectorAll("[data-case-line], [data-case-metric] > *")) {
    assert.equal(el.style.transform, "");
    assert.equal(el.style.opacity, "");
  }
  assert.equal(
    root.querySelector("[data-case-metric]").style.getPropertyValue("--draw"),
    "",
  );
});

after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
