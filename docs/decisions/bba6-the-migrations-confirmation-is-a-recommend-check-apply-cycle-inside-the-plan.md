---
id: "bba6"
title: the migration's confirmation is a recommend-check-apply cycle inside the plan, with the human's answer between two batches
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

Folding the old requirement files into scenes means classifying every
sentence, and many of the resulting lines are inferred (decision-8be0), so
the human must confirm them before they land. The migration runs as a tanto
plan, whose batches otherwise need no human between them. Decided in the
`experience-layer` spec of 2026-09-30 (its D-1).

## Options

- **Sekkei re-classifies in the dialogue.** Rejected: re-classifying 443
  lines in the spec dialogue would cost the human the whole check at spec
  time, with no recommendation file to answer by exception.
- **The plan swaps the structure only**, and the human runs shoroku
  afterwards. Rejected: two directories would coexist on `main` after the
  merge, and a shoroku run outside tanto has no ledger row for its outcome.
- **A two-batch cycle**: one batch recommends, the human answers, the next
  batch applies (chosen).

## Decision

The migration's confirmation is a recommend-check-apply cycle inside the
plan: a batch writes the recommendation, the human's answer is written as a
direction file, and the next batch applies it.

## Consequences

- A batch boundary that waits for a direction file appears in a tanto plan
  for the first time, and the plan's Global Constraints name it.
- A later topic that runs the same cycle per cluster (`tanto-issue-triage`)
  reuses the shape by design.
