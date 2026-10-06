---
id: "b757"
title: The launcher's follow waits up to 5 s while the departed Kanri is still live
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-88

After a handover, the launcher's follow waits up to 5 s when the roster's
first row names another session while the Kanri that just left is still live.
The delay is bounded; it was found while diagnosing the launcher test flakes
(issue-c3cd) and is also why seven launcher tests became 5 to 8 s slower.

Kin: issue-46d3.

Carrier: Kept — the launcher's follow in `tanto.js`; no topic in the order
owns the launcher.
