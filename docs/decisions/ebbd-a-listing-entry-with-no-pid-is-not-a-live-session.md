---
id: "ebbd"
title: an entry of the CLI's listing with no `pid` is not a live session
status: accepted
supersedes: []
superseded_by: null
amends: ["1c07", "cdc4"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

The CLI's `claude agents --json` keeps a collected background seat's entry
for hours with no `pid`, no `status`, and `state: blocked` (CLI `2.1.281`).
Every reader that asked whether a session that already existed was running
took such an entry for a live one. `bg-seat-ergonomics`'s fix wave landed a
`pid` filter in the spawner's census, `boundary.js census`, and the
launcher's map; the spawner's `findResumed` still took a stale entry of the
resumed `sessionId` at once (issue-b7bf). The design "bg-seat-fixes"
(2026-09-24), section 3, sets the rule for all four readers.

## Options

- **An entry with no `pid` is not a live session, whatever its `state`,
  for every reader that asks whether a session that already existed is
  running.** Chosen.
- **Reading `state` or `status`.** Rejected: a stale entry keeps
  `state: blocked`.
- **A timeout.** Rejected: identity takes no timeout.

## Decision

An entry of `claude agents --json` that carries no `pid` is not a live
session: its process is gone. The rule applies to the spawner's census, the
spawner's resume lookup, `boundary.js census`, and the launcher's Kanri
check. `findNew` is unchanged: a spawn's session has no earlier process to
leave an entry behind.

This amends decision-1c07 in one part: the spawner reads a `blocked` state
for its notice only from an entry that carries a `pid`, so a stale entry
raises none; the rest of decision-1c07 stands. It amends decision-cdc4
(identity is the `sessionId`, the census its one signal) in one part: the
census lists no entry without a `pid`; the rest of decision-cdc4 stands.

## Consequences

- A collected seat reads `gone` on the spawner's census and under Not listed
  on `boundary.js census`, with a note naming the stale entry, so Kanri marks
  it on the signal the heading names.
- A resume waits for the resumed process's own entry, not the stale one.
- One test per reader, each against a fake listing that returns an entry
  with no `pid`; no test runs the real CLI.
