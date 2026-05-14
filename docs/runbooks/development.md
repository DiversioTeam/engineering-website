# Development Runbook

Use `docs/local-dev.md` for first-time setup. Use this file for the everyday
loop once the repo already builds on your machine.

## Everyday Loop

```bash
# 1. Sync the copied marketplace artifact from ASM
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# 2. Build or run the dev server
npm run build
# or
npm run dev
```

Normal local work is offline-first once dependencies are installed and the ASM
sibling checkout already exists.

## If ASM Is Not a Sibling Checkout

Point the repo at any ASM checkout explicitly:

```bash
export AGENT_SKILLS_REPO_DIR=/absolute/path/to/agent-skills-marketplace
cp "$AGENT_SKILLS_REPO_DIR"/website/src/data/marketplace.json src/data/marketplace.json
npm run build
```

## Which Repo To Edit

### Edit this repo when changing:

- Astro pages, layouts, components, and styles
- Broad-site copy and structured data in `src/data/`
- Blog posts in `src/content/blog/`
- Deploy workflows, scripts, or build-time extraction logic

### Edit ASM when changing:

- `plugins/*/skills/*/SKILL.md`
- `pi-packages/*/README.md`
- `pi-packages/*/skills/*/SKILL.md`
- ASM `website/src/data/marketplace.json`

After ASM changes, either wait for the ASM-triggered production deploy path or
update `agent-skills-source.ref` deliberately in this repo.

## Regenerate OG Images

Run this after content or metadata changes that affect social cards:

```bash
python3 scripts/generate-og-images.py
npm run build
```

Useful spot checks:

```bash
rg -n 'og:image|twitter:image' dist/index.html
rg -n 'og:image|twitter:image' dist/docs/*/index.html
rg -n 'og:image|twitter:image' dist/skills/*/index.html
rg -n 'og:image|twitter:image' dist/pi/*/index.html
```

## Simulate CI Locally

If you want the local build path to match CI more closely:

```bash
./scripts/checkout-asm.sh $(cat agent-skills-source.ref)
export AGENT_SKILLS_REPO_DIR=$PWD/vendor/agent-skills-marketplace
cp vendor/agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json
npm install --package-lock=false
npm run build
```

That mirrors the CI pattern of checking out ASM at the pinned SHA into
`vendor/agent-skills-marketplace`.

## Update the ASM Lock File

Use this when you want the website repo to build against a newer default ASM SHA
without waiting for the next ASM-triggered deploy.

```bash
git -C ../agent-skills-marketplace rev-parse HEAD > agent-skills-source.ref
git add agent-skills-source.ref
git commit -m "pin ASM to $(cat agent-skills-source.ref)"
```

Treat that as a normal reviewed change. ASM `repository_dispatch` deploys still
override the lock file with the exact merged SHA from ASM.

## Inspect Built Output Quickly

```bash
find dist -maxdepth 3 -name 'index.html' | sort | head -n 40
rg -n '/agentic-tools|/blog|/skills|/pi' dist
```

For blog-specific workflows and frontmatter patterns, see
`docs/runbooks/blog-authoring.md`.
