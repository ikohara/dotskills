---
id: "2e2b"
title: "a dogfood task's measured stage is assumed from the spec's wording rather than checked against the contract's actual schedule"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-15),
confirmed twice inside the same run.

`plan.review` found that the run's dogfood task referenced a shoroku stage the
contract's own schedule never produces before that task runs. Neither the spec
review nor the drafter caught it: both read the stage out of the spec's
wording, and nobody checked the wording against the schedule the contract
actually executes. A dogfood task's measured stage needs that check at draft
time.

The same run then lived the gap a second time (its R-5): the
check-brief-as-run measurement could not be taken where the plan put it and
had to be deferred to T2, landing in
`docs/reports/2026-09-16-tanto-sweep-2-held-measurements.md`. Two instances in
one run — the review catch and the deferred measurement — is the evidence
behind this filing.

Proposed: Keikaku's drafting step for a task that measures a stage resolves
the stage against the contract's schedule at draft time, and records the
resolution, rather than copying the stage name from the spec.

Related: issue-afea (a self-measuring final task cannot see its own boundary —
the adjacent gap, about the task's own close rather than the stage it names),
issue-bb86.
