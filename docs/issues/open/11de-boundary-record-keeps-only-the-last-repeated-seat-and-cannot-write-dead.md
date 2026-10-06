---
id: "11de"
title: boundary record keeps only the last repeated --seat and its --status cannot write dead
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-75

Two gaps of `boundary.js record`, measured by a Kanri of the run-owned-seats
run:

- Repeating `--seat` on one call writes only the last seat's row, with no
  error, so five spawned seats take five calls.
- `--status` accepts `live`, `cleared`, `stopped`, and `queued` but not
  `dead`, which the roster's Status column and the census rule use, so a
  `dead` row is a hand edit.

Kin: issue-5a68 (`record` validates no ledger schema), issue-20de, and
issue-007e.

Carrier topic: `roster-ledger` — `boundary.js record` is the roster's writer,
and its `--status` vocabulary against the roster's Status column is that
topic's validation work.
