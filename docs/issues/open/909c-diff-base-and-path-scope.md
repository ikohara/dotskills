---
id: "909c"
title: "`diff` has no path scope, and a plan's merge base is not always the branch's only commits"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-11
---

Measured at the tanto-sweep run's batch A boundary (2026-09-10), by Kanri.
`diff` classifies every added line of `git diff <base>` and carries no path
scope, and the plan named the merge base as if the branch carried only the
plan's own commits. On a branch that also carries a spec, docs commits, and
the human's own config changes, `diff` reported **1197 lines**, none of
which the plan touches — the boundary check is technically correct and
practically useless at that volume.

Two ways to close the gap, either sufficient on its own:

- the plan names its **base commit** explicitly (the last commit before
  task 1), rather than relying on a merge-base computation that includes
  everything landed on the branch before the plan's own commits; or
- `diff` itself scopes to the paths the plan's File structure table names,
  printing everything else as "outside the plan" rather than counting it
  against the boundary.

This run used the base-commit workaround. The next plan decides which of
the two becomes the rule, or whether both are needed together (a named base
commit does not help a branch that mixes plan and non-plan commits **after**
that point, which a path scope would still catch).

Related: req-04f5, design-4807 (the boundary check), issue-7481 (the
`passage-check.js` instrument `diff` is part of).

The kisou-refresh plan (2026-09-11) answered the first way, and found the
form that makes "the last commit before task 1" resolvable from the tree
rather than written down: **the parent of the first task's first commit**,
`git log --diff-filter=A --format=%H -1 -- <the file task 1 creates>` with
`^` appended, named in the plan's Global Constraints. It is stable in both
directions that matter — a commit landing before task 1 (a spec amendment,
an issue filing, a `skills/tanto/` hotfix, Kanri's T1 write-out) falls
inside the base, and a fix round that later edits the created file does not
move it, because `--diff-filter=A` names the commit that added it. A commit
landing between batches that no task wrote is still reported, which is
`diff` doing its job. It does not resolve until task 1 has committed, and
nothing needs it earlier: batch A is not `diff`-checked. Two forms were
tried and dropped first: the plan's own commit, which a `skills/tanto/`
hotfix landed after and before any task; and a local tag set by Kanri when
batch A is dispatched, rejected as state outside every file the protocol
keeps — untracked, unmentioned by `git status`, gone with the clone, and
dependent on a session remembering to set it. The rule lives in that plan
today and reaches `roles/sekkei.md` through a rule-11 plan. The path-scope
half of the gap is untouched by this.
