---
id: "afea"
title: a self-measuring final task cannot see its own boundary or its plan's true close
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

A plan's final sweep-and-check task runs inside the last batch, before that
batch's own boundary check and before the plan's actual close (merge, T2,
Jisso's exit) — both later events. In `tanto-context-ceiling` this was task 17
inside batch E, and the fix there was local: say so explicitly in the task's
own preamble, marking which sections are "as of this task's own writing"
versus "the ledger's job from here on".

Nothing in `roles/keikaku.md`'s guidance on sweep-and-check tasks names this
timing gap, so it is a shape, not a one-off: any future plan whose last task
measures the run that wrote it will hit the same question. The general answer
is worth stating once rather than re-derived per plan — a dated report is
frozen once written, so anything the run has not finished yet belongs in the
ledger, not in a reopened file.

Not a duplicate of issue-7275 (a task whose only proof is the next batch's
first act): that one is about where a proof lives, not about a frozen report's
write-time boundary.
