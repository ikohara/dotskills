---
id: "de42"
title: wiring the issue-liveness instrument into the close, after two or three closes have run it by hand
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-56

decision-62dd placed the instrument (`scripts/issue-liveness.js`) and the
counter (`scripts/issues-by-finder.js`) in the repository's `scripts/` and
deferred wiring either into the close until two or three closes' data
exist. This issue carries that follow-up.

The two forms the `tanto-issue-triage` spec names (its Deferred items, item
1): the recommender reads a liveness table at every close, or a pre-commit
check confirms that an issue's quoted text still exists. Condition: two or
three closes have run the instrument by hand. Decision at the end: which
form, if either, and whether the instrument then moves into the skill.
