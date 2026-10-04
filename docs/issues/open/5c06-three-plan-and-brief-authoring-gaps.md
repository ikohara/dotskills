---
id: "5c06"
title: three plan and brief authoring gaps — section 5's heading, Review Focus, and a batch gated after the close
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-plan-and-brief-authoring-gaps

Three observations, each checked against the skill's text. Part 3 is the
decision; parts 1 and 2 are its neighbors in the same files.

1. `templates/review-brief.md` singles out the `#` title line for a
   render-it sentence. Section 5's heading, which reads like a fixed label,
   has the same risk and no such sentence; a writer left it in English once.
   The template's general rule already covers it, so this is a risk, not a
   defect.
2. `roles/keikaku.md` Step 3's list of what the `plan.draft` dispatch names
   does not include "write no `## Review Focus`; that content belongs in
   Global Constraints", although the after-the-fact rule later in the step
   says so. A drafter following writing-plans produces the section, and
   Keikaku learns of it only at the frame read.
3. A plan placed a batch gated "after the merge, the push and the go-live".
   The close merges with `--no-ff` and pushes nothing, so the batch loop never
   reached that batch, and it ran as an unplanned follow-on. Nothing in
   `roles/keikaku.md`, `roles/sekkei.md` or Kanri's checks of the batch table
   says such a batch is outside the plan, or flags it before the first batch
   is sent.

Carrier: Kept.
