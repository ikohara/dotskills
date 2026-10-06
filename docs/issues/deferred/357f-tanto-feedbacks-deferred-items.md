---
id: "357f"
title: tanto-feedback's deferred items
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-8

The tanto-feedback design (2026-10-06) named twelve decisions it did not
take. None is acted on now; each waits for a measurement, a second close, or
a need the run has not yet met:

- A numeric carried-defects field in the boundary's verdict and in
  `boundary.js record` (the design's Q-2).
- The by-finder count in `usage.json` and in the row, with
  `issues-by-finder.js` shipped in the skill: both wait for decision-62dd's
  condition (Q-2, Q-11). The wiring into the close is issue-de42's.
- A backfill of departures from the recommendation and direction pairs
  already on disk.
- Fix rounds joined to a task number.
- E7: a one-word profile switch, never automatic.
- The bug report's target resolved as the feedback file's is (the design's
  6.3).
- A `feedback.to` override for a skill repository the real path does not
  find.
- The 30% share target, read again after two closes under the
  once-per-response definition.
- A consult to a repository the human does not own.
- Waking a Kikaku on a consult's arrival, should the notice prove too slow
  (Q-1).
- Kanri's hand-written `attention` requests moved to `request attention`.
- A record of an inbox sweep's own departures.

Related: decision-73cc, decision-32e5, decision-de65 (the decisions these
items were deferred from); issue-7202 (the precedent for a bundled deferred
entry).
