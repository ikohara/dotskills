---
id: "688a"
title: the contract mark and the moved-run check are migration code with no removal point
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design: the `contract` mark on a
seat, the launcher's moved-run check, and `.tanto/spawner/contract` are the
code that keeps a run not yet moved to that contract whole. They are to be
removed once every repository that reads this skill has moved, and nothing
says how that is known. This is the migration issue-1298 names (a skill
revision landing mid-plan has no migration rule).

Carrier topic: `09c2-upgrade` (named, held) — the code that keeps a
consuming repository's run not yet moved whole.
