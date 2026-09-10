---
id: "88d3"
title: a dry run that applies passages then runs the Verify steps cannot test a claim an anchor step makes about its post-edit value
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
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

A second check for the same pass, from the context-cost run's count defects
(six "replace exactly these N lines" leads off by one, and a batch report's
"the seven that follow" for a six-line block): the parser that extracts a
replacement's old block already knows its line count, so it compares that
count with the lead's N and reports the difference. No command consumes those
numbers today, which is why a 72/72 dry run passed them; a parser that reads
them makes the prose a check. Both passes belong in the passage script
issue-7481 proposes.

Related: req-04f5, issue-7d14 (the dry run as one record), issue-7481,
design-4807 (the anchor-shape rule), docs/notes/tanto-consistency-checks.md.

Resolved by the tanto-sweep plan's tasks 1 to 3's `passage-check.js`:
`replay` re-runs every anchor against the applied copy and compares it with
the stated `after:` value — the pass a dry run that only applies and then
verifies can never take — and `lint` checks every lead's `N` against its
block's real line count, closing the second check this issue asked for.
Task 6 rewrites Sekkei's Step 4 to run `lint` and `replay` in place of the
scratchpad script, and task 4 updates the governing note to match.
