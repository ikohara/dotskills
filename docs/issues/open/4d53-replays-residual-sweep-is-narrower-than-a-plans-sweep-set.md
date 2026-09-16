---
id: "4d53"
title: "`replay`'s residual sweep covers only the paths a plan's blocks name, which is narrower than the plan's declared sweep set"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-16
---

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**`replay`'s residual sweep is scoped to the paths the plan names, which is
narrower than a plan's sweep set.**"

`replay` ends with a residual sweep for the plan's `O` needles, and it sweeps
the paths the plan's blocks name — the files a passage lands in. A plan's
sweep set is larger: issue-10bc's resolution put the `O` convention on *every
file the plan touches*, and a needle's whole point is that it may survive in a
file no passage edits.

Measured on the tanto-cost plan: the sweep set is **22 files**, the blocks
name **21 paths**, leaving six files `replay` cannot see. That is not a
hypothetical gap — the run's dry-run failure 3 was precisely a second needle
site in a file no block covered, found by hand.

So `replay`'s `0 with hits` line means "no residue in the files a passage
edits", while every reader takes it to mean "no residue". Two fixes, either:
a `sweep-path:` declaration a plan can carry, listing the paths the sweep
must cover beyond its blocks; or sweeping the whole tracked tree whenever the
plan declares a sweep set, and reporting the file count swept so the number
can be read against the plan's own.

Related: issue-10bc (resolved; the convention this is the instrument half of),
issue-d0f4 (a needle that survives by design), issue-f36d (needles the lint
side does not reach), issue-c841 (fences `replay` cannot see at all).

2026-09-16 — the same gap seen from the other side, and a second measured
instance. The `tanto-project-config` whole-branch review observed that the
residual sweep runs over the **applied scratch copy**, not the working tree.
That is the mechanism behind the paragraphs above, stated as a property of the
tree the sweep reads rather than of the path list it walks, and it makes the
two sweeps answer different questions: `replay`'s "is there residue in the
copies of the files these passages edit" against the plan's own "is there
residue anywhere in the tree".

Measured on that run: needle `O2.5` is a **declared survivor** outside the
plan's own file set. The plan's whole-tree grep finds it — one hit, in
`docs/decisions/03f9-the-top-family-in-one-shots-and-a-kind-that-carries-a-model-and-an-effort.md`,
exactly as declared — while `replay`'s residual sweep reads `0` for it. Both
numbers are correct for the tree each sweep looked at, and only one of them
answers the question a reader asks. A line in the `passage-check` contract or
in `docs/notes/tanto-consistency-checks.md` saying which tree the residual
sweep reads would close the reading gap even before either fix above lands.
