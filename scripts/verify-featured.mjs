import { readFile, access } from "node:fs/promises";
import { JSDOM } from "jsdom";
import assert from "node:assert/strict";

const dom = new JSDOM(await readFile("out/index.html", "utf8"));
const doc = dom.window.document;
assert.equal(doc.querySelectorAll("#featured").length, 1);
assert.equal(
  doc.querySelectorAll(".stack-stage,.stack-card").length,
  0,
  "old slider replaced",
);
const section = doc.querySelector("[data-featured-orbit]");
assert.equal(section.querySelectorAll("[data-orbit-stage]").length, 1);
assert.equal(section.querySelectorAll("[data-orbit-title]").length, 1);
assert.match(section.querySelector("h2").textContent, /FEATUREDPROJECTS/);
const originals = [
  ...section.querySelectorAll("[data-orbit-card]:not([data-orbit-copy])"),
];
assert.equal(originals.length, 4);
const slugs = new Set();
for (const card of originals) {
  const link = card.querySelector("a");
  const href = link.getAttribute("href");
  assert.match(href, /^\/projects\/[^/]+\/$/);
  assert.equal(link.getAttribute("tabindex"), "0");
  assert.ok(!card.hasAttribute("aria-hidden"));
  assert.ok(card.querySelector("h3").textContent.length > 3);
  slugs.add(href);
  await access(`out${href}index.html`);
  const img = card.querySelector("img");
  assert.ok(img.alt.length > 5);
  await access(`public${img.getAttribute("src")}`);
}
assert.equal(
  slugs.size,
  originals.length,
  "each project appears once in accessible navigation",
);
for (const copy of section.querySelectorAll("[data-orbit-copy]")) {
  assert.equal(copy.getAttribute("aria-hidden"), "true");
  assert.equal(copy.querySelector("a").getAttribute("tabindex"), "-1");
  assert.ok(slugs.has(copy.querySelector("a").getAttribute("href")));
}
assert.equal(
  section.querySelectorAll("button").length,
  0,
  "no pause controls added",
);
dom.window.close();
console.log(
  "PASS: one Featured orbit, real project assets and detail links, accessible originals, decorative loop copies, no old slider or pause controls.",
);
