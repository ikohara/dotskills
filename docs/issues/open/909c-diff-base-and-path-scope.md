---
id: "909c"
title: "`diff` has no path scope, and a plan's merge base is not always the branch's only commits"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
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
