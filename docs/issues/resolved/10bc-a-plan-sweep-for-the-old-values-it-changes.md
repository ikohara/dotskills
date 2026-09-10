---
id: "10bc"
title: a passage plan sweeps for the terms it introduces, never for the old values it contradicts
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Observed in the context-cost run (2026-09-09). The plan's task 8 ran a forward
sweep (every term the plan introduces, expected in the files the plan names)
and a backward sweep (every file the plan touches, expected to carry the
terms), plus eight absence sweeps. All passed. Yet `skills/tanto/SKILL.md`'s
"Handshake and roster" paragraph still enumerated the roster's columns as
"role, name `[ref]`, cwd, model, branch, mode, started, status" after task 2
had added a `Transcript` column and task 1's Resuming section had keyed the
whole resume on it. The sentence was quoted in no passage of the spec or the
plan; a task reviewer read it and raised it, Kanri ruled a plan amendment
(P8.10), and the sweeps could not have found it — they grep for `transcript=`
and `Transcript`, which the stale sentence does not contain.

A sweep for introduced terms is not a sweep for contradicted prose. The
missing instrument is a sweep over the **old values** of every entity the plan
changes: for a column added, the sentences that list the columns; for a
template added, "There are ten"; for a role case added, "The four cases"; for
a file renamed, its old name. Each hit is either a quoting row in the plan's
File structure table (and so a passage) or an explicit "unchanged, and why".
The spec's "Where each change lives" table is the natural place to demand it,
and Sekkei's Step 4 the place to run it, since the dry run already extracts
the plan's terms.

Related: req-04f5, design-4807 (the two-directional drift of the "where each
change lives" table; the plan conventions), issue-88d3, the context-cost
dogfood report of 2026-09-10.

Resolved by the tanto-sweep plan's task 5 (P5.1), which adds the `O` block
convention to Sekkei's Step 3: an old-value needle per entity the plan
changes, written before the passages and swept against every file the plan
touches rather than only the ones a passage lands in.

From the `2026-09-10-tanto-sweep` conductor ledger:

- S-4: a closed enumeration (a count, a colon-introduced list) is the
  highest-yield `O` needle shape; finding the candidate sentences is
  mechanical, but ruling on them stays judgment — the half of this issue
  D-4 called unmechanisable is only partly so.
- S-58: the tanto-consistency note's "Seventeen skill files" count needed a
  passage the plan itself did not carry, because its `O` sweep ran over
  `skills/tanto/` only; the rule above now sweeps every file the plan
  touches, not only the skill directory.
- S-68: `SKILL.md`'s Artifacts table row for `plan-dryrun.md` was left
  describing the superseded dry run — the third miss of the
  closed-enumeration class in this plan (with S-58's note count and a role
  file's sentence) — and the fix wave repaired it.
