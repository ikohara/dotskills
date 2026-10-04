---
id: "c899"
title: the close's Jisso proposal restates the ledger's pending rows and goes stale
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-close-proposal-restates-pending-rows

The close's Jisso proposal lists, as its Part 1, the conductor ledger's
`pending` `S-n` rows by number. The table is already a file; the list
restates it row for row, and it is stale by every row added after the Jisso
last read the ledger. Measured in one run as 116 lines with ten rows
mislabeled and four missing; in the `shoki-seat` close as 83 pointer lines,
which the recommender did not read, reading the ledger instead.

The role text should say the proposal holds only what the Jisso's context
holds and no file does: `roles/jisso.md` "The close and the exit", and
`roles/kanri.md`'s two descriptions of the proposal, at "The four steps" and
the adoption rule, which should drop "the `pending` rows by number". Three
sites in two files, so not one text correction.

Carrier: Kept.
