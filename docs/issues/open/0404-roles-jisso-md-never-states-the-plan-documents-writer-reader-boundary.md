---
id: "0404"
title: "`roles/jisso.md` never states the plan document's Writer/Reader boundary, so every Jisso re-derives it from `SKILL.md`'s Artifacts table"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: session 2026-09-16

Found by the `tanto-project-config` run's Jisso at the Batch A boundary
(2026-09-16), in its exit shoroku proposal.

The plan document is written by Keikaku and only read by Jisso. That boundary
is stated in `skills/tanto/SKILL.md`'s Artifacts table and nowhere in
`skills/tanto/roles/jisso.md` itself, so a Jisso that needs it has to infer it
from the table. It is load-bearing for a role that spends most of its time
reconciling exactly the passages and anchors a plan pins: the moment a plan's
own text is wrong, whether Jisso may fix it or must report it is the whole
question.

Batch A hit it twice:

- Task 1's fix round broke the plan's own `A1.2` anchor — adding
  reviewer-requested test coverage bumped a test count the anchor pins — and
  the anchor was not Jisso's to edit.
- Task 3's Artifacts-table readers-column asymmetry was likewise
  plan-mandated and not fixable without touching Keikaku's document.

Proposed fix: one sentence in `roles/jisso.md` saying the plan document is
Keikaku's to write and Jisso's to read only, with the reporting path for a
plan defect Jisso finds mid-batch.

Same shape as issue-5a2d and issue-b58d: a role file leaves a load-bearing
boundary to be re-derived from another document instead of stating it.

In tension with issue-cca9 (the role-file diet), which pushes the other way on
`roles/jisso.md`'s length — whoever takes that diet decides whether this
sentence is one of the ones worth its bytes.
