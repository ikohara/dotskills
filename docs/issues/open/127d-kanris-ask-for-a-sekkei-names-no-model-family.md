---
id: "127d"
title: Kanri's ask for a Sekkei names no model family, so a window opened on the wrong one is stopped by the model check
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-19

The `shoki-seat` Sekkei window started on opus and was stopped by the model
check, because the project `.claude/tanto.json` had set
`sessions.sekkei = fable/high` on 2026-09-24 while Kanri's ask to the human
named no family. The ask could carry `/model <family>`, read from the merged
config at that moment, so the human opens the window on the family the check
expects.

Carrier: Kept.
