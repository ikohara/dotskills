---
id: "ca6d"
title: a plan-mandated Important goes to the fix wave, not to a fix round inside the batch
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-08
updated: 2026-10-08
---

## Context

In the roster-ledger run of 2026-10-07 and 2026-10-08, a passage plan that
edits the skill's own scripts and contract, most quality reviews returned
Important findings that the reviewer itself labeled plan-mandated: the plan's
passages spell the code or the text, so the defect is in the passage's bytes,
not in the implementation. Kanri ruled at each boundary where those findings
go. R-6 item 6 put batch A's on the fix wave's list. R-8 item 1 added batch
B's four beside them. R-11 made the fix wave the plan's only one, with its
list closed after the whole-branch review.

The question had been raised before and left open: issue-cabf asked whether
an implementer may repair a defect inside a mandated block under a numbered
ruling, after the tanto-bg-seats run parked about twenty such defects for one
fix wave and its first Critical stayed on the branch through five batches.

## Options

- **Fix each plan-mandated Important in a fix round inside its batch.**
  Rejected: each fix changes lines a passage writes, so `verify --task N`
  fails by design and `passage-check diff` gains unaccounted lines at every
  boundary, and a fix round per task would have cost about 200k tokens each.
- **Keep design-4807's conditional rule: fix in the batch a finding that is
  mechanically verifiable and confined to prose or test assertions, and park
  only production-code findings that carry an architectural trade-off.**
  Rejected: a prose-only fix to a passage's bytes still fails `verify --task N`
  and still adds unaccounted lines to `passage-check diff`, exactly as a code
  fix does, and this run's fix wave took nine text Importants of that class.
  The exception bought nothing the fix wave does not do once for the whole
  branch. (Added 2026-10-08, before merge, at the shoroku review: the
  original record left this existing rule out of its options.)
- **Gather them for the fix wave, which runs `verify` for every task and
  accounts for supersession** (chosen).

## Decision

A plan-mandated Important, a finding in the bytes a plan's passage writes,
is not fixed inside the batch that landed it. The Jisso reports it, Kanri
rules it onto the fix wave's list at the boundary, and the fix wave, which
runs `verify` for every task and accounts for every passage it supersedes, is
where passage-superseding fixes land. This answers issue-cabf.

## Consequences

- The SDD fix loop can sit idle for whole batches: two of this run's batches
  ran with no fix round, all their Importants plan-mandated (the case
  issue-2a80 records, with the plan-review remedy that would catch the class
  earlier).
- The fix wave's boundary fails by design, since the wave departs from the
  passages on purpose; issue-96f2 records the accepted-departures list that
  would let `fail` mean something again.
- Consistent with decision-aacb: the fix wave is a batch of its own key, and
  the batches that ran keep their files.
