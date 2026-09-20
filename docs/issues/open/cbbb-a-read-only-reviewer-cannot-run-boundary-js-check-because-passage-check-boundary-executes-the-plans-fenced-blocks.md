---
id: "cbbb"
title: a read-only reviewer cannot run `boundary.js check` because `passage-check boundary` executes the plan's fenced blocks — a `check --no-boundary` mode
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku tanto-diet S-72

`boundary.js check` runs `passage-check boundary` as one of its steps, and
that subcommand executes the target plan's fenced blocks, which `mkdir` and
write under `.tanto/`. A read-only seat therefore has no side-effect-free way
to exercise `check` against a real plan.

The cost was measured at the review that gates the merge: `tanto-diet`'s
whole-branch reviewer could not run the plan's own fence 3 dogfood
(`boundary.js check` against the `seat-lineage` plan) and had to report that
coverage as not taken. The new instrument's only end-to-end exercise against a
real plan is thus outside the reach of the seat whose job is to doubt it.

Proposed: a `check --no-boundary` mode — sections, diff and readings only —
giving a reviewer, and a between-plans Kanri with no plan to run against, a
safe form. Adding it is a decision about the instrument's interface, not a
one-line repair: it decides which of `check`'s steps are load-bearing for a
verdict and what the reduced form's exit code means.

Related read-only-seat siblings: issue-2c6a (a read-only review seat cannot
record the lint floor) and issue-483c (`replay` cannot run a plan's sections
fences because tanto resolves inside the scratch tree).
