---
id: "6a1f"
title: "two task-heading detectors in `passage-check.js` disagree on depth, so a plan drafted four hashes deep frames fine and is invisible to `verify`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Found by the tanto-cost whole-branch review (2026-09-14), a cross-cutting
finding visible only from the full diff (batch A wrote one detector,
fixed for issue-ac9d; a different, older one nearby was left as it stood).

`parsePlan`'s `TASK_HEADING_RE` accepts a task heading at depth **2-3**.
`planTasks`' `TASK_TEXT_RE` plus its `heading.depth < 2` guard accepts
depth **≥2**, unbounded above. Measured on a plan with `#### Task 5`
(depth 4): `frame --task 5` finds and prints it (exit 0); `verify --task
5` reports `no such task in the plan: 5` (exit 2); `lint` reports
`no-task-headings`. The same document reads as having the task under one
subcommand and not having it under the other two.

Batch A's fix for issue-ac9d widened `planTasks`' guard to accept any
depth ≥2 for exactly this reason (a task heading is not reliably at one
fixed depth across this repository's plan corpus), but `parsePlan`'s own,
older regex was not brought in line with it, so the widening is only
half-applied.

Fix: `parsePlan`'s `TASK_HEADING_RE` should accept depth ≥2 the same way
`planTasks`' guard does, or `frame` should apply `planTasks`' own depth
test rather than a separate pattern.

Related: issue-ac9d (the original fix this only half-applies).
