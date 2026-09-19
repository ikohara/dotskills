---
id: "d82b"
title: per-role override inside tanto.json subagents
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-19
---

Source: shoroku tanto

`tanto.json` keys subagents by task kind (`implementer`, `reviewer`,
`drafter`, `escalation`, `default`) because kinds recur across roles
(decision-9a3a). A per-role override, such as a different reviewer family for
Kanri's whole-branch review than for Sekkei's spec review, is not designed.

Deferred until a real case appears. The likely shape is a nested
`subagents.<role>.<kind>` that wins over `subagents.<kind>`; it would be a
design update plus a change to the overlay rule the skill states.
