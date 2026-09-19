---
id: "91f6"
title: "`boundary`'s verify-loop fence is pinned to one batch's task numbers, and a later batch's boundary runs it clean without checking its own work"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the tanto-cost run's batch C (2026-09-13), recorded in
`.tanto/tanto-cost/batch-C-report.md`, "Deviations from the plan" and
"Shoroku candidates".

The tanto-cost plan's "How a batch is verified" section, under `boundary
--plan`'s check 3, is a fenced loop: `for t in 5 6 7 8; do … verify --task
"$t" …; done` — batch B's task list, written once when that section was
drafted. At batch C's boundary, `boundary --plan` ran that same fence
unchanged: it re-verified tasks 5 to 8 (batch B's, already landed and
already checked) and did not touch 9 to 12 (batch C's own work), then
exited 0. The plan's own text says as much ("the list is the batch's own,
and the line below is batch B's"), so this is not a surprise to anyone who
reads the section — but it means a **green `boundary` at batch C's
boundary attests to batch B's work, not batch C's**, which is exactly the
kind of check a reader trusts to mean the opposite. Kanri caught it only by
running `verify --task 9|10|11|12` by hand.

The instrument's coverage narrows the same way at every later boundary,
because nothing updates the fence: batch D's boundary will still run
`for t in 5 6 7 8`, batch E's the same, and so on, unless someone edits it —
and editing `skills/tanto/scripts/passage-check.js`'s plan is itself the one
file this repository's own plans are written *for*, so the fence lives in
whichever plan's own text currently governs, not in the instrument.

Two fixes, not mutually exclusive: (a) a `verify --plan <path>` mode with no
`--task`, iterating every task the plan carries, so a plan's own boundary
check is self-maintaining and needs no per-batch fence edit; (b) short of
that, the Batches table should name who edits the fence and when — a
standing instruction, not a one-time fact — so a plan drafted under this
convention does not repeat the gap.

Related: issue-860b (what `boundary` runs and cannot reach), issue-c841 and
its siblings (the instrument's other coverage gaps found by this same run).
