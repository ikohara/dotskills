---
id: "4f5c"
title: "`passage-check verify` on a task with no passage blocks exits 0 and cannot fail, so a whole-file task's Verify step named on it is a no-op"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: shoroku kisou-refresh

`node skills/tanto/scripts/passage-check.js verify --task <N>` prints
`task N: no passages` and exits **0** for a task that carries no passage
blocks (measured 2026-09-11 at the kisou-refresh spec review). The zero is not
a judgment about the task; it is the absence of anything to judge, reported in
the same shape as a pass.

The consequence shows up in plan authoring. A plan that names `verify` as the
Verify step of a **whole-file** task — a task described by the tests it makes
pass or the files it creates, not by passages — has written a step that cannot
fail. It will report clean on a task whose work was never done, and neither
the implementer nor the reviewer has any way to tell that outcome from a real
verification. The kisou-refresh plan worked around it by giving each such task
its own test command or a content grep as the Verify step instead, which means
the workaround currently lives in one plan author's head.

What is missing is one of two things, and either would do:

- `verify` exits **non-zero**, with a code distinct from a real verification
  failure, on a task with no passages — so a plan that leans on it fails loudly
  at the first run rather than silently forever; or
- `roles/sekkei.md`'s block grammar states that a whole-file task's Verify step
  is never `verify`, so the shape is ruled out where plans are written.

Belongs to a plan editing `skills/tanto/` under contract rule 11.
