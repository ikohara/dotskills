---
id: "ac9d"
title: Kanri's frame command keys on `### Task` and prints a plan whose tasks are `## Task` whole
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-12
---

`skills/tanto/roles/kanri.md`, "When the plan lands", gives Kanri an `awk`
frame command that collapses every task's steps to a line count, so that the
cold read covers the plan's frame and not its steps. The command starts a
task at `^### Task` and ends the step region at the next `^##`. The
kisou-refresh plan (2026-09-11) carries its tasks as `## Task N:` — the depth
its drafter produced from the writing-plans skill — so the command matched no
task and printed all 3402 lines. Kanri widened the pattern to `^##+ Task` by
hand (kisou-refresh ledger R-15) and read a 1335-line frame instead.

Two fixes, either one: the pattern in `roles/kanri.md` accepts both depths
(`^##+ Task`, and the region end stays `^##`, which for an H2 task means the
next task's own heading — correct); or `roles/sekkei.md` fixes the task
heading depth a plan must use, so that every instrument keyed on it agrees.
The first is the smaller change and does not constrain the drafter.

Related: issue-2e52 (a staged frame — the first stage would have made the
depth matter less), issue-7281 (task size, which the frame command's step
counts feed). Under contract rule 11.
