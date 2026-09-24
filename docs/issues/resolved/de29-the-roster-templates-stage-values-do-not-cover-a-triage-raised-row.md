---
id: "de29"
title: "`templates/roster.md`'s Shoroku candidates section names two Stage values and neither covers a row raised by a between-plans triage"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-23
---

Source: shoroku shoroku-at-close

Found by `shoroku-at-close`'s whole-branch review as its Minor 3, and unchanged
at that branch's tip.

The template names two Stage values for the roster's Shoroku candidates table:
`exit-kanri-…` for a row a between-plans exit recommends, and `t2` once the row
has been moved into a ledger. The section's own opening sentence, however,
admits rows "raised by a between-plans triage" — rows recorded before either
event happens, which therefore have no stated Stage at all.

A Kanri filling one today invents a value. Either `pending` with no Stage, or a
literal `—` until the row is recommended, would close it; the template has to
say which.

A template gap, not a user-stated need, so no paired requirement.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.5):
already closed in substance when the template gave one value for every row,
and now the column itself is gone from `templates/roster.md`'s items table.
