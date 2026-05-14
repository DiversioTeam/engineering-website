# Architecture Overview

This repo builds and deploys the full Diversio Engineering website, but part of
its content is source-owned by `agent-skills-marketplace` (ASM) and resolved at
build time.

Use `docs/route-ownership.md` for the exhaustive route table. Use this file for
system shape, boundaries, and the main code paths.

## Main Components

- `src/pages/`
  - Astro routes for broad pages, docs pages, skills pages, Pi pages, blog pages, and static routes.
- `src/data/`
  - Structured content for broad-site pages plus `site-docs.ts`, the extraction layer for ASM-owned docs.
- `src/content/blog/`
  - Local markdown posts and repost metadata.
- `public/`
  - Static assets, redirects, and generated OG images.
- `scripts/`
  - Local helpers for ASM checkout and OG regeneration.
- `.github/workflows/`
  - Read-only validation plus preview/production deployment.

## Split-Repo Model

```text
engineering.diversio.com
         │
         ▼
engineering-website
  ├─ renders all public pages
  ├─ owns layouts, pages, styles, blog, and deploy workflows
  └─ reads some content from ASM during the build
         │
         ▼
agent-skills-marketplace
  ├─ owns SKILL.md files
  ├─ owns Pi package README.md files
  └─ owns marketplace metadata used by /agentic-tools and /registry
```

## Source of Truth Boundaries

| Surface | Canonical source |
|---|---|
| Site identity, routes, nav labels | `site.config.mjs` |
| `/`, `/how-we-work`, `/systems`, `/community` content | `src/pages/*` plus scoped files in `src/data/` |
| Shared route summaries / CTA copy | `src/data/site-entry-points.ts` |
| Systems highlights and lane order | `src/data/engineering-highlights.ts` |
| Stack showcase | `src/data/engineering-stack.ts` |
| Blog content | `src/content/blog/*` |
| Skill docs | ASM `plugins/*/skills/*/SKILL.md` |
| Pi package docs | ASM `pi-packages/*/README.md` and `pi-packages/*/skills/*/SKILL.md` |
| Catalog metadata | ASM `website/src/data/marketplace.json` |
| Copied local marketplace artifact | `src/data/marketplace.json` (generated, never hand-edit) |

## Main Flows

### 1. Broad-site page change

```text
src/pages/* or src/data/*
  -> npm run build
  -> Astro renders static HTML into dist/
```

### 2. Agentic Tools doc change

```text
ASM source docs
  -> build locates ASM checkout
  -> src/data/site-docs.ts extracts headings, summaries, and metadata
  -> /docs/*, /skills/*, and /pi/* pages render from that extracted content
```

### 3. Blog publishing flow

```text
src/content/blog/*.md
  -> src/content.config.ts validates frontmatter
  -> src/utils/blog-posts.ts enforces featured-post constraints
  -> /blog, /blog/<slug>, /authors/* render from the collection
```

### 4. Build and deploy flow

```text
ASM checkout available
  -> copy ASM website/src/data/marketplace.json into src/data/
  -> npm install --package-lock=false
  -> npm run build
  -> dist/
  -> Cloudflare Pages deploy (preview or production)
```

## Build-Time ASM Resolution

The two main resolvers are intentionally similar but not byte-for-byte identical:

- `src/data/site-docs.ts` checks:
  1. `AGENT_SKILLS_REPO_DIR`
  2. the current git repo root, but only if it already contains `plugins/` and `pi-packages/`
  3. `../`
  4. `../agent-skills-marketplace`
  5. `../vendor/agent-skills-marketplace`
  6. `vendor/agent-skills-marketplace`
- `scripts/generate-og-images.py` checks:
  1. `AGENT_SKILLS_REPO_DIR`
  2. `../`
  3. `../agent-skills-marketplace`
  4. `../vendor/agent-skills-marketplace`
  5. `vendor/agent-skills-marketplace`

In normal local development, the expected path is still
`../agent-skills-marketplace`. CI uses `vendor/agent-skills-marketplace`.

## Useful Code References

- `src/data/site-docs.ts` — ASM extraction and source-repo resolution
- `src/utils/blog-posts.ts` — featured-post validation and blog collection loading
- `src/utils/site-metrics.ts` — shared counts reused across broad pages
- `src/utils/og-image.ts` — route-to-OG-image lookup and fallbacks
- `src/content.config.ts` — blog schema and repost validation
- `scripts/generate-og-images.py` — static social-card generation
- `.github/workflows/validate-website.yml` — read-only build gate
- `.github/workflows/deploy-website-cloudflare-pages.yml` — preview + production deploy

## Design Constraints That Matter

- This repo renders Agentic Tools pages, but it does not source-own their docs.
- `src/data/marketplace.json` is a copied artifact, not maintained content.
- Repeated copy across page templates should be pulled into scoped data files.
- Build-time failures are expected safeguards for invalid lane order, invalid featured-post state, or missing ASM inputs.
