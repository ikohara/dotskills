---
id: "5cf3"
title: a passage task's review can be reconstructed mechanically from the plan's own blocks, rather than checked passage by passage
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by a task reviewer during the tanto-cost run's batch B (2026-09-13),
recorded in `.tanto/tanto-cost/batch-B-report.md`, "Rulings" and "Shoroku
candidates".

A passage task's real deliverable is not "these N passages landed" but "these
N edits landed, **and nothing else changed**." A reviewer that checks each
of a task's `P` blocks against the diff one by one proves only the first
half — it can confirm every quoted passage arrived, but not that the diff
contains nothing beyond them.

The method that proves both halves at once, devised unprompted by task 6's
reviewer and then named explicitly in the dispatch for tasks 7 and 8: parse
the task's `O`/`P` blocks, apply them programmatically to the diff's old
side, compare the result against the diff's new side, and confirm each edit
applied exactly once. It ran on tasks 6, 7, and 8 (6, 14, and 17 passages
respectively) and returned byte-identical every time — a mechanical
reconstruction rather than an eyeball comparison, and cheap: one short
script over data the plan and the commit both already carry.

This is a review technique, not a `passage-check.js` feature — it needs no
change to the instrument, only for the convention to be named where a
passage plan's tasks are drafted or dispatched, so the next run's reviewers
do not each rediscover it independently task by task.

Destination: `roles/keikaku.md`'s drafting conventions (the seat that will
own plan-writing rules under this design), or `docs/notes/tanto-consistency-checks.md`
as the standard scope check for a passage-task review. Either place makes it
the default rather than a reviewer's private habit.
