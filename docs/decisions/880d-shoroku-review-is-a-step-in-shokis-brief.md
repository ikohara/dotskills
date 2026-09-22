---
id: "880d"
title: "`shoroku.review` is a step in shoki's brief, a fifteenth kind on opus/medium"
status: accepted
supersedes: []
superseded_by: null
amends: ["0352"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

decision-0352 split the `shoroku` kind into `shoroku.recommend` on the top
family and `shoroku.apply` on a cheaper one. Under decision-26fd the apply
becomes shoki: a seat spawned into a worktree after the merge, which writes
the close's records and lands them with nobody present. Every other artifact
this run produces passes a reviewer before it lands — a task's diff, a plan,
a spec, the fix wave's own batch. Shoki's commit was the one that did not.

## Options

- **A `shoroku.review` step inside shoki's own brief**, dispatched by shoki
  before it reports ready, as a fifteenth kind on opus/medium.
- **Kanri reviews the write-out's diff instead.** Rejected: Kanri does verify
  the commit, but a diff verification by the seat that ordered the work is
  not the independent read the rest of the run gets, and it puts the reading
  back in a resident context.
- **No review, as before.** Rejected on the plain asymmetry: the one seat
  that lands unattended was the one seat with no review.

## Decision

`shoroku.review` is a step in shoki's brief, a fifteenth kind carrying its
own model and effort, opus/medium (D-4). The one seat that lands unattended
gets a review before its landing.

**This ADR amends decision-0352** in one part: the count and the split. Where
0352 made one `shoroku` kind into two, the write-out now has three steps with
a kind of their own, and the kind count becomes fifteen. The rest of 0352
stands: `shoroku.recommend` on the top family for its judgment, and
`shoroku.apply` on a cheaper one for its clerical write.

## Consequences

- The close's records are read by something other than their author before
  they land, at the cost of one subagent per close.
- The kind table grows by one, and `tanto.json`'s built-in defaults with it.
- A review that finds a real defect costs shoki a fix round inside its own
  brief rather than a later correction commit against `main`.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
