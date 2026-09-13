---
id: "f902"
title: "`roles/kikaku.md` contradicts its own write scope — \"only under `.tanto/kikaku/`\" and then two required writes elsewhere"
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

`skills/tanto/roles/kikaku.md:30` says Kikaku writes "only under
`.tanto/kikaku/`, and never under `docs/`". Lines 35-40 of the same file
then tell it to create `.tanto/.gitignore` and
`.tanto/.markdownlint-cli2.yaml` when absent — paths under `.tanto/` but
not under `.tanto/kikaku/`. `SKILL.md:596` names three owners of those two
files, and Kikaku is not among them.

Two ways to close it, and Kanri did not choose between them because both
touch files this plan has already finished and passage-pinned
(`roles/kikaku.md` itself, and `SKILL.md:596`, which would need widening to
name a fourth owner): drop lines 35-40 and accept that Kikaku depends on a
live Kanri (or another role) having already created the two files; or widen
`:30`'s write-scope claim to name the two exceptions explicitly, matching
every other role's own "write each only when absent, never overwritten"
sentence for the same two files.

Operational harm is near zero today — both files are gitignored scratch,
their creation is idempotent, and the batch D report notes this explicitly
— but the role file disagrees with itself about what it may touch, in
prose if not in behavior.

Related: issue-c30e (a different kind of gap in the same batch's new role
files — a promised grant that is never stated), issue-4d8a (nothing checks
a role file's own internal claims against itself).
