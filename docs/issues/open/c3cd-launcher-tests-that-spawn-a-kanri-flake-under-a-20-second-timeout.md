---
id: "c3cd"
title: Launcher tests that spawn a Kanri flake under a 20-second timeout
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-87

The launcher's test fixtures wait for a Kanri spawn under `--timeout 20000`.
A spawn takes about 11 s on a quiet machine (the spawner's ten-second turn
settle plus a two-second poll) and 17 to 25 s under load, so the tests that
spawn a Kanri fail one run in a few when the machine is busy. Two modes were
reproduced before the run-owned-seats fix wave: the spawn-wait timeout
(exit 1, "the spawner wrote no result for the Kanri request") and a stray
`resume` request after `teishi --seats`. A suite run beside other sessions'
work, or beside two reviewers' checks, is not a clean measurement. Until the
fix lands, a boundary suite run that fails a launcher test is read by running
that test alone.

Related: issue-46d3 (the suite's wall time is the launcher's transcript poll
budget), and issue-d772 (the launcher's tests assert exit codes with no
message).

Carrier: the hotfix lane, taken on `main` right after the run-owned-seats
close's merge, per R-12 Rulings needed 3; not a `fix` of that close.
