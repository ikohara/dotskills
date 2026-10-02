---
id: "8be0"
title: inference is allowed for experience alone, tagged, and capped at SHOULD until confirmed; confirmation is the existing gate
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

The human's wants are rarely said in one sentence; they are scattered
through remarks made in passing. A layer that records only what was stated
verbatim misses most of them — the input's Scene D failure — while a layer
that lets the agent assemble wants freely can put words in the human's
mouth. Decided in the `experience-layer` spec of 2026-09-30.

## Options

- **Stated-only for every type**: nothing is assembled, and the Scene D
  failure stands.
- **A separate confirmation step** at finish, or a Kano question pair.
- **The existing gate**: `Direction?` and the direction file a caller writes
  from the human's answer (chosen).

## Decision

Experience is the one type whose fragments may be assembled from scattered
remarks. An assembled line is tagged `[inferred]`, names its basis in
Sources, and is SHOULD or SHOULD NOT at most. The human's confirmation at the
existing gate turns it `[confirmed]`; a correction makes it `[stated]`; an
unanswered line stays `[inferred]`. Design and decisions are never inferred.

## Consequences

- An `[inferred]` line can sit unconfirmed in the tree.
- A shoroku recommendation's `Unsure` group grows by the inferred items.
