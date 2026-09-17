---
id: "4b91"
title: "`shoroku`'s recommend mode names two inputs where `roles/kanri.md` passes three, and the callee's own rule contradicts the caller's"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-17
---

Found by the tanto-cost run's batch F task 20 reviewer (2026-09-14),
recorded in `.tanto/tanto-cost/batch-F-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

`skills/shoroku/SKILL.md`'s recommend mode documents two inputs, but
`roles/kanri.md:599` dispatches it with three — the candidate file, the
output path, and the `docs/` baseline. The governing `### File source
specifics` section, directly above the input list in `shoroku/SKILL.md`,
says "Do **not** deduplicate against existing `docs/<type>/*.md`" — so even
where the caller's third input is accounted for elsewhere, the callee's
nearest rule reads as forbidding the exact comparison the baseline exists
to make.

Not fixable inside the tanto-cost plan: `skills/shoroku/SKILL.md`'s
passage under task 20 has already landed, and `skills/shoroku/` is one of
`diff`'s three subject paths — an out-of-passage edit there is exactly the
defect the check exists for.

Related: the tanto-cost design's ADR amending decision-1f5f/decision-d831
(the recommend/apply split this task implements).

**Resolved 2026-09-17 on the `shoroku-at-close` branch.** `skills/shoroku/SKILL.md`'s
recommend mode now names the third input — "an output path, and a baseline, the
`docs/` tree an item's destination and reason are judged against" — and the File
source specifics rule now ends "in recommend mode the baseline a caller names is
what an item's destination and reason are judged against, never a filter that
drops it". That is exactly the contradiction this issue named: the caller passed
three inputs where the callee listed two, and the callee's own deduplication
prohibition read as forbidding what the caller required. Both halves landed.
