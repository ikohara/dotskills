---
id: "f697"
title: no seat holds a channel to an executor outside the Claude sessions during the spec stage
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-15-tanto-kanri-directed-executor-before-jisso

In the spec stage, a fact the design needs from a tree no Claude session can
read should be obtained by some seat of the skill without the conductor doing
the work itself. There is no such seat.

Measured by the reporter, in a workspace whose implementation tree is
NDA-guarded and whose implementer is an external executor — a non-Claude coding
agent reached over an agent-bridge channel. The pre-spec diagnosis (a
crash-dump analysis) and, later, that executor's rotation after a halt were
both run by **Kanri**: it posted the tasks on the channel, read the findings,
ruled on them, and drafted the successor's kickoff. No Jisso existed yet
because no plan existed; a Kaiseki cannot read that tree either; and the skill
has no "director of an executor outside the Claude sessions" for the spec
stage.

Measured cost: nine channel exchanges and their readings in the conductor's own
context before the first batch prompt, with the conductor reaching 520000
tokens by the first boundary — over its ceiling.

Two directions, and choosing between them is a seat-design decision: let Sekkei
run executor lookups over the channel during the spec stage under a standing
grant, or name a light seat — a Hosa-like one on a cheaper family — that holds
the channel before Jisso exists and hands the findings over as files.

Alongside issue-9627 (a pre-spec act has no closure mark in the ledger), from
the same run.
