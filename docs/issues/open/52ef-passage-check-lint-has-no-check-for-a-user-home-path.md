---
id: "52ef"
title: "`passage-check.js lint` has no check for a user-home path in a plan"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-38

A user-home absolute path introduced into a plan passed `lint`, `replay`,
`boundary` and a full `plan.review` dispatch before a human-facing cold read
caught it.

Measured on `bug-report-hold`: the dry run's fix for a missing `$TANTO`
assignment hardcoded a `C:/Users/<name>/.claude/skills/tanto` path — a shape
`AGENTS.md`'s Never-do explicitly forbids committing — and the same session's
Global Constraints prose named the equivalent full Windows path twice more.
None of the four checks already run against that exact plan flagged any of
them; only Kanri's `plan.coldread` dispatch did.

The fix is a `lint` rule: flag a `C:\Users\<name>`, `/home/<name>` or
`/Users/<name>` pattern anywhere in a plan's prose or fenced blocks. That
catches it at the source, before it reaches a reviewer or a human.

issue-229c is the repository-wide half — the same pattern as a generic
pre-commit check over every tracked file. Either one alone would have caught
this instance; they cover different populations.
