---
id: "f208"
title: a verification section written for a human reader defeats an exit-code reader, and the drafting rule lives in one plan's prose
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
"**A pass/fail instrument cannot reuse a section written for a human
reader.**"

"How a batch is verified" has always been read by a person, who looks at the
output and judges. The `boundary` subcommand turns the same section into an
instrument input and reads exit codes. Three of the tanto-cost plan's eight
checks are written in shapes that cannot report a failure that way:

- a `for` loop, whose exit status is that of its last iteration;
- a `printf` loop, which never fails at all;
- `diff`, which exits 1 on a class of output the plan itself rules
  acceptable.

The plan states the rule it needs — "a How a batch is verified section must be
written so that a failing check exits non-zero" — and then breaks it three
times inside that very section. A rule a plan states about itself and does not
keep is a rule in the wrong document: it belongs in the role file that governs
plan drafting (`roles/keikaku.md` once the Keikaku split lands, `roles/sekkei.md`
until then), naming the three shapes above, so that it reaches every plan
rather than the one that happened to notice.

This is the authoring half of the same problem issue-4f5c records on the
instrument side: a step that cannot fail reports clean forever, and neither
the implementer nor the reviewer can tell that outcome from a real pass.

Under contract rule 11. Because the natural home is a document not yet
written, issue-13a1's carrier problem applies: the Keikaku split (issue-3c7a)
is the plan that should pick this up.

Related: issue-4f5c, issue-3c7a, issue-13a1, issue-c841 (the fences the
instrument can see), issue-860b.
