---
id: "7281"
title: a plan task can be right-sized for review and still too large for one dispatch's context
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Observed by the context-cost plan review (2026-09-09). In that plan task 1 is
875 lines and 48 steps and task 7 is 767 lines and 44 steps; under
subagent-driven development each task is one implementer dispatch that reads
its whole task text, and the reviewer reads it again. The step granularity is
right — one action per step, every anchor and passage verbatim — and no
review reason asks for a split. The cost is the per-task read: near the point
where a task boundary is worth drawing for the implementer's context rather
than for review, which is a variable writing-plans' "task right-sizing" does
not name (it sizes by what a reviewer can check and by dependency, not by the
bytes one dispatch must hold).

Nothing failed here: both tasks ran under `sonnet` with a 1M-context Jisso
dispatching them. The observation is for the plan-authoring rules: a passage
plan whose task exceeds some line count splits it by file or by section, and
the plan's Self-Review states the largest task's size so that the reader can
judge it. What the count should be is unknown until a task fails or degrades
for size; record the sizes in the dogfood reports until then.

Related: req-04f5, issue-5830, design-4807 (the passage-plan conventions),
superpowers writing-plans.
