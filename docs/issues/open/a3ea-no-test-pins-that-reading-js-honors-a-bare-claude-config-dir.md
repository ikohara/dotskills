---
id: "a3ea"
title: "no test pins that `reading.js` honors a bare `CLAUDE_CONFIG_DIR`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: shoroku tanto-context-ceiling

Measured at the `tanto-context-ceiling` run's T2 (2026-09-14), over
`skills/tanto/scripts/reading.test.js`'s thirteen cases.

`reading.js` resolves its config directory from `--config` when given and
from the `CLAUDE_CONFIG_DIR` environment variable otherwise. Nothing pins the
second half: every one of the thirteen cases either passes `--config`
explicitly or hits the all-defaults path, so a regression that ignored a bare
`CLAUDE_CONFIG_DIR` with no `--config` flag would pass the suite.

The gap is out of task 2's closed thirteen-case scope, so it was not a
deviation to fix there. The missing case is small: set `CLAUDE_CONFIG_DIR` to
a fixture directory, invoke with no `--config`, and assert the reading comes
from the fixture.

Same shape as issue-5e63 for the other shipped script.

Related: req-04f5, issue-5e63, issue-d92f.
