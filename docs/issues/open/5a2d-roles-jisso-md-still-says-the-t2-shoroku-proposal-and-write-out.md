---
id: "5a2d"
title: "`roles/jisso.md:5` still says \"the T2 shoroku proposal and write-out\", contradicting `SKILL.md` and the same file's own rewritten section"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the tanto-cost run's batch E task 16 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

`skills/tanto/roles/jisso.md:5` reads Jisso's summary of what it owns
including "the T2 shoroku proposal **and write-out**". Under this design
Jisso's T2 is the proposal only — the apply half moves to a dispatched
`shoroku` subagent Kanri runs — and two other sites already say so:
`SKILL.md:27` (task 5 dropped "and write-out" there) and this same file's
own rewritten section at `:260-264` ("you write the proposal and stop
there"). Line 5 is the one site the redesign missed.

The reviewer searched the whole plan for the phrase: it occurs once, at
plan line 1983, inside the `O` block of `P5.3` — the already-applied
`SKILL.md` edit that removed it there. No task's `P` block touches
`roles/jisso.md:5`, and task 22's old-value sweep is keyed to strings this
line does not match, so nothing in the plan's own instruments would ever
flag it.

Not fixable inside the tanto-cost plan: `roles/jisso.md` carries passages,
and an edit outside one puts an `unaccounted-added` line on
`skills/tanto/` at this boundary and every one after.

Related: issue-7ba4, issue-c30e, issue-f902 (the same "found late, can't
fix in-plan, self-contradiction within a role file" shape, from earlier
batches of the same run).
