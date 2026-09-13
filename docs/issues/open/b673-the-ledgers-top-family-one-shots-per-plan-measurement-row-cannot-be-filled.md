---
id: "b673"
title: "the ledger's \"top-family one-shots per plan, counted by kind\" Measurement row cannot be filled — nothing tells Kanri to write the lines it counts from"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch E task 17 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Rulings" and "Rulings
needed" (item 2 — flagged as worth more than a filing, since it is a
ledger row Kanri will actually try to keep, not a documentation nicety).

`templates/kanri.md:98` specifies a fixed Measurements row: "top-family
one-shots per plan, counted by kind." Counting by kind requires something
in the run to record, per dispatch, which of the twelve kinds it was and
that its family was the top one — but neither `roles/kanri.md` nor
`SKILL.md` tells any role to write such a line anywhere, and the string
`one-shot` occurs in neither file at HEAD. The row's own header promises a
count with no data source.

Unlike the passage-level staleness this run has filed elsewhere (a stale
count in a summary sentence, cosmetic), this is a genuine gap: a session
following the shipped skill to the letter cannot populate this row, because
nothing asks it to keep the raw tally the row is supposed to summarize.

Not fixable inside the tanto-cost plan: `templates/kanri.md`'s passage
under task 17 has already landed; the fix — a sentence somewhere telling a
role to note each top-family dispatch by kind as it happens, most likely in
`roles/kanri.md`'s dispatch-tracking text — touches a file closed since
batch C.

Related: issue-e18b, issue-2e19 (the same run's other `roles/kanri.md`
staleness, though this one is a functional gap rather than a stale count).
