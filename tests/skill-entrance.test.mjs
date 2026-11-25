import { JSDOM } from "jsdom";
import { test, after } from "node:test";
import assert from "node:assert/strict";
const dom = new JSDOM(
  "<!doctype html><style>.skill-burst,.skill-tile {opacity:1;visibility:visible}</style><body></body>",
  { pretendToBeVisual: true },
);
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const { gsap } = await import("gsap");
const { createSkillEntrance } =
  await import("../src/lib/motion/skill-entrance.ts");
function dims(node, values) {
  for (const [key, value] of Object.entries(values))
    Object.defineProperty(node, key, { value, configurable: true });
}
function fixture(compact = false) {
  document.body.innerHTML =
    '<section><div class="skill-lab"><div class="lab-core"></div>' +
    Array.from(
      { length: 5 },
      (_, i) =>
        `<div class="skill-burst"><button class="skill-tile"><div class="skill-tile-content">Skill ${i + 1}</div></button></div>`,
    ).join("") +
    "</div></section>";
  const section = document.querySelector("section");
  const lab = section.querySelector(".skill-lab");
  dims(lab, { clientWidth: compact ? 360 : 720, clientHeight: 670 });
  dims(section.querySelector(".lab-core"), {
    offsetLeft: 280,
    offsetTop: 230,
    offsetWidth: compact ? 0 : 170,
    offsetHeight: 170,
  });
  const positions = [
    [200, 0],
    [500, 180],
    [0, 200],
    [70, 485],
    [480, 485],
  ];
  section
    .querySelectorAll(".skill-burst")
    .forEach((el, i) =>
      dims(el, {
        offsetLeft: positions[i][0],
        offsetTop: positions[i][1],
        offsetWidth: 220,
        offsetHeight: 185,
      }),
    );
  return section;
}
function visible(section) {
  for (const el of section.querySelectorAll(".skill-burst,.skill-tile")) {
    assert.equal(Number(getComputedStyle(el).opacity), 1);
    assert.equal(getComputedStyle(el).visibility, "visible");
  }
}
test("whole boxes gather at the core, spread to their layout positions, and contract on reverse scroll", () => {
  const root = fixture();
  const entrance = createSkillEntrance(root);
  for (const shell of root.querySelectorAll(".skill-burst")) {
    assert.equal(
      shell.offsetLeft + 110 + Number(gsap.getProperty(shell, "x")),
      365,
    );
    assert.equal(
      shell.offsetTop + 92.5 + Number(gsap.getProperty(shell, "y")),
      315,
    );
  }
  visible(root);
  entrance.progress(0.5);
  const middle = Number(
    gsap.getProperty(root.querySelector(".skill-burst"), "scaleX"),
  );
  assert.ok(middle > 0.35 && middle < 1);
  entrance.progress(1);
  for (const shell of root.querySelectorAll(".skill-burst")) {
    assert.equal(Number(gsap.getProperty(shell, "x")), 0);
    assert.equal(Number(gsap.getProperty(shell, "y")), 0);
    assert.equal(Number(gsap.getProperty(shell, "scaleX")), 1);
  }
  entrance.progress(0);
  assert.equal(
    Number(gsap.getProperty(root.querySelector(".skill-burst"), "scaleX")),
    0.35,
  );
  visible(root);
  entrance.kill();
});
test("hover on the inner button cannot overwrite the scroll burst; cancellation restores layout", () => {
  const root = fixture();
  const button = root.querySelector("button");
  let entrance;
  const ctx = gsap.context(() => {
    entrance = createSkillEntrance(root);
  }, root);
  entrance.progress(0.3);
  const hover = gsap.to(button, {
    rotationY: 6,
    rotationX: 3,
    duration: 0.4,
    overwrite: "auto",
  });
  hover.progress(1);
  entrance.progress(1);
  assert.equal(Number(gsap.getProperty(button, "rotationY")), 6);
  assert.equal(Number(gsap.getProperty(button.parentElement, "y")), 0);
  visible(root);
  hover.kill();
  ctx.revert();
  for (const shell of root.querySelectorAll(".skill-burst"))
    assert.equal(shell.style.transform, "");
  visible(root);
});
test("compact layout uses a smaller visible burst even when the decorative core is hidden", () => {
  const root = fixture(true);
  const entrance = createSkillEntrance(root);
  const shell = root.querySelector(".skill-burst");
  assert.equal(Number(gsap.getProperty(shell, "scaleX")), 0.55);
  assert.equal(Number(gsap.getProperty(shell, "x")), (180 - 200 - 110) * 0.55);
  visible(root);
  entrance.progress(1);
  assert.equal(Number(gsap.getProperty(shell, "scaleX")), 1);
  entrance.kill();
});
after(() => {
  gsap.ticker.sleep();
  dom.window.close();
});
