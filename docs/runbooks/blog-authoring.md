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
