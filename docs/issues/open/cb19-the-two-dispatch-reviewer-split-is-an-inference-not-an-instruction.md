---
id: "cb19"
title: "the two-dispatch task-reviewer split is an inference from `roles/jisso.md`'s Models table, not an instruction anywhere"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the `tanto-project-config` run's Jisso at the Batch A boundary
(2026-09-16), in its exit shoroku proposal.

`subagent-driven-development` gives one combined task-reviewer template.
`skills/tanto/roles/jisso.md`'s Models table names `task.review-spec` and
`task.review-quality` as distinct kinds with distinct `subagent_type`s, which
reads naturally as "dispatch twice, one prompt per half of the template" —
and that is what Batch A did, successfully, across all four tasks. But no role
file says this outright. A different Jisso reading the same table could just
as plausibly dispatch one combined reviewer and pick which of the two model
entries to bill it under.

Why it is not cosmetic: the two readings give a **different review load per
task** — two opus dispatches versus one — so per-task cost and the per-batch
context figure both depend on which reading a session happens to take. Batch A
measured `341985` context read at its boundary against a `jisso` ceiling of
`205884` (about 1.66x), with the doubled review load as one of the two named
contributors; that measurement's own home is an open fork between
decision-eee2's per-batch constant and issue-7281, and is not filed yet.

Proposed fix: one sentence in `roles/jisso.md` making the two-dispatch reading
explicit, if it is the intended one. If the fix is a single paragraph there, it
may be folded into issue-0404's edit rather than landed on its own.
