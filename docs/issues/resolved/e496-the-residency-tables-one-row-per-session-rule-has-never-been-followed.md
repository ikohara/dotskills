---
id: "e496"
title: the Residency table's one-row-per-session rule has never been followed
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-10-03
---

Source: session 2026-09-15

design-4807 states that the roster carries a **Residency** table with one row
per session of the current run, Kanri's first, each row holding that session's
latest four-figure reading and the boundary it was read at. Observed at the
`tanto-context-ceiling` topic's close (2026-09-15): the live roster held **zero**
peer Residency rows, and the Kanri of the day reconstructed a best-effort record
by hand at the close.

What lifts this above one tenure's slip is that the gap is total. The roster's
own Events history runs back to 2026-09-06, and across those nine days of runs
no tenure appears to have kept the table — not one peer row survives. A rule
that no run has followed is either worth making mechanical (something that reads
each session's last reported reading and writes the row, rather than Kanri
maintaining the table by hand at every boundary) or worth reconsidering as
written.

The cost of leaving it is not local: the Residency rows are the dataset
issue-40ed's replacement threshold is meant to be read from, and rows never
written are data never collected.

**Constraint on any fix.** A mechanization must reconstruct each row from the
readings **already on record** — each role's own boundary or exit line — and
never from a fresh `reading.js` run against a session's current transcript.
Peer sessions (Sekkei, Keikaku) were already deleted by the time the gap was
caught at T2; a re-read now would report whatever a transcript grew to
afterward rather than what the session was *at* the boundary the row claims to
represent. A fresh read is more complete and silently wrong; the readings taken
at the moment they claim to represent are the only honest source.

Related: design-4807 (the Residency table's rule), issue-40ed (the dataset the
missing rows feed).

**The gap recurred two topics after its fix (2026-09-16).** Keikaku's Residency
row was never populated for `tanto-sweep-2` (`dotskills-cc`, its only session
that topic) — the "each role's last reading" Measurements row had to record "no
Residency row was ever recorded for it" rather than an actual figure. The
`tanto-context-ceiling` close (R-46) had already found and fixed the same class
of gap for a different topic ("this same roster's own Residency table never
gaining rows for any peer nor its Context column"); this recurrence shows the
fix did not durably cover every role at every topic — Keikaku specifically went
unrecorded again, two topics later.

Added fix candidate: whatever wrote R-46's fix, re-verify it actually reaches a
Keikaku's own boundary-report path, not only Jisso's and Sekkei's.

Resolved by "tanto: boundary.js — the boundary reads and records through one instrument" — found by the tanto-issue-triage liveness check, 2026-10-03.
