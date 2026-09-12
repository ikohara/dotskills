---
id: "f2c4"
title: the topic word is the plan basename, one directory and no ledger move
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-08
updated: 2026-09-12
---

Under `tanto` a topic word names five places: the topic directory
`.superpowers/sdd/<topic>/`, the spec and plan file names
(`<date>-<topic>-design.md`, `<date>-<topic>.md`), the plan basename that
names the workspace `.superpowers/sdd/<plan-basename>/`, the branch, and the
roster's Events prose. The topic directory and the workspace differ only by
the date prefix, and the conductor ledger moves from the first to the second
when the plan is committed. At the close of the kanri-lifecycle plan on
2026-09-07 the workspace was deleted with the moved ledger inside it while
the topic directory stayed, an asymmetry that the coexistence of the two
directories did not make visible until then.

Raised by the human in the boundary-rules spec dialogue of 2026-09-07 as a
date prefix on the topic word, and deferred from that plan (its "Deferred
items", item 1) because it is a fourth item beyond the plan's scope and
would have changed the run's own workspace naming while the run used it —
the hazard issue-4ac3 names.

Proposed: make the topic word `<date>-<slug>`, the date being the day the
topic opens, name the spec `<topic>-design.md` and the plan `<topic>.md`, so
that the topic directory and the plan's workspace are one directory and the
ledger never moves; the branch takes the slug alone. Touches `SKILL.md` (the
artifacts table, the ledger-move paragraph, the exit file locations),
`roles/kanri.md` (Start step 5, When the plan lands), `roles/sekkei.md`
(Where your files go), `templates/kanri.md`, `templates/roster.md`, and the
consistency note. A plan that makes this change names, per rule 11, the
boundary from which a role may be started or replaced, and must not rename
its own workspace mid-run.

Resolved by the tanto-workspace plan (2026-09-12) — but by a different
mechanism than the one proposed here. This issue asked for a `<date>-<slug>`
topic word so that the topic directory and the plan's workspace would become
one name; what landed is a flat `.tanto/<topic>/` namespace with the **bare**
slug and no date prefix, uniqueness enforced by the existing-directory check at
Kanri's Start step 5 rather than by date-qualifying the slug (issue-59c9 notes
what that check does not cover). The underlying problem is fully resolved: one
directory per topic from the topic's opening to the plan's close, no ledger
move at landing, and the asymmetry issue-12d3 ruled on is gone. The specific
mechanism proposed here is not the one used.

Related: issue-c7e1 (Kanri derives the topic word; resolved by the
boundary-rules plan), issue-4ac3 (the skill edited in place), design-4807
(the roster and the conductor ledger), issue-59c9,
`docs/reports/2026-09-12-tanto-workspace-dogfood.md`.
