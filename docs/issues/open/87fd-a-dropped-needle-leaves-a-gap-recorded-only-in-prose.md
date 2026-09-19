---
id: "87fd"
title: a dropped needle leaves a gap recorded only in the plan's prose, and the two places the count appears drift
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**A dropped needle should renumber or be recorded as a gap in the output,
not only in prose.**"

`O22.26` was removed while the plan was being drafted and the remaining ids
were not renumbered. The sweep therefore prints **64 lines whose ids run to
65**. Task 22's header says so in one clause; the Batches table gives the
other number. Nothing is wrong with the plan's needles — the two statements of
how many there are simply cannot be kept in agreement by anything but care.

Neither instrument prints the number that would settle it. If `lint` reported
the `O` block count, or `replay` printed `64 needles (ids O22.1-O22.65, 1
gap)`, then the count in the plan's prose would have a machine-produced
counterpart to be read against, and a drafting-time deletion would announce
itself instead of leaving a reader to subtract.

Small and cosmetic on its own; it earns its place because the same printed
count is the only live signal for issue-38f5, where a silently dropped needle
shows up as nothing but a count mismatch.

Related: issue-38f5, issue-d0f4, issue-4d53.
