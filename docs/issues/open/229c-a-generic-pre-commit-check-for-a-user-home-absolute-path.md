---
id: "229c"
title: no pre-commit check rejects a user-home absolute path in a tracked file
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-3

`AGENTS.md`'s Never-do forbids committing user-specific paths, and nothing
checks it. A generic pre-commit check would reject `C:\Users\<name>`,
`/home/<name>` and `/Users/<name>` in any tracked file. A repository-name
denylist is deliberately **not** part of this: that is not generic and stays
out. This is the "absolute path" half of the leak the human named; the skill's
own rule against naming another repository is the other half.

The gap is not theoretical: the same class of leak recurred inside the very
topic that filed it — a user-home path introduced during a dry-run fix passed
`lint`, `replay`, `boundary` and a full `plan.review` before a human-facing
cold read caught it (issue-52ef, the plan-lint half of the same guard).

The open point, which is what makes this an issue rather than a chore: whether
the check is built here first, or in the dotrepo base scaffold and flows in
through a refresh. Built here it guards this repository tomorrow and has to be
migrated later; built in the scaffold it guards every repository at once and
waits on that scaffold's own cycle.
