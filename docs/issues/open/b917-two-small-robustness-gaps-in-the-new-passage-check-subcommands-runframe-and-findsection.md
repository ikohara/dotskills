---
id: "b917"
title: "two small robustness gaps in the new `passage-check.js` subcommands: `runFrame` doesn't validate `--task`, and `findSection` silently returns only the first of two same-named headings"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: session 2026-09-14

Found by the tanto-cost whole-branch review (2026-09-14).

**`runFrame` doesn't validate `--task`.** `runVerify` guards its `--task`
argument with `Number.isInteger` and reports a clear error on a bad value;
`runFrame` does not, so `--task abc` reports `no such task in the plan: NaN`
instead of naming the actual problem (a non-numeric argument). Cosmetic,
one line — copy `runVerify`'s guard.

**`findSection` returns the first match only, undocumented.** A document
with two headings sharing the same text — this repository's own tanto
reports repeat a heading like `Evidence` per section — silently returns
only the first one's body when read by name. Not tested, not mentioned in
the function's doc comment. Worth one sentence noting the behavior
(first-match, not all-matches) so a future report author knows why
`sections --file report.md Evidence` only shows the first section's
worth, and a future maintainer knows changing this is a behavior change,
not a bug fix.

Neither is urgent enough for the whole-branch review's one fix wave — both
are small robustness/documentation gaps in genuinely new code (batch A's
`sections` and `frame` subcommands), not active defects shipping wrong
information the way the fix wave's six items were.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
