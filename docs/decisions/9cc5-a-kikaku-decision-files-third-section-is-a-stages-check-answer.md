---
id: "9cc5"
title: a Kikaku decision file whose third section names a stage's recommendation and answers it by exception is that stage's Check answer
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-17
updated: 2026-09-17
---

## Context

Three times on 2026-09-14 the human brought a shoroku recommendation to Kikaku,
read it there with its sources, and said 「送って」. Each time the ruling that
took the Kikaku decision file as the stage's Check answer was improvised: R-26
in `tanto-context-ceiling`, R-3 in `tanto-sweep-2`, R-3 in
`tanto-project-config`. Nothing in the skill said a decision file could be an
answer.

## Options

- **This decision** — a decision file whose third section names the
  recommendation and answers it by exception is the Check answer, relayed to the
  close's runner as one `decision: <path>` line.
- **The human's word in Kanri's window only.** Rejected: the practice is three
  measured occurrences old and the improvisation cost a ruling each time.
- **Kikaku writing the direction file itself.** Rejected: Kikaku writes under
  `.tanto/kikaku/` and nowhere else, and the direction is Kanri's file beside
  the recommendation.

## Decision

A Kikaku decision file whose third section names a stage's recommendation and
answers it by exception **is** that stage's Check answer. The close's runner
takes it as the answer and writes the direction file from it.

## Consequences

The handlings of a Kikaku decision file are four, not three, and
`templates/kikaku-decision.md`'s third section says so.
