---
id: "4210"
title: two `lint` checks the `O`-needle set deserves — stated per-file counts against the tree, and every needle site covered by a `P` block's old text
severity: medium
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
"**The `O`-needle set is the strongest part of this plan and deserves a
convention.**"

The reviewer made two measurements over the plan's 64 needles, by hand:

- **All 64 stated pre-counts match the working tree exactly.**
- **Every needle site falls inside some passage's old text** — no needle
  names a place the plan does not actually edit.

Both passed. Neither is a measurement the plan makes of itself, and neither is
one `replay` can make: `replay` sees the applied scratch tree, not the tree
the counts were stated against. Both are a few lines of script over
`parsePlan`, which already has the needles, the counts and the `P` blocks in
hand.

As `lint` rules — "every `O` needle's stated per-file counts match the working
tree" and "every needle site is covered by a `P` block's old text" — they
would catch, before a human reads the plan, all three defect classes this
run's dry run found by hand: a needle that occurs in the plan's own new text,
a needle that wraps across a line, and an uncovered second site.

Note the interaction with issue-d0f4: a needle that survives by design has no
form today, so the first rule needs the declared-expected-count shape d0f4
proposes, or it will read a deliberate survivor as a failure.

Under contract rule 11. Related: issue-d0f4 (the survivor form), issue-4d53
(the sweep's path scope), issue-f36d (the needle check's other blind spot),
issue-b1e4 (checked, never generated), issue-10bc (resolved; the convention
these rules would enforce).
