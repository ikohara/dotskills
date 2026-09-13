---
id: "62e7"
title: "the `continue:` placeholder is spelled two ways across `SKILL.md` and `roles/kanri.md`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch C task 12 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-C-report.md`, "Parked and deferred
minors" and "Shoroku candidates".

The limit rule's resume line is spelled two ways in the two files that
state it: `continue: <the dispatch the pause named> — same model` in
`roles/kanri.md` (task 12's region) and `continue: <dispatch> — same
model` in `SKILL.md` (task 6's region). Same prefix, same intent, nothing
breaks today — but batch D's role files and batch E's templates each copy
one of the two verbatim, and a later reviewer comparing the literal strings
will read a mismatch that is not one.

Small on its own; worth naming because of the shape it can turn into. A
placeholder that lands in a **heading** rather than in prose is exactly
what `sections --file` matches exactly — this run's own batch C found a
related instance (`sections` matching "Rulings" against a template that
must spell it "Rulings **needed**"). This one is prose, not a heading, so
it is cosmetic today; the two are grouped only because both are "the same
line copied into two files, and nothing checks the copies agree."

Fix: pick one spelling (`<dispatch>` reads better, matching `SKILL.md`'s
brevity) and make the other match it, whenever a plan next touches either
file.

Related: issue-a5e9, issue-4d8a (the same "unquoted copy goes stale, and
nothing sweeps for the second site" shape, from the same run).
