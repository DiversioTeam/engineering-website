# Local Development

How to build and run the engineering website on this machine.

## Quick start (first time)

```bash
# 1. Clone the repo
git clone git@github.com:DiversioTeam/engineering-website.git
cd engineering-website

# 2. Install dependencies
npm install --package-lock=false

# 3. Ensure you have an agent-skills-marketplace checkout as a sibling
#    (or set AGENT_SKILLS_REPO_DIR — see below)
git clone git@github.com:DiversioTeam/agent-skills-marketplace.git ../agent-skills-marketplace

# 4. Copy marketplace.json from the ASM checkout
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# 5. Verify it builds, then start the dev server
npm run build       # one-shot production build → dist/
# or:
npm run dev         # dev server at http://localhost:4321 (watches for changes)
```

## Everyday workflow (after setup)

```bash
# Sync marketplace.json (do this once when you start working, or after pulling ASM changes)
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# Build (one-shot verification) or start dev server (live reload):
npm run build
# or:
npm run dev
```

## Source repo resolution

The build needs `agent-skills-marketplace` source files. The site finds them in this order:

| Priority | Path | When it works |
|---|---|---|
| 1 | `AGENT_SKILLS_REPO_DIR` env var | Explicit override — point at any ASM checkout |
| 2 | Current git repo root (has `plugins/` + `pi-packages/`) | Only when running inside the ASM repo itself |
| 3 | `../` (parent directory) | Rare — would need ASM structure in parent |
| 4 | `../agent-skills-marketplace` (sibling checkout) | **This is the normal local path** |
| 5 | `../vendor/agent-skills-marketplace` | Alternative vendored sibling |
| 6 | `vendor/agent-skills-marketplace` | Vendored in-project (what CI uses) |

**The normal local path is #4**: clone ASM as a sibling directory. No network access needed after the initial clone.

**Overriding with an env var**:
```bash
export AGENT_SKILLS_REPO_DIR=/path/to/your/agent-skills-marketplace
npm run build
```

## marketplace.json copy step

`src/data/marketplace.json` is NOT committed to this repo. It is copied from the ASM checkout before each build:

```bash
# Normal local path (sibling checkout):
cp ../agent-skills-marketplace/website/src/data/marketplace.json src/data/marketplace.json

# With AGENT_SKILLS_REPO_DIR:
cp $AGENT_SKILLS_REPO_DIR/website/src/data/marketplace.json src/data/marketplace.json
```

The canonical source is ASM's `website/src/data/marketplace.json`. Never hand-edit the copy in this repo.

## OG image generation

```bash
# Regenerate social preview cards after content/metadata changes
python3 scripts/generate-og-images.py

# Then rebuild to pick up the new images
npm run build
```

The OG script uses the same source-resolution logic as the build. It needs the ASM checkout to find skill/package metadata.

## Network vs offline

| Task | Network needed? |
|---|---|
| `npm run build` (sibling checkout present) | No |
| `npm run dev` (sibling checkout present) | No |
| `npm install` (first time or after package.json changes) | Yes |
| `scripts/generate-og-images.py` (sibling checkout present) | No |
| Syncing marketplace.json (sibling checkout present) | No |
| Updating the sibling ASM checkout (`git pull`) | Yes |
| CI build | Yes (clones both repos) |

Normal local work is offline-first. The only time you need network is `npm install` and `git pull` on the sibling ASM checkout.

## Related docs

- `docs/route-ownership.md` — which repo owns each route and workflow
- `docs/maintainer-quickstart.md` — common tasks and which files to edit
- `docs/content-governance.md` — page scope and source-of-truth rules
