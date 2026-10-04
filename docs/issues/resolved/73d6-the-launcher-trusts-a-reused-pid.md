---
id: "73d6"
title: "the launcher trusts a reused PID: a dead spawner reads as running, and `tanto down` can signal an unrelated process"
severity: high
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-04
---

Source: inbox 2026-09-30-spawner-pid-reuse-false-liveness

`scripts/tanto.js`'s `livePid(root)` decides whether a spawner is running by
checking only that some process holds the PID recorded in
`.tanto/spawner/pid` (`process.kill(pid, 0)`), never that the process is the
spawner. `startSpawner(root)` skips launching one whenever `livePid(root)`
is truthy.

On Windows, PIDs are reused quickly. Once the spawner dies and the OS hands
its PID to an unrelated process, `livePid()` reports the spawner alive. The
launcher then writes a request to `.tanto/spawner/requests/`, waits for a
result nobody writes, and fails with
`tanto: the spawner wrote no result for the <op> request; see .tanto/spawner/log`
— on every invocation, since each re-derives the same verdict, while the
requests directory accumulates unprocessed files. The same unchecked call
gates `cmdDown`: with a reused PID, `tanto down` sends `SIGTERM` to whatever
process now holds it.

Reproduction: `node "<repo>/skills/tanto/scripts/tanto.js" down`; then
`echo $$ > "<repo>/.tanto/spawner/pid"` and
`node "<repo>/skills/tanto/scripts/tanto.js" kanri` (`$$`, the shell's own
PID, stands in for a reused one). Expected: a fresh spawner starts.
Actual: `startSpawner()` returns `false`, the request is never picked up,
and the command fails after the wait timeout. Severity high: once it
triggers, the launcher is unrecoverable without deleting the stale pidfile
by hand, and nothing points at the cause.

Proposed (the reporter's): verify identity, not liveness — record something
process-specific beside the PID at the spawner's start (its start time, or a
random token the spawner re-affirms on each census pass) and compare it
before trusting the PID; since `process.kill` alone has no cheap portable
identity check, likely a spawner heartbeat timestamp beside `seats.json`,
checked for recency.

Resolved by the shoki-seat design
(`docs/superpowers/specs/2026-10-03-shoki-seat-design.md`, section 4),
decision-262a: the spawner writes `.tanto/spawner/heartbeat` at every pass,
the launcher holds a spawner live only when its PID answers and the heartbeat
is within sixty seconds, and no signal is ever sent to a recorded PID whose
heartbeat is stale or missing. The cost that decision accepted — a real
spawner behind a stale heartbeat left running beside the new one — is not
harmless as built, because the requests are not claimed by rename; that is
issue-f03b.
