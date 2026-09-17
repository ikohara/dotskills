---
id: "ec70"
title: an agent's completion notice is not evidence its work landed
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-17
---

Observed during the tanto-sweep run (2026-09-10), Jisso's seat, task 3's
second fix round. The round returned a completion notice whose entire
content was that verification was "running in the background" and would
continue. Read alone, the notice looked like a finished handoff. The work
was in fact in the tree, correct, and **uncommitted** — only `git status`
and `git log` distinguished the two, and the round recovered and committed
once nudged. Had the notice been taken at face value, a task that had
actually finished correctly would have been reported as still pending, or
worse, treated as done while nothing had landed.

The rule for the seat dispatching an implementer: an agent's completion
notice is not evidence its work landed — check the tree before treating a
task as reported. This is cheap (`git status`, `git log -1`) and it is the
only thing that separates "done" from "stopped early" at the moment the
notice arrives.

Related: req-04f5, design-4807 (Jisso's dispatch and boundary conventions),
the T2 shoroku proposal of 2026-09-10 (Part A item 5).

**Resolved 2026-09-17.** `skills/tanto/SKILL.md` states the rule for every
dispatch — "The dispatcher verifies the file, not the reply" — and
`roles/kanri.md`'s commit verification (a clean `git status`, the diff's paths, the
lint) is the commit case of it. design-4807 records the fix-round case this issue
cited.
