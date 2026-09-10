---
id: "7481"
title: the passage plan's strongest check lives in a scratchpad and dies with its session; make it a script
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Observed in the context-cost run (2026-09-09). design-4807 names
reconstruct-and-compare — replay the plan's old→new passages onto the
merge-base copy and diff against the tree — as the strongest alignment check,
"cheap enough to schedule by name", and the context-cost plan was the first
to schedule it, at its batch boundaries, using the dry run's application
script as the replay. That script lived in Sekkei's scratchpad, named in
`plan-dryrun.md` under another session's id, and was gone by the batch B
boundary — the last boundary, the one that most needs the check. Jisso ran
the same guarantee from the other side instead: every added line of the
merge-base diff must be text the plan literally quotes (443 added lines
across thirteen files, 0 unaccounted; three removed lines outside any fenced
block, each a replacement the plan mandates in prose). The whole-branch
reviewer then did the true replay in its own sandbox from the plan's fenced
blocks, 44 replacement passages each matching exactly once.

Three facts follow. The instrument is rebuilt from scratch by every seat that
needs it (the dry run, the executor at the boundary, the reviewer), at that
seat's cost. The diff-side formulation needs only the plan and `git diff`, so
it does not depend on any session's scratchpad. And the dry run's command
runner — 211 commands in the context-cost plan, a 362,000-token `sonnet` seat
— is the same parser applied to the plan's other fenced blocks.

Proposed: one script under `scripts/`, input a plan path and a base ref,
output the added lines of the merge-base diff that the plan does not quote,
the removed lines outside any fenced block, and, on request, the plan's
commands run in order with their output beside the stated expectation. It is
named as the boundary check in a plan's "How a batch is verified", run by
Jisso at each boundary and by the whole-branch reviewer, and used by Sekkei's
Step 4 in place of an agent dry run — Sekkei then adjudicates the failures
the script prints (the context-cost dry run's twelve automated FAILs were six
plan defects and six harness artifacts, and that judgment stays with Sekkei).
Cons: the script depends on the plan shape writing-plans produces (as the
frame command does, issue-5e47), and a script prints raw results where the
agent dry run explained them.

Related: req-04f5, design-4807 (plan conventions), issue-88d3, issue-7d14
(resolved), issue-5e47, the context-cost dogfood report of 2026-09-10.

Resolved by the tanto-sweep plan's tasks 1 to 3, which build
`skills/tanto/scripts/passage-check.js` (and its test file) as the durable
script this issue proposed — `lint`, `replay`, `diff` and `verify`
subcommands landed under the skill itself, not a repository's own
`scripts/` — and by task 5's P5.2 and task 7's P7.2/P7.5, which put it in
Sekkei's Step 4, Jisso's boundary check, and the whole-branch reviewer's
instrument.

From the `2026-09-10-tanto-sweep` conductor ledger:

- S-10: the whole-branch reviewer is Kanri's dispatch, so the instrument for
  it lands in `roles/kanri.md`, not `roles/jisso.md`; the same mis-location
  will recur for any instrument the final review runs.
- S-22: specifying an instrument's exclusions by example rather than by list
  is where two implementers diverge — `replay`'s spec sanctioned one
  exclusion, the dry run needed rules for 58 of 73 commands, and those rules
  lived in a dispatch prompt, this issue's own failure mode one level up.
- S-36: the letter of an issue filed from inside one repository can
  silently scope a skill-wide instrument to that repository (this issue said
  "under `scripts/`", the dev-tool directory; `tanto` runs in any
  repository) — the script landed under the skill instead.
