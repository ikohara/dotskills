---
id: "2872"
title: the conductor ledger template's Batches and Shoroku candidates tables share one placeholder shape, and a scripted fill hits the wrong table
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-19
---

Source: session 2026-09-12

`skills/tanto/templates/kanri.md` opens both its Batches table and its
Shoroku candidates table with a placeholder row of the same shape
(`| <A> | <1-4> | … |` and `| S-1 | … |` in the template; a Kanri that copies
it writes `| (none yet) | | | |` in both). A Kanri that fills the tables by
script — replacing the placeholder rather than editing by hand, which a
session that writes twenty rows a day does — matches the first occurrence
and lands its rows in the wrong table: on 2026-09-11 seven `S-n` rows of the
tanto-workspace ledger sat in its Batches table until Kanri noticed a day
later and moved them (kisou-refresh ledger, Kanri's exit proposal item 2).

Fix: distinct placeholders per table in the template — `(no batch yet)` and
`(no candidate yet)` — and the same for the roster template's Shoroku
candidates table, so that a replacement keyed on the placeholder is
unambiguous. Nothing else changes. Under contract rule 11; the `.tanto/`
workspace plan (issue-0b97) touches every template and is the natural carrier.
