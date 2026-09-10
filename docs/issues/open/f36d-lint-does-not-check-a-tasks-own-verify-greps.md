---
id: "f36d"
title: "`lint`'s needle check covers a plan's `O` leads, not a task's own Verify greps"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Found by the tanto-sweep run's batch D report (candidate 1, 2026-09-10). A
task's own Verify step can carry a `grep` needle that a later fix wave or a
dry-run correction superseded elsewhere in the plan — the concrete instance
was O14.12, lengthened during the dry run, while task 12's step 9 Verify
grep was left quoting the needle's old, shorter form. `lint`'s
needle-in-new-text check (issue-10bc, issue-f813) covers a plan's `O` leads
against its own new-passage text, but nothing in the instrument checks a
task's **own** Verify grep against the rest of the plan it verifies — a
concrete gap, not a hypothetical one, since it was hit in this run.

No fix is proposed here. What is recorded is the shape of the gap, so the
next extension of `passage-check.js` (or a plan-authoring rule) can decide
whether a task's Verify grep is swept the same way an `O` needle is, or
whether the discipline stays "reviewer catches it" as it did this time.

Related: req-04f5, design-4807 (the instrument's checks), issue-10bc
(resolved; the old-value sweep this gap sits beside), issue-7481 (the
durable passage check), the tanto-sweep batch D report of 2026-09-10.
