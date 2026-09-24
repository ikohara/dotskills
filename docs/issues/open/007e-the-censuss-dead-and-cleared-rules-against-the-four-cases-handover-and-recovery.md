---
id: "007e"
title: "the census's `dead` / `cleared` marking rules are not reconciled with the four cases, Handover, and Recovery"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-42

Across the bg-seat-ergonomics batch C, four plan-mandated Important findings
were parked against literal P-block text in `skills/tanto/roles/kanri.md` and
`skills/tanto/SKILL.md` (Task 8's three, Task 10's one). All four are one
design surface: the census's `dead` / `cleared` marking rules interact with
the Start section's four cases, the Handover, and the Recovery logic in ways
the accepted spec's own text does not fully reconcile.

The full text and file:line evidence for each finding are in the batch C
review reports, referenced from the batch's SDD ledger
(`.tanto/bg-seat-ergonomics/`). No later batch of that plan revisited either
file.

A fix to this surface touches both files at once, which is why it is one
issue to schedule rather than four sentences.

**2026-09-24, `bg-seat-fixes` — a fifth case, measured** (shoroku
bg-seat-fixes S-39). A `dead` tab-seat row whose session the editor later
resumed under a new name — `hosa dotskills-4d [1cd021]`, `0cc8043d…`, now
listed as `dotskills-c6` with a `pid` — prints under the census's Not held
as `row dead`. The `renamed` rewrite applies to live rows only, and nothing
in the contract says what Kanri does with a dead row's session that is
answering again.
