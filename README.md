# Diversio Engineering Website

Astro static site for the Diversio Engineering hub at [engineering.diversio.com](https://engineering.diversio.com).

This README is for maintainers of the **website code**, not just visitors of the
site.

## Quick Start

Before making content or structure changes, read the maintainer docs:

| Doc | Read when... |
|---|---|
| `docs/maintainer-quickstart.md` | You need to make a change and want the fastest path |
| `docs/local-dev.md` | Setting up this repo for the first time |
| `docs/route-ownership.md` | You're unsure which repo owns a route or workflow |
| `docs/content-governance.md` | You need page scope, blog ordering, or stack asset rules |
| `docs/editing-recipes.md` | You know what to change and need the exact file |
| `docs/editorial-workflow.md` | You're deciding between a page edit, shared data, or a blog post |


```bash
npm install
npm run dev      # local dev at http://localhost:4321
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

Node requirement: Astro 6 in this site currently needs Node `>=22.12.0`.

## Source Repo Resolution

The website reads tool docs and metadata from an `agent-skills-marketplace` checkout.

Current local-resolution order is:
1. `AGENT_SKILLS_REPO_DIR`
2. the current git repo root when it contains `plugins/` and `pi-packages/`
3. `../agent-skills-marketplace`
4. `../vendor/agent-skills-marketplace`
5. `./vendor/agent-skills-marketplace`

If local builds cannot find the tool source repo, set:

```bash
export AGENT_SKILLS_REPO_DIR=/absolute/path/to/agent-skills-marketplace
```

This applies to both:
- the Astro build/extraction path
- `scripts/generate-og-images.py`

## The Big Idea

This site is built and deployed from a single repo but its content comes from two:

```text
                        engineering.diversio.com
                                 │
                   ┌─────────────┴─────────────┐
                   │    engineering-website     │  ← builds & deploys everything
                   │   (this repo)              │
                   └─────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     Broad pages          Blog content       Agentic Tools pages
     /                    /blog/*            /agentic-tools
     /how-we-work         /authors/*         /registry
     /systems                                /docs/*
     /community                              /skills/*
     /security                               /pi/*
     /terms
     /404
                                             ▲
                              ┌──────────────┴──────────────┐
                              │  agent-skills-marketplace    │  ← source of truth
                              │  (separate repo)             │     for tool docs
                              └─────────────────────────────┘
```

**Why two repos?** The Agentic Tools documentation (skill definitions, package READMEs, catalog metadata) is the canonical source of truth and lives in `agent-skills-marketplace` alongside the tools themselves. The broader engineering site — how-we-work, systems, blog, community — lives here. At build time, this repo resolves tool content from an `agent-skills-marketplace` checkout at a pinned SHA.

See `docs/route-ownership.md` for the full table of which repo owns each route.

### 1. Hub
The homepage explains the whole engineering site and routes readers toward the right surface.

Primary routes:
- `/`

### 2. Engineering practice and systems
These pages explain how Diversio Engineering works, what standards shape the work, and how stack and workflow decisions fit together.

Primary routes:
- `/how-we-work`
- `/systems`

### 3. Agentic Tools
These pages explain the open tools surface, the package registry, and the deeper docs for plugins, skills, and Pi packages.

Primary routes:
- `/agentic-tools`
- `/registry`
- `/docs/*`
- `/skills/*`
- `/pi/*`

### 4. Editorial and community
These pages carry the publication layer and the broader ways people can follow, engage with, and contribute to the work.

Primary routes:
- `/blog`
- `/blog/*`
- `/authors/*`
- `/community`

A good maintenance rule: when a change feels like it belongs to two page families, stop and reread `docs/content-governance.md` and `docs/editorial-workflow.md` before editing both.

## Blog Content Model

Blog posts live as markdown files under `src/content/blog/`. The site supports
two kinds of posts that share one schema and one list page.

### Original posts

Written for this site. The canonical URL stays on engineering.diversio.com.

```yaml
---
title: My Post Title
summary: One-sentence summary
publishDate: 2026-05-04
author:
  name: Author Name
  url: https://github.com/author        # optional
tags: [engineering, tooling]
sourceType: original
featured: false                  # optional; set true to pin on hero surfaces
---

Post body in markdown.
```

### Curated reposts

Originally published elsewhere. The canonical URL and source URL must point to
the original so search engines attribute correctly and readers can find the
full article.

```yaml
---
title: Original Article Title
slug: original-slug-from-source
summary: One-sentence description
publishDate: 2025-08-07        # original publication date
author:
  name: Original Author
  url: https://their-site.com
tags: [engineering, django]
sourceType: repost
sourceSiteName: their-site.com
sourceUrl: https://their-site.com/original-post/
canonicalUrl: https://their-site.com/original-post/
---

*This post was originally published on [their-site.com](https://their-site.com/original-post/).*

Brief context or excerpt here.

[Read the full post on their-site.com](https://their-site.com/original-post/)
```

### Repost rules

| Field | Required for reposts | Why |
|---|---|---|
| `sourceType: repost` | Yes | Tells the page to show "Curated repost" label and source box |
| `sourceUrl` | Yes | Links readers to the original |
| `canonicalUrl` | Yes | Search engines see this as the authoritative URL |
| `sourceSiteName` | Recommended | Shown on the blog index as "Source: example.com" |
| `slug` | Recommended | Match the original slug so URLs are predictable |
| `publishDate` | Recommended | Use the original publish date so the timeline is honest |

### Draft review URLs

Unpublished posts can be shared privately for review without appearing on `/blog`.

Add this frontmatter to a draft post:

```yaml
---
draft: true
previewToken: some-review-token
---
```

Rules:
- `previewToken` only works on draft posts
- it should use lowercase letters, numbers, and single hyphen separators only
- it should contain real words or ids, not placeholder punctuation like `--------`
- the preview route is built at:
  - `/blog/review/<previewToken>/<slug>/`
- preview pages are marked `noindex, nofollow, noarchive`

Example:

```text
/blog/review/ac-review-2026-05-review/autonomous-code-reviews/
```

### Scheduled posts (future publish dates)

If a post is **not** a draft but its `publishDate` is in the future:

- it still gets a normal article URL at `/blog/<slug>/`
- it stays out of `/blog` and author/archive surfaces until the build sees it as published
- before the publish date, the article page shows a **restricted preview**
- on or after that date, the page unlocks the full article in the viewer's **local timezone**

First-principles behavior:
- drafts are private review workflows
- scheduled posts are public URLs that should not look fully published too early
- list surfaces are still static, so a fresh deploy is what makes a scheduled post appear in `/blog`

Use this when you want a public URL to exist in advance, but you do not want the full article to appear early.

### Reusable AI writing disclaimer

Use this HTML block at the end of posts when you want the disclaimer to render as subtext rather than normal article content:

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

Why this is HTML instead of plain markdown:
- it keeps the disclaimer visually separate from the article body
- it gives us one reusable class name for styling across all blog posts
- the content can vary per article while the presentation stays consistent

### Commands for managing posts

```bash
# Add a new repost markdown file
$EDITOR src/content/blog/repost-some-post.md

# Regenerate social preview cards (blog posts get their own OG images)
python3 scripts/generate-og-images.py

# Rebuild and check
npm run build
find dist/blog -name '*.html' | sort

# Check a specific repost page
curl -s http://localhost:4321/blog/some-slug/ | rg '<title>'
```

### How the blog pages use repost metadata

```text
frontmatter.sourceType = "repost"
  -> blog index shows "Curated repost" label instead of "Original post"
  -> detail page shows source note box with sourceUrl and canonicalUrl
  -> detail page sets og:url to the original canonical URL for SEO

frontmatter.sourceType = "original"
  -> blog index shows "Original post" label
  -> detail page does not show source note box
  -> canonical URL defaults to the engineering site URL
```

## First-Principles Mental Model

```text
marketplace.json
  -> cards, counts, registry summaries

engineering-principles.ts
  -> how-we-work principles

engineering-highlights.ts
  -> systems examples and lane ordering

engineering-stack.ts
  -> stack layers, logos, supporting tools

site-entry-points.ts
  -> shared route summaries and CTA wording

plugins/*/skills/*/SKILL.md
pi-packages/*/skills/*/SKILL.md
pi-packages/*/README.md
  -> real human-authored source docs

src/data/site-docs.ts
  -> build-time extraction layer

/skills/* and /pi/*
  -> readable website pages built from the real repo docs
```

Why this shape works

Because the repo already has a source of truth.
We do **not** want a second website-only documentation schema that drifts.

## Source of Truth by Page Type

| Website surface | Source of truth | Why |
|---|---|---|
| Shared site name, primary hostname, nav routes | `site.config.mjs` | one place for public brand/domain strings |
| Homepage counts, registry cards, package summaries | `src/data/marketplace.json` | stable catalog metadata |
| `/how-we-work` principles | `src/data/engineering-principles.ts` | principles change more slowly and should stay separate from examples |
| `/how-we-work` practice rows | `src/data/engineering-practices.ts` | concrete engineering habits now live outside page markup for easier maintenance |
| `/how-we-work` featured example selection | `src/data/how-we-work.ts` | page-specific featured highlight slugs stay out of template code |
| `/systems` and shared example rows | `src/data/engineering-highlights.ts` | manual summaries are easier to review than build-time aggregation |
| Stack showcase | `src/data/engineering-stack.ts` | stack layers, logos, and supporting tools stay in one place |
| Reused route/entry-point summaries | `src/data/site-entry-points.ts` | shared directional copy stays consistent across top-level pages |
| Tool-section featured plugin curation | `src/data/agentic-tools.ts` | homepage and tools-section featured plugin choices stay out of page templates |
| Shared broad-site counts | `src/utils/site-metrics.ts` | homepage/community-style counts stay consistent instead of drifting by page |
| Individual plugin skill pages | `plugins/*/skills/*/SKILL.md` | the skill itself is the canonical behavior |
| Pi-local skill pages | `pi-packages/*/skills/*/SKILL.md` | same reason: skill behavior lives in markdown |
| Pi extension pages | `pi-packages/*/README.md` | commands/tools/env vars already live there |
| Blog posts and repost metadata | `src/content/blog/*` + `src/content.config.ts` | explicit editorial schema with reviewable markdown |
| Contributor grid | git history via `src/data/contributors.ts` | community data should age with the repo |

## Project Structure

```text
├── astro.config.mjs
├── package.json
├── site.config.mjs
├── tsconfig.json
├── README.md
├── docs/
│   ├── content-governance.md
│   ├── editing-recipes.md
│   └── editorial-workflow.md
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── og/
│   ├── diversio-logo.svg
│   ├── favicon.svg
│   └── og-default.png
├── scripts/
│   └── generate-og-images.py
└── src/
    ├── styles/
    │   └── global.css
    ├── layouts/
    │   ├── BaseLayout.astro
    │   ├── PageLayout.astro
    │   └── DocsLayout.astro
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── Terminal.astro
    │   ├── CodeBlock.astro
    │   ├── RuntimeCodeTabs.astro
    │   ├── Card.astro
    │   ├── CardGrid.astro
    │   ├── DataTable.astro
    │   ├── FeatureList.astro
    │   ├── SectionHeader.astro
    │   ├── Tag.astro
    │   └── Button.astro
    ├── content/
    │   └── blog/
    ├── content.config.ts
    ├── data/
    │   ├── marketplace.json
    │   ├── site-docs.ts
    │   ├── engineering-principles.ts
    │   ├── engineering-practices.ts
    │   ├── how-we-work.ts
    │   ├── engineering-highlights.ts
    │   ├── engineering-stack.ts
    │   ├── site-entry-points.ts
    │   ├── agentic-tools.ts
    │   └── contributors.ts
    ├── utils/
    │   ├── blog-posts.ts
    │   ├── engineering-content.ts
    │   ├── marketplace-content.ts
    │   ├── pick-featured-blog-post.ts
    │   ├── sort-blog-posts.ts
    │   └── site-metrics.ts
    └── pages/
        ├── index.astro
        ├── how-we-work.astro
        ├── systems.astro
        ├── agentic-tools.astro
        ├── registry.astro
        ├── community.astro
        ├── security.astro
        ├── terms.astro
        ├── 404.astro
        ├── docs/
        │   ├── index.astro
        │   ├── [...slug].astro
        │   └── monty-code-review.astro
        ├── skills/
        │   ├── index.astro
        │   └── [skill].astro
        ├── pi/
        │   ├── index.astro
        │   └── [package].astro
        └── blog/
            ├── index.astro
            └── [slug].astro
```

## Maintainer Docs Map

Keep the detailed rules in the dedicated docs instead of copying them everywhere:

- `docs/content-governance.md`
  - page scope
  - content ownership
  - stack asset provenance
  - blog ordering rules
- `docs/editing-recipes.md`
  - common "change X → edit Y" tasks
- `docs/editorial-workflow.md`
  - judgment calls about page vs post vs shared-data changes

Rule of thumb:
- use this README for orientation
- use `content-governance.md` for structure and ownership decisions
- use `editing-recipes.md` when you already know what you want to change

## Why the New Files Exist

### `src/data/site-docs.ts`

This is the **bridge** between repo docs and website pages.

It exists because:

- plugin pages answer “what bundle is this?”
- skill pages need to answer “what does this one skill do?”
- Pi package pages need to answer “what is the extension surface?”

It intentionally does **simple extraction**, not clever parsing.

That simplicity is intentional.

If something breaks, a future maintainer should be able to read the file and say:

> “Okay, we read headings, bullets, code fences, and a few README table sections.
> I understand why this page rendered the way it did.”

### `src/components/RuntimeCodeTabs.astro`

This component exists because install/invoke examples are only useful if the
copy button matches the runtime the user is looking at.

Old approach:

```text
# Claude Code
...
# Codex
...
```

Problem: the user copies both blocks together.

New approach:

```text
[Claude Code] [Codex]   (inside the dark code header)
<only one code sample visible>
```

Why the toggle lives inside the black code header:

- it visually replaces the old `bash` label
- it keeps the runtime choice attached to the code itself
- the copy button can always copy the active tab only

### `src/data/contributors.ts`

This file exists because contributor lists should come from git history when
possible.

It keeps the logic simple:

- ask git for author history
- ignore obvious bots
- merge known human aliases
- infer GitHub profiles from noreply addresses when possible
- fall back to a small static list if git metadata is unavailable

### `site.config.mjs`

This file is the **single source of truth for site identity**.

It exists because the rebrand touched several things at once:

- site name
- primary hostname
- top-level nav labels
- top-level route names

Without a shared config file, those strings drift into layouts, headers,
footers, metadata, and docs.

Mental model:

```text
page copy          -> explains the content on one page
site.config.mjs    -> explains what the site is called and where sections live
```

If a future change renames a section or moves a top-level route, start there.

### `src/content.config.ts`

This file defines the **editorial contract** for blog content.

It exists because original posts and curated reposts have different rules.

```text
original post
  -> can be owned entirely by this site

repost
  -> must keep source attribution
  -> must keep canonical URL information
```

That is why reposts are validated more strictly than original posts.

### `public/_redirects`

This file exists to preserve **human entrypoints** after the site rebrand.

It handles simple aliases such as:

```text
/marketplace               -> /agentic-tools
/tools                     -> /agentic-tools
/agent-skills-marketplace  -> /agentic-tools
```

Why keep the rules exact instead of using broad wildcards?

- the tools landing page moved
- the deep docs routes mostly did not
- exact aliases are easier to reason about and harder to misconfigure

### `.github/workflows/deploy-website-cloudflare-pages.yml`

This workflow exists so deployment stays **repo-owned and repeatable**.

Mental model:

```text
GitHub Actions
  -> install dependencies
  -> build dist
  -> upload the finished static output to Cloudflare Pages
```

Why not rely on an opaque remote build only?

- build logs stay in GitHub where the change happened
- the same build command runs locally and in CI
- deployment is easier to audit when the upload step is explicit

## How Deep Docs Get Built

### Skill pages

Plugin skill pages come from:

```text
plugins/<plugin>/skills/<skill>/SKILL.md
plugins/<plugin>/commands/*.md
```

The page uses:

- SKILL frontmatter for name / description / allowed tools
- markdown sections for skimmable summaries
- command wrappers to infer the related slash commands
- `references/` and `scripts/` directories for resource listings

### Pi extension pages

Pi package pages come from:

```text
pi-packages/<package>/README.md
pi-packages/<package>/skills/*/SKILL.md
pi-packages/<package>/extensions/*
```

The page uses the README for:

- commands
- LLM tools
- environment variables
- UI shortcuts
- install / local test snippets
- first-principles sections like “What it does”, “Why this package exists”, etc.

That means:

> if you want a better `/pi/<package>` page, usually the right first fix is to
> improve the package README.

## Practical Maintainer Workflows

### 1. You changed a plugin skill

Edit the real skill docs first:

```bash
# examples
plugins/frontend/skills/frontend/SKILL.md
plugins/monty-code-review/skills/monty-code-review/SKILL.md
```

Then rebuild and check the generated site pages:

```bash

npm run build
npm run dev
```

Open:

- `http://localhost:4321/skills`
- `http://localhost:4321/skills/<skill-name>`
- the parent plugin page at `http://localhost:4321/docs/<plugin-name>`

### 2. You changed a Pi package README or extension surface

Edit the real package docs first:

```bash
# examples
pi-packages/ci-status/README.md
pi-packages/dev-workflow/README.md
pi-packages/image-router/README.md
```

Then rebuild and inspect:

- `http://localhost:4321/pi`
- `http://localhost:4321/pi/<package-name>`
- the package summary page at `http://localhost:4321/docs/<package-name>`

### 3. You added a new skill or package and the website looks wrong

Think in this order:

1. **Did I update the source docs?**
   - `SKILL.md`
   - Pi package `README.md`
2. **Did I update catalog metadata?**
   - `src/data/marketplace.json`
3. **Does the extractor understand the doc shape I used?**
   - `src/data/site-docs.ts`

That order matters.

Do not start by patching the final page template if the real docs are missing.

### 4. You added or edited blog content

The blog now supports two content types:

```text
sourceType: original   -> written for this site
sourceType: repost     -> mirrored/curated content with source attribution
```

A minimal original post looks like this:

```md
---
title: Example post
summary: Short summary for cards and metadata.
publishDate: 2026-05-03
author:
  name: Diversio Engineering
sourceType: original
---

Hello world.
```

A repost must carry more metadata:

```md
---
title: Example repost
summary: Why this external piece matters here.
publishDate: 2026-05-03
author:
  name: Original Author
sourceType: repost
sourceSiteName: Example Site
sourceUrl: https://example.com/post
canonicalUrl: https://example.com/post
---
```

That extra metadata is not optional ceremony. It exists so future readers and
social crawlers can tell where the piece came from.

## Commands Worth Remembering

### Rebuild the site

```bash

npm run build
```

### Run the local dev server

```bash

npm run dev
```

### Check the repo sources that feed the site

```bash
cd ..
find plugins -path '*/skills/*/SKILL.md' | sort
find pi-packages -path '*/skills/*/SKILL.md' | sort
find pi-packages -name README.md | sort
```

### Inspect the built output quickly

```bash

rg -n '/skills/|/pi/' dist
```

## Route Guide

For page scope and ownership rules, prefer `docs/content-governance.md`.

Quick classification only:

- Top-level hub/editorial pages: `/`, `/how-we-work`, `/systems`, `/agentic-tools`, `/blog`, `/community`
- Bundle-level pages: `/docs/<plugin-or-package>`, `/registry`
- Deep docs pages: `/skills/<skill>`, `/pi/<package>`, `/blog/<slug>`

## Social Sharing Metadata

Every page now renders the metadata needed for share previews on Open Graph and
X/Twitter consumers.

That includes:

- canonical URL
- page title
- page description
- absolute social image URL
- image alt text
- Open Graph tags used by Slack, Facebook, LinkedIn, and similar clients
- X/Twitter card tags

The logic lives in:

- `site.config.mjs`
- `src/layouts/BaseLayout.astro`

First principles:

- page content owns the page title and description
- the layout turns that into share metadata for every route
- the fallback social image is shared, but the page title/description stay route-specific

If a future page needs a custom share image or article-style metadata, extend
`BaseLayout.astro` props instead of hardcoding tags in a single page.

The site now supports route-specific static OG images for the main public page types:

```text
public/og/home.png
public/og/agentic-tools.png
public/og/docs-*.png
public/og/skill-*.png
public/og/pi-*.png
public/og/blog-*.png
...
```

Those images are generated by:

```bash
python3 scripts/generate-og-images.py
```

Why generate them ahead of time?

- shared links should look specific to the page being shared
- crawlers like Slack and X fetch static assets more reliably than dynamic ones
- design tweaks can be made in one script and regenerated consistently

A few examples:

```text
/                       -> /og/home.png
/agentic-tools          -> /og/agentic-tools.png
/docs/dev-workflow      -> /og/docs-dev-workflow.png
/skills/dev-workflow    -> /og/skill-dev-workflow.png
/pi/dev-workflow        -> /og/pi-dev-workflow.png
/blog/my-post           -> /og/blog-my-post.png
```

The page code does not hardcode file existence checks by hand. Instead, routes
use `src/utils/og-image.ts` to ask for the image that matches their route type
and fall back cleanly when a generated asset is missing.

Typical workflow:

```bash
# 1. Change metadata or copy that affects a social card
$EDITOR src/data/marketplace.json
$EDITOR src/content/blog/*.md

# 2. Regenerate the PNG assets
python3 scripts/generate-og-images.py

# 3. Rebuild the site and spot-check a few routes
npm run build
rg -n 'og:image|twitter:image' dist/docs/dev-workflow/index.html
rg -n 'og:image|twitter:image' dist/skills/dev-workflow/index.html
rg -n 'og:image|twitter:image' dist/pi/dev-workflow/index.html
```

## UI Decisions That Are Easy To Miss

### No search button

The header does **not** show a fake search control anymore.

Reason:

- a visible search affordance implies working search
- a dead button is worse than no button

If real static search gets added later, it should come back as a real feature,
not as a placeholder.

### Runtime toggles live inside the black code header

Reason:

- the runtime is part of the code sample, not a separate page control
- the copy button should copy the active runtime only
- the user should not have to visually stitch together two distant controls

### Contributor cards exclude bots

Reason:

- the community page is meant to show humans behind the repo
- git history still drives the data, but the display layer intentionally filters bot identities

## Known Build Notes

At the moment there are no intentionally accepted build warnings in the website
itself. If Astro starts warning again, treat that as a fresh issue to inspect,
not as normal background noise.

## Deployment

The site deploys to Cloudflare Pages at `engineering.diversio.com`.

### Build pipeline

```text
  ┌─────────────────────────────────────────────────────────┐
  │                    Every build                           │
  │                                                         │
  │  1. Checkout THIS repo (engineering-website)            │
  │  2. Read agent-skills-source.ref → ASM SHA              │
  │  3. Checkout agent-skills-marketplace at that SHA       │
  │     into vendor/agent-skills-marketplace                 │
  │  4. Copy marketplace.json from ASM checkout              │
  │     cp vendor/.../marketplace.json src/data/            │
  │  5. npm install && npm run build                        │
  │  6. (deploy workflow only) wrangler pages deploy dist/  │
  └─────────────────────────────────────────────────────────┘

  ┌─ Where the ASM SHA comes from ──────────────────────────┐
  │                                                         │
  │  PR preview / push to main:                             │
  │    → reads agent-skills-source.ref (tracked lock file)  │
  │                                                         │
  │  repository_dispatch from ASM (production only):        │
  │    → uses the exact SHA from the dispatch payload       │
  │      (overrides the lock file)                          │
  └─────────────────────────────────────────────────────────┘
```

### The lock file (`agent-skills-source.ref`)

This file pins the default ASM version used for builds. It lives at the repo root and contains a single 40-character git SHA.

**How to update it**:
```bash
# 1. Find the SHA you want to pin (e.g., latest ASM main):
git -C ../agent-skills-marketplace rev-parse HEAD > agent-skills-source.ref

# 2. Commit and push — the change is reviewed like any other PR.
git add agent-skills-source.ref && git commit -m "pin ASM to <sha>"
```

**When to update**: when you want the site to pick up new Agentic Tools content (new skills, updated docs, catalog changes) without waiting for an ASM push to trigger a deploy. The dispatch from ASM always overrides the lock file with the merged SHA, so the lock file is only the default — it doesn't block ASM-triggered deploys.

### Local dev (offline-first, using sibling ASM checkout)
```bash
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json
npm install --package-lock=false
npm run build
```

### CI workflows
- `.github/workflows/validate-website.yml` — read-only build gate for PRs
- `.github/workflows/deploy-website-cloudflare-pages.yml` — preview + production deploy

### Trigger from agent-skills-marketplace
- Merges to `agent-skills-marketplace/main` dispatch a `repository_dispatch` event to this repo.
- The ASM workflow (`.github/workflows/trigger-engineering-website-deploy.yml`) sends the exact merged SHA.
- Production deploys use that SHA instead of the lock file.
- Cross-repo trigger is main-only — no preview deploys from ASM PRs.

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional GitHub repo variable:

- `CLOUDFLARE_PAGES_PROJECT` (defaults to `diversio-engineering` in the workflow)

Recommended settings:

| Setting | Value |
|---|---|
| Pages project name | `diversio-engineering` |
| Deploy path | `dist` |
| Production branch | `main` |
| Node.js version | 24 |

### Local deploy-minded checks

Before you trust CI, run the same core steps locally:

```bash
npm install --package-lock=false
npm run build
```

Then sanity-check the output:

```bash
rg -n '/agentic-tools|/blog|/skills|/pi' dist
```

### What preview vs production means here

```text
pull request from this repo
  -> preview deployment on Cloudflare Pages

push to main
  -> production deployment on Cloudflare Pages

manual workflow_dispatch run
  -> preview from any selected ref
  -> production only when dispatched from main
```

This split exists for a simple reason: reviewers need a safe preview URL, while
production should only change after merge. Manual dispatch still exists so the
team can re-run a preview or production deploy without manufacturing a new code
change, but the workflow guards against deploying a feature-branch build to the
production Pages branch.

The canonical site URL is:

- `https://engineering.diversio.com`

## Branding Notes

The site uses real Diversio branding assets:

- `public/diversio-logo.svg`
- `public/favicon.svg`
- `public/og-default.png`

Header, footer, hero, favicon, and OG metadata all use this branding layer.

## What To Update When You Change The Website Architecture

If you add or remove a major route family, data source, or doc surface, update:

1. this `README.md`
2. `src/pages/docs/index.astro`
3. any affected registry or homepage navigation

That keeps the website code understandable for the next person, not just functional today.
