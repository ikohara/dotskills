---
id: "0ea5"
title: "`release:` follows the form check directly, at every seat"
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["8320"]
created: 2026-09-18
updated: 2026-09-22
---

## Context

decision-6930 releases a seat at its boundary rather than at the close, which
leaves one question open: which step of the exit the `release:` line follows.
I-1 §2 settled the timing in principle; the landed text of the close made the
exact slot a choice between the form check and the recommender.

## Options

- **Directly after the form check** — the seat is released as soon as its
  proposal is on disk and well-formed.
- **After the recommender** — the seat stays live until the close's recommend
  step has read its items, in case something has to be asked back.

## Decision

`release:` follows the form check directly, at every seat (I-1 §2, read against
the landed text; the design spec's Measured 2).

Placing the recommender first is rejected because nothing runs at an exit that
a session could be asked back for. That is the same principle decision-ace0
states for a review — the answers are the confirmation — applied to an exit:
the form check is the confirmation, and after it the seat holds nothing the
close needs.

## Consequences

- An exit never waits on the close's unbounded latency, which is what
  decision-a1ae's delegation exists to keep off Kanri's tenure as well.
- A recommender that finds a proposal item unclear resolves it from the sources
  the row points at, never by re-waking the seat.
- The rule is uniform across seats, so no role file carries its own exception.
