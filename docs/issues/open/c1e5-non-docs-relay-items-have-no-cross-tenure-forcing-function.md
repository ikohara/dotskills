---
id: "c1e5"
title: non-docs relay items in a direction table have no cross-tenure forcing function
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Reported from kuchidome (a different repository running the same tanto
skill): an exit-shoroku (or T1/T2) direction table can hold rows whose
destination is explicitly not `docs/` (a bug-report relay, a ledger edit, a
memory entry), each still carrying a `Written` column starting at `no`.
Unlike a `docs/`-bound row, nothing in the ordinary batch-loop, handover, or
exit-shoroku flow ever re-checks these specific rows again once the
proposing session is gone — the `S-n` table's Written-column sweep only
covers `docs/`-bound candidates, checked at T1/T2/exit.

Measured in kuchidome: five non-`docs/` rows in one topic's own
`exit-keikaku-direction.md` sat unexecuted for a full day across three
intervening Kanri tenures of a different, concurrent topic, none of which
ever re-checked the first topic's own still-`no` rows. Nothing was wrong at
any single boundary; nothing ever prompted anyone to finish them.

Proposed fix: either (a) copy every direction-table row with a non-`docs/`
destination into the ledger's own `S-n` table too, so the same
Written-column sweep already run at T1/T2/exit also catches these; or (b)
add an explicit step to Kanri's own handover and exit-shoroku procedure —
before writing the handover file, enumerate every open topic's own
`*-direction.md` files (not just the topic in flight) for `Written: no`
rows, and carry them into the handover's "Rulings the next batch inherits"
by name.

Reported by `kuchidome-eb [e0615a]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-17.
