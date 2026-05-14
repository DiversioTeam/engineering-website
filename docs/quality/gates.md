# Quality Gates

This repo does not currently have separate lint, unit-test, or dedicated type-check
wrapper commands. The primary gate is a clean Astro production build with the
correct ASM inputs present.

## Required Commands

```bash
# Sync the copied marketplace artifact from ASM
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# Install dependencies when package.json changes or on first setup
npm install --package-lock=false

# Main verification gate
npm run build

# When metadata or page titles/descriptions affect social cards
python3 scripts/generate-og-images.py && npm run build

# Optional: simulate CI's pinned ASM checkout locally
./scripts/checkout-asm.sh $(cat agent-skills-source.ref)
```

## Active Type Gate

- There is no separate `ty`, `pyright`, or `mypy` gate in this repo.
- The effective gate is `npm run build`, because Astro compilation catches route,
  import, schema, and many TypeScript/content errors during static generation.
- CI runs the same build with Node 24, so local success should be measured
  against that exact command path.

## Golden Rules

- Never hand-edit `src/data/marketplace.json`.
- Edit Agentic Tools docs in ASM, not in this repo.
- Keep only one `featured: true` blog post at a time.
- Add every new systems lane to `engineeringHighlightLaneOrder`.
- Keep `agentSkillsRepoUrl` pointed at ASM so `/community` contribution links stay correct.

## Common Failures

- Missing `src/data/marketplace.json`
  - Copy it from the ASM checkout before building.
- Build cannot find ASM source docs
  - Set `AGENT_SKILLS_REPO_DIR` or keep ASM as `../agent-skills-marketplace`.
- Multiple featured blog posts
  - Fix the frontmatter so only one post has `featured: true`.
- Added a new systems lane but forgot the canonical order list
  - Update `engineeringHighlightLaneOrder` in `src/data/engineering-highlights.ts`.
- Updated metadata but social cards look stale
  - Re-run `python3 scripts/generate-og-images.py` and rebuild.
- Changed docs that are actually source-owned by ASM
  - Move the edit to ASM and then rebuild this repo against the new SHA/content.

## CI Notes

- Workflow: `.github/workflows/validate-website.yml`
  - Job: `build-website`
  - Verifies: checkout this repo, read `agent-skills-source.ref`, checkout ASM at that SHA, copy `marketplace.json`, install dependencies, run `npm run build`
- Workflow: `.github/workflows/deploy-website-cloudflare-pages.yml`
  - Job: `deploy-preview`
  - Verifies/builds: same build path, then deploys preview output to Cloudflare Pages for same-repo PRs or manual preview runs
  - Job: `deploy-production`
  - Verifies/builds: same build path, then deploys production from `main` or ASM `repository_dispatch`

## Environment And Runtime Expectations

- Local Node version must satisfy `>=22.12.0`.
- CI currently uses Node 24.
- Preview and production deploys require `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- `CLOUDFLARE_PAGES_PROJECT` defaults to `diversio-engineering` when unset.

## Current Harness Gap

The build is the main safety net today. If recurring failures start clustering
around a specific workflow, add a wrapper command, a focused doc, or a new CI
check rather than relying on tribal memory.
