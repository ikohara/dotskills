---
id: "edcc"
title: "the bug intake has no forcing function for the `triage:` line once a report has been handled by absorption into a ruling"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Found by Kikaku on 2026-09-17 while triaging the queued-Keikaku question.

A kuchidome bug report received on 2026-09-16 — the queued-Keikaku cold-read
delete collision, whose inbox copy and kuchidome copy are both on disk — was
handled as an addendum to `tanto-project-config`'s ruling, in the same direction
kuchidome had taken (the seat persists). Its Triage section is still empty —
`Outcome —`, `Reference —`, `Date —` — and no `triage:` line was sent, as far
as the roster, the archive, and the two ledgers show. Absorbing a report into a
ruling counts as handling it in practice, and nothing in the intake forces the
line or the section to be filled when that is how it was handled.

The second half is worse: later the same day a release-seat decision overturned
that direction, in both topics' ledgers, and nothing carried it back to
kuchidome. No Kikaku decision or ledger there mentions it. A subject decided
elsewhere the same day does not re-open the report, so the reporter is left
holding an answer that has since been reversed.

`roles/kanri.md`'s Bug intake section is `bug-report-hold`'s scope, and that
topic's Sekkei reads open issues at its own start, which is why this is filed
rather than left in a decision file.

Adjacent but not the same: issue-a79c is the intake's decision point with a
batch in flight, not the missing forcing function.

A process gap, not a user-stated need, so no paired requirement.
