---
id: "c20f"
title: a command offered to the human with ! is PowerShell in a bash window
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-2

The shoki-seat close's two-line `Commands for the human` and its human-needed
lines named PowerShell commands (`Stop-Process -Id <pid>`), while the `!`
prefix in that window runs the command in bash, where `Stop-Process` does not
exist. The human's own attempt failed with `command not found`, and Kanri ran
it for him.

The skill's text names no shell for a command offered to the human, so there
is no sentence to correct; the rule has to be decided. A command offered for
the human to type with `!` should be bash-valid, or carry its own shell, for
instance `! powershell -Command "Stop-Process -Id <pid>"`.

Carrier: Kept — a rule for the `Commands for the human` lines of
`roles/kanri.md`; no topic in the order owns them.
