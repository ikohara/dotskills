---
id: "32f9"
title: a shusei batch has no Verify block, so the boundary's plan-keyed passes print `fail`
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-3

A close's shusei batch — the `Recommended fix` group's one task — has no
Verify block in any plan, so the boundary's plan-keyed passes read the whole
branch and print `fail` (passes 2, 6 and 8 at the `shoki-seat` close), and the
shusei's batch report cannot use `passage-check.js verify`, which needs
`--plan` and `--task`. `roles/kanri.md` says a shusei batch is verified
against no plan, but `boundary.verify` has no "verified against no plan" mode;
the verdict is then accepted over an expected `fail` by a ruling at every
close that has a fix group.

The repair: `boundary.verify` treats the shusei the way the sweep's fix batch
is treated, verified against no plan, and the report's verification names
the commands that fit it.

Carrier topic: `passage-check-hardening`.
