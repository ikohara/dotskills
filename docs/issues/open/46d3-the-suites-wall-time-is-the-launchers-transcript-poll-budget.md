---
id: "46d3"
title: the suite's wall time is the launcher's transcript-poll budget
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
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
