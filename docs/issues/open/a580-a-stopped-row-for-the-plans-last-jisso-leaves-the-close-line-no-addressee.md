---
id: "a580"
title: "a `stopped` row for the plan's last Jisso before the review's verdict leaves the `close:` line no addressee"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-fixes S-38

At `bg-seat-fixes`'s whole-branch review census, the last implementation
batch's Jisso (`a8b75b36…`) was `stopped` in the roster and in `seats.json`,
while its own SDD ledger said it idles awaiting the `close:` line, and
`roles/jisso.md`'s "The final batch" keeps it live until the verdict. That
ledger's R-8 is the instance; a procedure slip that stopped the seat early
is its trigger.

The contract has no path back for this row. A terminal seat's `dead` row is
resumable (decision-39fb), but `stopped` means a stop the run made and has
no counterpart for a seat the close still needs, and Kanri sends only to
`live` rows, so the `close:` line has no addressee.

The repair is a decision: a `stopped` seat the close still needs is resumed
like a `dead` one, or the final batch never stops its Jisso before the
verdict — or both, the second as the rule and the first as its recovery.
