---
id: "474b"
title: "a plan's File structure fence and its own prose can assert opposite things about the same created: path, and no instrument catches it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-10-03
---

Source: shoroku tanto-sweep-2

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-13).

A plan's `File structure` fence and the plan's own prose can assert opposite
things about the same `created:` path — the fence declaring the file created,
the prose describing it as pre-existing, or the reverse. Neither `lint` nor
`replay` catches the contradiction: both forms parse, and each instrument
reads only one of the two sites, so nothing compares them against each other.

This is a distinct instrument gap from issue-c391's decorated-`created:` case.
There, one site is malformed and a lint rule can reject it on its own; here
both sites are well-formed and the defect is the disagreement between them,
which needs a cross-site comparison no current check performs. It is also
distinct from issue-d0c9, which is about a created file never being re-checked
against the plan after its own task — that compares the tree to the plan,
where this compares the plan to itself.

Candidate for `passage-check-hardening`'s eventual scope: a check that reads
the `File structure` fence's `created:` paths and asserts the plan's prose
does not contradict them.

Related: issue-c391, issue-d0c9.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
