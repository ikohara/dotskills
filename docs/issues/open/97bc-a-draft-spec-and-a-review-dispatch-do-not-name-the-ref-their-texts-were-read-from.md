---
id: "97bc"
title: a draft spec and a review dispatch do not name the ref their texts were read from, and the shared checkout moves under both
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-18
---

One cause, two sites: the shared checkout moves under a topic's documents while
they are being written and reviewed, and neither the draft nor the review
dispatch is required to say which ref its texts came from.

**Site 1 — the draft spec's old texts.** `roles/sekkei.md` Step 1 does not ask
a draft to name the ref its quoted old texts were read from. The `seat-lineage`
spec was drafted against the `shoroku-at-close` branch (R-2), whose Tasks 6, 7,
8 and 9 landed during the dialogue and the review; the shared checkout then
switched to `main` while the review rulings were written. The quotes stayed
valid only because that draft happened to name its ref — HEAD plus the plan's
`→` blocks — in section 9 and in its review section. A draft that did not would
have quoted a tree no one can find. The fix is one clause in Step 1's draft
rule: "and name the ref the old texts were read from."

**Site 2 — the review dispatch's T0 inputs.** A spec reviewer dispatched into a
branch checkout reads a `docs/requirements/` and `docs/issues/` that lack the
topic's own T0 write-out, because that commit is on `main` and the checkout is
not. The `seat-lineage` spec review hit exactly this and worked around it by
reading the T0 documents with `git show main:<path>`. The dispatch should name
the ref the T0 documents are on, or say to read them that way.

Related: issue-e13a (a spec's quoted old texts have no mechanical pre-flight)
is the check-side of site 1; issue-bf75 (a plan under review can move) is the
same hazard on a plan rather than a spec.

A dispatch-contract gap, not a user-stated need, so no paired requirement.
