---
title: Autonomous code reviews
slug: autonomous-code-reviews
summary: How Diversio Engineering uses agentic review tooling to catch mechanical issues before human reviewers touch the code, keeping reviews focused on design intent rather than style drift.
publishDate: 2026-05-10
author:
  name: Ashwini Chaudhary
tags:
  - engineering
  - code-review
  - ai
  - workflow
sourceType: original
draft: true
previewToken: ac-review-2026-05-review
---

The value of a human code review is highest when the reviewer is thinking about design, coupling, edge cases, and intent. It drops quickly when the reviewer is scanning for tabs-vs-spaces, missing type annotations, or imports that drifted out of order.

We started building autonomous review tooling because we kept burning review attention on the second category. The pattern was predictable: a PR would open, and the first round of feedback was almost entirely mechanical. Whitespace. Naming. A missing guard clause. A pattern that the linter should have caught but didn't because it wasn't configured for that specific repo.

The mechanical feedback was correct and useful. But it shouldn't have consumed a human reviewer's attention to surface it.

## What we automated first

The first wave was narrow. We wanted reviewers to spend time on the hard part of a PR — the part where someone has to understand two systems at once and judge whether the change makes coupling better or worse — without first burning a round on things a machine can check.

The early automation focused on:

- **Linting that follows project conventions, not just language defaults.** Different repos have different rules about import ordering, type annotation strictness, and acceptable patterns for things like Django querysets or Terraform resource naming. A generic linter misses those. A repo-local rule set catches them.
- **Atomicity checks.** A PR that mixes a refactor, a feature, and a version bump in one diff is harder to review than three separate PRs. We started flagging PRs that touched too many unrelated files or combined mechanical changes with behavioral changes.
- **Test presence.** Not "are the tests good" — that's a human judgment. But "does this PR that changes a function also touch a test file?" is a mechanical check that catches a surprising number of oversights.

None of these checks required deep understanding. They required consistent rules applied at the right time — before a human reviewer opened the PR.

## Why autonomous reviews help even when they get things wrong

The most common objection is that automated review comments are noisy. That's true if the tooling is too broad or the rules are too generic. The fix is not to abandon automation. It's to make the rules narrower and repo-specific.

A well-scoped autonomous review raises a specific, actionable flag in a narrow domain. When it's wrong, the author can dismiss it with a short explanation. When it's right, it saves the human reviewer from having to make the same observation from scratch.

The net effect is that human reviewers spend less time on mechanical checks and more time on design. That's the metric that matters.

## The workflow that works for us

The autonomous review runs as a CI check on every PR. It posts inline comments for mechanical issues and a summary comment with the overall pass/fail. Human reviewers can see the automated feedback before they start their review.

One rule we keep: automated feedback is advisory. It flags issues; it does not block merge. A human reviewer still decides whether a flag is a real problem or a false positive. The machine's job is to surface patterns. The human's job is to judge them.

This split keeps the review process fast without letting the tooling overstep. The machine handles the scanning. The human handles the thinking.

## What still needs a human

Some review tasks can't be automated with current tooling and probably shouldn't be:

- **Architectural fit.** Does this change introduce coupling that will hurt six months from now? That question requires understanding the system's history and trajectory.
- **Naming that communicates intent.** A machine can check that a name follows conventions. It can't tell whether the name makes the code easier to understand for the next person.
- **Missing tests for edge cases that aren't obvious from the diff.** The machine can check if tests exist. It can't imagine the failure mode that the author didn't consider.

Those are the reviews that matter most. The autonomous tooling exists to clear the path so human reviewers can spend their attention there.

## What we'd tell another team starting out

Start with one repo and one rule. Make it narrow enough that false positives are rare. Watch what the human reviewers still catch manually, and add those patterns to the automation over time.

The goal is not to replace human review. It's to make sure the human reviewer's attention goes to the parts of the PR where judgment actually matters.

<div class="ai-disclaimer">
  <p class="ai-disclaimer-title">AI writing disclaimer</p>
  <ul>
    <li>Replace this line with how the draft was reviewed or edited with AI help.</li>
    <li>Replace this line with any AI-assisted links, references, or examples used in the post.</li>
    <li>Replace this line with any AI-generated images, diagrams, or SVG assets used in the post.</li>
  </ul>
</div>
