---
id: "dccb"
title: the fix wave is one unbounded list that runs far past a Jisso's context ceiling
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
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

Carrier: Kept.
