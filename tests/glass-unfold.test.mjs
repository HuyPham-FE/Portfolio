import { JSDOM } from "jsdom";
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
  url: "https://portfolio.test/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
window.scrollTo = () => {};
const { gsap } = await import("gsap");
const { createGlassUnfold, lockIntroInteraction } =
  await import("../src/lib/motion/glass-unfold.ts");
const {
  GLASS_TIMING: T,
  IRIS_CLOSED,
  IRIS_OPEN,
  RIBBON_WAVE,
  RIBBON_ORBIT,
  RIBBON_READY,
  RIBBON_EXIT,
} = await import("../src/lib/motion/glass-geometry.ts");
const messages = {
  stages: ["Wake", "Assemble", "Flow", "Focus", "Threshold", "Hero"],
  ready: "Ready",
  fallback: "Available content",
  waiting: "Finishing the last details",
};
function fixture() {
  const elements = [
    "orb-system",
    "orb",
    "caustic",
    "orbit",
    "fragment",
    "identity",
    "work",
    "growth",
    "tech",
    "title-first",
    "title-final",
    "skill-chips",
    "composition",
    "ribbon-back",
    "ribbon-front",
    "intro-copy",
    "intro-atmosphere",
    "glass-left",
    "glass-right",
  ];
  document.body.innerHTML = `<div id="site"><header class="header"></header><section class="hero"><div class="hero-background"></div><div class="hero-copy"><p class="eyebrow">Role</p><h1><span data-hero-line>Design.</span><span data-hero-line>Develop.</span><span data-hero-line>Market.</span></h1><p class="hero-description">Description</p><div class="hero-actions"><a>Projects</a><a>Process</a></div></div><div data-hero-visual></div><div class="hero-bottom"></div></section></div><div id="intro"><div class="intro-veil"></div><span data-phase-index></span><p data-progress-status></p>${elements.map((e) => `<div data-${e}></div>`).join("")}<svg><path data-iris d="${IRIS_CLOSED}"></path><path data-ribbon-shape d="${RIBBON_WAVE}"></path><path data-growth-line></path></svg></div>`;
  return {
    page: document.querySelector("#site"),
    overlay: document.querySelector("#intro"),
    messages,
    reduced: false,
    mobile: false,
    onReveal: () => {},
    onComplete: () => {},
  };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const opacity = (f, selector) =>
  Number(gsap.getProperty(f.overlay.querySelector(selector), "opacity"));
test("six labels span 6.2 seconds even with cached assets; elements persist between phases", () => {
  const f = fixture(),
    c = createGlassUnfold(f),
    panel = f.overlay.querySelector("[data-work]");
  c.settleAssets(true);
  assert.equal(c.timeline.duration(), 6.2);
  for (const [name, index, time] of [
    ["wake", 0, 0.4],
    ["assemble", 1, 1.6],
    ["flow", 2, 2.7],
    ["focus", 3, 3.75],
    ["revealThreshold", 4, 4.2],
    ["heroReveal", 5, 5.1],
  ]) {
    assert.equal(c.timeline.labels[name], T[name]);
    c.timeline.seek(time, false);
    assert.equal(f.overlay.dataset.phase, name);
    assert.equal(
      f.overlay.querySelector("[data-phase-index]").textContent,
      `0${index + 1} / 06`,
    );
    assert.equal(f.overlay.querySelector("[data-work]"), panel);
  }
  c.dispose();
});
test("composition assembles continuously and converges before opening", () => {
  const f = fixture(),
    c = createGlassUnfold(f);
  c.settleAssets(true);
  c.timeline.seek(0.6, false);
  assert.ok(opacity(f, "[data-orb-system]") > 0.3);
  assert.equal(opacity(f, "[data-identity]"), 0);
  c.timeline.seek(1.7, false);
  assert.ok(opacity(f, "[data-identity]") > 0.8);
  assert.ok(opacity(f, "[data-work]") > 0.5);
  c.timeline.seek(2.8, false);
  assert.ok(opacity(f, "[data-growth]") > 0.9);
  c.timeline.seek(3.79, false);
  assert.equal(
    Number(gsap.getProperty(f.overlay.querySelector("[data-identity]"), "x")),
    0,
  );
  assert.equal(opacity(f, "[data-title-final]"), 1);
  assert.equal(opacity(f, "[data-title-first]"), 0);
  assert.equal(
    f.overlay.querySelector("[data-iris]").getAttribute("d"),
    IRIS_CLOSED,
  );
  c.dispose();
});
test("pending decoded assets hold the live timeline at Focus and leave hero untouched", async () => {
  const f = fixture();
  let complete = 0,
    reveal = 0;
  f.onComplete = () => complete++;
  f.onReveal = () => reveal++;
  const c = createGlassUnfold(f);
  c.timeline.timeScale(100).play();
  await sleep(120);
  assert.equal(c.timeline.paused(), true);
  assert.equal(c.timeline.time(), T.gate);
  assert.equal(f.overlay.dataset.phase, "waiting");
  assert.equal(
    f.overlay.querySelector("[data-progress-status]").textContent,
    messages.waiting,
  );
  assert.equal(reveal, 0);
  assert.equal(complete, 0);
  assert.equal(
    f.overlay.querySelector("[data-iris]").getAttribute("d"),
    IRIS_CLOSED,
  );
  c.settleAssets(true);
  await sleep(80);
  assert.equal(reveal, 1);
  assert.equal(complete, 1);
  assert.equal(f.overlay.dataset.outcome, "loaded");
  c.dispose();
});
test("failure fallback releases the hold without an indefinite loading screen", async () => {
  const f = fixture();
  let complete = 0;
  f.onComplete = () => complete++;
  const c = createGlassUnfold(f);
  c.timeline.timeScale(100).play();
  await sleep(120);
  c.settleAssets(false);
  await sleep(80);
  assert.equal(complete, 1);
  assert.equal(f.overlay.dataset.outcome, "fallback");
  c.dispose();
});
test("curved aperture and actual mounted hero overlap; final styles revert without second entrance", () => {
  const f = fixture(),
    hero = f.page.querySelector(".hero");
  let reveal = 0,
    complete = 0;
  f.onReveal = () => reveal++;
  f.onComplete = () => complete++;
  const c = createGlassUnfold(f);
  c.settleAssets(true);
  c.timeline.seek(4.9, false);
  assert.equal(reveal, 1);
  assert.equal(complete, 0);
  assert.equal(f.page.querySelector(".hero"), hero);
  assert.notEqual(
    f.overlay.querySelector("[data-iris]").getAttribute("d"),
    IRIS_CLOSED,
  );
  assert.notEqual(f.overlay.style.visibility, "hidden");
  const line = f.page.querySelector("[data-hero-line]");
  assert.ok(Number(gsap.getProperty(line, "yPercent")) > 0);
  assert.ok(Number(gsap.getProperty(line, "yPercent")) < 85);
  c.timeline.seek(6.2, false);
  assert.equal(complete, 1);
  assert.equal(Number(gsap.getProperty(line, "yPercent")), 0);
  assert.equal(f.overlay.style.visibility, "hidden");
  c.dispose();
  assert.equal(hero.dataset.introOwned, "true");
  assert.equal(line.style.transform, "");
});
test("cancel/remount reverts original transforms and kills stale completion", () => {
  const f = fixture();
  let complete = 0;
  f.onComplete = () => complete++;
  f.page.querySelector(".header").style.transform = "translateX(3px)";
  const c = createGlassUnfold(f);
  c.timeline.seek(2, false);
  c.dispose();
  c.dispose();
  assert.equal(complete, 0);
  assert.equal(f.page.querySelector(".hero").dataset.introOwned, undefined);
  assert.equal(
    f.page.querySelector(".header").style.transform,
    "translateX(3px)",
  );
  const next = createGlassUnfold({ ...f, mobile: true });
  next.settleAssets(true);
  next.timeline.seek(6.2, false);
  assert.equal(complete, 1);
  next.dispose();
});
test("reduced motion is short, gated, and leaves hero transforms alone", () => {
  const f = fixture();
  const c = createGlassUnfold({ ...f, reduced: true, mobile: true });
  assert.ok(c.timeline.duration() < 0.6);
  assert.equal(f.page.querySelector("[data-hero-line]").style.transform, "");
  c.settleAssets(true);
  c.finishImmediately();
  c.dispose();
});
test("scroll lock restores wheel, overflow, padding, and inert exactly once", () => {
  const { page } = fixture();
  document.documentElement.style.overflow = "clip";
  document.body.style.paddingRight = "11px";
  page.setAttribute("aria-busy", "false");
  const unlock = lockIntroInteraction(page);
  assert.equal(page.inert, true);
  const e = new window.Event("wheel", { cancelable: true });
  window.dispatchEvent(e);
  assert.equal(e.defaultPrevented, true);
  unlock();
  unlock();
  assert.equal(document.documentElement.style.overflow, "clip");
  assert.equal(document.body.style.paddingRight, "11px");
  assert.equal(page.getAttribute("aria-busy"), "false");
  assert.notEqual(page.inert, true);
  const after = new window.Event("wheel", { cancelable: true });
  window.dispatchEvent(after);
  assert.equal(after.defaultPrevented, false);
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
});
test("direct detail route and emergency deadline do not require a hero", () => {
  const f = fixture();
  f.page.querySelector(".hero").remove();
  let complete = 0;
  f.onComplete = () => complete++;
  const c = createGlassUnfold(f);
  c.finishImmediately();
  assert.equal(complete, 1);
  c.dispose();
});
test("every SVG keyframe uses compatible commands", () => {
  const signature = (p) => p.match(/[A-Za-z]/g).join("");
  for (const p of [RIBBON_ORBIT, RIBBON_READY, RIBBON_EXIT])
    assert.equal(signature(RIBBON_WAVE), signature(p));
  assert.equal(signature(IRIS_CLOSED), signature(IRIS_OPEN));
});
test("preloader markup has no percentage counter, progress bar, or duplicate homepage", () => {
  const source = readFileSync(
    new URL("../src/components/preloader.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /data-progress-number|role="progressbar"|<Home\b|<h1\b/,
  );
  assert.match(source, /copy\.growthNote/);
});
after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
