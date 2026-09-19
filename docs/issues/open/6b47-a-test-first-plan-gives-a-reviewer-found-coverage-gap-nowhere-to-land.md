---
id: "6b47"
title: a test-first plan gives a reviewer-found coverage gap nowhere to land inside the task that found it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by Jisso on the tanto-cost run's batch A (2026-09-13), recorded in
`.tanto/tanto-cost/batch-A-report.md`, "Shoroku candidates" and "Parked and
deferred minors".

A plan whose tasks are test-first (`skills/tanto/scripts/passage-check.js`'s
own `sections`, `frame`, and `boundary`, in this run) quotes every test
verbatim, per the tanto-cost design's own rule that an unrun, unquoted test
is a "placeholder in a command's shape". `diff`'s companion rule then makes
any line on the code path that is **not** quoted an `unaccounted-added`
defect, except on the one file the plan carves out for the implementation
itself. The two rules are individually sound and jointly leave no path for a
third thing: a coverage gap a task reviewer finds during the batch. Adding
the test the reviewer describes would add an unquoted, and therefore
unaccounted, line to the test file — exactly the shape the plan's own rule
forbids.

Measured on batch A: three such gaps surfaced across two tasks (a fence-skip
helper's own immunity untested in task 1; a depth-aware termination path
untested in task 2; an "`Expected:` paragraph never itself printed" rule
untested in task 3), each real, each checked by hand instead of by an added
test, and each carried forward rather than closed. A reviewer's finding that
cannot be acted on inside its own task is not a failure of this run — Jisso
ruled correctly that no task may add the test — but it is a gap the
drafting conventions do not name.

What the conventions could say, so a future test-first task does not
rediscover this by trial: either name which paths may carry an unquoted test
(the test file itself, distinct from the implementation file the plan
already carves out for `diff`), or say explicitly that a test-first task's
review findings on coverage are carried to the next boundary or the
whole-branch review rather than fixed in place — which is what this run did
by convention, not by instruction.

Related: issue-4eef (the same "plan says versus plan quotes" gap on the
`diff` side), the tanto-cost design's "Batch A's implementation lines are
`unaccounted-added`" Global Constraint.
