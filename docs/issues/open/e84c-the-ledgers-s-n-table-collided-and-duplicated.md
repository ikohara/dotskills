---
id: "e84c"
title: the ledger's `S-n` table collided and duplicated
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-79

The conductor ledger's `S-n` table carries two distinct integrity problems,
found while the close's recommender was compiling its own item list from it:

- **A collision.** `S-46`, `S-47` and `S-48` were each used for two different
  rows, with different content and different sources — the exit-kanri proposal's
  items 1-3, and separately batch C's report's Shoroku proposal items 1-3.
- **A duplication.** Batch D's four Shoroku proposal items were recorded twice,
  under `S-49` to `S-52` and again, content-identical, as `S-53` to `S-56`.

Both have the same underlying cause: an accepted batch's proposal items were
appended without checking the highest number already in use — once producing a
collision (same number, new content) and once a duplication (new number, content
already present).

The remedy is mechanical and belongs in the instrument: a `boundary.js record`
invariant that refuses to write an `S-n` number already present in the table,
and that derives an append's number from the highest in use. Without it the
recommender either double-counts the duplicated items or silently drops one
member of each collided pair, and neither failure mode is visible from the
table's own shape.

This ledger's own table was deduplicated in place under ruling R-15 before the
recommend dispatch read it, so the measured instance is fixed; the invariant is
not.

Related: issue-57b4 (shoroku proposal numbering does not preserve ledger `S-n`
numbers), issue-a8c2 (`shoroku.recommend` misses a batch report's own uncopied
candidates), issue-db7f (the same instrument's event dedup, keyed on text
alone).
