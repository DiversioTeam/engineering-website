import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const systemsIndex = readFileSync(new URL("../dist/systems/index.html", import.meta.url), "utf8");
const howWeWork = readFileSync(new URL("../dist/how-we-work/index.html", import.meta.url), "utf8");
for (const [slug, title] of [["dev-center", "Dev Center"], ["courage", "Courage"]]) {
  const page = readFileSync(new URL(`../dist/systems/${slug}/index.html`, import.meta.url), "utf8");
  assert.equal([...page.matchAll(/<h1\b/g)].length, 1, `${slug}: one page heading`);
  assert.match(page, new RegExp(`<h1\\b[^>]*>\\s*${title}\\s*</h1>`));
  assert.match(page, /private/i, `${slug}: distinguish internal tools from public packages`);
  assert.ok(page.includes(`/og/systems-${slug}.png`), `${slug}: dedicated social image`);
  assert.ok(existsSync(new URL(`../dist/og/systems-${slug}.png`, import.meta.url)));
  assert.ok(systemsIndex.includes(`href="/systems/${slug}"`));
  assert.ok(howWeWork.includes(`href="/systems/${slug}"`));
  // These public overviews must not turn into links to private operational surfaces.
  assert.doesNotMatch(page, /team\.diversio\.com|internal-share\.diversio\.com|slack\.com\/archives|github\.com\/DiversioTeam\/(?:courage|dev-center)(?:[\/"?#]|$)/i);
}

const devCenter = readFileSync(new URL("../dist/systems/dev-center/index.html", import.meta.url), "utf8");
assert.match(devCenter, /<video\b[^>]*controls[^>]*preload="none"/);
assert.doesNotMatch(devCenter, /<video\b[^>]*autoplay/);
for (const filename of ["dev-center-services.webp", "dev-center-agent.poster.jpg", "dev-center-agent.mp4"]) {
  assert.ok(existsSync(new URL(`../dist/images/systems/${filename}`, import.meta.url)));
}
const courage = readFileSync(new URL("../dist/systems/courage/index.html", import.meta.url), "utf8");
assert.match(courage, /Illustrated, not a real conversation/);
const blogIndex = readFileSync(new URL("../dist/blog/index.html", import.meta.url), "utf8");
assert.match(blogIndex, /<h2 class="featured-post-title"[^>]*><a href="\/blog\/all-tools-should-now-have-two-users"/);

const repost = readFileSync(new URL("../dist/blog/all-tools-should-now-have-two-users/index.html", import.meta.url), "utf8");
assert.match(repost, /<link\b[^>]*rel="canonical"[^>]*href="https:\/\/ashwch\.com\/all-tools-should-now-have-two-users\.html"/);
assert.match(repost, /Originally published/);
console.log("Systems: public overviews linked, private-tool boundaries explicit, repost canonical preserved.");
