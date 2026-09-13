---
id: "9d84"
title: "the consistency note's hand-maintained expected values go stale silently, and this plan's own batches proved it twice in one boundary"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Found by the tanto-cost run's batch F (2026-09-14), recorded in
`.tanto/tanto-cost/batch-F-report.md`, "Two divergences task 22 found that
nobody had seen" and "Shoroku candidates" (landed as written under R-30's
resolution; not fixable inside this plan).

`docs/notes/tanto-consistency-checks.md` states each check's expected
output as literal numbers or strings, hand-maintained by whoever last
touched the check. Two instances of the same failure mode surfaced within
this single plan's own run, one caused by an earlier batch of the plan and
missed by a later one:

- **Check 6's stated values are wrong at three of its 32 positions**
  (positions 9, 10, and 19 of the one-number-per-line list P21.7 lands).
  Landed exactly as the plan states, per R-30's resolution — task 21
  forbids editing a check to make it pass, and the divergence is the
  finding.
- **`Direction?`'s stated count is `1` where `skills/shoroku/SKILL.md` now
  reads `4`.** Task 20 (this same plan, three commits earlier) added three
  more occurrences inside the section it wrote; task 21 rewrote the
  consistency note in the **very next commit** and did not carry the
  count forward, even though both commits belong to the plan whose own
  task 21 explicitly measures every value "against `tanto-cost` before the
  plan was written." The gap is temporal, not conceptual: task 21's
  passage was authored before task 20 landed, and no step re-measured it
  after.

Neither is fixable inside the tanto-cost plan: both are in
`docs/notes/tanto-consistency-checks.md`, whose passage under task 21 has
already landed.

The general lesson, stated for whoever next maintains this note: a check
whose expected value is typed by hand has no way to notice the tree
changing under it, and a plan that both changes the tree **and** updates
the note in the same run needs the note's own values re-measured *after*
every task that could move them — not only once, at drafting time. Where
a check's subject is cheap to compute (a `grep -c`, a line count), deriving
the expected value from the tree at doc-generation time, rather than
typing a number, would close this class of drift for good.

Related: R-30 (the ten-form check, the same run's largest instance of this
pattern), issue-e18b, issue-2e19, issue-a5e9 (the same "a hand-maintained
count or list drifts from the tree" shape at other sites this run found).
