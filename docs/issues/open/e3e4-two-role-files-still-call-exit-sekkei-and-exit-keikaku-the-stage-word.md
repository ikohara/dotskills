---
id: "e3e4"
title: "`roles/sekkei.md` and `roles/keikaku.md` still call `exit-sekkei` / `exit-keikaku` the stage word, deliberately, where four other files now say it is a file name"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

A deliberate, documented inconsistency left by `shoroku-at-close` (its plan's
Open point 8): no passage and no needle covered the two role-file sites, to
keep that plan's sweep inside its own scope.

- `roles/sekkei.md` — `exit-sekkei` described as the stage word.
- `roles/keikaku.md` — `exit-keikaku` described as the stage word.

Meanwhile `SKILL.md`, `roles/kanri.md`, `templates/kanri.md` and
`templates/roster.md` all now say that `exit-<role>` names a proposal file and
is never a Stage value, the Stage being `t2` for every row.

The carrier is `tanto-diet`, which rewrites the role text for length and whose
Sekkei reads open issues at its start. issue-cca9 is that diet's own subject;
this is the separate site list it should pick up while it is in those two files.

A wording gap, not a user-stated need, so no paired requirement.
