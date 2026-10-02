---
id: "f8e6"
title: the Residency table's Topic column reads `—` for Jisso rows while the Sessions table fills it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-9

The roster's Residency table carries `Topic: —` for most Jisso rows, while
the Sessions table fills the same session's Topic. The archive move of
`bg-seat-ergonomics` and `bg-seat-fixes` had to match Residency rows to their
topic by session Name instead of their own Topic column; a Sekkei row reused
under one Name across both topics (`dotskills-1a [240a33]`) still needed the
topic-qualified key so that the wrong topic's reading was not paired with the
wrong archived row.

Nothing in `roles/kanri.md`'s "Readings" or `boundary.js record`'s contract
explains why the Residency Topic is filled for Sekkei, Keikaku and Kanri
rows but not for Jisso ones. The fix is in a script: `record`'s
Residency-row write fills Topic from the same source the Sessions row uses,
or `SKILL.md` reconciles the two tables' Topic conventions explicitly.
