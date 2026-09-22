---
id: "7202"
title: the fix wave's deferred launcher and spawner residues
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-80

`scripts/spawner.js` and `scripts/tanto.js` still carry four loose ends around
the resident's identity and the pair's error-shape conventions. The fix wave
deliberately left all four alone, because none of them is reachable by any
scenario this plan produces or any test it ships:

- The `kanriSuccessor` identity check excludes only the outgoing Kanri's own
  `sessionId`. A lingering handover file, after the successor has already taken
  the roster row and with the old seat never marked `stopped`, could still
  misidentify a candidate.
- A second, non-outgoing `kanri` row in `seats.json` would be picked by array
  order, not by recency.
- `tanto.js`'s and `spawner.js`'s two `listAgents` functions return different
  failure shapes (`sessions: null` versus `sessions: []`). The difference is
  load-bearing today and undocumented as deliberate.
- Inside `cmdUp`, the `seats` snapshot and the `seats.json` mtime check are read
  on opposite sides of the resident's own startup call.

None was re-opened after being parked; the full detail is in the fix wave's own
batch report. The natural place to revisit them is a future pass over the
launcher/spawner pair, once real multi-handover data exists to exercise them —
which is why this is deferred rather than open.

Related: decision-345b (the successor check's own mechanism), issue-29bf (the
handover's last line, beside the launcher-side check), issue-2065 (the prose
polish pass, which carries this item's two prose sites).
