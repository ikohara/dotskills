---
id: "ce16"
title: a receiving seat trusts a sender's name, not its sessionId through the roster
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #39 of that copy.

A conductor's cross-session sender name can alternate between its spawner
name and a conversation-title name. A receiving seat should verify a sender by
`sessionId` through the roster, never by name, or it refuses its own conductor
on some days and trusts a stranger on others.

The role files verify a sender by `sessionId` only for the `fukki:` messenger
(`roles/kanri.md` "Recovery"); every other seat trusts the envelope's name,
and a Kanri whose listed name alternates (issue-07dd) makes that trust wrong
both ways. A receiving rule for every role is a decision.

Related: issue-b106 (a send to a replaced name succeeds silently),
issue-c820 (a resumed name colliding with a live peer's), issue-07dd.
