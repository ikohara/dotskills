---
id: "ac65"
title: "--share's \"every Kanri whose tenure overlapped it\" rule has no mechanical derivation"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-15
---

First-use report, 2026-09-15, from the `tanto-context-ceiling` topic's close.
`--share` is specified over "every Kanri whose tenure overlapped" the topic, but
nothing in `skills/tanto/roles/kanri.md` says how to derive "overlapped"
mechanically. Applying it took a narrative read of the roster's Events section —
which Kanri handed over to which, and when, relative to batch A's start — to
conclude that the immediate predecessor's tenure overlapped the topic (T0
through the start of the plan stage) and that the predecessor-once-removed's did
not (its tenure ended at the previous topic's close, before this one opened).

The rule itself is correct and the answer it produced is believed right. The gap
is that it is judgment rather than a lookup, which makes it slow at every close
and quietly wrong the first time a Kanri reads the narrative carelessly.

Two candidate fixes, either of which turns the narrative read into a lookup:

- a Kanri's own Residency row gains a **topics touched** list, so overlap is
  read off the row; or
- the roster's Events keep an explicit **topic opened while I was resident**
  marker, so overlap is read off the event stream.

Sites: `skills/tanto/roles/kanri.md` for the rule, and the roster's Residency
and Events sections for whichever fix is chosen.

Related: design-4807.
