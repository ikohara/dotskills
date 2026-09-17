---
id: "5ec7"
title: Kanri's proposal is written at every plan close, before the recommender; there is no between-plans write-out
status: accepted
supersedes: []
superseded_by: null
amends: ["b6cb"]
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

decision-b6cb makes the plan close Kanri's ordinary handover, and the
`shoroku-at-close` design added a second lane: a between-plans write-out for
the items a Kanri raised with no ledger open. That lane costs the human a
second check per close, which is exactly what decision-7e0d's one-check-per-
topic rule exists to prevent.

## Options

- **One write-out per close, Kanri's proposal written before the recommender
  runs** — the close is the only moment items leave the ledger.
- **Keep the between-plans lane** — Kanri writes out its own items when no
  ledger is open, on its own occasion.

## Decision

Kanri's proposal is written at every plan close, before the recommender; there
is no between-plans write-out (the seat-lineage design spec of 2026-09-17,
Q2 = (A)). The between-plans lane is rejected: it is a second human check per
close, against the standing rule that the check runs once per topic.

**This ADR amends decision-b6cb.** In b6cb, "the peers' deletion" and "deletes
the old session" become **releases** — a window is `/clear`ed and reused, not
closed — and its "one session creation and one deletion per plan" becomes one
create request at the plan's landing and one `release:` per seat. The rest of
b6cb stands on its own recorded reasoning: the close remains the ordinary
handover trigger, without a threshold and without asking.

## Consequences

- Kanri's own in-plan exit keeps writing `pending` rows rather than running a
  stage, and those rows wait for the topic's close.
- The human's shoroku check stays once per topic.
- A Kanri that retires between plans hands its items to the next topic's
  ledger rather than to a lane of its own.
