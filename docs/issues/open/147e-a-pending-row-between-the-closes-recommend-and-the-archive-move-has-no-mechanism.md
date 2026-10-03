---
id: "147e"
title: a pending row that arrives between the close's recommend and the archive move has no mechanism
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-10-03
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

**2026-10-03, a second instance, met from the Kikaku side**
(tanto-issue-triage S-14). A second Kikaku decision file, carrying a new
scene expectation, reached Kanri between a close's recommendation and its
apply, in the same consultation that answered the kessai's Unsure item. The
close has no rule for an item that arrives after the recommendation is
written, so Kanri improvised: it appended a row to the ledger's `S-n` table
and an extra item ("Item 95") to the direction file, which the apply reads
beside the recommendation. The reporter proposes a sentence in the Check
step and in `templates/shoroku-brief.md`'s answer paragraph that makes this
a rule. The decision here should weigh both handlings: the fold to the
roster's between-plans table above, and the direction-file item used this
time.
