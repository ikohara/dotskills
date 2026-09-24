---
id: "147e"
title: a pending row that arrives between the close's recommend and the archive move has no mechanism
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-fixes S-31

`bg-seat-ergonomics`'s close ran its one `shoroku.recommend` dispatch before
its last two proposal files arrived — a Jisso's shusei-batch report item, and
its predecessor Kanri's exit proposal — so three `S-n` rows (S-67, S-68,
S-69) landed `pending` in that ledger after the recommend had run, with no
further recommend to catch them before the topic's close finished. The
ledger never moves and stays readable, so nothing is lost; but the rows sit
`pending` until a human or a later Kanri notices them and folds them into a
different topic's close by hand.

`SKILL.md`'s "Session exit" gives Kanri's own post-recommend items a further
file whose rows go to the roster's between-plans table, and says nothing for
a shusei report's rows or a late proposal's.

The candidate rule, a decision for the human: the same fold — a `pending`
row that arrives between the close's recommend and its archive move goes to
the roster's between-plans table at the archive move, as a Kanri's own
post-recommend proposal already does — written as a line in
`roles/kanri.md`'s Shoroku section.
