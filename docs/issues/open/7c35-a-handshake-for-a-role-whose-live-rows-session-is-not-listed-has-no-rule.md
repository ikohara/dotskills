---
id: "7c35"
title: a handshake for a role whose live row's session is no longer listed has no rule
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-13

A Kikaku handshake arrived under a new name and a new transcript while the
roster's live Kikaku row named a session the listing no longer showed
(`claude agents --json`, by sessionId; the editor had been restarted).
`roles/kanri.md`'s handshake paragraph refuses a second live row for a role
and says nothing about a live row whose session is gone. Kanri bridged it by
reading step 2's "the name appears in `ListAgents`" the other way round,
marked the old row `dead`, and wrote an Events line.

The missing rule, one sentence: a handshake for a role whose live row's
session is not listed marks that row `dead` and takes the handshake. It is
a lifecycle rule, so it is a decision; it sits beside issue-007e (the
census's `dead` and `cleared` rules) and issue-bdad.
