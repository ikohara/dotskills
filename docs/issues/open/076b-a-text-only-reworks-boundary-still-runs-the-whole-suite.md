---
id: "076b"
title: A text-only rework's boundary still runs the whole suite
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-100

The `boundary.verify` dispatch for run-owned-seats' `fixwave-rework-1` took
662 seconds (34 tool uses, 103,600 subagent tokens), almost all of it in the
whole-suite fence's `node --test`, for a rework whose diff under
`skills/tanto/scripts` and `skills/tanto/templates` was empty and whose five
changed files were Markdown. The fence is the plan's and the verifier was
right to run it; a rework of text-only edits still pays the full suite.

To decide: whether a boundary brief skips the suite when the rework's diff
touches no script, which would cut the dispatch to the passage-check fences.

Carrier: Kept — `templates/boundary-brief.md` and the fix-wave boundary's
fences.
