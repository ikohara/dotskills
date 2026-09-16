---
id: "a449"
title: "`verify --task N` goes red once a later task's passage rewrites the same span"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the whole-branch reviewer of the `tanto-project-config` run
(2026-09-16) and carried as S-42 in that run's ledger.

`passage-check.js verify --task N` for an earlier task turns red as soon as a
later task's passage rewrites the span the earlier one landed. Measured in this
run: P7.3 appends to the last line P4.4 wrote, so `verify --task 4` was clean
at Batch A's boundary and reports `passage-absent` after Batch B — with nothing
wrong in the tree.

This is predictable before the run: the ledger's own pre-flight conflict scan
named exactly this task pair. What is missing is a sentence next to a plan's
`verify` stop condition saying so — that a passage superseded by a later task's
passage is expected to read absent, and which task pairs of this plan are in
that relation.

Not issue-7f2a's territory: that one records a **fix wave** superseding six
blocks of one plan, where the superseding edits are not themselves tasks. This
is task-on-task span overlap inside a normal run, foreseeable from the
pre-flight scan and fixable by a stop-condition sentence.

Related: issue-d0c9 (a created file is never checked against the plan again
after its own task), issue-4f5c (`verify` on a task with no passages cannot
fail).
