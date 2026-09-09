---
id: "88d3"
title: a dry run that applies passages then runs the Verify steps cannot test a claim an anchor step makes about its post-edit value
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Found by the context-cost plan review (2026-09-09). Sekkei's dry run applies
every passage of a plan to scratch copies and then runs each verification
command against them, which is what caught six plan-side defects in that plan
(a check whose old text is a prefix of the new, an expectation off by one, a
needle that drifted from its passage). But an **anchor** step runs before its
edit by construction — it pins the anchor's presence at `1` on the unedited
file — and a passage plan's anchor steps also state what the same check
returns after the edit: `0` when the new passage supersedes the whole needle,
`1` when the needle is the passage's unchanged opening. The dry run never
re-runs an anchor block after its edit, so a wrong post-edit claim is
invisible to it. The plan review found seventeen such claims in the
context-cost plan by replaying the edits from the plan's fenced blocks in its
own sandbox — a class the dry run could not see.

The remedy is one more pass in the dry run: after each passage is applied,
re-run its anchor block and compare the result with the post-edit value the
step states, and report the mismatches with the other findings. It belongs in
Sekkei's Step 4 (the dry run) and in the application script the dry run
already writes; the reviewer's replay then confirms rather than discovers.

Related: req-04f5, issue-7d14 (the dry run as one record), design-4807 (the
anchor-shape rule), docs/notes/tanto-consistency-checks.md.
