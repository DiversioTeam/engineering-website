# Blog Authoring Runbook

Blog posts live in `src/content/blog/`. The site supports original posts and
curated reposts through one shared content schema.

## Original Post Example

```yaml
---
title: My Post Title
summary: One-sentence summary
publishDate: 2026-05-04
author:
  name: Author Name
  url: https://github.com/author
tags: [engineering, tooling]
sourceType: original
featured: false
---
```

Use `featured: true` for at most one post at a time.

## Curated Repost Example

```yaml
---
title: Original Article Title
slug: original-slug-from-source
summary: One-sentence description
publishDate: 2025-08-07
author:
  name: Original Author
  url: https://their-site.com
tags: [engineering, django]
sourceType: repost
sourceSiteName: their-site.com
sourceUrl: https://their-site.com/original-post/
canonicalUrl: https://their-site.com/original-post/
---
```

### Repost Rules

| Field | Required | Why |
|---|---|---|
| `sourceType: repost` | Yes | Marks the post as a curated repost |
| `sourceUrl` | Yes | Links readers to the original |
| `canonicalUrl` | Yes | Preserves the original canonical URL |
| `sourceSiteName` | Recommended | Improves blog index context |
| `slug` | Recommended | Keeps URLs predictable |

## Cross-posting with ashwch.com

Use this when the full article should live on `ashwch.com` and this repo should
only carry a curated repost.

### Why this workflow exists

We now have two public writing surfaces:

- `ashwch.com` — Ashwini's personal site
- `engineering.diversio.com` — Diversio's engineering site

A cross-post works best when one place clearly owns the full body.
Otherwise we create drift, link confusion, and duplicate-content problems.

### First-principles rule

For this specific cross-post direction, the rule is:

```text
ashwch.com owns the full article
           ↓
engineering.diversio.com carries a short repost stub
```

### Why we prefer this direction today

- `ashwch.com` already publishes articles at stable `/<slug>.html` URLs
- this repo already has an explicit repost schema and canonical support
- the personal-site repo does **not** currently support repost metadata or
  external canonicals for articles

### Mental model

```text
ashwch.github.io                         engineering-website
-----------------                        -------------------
content/articles/<slug>.md              src/content/blog/<slug>.md
        │                                       │
        │ full article                          │ short repost stub
        ▼                                       ▼
https://ashwch.com/<slug>.html          /blog/<slug>/
on the personal site                    on the engineering site
```

### Workflow when `ashwch.com` is canonical

1. In the personal-site repo, add the full article under:
   - `content/articles/<slug>.md`
2. Add any article assets under:
   - `content/images/articles/<slug>/`
3. In that repo, validate with:
   - `cd site && pnpm check && pnpm build`
4. In this repo, create or convert:
   - `src/content/blog/<slug>.md`
5. Set:
   - `sourceType: repost`
   - `sourceSiteName: ashwch.com`
   - `sourceUrl: https://ashwch.com/<slug>.html`
   - `canonicalUrl: https://ashwch.com/<slug>.html`
6. Keep the body short:
   - “Originally published on ashwch.com”
   - one short excerpt or setup paragraph
   - “Read the full post on ashwch.com →”

### Why the engineering copy should stay short

In this workflow, this repo is not the canonical owner.
The engineering post is meant to help discovery and attribution, not maintain a
second full article body.

That keeps the ownership clear for:

- readers
- search engines
- future editors and LLMs

### Important portability notes

- Use the exact personal-site `.html` URL in `sourceUrl` and `canonicalUrl`
- If you are moving a full article body from this repo into `ashwch.com`, rewrite
  internal article links from `/blog/<slug>/` to `/<slug>.html`
- If that canonical copy links back to engineering docs, prefer absolute URLs
  like `https://engineering.diversio.com/docs/...` instead of local `/docs/...`
- Repost stubs usually should **not** keep `featured: true` unless there is a
  deliberate editorial reason to feature a link-out card

### Minimal repost stub example

```yaml
---
title: Example Title
slug: example-title
summary: One-sentence summary
author:
  name: Ashwini Chaudhary
  url: https://ashwch.com
sourceType: repost
sourceSiteName: ashwch.com
sourceUrl: https://ashwch.com/example-title.html
canonicalUrl: https://ashwch.com/example-title.html
---
```

```md
*This post was originally published on [ashwch.com](https://ashwch.com/example-title.html).*

Short excerpt or setup paragraph.

[Read the full post on ashwch.com →](https://ashwch.com/example-title.html)
```

### Validate the repost locally

From this repo run:

```bash
npm run build
```

Useful spot checks:

```bash
rg -n 'canonical' dist/blog/<slug>/index.html
rg -n 'ashwch.com/<slug>.html' dist/blog/<slug>/index.html
```

Expected result:

- the blog page builds successfully
- the canonical URL points to `https://ashwch.com/<slug>.html`
- the rendered page is clearly a repost, not a second full article copy

### Unsupported reverse direction

If you want the canonical article to stay on `engineering.diversio.com` but also
want a repost/stub on `ashwch.com`, stop and add product/code support in the
personal-site repo first. That repo currently always emits `ashwch.com`
canonicals for articles and does not have a repost content model.

## Draft Review URLs

Use this when a post should stay off `/blog` but still needs a real review URL.

```yaml
---
draft: true
previewToken: some-review-token
---
```

Result:
- the post stays out of `/blog`
- Astro builds `/blog/review/<previewToken>/<slug>/`
- the preview page is marked `noindex, nofollow, noarchive`

Rules:
- `previewToken` should use lowercase letters, numbers, and single hyphen separators only
- this is a review convenience, not authentication

## Scheduled Posts

If a post is not a draft but its `publishDate` is in the future:

- it still gets a normal `/blog/<slug>/` URL
- it stays out of `/blog` and author/archive surfaces until published
- before the publish date, the route shows a restricted preview
- on or after that date, the full article unlocks in the reader's local timezone

Because the site is static, a fresh deploy is still what makes a scheduled post
appear on list surfaces like `/blog` after the date passes.

## Reusable AI Disclaimer Block

Use this HTML block when a post needs a narrow AI-use disclosure:

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

## Validation Workflow

```bash
npm run build
find dist/blog -name '*.html' | sort
```

Useful spot checks:

```bash
rg -n '<title>' dist/blog
rg -n 'canonical' dist/blog
```

## Useful Code References

- `src/content.config.ts` — blog schema validation
- `src/utils/blog-posts.ts` — featured-post guard and collection loading
- `src/utils/sort-blog-posts.ts` — ordering logic
- `src/utils/pick-featured-blog-post.ts` — hero post selection
- `src/pages/blog/` — blog route rendering
