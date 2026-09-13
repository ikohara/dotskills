---
id: "8e51"
title: "`roles/kikaku.md` is the one dispatching role file with no stated model rule"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch D task 15 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-D-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

Every other role file that dispatches subagents states the rule "every
dispatch names a `model`; an omitted model inherits the session's, which
is the strongest family" (or this design's equivalent). `roles/kikaku.md`
mentions `model` only in its own start-up check, not as a rule governing
what it dispatches.

Not a live hole: `SKILL.md:152-156` already names Kikaku explicitly among
the sessions where an omitted model inherits the strongest family, so the
contract still binds a Kikaku session that never repeats the sentence
locally. It is a redundancy gap — every other role's own text protects
against a dispatch accidentally landing on the top family by restating the
rule where the dispatch happens, and Kikaku's does not.

Not fixable inside the tanto-cost plan: `roles/kikaku.md` is a `created:`
file whose passage has landed; adding the sentence now would be an
unquoted edit to a path `diff` already treats as fully accounted for.

Related: issue-f902, issue-c30e (the same batch's other small gaps in the
two new seats' role files).
