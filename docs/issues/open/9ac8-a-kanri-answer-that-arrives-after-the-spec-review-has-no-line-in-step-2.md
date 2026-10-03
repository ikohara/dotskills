---
id: "9ac8"
title: a Kanri answer that arrives after the spec review has no line in Sekkei's Step 2
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-50

The `tanto-issue-triage` spec review's finding F-6 needed a ruling from
Kanri (which of two forms reaches it through the verdict file), and the
ruling arrived as a message rather than as an `I-n`. `roles/sekkei.md`
Step 2 says "Kanri answers it itself, and the spec records the answer under
its answers to the spec inputs", and has no line for a Kanri choice that
follows the review; the spec recorded it under I-1 as a follow-up.

The proposed one-clause rule: a Kanri answer after the review is the next
`I-n`, which makes the record mechanical. This is a third shape of the gap
that issue-e2b7 (an `I-n` mid-batch) and issue-1f2b (a post-review scope
change) are deciding, so it joins them as its own case.
