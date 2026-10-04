---
id: "96f7"
title: shoki-seat's deferred minors with a defect under them
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-33

Findings of the `shoki-seat` plan review and fix wave that were declined or
parked, each with a defect under it, held here together (S-33, S-34, S-83).

- **`TANTO_NOW_MS` is not set in `tanto.test.js`'s launch** (S-33, plan
  review finding 6). The launcher suite's seats are marked `noFirstTurn` at
  their first census, so the suite exercises the two-minute rule by accident
  and writes toasts into its workspace's `notices.txt`. Declined at the plan
  because nothing asserts on the marks, the suite is green, and changing a
  code passage after the drafter's red/green run was the larger risk. A
  one-line follow-up.
- **An undelivered seat whose `claude rm` failed raised two alarms** (S-34,
  plan review finding 9). Declined at the plan; the fix wave has since
  landed the guard — `noFirstTurn` in `scripts/spawner.js` returns false
  when `seat.undelivered` is set — so this item is satisfied in the tree and
  is kept here only as the record of the decline.
- **`listAgents`' error has no stdout fallback** (S-83). `scripts/spawner.js`'s
  `listAgents` builds its error from the stderr with an exit-code fallback,
  so a `claude agents` refusal printed on stdout with an empty stderr reaches
  the result as the exit code alone — the defect class the fix wave closed
  for `spawn`, `resume`, `stop` and `rm`.
- **Two spec clauses drifted from the delivered code** (S-83). The
  shoki-seat design's sections 1.2, 3 and 3.1 read as if the gone path's toast
  carries `claude attach` and as if an `undelivered` seat can be marked; the
  fix wave changed both behaviors. The spec is frozen and is not edited; a
  reader of it takes `roles/kanri.md` and the code as current.
- **Two test gaps** (S-83). The fake CLI in `spawner.test.js` has no
  long-only `idForm`, so the long-id build is pinned by call order alone; and
  no test reaches the gone branch of an undelivered seat, which is the branch
  production takes (an undelivered session is listed without a `pid`).

Carrier: Kept.
