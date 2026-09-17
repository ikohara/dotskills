---
id: "26ef"
title: "a queued-topic plan that appends a numbered entry to a shared single-numbering document collides with the topic ahead of it"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Measured on `shoroku-at-close`. A queued-topic plan that appends a new numbered
entry to a shared, single-numbering-namespace document carries a real collision
risk if the topic ahead of it in the queue writes its own close before this
plan's branch is cut. The document here is
`docs/notes/tanto-consistency-checks.md`, which now states the rule explicitly:
"a new entry of either kind takes the next number".

The instance: this plan's own new check was drafted as check 22 and had to
become check 24 at the release-time re-anchor, because `tanto-sweep-2`'s close
had landed two real checks, 22 and 23, in the gap between this plan's human
review and its branch cut.

Nothing catches this at drafting time or at review time. Only a real
`replay --base main` against the fully-landed tree does, and only because
`lint`'s own uniqueness check would refuse a duplicate `## 22.` heading once
both existed on the same branch. The detection point is therefore late and
incidental.

For `passage-check-hardening`'s queued-topic protocol: a drafting-time rule
(number the entry at the re-anchor, not at drafting) or a check that a
queued-topic plan's numbered appends are re-derived from the landed tree.

Related: issue-bf75 (a plan under review can move) is the adjacent hazard on
the plan's own text rather than on a shared document's numbering.

A tooling and protocol gap, not a user-stated need, so no paired requirement.
