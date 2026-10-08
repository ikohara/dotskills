---
id: "cc4e"
title: the plan's dry run cannot see a one-line passage whose new text recurs in its file
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-47

`passage-check.js replay` and `lint` (the plan's dry run) cannot see a
one-line passage whose new text recurs in its file; only `verify`, which runs
at the task's own Step 7 and at every boundary, counts the new text over the
whole file. So the `roster-ledger` plan's one `blocks` finding (P1.24/P1.25)
passed Keikaku's dry run, the plan review, and the cold read, and was found
by a pre-flight scan subagent that ran `verify` on a scratch tree.

A dry run that also runs `verify` for each task on the replayed scratch tree
would catch the class before the plan is committed. Distinct from
issue-4f5c, which is the no-passages case.

Carrier topic: `passage-check-hardening`.
