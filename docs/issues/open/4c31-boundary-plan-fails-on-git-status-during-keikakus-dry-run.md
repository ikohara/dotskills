---
id: "4c31"
title: "`boundary --plan` fails on `git status` by construction when Keikaku dry-runs before the plan's commit"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-66

`boundary --plan` prints `fail 1: git status --porcelain` for a plan that is
not yet committed, and a Keikaku runs its dry run before the commit. The one
check that can fail there fails by construction, so every dry-run report has
to explain it.

Two ways out, and which side changes is the decision: the dry-run
instructions say the plan is committed first when no batch is in flight, or
`boundary` skips that check when the plan file is the only change.
