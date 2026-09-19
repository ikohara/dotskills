---
id: "a75e"
title: the batch-report template has no section for an out-of-worktree side effect that happened and was reverted
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-15-batch-report-template-side-effect-gap

A batch report needs a place for a side effect **outside the worktree** that
has already happened and been reverted: what it was, that it was reverted, and
how the revert was verified. `templates/batch-report.md` has no section whose
contract fits. The only section that currently takes the fact is "Questions for
the human", whose contract is the four stop classes — all of them things asked
*before* an effect happens.

Measured by the reporter: a walk-through created a real per-user state file
outside the worktree (a configuration skeleton's path expanding against the
real environment whatever `--config` said), and the implementer deleted it and
restored the prior state exactly. Over five batches that section was used once
for this, as a notification rather than a question — a mismatch with its own
stated contract.

Proposed: a section of its own in `templates/batch-report.md`, separate from
"Questions for the human". A template's section list is a shape decision rather
than a sentence, which is why this is filed rather than applied.

Alongside issue-a5d0 (a mid-batch blocker file has no template) — the same
template gaining a missing shape.
