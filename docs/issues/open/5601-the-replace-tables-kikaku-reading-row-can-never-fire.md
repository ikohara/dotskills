---
id: "5601"
title: "`roles/kanri.md`'s Replace row \"a Kikaku's reading shows a compaction\" can never fire"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-18
---

The Replace table in `roles/kanri.md` carries a row whose symptom is "a
Kikaku's reading shows a compaction". Kikaku sends no reading —
`templates/roster.md` says so — and its one line to Kanri, `decision: <path>`,
carries none, as `roles/kikaku.md` states. The row's symptom therefore cannot
arrive, and a reader waits for a signal that does not exist.

The dead text was left by the R-6 amendment of the `seat-lineage` spec, which
split this row and marked the Kikaku half "unchanged"; it is dead either way,
before and after the split.

Dead lifecycle text is more than cosmetic: the Replace table is what Kanri
routes on, and a row that cannot fire either hides a missing signal (Kikaku
should send a reading) or should be removed. The fix needs that judgment, which
is why this is filed rather than swept.

Related: issue-a1a7 and issue-8312 concern other rows of the same table and do
not cover this one.

A runtime-text defect, not a user-stated need, so no paired requirement.
