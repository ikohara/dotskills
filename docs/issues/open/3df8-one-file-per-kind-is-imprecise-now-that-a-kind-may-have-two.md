---
id: "3df8"
title: "`roles/jisso.md`'s \"one file per kind\" is imprecise now that a kind may have two"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Found by the whole-branch reviewer of the `tanto-project-config` run as Minor 3
(2026-09-16) and carried as S-49 in that run's ledger.

`skills/tanto/roles/jisso.md` says the render step writes **one file per
kind**. Since this topic landed, a kind may have two: a user-scope definition
and a project-scope one that shadows it. The sentence should read "one file per
kind per scope".

Filed rather than fixed because the string lives in `skills/tanto/roles/jisso.md`,
outside the write scope of the write-out that found it.

**Not** issue-cca9. That issue is a byte-count diet of `roles/kanri.md`,
`SKILL.md` and `passage-check.js`, carried by a topic of its own — it is not a
carrier for correctness wording in another role file, and folding this in would
put a wording fix behind a size budget.

Related: issue-0404 and issue-5a2d — per-gap `jisso.md` wording issues, each
filed on its own, which is this tree's habit.
