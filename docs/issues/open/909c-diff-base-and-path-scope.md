---
id: "909c"
title: "`diff` has no path scope, and a plan's merge base is not always the branch's only commits"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-15
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

2026-09-14 — the `tanto-context-ceiling` run hit the untouched half at **all
five** of its own boundaries. The plan named its base commit by the resolvable
form above, so the base half held; what `diff` reported at every boundary was
still the whole branch's added lines rather than the plan's declared paths, and
Kanri ruled it held each time (that run's ledger, R-22). Five boundaries in one
run, each needing a human-side ruling to dismiss, is the datapoint that keeps
this issue alive: the base-commit workaround does not shrink the noise at all
once a branch carries the run's own docs and issue commits alongside the plan's.

2026-09-15 — a structural source of the base-half noise that the paragraphs
above do not name, observed by the `tanto-sweep-2` Kanri (`dotskills-a1`) and
recorded as a forward-looking data point for `passage-check-hardening`,
alongside S-33/S-36/S-37 in that run's own ledger. R-9, R-10, and R-12 each
showed the same pattern: the outgoing Kanri's own exit-shoroku commit lands on
the shared branch after the `diff` base was last resolved but before the next
batch's first task commit runs, showing as false `unaccounted-added` noise at
the following boundary. R-12 held stable through batch C's own dispatch (no
drift that time — that Kanri re-verified the base immediately before sending
the batch C prompt and it was unchanged). But that Kanri's own exit-shoroku
commit, landing as part of its handover, reproduces the identical structural
cause once more: it lands after R-12's base and before batch D's first commit.
The successor should expect to re-resolve the `diff` base a fourth time at
batch D's boundary, the same way R-9/R-10/R-12 each did — flagged here rather
than left to be rediscovered as a fresh surprise.

2026-09-15 — the complement to the paragraph above, observed by the
`tanto-sweep-2` Kanri (`dotskills-4c`) at the plan's final boundary: where the
base-drift class keeps reappearing until its queued durable fix (S-33) lands,
an accepted, traceable `diff` exception can resolve itself without a further
ruling when a later task's own passage block happens to cover the same lines.
The one off-plan line in `templates/kanri-handover.md` from task 5 (R-11) and
the two MD038-suppression comment lines in `roles/kanri.md` from task 11
(R-17) were both expected, per their own rulings, to persist as accepted
exceptions at every later boundary through the plan's close — but batch E's
`diff` came back fully clean, the first clean boundary this plan produced,
because task 13's whole-tree sweep block happened to declare passage text that
already included those lines. Neither exception needed re-litigating; `diff`
simply stopped reporting them. A note for `passage-check-hardening` beside the
base-drift class: a `diff` exception carried across boundaries is not
necessarily a standing cost through to the plan's close — a later sweep or
whole-tree task can absorb it for free — and Kanri's own boundary check should
not assume an earlier-accepted exception will keep reappearing without
confirming it directly, the way this boundary's own check did.
