---
id: "158b"
title: the census has seven headings, each with one act, and a queued seat's absence is marked by nobody
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-08
updated: 2026-10-08
---

## Context

The census compared the roster with the session listing and the spawner's
state file through a bullet list that left cases unreconciled: issue-007e's
four findings and its fifth case (a `dead` row whose seat came back and that
nobody wrote `live`), issue-cd46's `stopped` row whose seat ran seven hours,
issue-78b3's `queued` row marked against a `gone` entry, and issue-c330's
`renamed` mark that no reader read. Decided in the spec
`Design: roster-ledger` of 2026-10-07, section 3.

## Options

- **`record --status stopped` writes the `stop` request itself** (issue-cd46's
  first repair). Rejected: a file writer that also writes spawner requests
  mixes two instruments, and a census heading catches the case whichever side
  forgot.
- **A keep-alive or a timeout for the `queued` seat.** Rejected: the
  rejections recorded in decision-39fb stand.
- **A single site for the `dead`-to-`live` write.** Considered in the spec's
  first draft and withdrawn in review: it would have amended decision-39fb
  without the human's word, and the dialogue agreed an added heading, not a
  changed resume rule.
- **Seven headings, each the row of one table that names the row status, the
  state-file status, the listing, and Kanri's one act** (chosen).

## Decision

The census prints seven headings in a fixed order: Listed, Parked, Ended,
Returned, Not listed, No session id, Not held. Each case is one row of a
table carried in `SKILL.md`'s "The census", naming Kanri's act. The new
heading is **Returned**: a `stopped` or `dead` row whose seat is running or
listed. For `dead`, Kanri writes `--status live`. For `stopped`, Kanri writes
a `stop` request unless one is already queued. A `queued` row the listing does
not show is printed as waiting for its batch line and marked by nobody. The
census's `— renamed` stays derived from the listed name against the Name
cell, and the spawner's `renamed` mark and its `ack` op go.

## Consequences

- decision-39fb is amended in no part: a `dead` row goes `live` at the wake
  that sends it a line, and Returned catches the case nobody wrote.
- The census runs before `boundary.js archive` at a close, so a `stopped` row
  whose seat still runs gets its `stop` request before the row leaves the
  roster.
- The census on a roster whose header is not the template's refuses and names
  `migrate`, the same refusal decision-357d gives `record`.
