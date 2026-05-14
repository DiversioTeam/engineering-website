#!/usr/bin/env bash
# checkout-asm.sh — Check out agent-skills-marketplace at a given SHA.
#
# Why this script exists:
#   The website build needs agent-skills-marketplace source files (SKILL.md,
#   README.md, marketplace.json) at build time. CI uses actions/checkout for
#   this, but local developers and manual workflows need the same capability.
#   This script replicates the CI checkout behavior locally.
#
# What it does, step by step:
#   1. Clone agent-skills-marketplace (shallow, depth 1) — fast, minimal fetch.
#   2. Fetch the specific SHA — --branch only works with named refs, not SHAs,
#      so we fetch the exact commit after the initial clone.
#   3. Checkout FETCH_HEAD — puts the working tree at the exact requested SHA.
#   4. Validate plugins/ and pi-packages/ exist — fail early if the checkout
#      is missing expected directories rather than failing mysteriously later.
#
# Usage:
#   ./scripts/checkout-asm.sh <sha> [target-directory]
#
#   Default target: vendor/agent-skills-marketplace
#
# Examples:
#   # Check out a specific SHA into the default vendor path:
#   ./scripts/checkout-asm.sh abc123def456
#
#   # Check out into a custom directory:
#   ./scripts/checkout-asm.sh abc123def456 /tmp/asm-checkout
#
#   # Read SHA from lock file (local CI simulation):
#   ./scripts/checkout-asm.sh $(cat agent-skills-source.ref)
#
# Used by: local dev, manual CI simulation
# Related: .github/workflows/validate-website.yml, deploy-website-cloudflare-pages.yml
set -euo pipefail

SHA="${1:-}"
TARGET="${2:-vendor/agent-skills-marketplace}"

if [[ -z "${SHA}" ]]; then
  echo "Usage: $0 <sha> [target-directory]" >&2
  echo "Example: $0 abc123def vendor/agent-skills-marketplace" >&2
  exit 1
fi

echo "Checking out agent-skills-marketplace at ${SHA} into ${TARGET}..."

# Step 1: Shallow clone (depth 1) for speed. We don't need ASM's full git
# history — just the source files at a specific point in time.
if [[ -d "${TARGET}" ]]; then
  rm -rf "${TARGET}"
fi

git clone --depth 1 \
  https://github.com/DiversioTeam/agent-skills-marketplace.git \
  "${TARGET}" 2>&1 || {
  echo "ERROR: Failed to clone agent-skills-marketplace" >&2
  exit 1
}

# Step 2: Fetch the specific SHA. git clone --branch only works with named
# refs (branches/tags), not raw SHAs. We fetch the exact commit separately.
git -C "${TARGET}" fetch --depth 1 origin "${SHA}" 2>&1 || {
  echo "ERROR: Failed to fetch SHA ${SHA} from agent-skills-marketplace" >&2
  exit 1
}

# Step 3: Checkout the fetched commit. FETCH_HEAD points to whatever the
# last fetch retrieved — which is our requested SHA.
git -C "${TARGET}" checkout FETCH_HEAD 2>&1 || {
  echo "ERROR: Failed to checkout SHA ${SHA}" >&2
  exit 1
}

# Step 4: Validate the checkout has the expected content. If plugins/ or
# pi-packages/ are missing, the SHA might be wrong or the repo structure
# changed. Fail loudly here rather than silently producing a broken build.
if [[ ! -d "${TARGET}/plugins" ]]; then
  echo "ERROR: Checkout at ${TARGET} is missing plugins/ directory" >&2
  exit 1
fi

if [[ ! -d "${TARGET}/pi-packages" ]]; then
  echo "ERROR: Checkout at ${TARGET} is missing pi-packages/ directory" >&2
  exit 1
fi

echo "Checkout validated: plugins/ and pi-packages/ present."
echo "Done."
