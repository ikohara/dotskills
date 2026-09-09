---
id: "7d14"
title: Sekkei's plan dry run and the plan reviewer's dry run are the same work done twice
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

`skills/tanto/roles/sekkei.md` Step 4 asks Sekkei to run every verification
command the plan states, once, on this machine (step 3), and to dispatch a
read-only plan reviewer (step 1) whose dispatch, under the passage-plan
conventions of design-4807, asks for a dry run too: apply the passages to
scratch copies and run every command against them. In the
requirement-extraction run of 2026-09-09 both happened, independently and in
parallel — the `opus` reviewer wrote its own application script in its
scratch directory, Sekkei wrote `apply_passages.py` and `dryrun_checks.sh`
in the session scratchpad — and the two runs agreed on every one of the
plan's values. The duplicate cost about one `opus` subagent's tool calls
(the reviewer's dry run was most of its 30 tool uses) plus a Sekkei turn on
the strongest family, for no additional finding: everything either run
caught, the other caught.

Two candidate fixes, not exclusive:

- The plan ships the application script as one of its own blocks — the
  passages and anchors are already in the plan, so the script is a few
  lines that reads them — and both the reviewer and Sekkei run that block
  rather than each writing one. The consistency note's point 5 ("one script
  settles what a spec otherwise asserts by reading") already points here.
- Sekkei's step 3 takes the reviewer's recorded dry run as its evidence and
  spot-checks a few commands rather than re-running the set; or the order
  is reversed and the reviewer takes Sekkei's `plan-dryrun.md`. Either way
  one run is the record and the other reads it.

A data point for the context-cost topic: the duplicated work sits on the
two most expensive seats of the run.

Related: issue-5830 (the cold read's cost), issue-e5a2 (a session-length
signal), design-4807 (the plan conventions).
