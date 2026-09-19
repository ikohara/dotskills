---
id: "a5a3"
title: "the batch-report template's Ceiling slot does not admit the `unavailable` value Jisso is told to write"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: shoroku tanto-context-ceiling

Found at the `tanto-context-ceiling` run's T2 (2026-09-14) — a
template/role-file disagreement this run created and did not fix.

`skills/tanto/templates/batch-report.md`'s Ceiling slot (line 8) offers only
`context=<n> <under|over>` as its placeholder. `skills/tanto/roles/jisso.md`
(lines 61-62) prescribes writing `unavailable` in that same slot when the
script prints no ceiling line. A report following the role file therefore
writes a value the template's own placeholder does not describe.

The fix is a one-clause widening of the slot's placeholder description so it
admits `unavailable` beside the `context=<n> <under|over>` form. Same shape as
issue-f5d8 and issue-4d8a: a template and a role file stating the same slot
differently, with nothing that checks the pair.

Related: req-04f5, decision-eee2, issue-f5d8, issue-4d8a.
