---
id: "261c"
title: a live-but-unreachable Kikaku/Hosa row has no timeout
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: inbox 2026-09-17-kikaku-unreachable-row-has-no-timeout

`roles/kanri.md`'s Replace table leaves a Kikaku's or a Hosa's row `live`
when its session cannot be confirmed reachable in `ListAgents`, "awaiting its
own `/tanto fukki`" — correct on its own terms, since marking a merely-quiet
session `dead` without a handshake risks discarding a live one. But no upper
bound is named on how long that wait may stand, and nothing shortens it other
than a fresh handshake happening to arrive.

Reported from `kuchidome`
(bug-report-kikaku-unreachable-row-has-no-timeout, 2026-09-17): a Kikaku row
(`kuchidome-6a`) was noted unreachable in that repository's own ledger at
2026-09-16 18:46, stayed `live`-but-unreachable across at least three further
Kanri tenures' own start-of-turn checks — each one leaving it alone per the
same precedent — until a fresh Kikaku handshake let the row finally be marked
`dead` with confidence, about one day end to end.

Consider naming an explicit timeout (tied to `ceiling.presence_minutes`, or a
separate config value) after which a `live`-but-unreachable Kikaku/Hosa row
may be marked `dead` outright on Kanri's own ruling, with the human still
able to override by opening a fresh session at any time regardless, as today.
