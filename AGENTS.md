# AGENTS.md — Diversio Engineering Website

Astro static site deployed to Cloudflare Pages at `engineering.diversio.com`.
Built from this repo. Agentic Tools content comes from
`DiversioTeam/agent-skills-marketplace` at build time.

## Quick orientation

```
engineering-website/                  ← you are here (builds + deploys everything)
├── src/pages/                        ← .astro page templates
├── src/data/                         ← structured content (.ts + marketplace.json)
├── src/content/blog/                 ← blog posts (Markdown frontmatter)
├── src/components/                   ← shared UI (.astro)
├── src/layouts/                      ← page shells
├── src/utils/                        ← helpers (blog, metrics, OG, dates)
├── public/                           ← static assets (logos, OG images, redirects)
├── docs/                             ← maintainer docs (the human/agent manual)
├── scripts/                          ← checkout-asm.sh, generate-og-images.py
├── .github/workflows/                ← validate + deploy CI
├── site.config.mjs                   ← site identity (name, URLs, nav, GitHub links)
├── agent-skills-source.ref           ← pinned ASM SHA (lock file)
└── astro.config.mjs                  ← Astro config
```

## Commands

```bash
# Everyday
npm install --package-lock=false    # first time or after package.json changes
npm run build                        # production build → dist/
npm run dev                          # dev server at http://localhost:4321

# Before every build: sync marketplace.json from ASM sibling checkout
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json
npm run build

# OG image regeneration (after content/metadata changes)
python3 scripts/generate-og-images.py && npm run build

# Local CI simulation (checkout ASM at pinned SHA)
./scripts/checkout-asm.sh $(cat agent-skills-source.ref)
```

## Blog-specific authoring patterns

### 1. Review-only draft URLs

Use this when a post is not ready for `/blog` yet, but another person needs a
real URL to review the full page.

Frontmatter pattern:

```yaml
---
draft: true
previewToken: some-review-token
---
```

Result:
- the post stays out of `/blog`
- Astro builds a review URL at:
  - `/blog/review/<previewToken>/<slug>/`
- the preview page is marked `noindex, nofollow, noarchive`

This is a review convenience, not authentication.

### 2. AI writing disclaimer block

When a post used AI in narrow, explicit ways, use the reusable disclaimer block
at the end of the markdown body:

```html
<div class="ai-disclaimer">
  <p class="ai-disclaimer-title">AI writing disclaimer</p>
  <ul>
    <li>Verified for typos and grammar using ...</li>
    <li>Links or references were gathered with the help of ...</li>
    <li>Images / SVGs / diagrams were generated using ...</li>
  </ul>
</div>
```

Why HTML instead of markdown?
- it keeps the disclaimer visually separate from the main article prose
- it reuses one stable styling hook across all blog posts
- each article can change the content without changing the presentation

## Doc routing — which file to read

| When you need to... | Read |
|---|---|
| Make a routine change fast | `docs/maintainer-quickstart.md` |
| Set up this repo from scratch | `docs/local-dev.md` |
| Know which repo owns a route or workflow | `docs/route-ownership.md` |
| Understand page scope, blog rules, stack provenance | `docs/content-governance.md` |
| Find the exact file for a known change | `docs/editing-recipes.md` |
| Decide: page edit, shared data, or blog post? | `docs/editorial-workflow.md` |

## Architecture — the split-repo model

```
  engineering.diversio.com
           │
  ┌────────┴────────┐
  │ engineering-     │  ← builds & deploys everything
  │ website          │
  └────────┬────────┘
           │
    ┌──────┼──────┐
    │      │      │
  Broad  Blog   Agentic Tools pages
  pages  posts  /agentic-tools /registry
                /docs/* /skills/* /pi/*
                        ▲
              ┌─────────┴─────────┐
              │ agent-skills-      │  ← source of truth for tool docs
              │ marketplace        │
              └───────────────────┘
```

**Rule**: All pages render from this repo. Agentic Tools content (SKILL.md,
README.md, marketplace.json) is source-owned by ASM and resolved at build time
via `src/data/site-docs.ts` extraction from a checked-out ASM repo.

## Build pipeline

Every build (local and CI) follows the same sequence:

1. Ensure `src/data/marketplace.json` exists (local: `cp` from sibling; CI: copy from ASM checkout)
2. `npm install --package-lock=false`
3. `npm run build`
4. (CI deploy only) `wrangler pages deploy dist/`

CI pinning: `agent-skills-source.ref` records the default ASM SHA. ASM merges
to main dispatch a `repository_dispatch` event that overrides the lock file
with the exact merged SHA.

## Non-negotiable constraints

- **`src/data/marketplace.json` is a build artifact.** Never hand-edit it.
  Canonical source: `agent-skills-marketplace/website/src/data/marketplace.json`.
- **`agentSkillsRepoUrl` in site.config.mjs must point to ASM.** It feeds
  /community contribution links. Do not change it to engineering-website.
- **One featured blog post at a time.** `featured: true` on at most one post.
  Enforced by `utils/blog-posts.ts`.
- **Systems lane order is canonical.** Adding a lane without adding it to
  `engineeringHighlightLaneOrder` causes a build failure.
- **Stack entries must be meaningful.** Do not turn the stack into an
  exhaustive inventory. See `docs/content-governance.md` for the rules.
- **No page-local flattening.** If a string appears in multiple page templates,
  it should live in `src/data/site-entry-points.ts` or a scoped data file.

## CI workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `validate-website.yml` | Push/PR touching site files | Checkout self + ASM, build, no deploy |
| `deploy-website-cloudflare-pages.yml` | PR → preview \| push to main → production \| ASM dispatch → production \| manual | Full build + wrangler deploy |

## Secrets and variables

| Name | Where | Purpose |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Repo secrets | wrangler deploy auth |
| `CLOUDFLARE_ACCOUNT_ID` | Repo secrets | wrangler deploy target |
| `CLOUDFLARE_PAGES_PROJECT` | Repo vars (optional) | Defaults to `diversio-engineering` |

ASM side (in `agent-skills-marketplace`):
- `ENGINEERING_WEBSITE_DISPATCH_TOKEN` — PAT for cross-repo dispatch

## Key files to know

| File | Job |
|---|---|
| `site.config.mjs` | Site name, routes, nav, GitHub URLs — update here first |
| `src/data/engineering-principles.ts` | /how-we-work principles |
| `src/data/engineering-practices.ts` | /how-we-work practice rows |
| `src/data/engineering-highlights.ts` | /systems highlights + lane order |
| `src/data/engineering-stack.ts` | /systems stack layers, logos, tools |
| `src/data/site-entry-points.ts` | Shared CTA/route summary copy |
| `src/data/agentic-tools.ts` | Featured plugin curation |
| `src/data/site-docs.ts` | ASM extraction layer (skill/pi/doc pages) |
| `src/utils/site-metrics.ts` | Shared counts (plugins, skills, posts, layers) |
| `src/utils/blog-posts.ts` | Blog post loading + featured post validation |
| `agent-skills-source.ref` | Pinned ASM SHA (one line, 40-char hex) |
