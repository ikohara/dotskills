---
id: "d0a3"
title: a pickaxe miss reads as `no commit found`; whether a fuzzier trace is worth building is open
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-56

The instrument (`scripts/issue-liveness.js`) traces a gone quote with a
`git log --pickaxe-regex -S` search. A quote whose words were reordered or
partly rewritten in the removing commit reads `no commit found`; the row
still says gone, and the recommender treats it as Kept with the fact noted
(the `tanto-issue-triage` spec, Deferred items, item 5).

The count now exists: rows every one of whose gone items reads
`no commit found` were 97 of the 221 rows of rounds 1 to 4b (see
`docs/notes/triaging-the-issue-pile.md` and
`docs/reports/2026-10-03-tanto-issue-triage-dogfood.md`). The decision at
the end: whether a fuzzier trace is worth building on that number. This is
the data-side half of issue-d0d7's rule question (the Kept default for such
rows).
