---
id: "39a2"
title: Questions for the human are limited to the stop classes, so a plan with sittings has no channel for a status line
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-46

`templates/batch-report.md` and `roles/jisso.md` restrict a report's
Questions for the human to the four stop classes and a scope or spec
change. A plan shaped like decision-bba6 — one that runs a recommend,
answer, apply cycle with sittings inside it — has no named channel for a
sitting's status line, so each such plan spends an `I-n` to make one.

The proposed sentence lets a plan's Global Constraints add an item kind to
Questions for the human. That changes what Kanri forwards "exactly", which
is a contract decision rather than a text correction. Beside issue-1c4e.
