---
id: "62dd"
title: the triage instrument and the by-finder counter are repository scripts, and wiring either into the close waits for two or three closes' data
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-03
updated: 2026-10-03
---

## Context

decision-eda7 calls for an instrument that reads git evidence for every issue
(`scripts/issue-liveness.js`) and a counter of issues filed per topic, by
finder (`scripts/issues-by-finder.js`). The 2026-10-01 Kikaku decision on the
topics after `experience-layer` left where the scripts live to Sekkei. Where
they live sets the regime that edits them: a script under `skills/` makes
every plan that touches it a skill-editing plan. Decided in the
`tanto-issue-triage` design of 2026-10-02.

## Options

- **Ship the instrument under `skills/tanto/scripts/` and wire the close's
  recommend dispatch to it now.** Rejected: it would put a skill-editing
  plan's regime on a tool that has never run in production.
- **kisou's `scripts/`.** Deferred: no other repository has asked for it.
- **The repository's own `scripts/`** (chosen).

## Decision

Both scripts live under the repository's `scripts/` and are run by hand at a
close, as the `exp-` count of the experience-layer exit criterion is run
today. Nothing under `skills/` changes for them. Wiring either into the
close — the recommender reading a liveness table at every close, or a
pre-commit check that an issue's quoted text still exists — waits until two
or three closes have run them by hand.

## Consequences

- The scripts can change without a skill plan's regime.
- The wiring is deferred with a stated condition; issue-de42 carries it.
- Shipping the instrument through kisou stays deferred until another
  repository asks.

## Sources

- [62dd] 「よい」 (spec dialogue Q-4, 2026-10-02)
