---
id: "8312"
title: a declined peer replacement has no recorded state in the Replace table
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: shoroku tanto-context-ceiling

Found at the `tanto-context-ceiling` run's T2 (2026-09-14), while checking
the deferred-handover machinery's own decline state.

When a replacement condition fires for a peer — a Jisso whose reading shows a
compaction, say — Kanri puts "delete and create" to the human. A present human
may answer "continue" instead, declining the replacement. No row of
`roles/kanri.md`'s Replace table records that answer: there is no `declined`
state for a replacement the way the handover now has one, so the condition's
recorded state stays as it was and a later reader cannot tell a declined
replacement from one never put to the human.

This is the same shape as the deferred-handover decline gap the ceiling topic
closed (decision-eee2, and issue-1a9a's first gap), but it is the **peers'**
machinery, not the handover's, and it is pre-existing rather than new with
this plan. It is filed separately for that reason: it will be wanted when the
Replace table is next opened, which is a different occasion from the handover
text.

Related: req-04f5, decision-eee2, decision-6dea, issue-1a9a, issue-a1a7.
