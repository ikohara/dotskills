---
id: "edb0"
title: the wants no scene states, collected in the triage's report, await a shoroku run at the human's word
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-56

The `tanto-issue-triage` rounds collected wants that no scene in
`docs/experience/` states; they are listed in the `## Wants no scene states`
section of
[the dogfood report](../../reports/2026-10-03-tanto-issue-triage-dogfood.md).
The spec (its Deferred items, item 3) rules that they are written into
scenes by a later shoroku run at the human's word, never by that topic.

Without this issue the list sits in a frozen report and no close is
reminded of it. The gate is the human's word: a run that takes it up
proposes each want as an expectation line under `docs/experience/AGENTS.md`'s
rules, and the human confirms, corrects, or declines it.
