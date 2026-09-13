---
id: "2d84"
title: "`boundaryPlan`'s `expectation` field is captured, tested, and never consumed — which is what let two documents believe `boundary` checks it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Found by the tanto-cost whole-branch review (2026-09-14), alongside its
finding that `roles/keikaku.md` wrongly told plan authors `boundary`
compares output against a fence's `Expected:` paragraph — fixed directly in
the whole-branch review's fix wave, since it actively misled, rather than
filed.

`boundaryPlan` (`passage-check.js:1364-1372`) stores each fence's
`expectation` string in the check object it returns, and a test asserts the
field is populated — but `runBoundary` never prints it, on a `pass` or a
`fail`, and nothing else in the codebase reads it. The field is dead data:
present in the return value and the test suite, absent from the tool's own
output. That is precisely the shape that let two independent documents
(`roles/keikaku.md` and the plan's own "How a batch is verified" section)
conclude `boundary` compares output against the expectation — a returned
struct that carries a field teaches the reader the field is used, even when
it is not read anywhere downstream.

Two fixes, take one: print `expectation` alongside a **failing** check's
output (where it is exactly what a human wants to see next to the wrong
output), or drop the field from the struct entirely and let the tests stop
asserting it. Either removes the trap; printing it is more useful and costs
one line plus a message-shape decision.

Not filed as part of the fix wave: this is a code change to `passage-check.js`
proper (a new subcommand from this same plan, not one of the four the spec's
Out of scope protects), and the fix wave scope was kept to text-only
corrections plus the two dispatch-naming additions. A future small change,
not urgent.

Related: issue-c526 (a different consistency-note premise gap from the same
review, unrelated in cause but similar in shape).
