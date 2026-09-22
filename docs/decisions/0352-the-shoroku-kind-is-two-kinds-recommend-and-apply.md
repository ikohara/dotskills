---
id: "0352"
title: the shoroku kind is two kinds, shoroku.recommend on the top family and shoroku.apply on a cheaper one
status: accepted
supersedes: []
superseded_by: null
amends: ["03f9", "9a3a"]
amended_by: ["880d"]
created: 2026-09-17
updated: 2026-09-22
---

## Context

One `shoroku` kind carried one model and one effort for two halves that do
different work. The recommend half reads every source a topic's `pending` rows
name and judges each item's destination; the apply half writes the accepted
subset per the per-type `AGENTS.md`. The human weighs the recommendation's
judgment at about half the reason for a second pass, and the read that
overturned T1 item 11 on 2026-09-14 is the kind of read `fable` makes and
`opus` did not.

## Options

- **This decision** — two kinds, `shoroku.recommend` on the top family and
  `shoroku.apply` on a cheaper one.
- **Both halves on `fable`.** Rejected: the apply is a mechanical write of the
  accepted subset, one per topic and larger than today's — the wrong place for
  the top family.
- **Both on `opus`, as today.** Rejected: the human's 50% is the
  recommendation's judgment, and the read that overturned T1 item 11 is the kind
  `fable` makes.
- **An alias for the old `shoroku` key.** Rejected: a second overlay mechanism
  for one line in one start line.

## Decision

The `shoroku` kind becomes two kinds, `shoroku.recommend` and `shoroku.apply`.

This amends decision-03f9 in two parts: the twelve kinds become thirteen, and
one `shoroku` kind carrying one model and one effort becomes two kinds carrying
their own. The rest of 03f9 — the top family bought in one-shots, the resident
seats on the cheaper families, and a kind carrying a model and an effort —
stands.

It amends decision-9a3a in one clause, the sense of a skill-name key that 03f9
said `shoroku` had "exactly": a key's `<object>` is the skill and its `<act>`
the mode, so a skill with two modes has two keys. The rest of 9a3a — two maps,
`sessions` advisory and `subagents` effective, overlaid key by key on built-in
defaults — stands.

## Consequences

issue-52fd's measurement now bears on `shoroku.apply` rather than on "the apply
half of `shoroku`". The agent definitions gain two files and lose one, and the
old `shoroku` key is reported and ignored at a role's start.
