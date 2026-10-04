---
id: "f02c"
title: the close's tail costs about 47000 tokens of Kanri context and is all by-hand scripts
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-10

Measured on the `tanto-issue-triage` close: the tail — the share, the census,
the archive move, the Measurements rows and the direction append — cost about
47000 tokens of context on top of a cold start of `context=157243` (two reads
of the 1757-line role file). One read of the roster's Residency and Events
sections was about 25000 of it. The tenure ended at `context=203953`, 14000
under its ceiling, and every step was done by a hand-written script: the
share's session list, the archive move's join, the Measurements fill.

A `boundary.js close-tail` subcommand, or a `reading.js --share --roster`
that takes its transcripts from the roster, would let a successor run the
tail without reading the roster into its context. Kin issue-401e.

Carrier topic: `roster-ledger` — the instrument that writes the roster is the
one that should read it for the tail.
