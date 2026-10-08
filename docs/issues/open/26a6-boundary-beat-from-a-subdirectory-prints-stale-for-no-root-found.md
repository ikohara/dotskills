---
id: "26a6"
title: boundary beat from a subdirectory prints stale for "no root found"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-08
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

**2026-10-08, inbox sweep — the worst consequence seen: a seat stops
itself** (inbox 2026-10-08-seat-check-wrong-cwd-misreads-as-stale). A
spawner-started Hosa whose start-sequence seat check ran from the skill
directory read `no entry -` and `spawner: stale`, printed the stray-tab
refusal, and stopped itself, writing and sending nothing; the seat check's
prose now names the repository root as its cwd (`fix: text corrections from
the inbox sweep 2026-10-08`), and the script half stays here.
