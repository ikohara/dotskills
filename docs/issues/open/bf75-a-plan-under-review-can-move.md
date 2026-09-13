---
id: "bf75"
title: a plan under review can move, and nothing says whether the author may edit while the reviewer reads
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**A plan under review can move.**"

The plan gained **23 lines and one rewritten paragraph between the first and
the last read of a single review pass**. One finding had to be retracted
because the text it cited no longer existed. The reviewer recorded the
artifact's md5 and re-measured everything from scratch, which cost roughly a
third of the review's budget.

Two gaps, and each has its own remedy:

- **The report has no fixed referent.** A review that cites line numbers
  should record the artifact's hash at the moment it read it, so a later
  reader can tell a stale citation from a wrong one. A line number without a
  hash is a claim about a file that no longer exists.
- **The protocol does not say who may write.** Nothing in `roles/kanri.md` or
  `roles/sekkei.md`'s review gate states whether the author may keep editing
  during the review or must wait for the report. Both are defensible — the
  cost of waiting is an idle author, the cost of editing is a re-measured
  review — but the choice has to be made once rather than per run.

Related: issue-1096 (the same review gate's scoping gap, from the same run),
issue-36c0 (what the review reads and when), issue-2c6a (what a read-only
review seat may record).
