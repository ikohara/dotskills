---
id: "c330"
title: the renamed mark and the ack op have no reader
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design: whether `renamed` and `ack`
are still worth keeping once nothing addresses a seat by name, and with
Residency rows matched by `sessionId`, is `roster-ledger`'s to decide.

The whole-branch review measured the answer's premise (S-82): after that
branch the spawner's `renamed` mark is read by no code. `boundary.js
census` derives its `— renamed` suffix from the listed name against the
row's Name cell (boundary.js:895-896), and `tanto.js` never reads the mark,
so the `ack` op is bookkeeping with no reader, kept alive by three
documents. Kin issue-dfb3 (roster rows matched by the name string).

Carrier topic: `roster-ledger` — the roster's Name cell, the census's
`— renamed` suffix, and the `ack` op's bookkeeping.
