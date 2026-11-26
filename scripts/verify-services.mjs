import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM(await readFile("out/index.html", "utf8"));
const doc = dom.window.document;
const section = doc.querySelector("#services");
assert.ok(section);
assert.equal(doc.querySelectorAll("#services").length, 1);
assert.ok(
  section.previousElementSibling.classList.contains("technology-section"),
  "services follow the technology strip directly",
);
assert.equal(
  section.nextElementSibling.id,
  "featured",
  "existing projects follow naturally",
);
assert.equal(section.querySelectorAll("[data-service-card]").length, 3);
assert.equal(section.querySelectorAll("[data-service-logo]").length, 9);
assert.ok(section.querySelector('a[href="#process"]'));
assert.ok(
  section.querySelector('img[src="/images/project-noithatnhom.jpg"]'),
  "existing Toan concept reused",
);
assert.equal(section.querySelectorAll("[data-service-line]").length, 2);
assert.equal(
  section.querySelectorAll("button").length,
  0,
  "no pause controls or decorative nonfunctional buttons",
);
assert.equal(section.querySelectorAll("figcaption").length, 0);
assert.doesNotMatch(
  section.textContent,
  /\+\d+%|Top\s*[1-5]/i,
  "no invented KPI or search rankings",
);
assert.equal(
  section.querySelectorAll("[data-chart-line],[data-scene],[data-reveal]")
    .length,
  0,
  "no competing global animation selectors",
);
for (const image of section.querySelectorAll("img")) {
  assert.ok(image.hasAttribute("alt"));
  assert.ok(image.getAttribute("src").startsWith("/"));
  await readFile("public" + image.getAttribute("src"));
}
assert.equal(
  section.querySelectorAll('[data-enhanced="true"]').length,
  0,
  "static/reduced-motion baseline remains natural flow",
);
dom.window.close();
console.log(
  "PASS: three native service cards, preserved projects, local assets, real CTA, readable static baseline and illustrative data labels.",
);
