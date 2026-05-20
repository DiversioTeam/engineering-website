# AGENTS.md — Diversio Engineering Website

## What This Repo Is

Astro static site for `engineering.diversio.com`. This repo renders and deploys
all public pages. Agentic Tools content is source-owned by
`DiversioTeam/agent-skills-marketplace` and resolved here at build time.

## How to Navigate This Repo

- Start here for commands and hard repo rules.
- Read `docs/maintainer-quickstart.md` for the fastest file-targeting guide.
- Read `docs/architecture/overview.md` for the split-repo model and core code paths.
- Read `docs/quality/gates.md` for build gates, CI jobs, and recurring failures.
- Read `docs/runbooks/development.md` for everyday workflows, ASM pinning, and OG generation.
- Read `docs/runbooks/blog-authoring.md` for blog frontmatter, reposts/cross-posts, why the ashwch.com workflow is stub-based here, review URLs, and scheduled posts.
- Read `docs/route-ownership.md`, `docs/content-governance.md`, `docs/editing-recipes.md`, and `docs/editorial-workflow.md` when you need ownership or editorial decisions.

## Repo Map

```text
engineering-website/
├── src/pages/              Astro routes
├── src/data/               Structured content + ASM extraction helpers
├── src/content/blog/       Blog posts
├── src/components/         Shared UI
├── src/layouts/            Page shells
├── src/utils/              Blog, metrics, OG, and content helpers
├── public/                 Static assets and generated OG images
├── docs/                   Maintainer docs
├── scripts/                ASM checkout + OG helpers
├── .github/workflows/      Validate + deploy workflows
├── site.config.mjs         Site identity and nav
└── agent-skills-source.ref Default ASM SHA for builds
```

## Commands

```bash
npm install --package-lock=false
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json
npm run build
npm run dev
python3 scripts/generate-og-images.py && npm run build
./scripts/checkout-asm.sh $(cat agent-skills-source.ref)
```

If the ASM repo is not available as a sibling checkout, set:

```bash
export AGENT_SKILLS_REPO_DIR=/absolute/path/to/agent-skills-marketplace
```

## Non-Negotiable Rules

- Never hand-edit `src/data/marketplace.json`. It is an untracked build artifact copied from ASM.
- Agentic Tools docs belong in ASM (`plugins/*/skills/*/SKILL.md`, `pi-packages/*/README.md`, `pi-packages/*/skills/*/SKILL.md`).
- Keep `agentSkillsRepoUrl` in `site.config.mjs` pointing at ASM. `/community` depends on it.
- Only one blog post may have `featured: true` at a time.
- Every new systems lane must also be added to `engineeringHighlightLaneOrder`.
- Reused strings belong in `src/data/site-entry-points.ts` or another scoped data file, not duplicated across templates.

## Docs Index

- `docs/architecture/overview.md` — system boundaries, source-of-truth map, build/deploy flow
- `docs/quality/gates.md` — required commands, CI jobs, common failures, golden rules
- `docs/runbooks/development.md` — daily development loop, local CI simulation, lock-file updates
- `docs/runbooks/blog-authoring.md` — original vs repost schema, first-principles ashwch.com cross-post workflow, draft previews, scheduled posts, AI disclaimer block
- `docs/maintainer-quickstart.md` — fastest path from task to file
- `docs/local-dev.md` — first-time setup and source-repo resolution
- `docs/route-ownership.md` — exact route ownership across this repo and ASM
- `docs/content-governance.md` — page scope, stack rules, source-of-truth decisions
- `docs/editing-recipes.md` — direct edit recipes
- `docs/editorial-workflow.md` — page vs post vs shared-data judgment calls

## Keep the Harness Fresh

- If a failure repeats, add a focused doc update or mechanical guard.
- If commands or workflows change, update this file and the linked source doc.
- Prefer adding focused docs under `docs/` over growing this file into a handbook.
