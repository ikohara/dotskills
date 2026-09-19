---
id: "077b"
title: appending by a grep-matched anchor instead of the file's true end reorders events
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-19
---

Source: session 2026-09-15

A growing Events or Session-events section is appended to by locating an anchor
— a grep match on a nearby line — rather than by finding the section's true end.
When the section has grown since the anchor was chosen, the new entry lands
*before* entries already there, and the section stops being chronological.

Two independent instances are now on record, which is what lifts this above a
one-file slip:

- the `tanto-context-ceiling` ledger's own **Session events** table, where
  several entries landed out of strict chronological order this way; noted at
  the time as a housekeeping aside inside that ledger.
- the 2026-09-15 tenure's own **`roster.md`** Events section, which hit the
  identical failure mode independently, without reference to the first.

The cause is the same in both: an append aimed at a matched anchor instead of
the file's true end, in a file that keeps growing between the match and the
write. A section serving three concurrent topics plus repository-wide bug intake
grows fast enough for the window to matter.

No fix is proposed here. Neither original note attempted a live reflow, for the
same reason both times: low value against the risk of a bad edit while the file
is in active use by a run. This entry exists so the pattern is on record from
two different files rather than once, for whoever does aim at the append path.

Related: design-4807 (the roster and the conductor ledger).
