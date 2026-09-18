---
id: "7bef"
title: "`roles/sekkei.md` Step 1 has no mechanism-first grep before the per-file change list"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-18
---

A draft spec's per-file change list is built from the decision file's own scope
list (file → sites). Nothing asks the drafter to grep the retired words first
and write the list from the hits, so a site the decision file did not name is
invisible to the drafter and to the reviewer's per-file reading alike.

Measured on `seat-lineage`: twenty-two of the spec review's twenty-eight
findings were sentences naming a retired mechanism — deletion, `orders:`, the
Jisso ceiling, the between-plans lane, "candidates" — in a file or paragraph
the change list did not name. Six of those twenty-two were **twins** of a
sentence the draft did rewrite elsewhere (`roles/hosa.md` against
`roles/kikaku.md` on "no delete request"; `templates/kanri-handover.md` against
`roles/kanri.md` on "a Jisso replacement stands deferred"; `SKILL.md`'s roles
table against `roles/kanri.md`'s opening; `roles/jisso.md` against
`roles/kanri.md` on "Replace symptom").

The fix is one sentence in `roles/sekkei.md` Step 1, before "Write the spec at
the path above": grep `SKILL.md`, `roles/`, and `templates/` for every word the
design retires, and write the per-file list from the hits. `roles/keikaku.md`
Step 3 already gives the same rule for `O` needles at plan-drafting time, so
this is that rule one stage earlier.

The lesson itself is recorded as check 21 of
`docs/notes/tanto-consistency-checks.md`; this issue carries the step, because
a role file is outside `docs/` and cannot be edited by a shoroku apply.

Related: issue-372b records the neighbouring gap (a composed skill's
prohibitions are where a per-file change list does not look).

A drafting-process gap, not a user-stated need, so no paired requirement.
