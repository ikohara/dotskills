---
id: "0ea9"
title: a recommendation's prose obligation has no line in the direction file
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

The T2 apply surfaced a loose end its own direction never named. The
recommendation flagged the spec's Deferred item 2 ("a second project layer",
`low`) as T2's own job alongside Deferred item 1 — but item 2 was never one
of the 22 proposal items, so the direction never ruled on it and the apply
correctly left it unfiled rather than guessing.

A recommendation that names a T2 obligation *outside* its own numbered list
has no mechanism to make sure that obligation is actually acted on — it is
easy to read the recommendation, act on its 22 items, and miss the sentence
about item 2 entirely (as very nearly happened here).

Worth a rule: a recommendation's own prose obligations, not just its
numbered items, get their own explicit line in the direction file, adopt or
defer by name.

Scope: the recommend/apply contract in `skills/shoroku/SKILL.md`, and
tanto's brief and direction templates. Severity is medium because the
missing rule can silently drop work.
