import assert from "node:assert/strict";
import { readFile, readdir, access, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { JSDOM } from "jsdom";
const root = resolve("out");
const routes = [
  "/",
  "/projects/",
  "/projects/noithatnhom/",
  "/projects/thuethuyen/",
  "/projects/nangto/",
  "/projects/vietyachtplus/",
];
let checkedLinks = 0;
for (const route of routes) {
  const html = await readFile(join(root, route, "index.html"), "utf8");
  assert.match(html, /<html[^>]+lang="vi"/, `${route}: Vietnamese locale`);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${route}: one H1`,
  );
  assert.match(html, /<title>[^<]+<\/title>/, `${route}: title`);
  assert.match(html, /name="description"/, `${route}: description`);
  assert.match(
    html,
    /mailto:huyphamfe3004@gmail.com/,
    `${route}: configured email`,
  );
  assert.match(html, /tel:\+84799192829/, `${route}: configured phone`);
  assert.match(html, /CONCEPT/, `${route}: illustrative content is labeled`);
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const ref = match[1].replace(/&amp;/g, "&");
    if (!ref.startsWith("/") && !ref.startsWith("#")) continue;
    const url = new URL(ref, `https://portfolio.test${route}`);
    let target = join(root, decodeURIComponent(url.pathname));
    const info = await stat(target).catch(() => null);
    if (info?.isDirectory()) target = join(target, "index.html");
    await access(target).catch(() => {
      throw Error(`${route}: missing local link or asset ${ref}`);
    });
    if (url.hash) {
      const targetHtml = await readFile(target, "utf8");
      assert.ok(
        targetHtml.includes(`id="${url.hash.slice(1)}"`),
        `${route}: missing anchor ${ref}`,
      );
    }
    checkedLinks++;
  }
}
// SEO case study: the exact supplied rankings, nothing invented.
const seoDom = new JSDOM(
  await readFile(join(root, "projects/vietyachtplus/index.html"), "utf8"),
);
const seoDoc = seoDom.window.document;
assert.deepEqual(
  [...seoDoc.querySelectorAll("[data-counter]")].map((el) => el.textContent),
  ["05", "06", "07"],
);
assert.deepEqual(
  [...seoDoc.querySelectorAll("main ol li")].map((li) => li.textContent),
  [
    "Lái thuyềnThứ hạng #1",
    "Giá du thuyềnThứ hạng #1",
    "Học bằng thuyền trưởng hạng 3Thứ hạng #1",
    "Du thuyền cá nhânThứ hạng #1",
    "Công ty cho thuê du thuyềnThứ hạng #1",
    "Yacht là gìThứ hạng #3",
    "YachtThứ hạng #12",
  ],
);
assert.ok(seoDoc.querySelector('dialog img[src="/images/project-vietyachtplus.webp"]'));
assert.doesNotMatch(
  seoDoc.querySelector("main").textContent,
  /traffic|doanh thu|chuyển đổi|ROAS/i,
  "no unsupported SEO claims",
);
seoDom.window.close();
const notFound = await readFile(join(root, "404.html"), "utf8");
assert.match(notFound, /404/);
const imageFiles = await readdir(join(root, "images"));
assert.equal(imageFiles.filter((file) => file.endsWith("-800.jpg")).length, 3);
console.log(
  `PASS: ${routes.length} static routes, ${checkedLinks} local references, metadata, contact links, content labels, 404 and mobile assets.`,
);
