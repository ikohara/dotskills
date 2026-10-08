---
id: "7ebe"
title: a review finding that rewrites a factual claim about a tool is not reproduced before the fix wave edits it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #41 of that copy.

Two reviewers measured the same tool behavior and disagreed, and the fix wave
applied the first as diagnosed, turning a correct guide sentence into a false
one. What caught it was the scoped re-review, which was allowed read-only
scratch experiments. A finding that rewrites a factual claim about a tool
could be required to be reproduced on an ordinary file before the edit.

A correct sentence turned false by the fix wave is a measured defect of the
wave's shape, which issue-96f2 names (no instrument aimed at the fix wave)
without this reproduction rule. Whether a factual finding must be reproduced
before its edit, and who runs the scratch experiment, is the decision.

Related: issue-96f2, issue-c24e.
