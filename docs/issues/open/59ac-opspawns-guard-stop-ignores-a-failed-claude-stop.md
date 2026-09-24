---
id: "59ac"
title: "`opSpawn`'s guard stop ignores a failed `claude stop`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-28

The ledger assigned S-28 twice; this is the row whose source is
`batch-A-report.md`.

The stray branch of `opSpawn` in `skills/tanto/scripts/spawner.js` runs
`runClaude(["stop", …])` on a seat found outside the root at its first
sighting and reads nothing of the result. Its sibling `strand` documents a
retry contract for the same call. A seat the guard meant to stop may
therefore keep running in its worktree while the spawner believes it
stopped.

Parked by the bg-seat-ergonomics batch A's Task 1 review as a genuine but
narrow defect. The fix: read the stop's result as `strand` does, and retry or
report a failure, with a test whose fake `claude stop` fails.
