---
id: "8f5a"
title: "a rendered batch prompt shipped with both `<Kanri fills>` slots unfilled"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-49

The bg-seat-ergonomics batch D prompt (`batch-D-prompt.md`) reached its
Jisso with both `<Kanri fills>` slots of `skills/tanto/templates/batch-prompt.md`
still carrying the template's literal placeholder text: the Previous-batch
verdict ruling line and the first line of the Rulings-to-carry section. The
Jisso recorded it as a Ruling rather than blocking, since the conductor
ledger held the equivalent facts and its Start step 3 reads that ledger.

No check between the render and the `batch:` line reads the prompt for a
literal slot. This is the run's second render-then-send defect, after
issue-d13d (a rework prompt rendered over the original).

The fix needs a mechanism, not a sentence: a `grep -c '<Kanri fills'` over
the rendered prompt before the send in `roles/kanri.md`'s render-then-send
step, or the slot text made a lint failure.

**2026-09-24, `bg-seat-fixes` — a second instance, on a handover path**
(shoroku bg-seat-fixes S-35). Batch C's prompt (`batch-C-prompt.md`) reached
its Jisso, a fresh one spawned per that ledger's R-4, with both
`<Kanri fills>` slots unfilled — the Previous batch verdict's ruling line and the
first line under "Rulings to carry into dispatches" — unlike batch B's
handover, whose Events line recorded filling both. Nothing was blocked: the
substance of both slots stood elsewhere in the prompt's prose. The same class
as that ledger's S-32, a send-and-rewrite lapse on a handover-inherited
prompt, a path the loop step's pairing assumed an ordinary spawn for; the
close wrote the sentence for that one into `roles/kanri.md`'s loop step 6.
