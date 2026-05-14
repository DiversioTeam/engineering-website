# Maintainer Quick-Start

If you need to make a routine change to the engineering site, start here. This guide assumes you've already set up local dev — see `docs/local-dev.md` if not.

## Find the right file

### I need to change...

| Task | File to edit | Notes |
|---|---|---|
| Page copy on `/how-we-work` | `src/pages/how-we-work.astro` | Hero text is at top; data-driven content below uses imports |
| Page copy on `/systems` | `src/pages/systems.astro` | Hero text at top; stack data from `engineering-stack.ts` |
| Page copy on `/community` | `src/pages/community.astro` | Hero text at top; contribution links use `agentSkillsRepoUrl` |
| Page copy on `/` (homepage) | `src/pages/index.astro` | Hero text + sections; featured tools from `agentic-tools.ts` |
| The site name or a nav label | `site.config.mjs` | One place — updates Header, Footer, and all meta tags |
| A section label in the footer | `site.config.mjs` → `navItems` | |
| `/how-we-work` principles | `src/data/engineering-principles.ts` | Array of `{ label, description }` |
| `/how-we-work` practice rows | `src/data/engineering-practices.ts` | Array of `{ title, summary, detail, relatedHref? }` |
| Stack showcase on `/systems` | `src/data/engineering-stack.ts` | Layers with technologies, supporting tools, logos |
| Systems highlights | `src/data/engineering-highlights.ts` | Used by both `/systems` and `/how-we-work` |
| Featured tools on homepage | `src/data/agentic-tools.ts` → `homepageFeaturedPluginSlugs` | Array of plugin slugs |
| Featured tools on `/agentic-tools` | `src/data/agentic-tools.ts` → `toolsPageFeaturedPluginSlugs` | |
| A new blog post | `src/content/blog/<slug>.md` | See `docs/runbooks/blog-authoring.md` for frontmatter schema |
| A review-only draft blog URL | `src/content/blog/<slug>.md` → `draft: true` + `previewToken: ...` | Builds at `/blog/review/<previewToken>/<slug>/` without appearing on `/blog`; token should be lowercase words/ids with hyphen separators |
| A future-dated scheduled post | `src/content/blog/<slug>.md` → future `publishDate` | Builds at normal `/blog/<slug>/`, shows a restricted preview until that date, and stays out of `/blog` until a fresh deploy |
| The AI writing disclaimer block | Blog markdown HTML block | Use the reusable `.ai-disclaimer` snippet documented in `docs/runbooks/blog-authoring.md` |
| Blog ordering / featured post | `src/content/blog/<slug>.md` → `featured: true` | Only one post at a time; logic in `utils/pick-featured-blog-post.ts` |
| Author page content | Derived from blog frontmatter `author.name` | Pages auto-generated from `src/pages/authors/` |
| A shared CTA or route summary | `src/data/site-entry-points.ts` | Reused across homepage, `/how-we-work`, `/community` |
| Adding a stack logo | `public/logos/stack/` + add entry in `engineering-stack.ts` | See asset provenance table in `content-governance.md` |
| Social preview images | Run `python3 scripts/generate-og-images.py` | Regenerates OG PNGs for all routes |

### I need to change Agentic Tools content...

| Task | Repo to edit | File |
|---|---|---|
| A skill's documentation | agent-skills-marketplace | `plugins/<plugin>/skills/<skill>/SKILL.md` |
| A Pi package's docs | agent-skills-marketplace | `pi-packages/<package>/README.md` |
| Catalog metadata (counts, descriptions) | agent-skills-marketplace | `website/src/data/marketplace.json` |
| A plugin's version or category | agent-skills-marketplace | `website/src/data/marketplace.json` |

**After editing ASM content**: the change will appear on the site after an ASM main merge triggers a deploy (or after the `agent-skills-source.ref` lock file is updated to point at the new SHA).

## After any change

```bash
# 1. Sync marketplace.json (always do this first)
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# 2. Build and check
npm run build

# 3. Regenerate OG images if metadata changed
python3 scripts/generate-og-images.py && npm run build
```

## Don't edit these files

| File | Why not |
|---|---|
| `src/data/marketplace.json` | Build artifact — copied from ASM before each build. Edit in ASM instead. |
| `vendor/agent-skills-marketplace/` | CI checkout path — not committed, regenerated each build. |
| `agent-skills-source.ref` | Lock file — update deliberately (see below), not casually. |

## Updating the ASM lock file

When you want the site to pick up new Agentic Tools content without waiting for an ASM push:

```bash
# Point at the latest ASM main:
git -C ../agent-skills-marketplace rev-parse HEAD > agent-skills-source.ref
git add agent-skills-source.ref
git commit -m "pin ASM to $(cat agent-skills-source.ref)"
```

This is reviewed like any other change. The lock file is only the default — ASM-triggered deploys always override it with the merged SHA.

## Where things live (quick map)

```
engineering-website/                  ← you are here
├── src/pages/                        ← page templates (Astro)
├── src/data/                         ← structured content (TS/JSON)
├── src/content/blog/                 ← blog posts (Markdown)
├── src/components/                   ← shared UI components
├── src/layouts/                      ← page shells (BaseLayout, PageLayout, DocsLayout)
├── src/utils/                        ← helper functions
├── public/                           ← static assets (logos, OG images, redirects)
├── docs/                             ← maintainer documentation
├── scripts/                          ← build helpers
├── .github/workflows/                ← CI (validate + deploy)
├── site.config.mjs                   ← site identity (name, URLs, nav)
├── agent-skills-source.ref           ← pinned ASM SHA
└── astro.config.mjs                  ← Astro build config
```

## Related docs

- `docs/local-dev.md` — first-time setup
- `docs/architecture/overview.md` — split-repo model and core code paths
- `docs/quality/gates.md` — build gates, CI jobs, and recurring failures
- `docs/runbooks/development.md` — everyday workflow, OG regeneration, ASM pinning
- `docs/runbooks/blog-authoring.md` — post schema, draft previews, scheduled posts
- `docs/route-ownership.md` — which repo owns each route and workflow
- `docs/content-governance.md` — page scope, blog ordering, stack rules
- `docs/editing-recipes.md` — detailed "change X → edit Y" reference
- `docs/editorial-workflow.md` — page vs post vs shared-data decisions
