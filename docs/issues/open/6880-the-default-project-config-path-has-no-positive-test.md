---
id: "6880"
title: "the default project-config path has no positive test, only its miss case"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Found by the whole-branch reviewer of the `tanto-project-config` run as Minor 4
(2026-09-16) and carried as S-50 in that run's ledger.

`skills/tanto/scripts/reading.js` resolves the project config at
`path.join(cwd, ".claude", "tanto.json")` when no `--project-config` is given.
The test suite exercises that default only by its **miss** case — the file is
absent and the loader reports so. Nothing pins that the path is assembled
correctly when the file is there, so a wrong join would pass the suite.

One test closes it: write `<tmp>/.claude/tanto.json`, call the loader with
`cwd: <tmp>` and no switch, and assert the values come from that file. It bumps
the plan's A1.2 count to 19.

Related: issue-a3ea — the same shape for `CLAUDE_CONFIG_DIR`, filed on its own,
so per-gap filing is this tree's habit; issue-5e63 (test gaps in
`passage-check.js` sitting where the whole-branch review found real defects).
