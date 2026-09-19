---
id: "3e94"
title: an anchor's needle is measured before the edit and never against its own new passage, so a needle that wraps there fails only at the dry run
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the Sekkei of the tanto-cost run on the assembled
`docs/superpowers/plans/2026-09-12-tanto-cost.md` (2026-09-13), recorded as
that run's dry-run failure 2 (`.tanto/tanto-cost/plan-dryrun.md`).

An anchor step states `before:` and `after:` for a `grep -cF` of a needle
taken from the task's own new passage. Every drafting instruction in this
repository — `skills/tanto/roles/sekkei.md` Step 3, and the per-run drafting
conventions written from it — tells the author to **measure** the `before:`
value against the file as it stands. None tells the author to check the other
half: that the needle still sits on **one line** once the new passage is in
the file. `grep` is line-based, so a needle the author wrapped while fitting
the passage to its column is absent the moment it lands.

The failure is invisible until the dry run, and it reads as something else.
`A10.1` of that plan stated
`grep -cF 'for its pass or fail lines and the failing output only'` with
`before: 0, after: 1`; `before: 0` was correctly measured, the new passage
broke the line after `output`, and `replay` reported
`anchor-after: A10.1 — expected after: 1, got: 0` — which a reader first
takes for a passage that did not land, not for a needle that cannot match.

The rule the drafting text needs is one clause: **an anchor's needle must
occur on a single line of the new passage, and the author checks it there, not
only in the file as it stands.** It is the sibling of the rule the same
role file already states for an `O` needle — a needle that wraps in its target
returns `0`, and `0` reads as "already gone" — and the two belong beside each
other.

Under the tanto-cost design the plan-writing rules move from
`skills/tanto/roles/sekkei.md` Step 3 to a new `skills/tanto/roles/keikaku.md`,
so that is where the clause lands once that plan has run; before then it
belongs in Step 3.

Related: issue-c841 and issue-38f5 (defects in the same instrument found by
the same run), issue-d0f4 (an `O` needle whose disposition is not zero).
