import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import assert from "node:assert/strict";
const html = await readFile("out/index.html", "utf8");
const dom = new JSDOM(html);
const doc = dom.window.document;
assert.equal(doc.querySelectorAll(".hero").length, 1, "only the real hero");
assert.equal(
  doc.querySelectorAll(".skill-tile").length,
  5,
  "five skill categories",
);
assert.equal(
  doc.querySelectorAll("[data-orbit-card]:not([data-orbit-copy])").length,
  3,
  "featured project navigation preserved in the new orbit",
);
assert.equal(
  doc.querySelectorAll(".growth-story").length,
  1,
  "new visual story",
);
assert.equal(
  doc.querySelectorAll(".growth-chapters li").length,
  0,
  "redundant Build / Connect / Grow row removed",
);
assert.equal(
  doc.querySelectorAll(".process-scene").length,
  4,
  "four process steps",
);
assert.equal(
  doc.querySelectorAll(".impact-background,.metric-placeholder").length,
  0,
  "old imagery and pending KPI boxes removed",
);
const caseStudy = doc.querySelector("[data-case-grid]")?.closest("section");
assert.ok(caseStudy, "AloHouse case study section");
assert.match(caseStudy.textContent, /AloHouse · 2026/);
assert.deepEqual(
  [...caseStudy.querySelectorAll("[data-case-value]")].map(
    (el) => el.parentElement.textContent,
  ),
  ["125.382.488đ", "2.344.327", "992.954", "6.196", "5.001", "2.357đ", "2,27%", "53.483đ"],
  "exact Meta Ads figures in Vietnamese format, never rounded",
);
assert.equal(
  caseStudy.querySelector("[data-case-note]").textContent,
  "Nguồn dữ liệu: Meta Ads Manager · AloHouse 2026",
);
assert.equal(
  caseStudy.querySelectorAll("[data-chart-line],[data-chart-point]").length,
  0,
  "no illustrative growth chart beside real results",
);
assert.equal(doc.querySelectorAll(".growth-disclosure").length, 0);
for (const text of [
  "CHẠM ĐỂ KHÁM PHÁ",
  "7 giai đoạn minh họa",
  "Ảnh cá nhân sẽ được cập nhật",
])
  assert.ok(
    !doc.body.textContent.includes(text),
    `removed redundant copy: ${text}`,
  );
for (const button of doc.querySelectorAll(".skill-tile"))
  assert.ok(button.hasAttribute("aria-pressed"));
for (const image of doc.querySelectorAll(".brand-mark img")) {
  assert.ok(image.hasAttribute("alt"), "accessible logo");
  const svg = await readFile("public" + image.getAttribute("src"), "utf8");
  assert.match(svg, /<svg[^>]+viewBox="0 0 24 24"/);
  assert.doesNotMatch(svg, /<script|onload=|<foreignObject/);
}
assert.equal(
  doc.querySelectorAll(
    '.preloader [data-progress-number],.preloader [role="progressbar"]',
  ).length,
  0,
);
assert.equal(
  doc.querySelectorAll(".process-figure img").length,
  4,
  "one visual per process step",
);
assert.equal(
  doc.querySelectorAll(".technology-group").length,
  2,
  "seamless duplicate logo groups",
);
assert.equal(
  doc.querySelectorAll('.technology-group[aria-hidden="true"]').length,
  1,
  "duplicate logos hidden from screen readers",
);
assert.equal(
  doc.querySelectorAll(".technology-section button").length,
  0,
  "no pause buttons requested",
);
assert.equal(
  doc.querySelectorAll(".technology-group:not([aria-hidden]) li").length,
  11,
);
assert.ok(
  doc.querySelector('.skill-tile img[src="/brands/wordpress.svg"]'),
  "WordPress visible in web development",
);
assert.equal(
  doc.querySelectorAll(".skills-title > span").length,
  3,
  "three deliberate heading lines",
);
for (const img of doc.querySelectorAll(".process-figure img")) {
  assert.ok(img.alt.length > 10);
  const svg = await readFile("public" + img.getAttribute("src"), "utf8");
  const parsed = new JSDOM(svg, { contentType: "image/svg+xml" });
  assert.equal(parsed.window.document.documentElement.tagName, "svg");
  parsed.window.close();
}
dom.window.close();
console.log(
  "PASS: redesign content, five skills, existing project links, exact AloHouse case-study metrics, local SVG assets, vertical process and seamless technology marquee, and no duplicate hero.",
);
