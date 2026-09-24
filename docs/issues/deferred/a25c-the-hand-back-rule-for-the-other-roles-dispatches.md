---
id: "a25c"
title: "2.5's rule for the dispatches of the other roles"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-fixes S-16

The design "bg-seat-fixes" (2026-09-24) deferred this by name, in its
section 2.5 and its Deferred items. decision-e448 has every dispatch the
Jisso sends — `task.implement`, `task.escalate`, and the two task reviews —
run its commands in the foreground with a timeout, never end a turn with
work of its own running, and hand back with a status; and the Jisso answers
a notification that carries no hand-back at once, at most twice, then
`BLOCKED`.

The same rule for the other roles' dispatches — Kanri's `boundary.verify`
and `branch.review`, Keikaku's `plan.draft` and `plan.review` — was not
taken: none has been reported stalled, and each takes the rule when one is.

Deferred rather than open because nothing acts on it until a stall of one
of those dispatches is reported; that report is what reopens it.
