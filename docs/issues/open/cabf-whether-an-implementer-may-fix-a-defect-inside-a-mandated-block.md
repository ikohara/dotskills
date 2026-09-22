---
id: "cabf"
title: whether an implementer may fix a defect inside a mandated `W`/`P` block under an `R-n`
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-62

Across this branch, roughly twenty defects in the plan's own `W`/`P` bytes — the
`cwd`, the `resume` poll, the launcher's error paths — were each ruled "real,
plan-mandated, defer to the fix wave" within minutes of being found. The fix
wave then became a single batch carrying all of them plus the prose.

The carve-out kept passages verifiable, which was its point. It also meant the
first Critical of the run (task 8) stayed on the branch through five more
batches. A ruling that let an implementer fix a defect inside a `W` block under
an `R-n`, with a re-run of `verify`, would have cost one ruling then instead of
one batch now.

Both sides have a measured cost here, and no decision was made during the run,
so this is the deferred decision rather than an ADR: does a plan-mandated defect
stay parked for one fix wave in every case, or may an implementer repair it in
place under a numbered ruling, at the price of a block whose landed text no
longer matches the plan's?

Related: issue-96f2 (a fix wave has no instrument aimed at it), issue-7c28 (the
instrument cannot record a ruled deviation — the reason a repaired block fails
`verify` afterward).
