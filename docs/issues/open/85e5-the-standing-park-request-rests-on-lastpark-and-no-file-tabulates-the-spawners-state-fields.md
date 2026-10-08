---
id: "85e5"
title: The standing park request rests on lastPark, and no file tabulates the spawner's state fields
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-08
---

Source: shoroku run-owned-seats S-85

The standing park request depends on one field of a seat's entry in
`seats.json`, `lastPark`. Three transitions write it (`markParked` via the
park's stop, and the park by absence of a request's seat), while two leave a
seat `running` without it: a tab holds the seat, or the census's
`parkByAbsence` is followed by a relist. The run-owned-seats spec states the
rule as a narrative — "a request that was honored stands until a new turn
begins" — and never as an invariant over the field. That is why the
acceptance scene, and not a reviewer, found the tab path (step 6 failed on
its first run).

A field-level table of who writes and who clears each of `parkRequest`,
`lastPark`, `listedAtMs`, `parkedAtMs`, `held`, `waiting`, and `midTurn` would
have made the gap a lint; no file holds one.

Carrier: Kept — a field-level table for the spawner's state file, which no
topic in the order owns.

Carrier topic: `park-in-flight`, in place of Kept (roster-ledger's close,
2026-10-08).
