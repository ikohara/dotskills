---
id: "a1a7"
title: the Replace-table row's dangling reference, and a dropped step 6 clause
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: session 2026-09-14

Found while landing the same batch's roster/readings text (context-ceiling
task 9; see design-4807 and decision-eee2 for the mechanism these gaps are
in). Both inherited verbatim from the plan's own P9.1/P9.2 text, confirmed
not an implementer deviation.

1. The new Replace-table row's "The row above it stays" names a row that
   isn't literally the one above it any more once the new row is inserted —
   a dangling reference.
2. Step 6's rewrite sentence dropped "and from the readings the peers sent"
   even though the unedited Readings section still routes that instruction
   through step 6.

Severity low-medium: documentation-clarity gaps in the same batch's landed
text, not a runtime defect.

Resolved by "docs(tanto): fix kanri handover-deferral prose gaps (issue-1a9a, issue-a1a7)" — found by the tanto-issue-triage liveness check, 2026-10-03.
