---
id: "235b"
title: "`node --test <directory>` fails with MODULE_NOT_FOUND on this host; the spec and plan wrote that form fourteen times"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Measured in the tanto-sweep run (2026-09-10, batch A). Both the spec and the
plan name `mise x node@22 -- node --test skills/tanto/scripts/` — the
**directory** form of `--test` — as the test-suite command in every Verify
step and "Done when" line that runs the suite, fourteen occurrences across
the two documents. On this host, under both Node 22 and Node 24,
`node --test <directory>` fails immediately with `MODULE_NOT_FOUND`; it is
not that the tests are broken, but that the directory form does not resolve
the way the spec and plan assumed. The **quoted glob** form,
`node --test 'skills/tanto/scripts/*.test.js'`, runs cleanly and finds every
test file the directory form was meant to.

Every seat that ran the suite under this plan had to substitute the glob by
hand, silently, against what the plan's own text said to run — a small but
repeated tax, and a place where a Verify step's literal command and what
actually verifies the tree diverge.

Proposed: the next passage plan that ships a `node --test` verification
command names the glob, not the directory, everywhere it appears — in the
spec's Verification section, the plan's "Done when" lines, and every task's
Verify step alike.

Related: req-04f5, design-4807 (the test-suite command), the tanto-sweep
spec and plan of 2026-09-10.
