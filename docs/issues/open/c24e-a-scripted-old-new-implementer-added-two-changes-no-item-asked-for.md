---
id: "c24e"
title: a scripted Old/New implementer added two changes no item asked for, and its own checks did not see them
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-9

An implementer that applies many exact Old/New pairs through a script added
two changes no item asks for, and its own checks (the exactly-once count, the
CR count, the numstat) did not see them: an empty line, because its items
data file ended with a newline and the last item's New text took it, and a
deleted space before a code span whose cause nobody named. Measured on the
shusei batch of `roster-ledger`'s close, 2026-10-08 (32 items over 13 files).

A replay of every pair onto `HEAD:` content, compared with the working tree
after EOL normalization, found both at once; it was the spec reviewer's
scratch script, 58 lines. The shusei's task text could carry that replay as a
check the implementer runs itself, instead of leaving it to a reviewer's
invention.

Carrier: Kept — the shusei batch's task text, which the close's step in
`roles/kanri.md` renders.
