---
id: "8349"
title: "two verbatim-brief wording defects landed by one plan's Task 8 passages, in `roles/kikaku.md` and `templates/kikaku-decision.md`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: shoroku shoroku-at-close

Both introduced by `shoroku-at-close`'s own Task 8 passages, both still on the
tree after that plan's Batch E, and both verbatim brief text — so they were
correctly left for the close's write-out rather than fixed in the commit. One
wording pass closes both.

- **`roles/kikaku.md`** says a Check-answer decision file is "read whole by
  Kanri, which writes the direction from it". Stale once a live Hosa holds the
  close: Hosa writes the direction and Kanri only relays `decision: <path>`.
  The whole-branch review's Minor 2 confirms it independently.
- **`templates/kikaku-decision.md`** says "everything not listed as
  recommended", which is ambiguous where the adjacent sentence in
  `roles/kikaku.md` is not — a reader cannot tell whether "not listed" means
  not listed in the decision file or not listed in the recommendation.

A wording gap, not a user-stated need, so no paired requirement.
