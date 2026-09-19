---
id: "cb19"
title: "the two-dispatch task-reviewer split is an inference from `roles/jisso.md`'s Models table, not an instruction anywhere"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: session 2026-09-16

Found by the `tanto-project-config` run's Jisso at the Batch A boundary
(2026-09-16), in its exit shoroku proposal.

`subagent-driven-development` gives one combined task-reviewer template.
`skills/tanto/roles/jisso.md`'s Models table names `task.review-spec` and
`task.review-quality` as distinct kinds with distinct `subagent_type`s, which
reads naturally as "dispatch twice, one prompt per half of the template" —
and that is what Batch A did, successfully, across all four tasks. But no role
file says this outright. A different Jisso reading the same table could just
as plausibly dispatch one combined reviewer and pick which of the two model
entries to bill it under.

Why it is not cosmetic: the two readings give a **different review load per
task** — two opus dispatches versus one — so per-task cost and the per-batch
context figure both depend on which reading a session happens to take. Batch A
measured `341985` context read at its boundary against a `jisso` ceiling of
`205884` (about 1.66x), with the doubled review load as one of the two named
contributors; that measurement's own home is an open fork between
decision-eee2's per-batch constant and issue-7281, and is not filed yet.

Proposed fix: one sentence in `roles/jisso.md` making the two-dispatch reading
explicit, if it is the intended one. If the fix is a single paragraph there, it
may be folded into issue-0404's edit rather than landed on its own.

2026-09-17 — the split's reviewer-side price, measured. The `shoroku-at-close`
run's Jisso recorded Batch A's full per-dispatch subagent cost: three tasks,
zero fix rounds, nine subagent dispatches total — one `task.implement` (sonnet)
plus two review dispatches (`task.review-spec` and `task.review-quality`, both
opus) per task, which is the two-dispatch reading this issue names. Token usage
per dispatch: Task 1 — implement 68,704, spec-review 55,524, quality-review
56,381; Task 2 (the batch's largest, a 102-line whole-section replacement across
five files) — implement 95,785, spec-review 74,999, quality-review 86,529;
Task 3 — implement 59,599, spec-review 49,661, quality-review 49,344. Total
≈596,500 subagent tokens for a batch that needed no fixes.

Because each review half independently re-reads the same diff rather than
sharing one read across two verdicts, the split roughly doubles the
reviewer-side cost `subagent-driven-development`'s own combined template would
have paid for the same diff — a real, now-priced cost of running
spec-compliance and code-quality as separately dispatchable `tanto.json` kinds
rather than one dispatch returning both verdicts. Worth weighing against the
split's own benefit (independent model and effort tuning per half, no shared
blind spot between the two verdicts) the next time `tanto.json`'s review kinds
are revisited. The paragraph above left the run that raised this issue with no
filed home for its own figure; this is a second run's, filed.

2026-09-17 — Batch C's own measurement, a second point for the same split.
Batch C of the `shoroku-at-close` run repeated the shape the paragraph above
prices: nine subagent dispatches across three tasks, one `task.implement`
(sonnet) plus `task.review-spec` and `task.review-quality` (both opus) per
task, zero fix rounds. Token usage per dispatch, read from each dispatch's own
result: Task 7 — implement 75,673, spec-review 57,673, quality-review 63,106
(196,452); Task 8 — implement 74,236, spec-review 61,225, quality-review 71,788
(207,249); Task 9 — implement 81,115, spec-review 54,262, quality-review 57,662
(193,039). Batch total ≈596,740 subagent tokens.

That lands within 0.04% of the Batch A total above, despite different task
sizes and no shared cause beyond "three documentation tasks, the two-dispatch
review split, zero fix rounds". The figure alone is not the finding — two
batches landing within noise of each other on this metric is: the split's
reviewer-side cost is flat across batch composition, which the open question
this issue carries (two opus dispatches versus one) previously had only a
single point to argue from.
