---
id: "22e9"
title: "a retiring Jisso's `release:` has no fallback if its Shoroku proposal form check fails at loop step 6"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: shoroku seat-lineage

decision-0ea5 puts `release:` directly after the form check at every seat.
`roles/kanri.md`'s batch-loop step 3 records that form check, and step 6 trusts
it without restating it — so the text never says what happens when the check
fails at step 6 instead of step 3 catching it first. The retiring seat is then
in a state the loop does not name: not released, and with no prompt telling it
what to do.

Ruled plan-mandated during the `seat-lineage` run (the wording came verbatim
from the brief's own P9.4 text) and parked at the time. Not exercised by that
run, because its own old-lifecycle Jisso wrote no Shoroku proposal section in
any batch report until the T2 write-out itself, and not touched by the fix
wave's A–H list.

The fix is one clause on loop step 6 naming the outcome of a failed check — a
rework prompt, most likely, matching the "batch returned for rework" case the
loop already states elsewhere.

`roles/kanri.md` is outside `docs/`, which is why the clause is carried here.

A lifecycle-text gap, not a user-stated need, so no paired requirement.
