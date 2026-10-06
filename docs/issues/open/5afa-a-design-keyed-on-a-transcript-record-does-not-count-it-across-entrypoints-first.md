---
id: "5afa"
title: a design keyed on a transcript record does not count it across entrypoints first
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-33

The run-owned-seats spec reviewer measured a fact the spike had not — a
turn taken in a VS Code tab writes no `turn_duration` record — by counting
over existing transcripts, with no session started. The design's "turn
ended" test had keyed on that record. A design that keys a rule on a
transcript record should count that record across both entrypoints
(`cli` and `claude-vscode`) before it is written.

Carrier: Kept — a design-time counting rule for `roles/sekkei.md`, no
topic's scope.
