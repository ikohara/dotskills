---
id: "ffee"
title: "the `close:` line's `ledger <path>` slot is undefined when the topic is `kanri`, and Hosa is told to read rows that a between-plans exit does not have"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: shoroku shoroku-at-close

Found by `shoroku-at-close`'s whole-branch review as its Minor 1, and unchanged
at that branch's tip.

`roles/hosa.md` tells Hosa to "read the ledger's Shoroku candidates table for
the `pending` rows". A between-plans Kanri exit has no ledger — `roles/kanri.md`
says that exit's proposal is written "over your proposal alone", so the rows are
not read at all — yet the `close:` line for `<topic>` = `kanri` still carries a
`ledger <path>` slot.

Neither file says what that slot carries then: the roster path, whose own
section has the same name and does inherit candidate rows, or a literal `—`.
The first between-plans Kanri exit run under a live Hosa will hit it and invent
an answer.

One clause in `roles/kanri.md`'s "Delegation to Hosa", matched in
`roles/hosa.md`'s description of the close, settles it.

A specification gap, not a user-stated need, so no paired requirement.
