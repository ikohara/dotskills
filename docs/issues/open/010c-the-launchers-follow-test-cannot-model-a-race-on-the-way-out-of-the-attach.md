---
id: "010c"
title: The launcher's follow test cannot model a race on the way out of the attach
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-80

The follow test in `skills/tanto/scripts/tanto.test.js` (lines 1225-1252 at
the run-owned-seats branch review) models a handover as a state change that
completes inside the attach: the hooked fake writes `seats.json` and the
roster at the n-th attach, before it returns. The real spawner writes the
state a moment after `claude stop` returns, which is after the attach has
ended. A fake that mutates state on the way into a blocking call cannot model
a race on the way out of it; a test of this seam needs a side process that
writes after a delay.

Kin: issue-46d3 (the suite's wall time is the launcher's transcript poll
budget).

Carrier: Kept — the launcher's test design in `tanto.test.js`; no topic in
the order owns the launcher.
