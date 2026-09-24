---
id: "e84c"
title: the ledger's `S-n` table collided and duplicated
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-24
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

**2026-09-24, `bg-seat-ergonomics` — the second ledger to collide** (shoroku
bg-seat-ergonomics S-65). That ledger assigned two spans of numbers twice:
S-28/S-29/S-30, once for `batch-A-verdict.md`'s Failures and again for
`batch-A-report.md`'s own items, and S-34/S-35/S-36, once for an earlier
Kanri's exit-proposal items and again for the rework batch's findings. The
close's recommendation resolved both by disambiguating with each row's
Source, and no row's content was lost — but a bare cross-ledger reference of
the form `bg-seat-ergonomics S-30`, the form `SKILL.md`'s Artifacts table
prescribes, is ambiguous between two items today. Either a mechanical
de-duplication at the close or a documented rule that a re-used number is
disambiguated by Source; issue-d502 (no helper rewrites the ledger's columns)
is where a mechanical fix would live.

**2026-09-24, `bg-seat-fixes` — a third instance, after the `record` change,
and a second defect of the same mechanism** (shoroku bg-seat-fixes S-6).
`.tanto/bg-seat-ergonomics/kanri.md`'s `S-n` table holds six numbers twice
each, with different items — S-28, S-29, S-30, S-34, S-35, and S-36: hand
rows from a verdict and an exit proposal, and brief-written rows from a batch
report, numbered independently — after `bg-seat-ergonomics`'s Task 3 ("S-n
rows written to the header they find") landed. The invariant this issue
names — refuse a number in use, derive the next from the highest — is still
unwritten. The same table's brief-written rows (the second S-34 to S-36, and
S-37 to S-39) carry a destination word ("notes (process)", "issues") in
their Source cell: the batch report's Shoroku proposal items read
`- <destination> — <item>`, and the brief passed that as
`--s-item "<source> | <item>"`, so the one pointer a recommender follows
names no file.
