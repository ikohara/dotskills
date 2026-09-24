---
id: "46d3"
title: the suite's wall time is the launcher's transcript-poll budget
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-24
---

Source: shoroku tanto-bg-seats S-64

175 tests take 133 seconds. Nearly all of that is one cause: each of the
launcher's spawn tests waits out `TRANSCRIPT_POLL_TRIES × TRANSCRIPT_POLL_MS`
(10 s), because the fake CLI never writes a transcript and there is no test-time
seam for the budget. Task 2's own minor finding named it; the per-test timings
confirm it.

Either of two remedies brings the suite under 20 seconds: a
`TANTO_TRANSCRIPT_POLL_MS` seam the tests can set, or the fake writing an empty
`<sessionId>.jsonl` under `CLAUDE_CONFIG_DIR` so the poll succeeds on its first
try. The second keeps the production constants untouched and exercises the real
poll path, which is the reason it is worth weighing against the seam rather than
taking the seam by default.

**2026-09-24, `bg-seat-ergonomics` — the cost after that plan's tests**
(shoroku bg-seat-ergonomics S-18). Measured on Windows 11, Node 22: the three
tanto suites take 257 s wall after that plan's Tasks 1-3 land;
`tanto.test.js`'s "a Kanri resume that fails" alone takes 11.6 s, the
launcher's poll timeouts being the cost, with `--timeout` at `20000` in those
tests. A batch boundary that runs the whole suite pays this every time.

**2026-09-24, `bg-seat-fixes` — 304 s for 215 tests** (shoroku bg-seat-fixes
S-42). Under `mise exec node@22` the suite took 304 s at the whole-branch
review, 301.6 s at the fix wave's boundary, and about five minutes at batch
A's — half the ten-minute foreground ceiling `roles/jisso.md` now sets for a
dispatch's command, and past the Bash tool's 120 s default, which moved
batch A's own run to the background. The figure has grown from 133 s for
175 tests since this issue was filed.
