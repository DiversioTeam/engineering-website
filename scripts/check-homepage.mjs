import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// Check rendered output so the homepage cannot drift from the skill directory.
const homepage = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const skillCount = readdirSync(new URL("../dist/skills/", import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory()).length;
const resourceCards = [...homepage.matchAll(/<a\b[^>]*class="home-proof-item"[^>]*>([\s\S]*?)<\/a>/g)];
assert.equal(resourceCards.length, 4);
assert.ok(skillCount > 0);
assert.match(resourceCards[0][1], new RegExp(`home-proof-value[^>]*>${skillCount}</span>`));
for (const [, card] of resourceCards) {
  assert.match(card, /home-proof-description[^>]*>[^<]+<\/p>/);
}

const projects = homepage.slice(homepage.indexOf('id="open-source-projects"'));
const expectedOrder = ["local-ci-runner", "pi-cmux", "clickup-mcp", "gemini-cli-mcp"];
let previousPosition = -1;
for (const repository of expectedOrder) {
  const position = projects.indexOf(`https://github.com/DiversioTeam/${repository}`);
  assert.ok(position > previousPosition, `${repository} missing or out of order`);
  previousPosition = position;
}
console.log(`Homepage: ${skillCount} workflows, four explained resource cards, expected project order.`);
