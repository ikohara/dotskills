---
id: "3694"
title: stale claim threshold (6 hours) is a placeholder
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-21
updated: 2026-05-21
---

`shoroku` says an issue `claimed_by` whose `claimed_at` is
older than 6 hours is stale and may be ignored by other agents. 6 hours
is the initial value, chosen without operational data.

Revisit once we have real multi-agent runs and can see what claim
durations look like in practice. Likely too long for short tasks and
too short for long-running ones — a per-issue override may be the
right answer rather than a single global threshold.
