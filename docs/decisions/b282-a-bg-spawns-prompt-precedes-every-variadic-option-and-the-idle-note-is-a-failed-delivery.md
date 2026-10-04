---
id: "b282"
title: a `--bg` spawn's prompt precedes every variadic option, and the CLI's idle note on a spawn is a failed delivery
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-04
updated: 2026-10-04
---

## Context

Every shoki seat the spawner started blocked before its first turn: eight
spawns of eight, from 2026-09-22 to 2026-10-03, each listed `blocked` with
no transcript until the human attached and typed its `brief:` line. No other
seat ever blocked at its start. issue-dff9 read it as a delivery race and
issue-fd4b as a startup dialog; both were hypotheses.

A shoki request is the only one that carries `addDir`, and the spawner
pushed `--add-dir <dir>` before the prompt. `claude --help` lists
`--add-dir <directories...>`, a variadic option that takes every following
argument until the next option. Three by-hand probes on 2026-10-03 settled
it: with the prompt after `--add-dir`, the CLI printed
`(idle — send a prompt to start)` — its line for a session started with no
prompt — and the prompt was consumed as a second directory; with the prompt
before `--add-dir`, the seat ran its first turn and finished, from the main
checkout and from a worktree alike. The probes are recorded in
`docs/notes/claude-code-sessions-observed.md`. Decided in the shoki-seat
design of 2026-10-03.

## Options

- **The prompt before every variadic option, and the idle note read as a
  failure** (chosen).
- **Re-send the `brief:` line by `SendMessage` after a `blocked`
  sighting.** Rejected: the cause is an argument order, not a delivery, and
  whether a message reaches a session that never ran a turn is unmeasured.
- **A headless shoki (`claude -p`).** Rejected: not listed by
  `claude agents`, not attachable, and whether such a session can
  `SendMessage` is unmeasured — a redesign where a reorder suffices.

## Decision

`spawnArgs` puts the prompt after the single-value options and before every
`--add-dir`. When `claude --bg`'s stdout carries the CLI's note
`(idle — send a prompt to start)`, the spawn has failed: the result is
`error: prompt not delivered: <the line>`, the seat is recorded in
`seats.json` with `undelivered` and removed with `claude rm`, and the log
says so under a prefix of its own. The check is the spawn's alone; on a
`resume` the same note is the CLI's normal line.

## Consequences

- A regression of the order is a result file with `error` that Kanri reads
  at its next act, never a `blocked` seat that waits for the human.
- The cause is closed at the spawn, so the no-first-turn notice of
  decision-6c00 is left for causes not yet seen.
- issue-dff9 and issue-fd4b close with this decision; the cause is recorded
  in issue-dff9's resolution.
