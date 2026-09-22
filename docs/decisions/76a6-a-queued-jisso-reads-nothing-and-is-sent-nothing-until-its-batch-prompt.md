---
id: "76a6"
title: a queued Jisso reads nothing and is sent nothing until its batch prompt; Kanri sends only to `live` rows
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["b909"]
created: 2026-09-18
updated: 2026-09-22
---

## Context

The rotation of decision-ea95 puts N windows on the roster at the plan's
landing, most of them waiting. req-04f5 asks that a seat which waits hold the
minimum context, so what a queued window reads, and what reaches it, had to be
decided rather than inherited from the live-peer rules.

## Options

- **Nothing until the batch prompt** — a queued window reads no plan, no spec,
  no roster, and receives no line; Kanri's sends are filtered to `live` rows.
- **A pre-read plan** — the queued seat reads the plan when it is created, so
  its first batch starts warm.
- **A `kanri-address:` broadcast to queued rows**, so a queued seat knows the
  conductor's address before it is woken.

## Decision

A queued Jisso reads nothing and is sent nothing until its batch prompt; Kanri
sends only to `live` rows (the seat-lineage decision file of 2026-09-16 §2,
with the human's own reason; I-1 §4).

The pre-read is rejected because a session's whole context is re-read at every
wake-up, so a plan read at creation is paid again at every broadcast that
reaches the window. The `kanri-address:` broadcast is rejected because the
batch prompt names Kanri itself, so a queued seat needs no earlier copy.

## Consequences

- A broadcast to the run's windows costs the waiting ones nothing, which is the
  property req-04f5 states.
- A queued window is bare in the sense the `no-role` line guards
  (decision-78e4): it holds no role text until its prompt arrives.
- The batch prompt is therefore the whole start contract for a rotating Jisso,
  and carries the setup a resume would otherwise supply.
