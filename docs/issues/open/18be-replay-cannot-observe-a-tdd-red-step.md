---
id: "18be"
title: "`replay` cannot observe a TDD red step, because it applies every passage before running any fence"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the whole-branch reviewer of the `tanto-project-config` run
(2026-09-16) and carried as S-40 in that run's ledger.

`passage-check.js replay` applies all of a plan's passages first and runs the
fenced blocks afterwards. A test-first plan's red step is therefore
unobservable: a fence whose stated expectation is `FAIL` runs against a tree in
which the implementation already landed, so it passes and `replay` prints
`DIFFERS` against the plan's own expectation. The check is red exactly when the
plan was right.

Two candidate fixes, neither applied:

- the plan declares such fences `replay-skip:`, so the mismatch is declared
  rather than discovered; or
- the instrument recognizes a `FAIL`-prefixed expectation as red-by-design and
  inverts its comparison for that fence.

Related: issue-a4e2 (`replay` verifies nothing for a code plan and is noisy on
every skip), issue-ebd9 (which fences `replay` auto-skips), issue-1d95
(`replay-skip:` is per fence, not per line, which constrains the first
candidate fix) — none of the three covers the apply-order-versus-red-step
problem.
