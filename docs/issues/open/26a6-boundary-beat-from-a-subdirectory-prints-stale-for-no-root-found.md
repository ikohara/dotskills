---
id: "26a6"
title: boundary beat from a subdirectory prints stale for "no root found"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-93

Run from a subdirectory of the repository — here `.tanto/spawner/requests`,
left as the shell's cwd by an earlier `cd` that persisted — `boundary.js beat`
prints `spawner: stale`, the answer for "the spawner is not beating", when the
truth is "no spawner root found from here". Every command that finds the root
from the cwd shares the defect. A Kanri that obeys the stale line writes no
request and tells the human to run `tanto fukki`, which is wrong; the
run-owned-seats Kanri that met it ignored the line after a second `seat` read
`beating`, and wrote the request anyway.

The command should say that it found no root, or search upward, instead of
printing `stale`.

Carrier: Kept — `boundary.js`'s root finding for its spawner-facing commands,
not its roster or ledger writers.
