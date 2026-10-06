---
id: "7c87"
title: a terminal seat is named by the spawner at its spawn, never at its resume
status: accepted
supersedes: []
superseded_by: null
amends: ["73c3", "1ea3"]
amended_by: ["7a19"]
created: 2026-09-24
updated: 2026-10-06
---

## Context

A seat the spawner started went by the harness's auto-title, which names no
repository and changes after the spawn, so the human could not tell one
repository's background seats from another's in the CLI's listing, and a
name read at one moment was not the name at the next. The name had to come
from somewhere the run controls, and it had to survive a resume.

The bg-seat-ergonomics design spec of 2026-09-23 measured two facts this
decision rests on (its Measured 3 and 4): a name given at the spawn is
registered as the user's own, which no auto-title replaces, and a flag-less
`claude --resume <id> --bg` brings it back from the job's saved options.

## Options

- **The spawner names the seat at its spawn**,
  `<repo>-<role>[-<topic>]-<hex>`. Chosen.
- **`--name` on the resume.** Rejected: any flag on `--resume … --bg` starts
  a copy under a new id (`docs/reports/2026-09-20-tanto-bg-seats-probe.md`,
  item 6).
- **The harness's auto-title.** Rejected: it names no repository and changes
  after the spawn.
- **A name in Kanri's request file.** Rejected: the scheme belongs in the one
  process that runs `claude --bg`, not in every session that writes a
  request.

## Decision

A terminal seat is named by the spawner at its spawn, never at its resume,
as `<repo>-<role>[-<topic>]-<hex>`. The name is registered as the user's own,
so no auto-title replaces it, and a flag-less resume brings it back.

**This ADR amends two accepted ADRs; each stands in every respect not named
here.**

- **decision-73c3** — its "no `tanto` session is renamed after it has
  started" rule, for terminal seats: the spawner gives a terminal seat its
  name at the spawn, in place of the name the session would otherwise take.
  73c3's rule for the seats the human opens, and the roster as the address
  book, stand.
- **decision-1ea3** — what the spawner does at a spawn: it also names the
  seat. The spawner remains the only process that runs `claude --bg`,
  `stop`, and `rm`, with no exception.

## Consequences

- The CLI's listing tells a repository's seats, their roles, and their topics
  apart at a glance, which the human needs when two runs share a machine.
- A resume must stay flag-less; anything that adds a flag to it loses the
  seat's id, and with it the name.
- The reasoning is the bg-seat-ergonomics design spec of 2026-09-23.
