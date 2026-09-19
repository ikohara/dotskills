---
id: "6f3d"
title: a created Markdown file always lands `w/lf` in the working tree, so a stop condition asking for `w/crlf` fails unless something restores it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the tanto-cost run's batches A and D (2026-09-13), recorded in
`.tanto/tanto-cost/batch-A-report.md` (minor, deferred) and
`.tanto/tanto-cost/batch-D-report.md`, "R-21, now a settled measurement"
and "Shoroku candidates".

The tanto-cost plan's Global Constraints predict that a created Markdown
file, once committed, "appears CRLF in the working tree" — the same
`i/lf w/crlf attr/text=auto` every other Markdown file in this repository
shows under `git ls-files --eol`. Measured five for five across this run's
five created files (`templates/agent.md` in batch A;
`roles/keikaku.md`, `roles/kikaku.md`, `roles/hosa.md`, and
`templates/kikaku-decision.md` in batch D): every one of them checked out
`i/lf w/lf` immediately after its commit, and only came out `w/crlf` once
something re-checked it out (`rm` + `git checkout --`, or an equivalent
re-normalize).

So the plan's prediction describes the state **after a fresh checkout**,
not the state right after a write-and-commit in an already-checked-out
working tree — the write tool and `git add`/`git commit` do not themselves
trigger the eol conversion a later `checkout` would. Batch A's occurrence
was carried as a minor because nothing in task 4's own stop condition
required the CRLF form; batch D's stop condition **did** require it on
all four of its created files, and only passed because batch D's own
tasks restored each file explicitly, per Kanri's R-21 (carried forward
from batch A specifically to catch this).

The general rule for a plan that both creates a Markdown file and later
checks its eol: write the restore (`git checkout -- <path>` after the
commit, or equivalent) into the **task's own steps**, not only into the
stop condition — the stop condition is checked after the moment the fix is
cheap, and a plan that omits the restore step will fail its own check for
a reason that has nothing to do with the file's content.

Related: issue-d0c9 (the sibling gap — nothing re-verifies a created
file's content either), issue-a7d2.
