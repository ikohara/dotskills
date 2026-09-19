---
id: "235b"
title: "`node --test <directory>` fails with MODULE_NOT_FOUND on this host; the spec and plan wrote that form fourteen times"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-19
---

Source: shoroku tanto-sweep

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

Confirmed again in the tanto-workspace run (2026-09-12), on both Node versions
this host carries: `node --test skills/tanto/scripts/` fails identically under
`mise x node@22` (v22.23.2) and under bare `node` (v24.16.0), with
`Cannot find module '…\skills\tanto\scripts'`. The file form
(`node --test skills/tanto/scripts/passage-check.test.js`) runs the suite —
63 tests, 63 pass — at the pinned floor and at v24 alike.

The sharper part of this occurrence is the dating. This issue was filed
2026-09-10; the tanto-workspace spec was written 2026-09-11 and its plan
2026-09-12, both **after** it, and both scheduled the directory form anyway —
once in the spec's Verification section and three times in the plan. The
failure was then rediscovered at the batch boundary by the session running the
check. See issue-ea3c for the general gap this is one of two instances of.

Related: req-04f5, design-4807 (the test-suite command), the tanto-sweep
spec and plan of 2026-09-10, issue-ea3c.

Confirmed twice more in the `tanto-sweep-2` run (2026-09-16), at the batch
boundaries and again at that plan's task 13, with the same result both times:
`mise x node@22 -- node --test skills/tanto/scripts/` fails with
`MODULE_NOT_FOUND` under Windows Git Bash while the suite itself is clean.
Passing the two `.test.js` files explicitly runs **98 tests, 0 failures**. That
is the current size of the suite and the current figure for this issue's
dataset — a Windows Bash-tool pitfall, not a real break, now measured across
three separate runs.

**2026-09-17, one more dated occurrence** (`shoroku-at-close`, Kanri's own
boundary verification at batch A): `mise x node@22 -- node --test
skills/tanto/scripts/` — the directory form, still what that plan's own
Verification text and the ledger template say to run — failed `MODULE_NOT_FOUND`
on this host, while the quoted-glob form
(`node --test 'skills/tanto/scripts/*.test.js'`) ran clean, 103 of 103. Four
runs now, the same two forms, the same result.
