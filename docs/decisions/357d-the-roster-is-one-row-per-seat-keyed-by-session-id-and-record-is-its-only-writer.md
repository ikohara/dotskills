---
id: "357d"
title: the roster is one row per seat, keyed by sessionId, and record is its only writer, refusing what the template does not name
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-08
updated: 2026-10-08
---

## Context

The roster kept two tables, a sessions table and a Residency table joined to
it by the name string, and its writer matched rows by name, validated no
header, and left two writes to hand. Every recorded roster defect came from
that writer: issue-dfb3's seven measured duplicate rows, issue-f07a's three
corrupted handover rows, issue-e84c's three collided ledgers, issue-9ca6's two
partial measurements, and the silent drift of issue-5a68, issue-4914, and
issue-9c6f. decision-cdc4 had already made the `sessionId` every seat's
identity, but not the roster's key or its one writer. Decided in the spec
`Design: roster-ledger` of 2026-10-07, sections 1 and 2.

## Options

- **Add a `Session` column to a kept Residency table** (dialogue Q-4 option
  A). Rejected: the join stays, and so does the "move both as one row" rule
  the archive move must implement.
- **Warn and write on a header mismatch** (issue-5a68's proposal, second
  half). Rejected: a warning on stderr at a boundary is read by nobody, and a
  blank cell written past it is the defect.
- **Keep a `[ref]` in the roster for disambiguation.** Rejected: retired by
  run-owned-seats; `SendMessage`'s own error asks for it at the send.
- **Write the full model id in the Model cell** (issue-20de's ask). Rejected:
  the id is known to the seat alone and no result or state entry carries it,
  so the cell holds the family and the template says so.
- **Key a peer reading by role and topic.** Rejected: the roster holds more
  rows than held seats (a Sekkei's successor beside its predecessor, a kept
  Kaiseki beside a new one, one `live` and several `queued` Jissos), so "one
  live row per role and topic" is not a fact `record` can rely on.
- **Resolve a peer's name inside `record` at the boundary.** Rejected: the
  state file's name is rewritten every fifteen seconds, so the name is
  resolved at receipt instead, while it is fresh.
- **One table, one row per seat, keyed by the Transcript cell's `sessionId`,
  with `boundary.js record` its only writer, checking every table's header
  against the skill's template and refusing what the template does not name**
  (chosen).

## Decision

The roster keeps one table of twenty columns, the former sessions columns
followed by the reading columns, and the Residency table goes. A row is keyed
by its Transcript cell's basename, the `sessionId`, and found by nothing
else; the Name cell is a record rewritten at every rename, never a key.
`record` reads the header of every table it is about to touch, compares it
cell for cell with the template's, and on any mismatch writes nothing and
names `boundary.js migrate`. A pipe in a value is escaped by one cell grammar
that every reader shares; a Transcript cell that is not `<uuid>.jsonl` and a
cell with a newline or a control character are refused. Rows are created by
`--seat`, `--init`, and `--succeeds` alone, and every Events line and Name
cell of the roster goes through `record`. The archive keeps the roster's row
whole, with an `Ended` column, and nothing is joined.

## Consequences

- No decision is amended. decision-7a19 retired `cleared`, and this decision
  gives `record --status` the vocabulary 7a19 left; decision-39fb stands
  whole, a `dead` row's resume still putting it back to `live`, now by
  `--status`.
- An old-shape roster, archive, or ledger is refused until `migrate` rewrites
  it, once; the one join by name the design keeps is inside `migrate`.
- A Kanri resolves a peer's name to its `sessionId` at receipt, so a reading
  whose name `seat` cannot resolve is a ledger event, not a row.
- The current shape is design-4807's "The roster and the conductor ledger".
