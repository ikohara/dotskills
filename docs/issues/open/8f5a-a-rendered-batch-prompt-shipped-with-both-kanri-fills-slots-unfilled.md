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
