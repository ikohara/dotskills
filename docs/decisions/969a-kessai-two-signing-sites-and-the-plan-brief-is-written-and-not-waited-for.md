---
id: "969a"
title: kessai has two signing sites, and the plan brief is written and not waited for
status: accepted
supersedes: []
superseded_by: null
amends: ["ace0", "1f5f"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

The tanto-bg-seats design makes the run unattended between the spec's kessai
and the close's kessai, so the places the human signs had to be counted
rather than assumed. The data was already in: across the runs that preceded
this design, the plan brief drew five reviews, zero edits, and one explicit
decision. The human reads it and, almost always, the plan's own
`— If unanswered:` clauses turn out to be the answers. The spec review is
different in kind: it decides things, and what it decides stays decided.

The close needed the same treatment. It had been a sequence of separate
asks — the recommendation, then the merge decision, then the merge's form —
each with its own latency, and each landing in a window the human may not be
watching.

## Options

- **Two signing sites: the spec dialogue with its kessai, and the close
  kessai as one question.** The close's question carries the recommendation,
  the merge decision, and the merge's default form together, answered by
  exception. The plan brief is written for the human to read and is not
  waited for.
- **Apply first and review at the merge.** Rejected: it moves the human's
  only look at what lands to a point where unwinding it is a revert rather
  than an edit.
- **Keep the plan brief as a gate.** Rejected on the measurement above: five
  reviews, zero edits — a gate that never closes is latency, not a check.

## Decision

Kessai has two signing sites. The first is the spec dialogue and its kessai.
The second is the close kessai: one question in Kanri's window carrying the
recommendation, the merge decision, and the merge's default form, answered by
exception. The plan brief is written for the human to read and is not waited
for; its `— If unanswered:` clauses are the plan's answers unless the human
overrides one.

**This ADR amends decision-ace0** in one part: its confirmation clause for
the **plan** brief. The human's answers are no longer waited for on a plan
brief — the defaults are the answers, and an override arrives in Kanri's
window or in a decision file. The rest of ace0 stands on its own recorded
reasoning: the brief written by a read-only third party, its form and its
language, and — for a **spec** brief — the human's answers to its points as
the confirmation the review asks for.

**It amends decision-1f5f** in one part: its first preservation point, the
human's approval of the plan the run executes. That approval is no longer a
point the run waits on; the spec's kessai and the close's kessai are the two
points where the human signs. The rest of 1f5f stands: its propose-and-apply
split through files, its second preservation point, and its rejection, on the
one-boss rule, of an executor that answers to the human directly.

decision-a1ae is superseded by decision-26fd, not by this record.

## Consequences

- The run is unattended between the two kessai, which is the property the
  bg-seats design exists to deliver.
- A human who wants to steer a plan still can, by answering a brief point or
  writing a decision file; what changes is that silence no longer stops the
  run.
- The close is one interrupt rather than three, at the cost that its single
  question carries more; the recommendation's grouping is what keeps it
  readable.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20 (D-6, S-5).
