---
id: "dccb"
title: the fix wave is one unbounded list that runs far past a Jisso's context ceiling
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-07
---

Source: inbox 2026-10-03-fix-wave-unbounded-single-jisso

"The final batch" has the next queued Jisso take the whole-branch review's
complete findings list as one fix wave, with "no second fix wave", so the
wave is the one batch with no size bound and the ceiling check acts on
nothing for it. Measured in one run: one Critical, two Importants and about
forty Minors ran as one list in one Jisso — 41 commits, 46 wake-ups, and a
context of 549100 against a ceiling of 220037. Measured in the `shoki-seat`
run: eight small tasks in one wave took a Jisso from 107k to 361k over 40
wake-ups, about 3.9 times `ceiling.jisso.per_batch` — more than three
batches' worth of Jisso context, where Rule 7 sizes a batch at three or four
tasks (`docs/reports/2026-10-04-shoki-seat-dogfood.md`, the fix wave).

Promote Critical and Important findings into a batch of their own, split a
long list into two or three batches by task with the "no second fix wave"
rule on the last, and state the bound in "The final batch" of both
`roles/jisso.md` and `roles/kanri.md`. Kin issue-96f2, issue-b4e7 and
issue-cabf.

**2026-10-07, from inbox 2026-10-06-plan-draft-method-and-fix-wave-cost — a
third run, and where the growth came from.** A nine-task fix wave ran in one
Jisso from `context=114663` (89,868 of it the baseline) to 433,967 at its
report: 44 wake-ups, about 35,000 tokens per task, twice the Jisso ceiling of
219,868. The ceiling verdict is read at a boundary only, and a wave has one,
so it acted on nothing; the batch prompt named one Jisso for eight tasks and
a mid-batch addendum added the ninth to the same seat. Most of the growth was
the seat's own pasted dispatch prompts — three per task, each restating risks
and mechanics in 2,000 to 3,000 characters — and the diff and ledger reads.
The wave's 29 subagent runs summed to about 2.03 million subagent tokens,
about 226,000 per task: an implementer run about 73,000, a spec review about
66,000, a quality review about 72,000, so two opus reviews cost about twice
the implementation they gated, for diffs of 21 to 92 lines. A second
instance: a live-check batch with the human in the loop ran a Jisso to
521,000, 2.4 times its ceiling, over 19 hours and about 35 wake-ups, the cost
being the human's waits and the retries.

The report's levers, beside the ones above: each task's named risks go in a
review-focus section of the brief file and the reviewer dispatch is paths
plus the report-format sentence; a wave is capped near rule 7's three or four
tasks per Jisso, the rest named to a fresh Jisso in the wave's prompt; a
batch that waits on the human is held to the same size or handed to a fresh
Jisso at a wait past the ceiling; and one-line fixes of one shape go into one
task.

Carrier: Kept.
