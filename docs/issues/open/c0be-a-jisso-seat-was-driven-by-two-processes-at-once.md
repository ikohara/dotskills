---
id: "c0be"
title: a Jisso seat was driven by two processes at once, and the census listed it once
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-86

A Jisso seat can be driven by two processes at once. On `roster-ledger`
(2026-10-08) the human opened `dotskills-jisso-roster-ledger-c5dd` in a VS
Code tab while its background process was mid-batch; both worked batch C
(the tab committed Task 17 and ran Task 18) until the background process
noticed and stood down. The census listed the seat once, as background;
nothing in the run named the second process.

Distinct from the open issue on `claudeProcessWrapper` being unmeasured as a
way past the tab's open-elsewhere check: that is the check's bypass, and
this is a second process on a background seat that no instrument sees.

Carrier topic: `park-in-flight`.
