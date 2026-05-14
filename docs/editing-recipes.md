# Editing Recipes

Use this guide when you already know *what* you want to change and just need to know *where* to do it.

For broader page-scope and ownership rules, read `docs/content-governance.md` first.
For which repo owns each route, see `docs/route-ownership.md`.
If you are not sure whether the change should be a page edit, shared-data edit, or blog post, read `docs/editorial-workflow.md` too.

## Change `/how-we-work` notice copy or featured examples

Edit:
- `src/data/how-we-work.ts`

Use this for:
- the notice block near the `/how-we-work` hero
- which highlights appear in the `/how-we-work` examples section

Only edit `src/pages/how-we-work.astro` if the page structure itself needs to change.

## Fix a local build that cannot find the tool source repo

Set:

```bash
export AGENT_SKILLS_REPO_DIR=/absolute/path/to/agent-skills-marketplace
```

Use this when:
- `src/data/site-docs.ts` cannot find `plugins/` or `pi-packages/`
- `website/scripts/generate-og-images.py` cannot find the source repo
- you are working from a split-repo or vendored-checkout setup

## Change homepage or community stats/counts

Edit:
- `src/utils/site-metrics.ts`

Use this for:
- shared site-wide counts
- homepage summary metrics
- community broad-surface metrics

Do **not** add page-local metric logic in multiple places if the count is supposed to mean the same thing everywhere.

## Change homepage route cards or CTA wording

Edit:
- `src/data/site-entry-points.ts`

This affects shared route summaries reused across:
- homepage site map
- `/how-we-work` go-deeper cards
- `/community` engagement cards

## Change `/how-we-work` principles

Edit:
- `src/data/engineering-principles.ts`

Use this for:
- principles
- standards
- higher-level engineering beliefs

Do **not** put page-specific practice rows here.

## Change `/how-we-work` practice rows

Edit:
- `src/data/engineering-practices.ts`

Use this for:
- the concrete working habits in the practices section
- related links for each practice

Only edit `src/pages/how-we-work.astro` if the page structure itself needs to change.

## Change `/how-we-work` featured examples

Edit:
- `src/data/how-we-work.ts`

Use this for:
- which systems highlights appear in the `/how-we-work` examples section

Do **not** edit the page template just to swap featured example slugs.

## Change `/systems` examples or lane ordering

Edit:
- `src/data/engineering-highlights.ts`

Use this for:
- systems highlights
- per-highlight title/summary/proof/link
- canonical lane order

If you add a new lane:
- add it to `engineeringHighlightLaneOrder`
- otherwise the build should fail

## Change homepage or tools-page featured plugin selection

Edit:
- `src/data/agentic-tools.ts`

Use this for:
- homepage featured tools
- `/agentic-tools` featured plugin curation

Do **not** hardcode plugin slug arrays in page templates if the selection is a maintained surface.

## Change the stack showcase

Edit:
- `src/data/engineering-stack.ts`

Use this for:
- stack layers
- titles/summaries/why-it-fits copy
- primary technologies
- supporting tools

Related assets live in:
- `public/logos/stack/`

## Change blog ordering or featured post behavior

Edit content frontmatter in:
- `src/content/blog/*.md`

Relevant fields:
- `publishDate`
- `updatedDate`
- `featured`

Supporting logic lives in:
- `src/utils/blog-posts.ts`
- `src/utils/sort-blog-posts.ts`
- `src/utils/pick-featured-blog-post.ts`

Rule of thumb:
- use `featured: true` for the one post that should lead hero surfaces
- keep at most one featured post at a time
- use full datetime precision in `publishDate` if same-day ordering matters

## Add a new blog post

Create:
- `src/content/blog/<slug>.md`

Then rebuild:

```bash
cd website
npm run build
```

If needed, regenerate OG cards too:

```bash
python3 website/scripts/generate-og-images.py
```

## Create a review-only draft URL for a blog post

Edit:
- `src/content/blog/<slug>.md`

Add frontmatter like:

```yaml
---
draft: true
previewToken: some-review-token
---
```

Result:
- the post stays out of `/blog`
- a private review page is built at:
  - `/blog/review/<previewToken>/<slug>/`

Rules:
- `previewToken` should use lowercase letters, numbers, and single hyphen separators only
- use a real token, not placeholder punctuation like `--------`
- preview pages are for review workflows, not public publishing
- preview pages are marked `noindex, nofollow, noarchive`

## Schedule a blog post for a future publish date

Edit:
- `src/content/blog/<slug>.md`

Set:

```yaml
publishDate: 2026-05-20
```

Behavior:
- the post gets its normal article URL at `/blog/<slug>/`
- the post stays out of `/blog` and author/archive surfaces until it is published
- before that date, the page shows a restricted preview instead of the full article body
- on or after that date, the full article unlocks in the viewer's local timezone

Important static-site note:
- list pages like `/blog` are still generated at build time
- that means a fresh deploy is what makes the post appear in list surfaces after the date passes

## Add the reusable AI writing disclaimer

Use this HTML block at the end of the post body:

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

Why HTML instead of plain markdown?
- it keeps the disclaimer visually separate from the article body
- it gives us one reusable styling hook across all blog posts
- the exact disclaimer copy can still change per article

## Change author archive behavior

Edit:
- `src/pages/authors/index.astro`
- `src/pages/authors/[author].astro`

The source data still comes from:
- `src/content/blog/*`

## Change top navigation, route names, or section labels

Edit:
- `site.config.mjs`

Use this for:
- nav labels
- route strings
- section names like `Agentic Tools`

## Change docs / skills / pi deep-doc content

Canonical sources are:
- `plugins/*/skills/*/SKILL.md`
- `pi-packages/*/skills/*/SKILL.md`
- `pi-packages/*/README.md`

Website extraction layer:
- `src/data/site-docs.ts`

If the website rendering looks wrong:
1. fix the source markdown first
2. only then adjust extraction logic if needed

## Change community-specific lead repo or contribution summary copy

Edit:
- `src/data/community.ts`

Use this for:
- the featured repo block on `/community`
- the short contribution-summary card copy on `/community`

## Change page-local hero framing for `/how-we-work`, `/systems`, or `/community`

Edit:
- `src/pages/how-we-work.astro`
- `src/pages/systems.astro`
- `src/pages/community.astro`

Look for the page-local constants near the top of the file.
Use those for:
- page title
- page meta description
- hero title
- hero description

Keep these local because they are page-specific and should not be forced into shared data unless the same wording is intentionally reused.

## Change community page broader engagement framing

Edit:
- `src/pages/community.astro`

Use this for:
- broader engineering engagement framing
- support/contact paths
- contribution-path structure

Do **not** turn it back into only an Agentic Tools contribution page.

## Quick validation checklist

After most changes:

```bash
cd website
npm run build
```

Then smoke-check the affected routes in the browser.
