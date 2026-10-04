---
id: "262a"
title: the launcher trusts a heartbeat, not a PID
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-04
updated: 2026-10-04
---

## Context

The launcher decided whether a spawner was running by checking only that some
process held the PID in `.tanto/spawner/pid`. On Windows PIDs are reused
quickly, so a dead spawner could read as running — the launcher then waited
on requests nobody took — and `tanto down` could signal an unrelated process
(issue-73d6). Decided in the shoki-seat design of 2026-10-03.

## Options

- **A heartbeat timestamp the spawner writes at every pass, read for
  recency** (chosen).
- **A random token re-affirmed each pass.** Rejected: a timestamp carries
  recency as well as identity, and recency is what the launcher needs.
- **Signal the stale PID before starting a new spawner.** Rejected: it is the
  exact act issue-73d6 files, against what may be an unrelated process.

## Decision

The spawner writes `.tanto/spawner/heartbeat` — epoch milliseconds — at
every pass, around every request and inside every poll loop. The launcher's
`liveSpawner` holds a spawner live only when its PID answers and the
heartbeat is within sixty seconds. A stale or missing heartbeat with a live
PID is ignored and logged, and a new spawner starts; no signal is ever sent
to the recorded PID. `tanto down` on a PID with no heartbeat file signals
nothing and tells the human how to end the process by hand.

## Consequences

- issue-73d6's "`tanto down` can signal an unrelated process" is closed in
  full.
- The accepted cost: a real spawner whose heartbeat went stale is left
  running beside the new one until the next `tanto down`. The design held
  that cost harmless on the ground that both spawners take requests by
  rename, so none is handled twice.
- As built, a real spawner behind a stale or missing heartbeat keeps running
  beside the new one and each request is handled twice, because the rename
  the design relies on is not implemented; issue-f03b carries it.
