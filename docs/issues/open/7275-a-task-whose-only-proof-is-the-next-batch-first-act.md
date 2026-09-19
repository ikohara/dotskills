---
id: "7275"
title: the plan-shape guidance says nothing about a task whose only proof is the next batch's first act
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: inbox 2026-09-11-tanto-proof-deferred-to-next-batch

Contract rule 7 asks for small batches of three or four tasks, and a plan's
"How a batch is verified" section names each batch's proof. Neither says what
Sekkei does when a task's only proof is an act that belongs to the next
batch: keeping the proof in the same batch makes it five tasks, and moving
the task to the next batch puts it after the act it serves.

Reported 2026-09-11 by the Kanri of the mpm-playground-console repository
(inbox `2026-09-11-tanto-proof-deferred-to-next-batch.md`), relaying its plan
reviewer: a crash-context registration on a console run path is proven only
by the next batch's first on-target run, which is the same run that starts
that batch's work. Sekkei deferred the proof to that run — a sentence in
both tasks — and Kanri accepted; the reviewer flagged the trade as worth a
line in the guidance, because nothing in the role text says whether a batch
may close with a task proven only by the next batch's first act, or how the
batch report states it.

The fix, in the reporter's words: one sentence in `roles/sekkei.md`'s
plan-shape guidance — a task may close its batch with its proof deferred to
the next batch's first act when the proving act is that act, the plan says
so in both tasks, and the batch report lists the task as
`proven at <batch>.<task>`; Kanri's verdict for the batch then names the
deferred proof and the next boundary confirms it. If the trade recurs,
`templates/batch-report.md` gets a line for it.

Under contract rule 11 with a tanto plan — the `.tanto/` workspace move
(issue-0b97) or the Keikaku split (issue-3c7a). Related: issue-9627, from the
same run, on a pre-spec act with no closure mark.
