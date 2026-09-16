---
id: "ff62"
title: "how to review a verification-only task is single-sited in a note, and absent where a Jisso looks"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the Jisso of the `tanto-project-config` run while dispatching task 8's
reviewers (2026-09-16).

Task 8 of that plan was verification-only: no commit, no diff. The
`subagent-driven-development` skill's own `scripts/review-package` needs a
`BASE`/`HEAD` commit range to package, so a task that commits nothing has
nothing for it to diff, and the packaged-review path simply does not apply.

That Jisso composed both task reviewers by hand instead: each was told to
independently re-run every one of the task's own checks — including
re-deriving the 27 `O`-needle list from the plan file itself rather than from
the implementer's report — and to compare its own output against the
implementer's claims, rather than to review a package. It worked: both
reviewers' re-runs matched the report exactly, on every value.

The gap is **placement**, not invention. The pattern is already written down —
`docs/notes/tanto-consistency-checks.md` §14 ("A verification-only task
inverts the reviewer's instruction") says outright "Tell that reviewer to
re-run every command and compare". But it is single-sited in a note that no
dispatching role reads at dispatch time, and absent from both places a Jisso
actually looks: `skills/tanto/roles/jisso.md`'s "Verification when the plan
ships documents" section and the `subagent-driven-development` skill text.
Both of those currently say only what substitutes for **tests** in such a
task, never how to **review** one.

A paragraph in one of the two, citing §14, closes it — so the next Jisso that
hits a sweep-and-check task does not improvise the same pattern from scratch.

Adjacent but not the same: issue-71bf (the never-idle-for-a-human prohibition
not naming sweep-and-check tasks), issue-e916 (a single-sited contract — the
same failure mode for different guidance).
