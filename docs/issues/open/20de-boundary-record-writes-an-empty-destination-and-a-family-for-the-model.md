---
id: "20de"
title: "`boundary.js record` writes an S-n row with an empty Destination and a seat row with a family for its Model"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-boundary-record-three-imperfect-rows

`boundary.js record --s-item "<source> | <item>"` fills Source and Item and
leaves the Destination cell empty — the row reads
`| S-n | <source> | <item> |  | pending | no |`, seen on ten consecutive rows
of one run — because `writeSItem` writes `Destination: ""`. And
`record --seat <result.json>` writes the roster's Model cell as the request's
family rather than the full model id the other rows carry.

The recorded forms should match the templates' columns: `--s-item` accepts a
Destination or defaults one, and `--seat` writes the full model id. The same
report's two other rows are held elsewhere: `--seat`'s Name cell without its
`[ref]` is issue-dfb3's key defect, and `--event`'s prepended stamp is
documented in `roles/sekkei.md` by the shoki-seat close's text corrections
rather than changed.

Carrier topic: `roster-ledger` — `record` validates and writes the templates'
columns.
