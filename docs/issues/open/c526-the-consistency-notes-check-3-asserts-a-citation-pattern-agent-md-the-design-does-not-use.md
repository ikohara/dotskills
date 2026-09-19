---
id: "c526"
title: "the consistency note's check 3 asserts a citation pattern for `templates/agent.md` that the design does not use"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: session 2026-09-14

Found by the tanto-cost run's batch F task 21 reviewer (2026-09-14),
recorded in `.tanto/tanto-cost/batch-F-report.md`, "Rulings" (landed as
written under R-30's resolution; not fixable inside this plan).

`docs/notes/tanto-consistency-checks.md`'s check 3, after task 21's
passage, asserts seven `templates/agent.md <- roles/<role>.md` rows — one
per role, each expecting that role's own file to cite `templates/agent.md`
by name. The design does not use that citation pattern: the agent
definitions are rendered by every role at its start from the merged
config, a mechanism `SKILL.md` states once, not something each role file
individually names its template source for.

Same family as R-30 (the ten-form check) and issue-9f2c's kind of finding:
a check whose premise does not hold once landed, reported to Kanri per
task 21's own instruction rather than fixed. The correction — either
dropping the seven-role breakdown for a single shared-mechanism row, or
citing wherever `SKILL.md` actually states the render-at-start rule —
needs the same judgment a future plan touching the consistency note would
bring; not fixable inside the tanto-cost plan since `docs/notes/tanto-consistency-checks.md`'s
passage under task 21 has already landed.

Related: issue-91f6, issue-4d8a (the same run's other instrument-premise
gaps).
