---
id: "8af8"
title: the transcript reading's wake-up count may be off by one under its substring test
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Deferred by the context-cost design (2026-09-09, its Deferred items). The
transcript reading tanto's sessions take counts wake-ups as the `type: user`
records whose line carries no `tool_result`, with `grep` over the JSONL file.
The test is a substring of the line, not a parse: a user record whose own
text happens to contain the string `tool_result`, or a record whose shape the
harness changes, can move the count by one. Measured on 2026-09-09: on the
8.6 MB kanri-lifecycle transcript the grep reading and a JSON parse agreed
exactly (618 user records, 534 tool results, 84 wake-ups, 1 compaction); on
six shorter transcripts they agreed within one.

The design kept the grep on purpose: the reading is meant to be portable with
`wc`, `grep`, and `echo` only, and a JSON parse would add a tool the skill
does not assume (`uv run --no-project python`, or `jq`). The figures are
compared across sessions with each other, never against a token count, so a
one-off error does not change what they are for.

Take it up if a threshold is ever read from the wake-up figure with a margin
finer than one, or if the harness's record shape changes so that the
substring test drifts further; the remedy is a parse behind the same
`transcript:` line, with the grep kept as the fallback.

Related: req-04f5, issue-e5a2, issue-40ed, design-4807.
