---
title: How we use AI like engineers
slug: how-we-use-ai-like-engineers
summary: Using AI to recover context in large codebases and take repetitive work off engineers' plates without compromising on code & review quality or operational safety.
socialDescription: Narrower contexts, smaller drafts, and stronger guardrails help us move faster without lowering review quality.
publishDate: 2026-05-20
author:
  name: Ashwini Chaudhary
tags:
  - engineering
  - ai
  - developer-experience
  - workflow
sourceType: original
featured: true
draft: false
---

Context engineering and management is a hard problem and is the highest priority even before a single line of code is written.


> Note: The article uses the term AI and LLM interchangeably. What they mean is a mix of chat-based AI tools and agentic tools like Claude Code, Cursor or Codex CLI and even more recent desktop apps like Claude CoWork and Codex.

It's very common for a person operating on LLMs to ask for too much in one pass. This often results in a gigantic diff that leaves the engineer doing the hard part afterwards, i.e. figuring out what the change actually means and did it even include everything they asked for to begin with. Second problem with this is that the code review doesn't provide strong enough reasoning to the engineer and the LLM itself to provide us a high quality code review that actually addresses the diff from a business logic and code quality point of view.


What has worked for us over time is to create narrower contexts for AI and allow AI to recover context faster without being married to the same LLM session where we actually started the discussion with the AI. Having a workflow built around this significantly helps with producing high quality work and work is broken down into small chunks that are easier to review and catch mistakes early.

At a high level, the shape of the work matters more than the amount of output:

<figure>
  <img
    src="/blog-svgs/how-we-use-ai-like-engineers/big-diff-vs-small-drafts.svg"
    alt="Comparison between one large AI-generated change and several smaller reviewable drafts."
    style="width:100%;height:auto;display:block;"
  />
  <figcaption>Smaller drafts are easier to review and easier to reason about.</figcaption>
</figure>

## Where it actually helps


The current models are ridiculously good at discovering code related to a logic that spans across various repos, and us [switching to a mono-repo last year](/blog/the-monolith-that-made-ai-actually-useful/) when Claude Code was starting to pick up has made a huge difference for us.

Saying AI is good at this doesn't mean an engineer isn't able to do the same, the difference is that assembling time of all such files, conventions, blast radius, etc., is simply faster than starting from zero and jumping around in code manually. This itself saves significant time upfront and allows us to guide the AI if it's looking at the wrong places -- sometimes it will point to old dead code that we may have and that's not what we want and AI loves to not follow existing utils and would redefine those every chance it gets and hence requires steering from the engineer.


Additionally, AI helps with skeleton tests and docs that will be needed and any renaming that is supposed to happen (and keeping it consistent across many files). And if the task is broken down into smaller enough subtasks such guardrails are even easier to follow for AI.


## Context matters more than prompting

While we were discovering these ourselves along the way as we got more and more familiar with using Anthropic's Sonnet/Opus and OpenAI's Codex, the final clarity we needed for it to apply across all of our repos was this blog from [OpenAI Engineering](https://openai.com/index/harness-engineering/) and even Boris Cherny(Claude's creator) mentioned in one his interviews why the concept of an index(used by GitHub Copilot and Cursor) doesn't work for these powerful LLMs anymore as they just prefer to explore code every time and an indexing simply fails to work if you have hundreds of feature branches because then you need support for a different index for each branch.

Since then we have made significant changes to our AGENTS.md and CLAUDE.md files and have a custom skill that helped us achieve it and we use it with any new project as well.

The bigger gains usually come from giving the model a structure it can work inside:

- table of contents under each project
- role of each project relative to other projects in the monorepo
- stable project instructions
- clear repository conventions
- useful ignore pattern (but not too many)
- obvious quality gates
- enough architectural context to make the connections obvious


Configuration shape matters too. Reusable rules should stay reusable(branching convention, deployment, CI checks etc). Project-specific context should stay close to the project(this includes subfolders with their own AGENTS.md/CLAUDE.md). Technical controls like tool restrictions or ignore behavior should stay out of narrative guidance and we have since moved all of these to skills and these skills are aware when to execute a certain script and why.

These might sound boring as it sometimes requires telling the LLM about things here and there, but the upsides are much higher. And it works naturally for humans too, a dense documentation with everything dumped into it is hard to follow for us too, instead a clean split between shared standards and project-specific setup is easier for humans to maintain and easier for models to use effectively.

The split we try to preserve looks roughly like this:

<figure>
  <img
    src="/blog-svgs/how-we-use-ai-like-engineers/context-belongs-in-different-places.svg"
    alt="Diagram showing that shared standards, project docs, and skills or controls belong in different places instead of being mixed together."
    style="width:100%;height:auto;display:block;"
  />
  <figcaption>Shared standards, project docs, and operational controls should not be mixed together.</figcaption>
</figure>

## The workflow still has to hold up

For a workflow to hold up, it needs to have very clear and specific guidelines for that workflow and these should be very easy to review/maintain for humans.

A big feature is still broken down into smaller releases and stacked PRs as much as possible. We really believe and take pride in building systems that do not keep us up at night at 3AM, late heroics when a bug is identified (worse if identified by a client) and solved are much less appreciated.

Any bug identified is still first proven by adding that missing test that did not catch it earlier and then the fix is implemented to make the test pass. This practice has worked really well for us the last 8 years.

Anything that touches the core of our system and will have direct implications on our clients is still thoroughly tested manually as well on external sandboxes with production-like data to give us that extra confirmation we are not solely relying on automated tests. This often also includes testing the non-happy path flows.

It's very easy to waste time asking AI too much at once, the output from the AI looks productive for a bit because you see that it has generated a lot of text but now we have to pay in terms of an engineer spending way too much time validating the draft and ensuring the intent is spot on.

Hence, our focus nowadays is heavily on narrower and more practical planning and that is made possible by faster context recovery, smaller drafts, quicker iteration cycle when something looks off.


## What still stays human

Some work should stay obviously human.

If the change touches existing data, authorization or production infra someone has to reason about it and test it first on environments where we are fine with experimenting. AI's assistance is helpful, but we cannot trust it with everything -- an example of it for us would be we build a lot of internal tools for our team and it's easy for AI to confuse those with client-facing features and we need to steer the AI in the right direction when it happens.

This is applicable to architecture as well, difficult to make calls like coupling, isolation, long-term maintenance belong to engineers as they understand the wider system and know about upcoming business decisions and are the ones who will have to live with the consequences. A simple example of this will be when we were building SMS based pulse surveys, we really wanted a backend like Django's local console based email backend that allowed us to test SMS without ever sending a real SMS but the config for it should make it a plug & play system where the functionality remains the same for our team (an LLM cannot plan for it, nor can you write this in your AGENTS.md and assume it will do so for each feature).


Final approval stays human too. Anything we are shipping is that engineer's responsibility at the end of the day, saying the LLM missed it doesn't work for us and won't for our clients either.

This boundary matters more than any model benchmark:

<figure>
  <img
    src="/blog-svgs/how-we-use-ai-like-engineers/ai-accelerates-humans-own-risk.svg"
    alt="Diagram showing that AI accelerates drafting and context recovery while humans keep responsibility for risk, architecture, and final approval."
    style="width:100%;height:auto;display:block;"
  />
  <figcaption>AI can accelerate drafting, but risk, architecture, and approval still stay human.</figcaption>
</figure>

## Evaluating AI like infrastructure

There is a second layer to this beyond coding workflow: choosing the right AI stack.

What I have found useful about these systems is to think about them the way we think about infrastructure. While the model is definitely important, the surrounding ecosystem matters a lot as well. 

The things I care about:

- developer experience(DX)
- how well is the ecosystem supported by others across the world
- how easy it is to onboard engineers to it (is it too overwhelming?)
- how easily can the engineers build on top of it
- what does it change about data handling, compliance?
- what will this decision cost over time, not just in a demo? The cost is both engineer's time and cost to the company.

DX is a big deal for me, more than the model itself.

This does not mean we have not made mistakes, we have tried a lot of different things but thanks to the team we were able to switch away from them when we realized something was not working for us. A recent example for us was completely moving away from Claude Code and Codex CLI to Pi within a week.

## What changed for us

- We now recover context much faster and avoid the dumb zone.
- We turn repeated friction to instructions, tools, or guardrails more often. The goal is to always spend less time on low-leverage repetition and more time on design, review, and testing.

A lot of that progress came from engineers comparing notes([`/insights` in CLAUDE.md](https://x.com/trq212/status/2019173731042750509) was helpful, we also started doing monthly [code review discussions](/docs/code-review-digest-writer) to avoid common and repeated mistakes), tightening instructions, and writing down what actually worked. And the primary reason for our success with these systems is our team(and this includes all teams across Diversio) who have kept feeding their learning back into it.

## The part that matters most

AI acts as a force multiplier if you come from a culture of strong engineering habits and us being able to create that well before LLMs were a thing has just worked in our favour.

If you're wondering where to start to make the most of it with your own team, starting with working on your planning, scoping, instructions, code quality & testing guardrails and review loops and building systems/workflows that can be maintained and owned by the whole team. And spend less time on model comparison.


## Related reading

- [The Monolith That Made AI Actually Useful](/blog/the-monolith-that-made-ai-actually-useful/)
- [No Code by Hand](/blog/no-code-by-hand-agentic-platform-acceleration/)
- [From Postman to Bruno - How AI Changed Our API Workflow](/blog/from-postman-to-bruno-how-ai-changed-our-api-workflow/)


<div class="ai-disclaimer">
  <p class="ai-disclaimer-title">AI writing disclaimer</p>
  <ul>
    <li>The article was verified for typos and basic grammatical mistakes using Codex 5.4.</li>
    <li>The references to our existing blog posts were included with the help of Codex 5.4 (we left comments for it).</li>
    <li>The SVGs were generated using Codex 5.4 and Excalidraw MCP.</li>
  </ul>
</div>
