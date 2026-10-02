---
id: "4d8a"
title: nothing checks that a role file's own internal cross-references are resolved, so one region can promise what another does not deliver
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: session 2026-09-13

Found by the tanto-cost run's batch C (2026-09-13), recorded in
`.tanto/tanto-cost/batch-C-report.md`, "Shoroku candidates". The concrete
instances this run hit are issue-7ba4 (the slot and deletion-timing
contradictions) and issue-c30e (Hosa's ungranted standing grant).

Batch C landed `roles/kanri.md` in four tasks, one region each, each
task's own passages verified against the file exactly as the plan quotes
them. All three cross-region defects above were real, and none was caught
by an instrument — each was found only by a reviewer reading for it, and
two of the three span tasks, so no single task's own review could have
seen both halves; only the batch's last review, with all four regions
landed, could read the whole file at once.

`lint` already parses a plan's blocks and could, in principle, extract what
one `P` block *promises* (a phrase like "in the line you answer its
handshake with", "slot (a)'s commit", "delete requests wait for step 7")
and check whether some other site in the same file's final text actually
delivers it — not a general prose-understanding tool, but a narrower check
for internal pointers and named mechanisms that a passage introduces or
changes and that the rest of the file must agree with.

This is a convention gap, not a tool one is obviously missing today: no
existing `passage-check.js` subcommand claims to do this, and building one
that reliably resolves "this promise, that delivery" in free prose is a
research problem, not a lint rule. What is tractable is narrower — a
drafting convention that a task introducing or changing a named
mechanism (a slot letter, a grant clause, a section this file points at)
states, in its own brief, every other site in the file that names the same
mechanism, so a reviewer checks them together rather than by chance at the
last task that happens to see the whole file.

Destination: `roles/keikaku.md`'s drafting conventions (the seat that will
own plan-writing rules under this design), or `docs/notes/tanto-consistency-checks.md`
if a machine-checkable form is found later.

Related: issue-7ba4, issue-c30e (the concrete instances), issue-a5e9 (the
sibling gap for an enumeration a `P` block changes, from the same run's
batch B).

Resolved by "docs(tanto): Keikaku's reviewer seat, dialogue rule, fixed referent, and two drafting conventions" — found by the tanto-issue-triage liveness check, 2026-10-03.
