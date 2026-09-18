---
id: "c787"
title: rows carry a seat's lineage; no proposal file rolls
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

With one Jisso per batch (decision-ea95), a topic's implementation seat is no
longer one session but a lineage of them, and each of those seats raises
shoroku items before it retires. Something has to carry the lineage's items
from a seat's boundary to the topic's single close, and the design had to pick
what that something is.

## Options

- **The ledger's `pending` rows** — each retiring seat records its items as
  `S-n` rows, which the close's recommender reads as it already does.
- **An append per Jisso boundary to `shoroku-proposal.md`** — the retiring
  session writes its items into the topic's proposal file directly.
- **A rolling Kanri file renamed at the close** — one accumulating file that
  becomes the T2 proposal when the topic ends.

## Decision

Rows carry a seat's lineage; no proposal file rolls (the seat-lineage design
spec of 2026-09-17, Q1 = (b), Q2 = (A)).

The append-per-boundary option was rejected because the same session would
write the same items twice — once in its batch report, once in the proposal —
with a form check per block. The rolling file was rejected because it adds a
rename step and a block form for a lineage the `pending` rows already hold.

## Consequences

- A retiring seat's cost at its boundary stays one line per item, as
  decision-7e0d's pointer rule already makes it.
- The close's recommender reads the `pending` rows and the sources they point
  at, unchanged by the rotation.
- The lineage is readable after the fact from the ledger alone; no second file
  has to be kept in step with it.
