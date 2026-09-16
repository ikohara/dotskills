---
id: "57b4"
title: a shoroku proposal's item numbering does not preserve the ledger's S-n numbers
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

A shoroku proposal numbers its own items from 1, independently of the `S-n`
row numbers the topic ledger gave the candidates it draws from. The
`tanto-sweep-2` T2 proposal compressed and reordered 36 `S-n` rows into 38
freshly-numbered items (1-38); the recommendation and the check brief inherit
that numbering, and the human's direction answers by it too. Reconciling
"item 12 was adopted" back to "which `S-n` row" therefore needs a reverse
lookup that nothing in the run builds, so the ledger's `S-n` table cannot be
marked up from the direction alone. The 2026-09-16 Kanri left that table's
Written column undone at its exit rather than guess.

Two candidate conventions, neither chosen:

- the proposal keeps each item's source `S-n` in parentheses, so the
  direction's numbers map back mechanically; or
- the apply updates the `S-n` table's Written column by content match rather
  than by number, so no mapping is needed.

Owner not chosen either: the `passage-check-hardening` topic, or
`seat-lineage`, which already touches the proposal's shape.
