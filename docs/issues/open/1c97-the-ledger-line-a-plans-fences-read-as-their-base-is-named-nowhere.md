---
id: "1c97"
title: the ledger line a plan's fences read as their base is named in neither the batch-prompt template nor the loop steps
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #27 of that copy.

The ledger line a plan's fences read as their base is named in neither the
batch-prompt template nor the loop steps. When the line is missing, the
boundary reads the base branch's merge as the batch's changes — a measured
misread. The loop step should name the line at each batch's start and at its
acceptance.

The repair touches the batch loop in `roles/kanri.md` and the batch-prompt
template together. issue-f94f names the two bases `roles/kanri.md` confuses,
and issue-909c the base a plan should name; neither names the ledger line the
fences read.

Related: issue-f94f, issue-909c, issue-2b5b.
