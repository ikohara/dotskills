---
id: "d772"
title: The launcher's tests assert exit codes with no message
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-103

The launcher's tests assert an exit code or a count with no message:
`assert.equal(got.code, 0)` fails as `1 !== 0` and says nothing of the stderr
the launcher printed. The two flakes of the run-owned-seats fix wave
(issue-c3cd) cost a diagnosis dispatch with instrumented copies of the test
file before the exit-1 path ("the spawner wrote no result for the Kanri
request") was seen. A failing line's assertion was also misread at first —
the `teishi` test's line 980 is the `resume`-count assertion, not the exit
code — because the failure printed only the line number.

Passing `got.err` as the assertion message in `tanto.test.js`, on every
`assert.equal(got.code, …)` after a `launch`, would have named the cause in
the failure line. This is a test-code change, not prose.

Carrier: Kept — `tanto.test.js`'s assertion messages; no topic in the order
owns the launcher.
