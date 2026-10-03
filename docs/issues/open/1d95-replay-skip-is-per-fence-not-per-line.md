---
id: "1d95"
title: "`replay-skip` is scoped to the whole fence, so one matching line skips a block that also runs safely"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-10-03
---

Source: shoroku tanto-sweep

Raised at the tanto-sweep run's batch A boundary (2026-09-10), from the
human's decision on the batch report's question 1. `replay` reads a fenced
command block's **first word** to decide whether it runs the block or skips
it (a `git` command, a `passage-check.js verify` invocation, or a pattern
the plan declares `replay-skip:`). A fence whose first line is, say, a
`for … do … done` loop that invokes `git` inside the loop body therefore
runs `git` against the scratch tree — the check reads only the first
word — and, symmetrically, a fence whose **later** line matches a skip
pattern is skipped **whole**, including any earlier line in the same fence
that would have run safely on its own. This run measured 8 of 81 fences
affected by the coarse granularity.

The spec's stated granularity for `replay-skip` is the fence, and this run
kept it there — the fix was accepted at the block level, not the line
level. The question is left open for the next plan: whether `replay-skip`
(and the first-word command classification generally) should move to
**per-line** granularity, so that a fence mixing a safe command with a
skip-worthy one runs the safe line and skips only the other, at the cost of
a more complex parser and a plan-authoring rule about where a skip-worthy
line may sit inside a multi-line fence.

Related: exp-06b2, design-4807 (`replay`'s command classification), the
tanto-sweep batch A report of 2026-09-10.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
