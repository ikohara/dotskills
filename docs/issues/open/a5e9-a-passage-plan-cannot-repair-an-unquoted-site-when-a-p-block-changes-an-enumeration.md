---
id: "a5e9"
title: a passage plan cannot repair a line it does not quote, so an enumeration changed by one `P` block goes stale everywhere else it is unquoted
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: session 2026-09-13

Found by the tanto-cost run's batch B (2026-09-13), recorded in
`.tanto/tanto-cost/batch-B-report.md`, "Shoroku candidates". The concrete
instance this run hit is issue-e18b.

A passage-based plan's discipline — quote every changed line, and let
`diff` treat any unquoted added line as a defect — is exactly what makes a
plan's own diff auditable. It has a blind side: when a `P` block changes an
**enumeration** (a list of statuses, roles, kinds, whatever a sentence
elsewhere in the same file restates in prose), every other, unquoted
sentence that names the same enumeration goes stale the moment the block
lands, and nothing in the plan or its instruments can see it — the plan's
own rule forbids fixing it without a second, unplanned passage, and `lint`
and `replay` have no notion of "this text restates that text."

What would catch it: a `lint` convention that, given a `P` block whose old
or new text matches an enumeration pattern (a bracketed list, an "or"-joined
noun phrase, a numbered set), sweeps the same file for other occurrences of
the old items and flags the ones the plan's own blocks do not also touch.
This does not need to be exhaustive — surfacing candidates for a human or a
reviewer to judge is enough, the way `lint`'s existing needle-in-new-text
check already surfaces a narrower class of drift.

Belongs in `roles/keikaku.md`'s drafting conventions (a plan author checks
for this before submitting a task) or as a new `lint` check; either way it
is out of the tanto-cost plan's own scope, which the spec keeps away from
`passage-check.js`'s existing four subcommands beyond the usage line.

Related: issue-e18b (the concrete instance this run's batch B hit),
issue-10bc (a plan's own sweep for old values it changes — the same shape
one level up, at plan-authoring time rather than at lint time).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
