---
id: "d87c"
title: plan fences never see plain-fence code, `replay` runs a block-less plan in an empty tree, and the Keikaku text puts `diff` in a fence the boundary judges
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-boundary-fences-and-plan-checks

Three gaps of `passage-check.js` and the Keikaku text around it, from one
report of seven observations, each reproduced in a scratch repository under
the system temporary directory with `TANTO` set to the skill's path. The
report's other four observations are further occurrences of filed issues and
are recorded there: its items 1 and 3 (a fixed `<merge base>` attributes
foreign commits and a merge under an open plan to the batch) on issue-909c
and issue-f94f, and its items 4 and 5 (a ruling that corrects a plan figure
cannot reach the boundary) on issue-7c28.

**(2) A fence is never run against the code the plan shows in a plain fenced
block.** `roles/keikaku.md` Step 4 has a new file written as a `W` block, and
`replay` builds a scratch tree holding only the paths the plan's blocks name.
Code a plan shows as an ordinary fenced block is in neither, so a tree-wide
fence — a grep over a whole directory — never sees it, passes at plan time,
and fails at the first boundary. A plan whose fence is
`if grep -rn 'return Edit(replies' src; then exit 1; fi` and whose task shows
`return Edit(replies.x())` in a `python` block makes
`passage-check.js replay --plan plan.md --base HEAD` print
`ran (no stated expectation)` and `grep: src: No such file or directory`, and
exit 0.

**(6) `replay` on a plan with no `P`, `A`, `O` or `W` block runs every fence
in an empty tree.** `replayPlan` copies from the base only the paths those
blocks name, so a plan with none gets an empty scratch tree; every `bash` and
`console` fence prints `DIFFERS` with `No such file`, the command exits 0, and
nothing says that no block was found. A fence
`test "$(wc -l < registry.txt)" -eq 1 || exit 1` that passes in the
repository prints `DIFFERS` there. `roles/keikaku.md` Step 4 does not say
that a block-less plan gets only an empty-tree run.

**(7) The Keikaku text puts `diff` inside a fence the boundary judges by exit
status.** `diff` accepts an added line only when the plan quotes it
literally, so a wave that rewords prose always exits 1. `scripts/boundary.js`
`cmdCheck` prints `diff` as informational and takes the verdict from
`boundary` alone, and `roles/jisso.md` says to classify `diff`'s output by
directory; but `roles/keikaku.md` tells a plan to put the `diff` command
inside "How a batch is verified" and says `boundary` judges each fence by
exit status alone. A plan that follows the Keikaku text — a fence
`node "$TANTO/scripts/passage-check.js" diff --plan plan.md --base HEAD~1 || exit 1`
— fails its own boundary on a docs-only wave.

Carrier topic: `passage-check-hardening`.
