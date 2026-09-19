---
id: "d502"
title: no helper rewrites the ledger's Adopted and Written columns from the direction file in one pass
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: shoroku seat-lineage

At a large close, Kanri fills the shoroku table's Adopted and Written columns
for every `S-n` row the direction answered. Done row by row that is one edit
per row; the `seat-lineage` close handled a 95-item recommendation's worth of
rows with a **script-based bulk rewrite** instead — one regex pass over the
ledger, driven by the direction file — and the technique is worth keeping.

Its own failure mode turned out to be a feature: rows whose Stage column
carried a non-standard value did not match the pass and were reported as
non-matches, which is a useful signal about the ledger's shape rather than a
silent miss.

Two candidate carriers, either of which closes it:

- a helper mode of `skills/tanto/scripts/passage-check.js` that takes a ledger
  and a direction file and rewrites the two columns, reporting non-matches; or
- a sentence in `roles/kanri.md`'s Check step describing the one-pass rewrite
  as the technique for a large close.

Both destinations are skill files, outside `docs/`, which is why the technique
is carried here rather than written directly.

A tooling gap, not a user-stated need, so no paired requirement.
