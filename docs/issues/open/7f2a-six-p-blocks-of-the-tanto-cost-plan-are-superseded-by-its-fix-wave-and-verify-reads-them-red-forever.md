---
id: "7f2a"
title: "six `P` blocks of the tanto-cost plan are superseded by its own fix-wave commit, and `verify`/`boundary` will read them red forever — not drift"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Found by the tanto-cost run's final fix-wave and its scoped re-review
(2026-09-14), recorded in `.tanto/tanto-cost/final-fix-wave-report.md`,
"Rulings" and "Rulings needed" (item 1 — Kanri cannot write under
`docs/superpowers/` to correct the plan itself, so filing this record is
the only available answer, per that report's own note).

The whole-branch review's one fix wave corrected six defects the plan's own
task passages had pinned as their landed text. Necessarily: the fix commit
(`1b6d4ea`) now diverges from those six `P` blocks, because you cannot
correct wrong pinned text and still have the file match the plan. The
re-review confirmed the divergence is exactly each correction and nothing
more, by diffing each block against the file region at HEAD:

| passage | region | fix |
| --- | --- | --- |
| `P6.6` | `skills/tanto/SKILL.md:307-312` | the effort-read prose (fix 6b) |
| `P7.3` | `skills/tanto/SKILL.md:199-209` | the effort-read prose (fix 6a) |
| `P8.2` | `skills/tanto/SKILL.md:537-556` | the exit-proposal form check (fix 2a) |
| `P11.8` | `skills/tanto/roles/kanri.md:587-642` | naming `subagent_type: tanto-shoroku` (fix 5a/5b) |
| `P11.11` | `skills/tanto/roles/kanri.md:670-723` | the exit-proposal form check (fix 2b) |
| `P20.1` | `skills/shoroku/SKILL.md:80-110` | the `##`-heading groups (fix 1) |

The permanent, measured consequence: `node "$TANTO/scripts/passage-check.js"
verify --plan <this plan> --task 6|7|8|11|20` reports `passage-absent` for
each, forever, at this plan's own HEAD — confirmed independently by Kanri,
running `verify` across all 23 tasks (18 pass, exactly these 5 fail). And
`boundary --plan <this plan>`'s check 3 (`for t in 5 6 7 8; do … verify
… done`) therefore reports `fail 3` from this commit onward — confirmed
independently, `EXIT:1`.

**This is not drift and not a regression in the shipped skill** — the
skill's actual text is correct; it is the plan's own historical record of
its task passages that is now stale in exactly six places, for a good
reason (issue-91f6 already covers `boundary`'s check 3 being scoped to one
batch's tasks; this is a related but distinct fact — the check now fails
permanently, not merely for tasks outside its scope). A future reader —
including a future Kanri re-verifying this plan, or anyone re-running its
`boundary` — needs this issue to tell a deliberate, reviewed correction
from actual drift.

Not fixable by updating the plan: Kanri does not write under
`docs/superpowers/` (that is Sekkei's/Keikaku's directory), and no such
role exists to create for one bookkeeping edit at this point in the run.

A related tooling idea from the same re-review, worth recording alongside:
`verify` has no notion of "this passage is superseded, by this commit, for
this reason" — a declaration that would let the check stay meaningful after
a plan lands, the same shape as issue-4eef's `rewritten:` idea from the
other direction (an unquoted-but-intended change, rather than a
quoted-then-corrected one).

2026-09-14 — the principle behind this issue, recorded at the run's T2.
**A plan's ability to repair its own text is decided by which instrument
happens to cover the path, not by how bad the defect is.** The six
passages above were broken deliberately because the fixes were right and
the paths were covered; earlier in the same run the same class of defect
was fixed without cost in a `created:` path that no instrument compares,
and was left unfixed in two passage-carrying files precisely because they
are compared. That is why this issue exists rather than a set of repairs:
coverage, not severity, chose the outcome in every one of those cases.
`docs/reports/2026-09-14-tanto-cost-dogfood.md`, section 6, states it in
full for a reader of the report.

2026-09-14 — a second instance, and the first at a plan's own close. The
`tanto-context-ceiling` run's post-plan fix wave corrected text pinned by its
own `P`-block passages, breaking `verify`/`diff` parity in exactly the way
recorded above. Two things this instance adds:

- **It is by design, not by accident.** A fix wave that runs after the plan
  has closed can only correct pinned text by diverging from it. Any run that
  ends with a fix wave over `P`-block paths will reproduce this, so it is a
  property of the shape rather than a fault of either plan.
- **The protocol says nothing about what `verify` and `diff` mean after a
  plan's close.** The tanto-cost run met this after the fact; this run met it
  at its own close, with the instruments still being run at the closing
  boundary and reading red for reasons that are correct. The missing rule —
  when the checks stop being meaningful, and what a closing boundary should do
  with a red they cannot fix — is what a `superseded:` declaration, or an
  explicit "the plan's passages are frozen at close" statement, would supply.
