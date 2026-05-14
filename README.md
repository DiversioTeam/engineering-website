# Diversio Engineering Website

Astro static site for the Diversio Engineering hub at [engineering.diversio.com](https://engineering.diversio.com).

> For agent-oriented commands, repo rules, and deeper project docs, see [AGENTS.md](./AGENTS.md).

## Quickstart

Node `>=22.12.0` is required locally. CI builds with Node 24.

```bash
npm install --package-lock=false

# Normal local setup: keep agent-skills-marketplace as a sibling checkout.
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

npm run build
npm run dev
```

If your ASM checkout lives somewhere else, set:

```bash
export AGENT_SKILLS_REPO_DIR=/absolute/path/to/agent-skills-marketplace
```

## What This Repo Owns

- Astro pages, layouts, components, styles, and static assets
- Top-level engineering pages like `/`, `/how-we-work`, `/systems`, and `/community`
- Blog content under `src/content/blog/`
- The Cloudflare Pages validation and deploy workflows
- The build-time extraction layer that turns ASM docs into `/docs/*`, `/skills/*`, and `/pi/*`

## What `agent-skills-marketplace` Owns

- `plugins/*/skills/*/SKILL.md`
- `pi-packages/*/README.md`
- `pi-packages/*/skills/*/SKILL.md`
- `website/src/data/marketplace.json`

If a change belongs to those files, edit ASM first. This repo only renders that content.

## Repo Shape

```text
engineering-website/
├── src/pages/              Astro routes and page templates
├── src/data/               Structured site content and extraction helpers
├── src/content/blog/       Blog posts and frontmatter
├── src/components/         Shared UI
├── src/layouts/            Page shells
├── src/utils/              Blog, metrics, OG, and content helpers
├── public/                 Static assets, redirects, generated OG images
├── docs/                   Maintainer and harness docs
├── scripts/                ASM checkout + OG generation helpers
├── .github/workflows/      Validate + deploy pipelines
├── site.config.mjs         Site identity, routes, nav, GitHub links
└── agent-skills-source.ref Default ASM SHA for builds
```

## Split-Repo Model

```text
engineering-website
  -> renders and deploys the full site
  -> owns broad pages, blog, layouts, styles, CI/CD

agent-skills-marketplace
  -> owns skill docs, Pi package docs, and catalog metadata
  -> is resolved at build time by this repo
```

See `docs/architecture/overview.md` for the full architecture map and
`docs/route-ownership.md` for the exact route-by-route ownership table.

## Build and Deploy Summary

- Local and CI builds both require an ASM checkout plus a copied `marketplace.json`.
- The main verification command is `npm run build`.
- Social cards are regenerated with `python3 scripts/generate-og-images.py`.
- CI validates builds in `.github/workflows/validate-website.yml`.
- Cloudflare preview and production deploys run from `.github/workflows/deploy-website-cloudflare-pages.yml`.

## Documentation Map

- `AGENTS.md` — canonical agent entrypoint and repo rules
- `docs/maintainer-quickstart.md` — fastest path to the right file
- `docs/local-dev.md` — first-time setup
- `docs/architecture/overview.md` — split-repo model, boundaries, and core flows
- `docs/quality/gates.md` — build gates, CI jobs, and common failures
- `docs/runbooks/development.md` — everyday workflows, OG generation, ASM pinning
- `docs/runbooks/blog-authoring.md` — post schemas, draft review URLs, scheduled posts
- `docs/route-ownership.md` — exact route and workflow ownership
- `docs/content-governance.md` — content scope and source-of-truth rules
- `docs/editing-recipes.md` — direct “change X → edit Y” recipes
- `docs/editorial-workflow.md` — page vs post vs shared-data decisions
