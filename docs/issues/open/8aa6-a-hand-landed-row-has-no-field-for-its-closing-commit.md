---
id: "8aa6"
title: a hand-Landed triage row has no field for its closing commit, and an issue already closed on main with no removing subject has no destination
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-77

The triage's Landed rule (decision-f706: a gone string is a candidate, and
Landed needs the removing commit's subject read against the gap) has no
form for two cases the tanto-issue-triage rounds met repeatedly.

**An issue closed on `main` with no removing subject has no destination
that moves it** (S-77). When a row's gone items all read `no commit found`,
or it has no gone item at all, the Landed rule has no subject to name and
Kept leaves the issue in the pile. Round 2b alone held seven such rows
(b673, c30e, f5d8, ffee, 9d17, ed4b, bf89, and e84c in part), round 2a one
(2e52). A human who answers `Landed` has no subject to name.

**A hand-Land has no way to record the closing commit** (S-97). A brief
invites a hand-Land for rows with no subject (round 4b d45c, ff62) and for
one whose only subject kept the gap (5e9c, whose closing commit is not on
its row). `How to answer` says a Landed answer uses the row's subject, so
the apply would record the wrong commit; the spec's Landed form has no
field for it.

**Nine more rows in rounds 5 and 6b** (S-103) were Kept with an invitation
to Land by hand because their gap looked closed on `main` and no commit
subject closed it: issue-e916, issue-a83c, issue-f902 (round 5) and
issue-4d8a, issue-59c9, issue-6f3d, issue-a1a7, issue-e496, issue-f9b3
(round 6b). issue-a1a7's only removing subject is the commit that
introduced its passage, not the one that closed it.

This run settled them only by the human naming eleven subjects by hand
(R-14). The next triage needs a Landed-by-evidence form — a field for the
closing commit's subject, distinct from the row's traced subject — which is
a spec change and a decision. Beside issue-d0d7 (the Kept default for a
`no commit found` row) and issue-d0a3 (a pickaxe miss). The figures are in
`docs/reports/2026-10-03-tanto-issue-triage-dogfood.md`.
